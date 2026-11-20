import {invalidatePublicContent} from "../public-db.server";
import "server-only";
import {cache} from "react";
import { createHash, randomBytes, randomUUID, scrypt as scryptCb, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { getAdminDb, type DbRow } from "./db.server";

const COOKIE = "om_admin_session";
const PREVIEW_COOKIE = "om_admin_preview";
const SESSION_SECONDS = 12 * 60 * 60;
const hash = (v: string) => createHash("sha256").update(v).digest("hex");
const dummySalt = "om-admin-auth-dummy";
const dummyHash = `scrypt$${dummySalt}$${scryptSync("not-a-real-password", dummySalt, 64).toString("hex")}`;

function passwordMatches(password: string, encoded: string) {
  const [scheme, salt, expected] = encoded.split("$");
  if (scheme !== "scrypt" || !salt || !/^[a-f\d]{128}$/i.test(expected ?? "")) return Promise.resolve(false);
  return new Promise<boolean>((resolve, reject) => {
    scryptCb(password, salt, 64, (error, derived) => {
      if (error) return reject(error);
      const expectedBytes = Buffer.from(expected, "hex");
      resolve(expectedBytes.length === derived.length && timingSafeEqual(expectedBytes, derived));
    });
  });
}

export function verifyAdminPassword(password: string, encoded: string) { return passwordMatches(password, encoded); }
export function hashAdminPassword(password: string) {
  const salt = randomBytes(24).toString("hex");
  return new Promise<string>((resolve,reject)=>scryptCb(password,salt,64,(error,key)=>error?reject(error):resolve(`scrypt$${salt}$${key.toString("hex")}`)));
}

export type AdminIdentity = { id: string; email: string; role: "owner" | "manager" | "editor" | "sales" | "viewer" };

export async function signIn(email: string, password: string, ipAddress: string) {
  const db = getAdminDb();
  const normalized = email.trim().toLowerCase();
  const emailHash = hash(normalized);
  const ipHash = hash(ipAddress || "unknown");
  const [limits] = await db.execute<DbRow[]>("SELECT blocked_until > UTC_TIMESTAMP() AS blocked FROM om_admin_login_attempts WHERE email_hash=? AND ip_hash=?", [emailHash, ipHash]);
  if (limits[0]?.blocked) return false;
  const [rows] = await db.execute<DbRow[]>("SELECT id,email,password_hash,role FROM om_admin_users WHERE email=? AND active=1 LIMIT 1", [normalized]);
  const admin = rows[0];
  const valid = await passwordMatches(password, String(admin?.password_hash ?? dummyHash));
  if (!admin || !valid) {
    await db.execute(
      "INSERT INTO om_admin_login_attempts (email_hash,ip_hash,failure_count,window_started_at) VALUES (?,?,1,UTC_TIMESTAMP()) ON DUPLICATE KEY UPDATE failure_count=IF(window_started_at < UTC_TIMESTAMP() - INTERVAL 15 MINUTE,1,failure_count+1),window_started_at=IF(window_started_at < UTC_TIMESTAMP() - INTERVAL 15 MINUTE,UTC_TIMESTAMP(),window_started_at),blocked_until=CASE WHEN failure_count>=4 THEN UTC_TIMESTAMP() + INTERVAL 15 MINUTE ELSE blocked_until END",
      [emailHash, ipHash],
    );
    return false;
  }
  await db.execute("DELETE FROM om_admin_login_attempts WHERE email_hash=? AND ip_hash=?", [emailHash, ipHash]);
  const token = randomBytes(32).toString("base64url");
  await db.execute("INSERT INTO om_admin_sessions (id,admin_id,token_hash,expires_at) VALUES (?,?,?,DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? SECOND))", [randomUUID(), admin.id, hash(token), SESSION_SECONDS]);
  const jar = await cookies();
  jar.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_SECONDS });
  await db.execute("INSERT INTO om_admin_activity (id,admin_id,action,entity) VALUES (?,?,?,?)", [randomUUID(), admin.id, "admin.login", "session"]);
  return true;
}

export const currentAdmin=cache(async function currentAdmin(): Promise<AdminIdentity | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const [rows] = await getAdminDb().execute<DbRow[]>("SELECT u.id,u.email,u.role FROM om_admin_sessions s JOIN om_admin_users u ON u.id=s.admin_id WHERE s.token_hash=? AND s.expires_at>UTC_TIMESTAMP() AND u.active=1 LIMIT 1", [hash(token)]);
  const row = rows[0];
  return row ? { id: String(row.id), email: String(row.email), role: row.role } : null;
});

export async function isAdminPreview() {
  const jar = await cookies();
  return jar.get(PREVIEW_COOKIE)?.value === "1" && Boolean(await currentAdmin());
}

export async function setAdminPreview(enabled: boolean) {
  const jar = await cookies();
  jar.set(PREVIEW_COOKIE, enabled ? "1" : "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: enabled ? 600 : 0 });
}

export async function requireAdmin(roles?: readonly AdminIdentity["role"][]) {
  const admin = await currentAdmin();
  if (!admin) throw new Error("Unauthorized");
  if (roles && !roles.includes(admin.role)) throw new Error("Forbidden");
  return admin;
}

export async function signOut() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await getAdminDb().execute("DELETE FROM om_admin_sessions WHERE token_hash=?", [hash(token)]);
  jar.set(COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}

export async function requireSameOrigin(request: Request) {
  const h = await headers();
  const origin = request.headers.get("origin");
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http");
  if (!origin || !host || new URL(origin).host !== host || new URL(origin).protocol !== `${proto}:`) throw new Error("Invalid request origin");
}

export async function audit(adminId: string, action: string, entity: string, entityId?: string, metadata?: object) {
  if (!["auth", "session", "admin_user", "enquiry"].includes(entity)) invalidatePublicContent();
  await getAdminDb().execute("INSERT INTO om_admin_activity (id,admin_id,action,entity,entity_id,metadata) VALUES (?,?,?,?,?,?)", [randomUUID(), adminId, action, entity, entityId ?? null, metadata ? JSON.stringify(metadata) : null]);
}
