import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth.server";
import { getAdminDb, type DbRow } from "@/lib/admin/db.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin(["owner", "manager", "editor", "sales", "viewer"]);
    const db = getAdminDb();
    const [[products], [categories], [enquiries], [activity]] = await Promise.all([
      db.query<DbRow[]>("SELECT status,category,COUNT(*) AS total FROM om_products GROUP BY status,category"),
      db.query<DbRow[]>("SELECT status,COUNT(*) AS total FROM om_categories GROUP BY status"),
      db.query<DbRow[]>("SELECT status,COUNT(*) AS total FROM om_enquiries GROUP BY status"),
      db.query<DbRow[]>("SELECT a.id,a.action,a.entity,a.entity_id,a.created_at,u.email FROM om_admin_activity a LEFT JOIN om_admin_users u ON u.id=a.admin_id ORDER BY a.created_at DESC LIMIT 8"),
    ]);
    const [[recent], [recentProducts]] = await Promise.all([
      db.query<DbRow[]>("SELECT id,customer_name,company_name,email,phone,country,product_names,type,message,status,created_at FROM om_enquiries ORDER BY created_at DESC LIMIT 6"),
      db.query<DbRow[]>("SELECT id,slug,status,updated_at,COALESCE(draft_json,published_json) AS content_json FROM om_products ORDER BY updated_at DESC LIMIT 6"),
    ]);
    return NextResponse.json({ products, categories, enquiries, activity, recent, recentProducts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 503;
    if (status === 503) console.error("Admin dashboard unavailable", error);
    return NextResponse.json({ message: status === 503 ? "Dashboard data is unavailable. Check MySQL configuration." : message }, { status });
  }
}
