import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { audit, requireAdmin, requireSameOrigin } from "@/lib/admin/auth.server";
import { getAdminDb, type DbRow } from "@/lib/admin/db.server";
import { infoPages, sourcingPage } from "@/content/pages";
import * as homeDefaults from "@/content/home";
import { site } from "@/content/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const allowedKeys = new Set(["home", "contact", "general", ...infoPages.map((page) => `page:${page.path}`), "page:/sourcing"]);

export async function GET(request: Request) {
  try {
    await requireAdmin(["owner", "manager", "editor", "viewer"]);
    const requestedKey = new URL(request.url).searchParams.get("key");
    if (requestedKey && !allowedKeys.has(requestedKey)) return NextResponse.json({ message: "Unknown content section." }, { status: 404 });
    if (requestedKey) {
      const [rows] = await getAdminDb().execute<DbRow[]>("SELECT content_key,draft_json,published_json,published_at,updated_at FROM om_site_content WHERE content_key=? LIMIT 1", [requestedKey]);
      const stored = rows[0];
      const fallback = defaultContent(requestedKey);
      return NextResponse.json({ content: stored ? { key: stored.content_key, draft: decode(stored.draft_json), published: decode(stored.published_json), publishedAt: stored.published_at, updatedAt: stored.updated_at } : { key: requestedKey, draft: fallback, published: fallback, publishedAt: null, updatedAt: null } });
    }
    const [rows] = await getAdminDb().query<DbRow[]>("SELECT content_key,draft_json,published_json,published_at,updated_at FROM om_site_content ORDER BY content_key");
    return NextResponse.json({ content: rows.map((r) => ({ key: r.content_key, draft: decode(r.draft_json), published: decode(r.published_json), publishedAt: r.published_at, updatedAt: r.updated_at })) });
  } catch (error) { return failure(error); }
}

export async function PATCH(request: Request) {
  try {
    await requireSameOrigin(request);
    const admin = await requireAdmin(["owner", "manager", "editor"]);
    const body = await request.json() as { key?: string; value?: unknown; publish?: boolean };
    if (!body.key || !allowedKeys.has(body.key) || !body.value || typeof body.value !== "object") return NextResponse.json({ message: "Invalid content update." }, { status: 422 });
    const serialized = JSON.stringify(body.value);
    if (serialized.length > 100_000) return NextResponse.json({ message: "Content is too large." }, { status: 413 });
    const fallback = defaultContent(body.key);
    if (!validContent(body.key, body.value, fallback)) return NextResponse.json({ message: "Check the required headings and section text." }, { status: 422 });
    const publish = body.publish === true;
    const db = getAdminDb();
    await db.execute("INSERT INTO om_site_content (content_key,draft_json,updated_by) VALUES (?,?,?) ON DUPLICATE KEY UPDATE draft_json=VALUES(draft_json),updated_by=VALUES(updated_by)", [body.key, serialized, admin.id]);
    if (publish) {
      await db.execute("UPDATE om_site_content SET published_json=?,published_by=?,published_at=UTC_TIMESTAMP() WHERE content_key=?", [serialized, admin.id, body.key]);
      const mediaIds = Array.from(serialized.matchAll(/\/api\/media\/([0-9a-f-]{36})/gi), (match) => match[1]);
      for (const mediaId of mediaIds) await db.execute("UPDATE om_media SET is_public=TRUE WHERE id=?", [mediaId]);
    }
    await db.execute("INSERT INTO om_content_versions (id,content_key,content_json,actor_id,action) VALUES (?,?,?,?,?)", [randomUUID(), body.key, serialized, admin.id, publish ? "published" : "draft_saved"]);
    await audit(admin.id, publish ? "content.published" : "content.draft_saved", body.key);
    return NextResponse.json({ ok: true, published: publish });
  } catch (error) { return failure(error); }
}

function decode(value: unknown) { try { return typeof value === "string" ? JSON.parse(value) : value; } catch { return null; } }
function defaultContent(key: string): unknown {
  if (key === "home") return homeDefaults;
  if (key === "contact") return site.contact;
  if (key === "general") return { companyName: site.name, websiteTitle: "Dehydrated Onion & Garlic Supplier India | OM Food", seoDescription: "Source onion flakes, minced onion, granules, powder and dehydrated garlic from Gujarat, India. Request samples, specifications and bulk export quotations.", logo: "/images/logo.png" };
  if (key === "page:/sourcing") return sourcingPage;
  return infoPages.find((page) => `page:${page.path}` === key) ?? null;
}
function validContent(_key: string, value: unknown, template: unknown): boolean {
  if (_key === "contact" && value && typeof value === "object") {
    const contact = { ...(value as Record<string, unknown>) };
    for (const key of ["mapsUrl", "facebookUrl", "instagramUrl", "linkedinUrl"]) {
      const url = contact[key];
      if (url !== undefined && (typeof url !== "string" || (url !== "" && !/^https?:\/\//i.test(url)))) return false;
      delete contact[key];
    }
    return validContent("", contact, template);
  }
  if (typeof template === "string") return typeof value === "string" && value.length <= 10000;
  if (typeof template === "number") return typeof value === "number" && Number.isFinite(value);
  if (typeof template === "boolean") return typeof value === "boolean";
  if (Array.isArray(template)) return Array.isArray(value) && (template.every((item) => typeof item === "string") ? value.length <= 30 && value.every((item) => typeof item === "string" && item.length <= 1000) : value.length === template.length && template.every((item, index) => validContent("", value[index], item)));
  if (template && typeof template === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const target = value as Record<string, unknown>;
    const original = template as Record<string, unknown>;
    return Object.keys(target).every((key) => key in original) && Object.entries(original).every(([key, item]) => item === undefined || key in target) && Object.entries(target).every(([key, item]) => validContent("", item, original[key]));
  }
  return value === template || value === undefined;
}
function failure(error: unknown) {
  const message = error instanceof Error ? error.message : "Request failed.";
  const status = message === "Unauthorized" ? 401 : message === "Forbidden" || message === "Invalid request origin" ? 403 : 503;
  if (status === 503) console.error("Admin content operation failed", error);
  return NextResponse.json({ message: status === 503 ? "Content management is unavailable. Check MySQL configuration." : message }, { status });
}
