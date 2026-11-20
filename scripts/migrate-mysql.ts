import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import mysql from "mysql2/promise";
import { loadEnvConfig } from "@next/env";
import { products } from "../src/content/products";
import * as homeContent from "../src/content/home";
import { site } from "../src/content/site";

loadEnvConfig(process.cwd());

async function main() {
const uri = process.env.MYSQL_URL;
if (!uri) throw new Error("Set MYSQL_URL in .env.local before running the migration.");

const parsedUri = new URL(uri);
if (parsedUri.protocol !== "mysql:" && parsedUri.protocol !== "mysql2:") throw new Error("MYSQL_URL must use the mysql:// scheme.");
const connection = await mysql.createConnection({
  host: parsedUri.hostname,
  port: parsedUri.port ? Number(parsedUri.port) : 3306,
  user: decodeURIComponent(parsedUri.username),
  password: decodeURIComponent(parsedUri.password),
  database: decodeURIComponent(parsedUri.pathname.slice(1)),
  ssl: parsedUri.searchParams.get("ssl") === "false" ? undefined : { rejectUnauthorized: true },
  charset: "utf8mb4",
  multipleStatements: false,
});
try {
  const schema = await readFile(resolve(process.cwd(), "database/mysql-schema.sql"), "utf8");
  const statements = schema.split(";").map((statement) => statement.trim()).filter(Boolean);
  for (const statement of statements) await connection.query(statement);

  const version = "2026-11-16-admin-cms-v1";
  const [migration] = await connection.execute<mysql.ResultSetHeader>("INSERT IGNORE INTO om_schema_migrations (version) VALUES (?)", [version]);

  for (const [index, category] of ([{ slug: "onion", name: "Onion" }, { slug: "garlic", name: "Garlic" }] as const).entries()) {
    const categoryJson = JSON.stringify({ slug: category.slug, name: category.name, description: "Product category", image: "", displayOrder: index, parentSlug: null });
    await connection.execute(
      "INSERT IGNORE INTO om_categories (id,slug,name,description,display_order,status,draft_json,published_json,published_at) VALUES (?,?,?,?,?,'published',?,?,UTC_TIMESTAMP())",
      [randomUUID(), category.slug, category.name, "Product category", index, categoryJson, categoryJson],
    );
  }

  const [categoryRows] = await connection.query<mysql.RowDataPacket[]>("SELECT id,slug FROM om_categories");
  const categoryIds = new Map(categoryRows.map((row) => [String(row.slug), String(row.id)]));
  for (const [index, product] of products.entries()) {
    const json = JSON.stringify(product);
    await connection.execute(
      "INSERT IGNORE INTO om_products (id,slug,category_id,category,status,display_order,draft_json,published_json,published_at) VALUES (?,?,?,?, 'published',?,?,?,UTC_TIMESTAMP())",
      [randomUUID(), product.slug, categoryIds.get(product.category) ?? null, product.category, index, json, json],
    );
  }

  const initialContent = { home: homeContent, contact: site.contact, general: { companyName: site.name, websiteTitle: "Dehydrated Onion & Garlic Manufacturer India | OM Food and Spices LLP", seoDescription: "OM Food and Spices LLP, Gujarat, India — dehydrated onion and garlic ingredients for food manufacturers and bulk buyers.", logo: "/images/logo.png" } };
  for (const [key, value] of Object.entries(initialContent)) {
    const json = JSON.stringify(value);
    await connection.execute(
      "INSERT IGNORE INTO om_site_content (content_key,draft_json,published_json) VALUES (?,?,?)",
      [key, json, json],
    );
  }
  console.log(migration.affectedRows ? "MySQL CMS schema and starter catalogue are ready." : "MySQL CMS schema is already up to date.");
  console.log("No admin account or published website content was overwritten.");
} finally {
  await connection.end();
}
}

main().catch((error: unknown) => { console.error("MySQL migration failed:", error instanceof Error ? error.message : error); process.exitCode = 1; });
