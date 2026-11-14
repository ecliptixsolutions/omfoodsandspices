import Link from "next/link";
import { nav } from "@/content/site";
import type { InfoPage } from "@/content/pages";
import { CtaBand } from "./CtaBand";
import { JsonLd } from "./JsonLd";
import { PageHero } from "./PageHero";
import { Placeholder } from "./Placeholder";
import { Reveal } from "./Reveal";
import { breadcrumbLd } from "@/lib/seo";

export function InfoPageView({ page }: { page: InfoPage }) {
  const aboutLinks = nav.find((n) => n.children)?.children ?? [];
  const crumbs =
    page.path === "/about"
      ? [{ label: "Home", href: "/" }, { label: "About us" }]
      : [{ label: "Home", href: "/" }, { label: "About us", href: "/about" }, { label: page.title }];
  return (
    <>
      <PageHero eyebrow={page.eyebrow} line1={page.title} intro={page.intro} crumbs={crumbs} image={page.image} imageAlt={page.imageAlt} />
      <section className="section section-paper">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_18rem]">
          <div className="max-w-3xl space-y-10">
            {page.sections.map((s) => (
              <Reveal key={s.heading}>
                <section aria-labelledby={`h-${s.heading.replace(/\W+/g, "-").toLowerCase()}`}>
                  <h2 id={`h-${s.heading.replace(/\W+/g, "-").toLowerCase()}`} className="text-2xl sm:text-3xl">{s.heading}</h2>
                  {s.body && <p className="mt-4 text-lg">{s.body}</p>}
                  {s.steps && <ol className="mt-6 grid gap-4 sm:grid-cols-2">{s.steps.map((step, index) => <li key={step.title} className="card p-5"><span className="eyebrow">Stage {String(index + 1).padStart(2, "0")}</span><h3 className="mt-2 text-xl">{step.title}</h3><p className="mt-2">{step.detail}</p></li>)}</ol>}
                  {s.placeholder && <Placeholder hint={s.hint} />}
                </section>
              </Reveal>
            ))}
          </div>
          <aside aria-label="More about OM Food" className="lg:sticky lg:top-32 lg:self-start">
            <div className="card p-6">
              <p className="eyebrow mb-3">About us</p>
              <ul className="space-y-1">
                {aboutLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={l.href === page.path ? "page" : undefined}
                      className={`block rounded-lg px-3 py-2 font-semibold no-underline hover:bg-beige ${l.href === page.path ? "bg-beige text-copper-ink" : "text-ink"}`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
      <CtaBand />
      <JsonLd data={breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: "href" in c && c.href ? c.href : page.path })))} />
    </>
  );
}
