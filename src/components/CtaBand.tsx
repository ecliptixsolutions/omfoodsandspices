import { finalCta } from "@/content/home";
import { EnquiryButton } from "./EnquiryButton";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/** Deep-green closing band used on every page. Pushes visitors to quote / sample. */
export function CtaBand({
  line1 = finalCta.title[0],
  line2 = finalCta.title[1],
  text = finalCta.text,
  productSlugs,
}: {
  line1?: string;
  line2?: string;
  text?: string;
  productSlugs?: string[];
}) {
  return (
    <section className="section section-forest on-dark" aria-labelledby="final-cta">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionHeading id="final-cta" line1={line1} line2={line2} align="center" />
          <p className="mx-auto mt-6 max-w-xl text-lg">{text}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <EnquiryButton type="quote" productSlugs={productSlugs}>Get Quotation</EnquiryButton>
            <EnquiryButton type="sample" productSlugs={productSlugs} variant="outline">Get Sample</EnquiryButton>
          </div>
          <p className="mt-6 text-sm font-semibold tracking-wide">{finalCta.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
