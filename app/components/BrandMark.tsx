import Link from "next/link";
import type { Locale } from "../locales";

export function BrandMark({ locale }: { locale: Locale }) {
  return (
    <Link className="brand-mark" href={`/${locale}`} aria-label="Marea Dental">
      <span className="brand-symbol" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>
        <b>MAREA</b>
        <small>DENTAL · BATUMI</small>
      </span>
    </Link>
  );
}

