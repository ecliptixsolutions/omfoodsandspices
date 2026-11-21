import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/CtaBand";
import { EnquiryButton } from "@/components/EnquiryButton";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { certificatesPage as c } from "@/content/pages";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: c.seoTitle, description: c.seoDescription, path: "/certificates" });

export default function CertificatesPage() {
  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        line1={c.title}
        intro={c.intro}
        crumbs={[{ label: "Home", href: "/" }, { label: "Certificates" }]}
        cta={false}
      />
      <section className="section section-paper" aria-label="Documents">
        <div className="container-x max-w-4xl">
          {c.documents.length === 0 ? (
            <div className="card p-8 text-center sm:p-12">
              <h2 className="text-2xl sm:text-3xl">{c.emptyTitle}</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg">{c.emptyText}</p>
              <div className="mt-8"><EnquiryButton>Request documents</EnquiryButton></div>
            </div>
          ) : (
            <ul className="space-y-4">
              {c.documents.map((d) => (
                <li key={d.href} className="card flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-lg">{d.title}</h2>
                    {d.description && <p className="text-sm">{d.description}</p>}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <a className="btn btn-outline" href={d.href} target="_blank" rel="noopener noreferrer">View PDF</a>
                    <a className="btn btn-outline" href={d.href} download>Download{d.size ? ` (${d.size})` : ""}</a>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 border-t border-line pt-8 sm:gap-10">
            <Image src="/images/certificates/fssai-logo.png" alt="FSSAI – Food Safety and Standards Authority of India" width={240} height={144} className="h-auto w-full max-w-[10rem] object-contain sm:max-w-[15rem]" />
            <Image src="/images/certificates/apeda-logo.png" alt="APEDA – Agricultural and Processed Food Products Export Development Authority" width={210} height={158} className="h-auto w-full max-w-[9.375rem] object-contain sm:max-w-[13.125rem]" />
            <Image src="/images/certificates/udyam-registration.png" alt="UDYAM Registration" width={180} height={180} className="h-auto w-full max-w-[8rem] object-contain sm:max-w-[11.25rem]" />
          </div>
        </div>
      </section>
      <CtaBand />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Certificates", path: "/certificates" }])} />
    </>
  );
}
