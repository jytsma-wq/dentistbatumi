"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Locale } from "../locales";
import { closeDisclosure } from "./ui-interactions";

type MobileNavigationProps = {
  locale: Locale;
  menuLabel: string;
  navigationLabel: string;
  homeLabel: string;
  whatsappLabel: string;
  appointmentLabel: string;
  navItems: ReadonlyArray<readonly [string, string]>;
};

export function MobileNavigation({
  locale,
  menuLabel,
  navigationLabel,
  homeLabel,
  whatsappLabel,
  appointmentLabel,
  navItems,
}: MobileNavigationProps) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => closeDisclosure(menuRef.current);

  return (
    <details className="mobile-menu" ref={menuRef}>
      <summary aria-label={menuLabel}>
        <span />
        <span />
      </summary>
      <nav aria-label={navigationLabel}>
        <Link href={`/${locale}`} onClick={closeMenu}>
          {homeLabel}
        </Link>
        {navItems.map(([href, label]) => (
          <Link href={`/${locale}/${href}`} key={href} onClick={closeMenu}>
            {label}
          </Link>
        ))}
        <button data-whatsapp type="button">
          {whatsappLabel}
        </button>
        <button data-booking type="button">
          {appointmentLabel}
        </button>
      </nav>
    </details>
  );
}
