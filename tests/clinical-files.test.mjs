import assert from "node:assert/strict";
import test from "node:test";

class MemoryR2Bucket {
  objects = new Map();
  failDelete = false;

  async put(key, value, options = {}) {
    const body =
      typeof value === "string"
        ? new TextEncoder().encode(value)
        : value instanceof ArrayBuffer
          ? new Uint8Array(value)
          : new Uint8Array(await new Response(value).arrayBuffer());
    this.objects.set(key, {
      body,
      httpMetadata: options.httpMetadata ?? {},
      customMetadata: options.customMetadata ?? {},
    });
    return { key };
  }

  async get(key) {
    const stored = this.objects.get(key);
    if (!stored) return null;
    return {
      key,
      ...stored,
      async json() {
        return JSON.parse(new TextDecoder().decode(stored.body));
      },
    };
  }

  async delete(keys) {
    if (this.failDelete) throw new Error("synthetic-delete-failure");
    for (const key of Array.isArray(keys) ? keys : [keys]) {
      this.objects.delete(key);
    }
  }
}

async function getHandlers() {
  const routeUrl = new URL(
    "../app/api/clinical-files/route.ts",
    import.meta.url,
  );
  routeUrl.searchParams.set("clinical-test", `${process.pid}-${Date.now()}`);
  return import(routeUrl.href);
}

function validUploadRequest({
  filename = "synthetic-xray.png",
  bytes = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00,
  ]),
  additionalFiles = [],
} = {}) {
  const data = new FormData();
  data.set("name", "Synthetic Preview");
  data.set("email", "preview@example.com");
  data.set("phone", "");
  data.set("context", "Automated test; no patient data.");
  data.set("locale", "nl");
  data.set("startedAt", String(Date.now() - 2_000));
  data.set("ownershipConsent", "yes");
  data.set("healthConsent", "yes");
  data.set("website", "");
  data.append("files", new File([bytes], filename, { type: "image/png" }));
  for (const file of additionalFiles) {
    data.append(
      "files",
      new File([file.bytes], file.filename, {
        type: file.type ?? "application/octet-stream",
      }),
    );
  }

  return new Request("http://localhost/api/clinical-files", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-length": "2048",
      origin: "http://localhost",
    },
    body: data,
  });
}

test("stores a verified synthetic image privately and deletes it with the one-time receipt", async () => {
  const { handleClinicalFilesDelete, handleClinicalFilesPost } =
    await getHandlers();
  const bucket = new MemoryR2Bucket();

  const uploadResponse = await handleClinicalFilesPost(
    validUploadRequest(),
    bucket,
  );
  assert.equal(uploadResponse.status, 201);
  assert.equal(uploadResponse.headers.get("cache-control"), "no-store, max-age=0");

  const receipt = await uploadResponse.json();
  assert.equal(receipt.ok, true);
  assert.match(receipt.reference, /^MD-\d{8}-[A-F0-9]{32}$/);
  assert.equal(typeof receipt.deletionToken, "string");
  assert.ok(receipt.deletionToken.length >= 40);
  assert.equal(bucket.objects.size, 2);

  const keys = [...bucket.objects.keys()];
  assert.equal(keys.some((key) => key.includes("synthetic-xray")), false);
  assert.equal(keys.filter((key) => key.endsWith("/manifest.json")).length, 1);

  const wrongDeleteResponse = await handleClinicalFilesDelete(
    new Request("http://localhost/api/clinical-files", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        origin: "http://localhost",
      },
      body: JSON.stringify({
        reference: receipt.reference,
        deletionToken: "wrong-token-value-that-is-deliberately-long-enough",
      }),
    }),
    bucket,
  );
  assert.equal(wrongDeleteResponse.status, 401);
  assert.equal(bucket.objects.size, 2);

  const deleteResponse = await handleClinicalFilesDelete(
    new Request("http://localhost/api/clinical-files", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        origin: "http://localhost",
      },
      body: JSON.stringify({
        reference: receipt.reference,
        deletionToken: receipt.deletionToken,
      }),
    }),
    bucket,
  );
  assert.equal(deleteResponse.status, 200);
  assert.deepEqual(await deleteResponse.json(), { ok: true });
  assert.equal(bucket.objects.size, 0);
});

test("rejects a renamed non-image before storing it", async () => {
  const { handleClinicalFilesPost } = await getHandlers();
  const bucket = new MemoryR2Bucket();

  const response = await handleClinicalFilesPost(
    validUploadRequest({
      filename: "renamed-text.jpg",
      bytes: new TextEncoder().encode("not an image"),
    }),
    bucket,
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    ok: false,
    code: "FILE_TYPE_REJECTED",
  });
  assert.equal(bucket.objects.size, 0);
});

test("fails closed for cross-origin requests and a missing private bucket", async () => {
  const { handleClinicalFilesPost } = await getHandlers();
  const bucket = new MemoryR2Bucket();
  const crossOriginRequest = validUploadRequest();
  crossOriginRequest.headers.set("origin", "https://untrusted.example");
  crossOriginRequest.headers.set(
    "referer",
    "http://localhost/nl/upload",
  );

  const crossOriginResponse = await handleClinicalFilesPost(
    crossOriginRequest,
    bucket,
  );
  assert.equal(crossOriginResponse.status, 403);
  assert.equal(bucket.objects.size, 0);

  const missingBindingResponse = await handleClinicalFilesPost(
    validUploadRequest(),
    null,
  );
  assert.equal(missingBindingResponse.status, 503);
});

test("reports incomplete cleanup instead of claiming a clean validation failure", async () => {
  const { handleClinicalFilesPost } = await getHandlers();
  const bucket = new MemoryR2Bucket();
  bucket.failDelete = true;

  const response = await handleClinicalFilesPost(
    validUploadRequest({
      additionalFiles: [
        {
          filename: "renamed-text.jpg",
          bytes: new TextEncoder().encode("not an image"),
          type: "image/jpeg",
        },
      ],
    }),
    bucket,
  );

  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), {
    ok: false,
    code: "CLEANUP_INCOMPLETE",
  });
  assert.equal(bucket.objects.size, 1);
});

test("rejects a damaged manifest before deleting any out-of-prefix object", async () => {
  const { handleClinicalFilesDelete, handleClinicalFilesPost } =
    await getHandlers();
  const bucket = new MemoryR2Bucket();
  const uploadResponse = await handleClinicalFilesPost(
    validUploadRequest(),
    bucket,
  );
  const receipt = await uploadResponse.json();
  const manifestKey = [...bucket.objects.keys()].find((key) =>
    key.endsWith("/manifest.json"),
  );
  const manifestObject = bucket.objects.get(manifestKey);
  const manifest = JSON.parse(new TextDecoder().decode(manifestObject.body));
  const outsideKey = "clinical-intakes/other-reference/file-01.png";
  await bucket.put(
    outsideKey,
    new Uint8Array([0x89, 0x50, 0x4e, 0x47]),
  );
  manifest.files[0].objectKey = outsideKey;
  await bucket.put(manifestKey, JSON.stringify(manifest));

  const response = await handleClinicalFilesDelete(
    new Request("http://localhost/api/clinical-files", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        origin: "http://localhost",
      },
      body: JSON.stringify({
        reference: receipt.reference,
        deletionToken: receipt.deletionToken,
      }),
    }),
    bucket,
  );

  assert.equal(response.status, 422);
  assert.equal(bucket.objects.has(outsideKey), true);
});
