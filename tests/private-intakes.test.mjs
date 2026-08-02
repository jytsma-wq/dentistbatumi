import assert from 'node:assert/strict'
import test from 'node:test'
import { handlePrivateIntakeRequest } from '../server/private-intakes.js'

class MemoryBucket {
  objects = new Map()

  async put(key, value, options = {}) {
    const body = typeof value === 'string'
      ? new TextEncoder().encode(value)
      : value instanceof ArrayBuffer
        ? new Uint8Array(value)
        : new Uint8Array(await new Response(value).arrayBuffer())
    this.objects.set(key, { body, ...options })
  }

  async get(key) {
    const stored = this.objects.get(key)
    if (!stored) return null
    return {
      async json() {
        return JSON.parse(new TextDecoder().decode(stored.body))
      },
    }
  }

  async delete(keys) {
    for (const key of Array.isArray(keys) ? keys : [keys]) this.objects.delete(key)
  }
}

function createRequest(kind, { origin = 'http://localhost', file = true } = {}) {
  const data = new FormData()
  data.set('name', 'Synthetic Patient')
  data.set('email', 'patient@example.com')
  data.set('country', 'NL')
  data.set('locale', 'nl')
  data.set('context', 'Automated preview test without real patient data.')
  data.set('startedAt', String(Date.now() - 2_000))
  data.set('contactConsent', 'yes')
  data.set('ownershipConsent', 'yes')
  data.set('healthConsent', 'yes')
  data.set('website', '')
  if (file) {
    data.append('files', new File([
      new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]),
    ], 'synthetic-xray.png', { type: 'image/png' }))
  }

  const endpoint = kind === 'clinical' ? 'clinical-files' : 'appointment-requests'
  return new Request(`http://localhost/api/${endpoint}`, {
    method: 'POST',
    headers: { origin, 'content-length': '2048' },
    body: data,
  })
}

test('stores and deletes a verified private clinical upload', async () => {
  const bucket = new MemoryBucket()
  const response = await handlePrivateIntakeRequest(createRequest('clinical'), bucket, 'clinical')
  assert.equal(response.status, 201)
  const receipt = await response.json()
  assert.match(receipt.reference, /^BDC-C-\d{8}-[A-F0-9]{32}$/)
  assert.equal(receipt.fileCount, 1)
  assert.equal(bucket.objects.size, 2)
  const manifestEntry = [...bucket.objects.entries()].find(([key]) => key.endsWith('/manifest.json'))
  assert.ok(manifestEntry)
  const manifest = JSON.parse(new TextDecoder().decode(manifestEntry[1].body))
  assert.equal(manifest.consent.noticeVersion, 'private-review-2026-08-02')

  const deleteResponse = await handlePrivateIntakeRequest(new Request('http://localhost/api/clinical-files', {
    method: 'DELETE',
    headers: { origin: 'http://localhost', 'content-type': 'application/json' },
    body: JSON.stringify({ reference: receipt.reference, deletionToken: receipt.deletionToken }),
  }), bucket, 'clinical')
  assert.equal(deleteResponse.status, 200)
  assert.equal(bucket.objects.size, 0)
})

test('stores an appointment request without clinical files', async () => {
  const bucket = new MemoryBucket()
  const response = await handlePrivateIntakeRequest(createRequest('appointment', { file: false }), bucket, 'appointment')
  assert.equal(response.status, 201)
  const receipt = await response.json()
  assert.match(receipt.reference, /^BDC-A-\d{8}-[A-F0-9]{32}$/)
  assert.equal(receipt.fileCount, 0)
  assert.equal(bucket.objects.size, 1)
})

test('accepts valid DICOM datasets without a Part-10 preamble', async () => {
  const datasets = [
    ['explicit-vr.dcm', new Uint8Array([
      0x08, 0x00, 0x05, 0x00, 0x43, 0x53, 0x02, 0x00, 0x45, 0x4e,
      0x08, 0x00, 0x08, 0x00, 0x43, 0x53, 0x02, 0x00, 0x4f, 0x52,
    ])],
    ['implicit-vr.dcm', new Uint8Array([
      0x08, 0x00, 0x05, 0x00, 0x02, 0x00, 0x00, 0x00, 0x45, 0x4e,
      0x08, 0x00, 0x08, 0x00, 0x02, 0x00, 0x00, 0x00, 0x4f, 0x52,
    ])],
  ]

  for (const [filename, bytes] of datasets) {
    const baseRequest = createRequest('clinical')
    const data = await baseRequest.formData()
    data.delete('files')
    data.append('files', new File([bytes], filename, { type: 'application/dicom' }))
    const bucket = new MemoryBucket()
    const response = await handlePrivateIntakeRequest(new Request('http://localhost/api/clinical-files', {
      method: 'POST',
      headers: { origin: 'http://localhost', 'content-length': '2048' },
      body: data,
    }), bucket, 'clinical')

    assert.equal(response.status, 201, filename)
    assert.ok([...bucket.objects.keys()].some((key) => key.endsWith('.dcm')), filename)
  }
})

