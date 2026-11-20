import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";
import { categoryPages } from "@/content/pages";
import { buildMetadata } from "@/lib/seo";

const p = categoryPages.onion;
export const metadata: Metadata = buildMetadata({ title: p.seoTitle, description: p.seoDescription, path: p.path, image: p.image });
export const dynamic = "force-dynamic";

export default function Page() {
  return <CategoryPage category="onion" />;
}
