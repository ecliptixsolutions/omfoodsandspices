/**
 * Central site configuration: company details, contact info, navigation,
 * footer links and locales. Edit here — every component reads from this file.
 */

export const site = {
  name: "OM Food and Spices LLP",
  shortName: "OM Food",
  monogram: "OM",
  tagline: "Natural Flavours. Better Tomorrows.",
  footerLine: "Dehydrated onion and garlic ingredients from Gujarat, India, for food manufacturers, seasoning companies and bulk export enquiries.",
  topBarText: "ONION & GARLIC PRODUCTS · BULK SUPPLY & EXPORT INQUIRIES WELCOME",
  // Canonical production URL. Local and preview deployments can override this explicitly.
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://omfoodsandspices.com"
  ).replace(/\/$/, ""),
  foundedYear: 2026,
  contact: {
    phoneDisplay: "+91 81407 12205",
    phoneTel: "+918140712205",
    whatsappNumber: "918140712205", // international format, no "+"
    email: "Omfoodandspicesllp@gmail.com",
    addressLines: [
      "Survey No. 125, OM Food and Spices LLP,",
      "P5, Kikariya, Gujarat 364280, India",
    ],
    address: {
      streetAddress: "Survey No. 125, OM Food and Spices LLP, P5",
      addressLocality: "Kikariya",
      addressRegion: "Gujarat",
      postalCode: "364280",
      addressCountry: "IN",
    },
    hours: "Monday–Sunday, 9:00 AM–6:30 PM IST",
    hoursNote: "Subject to holiday variations.",
    openingHours: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "18:30",
    },
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About us",
    href: "/about",
    children: [
      { label: "About OM Food", href: "/about" },
      { label: "Our plant", href: "/about/plant" },
      { label: "Our process", href: "/about/process" },
      { label: "Quality & food safety", href: "/about/quality-food-safety" },
      { label: "Responsible manufacturing", href: "/about/responsible-manufacturing" },
      { label: "Packaging & export", href: "/about/packaging-export" },
    ],
  },
  { label: "Products", href: "/products" },
  { label: "Dehydrated Onions", href: "/dehydrated-onions" },
  { label: "Dehydrated Garlic", href: "/dehydrated-garlic" },
  { label: "Sourcing", href: "/sourcing" },
  { label: "Certificates", href: "/certificates" },
  { label: "Blog", href: "/blog" },
];

export const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "Our products", href: "/products" },
      { label: "Applications", href: "/#applications" },
      { label: "About us", href: "/about" },
      { label: "Our plant", href: "/about/plant" },
      { label: "Our process", href: "/about/process" },
    ],
  },
  {
    title: "Useful information",
    links: [
      { label: "Quality & food safety", href: "/about/quality-food-safety" },
      { label: "Certificates & downloads", href: "/certificates" },
      { label: "Packaging & export", href: "/about/packaging-export" },
      { label: "Responsible manufacturing", href: "/about/responsible-manufacturing" },
      { label: "Buyer FAQs", href: "/faq" },
    ],
  },
] as const;

/** Supported languages. */
export const locales = [
  { code: "en", label: "English", enabled: true },
  { code: "hi", label: "हिन्दी", enabled: true },
  { code: "gu", label: "ગુજરાતી", enabled: true },
] as const;

export function whatsappLink(message?: string, number = site.contact.whatsappNumber) {
  const text = message ?? "Hello OM Food and Spices LLP, I would like to enquire about your dehydrated onion and garlic products.";
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

