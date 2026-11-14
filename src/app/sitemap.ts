import type { MetadataRoute } from "next";
import { infoPages } from "@/content/pages";
import { products } from "@/content/products";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const top = ["/", "/products", "/dehydrated-onions", "/dehydrated-garlic", "/sourcing", "/certificates", "/enquiry", "/faq"];
  const rows = [
    ...top.map((p) => ({ path: p, priority: p === "/" ? 1 : 0.8 })),
    ...infoPages.map((p) => ({ path: p.path, priority: 0.6 })),
    ...products.map((p) => ({ path: `/products/${p.slug}`, priority: 0.7 })),
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
  ];
  return rows.map((r) => ({
    url: `${site.url}${r.path === "/" ? "" : r.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));
}
