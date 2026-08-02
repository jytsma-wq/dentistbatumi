export const privateIntakeConfig = {
  maxFiles: 5,
  maxFileBytes: 10 * 1024 * 1024,
  maxTotalBytes: 25 * 1024 * 1024,
  requestLimitBytes: 27 * 1024 * 1024,
}

const supportedLocales = new Set(['nl', 'de', 'fr', 'lb', 'en', 'ka'])
const responseHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
}

const fileTypes = {
  jpeg: { extension: 'jpg', contentType: 'image/jpeg' },
  png: { extension: 'png', contentType: 'image/png' },
  webp: { extension: 'webp', contentType: 'image/webp' },
  pdf: { extension: 'pdf', contentType: 'application/pdf' },
  dicom: { extension: 'dcm', contentType: 'application/dicom' },
}

export async function handlePrivateIntakeRequest(request, bucket, kind) {
  if (!['clinical', 'appointment'].includes(kind)) return jsonError('INVALID_REQUEST', 400)
  if (request.method === 'POST') return handlePost(request, bucket, kind)
  if (request.method === 'DELETE') return handleDelete(request, bucket, kind)
  return jsonError('METHOD_NOT_ALLOWED', 405)
}

async function handlePost(request, bucket, kind) {
  if (!isSameOrigin(request)) return jsonError('ORIGIN_REJECTED', 403)
  if (!bucket) return jsonError('SERVICE_UNAVAILABLE', 503)

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().startsWith('multipart/form-data')) {
    return jsonError('INVALID_REQUEST', 415)
  }

  const declaredLength = Number(request.headers.get('content-length'))
  if (!Number.isFinite(declaredLength) || declaredLength <= 0) {
    return jsonError('INVALID_REQUEST', 411)
  }
  if (declaredLength > privateIntakeConfig.requestLimitBytes) {
    return jsonError('TOTAL_TOO_LARGE', 413)
  }

  let data
  try {
    data = await request.formData()
  } catch {
    return jsonError('INVALID_REQUEST', 400)
  }

  if (cleanText(data.get('website'), 120)) return jsonError('INVALID_REQUEST', 400)

  const startedAt = Number(data.get('startedAt') ?? 0)
  const elapsed = Date.now() - startedAt
  if (!Number.isFinite(startedAt) || elapsed < 1_200 || elapsed > 2 * 60 * 60 * 1000) {
    return jsonError('SESSION_EXPIRED', 400)
  }

  const name = cleanText(data.get('name'), 90)
  const email = cleanText(data.get('email'), 180).toLowerCase()
  const country = cleanText(data.get('country'), 8).toUpperCase()
  const locale = cleanText(data.get('locale'), 8)
  const context = cleanText(data.get('context'), 800)
  const contactConsent = data.get('contactConsent') === 'yes'
  const ownershipConsent = data.get('ownershipConsent') === 'yes'
  const healthConsent = data.get('healthConsent') === 'yes'

  if (
    name.length < 2 ||
    !isEmail(email) ||
    !supportedLocales.has(locale) ||
    !contactConsent ||
    !healthConsent ||
    (kind === 'clinical' && !ownershipConsent)
  ) {
    return jsonError('INVALID_FIELDS', 400)
  }

  const files = data.getAll('files').filter((value) => value instanceof File && value.size > 0)
  if (kind === 'clinical' && files.length === 0) return jsonError('NO_FILE', 400)
  if (kind === 'appointment' && files.length > 0) return jsonError('INVALID_REQUEST', 400)
  if (files.length > privateIntakeConfig.maxFiles) return jsonError('TOO_MANY_FILES', 400)

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0)
  if (totalBytes > privateIntakeConfig.maxTotalBytes) return jsonError('TOTAL_TOO_LARGE', 413)

  const receivedAt = new Date()
  const reference = createReference(receivedAt, kind)
  const datePath = receivedAt.toISOString().slice(0, 10)
  const category = kind === 'clinical' ? 'clinical-intakes' : 'appointment-requests'
  const prefix = `${category}/${datePath}/${reference.toLowerCase()}`
  const deletionToken = randomToken(32)
  const deletionTokenHash = await sha256(deletionToken)
  const storedKeys = []
  const manifestFiles = []

  try {
    for (const [index, file] of files.entries()) {
      if (file.size > privateIntakeConfig.maxFileBytes) {
        throw new IntakeValidationError('FILE_TOO_LARGE')
      }

      const bytes = await file.arrayBuffer()
      const detectedKind = detectFileKind(new Uint8Array(bytes))
      if (!detectedKind) throw new IntakeValidationError('FILE_TYPE_REJECTED')

      const verified = fileTypes[detectedKind]
      const digest = await sha256(bytes)
      const objectKey = `${prefix}/file-${String(index + 1).padStart(2, '0')}.${verified.extension}`

      await bucket.put(objectKey, bytes, {
        httpMetadata: {
          contentType: verified.contentType,
          cacheControl: 'private, no-store, max-age=0',
        },
        customMetadata: {
          reference,
          classification: 'clinical-health-data',
          checksum: digest,
        },
      })

      storedKeys.push(objectKey)
      manifestFiles.push({
        objectKey,
        originalName: safeFilename(file.name),
        contentType: verified.contentType,
        size: file.size,
        sha256: digest,
      })
    }

    const reviewDeleteAfter = new Date(receivedAt.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
    const manifest = {
      version: 1,
      kind,
      reference,
      createdAt: receivedAt.toISOString(),
      reviewDeleteAfter,
      patient: { name, email, country: country || null, locale, context: context || null },
      consent: {
        noticeVersion: 'private-review-2026-08-02',
        contact: true,
        ownership: kind === 'clinical' ? true : null,
        healthData: true,
        recordedAt: receivedAt.toISOString(),
      },
      files: manifestFiles,
      deletionTokenHash,
    }

    const manifestKey = `${prefix}/manifest.json`
    await bucket.put(manifestKey, JSON.stringify(manifest), {
      httpMetadata: {
        contentType: 'application/json; charset=utf-8',
        cacheControl: 'private, no-store, max-age=0',
      },
      customMetadata: {
        reference,
        classification: kind === 'clinical' ? 'clinical-health-data' : 'appointment-health-data',
        reviewDeleteAfter,
      },
    })
    storedKeys.push(manifestKey)

    return Response.json(
      { ok: true, reference, deletionToken, fileCount: manifestFiles.length, kind },
      { status: 201, headers: responseHeaders },
    )
  } catch (error) {
    let cleanupIncomplete = false
    if (storedKeys.length) {
      try {
        await bucket.delete(storedKeys)
      } catch {
        cleanupIncomplete = true
      }
    }
    if (cleanupIncomplete) return jsonError('CLEANUP_INCOMPLETE', 500)
    if (error instanceof IntakeValidationError) return jsonError(error.code, 400)
    return jsonError('UPLOAD_FAILED', 500)
  }
}

