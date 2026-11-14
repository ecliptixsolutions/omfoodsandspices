import { processNote, processSteps } from "@/content/home";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function ProcessSteps() {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {processSteps.map((s, i) => (
        <li key={s.n}>
          <Reveal delay={i * 90} className="h-full">
            <div className="h-full rounded-[1.25rem] border border-line-forest p-7">
              <p className="text-5xl font-extrabold leading-none tracking-tight text-copper-light" aria-hidden="true">{s.n}</p>
              <h3 className="mt-6 text-xl">{s.title}</h3>
              <p className="mt-3 text-[0.95rem]">{s.text}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

export function ProcessSection() {
  return (
    <section id="process" aria-labelledby="process-title" className="section section-forest on-dark">
      <div className="container-x">
        <Reveal className="mb-12 max-w-3xl">
          <SectionHeading id="process-title" eyebrow="From inquiry to supply" line1="A clear conversation," line2="from the start." />
        </Reveal>
        <ProcessSteps />
        <p className="mt-10 max-w-3xl text-sm">{processNote}</p>
      </div>
    </section>
  );
}
