/** Shared enquiry types + validation. Used by the form (client) and the API route (server). */

export const QUANTITY_UNITS = ["Sample / Trial Order", "kg", "MT (metric tonnes)"] as const;
export const PACKAGING_OPTIONS = [
  "Not sure yet — please advise",
  "Small packs",
  "Bulk packs",
  "Custom packaging",
  "Other (describe in message)",
] as const;
export const TIMELINE_OPTIONS = [
  "As soon as possible",
  "Within 1 month",
  "1–3 months",
  "Just exploring",
] as const;

export type EnquiryType = "quote" | "sample";

export type EnquiryPayload = {
  type: EnquiryType;
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  products: string[]; // product names
  formSize: string;
  quantity: string;
  unit: string;
  packaging: string;
  destination: string;
  timeline: string;
  message: string;
  /** honeypot — must stay empty */
  website: string;
  /** ms timestamp when the form was rendered, for a minimum-fill-time check */
  startedAt: number;
  recaptchaToken?: string;
};

export type FieldErrors = Partial<Record<keyof EnquiryPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;

export function validateEnquiry(p: Partial<EnquiryPayload>): FieldErrors {
  const e: FieldErrors = {};
  const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  if (s(p.name).length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(s(p.email))) e.email = "Please enter a valid email address.";
  if (s(p.phone) && !PHONE_RE.test(s(p.phone))) e.phone = "Please enter a valid phone / WhatsApp number.";
  if (s(p.country).length < 2) e.country = "Please enter your country.";
  if (!Array.isArray(p.products) || p.products.length === 0) e.products = "Please select at least one product.";
  const isSample = s(p.unit) === "Sample / Trial Order";
  if (!isSample && !s(p.quantity)) e.quantity = "Please enter the quantity you need, or choose Sample / Trial Order.";
  if (s(p.quantity) && !isSample && !/^[\d.,\s\-–+kKmMtT]+$/.test(s(p.quantity)))
    e.quantity = "Use numbers only, for example 500 or 1,000.";
  if (s(p.message).length > 2000) e.message = "Please keep your message under 2000 characters.";
  for (const k of ["company", "formSize", "destination"] as const) {
    if (s(p[k]).length > 200) e[k] = "That is too long.";
  }
  return e;
}

export function productListText(products: string[]) {
  return products.length ? products.join(", ") : "your products";
}

export function enquiryToText(p: EnquiryPayload): string {
  const line = (k: string, v: string) => `${k}: ${v?.trim() || "—"}`;
  return [
    `New ${p.type === "sample" ? "SAMPLE" : "QUOTATION"} enquiry from the OM Food and Spices website`,
    "",
    line("Name", p.name),
    line("Company", p.company),
    line("Email", p.email),
    line("Phone / WhatsApp", p.phone),
    line("Country", p.country),
    "",
    line("Products", p.products.join(", ")),
    line("Form / size / mesh", p.formSize),
    line("Required quantity", p.unit === "Sample / Trial Order" ? "Sample / Trial Order" : `${p.quantity} ${p.unit}`),
    line("Packaging preference", p.packaging),
    line("Destination", p.destination),
    line("Delivery timeline", p.timeline),
    "",
    "Message:",
    p.message?.trim() || "—",
  ].join("\n");
}
