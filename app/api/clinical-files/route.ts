import { isLocale } from "../../locales.ts";
import {
  clinicalFileTypes,
  clinicalUploadConfig,
  type ClinicalFileKind,
} from "../../upload-config.ts";

type UploadManifest = {
  version: 1;
  reference: string;
  createdAt: string;
  reviewDeleteAfter: string;
  patient: {
    name: string;
    email: string;
    phone: string | null;
    locale: string;
    context: string | null;
  };
  consent: {
    ownershipConfirmed: true;
    healthDataProcessing: true;
    recordedAt: string;
  };
  files: {
    objectKey: string;
    originalName: string;
    contentType: string;
    size: number;
    sha256: string;
  }[];
  deletionTokenHash: string;
};

type UploadBinding = {
  CLINICAL_UPLOADS?: R2Bucket;
};

const responseHeaders = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

export async function POST(request: Request) {
  return handleClinicalFilesPost(request, await getUploadBucket());
}

export async function handleClinicalFilesPost(
  request: Request,
  bucket: R2Bucket | null,
) {
  if (!isSameOrigin(request)) {
    return jsonError("ORIGIN_REJECTED", 403);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
    return jsonError("INVALID_REQUEST", 415);
  }

  const declaredLengthHeader = request.headers.get("content-length");
  const declaredLength = Number(declaredLengthHeader);
  if (
    !declaredLengthHeader ||
    (Number.isFinite(declaredLength) && declaredLength <= 0)
  ) {
    return jsonError("INVALID_REQUEST", 411);
  }
  if (
    !Number.isFinite(declaredLength) ||
    declaredLength > clinicalUploadConfig.requestLimitBytes
  ) {
    return jsonError("TOTAL_TOO_LARGE", 413);
  }

  if (!bucket) {
    return jsonError("SERVICE_UNAVAILABLE", 503);
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return jsonError("INVALID_REQUEST", 400);
  }

  if (cleanText(data.get("website"), 120)) {
    return jsonError("INVALID_REQUEST", 400);
  }

  const startedAt = Number(data.get("startedAt") ?? 0);
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < 1_500 || elapsed > 2 * 60 * 60 * 1_000) {
    return jsonError("SESSION_EXPIRED", 400);
  }

  const name = cleanText(data.get("name"), 90);
  const email = cleanText(data.get("email"), 180).toLowerCase();
  const phone = cleanText(data.get("phone"), 42);
  const context = cleanText(data.get("context"), 600);
  const locale = cleanText(data.get("locale"), 8);
  const ownershipConsent = data.get("ownershipConsent") === "yes";
  const healthConsent = data.get("healthConsent") === "yes";

  if (
    name.length < 2 ||
    !isEmail(email) ||
    (phone && phone.length < 5) ||
    !isLocale(locale) ||
    !ownershipConsent ||
    !healthConsent
  ) {
    return jsonError("INVALID_FIELDS", 400);
  }

  const files = data
    .getAll("files")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (!files.length) {
    return jsonError("NO_FILE", 400);
  }
  if (files.length > clinicalUploadConfig.maxFiles) {
    return jsonError("TOO_MANY_FILES", 400);
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > clinicalUploadConfig.maxTotalBytes) {
    return jsonError("TOTAL_TOO_LARGE", 413);
  }

  const receivedAt = new Date();
  const reference = createReference(receivedAt);
  const referenceSlug = reference.toLowerCase();
  const datePath = receivedAt.toISOString().slice(0, 10);
  const prefix = `clinical-intakes/${datePath}/${referenceSlug}`;
  const deletionToken = randomToken(32);
  const deletionTokenHash = await sha256(deletionToken);
  const storedKeys: string[] = [];
  const manifestFiles: UploadManifest["files"] = [];

  try {
    for (const [index, file] of files.entries()) {
      if (file.size > clinicalUploadConfig.maxFileBytes) {
        throw new UploadValidationError("FILE_TOO_LARGE");
      }

      const bytes = await file.arrayBuffer();
      const kind = detectFileKind(new Uint8Array(bytes));
      if (!kind) {
        throw new UploadValidationError("FILE_TYPE_REJECTED");
      }

      const verified = clinicalFileTypes[kind];
      const digest = await sha256(bytes);
      const objectKey = `${prefix}/file-${String(index + 1).padStart(2, "0")}.${verified.extension}`;

      await bucket.put(objectKey, bytes, {
        httpMetadata: {
          contentType: verified.contentType,
          cacheControl: "private, no-store, max-age=0",
        },
        customMetadata: {
          reference,
          classification: "clinical-health-data",
          checksum: digest,
        },
      });

      storedKeys.push(objectKey);
      manifestFiles.push({
        objectKey,
        originalName: safeFilename(file.name),
        contentType: verified.contentType,
        size: file.size,
        sha256: digest,
      });
    }

    const reviewDeleteAfter = new Date(
      receivedAt.getTime() + 30 * 24 * 60 * 60 * 1_000,
    ).toISOString();
    const manifest: UploadManifest = {
      version: 1,
      reference,
      createdAt: receivedAt.toISOString(),
      reviewDeleteAfter,
      patient: {
        name,
        email,
        phone: phone || null,
        locale,
        context: context || null,
      },
      consent: {
        ownershipConfirmed: true,
        healthDataProcessing: true,
        recordedAt: receivedAt.toISOString(),
      },
      files: manifestFiles,
      deletionTokenHash,
    };

    const manifestKey = `${prefix}/manifest.json`;
    await bucket.put(manifestKey, JSON.stringify(manifest), {
      httpMetadata: {
        contentType: "application/json; charset=utf-8",
        cacheControl: "private, no-store, max-age=0",
      },
      customMetadata: {
        reference,
        classification: "clinical-health-data",
        reviewDeleteAfter,
      },
    });
    storedKeys.push(manifestKey);

    return Response.json(
      {
        ok: true,
        reference,
        deletionToken,
        fileCount: manifestFiles.length,
      },
      { status: 201, headers: responseHeaders },
    );
  } catch (error) {
    let cleanupIncomplete = false;
    if (storedKeys.length) {
      try {
        await bucket.delete(storedKeys);
      } catch {
        cleanupIncomplete = true;
      }
    }

    if (cleanupIncomplete) {
      return jsonError("CLEANUP_INCOMPLETE", 500);
    }
    if (error instanceof UploadValidationError) {
      return jsonError(error.code, 400);
    }
    return jsonError("UPLOAD_FAILED", 500);
  }
}

