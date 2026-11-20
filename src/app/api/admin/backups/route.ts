import { createHash, randomUUID } from "node:crypto";
import { gunzip, gzip } from "node:zlib";
import { promisify } from "node:util";
import { NextResponse } from "next/server";
import { audit, requireAdmin, requireSameOrigin } from "@/lib/admin/auth.server";
import { getAdminDb, type DbRow } from "@/lib/admin/db.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const compress = promisify(gzip);
const decompress = promisify(gunzip);
const tables = ["om_categories", "om_products", "om_media", "om_site_content", "om_content_versions", "om_enquiries", "om_enquiry_notes", "om_blog_categories", "om_blog_posts", "om_blog_versions", "om_blog_settings"] as const;
const digest = (value: Buffer) => createHash("sha256").update(value).digest("hex");

export async function GET() {
  try {
    await requireAdmin(["owner"]);
    const [rows] = await getAdminDb().query<DbRow[]>("SELECT b.id,b.filename,b.byte_size,b.checksum,b.created_at,u.email AS created_by FROM om_admin_backups b LEFT JOIN om_admin_users u ON u.id=b.created_by ORDER BY b.created_at DESC LIMIT 100");
    return NextResponse.json({ backups: rows });
  } catch (error) { return fail(error); }
}

export async function POST(request: Request) {
  try {
    await requireSameOrigin(request);
    const admin = await requireAdmin(["owner"]);
    const body = await request.json() as { action?: string; id?: string; confirmation?: string };
    const db = getAdminDb();

    if (body.action === "create") {
      const snapshot: Record<string, unknown[]> = {};
      for (const table of tables) {
        const [rows] = await db.query<DbRow[]>(`SELECT * FROM ${table}`);
        snapshot[table] = rows;
      }
      const data = await compress(Buffer.from(JSON.stringify({ format: 1, createdAt: new Date().toISOString(), tables: snapshot })));
      const id = randomUUID();
      const date = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `om-food-cms-${date}.json.gz`;
      const checksum = digest(data);
      await db.execute("INSERT INTO om_admin_backups (id,filename,byte_size,checksum,backup_data,created_by) VALUES (?,?,?,?,?,?)", [id, filename, data.length, checksum, data, admin.id]);
      await audit(admin.id, "backup.created", "backup", id, { byteSize: data.length, checksum });
      return NextResponse.json({ ok: true, id, filename, byteSize: data.length, checksum });
    }

    if (body.action === "restore") {
      if (!body.id || !/^[0-9a-f-]{36}$/i.test(body.id) || body.confirmation !== "RESTORE CONTENTS") return NextResponse.json({ message: "Choose a backup and enter RESTORE CONTENTS to confirm." }, { status: 422 });
      const [rows] = await db.execute<DbRow[]>("SELECT filename,checksum,backup_data FROM om_admin_backups WHERE id=? LIMIT 1", [body.id]);
      const row = rows[0];
      if (!row || !Buffer.isBuffer(row.backup_data)) return NextResponse.json({ message: "Backup not found or unreadable." }, { status: 404 });
      const archive = row.backup_data as Buffer;
      if (digest(archive) !== row.checksum) return NextResponse.json({ message: "Backup checksum does not match. Restore was stopped." }, { status: 409 });
      const parsed = JSON.parse((await decompress(archive)).toString("utf8")) as { format?: number; tables?: Record<string, unknown[]> };
      if (parsed.format !== 1 || !parsed.tables || tables.some((table) => !Array.isArray(parsed.tables?.[table]))) return NextResponse.json({ message: "Backup format is invalid or incomplete." }, { status: 422 });
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();
        await connection.query("SET FOREIGN_KEY_CHECKS=0");
        for (const table of [...tables].reverse()) await connection.query(`DELETE FROM ${table}`);
        for (const table of tables) {
          const records = parsed.tables[table] as Record<string, unknown>[];
          if (!records.length) continue;
          const columns = Object.keys(records[0]);
          const columnSql = columns.map((column) => "`" + String(column).replaceAll("`", "") + "`").join(",");
          const valuesSql = `(${columns.map(() => "?").join(",")})`;
          for (const record of records) {
            const values = columns.map((column) => {
              const value = restoreBuffer(record[column]);
              return value && typeof value === "object" && !Buffer.isBuffer(value) && !(value instanceof Date) ? JSON.stringify(value) : value;
            });
            await connection.execute(`INSERT INTO ${table} (${columnSql}) VALUES ${valuesSql}`, values as (string | number | bigint | boolean | Date | null | Buffer)[]);
          }
        }
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        await connection.query("SET FOREIGN_KEY_CHECKS=1");
        connection.release();
      }
      await audit(admin.id, "backup.restored", "backup", body.id, { filename: row.filename });
      return NextResponse.json({ ok: true, restored: row.filename });
    }
    return NextResponse.json({ message: "Choose create or restore." }, { status: 422 });
  } catch (error) { return fail(error); }
}

function restoreBuffer(value: unknown): unknown {
  if (value && typeof value === "object" && "type" in value && value.type === "Buffer" && "data" in value && Array.isArray(value.data)) return Buffer.from(value.data as number[]);
  if (Array.isArray(value)) return value.map(restoreBuffer);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, restoreBuffer(item)]));
  return value;
}

function fail(error: unknown) {
  const message = error instanceof Error ? error.message : "Request failed.";
  const status = message === "Unauthorized" ? 401 : message === "Forbidden" || message === "Invalid request origin" ? 403 : 503;
  if (status === 503) console.error("Admin backup operation failed", error);
  return NextResponse.json({ message: status === 503 ? "Backup management is unavailable. Check MySQL configuration." : message }, { status });
}
