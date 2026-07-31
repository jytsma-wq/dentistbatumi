"use client";

import Link from "next/link";
import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Locale } from "../locales";
import {
  formatUploadText,
  type MedicalUploadCopy,
  type UploadErrorCode,
} from "../upload-content";
import { clinicalUploadConfig } from "../upload-config";

type UploadState = "idle" | "uploading" | "checking" | "success" | "deleted";
type CopyState = "reference" | "contact" | "error" | null;

type UploadReceipt = {
  reference: string;
  deletionToken: string;
  fileCount: number;
};

const clientAcceptedExtensions = /\.(jpe?g|png|webp|dcm)$/iu;
const knownErrorCodes = new Set<UploadErrorCode>([
  "NO_FILE",
  "TOO_MANY_FILES",
  "FILE_TOO_LARGE",
  "TOTAL_TOO_LARGE",
  "FILE_TYPE_REJECTED",
  "INVALID_FIELDS",
  "SESSION_EXPIRED",
  "ORIGIN_REJECTED",
  "SERVICE_UNAVAILABLE",
  "REQUEST_TIMEOUT",
  "CLEANUP_INCOMPLETE",
  "UPLOAD_FAILED",
  "INVALID_REQUEST",
]);

export function MedicalUploadExperience({
  locale,
  languageName,
  copy,
  whatsappNumber,
}: {
  locale: Locale;
  languageName: string;
  copy: MedicalUploadCopy;
  whatsappNumber: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const deletedHeadingRef = useRef<HTMLHeadingElement>(null);
  const uploadAbortRef = useRef<AbortController | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const startedAtRef = useRef(0);
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<UploadState>("idle");
  const [errorCode, setErrorCode] = useState<UploadErrorCode | null>(null);
  const [receipt, setReceipt] = useState<UploadReceipt | null>(null);
  const [copyState, setCopyState] = useState<CopyState>(null);
  const [dragActive, setDragActive] = useState(false);
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const replacements = useMemo(
    () => ({
      formats: clinicalUploadConfig.acceptedFormats,
      maxSize: formatBytes(clinicalUploadConfig.maxFileBytes),
      maxTotal: formatBytes(clinicalUploadConfig.maxTotalBytes),
      maxFiles: clinicalUploadConfig.maxFiles,
    }),
    [],
  );

  const resetExperience = useCallback(() => {
    setFiles([]);
    setState("idle");
    setErrorCode(null);
    setReceipt(null);
    setCopyState(null);
    setDragActive(false);
    setDeleteArmed(false);
    setDeleting(false);
    setDeleteError(false);
    startedAtRef.current = Date.now();
    formRef.current?.reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const openDialog = useCallback(
    (trigger?: HTMLElement | null) => {
      resetExperience();
      returnFocusRef.current = trigger ?? null;
      dialogRef.current?.showModal();
    },
    [resetExperience],
  );

  useEffect(() => {
    const handleTrigger = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>("[data-upload]");
      if (!trigger) return;
      event.preventDefault();
      openDialog(trigger);
    };
    const handleCustomTrigger = () => openDialog();

    document.addEventListener("click", handleTrigger);
    window.addEventListener("marea:open-upload", handleCustomTrigger);
    return () => {
      document.removeEventListener("click", handleTrigger);
      window.removeEventListener("marea:open-upload", handleCustomTrigger);
    };
  }, [openDialog]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      document.body.classList.remove("dialog-open");
      resetExperience();
      returnFocusRef.current?.focus();
      returnFocusRef.current = null;
    };
    const observer = new MutationObserver(() => {
      if (dialog.open) document.body.classList.add("dialog-open");
    });
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
    dialog.addEventListener("close", handleClose);

    return () => {
      observer.disconnect();
      dialog.removeEventListener("close", handleClose);
      document.body.classList.remove("dialog-open");
    };
  }, [resetExperience]);

  useEffect(() => {
    if (state === "success") successHeadingRef.current?.focus();
    if (state === "deleted") deletedHeadingRef.current?.focus();
  }, [state]);

  useEffect(
    () => () => {
      uploadAbortRef.current?.abort();
    },
    [],
  );

  function closeDialog() {
    if (state === "uploading" || state === "checking" || deleting) return;
    dialogRef.current?.close();
  }

  function addFiles(incoming: File[]) {
    setErrorCode(null);
    setCopyState(null);

    const next = deduplicateFiles([...files, ...incoming]);
    if (next.length > clinicalUploadConfig.maxFiles) {
      setErrorCode("TOO_MANY_FILES");
      return;
    }
    if (
      next.some(
        (file) =>
          !clientAcceptedExtensions.test(file.name) ||
          file.size > clinicalUploadConfig.maxFileBytes,
      )
    ) {
      const oversized = next.some(
        (file) => file.size > clinicalUploadConfig.maxFileBytes,
      );
      setErrorCode(oversized ? "FILE_TOO_LARGE" : "FILE_TYPE_REJECTED");
      return;
    }
    if (
      next.reduce((total, file) => total + file.size, 0) >
      clinicalUploadConfig.maxTotalBytes
    ) {
      setErrorCode("TOTAL_TOO_LARGE");
      return;
    }

    setFiles(next);
    syncFileInput(next);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.currentTarget.files ?? []));
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    addFiles(Array.from(event.dataTransfer.files));
  }

  function removeFile(index: number) {
    const next = files.filter((_, fileIndex) => fileIndex !== index);
    setFiles(next);
    setErrorCode(null);
    syncFileInput(next);
  }

  function syncFileInput(next: File[]) {
    const input = fileInputRef.current;
    if (!input) return;
    try {
      const transfer = new DataTransfer();
      next.forEach((file) => transfer.items.add(file));
      input.files = transfer.files;
    } catch {
      if (!next.length) input.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setErrorCode(null);
    setCopyState(null);
    setDeleteError(false);

    if (!form.reportValidity()) {
      setErrorCode("INVALID_FIELDS");
      return;
    }
    if (!files.length) {
      setErrorCode("NO_FILE");
      return;
    }

    const data = new FormData(form);
    data.set("locale", locale);
    data.set("startedAt", String(startedAtRef.current));
    data.set("ownershipConsent", "yes");
    data.set("healthConsent", "yes");
    data.delete("files");
    files.forEach((file) => data.append("files", file, file.name));

    setState("uploading");
    const controller = new AbortController();
    uploadAbortRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 90_000);
    try {
      const request = fetch("/api/clinical-files", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        credentials: "same-origin",
        signal: controller.signal,
      });
      window.setTimeout(() => {
        setState((current) => (current === "uploading" ? "checking" : current));
      }, 650);

      const response = await request;
      const payload = (await response.json().catch(() => null)) as
        | (Partial<UploadReceipt> & { ok?: boolean; code?: string })
        | null;

      if (
        !response.ok ||
        !payload?.ok ||
        typeof payload.reference !== "string" ||
        typeof payload.deletionToken !== "string"
      ) {
        const code =
          payload?.code && knownErrorCodes.has(payload.code as UploadErrorCode)
            ? (payload.code as UploadErrorCode)
            : "UPLOAD_FAILED";
        setState("idle");
        setErrorCode(code);
        startedAtRef.current = Date.now();
        return;
      }

      setReceipt({
        reference: payload.reference,
        deletionToken: payload.deletionToken,
        fileCount:
          typeof payload.fileCount === "number" ? payload.fileCount : files.length,
      });
      setState("success");
      setFiles([]);
      form.reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
      requestAnimationFrame(() => dialogRef.current?.scrollTo({ top: 0 }));
    } catch (error) {
      setState("idle");
      setErrorCode(
        error instanceof DOMException && error.name === "AbortError"
          ? "REQUEST_TIMEOUT"
          : "UPLOAD_FAILED",
      );
      startedAtRef.current = Date.now();
    } finally {
      window.clearTimeout(timeout);
      if (uploadAbortRef.current === controller) uploadAbortRef.current = null;
    }
  }

  async function copyText(value: string, kind: Exclude<CopyState, "error" | null>) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState(kind);
    } catch {
      setCopyState("error");
    }
  }

  function clinicMessage() {
    return formatUploadText(copy.success.contactMessage, {
      reference: receipt?.reference ?? "",
      language: languageName,
    });
  }

  function notifyClinic() {
    if (!receipt) return;
    const message = clinicMessage();
    if (whatsappNumber) {
      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }
    void copyText(message, "contact");
  }

  async function deleteUpload() {
    if (!receipt) return;
    setDeleting(true);
    setDeleteError(false);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetch("/api/clinical-files", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        signal: controller.signal,
        body: JSON.stringify({
          reference: receipt.reference,
          deletionToken: receipt.deletionToken,
        }),
      });
      if (!response.ok) throw new Error("delete-failed");
      setState("deleted");
      setReceipt(null);
      setDeleteArmed(false);
      setCopyState(null);
    } catch {
      setDeleteError(true);
    } finally {
      window.clearTimeout(timeout);
      setDeleting(false);
    }
  }

  const errorMessage = errorCode
    ? formatUploadText(copy.errors[errorCode], replacements)
    : "";
  const fileRules = formatUploadText(copy.form.fileRules, replacements);
  const pending = state === "uploading" || state === "checking";

  return (
    <dialog
      className="upload-dialog"
      ref={dialogRef}
      aria-labelledby="upload-title"
      aria-describedby={
        state === "success" || state === "deleted" ? undefined : "upload-lead"
      }
      onCancel={(event) => {
        if (pending || deleting) event.preventDefault();
      }}
    >
      <div className="upload-panel">
        <header className="upload-header">
          <div>
            <span className="eyebrow">{copy.eyebrow}</span>
            <h2 id="upload-title">{copy.title}</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={closeDialog}
            aria-label={copy.close}
            disabled={pending || deleting}
          >
            ×
          </button>
        </header>

        {state === "success" && receipt ? (
          <section className="upload-success" aria-live="polite">
            <span className="upload-success-mark" aria-hidden="true">
              ✓
            </span>
            <span className="eyebrow">{copy.success.eyebrow}</span>
            <h3 ref={successHeadingRef} tabIndex={-1}>
              {copy.success.title}
            </h3>
            <p>
              {formatUploadText(copy.success.body, {
                reference: receipt.reference,
              })}
            </p>
            <div className="upload-reference">
              <span>{copy.success.referenceLabel}</span>
              <code>{receipt.reference}</code>
            </div>
            <div className="upload-success-actions">
              <button
                className="button button-dark button-wide"
                type="button"
                onClick={() =>
                  void copyText(receipt.reference, "reference")
                }
              >
                {copyState === "reference"
                  ? copy.success.copied
                  : copy.success.copyReference}
              </button>
              <button
                className="button button-whatsapp button-wide"
                type="button"
                onClick={notifyClinic}
              >
                <span className="wa-dot" aria-hidden="true">
                  WA
                </span>
                {copyState === "contact"
                  ? copy.success.contactCopied
                  : copy.success.contactClinic}
              </button>
            </div>
            {copyState === "error" && (
              <p className="upload-error" role="alert">
                {copy.success.copyFailed}
              </p>
            )}
            <div className="upload-delete-zone">
              {deleteArmed ? (
                <>
                  <p>{copy.success.deleteConfirm}</p>
                  <div>
                    <button
                      className="text-button text-button-danger"
                      type="button"
                      onClick={() => void deleteUpload()}
                      disabled={deleting}
                    >
                      {deleting
                        ? copy.success.deleting
                        : copy.success.deleteUpload}
                    </button>
                    <button
                      className="text-button"
                      type="button"
                      onClick={() => setDeleteArmed(false)}
                      disabled={deleting}
                    >
                      {copy.success.cancel}
                    </button>
                  </div>
                </>
              ) : (
                <button
                  className="text-button text-button-danger"
                  type="button"
                  onClick={() => setDeleteArmed(true)}
                >
                  {copy.success.deleteUpload}
                </button>
              )}
              {deleteError && (
                <p className="upload-error" role="alert">
                  {copy.success.deleteFailed}
                </p>
              )}
            </div>
          </section>
        ) : state === "deleted" ? (
          <section className="upload-success" aria-live="polite">
            <span className="upload-success-mark upload-deleted-mark" aria-hidden="true">
              ×
            </span>
            <h3 ref={deletedHeadingRef} tabIndex={-1}>
              {copy.success.deletedTitle}
            </h3>
            <p>{copy.success.deletedText}</p>
            <button
              className="button button-dark"
              type="button"
              onClick={resetExperience}
            >
              {copy.success.newUpload}
            </button>
          </section>
        ) : (
          <form
            className="upload-form"
            ref={formRef}
            onSubmit={handleSubmit}
            aria-busy={pending}
          >
            <div className="upload-intro">
              <p id="upload-lead">{copy.lead}</p>
              <p className="upload-preview-note">
                <strong>{copy.privatePreview}</strong>
              </p>
              <p className="upload-whatsapp-note">{copy.whatsappWarning}</p>
              <p className="upload-urgent-note">{copy.urgentNote}</p>
            </div>

            <fieldset className="upload-fieldset">
              <legend>{copy.form.detailsLegend}</legend>
              <div className="form-grid">
                <label>
                  {copy.form.name}
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={90}
                    placeholder={copy.form.namePlaceholder}
                    disabled={pending}
                  />
                </label>
                <label>
                  {copy.form.email}
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={180}
                    placeholder="name@example.com"
                    disabled={pending}
                  />
                </label>
                <label className="full-field">
                  {copy.form.phone} <small>{copy.form.optional}</small>
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={42}
                    placeholder="+31 / +49 / +995 …"
                    disabled={pending}
                  />
                </label>
                <label className="full-field">
                  {copy.form.context} <small>{copy.form.optional}</small>
                  <textarea
                    name="context"
                    rows={3}
                    maxLength={600}
                    placeholder={copy.form.contextPlaceholder}
                    disabled={pending}
                  />
                </label>
              </div>
            </fieldset>

            <fieldset className="upload-fieldset">
              <legend>{copy.form.filesLegend}</legend>
              <div
                className={`upload-dropzone ${dragActive ? "is-dragging" : ""}`}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                    setDragActive(false);
                  }
                }}
                onDrop={handleDrop}
              >
                <span className="upload-drop-mark" aria-hidden="true">
                  +
                </span>
                <label className="upload-file-button">
                  <span>{copy.form.chooseFiles}</span>
                  <input
                    ref={fileInputRef}
                    name="files"
                    type="file"
                    accept={clinicalUploadConfig.acceptAttribute}
                    multiple
                    onChange={handleFileChange}
                    disabled={pending}
                    aria-describedby="upload-file-rules upload-file-guidance"
                  />
                </label>
                <small>{copy.form.dropFiles}</small>
                <p id="upload-file-rules">{fileRules}</p>
              </div>
              {files.length > 0 && (
                <ul className="upload-file-list" aria-label={copy.form.filesLegend}>
                  {files.map((file, index) => (
                    <li key={`${file.name}-${file.size}-${file.lastModified}`}>
                      <span aria-hidden="true">
                        {file.name.toLowerCase().endsWith(".dcm") ? "DX" : "IMG"}
                      </span>
                      <div>
                        <strong>{file.name}</strong>
                        <small>{formatBytes(file.size)}</small>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        disabled={pending}
                        aria-label={`${copy.form.removeFile}: ${file.name}`}
                      >
                        {copy.form.removeFile}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="upload-guidance" id="upload-file-guidance">
                <p>{copy.form.dicomHint}</p>
                <p>{copy.form.photoTip}</p>
              </div>
            </fieldset>

            <input
              name="website"
              type="text"
              hidden
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="upload-consents">
              <label className="consent-row">
                <input
                  name="ownership"
                  type="checkbox"
                  required
                  disabled={pending}
                />
                <span>{copy.form.ownershipConsent}</span>
              </label>
              <label className="consent-row">
                <input
                  name="health"
                  type="checkbox"
                  required
                  disabled={pending}
                />
                <span>{copy.form.healthConsent}</span>
              </label>
              <Link
                href={`/${locale}/privacy#clinical-upload`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.form.privacyLink} →
              </Link>
            </div>

            <p className="upload-clinical-note">{copy.form.clinicalNote}</p>
            {errorMessage && (
              <p className="upload-error" role="alert">
                {errorMessage}
              </p>
            )}
            {pending && (
              <div className="upload-progress" role="status" aria-live="polite">
                <span aria-hidden="true" />
                <p>
                  {state === "checking"
                    ? copy.form.checking
                    : copy.form.uploading}
                </p>
              </div>
            )}
            <button
              className="button button-dark button-wide"
              type="submit"
              disabled={pending}
            >
              {pending ? copy.form.uploading : copy.form.submit}
              <span aria-hidden="true">→</span>
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}

function deduplicateFiles(files: File[]) {
  const seen = new Set<string>();
  return files.filter((file) => {
    const key = `${file.name}:${file.size}:${file.lastModified}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function formatBytes(value: number) {
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`;
  const megabytes = value / (1024 * 1024);
  return `${Number.isInteger(megabytes) ? megabytes : megabytes.toFixed(1)} MB`;
}
