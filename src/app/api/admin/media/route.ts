import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { NextResponse } from "next/server";
import { audit, requireAdmin, requireSameOrigin } from "@/lib/admin/auth.server";
import { getAdminDb, type DbRow } from "@/lib/admin/db.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function GET() {
  try {
    await requireAdmin(["owner", "manager", "editor", "viewer"]);
    const [rows] = await getAdminDb().query<DbRow[]>("SELECT id,filename,mime_type,byte_size,width,height,alt_text,category,is_public,created_at FROM om_media ORDER BY created_at DESC LIMIT 250");
    return NextResponse.json({ media: rows.map((r) => ({ ...r, url: `/api/media/${r.id}` })) });
  } catch (error) { return failure(error); }
}

export async function POST(request: Request) {
  try {
    await requireSameOrigin(request);
    const admin = await requireAdmin(["owner", "manager", "editor"]);
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !allowedTypes.has(file.type)) return NextResponse.json({ message: "Choose a JPEG, PNG, WebP or AVIF image." }, { status: 422 });
    if (file.size < 1 || file.size > 5 * 1024 * 1024) return NextResponse.json({ message: "Images must be 5 MB or smaller." }, { status: 413 });
    const original = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(original, { limitInputPixels: 40_000_000 }).metadata();
    if (!metadata.format || !["jpeg", "png", "webp", "avif"].includes(metadata.format)) return NextResponse.json({ message: "That file is not a supported image." }, { status: 422 });
    const mime = `image/${metadata.format === "jpeg" ? "jpeg" : metadata.format}`;
    if (mime !== file.type) return NextResponse.json({ message: "The uploaded file content does not match its image type." }, { status: 422 });
    const id = randomUUID();
    const alt = String(form.get("altText") ?? "").trim().slice(0, 500);
    const categoryRaw = String(form.get("category") ?? "other");
    const category = ["product", "homepage", "about", "gallery", "other"].includes(categoryRaw) ? categoryRaw : "other";
    const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 255) || "image";
    await getAdminDb().execute("INSERT INTO om_media (id,filename,mime_type,byte_size,width,height,alt_text,category,image_data,uploaded_by) VALUES (?,?,?,?,?,?,?,?,?,?)", [id, filename, mime, original.length, metadata.width ?? null, metadata.height ?? null, alt, category, original, admin.id]);
    await audit(admin.id, "media.uploaded", "media", id, { filename, byteSize: original.length });
    return NextResponse.json({ ok: true, id, url: `/api/media/${id}`, width: metadata.width, height: metadata.height });
  } catch (error) { return failure(error); }
}

export async function DELETE(request: Request) {
  try {
    await requireSameOrigin(request);
    const admin = await requireAdmin(["owner", "manager"]);
    const { id } = await request.json() as { id?: string };
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ message: "Invalid image." }, { status: 400 });
    const db = getAdminDb();
    const needle = `%/api/media/${id}%`;
    const [[products], [content], [blogs]] = await Promise.all([
      db.execute<DbRow[]>("SELECT id FROM om_products WHERE CAST(draft_json AS CHAR) LIKE ? OR CAST(published_json AS CHAR) LIKE ? LIMIT 1", [needle, needle]),
      db.execute<DbRow[]>("SELECT content_key FROM om_site_content WHERE CAST(draft_json AS CHAR) LIKE ? OR CAST(published_json AS CHAR) LIKE ? LIMIT 1", [needle, needle]),
      db.execute<DbRow[]>("SELECT id FROM om_blog_posts WHERE CAST(draft_json AS CHAR) LIKE ? OR CAST(published_json AS CHAR) LIKE ? LIMIT 1", [needle, needle]),
    ]);
    if (products.length || content.length || blogs.length) return NextResponse.json({ message: "This image is still used by website content. Replace its reference before deleting it." }, { status: 409 });
    const [result] = await db.execute("DELETE FROM om_media WHERE id=?", [id]);
    if ("affectedRows" in result && result.affectedRows === 0) return NextResponse.json({ message: "Image not found." }, { status: 404 });
    await audit(admin.id, "media.deleted", "media", id);
    return NextResponse.json({ ok: true });
  } catch (error) { return failure(error); }
}

function failure(error: unknown) {
  const message = error instanceof Error ? error.message : "Request failed.";
  const status = message === "Unauthorized" ? 401 : message === "Forbidden" || message === "Invalid request origin" ? 403 : 503;
  if (status === 503) console.error("Admin media operation failed", error);
  return NextResponse.json({ message: status === 503 ? "Media library is unavailable. Check MySQL configuration." : message }, { status });
}
