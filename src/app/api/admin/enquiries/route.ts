import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { audit, requireAdmin, requireSameOrigin } from "@/lib/admin/auth.server";
import { getAdminDb, type DbRow } from "@/lib/admin/db.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const readerRoles = ["owner", "manager", "sales", "viewer"] as const;

export async function GET(request: Request) {
  try {
    await requireAdmin(readerRoles);
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const search = (url.searchParams.get("q") ?? "").trim().slice(0, 120);
    const enquiryId = url.searchParams.get("id");
    const page = Math.max(1, Math.min(500, Number(url.searchParams.get("page") ?? 1) || 1));
    const pageSize = 50;
    const conditions: string[] = [];
    const args: (string | number)[] = [];
    if (url.searchParams.get("from") && /^\d{4}-\d{2}-\d{2}$/.test(url.searchParams.get("from")!)) { conditions.push("created_at>=?"); args.push(`${url.searchParams.get("from")} 00:00:00`); }
    if (url.searchParams.get("to") && /^\d{4}-\d{2}-\d{2}$/.test(url.searchParams.get("to")!)) { conditions.push("created_at<DATE_ADD(?, INTERVAL 1 DAY)"); args.push(`${url.searchParams.get("to")} 00:00:00`); }
    if (["new", "contacted", "in_progress", "completed", "cancelled"].includes(status ?? "")) { conditions.push("status=?"); args.push(status!); }
    if (search) {
      conditions.push("(customer_name LIKE ? OR company_name LIKE ? OR email LIKE ? OR product_names LIKE ? OR message LIKE ?)");
      args.push(...Array(5).fill(`%${search}%`));
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const db = getAdminDb();
    const [[rows], [countRows]] = await Promise.all([
      db.execute<DbRow[]>(`SELECT * FROM om_enquiries ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...args, pageSize, (page - 1) * pageSize]),
      db.execute<DbRow[]>(`SELECT COUNT(*) AS total FROM om_enquiries ${where}`, args),
    ]);
    const [notes] = enquiryId && /^[0-9a-f-]{36}$/i.test(enquiryId)
      ? await db.execute<DbRow[]>("SELECT n.id,n.enquiry_id,n.admin_id,n.note,n.created_at,u.email FROM om_enquiry_notes n LEFT JOIN om_admin_users u ON u.id=n.admin_id WHERE n.enquiry_id=? ORDER BY n.created_at DESC LIMIT 100", [enquiryId])
      : [[] as DbRow[]];
    return NextResponse.json({ enquiries: rows, notes, total: Number(countRows[0]?.total ?? 0), page, pageSize });
  } catch (error) { return errorResponse(error); }
}

export async function DELETE(request: Request) {
  try {
    await requireSameOrigin(request);
    const admin = await requireAdmin(["owner", "manager"]);
    const { id } = await request.json() as { id?: string };
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ message: "Invalid enquiry." }, { status: 400 });
    const [rows] = await getAdminDb().execute<DbRow[]>("SELECT customer_name FROM om_enquiries WHERE id=? LIMIT 1", [id]);
    if (!rows[0]) return NextResponse.json({ message: "Enquiry not found." }, { status: 404 });
    await getAdminDb().execute("DELETE FROM om_enquiries WHERE id=?", [id]);
    await audit(admin.id, "enquiry.deleted", "enquiry", id);
    return NextResponse.json({ ok: true });
  } catch (error) { return errorResponse(error); }
}

export async function PATCH(request: Request) {
  try {
    await requireSameOrigin(request);
    const admin = await requireAdmin(["owner", "manager", "sales"]);
    const body = await request.json() as { id?: string; status?: string; note?: string };
    if (!body.id || !/^[0-9a-f-]{36}$/i.test(body.id)) return NextResponse.json({ message: "Invalid enquiry." }, { status: 400 });
    const db = getAdminDb();
    if (body.status !== undefined) {
      if (!["new", "contacted", "in_progress", "completed", "cancelled"].includes(body.status)) return NextResponse.json({ message: "Invalid enquiry status." }, { status: 422 });
      const [result] = await db.execute("UPDATE om_enquiries SET status=? WHERE id=?", [body.status, body.id]);
      if ("affectedRows" in result && result.affectedRows === 0) return NextResponse.json({ message: "Enquiry not found." }, { status: 404 });
      await audit(admin.id, "enquiry.status_changed", "enquiry", body.id, { status: body.status });
    }
    if (body.note !== undefined) {
      const note = body.note.trim();
      if (!note || note.length > 4000) return NextResponse.json({ message: "Notes must contain 1 to 4000 characters." }, { status: 422 });
      await db.execute("INSERT INTO om_enquiry_notes (id,enquiry_id,admin_id,note) VALUES (?,?,?,?)", [randomUUID(), body.id, admin.id, note]);
      await audit(admin.id, "enquiry.note_added", "enquiry", body.id);
    }
    return NextResponse.json({ ok: true });
  } catch (error) { return errorResponse(error); }
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Request failed.";
  const status = message === "Unauthorized" ? 401 : message === "Forbidden" || message === "Invalid request origin" ? 403 : 503;
  if (status === 503) console.error("Admin enquiry operation failed", error);
  return NextResponse.json({ message: status === 503 ? "Enquiry management is unavailable. Check MySQL configuration." : message }, { status });
}

