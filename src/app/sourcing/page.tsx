import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { ProcessSteps } from "@/components/home/ProcessSection";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Check } from "@/components/Icons";
import { processNote } from "@/content/home";
import { sourcingPage as s } from "@/content/pages";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";
import { getPublishedPage } from "@/lib/site-content.server";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedPage("/sourcing", s);
  return buildMetadata({ title: content.seoTitle, description: content.seoDescription, path: "/sourcing", image: content.image });
}

export default async function SourcingPage() {
  const content = await getPublishedPage("/sourcing", s);
  return (
    <>
      <PageHero
        eyebrow={content.eyebrow}
        line1={content.title[0]}
        line2={content.title[1]}
        intro={content.intro}
        crumbs={[{ label: "Home", href: "/" }, { label: "Sourcing" }]}
        image={content.image}
        imageAlt={content.imageAlt}
      />
      <section className="section section-forest on-dark" aria-labelledby="steps-title">
        <div className="container-x">
          <Reveal className="mb-12 max-w-3xl">
            <SectionHeading id="steps-title" eyebrow="Bulk procurement" line1="From product selection" line2="to order requirements." />
          </Reveal>
          <ProcessSteps />
          <p className="mt-10 max-w-3xl text-sm">{processNote}</p>
        </div>
      </section>
      <section className="section section-paper" aria-labelledby="support-title">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading id="support-title" eyebrow="Bulk & export" line1={content.support.title} />
            <p className="mt-6 text-lg">{content.support.text}</p>
            <p className="mt-5 flex flex-wrap gap-4"><Link href="/dehydrated-onions">Onion ingredient specifications</Link><Link href="/dehydrated-garlic">Garlic ingredient formats</Link><Link href="/about/packaging-export">Packaging and export requirements</Link></p>
            <ul className="mt-6 space-y-3">
              {content.support.points.map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-lg">
                  <span className="mt-1.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest text-on-forest" aria-hidden="true"><Check size={14} /></span>
                  {pt}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <div className="image-motion-frame relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-line shadow-lift">
              <Image src={content.image} alt={content.imageAlt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>
      <CtaBand />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Sourcing", path: "/sourcing" }])} />
    </>
  );
}
