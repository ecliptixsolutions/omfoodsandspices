import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/admin/auth.server";
import { getAdminDb, type DbRow } from "@/lib/admin/db.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new NextResponse(null, { status: 404 });
  try {
    const admin = await currentAdmin();
    const [rows] = await getAdminDb().execute<DbRow[]>("SELECT mime_type,image_data,is_public FROM om_media WHERE id=? LIMIT 1", [id]);
    const row = rows[0];
    if (!row || (!row.is_public && !admin)) return new NextResponse(null, { status: 404 });
    const body = Buffer.isBuffer(row.image_data) ? row.image_data : Buffer.from(row.image_data);
    return new NextResponse(body, { headers: { "Content-Type": String(row.mime_type), "Content-Length": String(body.length), "Cache-Control": row.is_public ? "public, max-age=31536000, immutable" : "private, no-store", "X-Content-Type-Options": "nosniff", ...(!row.is_public ? { "X-Robots-Tag": "noindex, nofollow" } : {}) } });
  } catch (error) {
    console.error("Media image unavailable", error);
    return new NextResponse(null, { status: 503 });
  }
}
