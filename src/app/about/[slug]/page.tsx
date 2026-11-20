import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfoPageView } from "@/components/InfoPageView";
import { infoPages } from "@/content/pages";
import { buildMetadata } from "@/lib/seo";
import { getPublishedPage } from "@/lib/site-content.server";

type Params = { slug: string };
const find = (slug: string) => infoPages.find((p) => p.slug === slug && p.slug !== "");

export const dynamicParams = false;
export function generateStaticParams() {
  return infoPages.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = find((await params).slug);
  if (!p) return {};
  const content = await getPublishedPage(p.path, p);
  return buildMetadata({ title: content.seoTitle, description: content.seoDescription, path: p.path, image: content.image });
}

export default async function InfoPage({ params }: { params: Promise<Params> }) {
  const p = find((await params).slug);
  if (!p) notFound();
  return <InfoPageView page={p} />;
}
