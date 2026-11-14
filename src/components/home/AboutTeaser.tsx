import Image from "next/image";
import Link from "next/link";
import { aboutTeaser } from "@/content/home";
import { site } from "@/content/site";
import { ArrowUpRight } from "../Icons";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function AboutTeaser() {
  return (
    <section aria-labelledby="about-title">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[22rem] lg:min-h-[34rem]">
          <Image
            src={aboutTeaser.image}
            alt={aboutTeaser.imageAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[50%_70%]"
          />
        </div>
        <div className="section-beige flex items-center px-5 py-16 sm:px-10 lg:px-16 lg:py-24">
          <Reveal className="max-w-xl">
            <SectionHeading id="about-title" eyebrow={aboutTeaser.eyebrow} line1={aboutTeaser.title[0]} line2={aboutTeaser.title[1]} />
            <p className="mt-6 text-lg">{aboutTeaser.copy}</p>
            <Link href={aboutTeaser.cta.href} className="btn btn-primary mt-8">
              {aboutTeaser.cta.label} <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>
      </div>
      <p className="on-dark bg-forest px-5 py-4 text-center text-sm font-extrabold uppercase tracking-[0.22em] text-on-forest">
        {site.tagline}
      </p>
    </section>
  );
}
