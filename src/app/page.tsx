import type { Metadata } from "next";
import { Applications } from "@/components/home/Applications";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { Formats } from "@/components/home/Formats";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ProductRange } from "@/components/home/ProductRange";
import { SpecsSection } from "@/components/home/SpecsSection";
import { WorkingTogether } from "@/components/home/WorkingTogether";
import { CtaBand } from "@/components/CtaBand";
import { FaqSection } from "@/components/FaqSection";
import { HeroSlider } from "@/components/HeroSlider";
import { Ticker } from "@/components/Ticker";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Dehydrated Onion & Garlic Manufacturer India | OM Food and Spices LLP",
  description:
    "Dehydrated onion manufacturer and dehydrated garlic supplier in Gujarat, India. Onion flakes, onion powder, garlic granules and more. Bulk supply and export enquiries welcome.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <Ticker />
      <ProductRange />
      <AboutTeaser />
      <WorkingTogether />
      <Formats />
      <Applications />
      <ProcessSection />
      <SpecsSection />
      <FaqSection />
      <CtaBand />
    </>
  );
}