export async function DELETE(request: Request) {
  return handleClinicalFilesDelete(request, await getUploadBucket());
}

export async function handleClinicalFilesDelete(
  request: Request,
  bucket: R2Bucket | null,
) {
  if (!isSameOrigin(request)) {
    return jsonError("ORIGIN_REJECTED", 403);
  }

  if (!bucket) {
    return jsonError("SERVICE_UNAVAILABLE", 503);
  }

  let body: { reference?: unknown; deletionToken?: unknown };
  try {
    body = (await request.json()) as {
      reference?: unknown;
      deletionToken?: unknown;
    };
  } catch {
    return jsonError("INVALID_REQUEST", 400);
  }

  const reference = cleanText(body.reference, 64).toUpperCase();
  const deletionToken = cleanText(body.deletionToken, 100);
  const match = /^MD-(\d{4})(\d{2})(\d{2})-([A-F0-9]{32})$/.exec(reference);
  if (!match || deletionToken.length < 32) {
    return jsonError("DELETE_FORMAT_REJECTED", 400);
  }

  const [, year, month, day] = match;
  const prefix = `clinical-intakes/${year}-${month}-${day}/${reference.toLowerCase()}`;
  const manifestKey = `${prefix}/manifest.json`;
  const object = await bucket.get(manifestKey);
  if (!object) {
    return jsonError("NOT_FOUND", 404);
  }

  let manifest: UploadManifest;
  try {
    manifest = (await object.json()) as UploadManifest;
  } catch {
    return jsonError("DELETE_MANIFEST_INVALID", 422);
  }

  if (!isValidDeleteManifest(manifest, reference, prefix)) {
    return jsonError("DELETE_MANIFEST_INVALID", 422);
  }

  const providedHash = await sha256(deletionToken);
  if (!constantTimeEqual(providedHash, manifest.deletionTokenHash)) {
    return jsonError("DELETE_TOKEN_REJECTED", 401);
  }

  try {
    await bucket.delete([
      ...manifest.files.map((file) => file.objectKey),
      manifestKey,
    ]);
  } catch {
    return jsonError("DELETE_FAILED", 500);
  }

  return Response.json(
    { ok: true },
    { status: 200, headers: responseHeaders },
  );
}

