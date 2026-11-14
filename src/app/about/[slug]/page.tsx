import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfoPageView } from "@/components/InfoPageView";
import { infoPages } from "@/content/pages";
import { buildMetadata } from "@/lib/seo";

type Params = { slug: string };
const find = (slug: string) => infoPages.find((p) => p.slug === slug && p.slug !== "");

export const dynamicParams = false;
export function generateStaticParams() {
  return infoPages.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = find((await params).slug);
  if (!p) return {};
  return buildMetadata({ title: p.seoTitle, description: p.seoDescription, path: p.path, image: p.image });
}

export default async function InfoPage({ params }: { params: Promise<Params> }) {
  const p = find((await params).slug);
  if (!p) notFound();
  return <InfoPageView page={p} />;
}
