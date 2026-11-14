import type { Metadata } from "next";
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
        </div>
      </section>
      <CtaBand />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Certificates", path: "/certificates" }])} />
    </>
  );
}