async function handleDelete(request, bucket, kind) {
  if (!isSameOrigin(request)) return jsonError('ORIGIN_REJECTED', 403)
  if (!bucket) return jsonError('SERVICE_UNAVAILABLE', 503)

  let body
  try {
    body = await request.json()
  } catch {
    return jsonError('INVALID_REQUEST', 400)
  }

  const reference = cleanText(body.reference, 80).toUpperCase()
  const deletionToken = cleanText(body.deletionToken, 100)
  const kindLetter = kind === 'clinical' ? 'C' : 'A'
  const match = new RegExp(`^BDC-${kindLetter}-(\\d{4})(\\d{2})(\\d{2})-([A-F0-9]{32})$`).exec(reference)
  if (!match || deletionToken.length < 32) return jsonError('DELETE_FORMAT_REJECTED', 400)

  const [, year, month, day] = match
  const category = kind === 'clinical' ? 'clinical-intakes' : 'appointment-requests'
  const prefix = `${category}/${year}-${month}-${day}/${reference.toLowerCase()}`
  const manifestKey = `${prefix}/manifest.json`
  let object
  try {
    object = await bucket.get(manifestKey)
  } catch {
    return jsonError('DELETE_FAILED', 500)
  }
  if (!object) return jsonError('NOT_FOUND', 404)

  let manifest
  try {
    manifest = await object.json()
  } catch {
    return jsonError('DELETE_MANIFEST_INVALID', 422)
  }

  if (!isValidDeleteManifest(manifest, reference, prefix, kind)) {
    return jsonError('DELETE_MANIFEST_INVALID', 422)
  }

  let providedHash
  try {
    providedHash = await sha256(deletionToken)
  } catch {
    return jsonError('DELETE_FAILED', 500)
  }
  if (!constantTimeEqual(providedHash, manifest.deletionTokenHash)) {
    return jsonError('DELETE_TOKEN_REJECTED', 401)
  }

  try {
    await bucket.delete([...manifest.files.map((file) => file.objectKey), manifestKey])
  } catch {
    return jsonError('DELETE_FAILED', 500)
  }

  return Response.json({ ok: true }, { status: 200, headers: responseHeaders })
}

function isSameOrigin(request) {
  const requestUrl = new URL(request.url)
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  try {
    if (origin) return new URL(origin).origin === requestUrl.origin
    if (referer) return new URL(referer).origin === requestUrl.origin
  } catch {
    return false
  }
  return false
}

