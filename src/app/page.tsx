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
import { heroBackgroundImages } from "@/content/hero-backgrounds";
import { Ticker } from "@/components/Ticker";
import { buildMetadata } from "@/lib/seo";
import { getPublicHome, getPublicGeneralSettings } from "@/lib/site-content.server";
import { getPublishedCategories, getPublishedProducts } from "@/lib/products.server";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicGeneralSettings();
  return buildMetadata({ title: settings.websiteTitle, description: settings.seoDescription, path: "/" });
}

export default async function HomePage() {
  const [home, products, categories] = await Promise.all([getPublicHome(), getPublishedProducts(), getPublishedCategories()]);
  return (
    <>
      <HeroSlider slides={home.heroSlides} images={heroBackgroundImages} note={home.heroNote} chips={home.heroChips} />
      <Ticker />
      <ProductRange items={products} categories={categories} />
      <AboutTeaser content={home.aboutTeaser} />
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
