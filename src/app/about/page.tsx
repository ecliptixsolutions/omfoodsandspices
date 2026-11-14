import type { Metadata } from "next";
import { InfoPageView } from "@/components/InfoPageView";
import { infoPages } from "@/content/pages";
import { buildMetadata } from "@/lib/seo";

const page = infoPages.find((p) => p.slug === "")!;
export const metadata: Metadata = buildMetadata({ title: page.seoTitle, description: page.seoDescription, path: page.path, image: page.image });

export default function AboutPage() {
  return <InfoPageView page={page} />;
}
