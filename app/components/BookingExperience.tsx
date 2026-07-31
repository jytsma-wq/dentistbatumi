"use client";

import {
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { SiteCopy } from "../content";

type Intent = "local" | "international";
type DialogMode = "booking" | "whatsapp";

type BookingExperienceProps = {
  children: ReactNode;
  copy: SiteCopy;
  whatsappNumber: string;
  uploadLabel: string;
};

export function BookingExperience({
  children,
  copy,
  whatsappNumber,
  uploadLabel,
}: BookingExperienceProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [intent, setIntent] = useState<Intent>("local");
  const [whatsappIntent, setWhatsAppIntent] = useState<Intent>();
  const [dialogMode, setDialogMode] = useState<DialogMode>("booking");
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const languageLabel = useMemo(
    () => copy.languageName,
    [copy.languageName],
  );

  const buildWhatsAppMessage = useCallback(
    (route?: Intent) =>
      [
        copy.booking.messageGreeting,
        route
          ? `${copy.booking.routeLabel}: ${
              route === "international"
                ? copy.booking.internationalRoute
                : copy.booking.localRoute
            }`
          : undefined,
        `${copy.booking.language}: ${languageLabel}`,
        copy.booking.messageClosing,
      ]
        .filter(Boolean)
        .join("\n"),
    [copy.booking, languageLabel],
  );

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>(
        "[data-booking], [data-whatsapp]",
      );
      if (!trigger) return;

      event.preventDefault();
      const explicitIntent =
        trigger.dataset.intent === "international"
          ? "international"
          : trigger.dataset.intent === "local"
            ? "local"
            : undefined;
      const onInternationalPage =
        window.location.pathname.includes("/international");
      const requestedIntent =
        explicitIntent ?? (onInternationalPage ? "international" : "local");
      const requestedWhatsAppIntent =
        explicitIntent ?? (onInternationalPage ? "international" : undefined);
      setIntent(requestedIntent);
      setWhatsAppIntent(requestedWhatsAppIntent);
      setSummary("");
      setCopied(false);
      setCopyError(false);

      if (trigger.matches("[data-whatsapp]") && whatsappNumber) {
        const message = buildWhatsAppMessage(requestedWhatsAppIntent);
        window.open(
          `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
          "_blank",
          "noopener,noreferrer",
        );
        return;
      }

      setDialogMode(
        trigger.matches("[data-whatsapp]") ? "whatsapp" : "booking",
      );
      dialogRef.current?.showModal();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [buildWhatsAppMessage, whatsappNumber]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const resetScroll = () => document.body.classList.remove("dialog-open");
    const lockScroll = () => document.body.classList.add("dialog-open");
    dialog.addEventListener("close", resetScroll);
    dialog.addEventListener("cancel", resetScroll);
    const observer = new MutationObserver(() => {
      if (dialog.open) lockScroll();
    });
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });

    return () => {
      observer.disconnect();
      dialog.removeEventListener("close", resetScroll);
      dialog.removeEventListener("cancel", resetScroll);
      resetScroll();
    };
  }, []);

  function closeDialog() {
    dialogRef.current?.close();
  }

  function resetDialog() {
    setSummary("");
    setCopied(false);
    setCopyError(false);
    dialogRef.current?.querySelector("form")?.reset();
  }

  function buildSummary(form: HTMLFormElement) {
    const data = new FormData(form);
    return [
      copy.booking.messageGreeting,
      "",
      `${copy.booking.routeLabel}: ${
        intent === "international"
          ? copy.booking.internationalRoute
          : copy.booking.localRoute
      }`,
      `${copy.booking.name}: ${String(data.get("name") ?? "")}`,
      `${copy.booking.phone}: ${String(data.get("phone") ?? "")}`,
      `${copy.booking.email}: ${String(data.get("email") ?? "") || "—"}`,
      `${copy.booking.treatment}: ${String(data.get("treatment") ?? "")}`,
      `${copy.booking.date}: ${String(data.get("date") ?? "") || "—"}`,
      `${copy.booking.time}: ${String(data.get("time") ?? "") || "—"}`,
      `${copy.booking.language}: ${languageLabel}`,
      `${copy.booking.note}: ${String(data.get("note") ?? "") || "—"}`,
      "",
      copy.booking.messageClosing,
    ].join("\n");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setSummary(buildSummary(form));
    setCopied(false);
    setCopyError(false);
    requestAnimationFrame(() => {
      dialogRef.current?.scrollTo({ top: 0 });
    });
  }

  async function copyWhatsAppMessage(route?: Intent) {
    try {
      await navigator.clipboard.writeText(buildWhatsAppMessage(route));
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  }

  function openWhatsApp(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (!whatsappNumber) {
      event.preventDefault();
      void copyWhatsAppMessage(intent);
    }
  }

  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        buildWhatsAppMessage(intent),
      )}`
    : "#";

  const today = useMemo(() => {
    const value = new Date();
    value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
    return value.toISOString().slice(0, 10);
  }, []);

  return (
    <>
      {children}
      <dialog
        className="booking-dialog"
        ref={dialogRef}
        aria-labelledby="booking-title"
        onClose={resetDialog}
      >
        <div className="booking-panel">
          <header className="booking-header">
            <div>
              <span className="eyebrow">
                {dialogMode === "whatsapp"
                  ? copy.actions.quickQuestion
                  : copy.booking.eyebrow}
              </span>
              <h2 id="booking-title">
                {dialogMode === "whatsapp"
                  ? copy.actions.whatsapp
                  : copy.booking.title}
              </h2>
            </div>
            <button
              className="icon-button"
              type="button"
              onClick={closeDialog}
              aria-label={
                dialogMode === "whatsapp"
                  ? copy.booking.closeWhatsApp
                  : copy.booking.close
              }
            >
              ×
            </button>
          </header>

          {dialogMode === "whatsapp" ? (
            <section className="booking-confirmation whatsapp-fallback" aria-live="polite">
              <span className="confirmation-mark confirmation-mark-whatsapp" aria-hidden="true">
                WA
              </span>
              <span className="eyebrow">{copy.actions.quickQuestion}</span>
              <h3>{copy.actions.whatsapp}</h3>
              <p>{copy.booking.numberPending}</p>
              <pre>{buildWhatsAppMessage(whatsappIntent)}</pre>
              <div className="confirmation-actions">
                <button
                  className="button button-whatsapp button-wide"
                  type="button"
                  onClick={() => void copyWhatsAppMessage(whatsappIntent)}
                >
                  <span className="wa-dot" aria-hidden="true">
                    WA
                  </span>
                  {copied ? copy.booking.copied : copy.booking.copy}
                </button>
                {copyError && (
                  <p className="copy-error" role="alert">
                    {copy.booking.copyFailed}
                  </p>
                )}
                <button
                  className="text-button"
                  type="button"
                  onClick={() => {
                    setDialogMode("booking");
                    setCopied(false);
                    setCopyError(false);
                    dialogRef.current?.scrollTo({ top: 0 });
                  }}
                >
                  {copy.actions.appointment} →
                </button>
              </div>
            </section>
          ) : (
            <>
            <form
              className="booking-form"
              onSubmit={handleSubmit}
              hidden={Boolean(summary)}
            >
              <fieldset className="route-switcher">
                <legend>{copy.booking.routeQuestion}</legend>
                <button
                  type="button"
                  className={intent === "local" ? "active" : ""}
                  aria-pressed={intent === "local"}
                  onClick={() => setIntent("local")}
                >
                  <span>01</span>
                  {copy.booking.localRoute}
                </button>
                <button
                  type="button"
                  className={intent === "international" ? "active" : ""}
                  aria-pressed={intent === "international"}
                  onClick={() => setIntent("international")}
                >
                  <span>02</span>
                  {copy.booking.internationalRoute}
                </button>
              </fieldset>

              <div className="form-grid">
                <label>
                  {copy.booking.name}
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    placeholder={copy.booking.namePlaceholder}
                  />
                </label>
                <label>
                  {copy.booking.phone}
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    placeholder="+31 / +49 / +995 …"
                  />
                </label>
                <label>
                  {copy.booking.email}
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                  />
                </label>
                <label>
                  {copy.booking.treatment}
                  <select name="treatment" required defaultValue="">
                    <option value="" disabled>
                      {copy.booking.choose}
                    </option>
                    {copy.booking.treatmentOptions.map((option) => (
                      <option value={option} key={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {copy.booking.date}
                  <input name="date" type="date" min={today} />
                </label>
                <label>
                  {copy.booking.time}
                  <select name="time" defaultValue="">
                    <option value="">{copy.booking.flexible}</option>
                    {copy.booking.timeOptions.map((option) => (
                      <option value={option} key={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="full-field">
                  {copy.booking.note}
                  <textarea
                    name="note"
                    rows={4}
                    maxLength={700}
                    placeholder={
                      intent === "international"
                        ? copy.booking.noteInternational
                        : copy.booking.noteLocal
                    }
                  />
                </label>
              </div>

              <label className="consent-row">
                <input name="consent" type="checkbox" required />
                <span>{copy.booking.consent}</span>
              </label>

              <p className="privacy-note">{copy.booking.privacy}</p>

              {intent === "international" && (
                <button
                  className="booking-upload-link"
                  type="button"
                  onClick={() => {
                    closeDialog();
                    window.setTimeout(
                      () =>
                        window.dispatchEvent(
                          new Event("marea:open-upload"),
                        ),
                      0,
                    );
                  }}
                >
                  <span aria-hidden="true">＋</span>
                  {uploadLabel}
                </button>
              )}

              <button className="button button-dark button-wide" type="submit">
                {copy.booking.review}
                <span aria-hidden="true">→</span>
              </button>
            </form>
            {summary && (
              <section className="booking-confirmation" aria-live="polite">
              <span className="confirmation-mark" aria-hidden="true">
                ✓
              </span>
              <span className="eyebrow">{copy.booking.readyEyebrow}</span>
              <h3>{copy.booking.readyTitle}</h3>
              <p>{copy.booking.readyText}</p>
              <pre>{summary}</pre>
              <div className="confirmation-actions">
                <a
                  className="button button-whatsapp button-wide"
                  href={whatsappHref}
                  onClick={openWhatsApp}
                  target={whatsappNumber ? "_blank" : undefined}
                  rel={whatsappNumber ? "noreferrer" : undefined}
                >
                  <span className="wa-dot" aria-hidden="true">
                    WA
                  </span>
                  {whatsappNumber
                    ? copy.booking.sendWhatsApp
                    : copied
                      ? copy.booking.copied
                      : copy.booking.copy}
                </a>
                {copyError && (
                  <>
                    <p className="copy-error" role="alert">
                      {copy.booking.copyFailed}
                    </p>
                    <pre>{buildWhatsAppMessage(intent)}</pre>
                  </>
                )}
                <button
                  className="text-button"
                  type="button"
                  onClick={() => setSummary("")}
                >
                  ← {copy.booking.edit}
                </button>
              </div>
              {!whatsappNumber && (
                <p className="setup-note">{copy.booking.numberPending}</p>
              )}
              </section>
            )}
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
