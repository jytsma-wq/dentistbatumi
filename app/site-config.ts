export const siteConfig = {
  name: "Marea Dental",
  descriptor: "Dental clinic · Batumi",
  city: "Batumi",
  country: "Georgia",
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(
    /\D/g,
    "",
  ),
  phone: process.env.NEXT_PUBLIC_PHONE ?? "",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "",
  address: process.env.NEXT_PUBLIC_ADDRESS ?? "Batumi, Adjara, Georgia",
  publicUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://marea-dental-batumi.jytsma.chatgpt.site",
} as const;

