export const clinicalUploadConfig = {
  binding: "CLINICAL_UPLOADS",
  maxFiles: 5,
  maxFileBytes: 10 * 1024 * 1024,
  maxTotalBytes: 25 * 1024 * 1024,
  requestLimitBytes: 27 * 1024 * 1024,
  acceptedFormats: "JPEG, PNG, WebP, DICOM",
  acceptAttribute: ".jpg,.jpeg,.png,.webp,.dcm",
} as const;

export type ClinicalFileKind = "jpeg" | "png" | "webp" | "dicom";

export const clinicalFileTypes: Record<
  ClinicalFileKind,
  { extension: string; contentType: string }
> = {
  jpeg: { extension: "jpg", contentType: "image/jpeg" },
  png: { extension: "png", contentType: "image/png" },
  webp: { extension: "webp", contentType: "image/webp" },
  dicom: { extension: "dcm", contentType: "application/dicom" },
};
