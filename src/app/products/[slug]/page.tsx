import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/CtaBand";
import { EnquiryButton } from "@/components/EnquiryButton";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHero } from "@/components/PageHero";
import { productBySlug, products, productsByCategory, productFootnote } from "@/content/products";
import { site } from "@/content/site";
import { abs, breadcrumbLd, buildMetadata } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) return {};
  return buildMetadata({ title: p.seoTitle, description: p.seoDescription, path: `/products/${p.slug}`, image: p.image });
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) notFound();

  const related = productsByCategory(p.category).filter((x) => x.slug !== p.slug);
  const parent = p.form === "fresh"
    ? { label: "All products", href: "/products" }
    : p.category === "onion" ? { label: "Dehydrated Onions", href: "/dehydrated-onions" } : { label: "Dehydrated Garlic", href: "/dehydrated-garlic" };

  // Product schema — deliberately has NO price/offer: pricing is only given after company confirmation.
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.overview,
    image: abs(p.image),
    category: p.form === "fresh" ? "Pink onion" : `Dehydrated ${p.category}`,
    brand: { "@type": "Brand", name: site.name },
    manufacturer: { "@id": `${site.url}/#organization` },
    url: abs(`/products/${p.slug}`),
  };

  return (
    <>
      <PageHero
        eyebrow={p.form === "fresh" ? "Pink Onion" : `Dehydrated ${p.category}`}
        line1={p.name}
        intro={p.overview}
        crumbs={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: p.name }]}
        image={p.image}
        imageAlt={p.imageAlt}
        galleryImages={p.galleryImages}
        productSlugs={[p.slug]}
      />

      <section className="section section-paper" aria-label="Product information">
        <div className="container-x grid gap-8 lg:grid-cols-3">
          <Reveal>
            <article className="card h-full p-7">
              <h2 className="text-xl">Available forms</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.forms.map((f) => (
                  <li key={f} className="chip">{f}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm">Availability is subject to company confirmation.</p>
            </article>
          </Reveal>
          <Reveal delay={80}>
            <article className="card h-full p-7">
              <h2 className="text-xl">Typical applications</h2>
              <ul className="mt-4 space-y-2">
                {p.applications.map((a) => (
                  <li key={a} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
                    {a}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
          <Reveal delay={160}>
            <article className="section-forest on-dark h-full rounded-[1.25rem] border border-forest p-7 shadow-card">
              <h2 className="text-xl">Specifications on request</h2>
              <p className="mt-4">
                Size, grade, mesh, technical specifications, packaging and documentation are confirmed directly by the company for your requirement.
              </p>
              <EnquiryButton className="mt-6" productSlugs={[p.slug]}>Enquire</EnquiryButton>
            </article>
          </Reveal>
        </div>
        <p className="container-x mt-8 text-sm">{productFootnote}</p>
      </section>

      <section className="section section-beige" aria-labelledby="related-title">
        <div className="container-x">
          <SectionHeading id="related-title" eyebrow={p.form === "fresh" ? "Other products" : "More formats"} line1={p.form === "fresh" ? "More onion products" : `More dehydrated ${p.category}`} line2={p.form === "fresh" ? "for business buyers" : "formats"} className="mb-10" />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <ProductCard product={r} />
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <Link href={parent.href} className="link-arrow">Back to {parent.label}</Link>
          </p>
          {p.form === "fresh" && <p className="mt-5 text-xs">Photograph: <a href="https://commons.wikimedia.org/wiki/File:Bangalore_rose_onion.jpg" target="_blank" rel="noreferrer">Maaimpex / Wikimedia Commons</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</p>}
        </div>
      </section>

      <CtaBand productSlugs={[p.slug]} />
      <JsonLd data={productLd} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: p.name, path: `/products/${p.slug}` },
        ])}
      />
    </>
  );
}
