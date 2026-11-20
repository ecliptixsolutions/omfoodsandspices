import type { Metadata } from "next";
import { InfoPageView } from "@/components/InfoPageView";
import { infoPages } from "@/content/pages";
import { buildMetadata } from "@/lib/seo";
import { getPublishedPage } from "@/lib/site-content.server";

const page = infoPages.find((p) => p.slug === "")!;
export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedPage(page.path, page);
  return buildMetadata({ title: content.seoTitle, description: content.seoDescription, path: page.path, image: content.image });
}

export default function AboutPage() {
  return <InfoPageView page={page} />;
}