async function getUploadBucket(): Promise<R2Bucket | null> {
  try {
    const { env } = await import("cloudflare:workers");
    const bindings = env as unknown as UploadBinding;
    return bindings.CLINICAL_UPLOADS ?? null;
  } catch {
    return null;
  }
}

function isSameOrigin(request: Request): boolean {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (origin) {
    try {
      return new URL(origin).origin === requestUrl.origin;
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      return new URL(referer).origin === requestUrl.origin;
    } catch {
      return false;
    }
  }

  return false;
}

function isValidDeleteManifest(
  manifest: UploadManifest,
  reference: string,
  prefix: string,
): boolean {
  if (
    !manifest ||
    manifest.version !== 1 ||
    manifest.reference !== reference ||
    typeof manifest.deletionTokenHash !== "string" ||
    !/^[a-f0-9]{64}$/u.test(manifest.deletionTokenHash) ||
    !Array.isArray(manifest.files) ||
    manifest.files.length < 1 ||
    manifest.files.length > clinicalUploadConfig.maxFiles
  ) {
    return false;
  }

  const allowedExtensions = new Set(["jpg", "png", "webp", "dcm"]);
  return manifest.files.every((file, index) => {
    if (!file || typeof file.objectKey !== "string") return false;
    const expectedStart = `${prefix}/file-${String(index + 1).padStart(2, "0")}.`;
    if (!file.objectKey.startsWith(expectedStart)) return false;
    const extension = file.objectKey.slice(expectedStart.length);
    return allowedExtensions.has(extension);
  });
}

function cleanText(value: FormDataEntryValue | unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function safeFilename(value: string) {
  const basename = value.split(/[\\/]/).at(-1) ?? "clinical-file";
  return cleanText(basename, 120) || "clinical-file";
}

function isEmail(value: string) {
  return (
    value.length <= 180 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(value)
  );
}

function detectFileKind(bytes: Uint8Array): ClinicalFileKind | null {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "jpeg";
  }

  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (
    bytes.length >= png.length &&
    png.every((value, index) => bytes[index] === value)
  ) {
    return "png";
  }

  if (
    bytes.length >= 12 &&
    ascii(bytes, 0, 4) === "RIFF" &&
    ascii(bytes, 8, 12) === "WEBP"
  ) {
    return "webp";
  }

  if (bytes.length >= 132 && ascii(bytes, 128, 132) === "DICM") {
    return "dicom";
  }

  return null;
}

function ascii(bytes: Uint8Array, start: number, end: number) {
  return String.fromCharCode(...bytes.slice(start, end));
}

function createReference(date: Date) {
  const datePart = date.toISOString().slice(0, 10).replaceAll("-", "");
  const randomPart = [...crypto.getRandomValues(new Uint8Array(16))]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  return `MD-${datePart}-${randomPart}`;
}

function randomToken(length: number) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return base64Url(bytes);
}

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/u, "");
}

async function sha256(value: string | ArrayBuffer) {
  const data =
    typeof value === "string" ? new TextEncoder().encode(value) : value;
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function jsonError(code: string, status: number) {
  return Response.json(
    { ok: false, code },
    { status, headers: responseHeaders },
  );
}

class UploadValidationError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(code);
    this.code = code;
  }
}
