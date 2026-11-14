import Link from "next/link";
import { formatBlocks } from "@/content/home";
import { EnquiryButton } from "../EnquiryButton";
import { ProductGallery } from "../ProductGallery";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

type Block = typeof formatBlocks.onion;

function FormatBlock({ block, reverse, id }: { block: Block; reverse?: boolean; id: string }) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
      <Reveal className={reverse ? "lg:order-2" : ""}>
        <ProductGallery images={block.galleryImages ?? [block.image]} alt={block.imageAlt} />
      </Reveal>
      <Reveal delay={100}>
        <SectionHeading id={id} eyebrow={formatBlocks.eyebrow} line1={block.title[0]} line2={block.title[1]} />
        <p className="mt-5 max-w-lg text-lg">{block.text}</p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Available formats">
          {block.chips.map((c) => (
            <li key={c} className="chip">{c}</li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
          <EnquiryButton productSlugs={[block.productSlug]}>{block.cta}</EnquiryButton>
          <Link href={block.href} className="link-arrow">See all formats</Link>
        </div>
      </Reveal>
    </div>
  );
}

export function Formats() {
  return (
    <section aria-label="Onion and garlic formats" className="section section-beige">
      <div className="container-x space-y-20 lg:space-y-28">
        <FormatBlock block={formatBlocks.onion} id="onion-formats" />
        <FormatBlock block={formatBlocks.garlic} id="garlic-formats" reverse />
      </div>
    </section>
  );
}
