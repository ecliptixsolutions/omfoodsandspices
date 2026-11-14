import { tickerItems } from "@/content/home";

/** Slow-scrolling strip of formats. Pauses on hover; static (wrapped) for reduced-motion users. */
export function Ticker() {
  const Row = ({ hidden }: { hidden?: boolean }) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {tickerItems.map((t) => (
        <li key={t} className="flex items-center">
          <span className="px-6 text-lg font-extrabold uppercase tracking-[0.16em] text-ink sm:text-xl">{t}</span>
          <span aria-hidden="true" className="text-xl text-copper-ink">✳</span>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Available formats" className="marquee section-beige overflow-hidden border-y border-line py-5">
      <div className="marquee-track">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
