import { applications } from "@/content/home";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function Applications() {
  return (
    <section id="applications" aria-labelledby="apps-title" className="section section-paper">
      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading id="apps-title" eyebrow={applications.eyebrow} line1={applications.title[0]} line2={applications.title[1]} />
          <p className="mt-6 max-w-md">Each application suggests a form. Tell us yours and we&apos;ll discuss what suits it.</p>
        </Reveal>
        <ol className="divide-y divide-line border-y border-line">
          {applications.items.map((a, i) => (
            <li key={a.n}>
              <Reveal delay={i * 40} className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:gap-8">
                <span className="w-12 shrink-0 text-lg font-extrabold text-copper-ink" aria-hidden="true">{a.n}</span>
                <h3 className="flex-1 text-xl sm:text-2xl">{a.title}</h3>
                {a.tags.length > 0 && (
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-copper-ink">
                    <span className="sr-only">Suggested forms: </span>
                    {a.tags.join(" · ")}
                  </p>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
