import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHero } from "@/components/PageHero";
import { site, whatsappLink } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { Clock, Mail, Phone, Pin } from "@/components/Icons";
import type { EnquiryType } from "@/lib/enquiry";

export const metadata: Metadata = buildMetadata({
  title: "Request a Quote or Sample | OM Food and Spices LLP",
  description: "Send one enquiry for a quotation or sample of dehydrated onion and garlic from OM Food and Spices LLP, Gujarat, India. Bulk and export enquiries welcome.",
  path: "/enquiry",
});

export default async function EnquiryPage({ searchParams }: { searchParams: Promise<{ product?: string; type?: string }> }) {
  const sp = await searchParams;
  const type: EnquiryType = sp.type === "sample" ? "sample" : "quote";
  const slugs = sp.product ? sp.product.split(",") : [];
  const c = site.contact;
  return (
    <>
      <PageHero
        eyebrow="Enquiry"
        line1="Request a quote"
        line2="or sample."
        intro="One enquiry form. A direct conversation. Share the product, quantity and destination and we'll take it from there."
        crumbs={[{ label: "Home", href: "/" }, { label: "Enquiry" }]}
        cta={false}
      />
      <section className="section section-paper">
        <div className="container-x grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="card p-6 sm:p-9">
            <EnquiryForm idPrefix="page" initialSlugs={slugs} initialType={type} />
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
              <a className="btn btn-primary mt-6 w-full" href={whatsappLink()} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
