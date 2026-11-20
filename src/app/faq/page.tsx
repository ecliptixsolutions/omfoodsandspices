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
      <PageHero eyebrow="Buyer FAQs" line1="Onion & garlic procurement" line2="questions answered." intro="Plan your ingredient enquiry with guidance on product formats, samples, bulk quotations, specifications, packaging and export requirements." crumbs={[{ label: "Home", href: "/" }, { label: "Buyer FAQs" }]} cta={false} />
      <FaqSection eyebrow="Procurement guidance" line1="From sample review" line2="to bulk supply." id="buyer-faq" />
      <CtaBand />
    </>
  );
}
