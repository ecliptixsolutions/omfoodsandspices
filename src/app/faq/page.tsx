import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { FaqSection } from "@/components/FaqSection";
import { PageHero } from "@/components/PageHero";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Buyer FAQs | Dehydrated Onion & Garlic | OM Food and Spices LLP",
  description: "Answers to common buyer questions about samples, quotations, bulk quantities, specifications and export enquiries for dehydrated onion and garlic.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="Buyer FAQs" line1="Before we" line2="get started." intro="Quick answers on products, samples, quotations, bulk quantities and export enquiries." crumbs={[{ label: "Home", href: "/" }, { label: "Buyer FAQs" }]} cta={false} />
      <FaqSection eyebrow="Questions" line1="Everything buyers" line2="ask first." id="buyer-faq" />
      <CtaBand />
    </>
  );
}
