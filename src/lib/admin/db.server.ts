import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var omAdminPool: Pool | undefined;
}

export function canUseMySql() {
  return Boolean(process.env.MYSQL_URL) && process.env.OM_RUNTIME !== "cloudflare";
}

export function getAdminDb() {
  const uri = process.env.MYSQL_URL;
  if (!canUseMySql() || !uri) throw new Error("MySQL is not available in this runtime.");
  globalThis.omAdminPool ??= mysql.createPool({
    ...mysqlUriOptions(uri),
    charset: "utf8mb4",
    connectionLimit: 2,
    maxIdle: 2,
    idleTimeout: 300000,
    connectTimeout: 5000,
    enableKeepAlive: true,
    waitForConnections: true,
    queueLimit: 0,
    timezone: "Z",
  });
  return globalThis.omAdminPool;
}

function mysqlUriOptions(uri: string): mysql.PoolOptions {
  const parsed = new URL(uri);
  if (parsed.protocol !== "mysql:" && parsed.protocol !== "mysql2:") throw new Error("MYSQL_URL must use the mysql:// scheme.");
  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: decodeURIComponent(parsed.pathname.slice(1)),
    ssl: parsed.searchParams.get("ssl") === "false" ? undefined : { rejectUnauthorized: true },
  };
}

export type DbRow = RowDataPacket;
