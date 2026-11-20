import {publicRows} from "@/lib/public-db.server";
import type { MetadataRoute } from "next";
import { infoPages } from "@/content/pages";
import { site } from "@/content/site";

export const dynamic = "force-dynamic";
const copyRevision = "2026-11-18"; // Actual source copy revision, never the crawl/request date.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, blogs, content] = await Promise.all([
    publicRows("SELECT JSON_UNQUOTE(JSON_EXTRACT(p.published_json,'$.slug')) AS slug,JSON_UNQUOTE(JSON_EXTRACT(p.published_json,'$.image')) AS image,p.published_at FROM om_products p JOIN om_categories c ON c.id=p.category_id AND c.status='published' WHERE p.status='published' AND p.published_json IS NOT NULL"),
    publicRows("SELECT JSON_UNQUOTE(JSON_EXTRACT(p.published_json,'$.slug')) AS slug,JSON_UNQUOTE(JSON_EXTRACT(p.published_json,'$.thumbnail')) AS image,COALESCE((SELECT MAX(v.created_at) FROM om_blog_versions v WHERE v.blog_id=p.id AND v.action='published'),p.published_at) AS modified FROM om_blog_posts p WHERE p.status='published' AND p.published_json IS NOT NULL AND p.published_at<=UTC_TIMESTAMP()"),
    publicRows("SELECT content_key,published_at FROM om_site_content WHERE published_json IS NOT NULL"),
  ]);
  const top = ["/", "/blog", "/products", "/dehydrated-onions", "/dehydrated-garlic", "/sourcing", "/certificates", "/enquiry", "/faq"];
  const rows = [
    ...[...new Set([...top,...infoPages.map(p=>p.path),"/privacy","/terms"])].map(path=>{
      const stored=content.find(c=>c.content_key===(path==="/"?"home":`page:${path}`));
      const modified=stored?.published_at&&new Date(stored.published_at)>new Date(copyRevision)?new Date(stored.published_at):copyRevision;
      return {path,modified,images:[] as string[]};
    }),
    ...products.map(p=>({path:`/products/${p.slug}`,modified:p.published_at?new Date(p.published_at):copyRevision,images:p.image?[new URL(p.image,site.url).href]:[]})),
    ...blogs.map(p=>({path:`/blog/${p.slug}`,modified:new Date(p.modified),images:p.image?[new URL(p.image,site.url).href]:[]})),
  ];
  return rows.map((r) => ({
    url: `${site.url}${r.path === "/" ? "" : r.path}`,
    lastModified: r.modified,
    images: r.images,
  }));
}

