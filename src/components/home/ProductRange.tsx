import { productRange } from "@/content/home";
import { productFootnote } from "@/content/products";
import { ProductGrid } from "../ProductGrid";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function ProductRange() {
  return (
    <section id="products" aria-labelledby="range-title" className="section section-paper">
      <div className="container-x">
        <Reveal className="mb-10 max-w-3xl">
          <SectionHeading id="range-title" eyebrow={productRange.eyebrow} line1={productRange.title[0]} line2={productRange.title[1]} />
        </Reveal>
        <ProductGrid />
        <p className="mt-8 text-sm">{productFootnote}</p>
      </div>
    </section>
  );
}
