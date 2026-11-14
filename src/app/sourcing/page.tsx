import type { Metadata } from "next";
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

export const metadata: Metadata = buildMetadata({ title: s.seoTitle, description: s.seoDescription, path: "/sourcing", image: s.image });

export default function SourcingPage() {
  return (
    <>
      <PageHero
        eyebrow={s.eyebrow}
        line1={s.title[0]}
        line2={s.title[1]}
        intro={s.intro}
        crumbs={[{ label: "Home", href: "/" }, { label: "Sourcing" }]}
        image={s.image}
        imageAlt={s.imageAlt}
      />
      <section className="section section-forest on-dark" aria-labelledby="steps-title">
        <div className="container-x">
          <Reveal className="mb-12 max-w-3xl">
            <SectionHeading id="steps-title" eyebrow="From inquiry to supply" line1="A clear conversation," line2="from the start." />
          </Reveal>
          <ProcessSteps />
          <p className="mt-10 max-w-3xl text-sm">{processNote}</p>
        </div>
      </section>
      <section className="section section-paper" aria-labelledby="support-title">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading id="support-title" eyebrow="Bulk & export" line1={s.support.title} />
            <p className="mt-6 text-lg">{s.support.text}</p>
            <ul className="mt-6 space-y-3">
              {s.support.points.map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-lg">
                  <span className="mt-1.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest text-on-forest" aria-hidden="true"><Check size={14} /></span>
                  {pt}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-line shadow-lift">
              <Image src={s.image} alt={s.imageAlt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>
      <CtaBand />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Sourcing", path: "/sourcing" }])} />
    </>
  );
}
