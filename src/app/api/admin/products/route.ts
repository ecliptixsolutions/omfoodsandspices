import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { audit, requireAdmin, requireSameOrigin } from "@/lib/admin/auth.server";
import { getAdminDb, type DbRow } from "@/lib/admin/db.server";
import type { Product } from "@/content/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const editorRoles = ["owner", "manager", "editor"] as const;

function decode(value: unknown): Product | null {
  try { return typeof value === "string" ? JSON.parse(value) as Product : value as Product; }
  catch { return null; }
}

function validProduct(p: unknown): p is Product {
  if (!p || typeof p !== "object") return false;
  const x = p as Record<string, unknown>;
  return typeof x.slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x.slug) &&
    typeof x.name === "string" && x.name.length > 0 && x.name.length <= 160 &&
    typeof x.shortName === "string" && typeof x.description === "string" && typeof x.overview === "string" &&
    (x.category === "onion" || x.category === "garlic") &&
    ["fresh", "flakes", "minced", "granules", "powder"].includes(String(x.form)) &&
    Array.isArray(x.forms) && Array.isArray(x.applications) &&
    typeof x.image === "string" && typeof x.imageAlt === "string" && typeof x.seoTitle === "string" && typeof x.seoDescription === "string";
}

export async function GET() {
  try {
    await requireAdmin(["owner", "manager", "editor", "viewer"]);
    const [rows] = await getAdminDb().query<DbRow[]>("SELECT id,slug,category,status,display_order,draft_json,published_json,published_at,updated_at FROM om_products ORDER BY display_order,updated_at DESC");
    return NextResponse.json({ products: rows.map((r) => ({ id: r.id, slug: r.slug, category: r.category, status: r.status, displayOrder: r.display_order, draft: decode(r.draft_json), published: decode(r.published_json), publishedAt: r.published_at, updatedAt: r.updated_at })) });
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: Request) {
  try {
    await requireSameOrigin(request);
    const admin = await requireAdmin(editorRoles);
    const body = await request.json() as { id?: string; product?: unknown; publish?: boolean; displayOrder?: number };
    if (!validProduct(body.product)) return NextResponse.json({ message: "Product details are incomplete or invalid." }, { status: 422 });
    if (body.id && !/^[0-9a-f-]{36}$/i.test(body.id)) return NextResponse.json({ message: "Invalid product identifier." }, { status: 400 });
    const product = body.product;
    const publish = body.publish === true;
    const db = getAdminDb();
    const [categoryRows] = await db.execute<DbRow[]>("SELECT id,status FROM om_categories WHERE slug=? LIMIT 1", [product.category]);
    if (!categoryRows[0]) return NextResponse.json({ message: "Choose a category that exists." }, { status: 422 });
    if (publish && categoryRows[0].status !== "published") return NextResponse.json({ message: "Publish this category before publishing its product." }, { status: 409 });
    const [existing] = await db.execute<DbRow[]>(body.id ? "SELECT id FROM om_products WHERE id=? LIMIT 1" : "SELECT id FROM om_products WHERE slug=? LIMIT 1", [body.id ?? product.slug]);
    if (!body.id && existing[0]) return NextResponse.json({ message: "A product with this URL slug already exists." }, { status: 409 });
    if (body.id && !existing[0]) return NextResponse.json({ message: "Product not found." }, { status: 404 });
    if (body.id) {
      const [duplicate] = await db.execute<DbRow[]>("SELECT id FROM om_products WHERE slug=? AND id<>? LIMIT 1", [product.slug, body.id]);
      if (duplicate[0]) return NextResponse.json({ message: "A product with this URL slug already exists." }, { status: 409 });
    }
    const id = String(existing[0]?.id ?? randomUUID());
    if (existing[0]) {
      await db.execute(
        "UPDATE om_products SET slug=?,category_id=?,category=?,status=IF(?, 'published',status),display_order=?,draft_json=?,published_json=IF(?,?,published_json),published_at=IF(?,UTC_TIMESTAMP(),published_at),published_by=IF(?,?,published_by) WHERE id=?",
        [product.slug, categoryRows[0].id, product.category, publish, Number(body.displayOrder ?? 0), JSON.stringify(product), publish, JSON.stringify(product), publish, admin.id, admin.id, id],
      );
    } else {
      await db.execute(
        "INSERT INTO om_products (id,slug,category_id,category,status,display_order,draft_json,published_json,published_at,published_by) VALUES (?,?,?,?, ?, ?, ?, ?, IF(?,UTC_TIMESTAMP(),NULL), IF(?,?,NULL))",
        [id, product.slug, categoryRows[0].id, product.category, publish ? "published" : "draft", Number(body.displayOrder ?? 0), JSON.stringify(product), publish ? JSON.stringify(product) : null, publish, publish, admin.id],
      );
    }
    const [snapshot] = await db.execute<DbRow[]>("SELECT draft_json FROM om_products WHERE id=?", [id]);
    if (publish) {
      const mediaIds = [product.image, ...(product.galleryImages ?? [])].flatMap((url) => Array.from(url.matchAll(/\/api\/media\/([0-9a-f-]{36})/gi), (match) => match[1]));
      for (const mediaId of mediaIds) await db.execute("UPDATE om_media SET is_public=TRUE WHERE id=?", [mediaId]);
    }
    await db.execute("INSERT INTO om_content_versions (id,content_key,content_json,actor_id,action) VALUES (?,?,?,?,?)", [randomUUID(), `product:${product.slug}`, JSON.stringify(product), admin.id, publish ? "published" : "draft_saved"]);
    await audit(admin.id, existing[0] ? (publish ? "product.published" : "product.draft_saved") : "product.created", "product", id);
    return NextResponse.json({ ok: true, id, draft: decode(snapshot[0]?.draft_json) });
  } catch (error) { return errorResponse(error); }
}

export async function DELETE(request: Request) {
  try {
    await requireSameOrigin(request);
    const admin = await requireAdmin(["owner"]);
    const { id } = await request.json() as { id?: string };
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ message: "Invalid product." }, { status: 400 });
    const db = getAdminDb();
    const [rows] = await db.execute<DbRow[]>("SELECT slug FROM om_products WHERE id=?", [id]);
    if (!rows[0]) return NextResponse.json({ message: "Product not found." }, { status: 404 });
    await db.execute("DELETE FROM om_products WHERE id=?", [id]);
    await audit(admin.id, "product.deleted", "product", id, { slug: rows[0].slug });
    return NextResponse.json({ ok: true });
  } catch (error) { return errorResponse(error); }
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Request failed.";
  const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : message === "Invalid request origin" ? 403 : 503;
  if (status === 503) console.error("Admin product operation failed", error);
  return NextResponse.json({ message: status === 503 ? "Product management is unavailable. Check MySQL configuration." : message }, { status });
}
