import type { Metadata, Viewport } from "next";
import "../globals.css";
import { siteConfig } from "../site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.publicUrl),
  title: {
    default: "Marea Dental · Dentist in Batumi",
    template: "%s · Marea Dental",
  },
  description:
    "Een tandartskliniek in Batumi voor lokale en internationale patiënten, met heldere behandelplanning en een zorgvuldig 21-dagentraject waar medisch verantwoord.",
  applicationName: "Marea Dental",
  openGraph: {
    type: "website",
    siteName: "Marea Dental",
    title: "Marea Dental · Dentist in Batumi",
    description:
      "Skilled dentistry. A clear plan. No unnecessary waiting.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marea Dental · Dentist in Batumi",
    description:
      "Dental care in Batumi for local and international patients.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f0e8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
