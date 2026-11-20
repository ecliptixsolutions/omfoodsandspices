import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { ProductGrid } from "@/components/ProductGrid";
import { abs, breadcrumbLd, buildMetadata } from "@/lib/seo";
import { products } from "@/content/products";
import { productFamilies, productForms } from "@/content/product-plan";
import { getPublishedCategories, getPublishedProducts } from "@/lib/products.server";

export const metadata: Metadata = buildMetadata({
  title: "Bulk Onion & Garlic Ingredients Supplier India | OM Food",
  description:
    "Compare white and red onion flakes, minced onion, granules, powder and dehydrated garlic formats. Request bulk specifications and export quotes from Gujarat, India.",
  path: "/products",
});

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getPublishedProducts(), getPublishedCategories()]);
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(`/products/${p.slug}`),
      name: p.name,
    })),
  };
  return (
    <>
      <PageHero
        eyebrow="Our dehydrated product range"
        line1="Bulk onion & garlic ingredients"
        line2="for food manufacturing"
        intro="Compare flakes, minced pieces, granules and powders by application, particle size and appearance. Review individual product details, then send one buying brief for samples, specifications or a bulk export quotation. Pink Onion enquiries are also available."
        crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
        cta={false}
      />
      <section className="section section-paper" aria-label="Product catalogue">
        <div className="container-x">
          <ProductGrid items={products} categories={categories} />
        </div>
      </section>
      <section className="section section-beige" aria-labelledby="range-plan-title">
        <div className="container-x">
          <p className="eyebrow">Product identification</p>
          <h2 id="range-plan-title" className="mt-3 text-3xl sm:text-4xl">Discuss the onion family and ingredient form.</h2>
          <p className="mt-4 max-w-3xl">The reference codes below describe proposed family and form combinations; they are not a list of approved grades. Use the published product cards for current enquiries and confirm the exact identity, cut and specification with the team.</p>
          <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-card">
            <table className="w-full border-collapse text-left text-sm">
              <thead><tr className="border-b border-line"><th className="p-4">Family</th>{productForms.map((form) => <th key={form.code} className="p-4">{form.name}</th>)}</tr></thead>
              <tbody>{productFamilies.map((family) => <tr key={family.code} className="border-b border-line last:border-0"><th scope="row" className="p-4">{family.name}</th>{productForms.map((form) => <td key={form.code} className="p-4"><span className="block font-semibold">{family.code}-{form.code}</span><span className="text-xs">Pending approval</span></td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>
      <CtaBand />
      <JsonLd data={ld} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Products", path: "/products" }])} />
    </>
  );
}
