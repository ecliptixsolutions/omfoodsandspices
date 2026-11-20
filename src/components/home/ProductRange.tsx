import { productRange } from "@/content/home";
import { ProductGrid } from "../ProductGrid";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { getPublishedCategories, getPublishedProducts, type PublicCategory } from "@/lib/products.server";
import type { Product } from "@/content/products";

export async function ProductRange({ items: givenItems, categories: givenCategories }: { items?: Product[]; categories?: PublicCategory[] } = {}) {
  const [loadedItems, loadedCategories] = await Promise.all([givenItems ? Promise.resolve(givenItems) : getPublishedProducts(), givenCategories ? Promise.resolve(givenCategories) : getPublishedCategories()]);
  const items = loadedItems;
  const categories = loadedCategories;
  return (
    <section id="products" aria-labelledby="range-title" className="section section-paper">
      <div className="container-x">
        <Reveal className="mb-10 max-w-3xl">
          <SectionHeading id="range-title" eyebrow={productRange.eyebrow} line1={productRange.title[0]} line2={productRange.title[1]} />
        </Reveal>
        <ProductGrid items={items} categories={categories} />
      </div>
    </section>
  );
}
