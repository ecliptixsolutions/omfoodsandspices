import type { ReactNode } from "react";
import { PageHero } from "./PageHero";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow="Legal" line1={title} intro={`Last updated: ${updated}`} crumbs={[{ label: "Home", href: "/" }, { label: title }]} cta={false} />
      <section className="section section-paper">
        <div className="container-x">
          <div className="prose-om max-w-3xl text-lg">{children}</div>
        </div>
      </section>
    </>
  );
}
