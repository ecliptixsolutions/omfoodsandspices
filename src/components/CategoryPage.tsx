import Image from "next/image";
import { categoryPages } from "@/content/pages";
import { productsByCategory } from "@/content/products";
import { applications } from "@/content/home";
import { CtaBand } from "./CtaBand";
import { FaqSection } from "./FaqSection";
import { JsonLd } from "./JsonLd";
import { PageHero } from "./PageHero";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { breadcrumbLd } from "@/lib/seo";

/** Shared layout for /dehydrated-onions and /dehydrated-garlic: hero, format cards, applications, FAQ, CTA. */
export function CategoryPage({ category }: { category: "onion" | "garlic" }) {
  const page = categoryPages[category];
  const list = productsByCategory(category);
  const label = category === "onion" ? "Dehydrated Onions" : "Dehydrated Garlic";
  // applications relevant to this category (derived from product data)
  const apps = Array.from(new Set(list.flatMap((p) => p.applications)));

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        line1={page.title[0]}
        line2={page.title[1]}
        intro={page.intro}
        crumbs={[{ label: "Home", href: "/" }, { label: label }]}
        image={page.image}
        imageAlt={page.imageAlt}
        galleryImages={page.galleryImages}
        productSlugs={[page.ctaProduct]}
      />

      <section className="section section-paper" aria-labelledby="formats-title">
        <div className="container-x">
          <Reveal className="mb-10 max-w-3xl">
            <SectionHeading id="formats-title" eyebrow="Format cards" line1={`${category === "onion" ? "Onion" : "Garlic"} formats`} line2="for food businesses" />
          </Reveal>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((p, i) => (
              <li key={p.slug}>
                <Reveal delay={i * 70} className="h-full">
                  <ProductCard product={p} />
                </Reveal>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm">Formats, specifications and packaging depend on availability and confirmation by the company.</p>
        </div>
      </section>

      <section className="section section-beige" aria-labelledby="apps-title">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal>
            <SectionHeading id="apps-title" eyebrow={applications.eyebrow} line1={page.applicationsTitle} />
            <ul className="mt-8 space-y-3">
              {apps.map((a) => (
                <li key={a} className="flex gap-3 text-lg">
                  <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-line shadow-lift">
              <Image
                src={page.image}
                alt={category === "onion" ? "Dehydrated onion in flake, minced, granule and powder formats in small bowls" : "Dehydrated garlic in flake, minced, granule and powder formats in small bowls"}
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <FaqSection items={page.faqs} id="category-faq" eyebrow={`${label} FAQ`} line1="Common questions" line2="answered." />
      <CtaBand productSlugs={[page.ctaProduct]} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: label, path: page.path }])} />
    </>
  );
}
