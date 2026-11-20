import { COUNTRIES } from "./countries";
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
export const FIELD_LIMITS = { name:160, email:255, phone:60, country:120, company:200, formSize:200, destination:200, quantity:120, message:2000 } as const;

export function sanitizePhoneInput(value: string): string {
  let digits = 0;
  return value.replace(/[^\d+\s().-]/g, "").split("").filter((char, index) => {
    if (char === "+") return index === 0;
    if (/\d/.test(char)) return ++digits <= 15;
    return true;
  }).join("");
}

export function validateEnquiry(input: unknown, availableProducts?: readonly string[]): FieldErrors {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { name: "Please check the highlighted fields." };
  const p = input as Record<string, unknown>;
  const e: FieldErrors = {};
  const s = (v: unknown) => typeof v === "string" ? v.trim() : "";
  if (s(p.name).length < 2 || s(p.name).length > 160 || !/\p{L}/u.test(s(p.name)) || /[\p{Cc}\p{N}<>]/u.test(s(p.name))) e.name = "Enter a name with 2–160 characters using letters.";
  if (!EMAIL_RE.test(s(p.email)) || s(p.email).length > 255) e.email = "Please enter a valid email address.";
  const phone = s(p.phone), digits = phone.replace(/\D/g, "");
  if (phone && (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15 || /^0+$/.test(digits) || phone.length > 60)) e.phone = "Enter a phone number with 7–15 digits, including country code.";
  if (!COUNTRIES.some(c => c.name === s(p.country))) e.country = "Please select a country.";
  if (!Array.isArray(p.products) || !p.products.length || p.products.length > 100 || p.products.some(x => typeof x !== "string" || !x.trim() || x.length > 160 || (availableProducts && !availableProducts.includes(x))) || new Set(p.products).size !== p.products.length) e.products = "Select one or more available products without duplicates.";
  if (p.type !== "quote" && p.type !== "sample") e.type = "Select a quotation or sample request.";
  if (!(QUANTITY_UNITS as readonly unknown[]).includes(p.unit)) e.unit = "Please select a valid quantity unit.";
  const sample = p.type === "sample";
  if ((sample && p.unit !== QUANTITY_UNITS[0]) || (!sample && p.unit === QUANTITY_UNITS[0])) e.unit = "Select a quantity unit that matches your request type.";
  const quantity = s(p.quantity);
  if (!sample && (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(quantity) || quantity.length > 120 || !Number.isFinite(Number(quantity.replaceAll(",", ""))) || Number(quantity.replaceAll(",", "")) <= 0)) e.quantity = "Enter a quantity greater than zero, for example 500 or 1,000.";
  if (sample && quantity) e.quantity = "Quantity is not required for sample requests.";
  if (!(PACKAGING_OPTIONS as readonly unknown[]).includes(p.packaging)) e.packaging = "Please select a packaging option.";
  if (!(TIMELINE_OPTIONS as readonly unknown[]).includes(p.timeline)) e.timeline = "Please select a delivery timeline.";
  if (s(p.message).length > 2000) e.message = "Please keep your message under 2000 characters.";
  for (const k of ["company", "formSize", "destination"] as const) if (s(p[k]).length > 200) e[k] = "Please use 200 characters or fewer.";
  for (const k of ["company", "phone", "formSize", "quantity", "destination", "message"] as const) if (p[k] !== undefined && typeof p[k] !== "string") e[k] = "Please enter text in this field.";
  return e;
}

export function normalizeEnquiry(p: Record<string, unknown>): EnquiryPayload {
  const text = (key: string) => typeof p[key] === "string" ? p[key].trim() : "";
  return { type: p.type as EnquiryType, name:text("name"), company:text("company"), email:text("email").toLowerCase(), phone:text("phone"), country:text("country"), products:p.products as string[], formSize:text("formSize"), quantity:text("quantity"), unit:text("unit"), packaging:text("packaging"), destination:text("destination"), timeline:text("timeline"), message:text("message"), website:text("website"), startedAt:Number(p.startedAt), recaptchaToken:text("recaptchaToken") };
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

