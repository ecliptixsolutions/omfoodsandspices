import { workingTogether } from "@/content/home";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function WorkingTogether() {
  return (
    <section aria-labelledby="working-title" className="section section-paper">
      <div className="container-x">
        <Reveal className="mb-12 max-w-3xl">
          <SectionHeading id="working-title" eyebrow={workingTogether.eyebrow} line1={workingTogether.title[0]} line2={workingTogether.title[1]} />
        </Reveal>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {workingTogether.cards.map((c, i) => (
            <li key={c.n}>
              <Reveal delay={i * 80} className="h-full">
                <article className="card card-hover h-full p-7">
                  <p className="text-5xl font-extrabold leading-none tracking-tight text-copper-ink" aria-hidden="true">{c.n}</p>
                  <h3 className="mt-6 text-xl">{c.title}</h3>
                  <p className="mt-3 text-[0.95rem]">{c.text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