function isValidDeleteManifest(manifest, reference, prefix, kind) {
  if (
    !manifest ||
    manifest.version !== 1 ||
    manifest.kind !== kind ||
    manifest.reference !== reference ||
    typeof manifest.deletionTokenHash !== 'string' ||
    !/^[a-f0-9]{64}$/u.test(manifest.deletionTokenHash) ||
    !Array.isArray(manifest.files) ||
    manifest.files.length > privateIntakeConfig.maxFiles
  ) return false

  return manifest.files.every((file, index) => {
    if (!file || typeof file.objectKey !== 'string') return false
    const expectedStart = `${prefix}/file-${String(index + 1).padStart(2, '0')}.`
    if (!file.objectKey.startsWith(expectedStart)) return false
    return ['jpg', 'png', 'webp', 'pdf', 'dcm'].includes(file.objectKey.slice(expectedStart.length))
  })
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return ''
  return value.normalize('NFKC').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

function safeFilename(value) {
  const basename = value.split(/[\\/]/).at(-1) ?? 'clinical-file'
  return cleanText(basename, 120) || 'clinical-file'
}

function isEmail(value) {
  return value.length <= 180 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(value)
}

function detectFileKind(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg'
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  if (bytes.length >= png.length && png.every((value, index) => bytes[index] === value)) return 'png'
  if (bytes.length >= 12 && ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 12) === 'WEBP') return 'webp'
  if (bytes.length >= 5 && ascii(bytes, 0, 5) === '%PDF-') return 'pdf'
  if ((bytes.length >= 132 && ascii(bytes, 128, 132) === 'DICM') || looksLikeDicomDataset(bytes)) return 'dicom'
  return null
}

function looksLikeDicomDataset(bytes) {
  if (bytes.length < 16) return false

  const commonGroups = new Set([
    0x0002, 0x0004, 0x0008, 0x0010, 0x0012, 0x0018, 0x0020, 0x0028,
    0x0032, 0x0038, 0x0040, 0x0054, 0x0060, 0x0070, 0x3002, 0x3004,
    0x3006, 0x3008, 0x300a, 0x7fe0,
  ])
  const explicitValueRepresentations = new Set([
    'AE', 'AS', 'AT', 'CS', 'DA', 'DS', 'DT', 'FD', 'FL', 'IS', 'LO', 'LT',
    'OB', 'OD', 'OF', 'OL', 'OV', 'OW', 'PN', 'SH', 'SL', 'SQ', 'SS', 'ST',
    'SV', 'TM', 'UC', 'UI', 'UL', 'UN', 'UR', 'US', 'UT', 'UV',
  ])
  const longValueRepresentations = new Set([
    'OB', 'OD', 'OF', 'OL', 'OV', 'OW', 'SQ', 'SV', 'UC', 'UN', 'UR', 'UT', 'UV',
  ])
  const littleEndianGroup = bytes[0] | (bytes[1] << 8)
  const bigEndianGroup = (bytes[0] << 8) | bytes[1]
  const isLittleEndian = commonGroups.has(littleEndianGroup)
  const isBigEndian = !isLittleEndian && commonGroups.has(bigEndianGroup)
  if (!isLittleEndian && !isBigEndian) return false

  const readUint16 = (offset) => isLittleEndian
    ? bytes[offset] | (bytes[offset + 1] << 8)
    : (bytes[offset] << 8) | bytes[offset + 1]
  const readUint32 = (offset) => isLittleEndian
    ? (bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)) >>> 0
    : ((bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0
  const isExplicit = explicitValueRepresentations.has(ascii(bytes, 4, 6))
  let offset = 0
  let elements = 0
  let previousTag = -1

  while (offset + 8 <= bytes.length && elements < 3) {
    const group = readUint16(offset)
    const element = readUint16(offset + 2)
    const tag = group * 0x10000 + element
    if (group > 0x7fe0 || tag < previousTag) return false

    let headerBytes = 8
    let valueLength
    if (isExplicit) {
      const valueRepresentation = ascii(bytes, offset + 4, offset + 6)
      if (!explicitValueRepresentations.has(valueRepresentation)) return false
      if (longValueRepresentations.has(valueRepresentation)) {
        if (offset + 12 > bytes.length || bytes[offset + 6] !== 0 || bytes[offset + 7] !== 0) return false
        headerBytes = 12
        valueLength = readUint32(offset + 8)
      } else {
        valueLength = readUint16(offset + 6)
      }
    } else {
      valueLength = readUint32(offset + 4)
    }

    if (valueLength === 0xffffffff || valueLength % 2 !== 0) return false
    const nextOffset = offset + headerBytes + valueLength
    if (nextOffset > bytes.length || nextOffset <= offset) return false

    elements += 1
    previousTag = tag
    offset = nextOffset
  }

  return elements >= 3 || (elements === 2 && offset === bytes.length)
}

function ascii(bytes, start, end) {
  return String.fromCharCode(...bytes.slice(start, end))
}

function createReference(date, kind) {
  const datePart = date.toISOString().slice(0, 10).replaceAll('-', '')
  const randomPart = [...crypto.getRandomValues(new Uint8Array(16))]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
  return `BDC-${kind === 'clinical' ? 'C' : 'A'}-${datePart}-${randomPart}`
}

function randomToken(length) {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '')
}

async function sha256(value) {
  const data = typeof value === 'string' ? new TextEncoder().encode(value) : value
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false
  let difference = 0
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return difference === 0
}

function jsonError(code, status) {
  return Response.json({ ok: false, code }, { status, headers: responseHeaders })
}

class IntakeValidationError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}
