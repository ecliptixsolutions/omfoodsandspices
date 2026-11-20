import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHero } from "@/components/PageHero";
import { site, whatsappLink } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { Clock, Mail, Phone, Pin } from "@/components/Icons";
import type { EnquiryType } from "@/lib/enquiry";
import { getPublicContact } from "@/lib/site-content.server";
import { getPublishedCategories, getPublishedProducts } from "@/lib/products.server";

export const metadata: Metadata = buildMetadata({
  title: "Bulk Onion & Garlic Export Quote or Sample | Contact OM Food",
  description: "Contact OM Food and Spices LLP for dehydrated onion and garlic samples, product specifications and bulk export quotations. Share quantity and destination.",
  path: "/enquiry",
});

export const dynamic = "force-dynamic";

export default async function EnquiryPage({ searchParams }: { searchParams: Promise<{ product?: string; type?: string }> }) {
  const sp = await searchParams;
  const type: EnquiryType = sp.type === "sample" ? "sample" : "quote";
  const slugs = sp.product ? sp.product.split(",") : [];
  const c = await getPublicContact();
  const [products,categories] = await Promise.all([getPublishedProducts(),getPublishedCategories()]);
  return (
    <>
      <PageHero
        eyebrow="Enquiry"
        line1="Request a bulk ingredient quote"
        line2="or product sample."
        intro="Contact our onion and garlic enquiry team in Gujarat, India. Include the ingredient form, target specification, quantity, packaging and destination so we can discuss availability and the requirements of your order."
        crumbs={[{ label: "Home", href: "/" }, { label: "Enquiry" }]}
        cta={false}
      />
      <section className="section section-paper">
        <div className="container-x grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="card p-6 sm:p-9">
            <EnquiryForm idPrefix="page" initialSlugs={slugs} initialType={type} products={products} categories={categories} contact={c} />
          </div>
          <aside aria-label="Contact details" className="space-y-6">
            <div className="card p-7">
              <h2 className="text-xl">Let&apos;s talk ingredients</h2>
              <ul className="mt-5 space-y-4">
                <li className="flex gap-3"><Phone size={18} className="mt-1 shrink-0 text-copper-ink" /><a className="font-semibold text-ink" href={`tel:${c.phoneTel}`}>{c.phoneDisplay}</a></li>
                <li className="flex gap-3"><Mail size={18} className="mt-1 shrink-0 text-copper-ink" /><a className="break-all font-semibold text-ink" href={`mailto:${c.email}`}>{c.email}</a></li>
                <li className="flex gap-3"><Pin size={18} className="mt-1 shrink-0 text-copper-ink" /><address className="not-italic">{c.addressLines.join(" ")}</address></li>
                <li className="flex gap-3"><Clock size={18} className="mt-1 shrink-0 text-copper-ink" /><span>{c.hours}<span className="block text-sm">(subject to holiday variations)</span></span></li>
              </ul>
              <a className="btn btn-primary mt-6 w-full" href={whatsappLink(undefined, c.whatsappNumber)} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
