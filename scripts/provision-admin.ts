import { randomUUID, scrypt as scryptCb } from "node:crypto";
import mysql from "mysql2/promise";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {

const uri = process.env.MYSQL_URL;
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (!uri || !email || !password) throw new Error("Set MYSQL_URL, ADMIN_EMAIL, and ADMIN_PASSWORD in .env.local before provisioning.");
if (password.length < 16 || password.length > 200) throw new Error("ADMIN_PASSWORD must be 16–200 characters.");
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("ADMIN_EMAIL must be a valid email address.");

const parsedUri = new URL(uri);
if (parsedUri.protocol !== "mysql:" && parsedUri.protocol !== "mysql2:") throw new Error("MYSQL_URL must use the mysql:// scheme.");

const salt = randomUUID().replaceAll("-", "");
const passwordHash = await new Promise<string>((resolve, reject) => {
  scryptCb(password, salt, 64, (error, key) => error ? reject(error) : resolve(`scrypt$${salt}$${key.toString("hex")}`));
});
const db = await mysql.createConnection({
  host: parsedUri.hostname,
  port: parsedUri.port ? Number(parsedUri.port) : 3306,
  user: decodeURIComponent(parsedUri.username),
  password: decodeURIComponent(parsedUri.password),
  database: decodeURIComponent(parsedUri.pathname.slice(1)),
  ssl: parsedUri.searchParams.get("ssl") === "false" ? undefined : { rejectUnauthorized: true },
  charset: "utf8mb4",
});
try {
  const [rows] = await db.execute<mysql.RowDataPacket[]>("SELECT id,role FROM om_admin_users WHERE email=? LIMIT 1", [email]);
  if (rows[0] && rows[0].role !== "owner") throw new Error("That email is already assigned to a non-owner account; refusing to change its role.");
  await db.execute(
    "INSERT INTO om_admin_users (id,email,password_hash,role,active) VALUES (?,?,?,'owner',TRUE) ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash),role='owner',active=TRUE",
    [rows[0]?.id ?? randomUUID(), email, passwordHash],
  );
  console.log("Owner account provisioned. Sign in at /admin/login; credentials were not printed.");
} finally {
  await db.end();
}
}

main().catch((error: unknown) => { console.error("Owner account provisioning failed:", error instanceof Error ? error.message : error); process.exitCode = 1; });
