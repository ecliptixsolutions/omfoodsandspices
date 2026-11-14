import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { ProductGrid } from "@/components/ProductGrid";
import { abs, breadcrumbLd, buildMetadata } from "@/lib/seo";
import { products } from "@/content/products";
import { productFamilies, productForms } from "@/content/product-plan";

export const metadata: Metadata = buildMetadata({
  title: "Pink Onion & Dehydrated Onion and Garlic Products | OM Food",
  description:
    "Browse pink onion enquiries plus dehydrated onion and garlic flakes, minced, granules and powder from OM Food and Spices LLP, Gujarat.",
  path: "/products",
});

export default function ProductsPage() {
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
        line1="Onion & garlic ingredients"
        line2="for business buyers"
        intro="Explore pink onion enquiries and nine dehydrated onion and garlic formats. Choose a product to see details and applications, or send one enquiry for several."
        crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
        cta={false}
      />
      <section className="section section-paper" aria-label="Product catalogue">
        <div className="container-x">
          <ProductGrid />
        </div>
      </section>
      <section className="section section-beige" aria-labelledby="range-plan-title">
        <div className="container-x">
          <p className="eyebrow">Catalogue structure</p>
          <h2 id="range-plan-title" className="mt-3 text-3xl sm:text-4xl">Four families. Five forms each.</h2>
          <p className="mt-4 max-w-3xl">The family and form records below are planned. Individual products, photos and specifications will be published after company approval. Ask us to confirm availability for your requirement.</p>
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
