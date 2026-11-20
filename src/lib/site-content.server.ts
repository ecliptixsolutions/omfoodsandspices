import "server-only";
import { cache } from "react";
import { unstable_rethrow } from "next/navigation";
import { site } from "@/content/site";
import { getAdminDb, type DbRow } from "@/lib/admin/db.server";
import * as homeDefaults from "@/content/home";
import { isAdminPreview } from "@/lib/admin/auth.server";
import {publicRows} from "./public-db.server";

export type ContactSettings = typeof site.contact & { mapsUrl?: string; facebookUrl?: string; instagramUrl?: string; linkedinUrl?: string };

export async function getPublishedContent<T>(key: string, fallback: T): Promise<T> {
  if (!process.env.MYSQL_URL) return fallback;
  try {
    const preview=await isAdminPreview();
    const sql=`SELECT ${preview?"draft_json":"published_json"} AS content_json FROM om_site_content WHERE content_key=? LIMIT 1`;
    const rows = preview ? (await getAdminDb().execute<DbRow[]>(sql,[key]))[0] : await publicRows(sql,[key]);
    const record = rows[0]?.content_json;
    if (!record) return fallback;
    return (typeof record === "string" ? JSON.parse(record) : record) as T;
  } catch (error) {
    unstable_rethrow(error);
    console.error(`Unable to load published ${key} content from MySQL`, error);
    return fallback;
  }
}

export async function getPublishedPage<T>(path: string, fallback: T): Promise<T> {
  return getPublishedContent(`page:${path}`, fallback);
}

export const getPublicContact = cache(async function getPublicContact() {
  const value = await getPublishedContent<Partial<ContactSettings>>("contact", site.contact);
  const combined = { ...site.contact, ...value };
  const phoneDigits = String(combined.phoneTel || "").replace(/[^+\d]/g, "");
  const whatsappDigits = String(combined.whatsappNumber || "").replace(/\D/g, "");
  return { ...combined, phoneTel: phoneDigits, whatsappNumber: whatsappDigits, phoneDisplay: String(combined.phoneDisplay || site.contact.phoneDisplay), addressLines: Array.isArray(combined.addressLines) ? combined.addressLines.map(String).slice(0, 8) : site.contact.addressLines } as ContactSettings;
});

export async function getPublicHome() {
  return getPublishedContent("home", homeDefaults);
}

export type GeneralSettings = { companyName: string; websiteTitle: string; seoDescription: string; logo: string };
export const getPublicGeneralSettings = cache(async function getPublicGeneralSettings(): Promise<GeneralSettings> {
  const fallback: GeneralSettings = { companyName: site.name, websiteTitle: "Dehydrated Onion & Garlic Supplier India | OM Food", seoDescription: "Source onion flakes, minced onion, granules, powder and dehydrated garlic from Gujarat, India. Request samples, specifications and bulk export quotations.", logo: "/images/logo.png" };
  const content = await getPublishedContent<Partial<GeneralSettings>>("general", fallback);
  return { companyName: String(content.companyName || fallback.companyName), websiteTitle: String(content.websiteTitle || fallback.websiteTitle), seoDescription: String(content.seoDescription || fallback.seoDescription), logo: String(content.logo || fallback.logo) };
});
