"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeNames, locales, type Locale } from "../locales";

export function LocaleMenu({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const suffix = pathname.split("/").slice(2).filter(Boolean).join("/");

  return (
    <details className="language-menu">
      <summary aria-label={label}>{locale.toUpperCase()}</summary>
      <div>
        {locales.map((item) => (
          <Link
            href={`/${item}${suffix ? `/${suffix}` : ""}`}
            lang={item}
            key={item}
            aria-current={item === locale ? "page" : undefined}
          >
            {localeNames[item]}
          </Link>
        ))}
      </div>
    </details>
  );
}