test('rejects a truncated DICOM-like explicit VR header', async () => {
  const baseRequest = createRequest('clinical')
  const data = await baseRequest.formData()
  data.delete('files')
  data.append('files', new File([
    new Uint8Array([0x08, 0x00, 0x05, 0x00, 0x50, 0x4e, 0xff, 0xff]),
  ], 'truncated.dcm', { type: 'application/dicom' }))
  const response = await handlePrivateIntakeRequest(new Request('http://localhost/api/clinical-files', {
    method: 'POST',
    headers: { origin: 'http://localhost', 'content-length': '2048' },
    body: data,
  }), new MemoryBucket(), 'clinical')

  assert.equal(response.status, 400)
  assert.equal((await response.json()).code, 'FILE_TYPE_REJECTED')
})

test('rejects DICOM datasets with a truncated third element', async () => {
  const datasets = [
    ['truncated-third-explicit.dcm', new Uint8Array([
      0x08, 0x00, 0x05, 0x00, 0x43, 0x53, 0x02, 0x00, 0x45, 0x4e,
      0x08, 0x00, 0x08, 0x00, 0x43, 0x53, 0x02, 0x00, 0x4f, 0x52,
      0x08,
    ])],
    ['truncated-third-implicit.dcm', new Uint8Array([
      0x08, 0x00, 0x05, 0x00, 0x02, 0x00, 0x00, 0x00, 0x45, 0x4e,
      0x08, 0x00, 0x08, 0x00, 0x02, 0x00, 0x00, 0x00, 0x4f, 0x52,
      0x08,
    ])],
  ]

  for (const [filename, bytes] of datasets) {
    const baseRequest = createRequest('clinical')
    const data = await baseRequest.formData()
    data.delete('files')
    data.append('files', new File([bytes], filename, { type: 'application/dicom' }))
    const response = await handlePrivateIntakeRequest(new Request('http://localhost/api/clinical-files', {
      method: 'POST',
      headers: { origin: 'http://localhost', 'content-length': '2048' },
      body: data,
    }), new MemoryBucket(), 'clinical')

    assert.equal(response.status, 400, filename)
    assert.equal((await response.json()).code, 'FILE_TYPE_REJECTED', filename)
  }
})

test('rejects appointment context without explicit health-data consent', async () => {
  const request = createRequest('appointment', { file: false })
  const data = await request.formData()
  data.set('healthConsent', 'no')
  const response = await handlePrivateIntakeRequest(new Request('http://localhost/api/appointment-requests', {
    method: 'POST',
    headers: { origin: 'http://localhost', 'content-length': '2048' },
    body: data,
  }), new MemoryBucket(), 'appointment')

  assert.equal(response.status, 400)
  assert.equal((await response.json()).code, 'INVALID_FIELDS')
})

test('rejects renamed files, cross-origin requests and a missing bucket', async () => {
  const renamed = createRequest('clinical')
  const renamedData = await renamed.formData()
  renamedData.delete('files')
  renamedData.append('files', new File(['not an image'], 'renamed.jpg', { type: 'image/jpeg' }))
  const renamedRequest = new Request('http://localhost/api/clinical-files', {
    method: 'POST',
    headers: { origin: 'http://localhost', 'content-length': '2048' },
    body: renamedData,
  })
  const renamedResponse = await handlePrivateIntakeRequest(renamedRequest, new MemoryBucket(), 'clinical')
  assert.equal(renamedResponse.status, 400)
  assert.equal((await renamedResponse.json()).code, 'FILE_TYPE_REJECTED')

  const crossOrigin = await handlePrivateIntakeRequest(
    createRequest('appointment', { origin: 'https://untrusted.example', file: false }),
    new MemoryBucket(),
    'appointment',
  )
  assert.equal(crossOrigin.status, 403)

  const unavailable = await handlePrivateIntakeRequest(createRequest('appointment', { file: false }), null, 'appointment')
  assert.equal(unavailable.status, 503)
})
