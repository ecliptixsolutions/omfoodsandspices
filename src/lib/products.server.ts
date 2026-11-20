import "server-only";
import { cache } from "react";
import {publicRows} from "./public-db.server";
import { unstable_rethrow } from "next/navigation";
import { products as fallbackProducts, type Product } from "@/content/products";
import { getAdminDb, type DbRow } from "@/lib/admin/db.server";
import { isAdminPreview } from "@/lib/admin/auth.server";

/** Published database catalogue; static project content is used only until MYSQL_URL is configured. */
export const getPublishedProducts = cache(async function getPublishedProducts(): Promise<Product[]> {
  if (!process.env.MYSQL_URL) return fallbackProducts;
  let rows: DbRow[];
  try {
    const preview = await isAdminPreview();
    rows = await (preview ? async (sql:string) => (await getAdminDb().query<DbRow[]>(sql))[0] : publicRows)(preview
      ? "SELECT COALESCE(p.draft_json,p.published_json) AS content_json FROM om_products p JOIN om_categories c ON c.id=p.category_id AND c.status<>'archived' WHERE p.status<>'archived' ORDER BY p.display_order,p.created_at"
      : "SELECT p.published_json AS content_json FROM om_products p JOIN om_categories c ON c.id=p.category_id AND c.status='published' WHERE p.status='published' AND p.published_json IS NOT NULL ORDER BY p.display_order,p.created_at");
  } catch (error) {
    unstable_rethrow(error);
    // Preserve public availability if the owner database is briefly unreachable.
    console.error("Unable to load MySQL catalogue; using bundled public catalogue", error);
    return fallbackProducts;
  }
  const result: Product[] = [];
  for (const row of rows) {
    try {
      const value = typeof row.content_json === "string" ? JSON.parse(row.content_json) : row.content_json;
      if (value && typeof value === "object" && typeof value.slug === "string") result.push(value as Product);
    } catch (error) { console.error("Skipping malformed published product record", error); }
  }
  return result;
});

export type PublicCategory = { slug: string; name: string; description: string; image: string; displayOrder: number };
export const getPublishedCategories = cache(async function getPublishedCategories(): Promise<PublicCategory[]> {
  if (!process.env.MYSQL_URL) return [{slug:"onion",name:"Onion",description:"",image:"",displayOrder:0},{slug:"garlic",name:"Garlic",description:"",image:"",displayOrder:1}];
  try {
    const preview=await isAdminPreview();
    const rows = await (preview ? async (sql:string) => (await getAdminDb().query<DbRow[]>(sql))[0] : publicRows)(preview?"SELECT COALESCE(draft_json,published_json) AS content_json FROM om_categories WHERE status<>'archived' ORDER BY display_order,created_at":"SELECT published_json AS content_json FROM om_categories WHERE status='published' AND published_json IS NOT NULL ORDER BY display_order,created_at");
    const categories: PublicCategory[]=[];
    for(const row of rows){try{const x=typeof row.content_json==="string"?JSON.parse(row.content_json):row.content_json;if(x&&typeof x.slug==="string"&&typeof x.name==="string")categories.push(x as PublicCategory);}catch{}}
    return categories;
  } catch(error) { unstable_rethrow(error); console.error("Unable to load published categories from MySQL",error);return [{slug:"onion",name:"Onion",description:"",image:"",displayOrder:0},{slug:"garlic",name:"Garlic",description:"",image:"",displayOrder:1}]; }
});
