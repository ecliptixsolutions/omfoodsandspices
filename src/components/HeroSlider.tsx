"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { heroChips, heroNote, heroSlides } from "@/content/home";
import { ArrowRight, ArrowUpRight } from "./Icons";
import { useEnquiry } from "./EnquiryProvider";

const INTERVAL = 2250;
const productSlides = [
  { image: "/images/products/garlic-flakes-1.webp", alt: "Dehydrated garlic flakes" },
  { image: "/images/products/white-onion-flakes-1.webp", alt: "White dehydrated onion flakes" },
  { image: "/images/products/white-onion-granules-1.webp", alt: "White dehydrated onion granules" },
  { image: "/images/products/garlic-granules-1.webp", alt: "Dehydrated garlic granules" },
  { image: "/images/products/white-onion-powder-1.webp", alt: "White dehydrated onion powder" },
  { image: "/images/products/garlic-powder-1.webp", alt: "Dehydrated garlic powder" },
  { image: "/images/products/red-onion-flakes-1.webp", alt: "Dehydrated red onion flakes" },
];

/**
 * Auto-rotating hero. Arrow keys change slides and Space toggles playback when
 * the slider has focus. Autoplay is off for reduced-motion users.
 */
export function HeroSlider() {
  const { openEnquiry } = useEnquiry();
  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const regionRef = useRef<HTMLElement>(null);
  const count = productSlides.length;
  const copy = heroSlides[active % heroSlides.length];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setUserPaused(true);
  }, []);

  const playing = !userPaused;

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % count), INTERVAL);
    return () => window.clearTimeout(t);
  }, [playing, active, count]);

  const go = useCallback((i: number) => setActive(((i % count) + count) % count), [count]);

  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1);
    } else if (e.key === " " && e.target === e.currentTarget) {
      // only when the slider itself is focused, so buttons and links keep their normal Space behaviour
      e.preventDefault();
      setUserPaused((p) => !p);
    }
  }

  return (
    <section
      ref={regionRef}
      aria-roledescription="carousel"
      aria-label="Featured products"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="on-dark relative isolate min-h-[39rem] overflow-hidden bg-forest text-on-forest outline-offset-[-4px] md:min-h-[46rem]"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="flex h-full transition-transform duration-1000 ease-in-out" style={{ width: `${count * 100}%`, transform: `translateX(-${(active * 100) / count}%)` }}>
        {productSlides.map((slide, i) => (
          <div key={slide.image} className="relative h-[39rem] shrink-0 md:h-[46rem]" style={{ width: `${100 / count}%` }} aria-hidden={i !== active}>
            <Image src={slide.image} alt={slide.alt} fill priority={i === 0} sizes="100vw" className="object-cover object-center" />
          </div>
        ))}
      </div>
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-forest/90 via-forest/65 to-forest/35" aria-hidden="true" />
      <div className="container-x relative z-[2] flex min-h-[39rem] flex-col justify-center pb-24 pt-16 md:min-h-[46rem] md:pb-28 md:pt-28">
        <p className="eyebrow mb-5 !text-copper-light">{copy.eyebrow}</p>
        <h1 className="h-display max-w-3xl !text-on-forest">
          {copy.lines[0]}
          <br className="hidden sm:block" /> <span className="text-copper-light">{copy.lines[1]}</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-on-forest-muted md:text-xl">{copy.text}</p>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
          <button type="button" className="btn btn-primary" onClick={() => openEnquiry({ type: "quote", productSlugs: copy.primary.product ? [copy.primary.product] : undefined })}>
            {copy.primary.label} <ArrowUpRight size={16} />
          </button>
          <Link href={copy.secondary.href} className="link-arrow !text-on-forest hover:!text-copper-light">
            {copy.secondary.label} <ArrowRight size={16} />
          </Link>
        </div>

        <p className="mt-9 text-sm text-on-forest-muted">{heroNote}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {heroChips.map((c) => (
            <li key={c} className="chip text-xs sm:text-sm">{c}</li>
          ))}
        </ul>
      </div>

      <p className="sr-only" aria-live={playing ? "off" : "polite"}>
        Slide {active + 1} of {count}
      </p>
    </section>
  );
}
