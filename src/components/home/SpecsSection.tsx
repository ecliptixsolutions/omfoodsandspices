import { specs } from "@/content/home";
import { Check } from "../Icons";
import { EnquiryButton } from "../EnquiryButton";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function SpecsSection() {
  return (
    <section aria-labelledby="specs-title" className="section section-beige">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading id="specs-title" eyebrow={specs.eyebrow} line1={specs.title[0]} line2={specs.title[1]} />
          <ul className="mt-8 space-y-3">
            {specs.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-lg">
                <span className="mt-1.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest text-on-forest" aria-hidden="true">
                  <Check size={14} />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-9">
            <EnquiryButton>{specs.cta}</EnquiryButton>
          </div>
        </Reveal>
        <ul className="grid content-start gap-5 sm:grid-cols-2">
          {specs.cards.map((c, i) => (
            <li key={c.title}>
              <Reveal delay={i * 80} className="h-full">
                <article className="card card-hover h-full p-6">
                  <h3 className="text-lg">{c.title}</h3>
                  <p className="mt-2 text-[0.95rem]">{c.text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
