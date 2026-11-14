import { faqs } from "@/content/faq";
import { FAQ } from "./FAQ";
import { JsonLd } from "./JsonLd";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/** FAQ section with FAQPage JSON-LD. Pass `items` for page-specific FAQs. */
export function FaqSection({
  items = faqs,
  line1 = "Before we",
  line2 = "get started.",
  eyebrow = "Buyer FAQs",
  tone = "paper",
  id = "faq",
  schema = true,
}: {
  items?: { q: string; a: string }[];
  line1?: string;
  line2?: string;
  eyebrow?: string;
  tone?: "paper" | "beige";
  id?: string;
  schema?: boolean;
}) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`section ${tone === "paper" ? "section-paper" : "section-beige"}`}>
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <SectionHeading id={`${id}-title`} eyebrow={eyebrow} line1={line1} line2={line2} />
        </Reveal>
        <Reveal delay={100}>
          <FAQ items={items} />
        </Reveal>
      </div>
      {schema && <JsonLd data={ld} />}
    </section>
  );
}
