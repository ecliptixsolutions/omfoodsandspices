"use client";

import Link from "next/link";
import { heroBackgroundImages } from "@/content/hero-backgrounds";
import { useEffect, useRef, useState } from "react";
import { heroChips as defaultChips, heroNote as defaultNote, heroSlides as defaultSlides } from "@/content/home";
import {carouselIndex} from "./useCarouselMotion";
import { ArrowRight, ArrowUpRight } from "./Icons";
import { useEnquiry } from "./EnquiryProvider";

const INTERVAL = 2200;


/**
 * Auto-rotating backgrounds. Failed images are skipped; reduced motion removes the fade.
 */
export function HeroSlider({ slides = defaultSlides, images = [], note = defaultNote, chips = defaultChips }: { slides?: typeof defaultSlides; images?: {image:string;alt:string;title?:string;description?:string}[]; note?: string; chips?: string[] }) {
  const { openEnquiry } = useEnquiry();
  const [active, setActive] = useState(0);
  const visibleImages = images.length ? images : heroBackgroundImages;
  const count = visibleImages.length;
  const copy = slides[0] ?? defaultSlides[0];
  const currentImage = visibleImages[carouselIndex(active, count)];
  const readyImages = useRef(new Set<number>());
  const [readyCount, setReadyCount] = useState(0);
  const playing = readyCount > 1;

  useEffect(() => {
    let cancelled = false;
    readyImages.current = new Set();
    setReadyCount(0);
    visibleImages.forEach(({ image }, index) => {
      const preload = new window.Image();
      preload.src = image;
      preload.decode().then(() => {
        if (cancelled) return;
        readyImages.current.add(index);
        setReadyCount(readyImages.current.size);
        setActive(previous => readyImages.current.has(carouselIndex(previous, count)) ? previous : index);
      }).catch(() => {
        // One unavailable photo must not stop the remaining backgrounds.
      });
    });
    return () => { cancelled = true; };
  }, [visibleImages, count]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActive(previous => {
      for (let step = 1; step <= count; step++) {
        const next = previous + step;
        if (readyImages.current.has(carouselIndex(next, count))) return next;
      }
      return previous;
    }), INTERVAL);
    return () => window.clearInterval(timer);
  }, [playing, count]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured products"
      className="hero-two-column on-dark bg-forest text-on-forest"
    >
      <link rel="preload" as="image" href={visibleImages[0]?.image} />
      <div className="container-x hero-two-column-grid">
      <div className="hero-company-copy hero-copy-entrance">
        <p className="eyebrow mb-5 !text-copper-light">{copy.eyebrow}</p>
        <h1 data-no-translate className="h-display hero-company-heading !text-on-forest">
          <span className="text-copper-light">{copy.lines[0]}</span>
          <br /> <span className="text-on-forest">{copy.lines[1]}</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-on-forest-muted md:text-xl">{copy.text}</p>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
          <button type="button" className="btn btn-primary" onClick={() => openEnquiry({ type: "quote", productSlugs: copy.primary.product ? [copy.primary.product] : undefined })}>
            Request a quote <ArrowUpRight size={16} />
          </button>
          <Link href={copy.secondary.href} className="link-arrow !text-on-forest hover:!text-copper-light">
            Explore our products <ArrowRight size={16} />
          </Link>
        </div>

        <p className="mt-9 text-sm text-on-forest-muted">{note}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {chips.map((c) => (
            <li key={c} className="chip text-xs sm:text-sm">{c}</li>
          ))}
        </ul>
      </div>

      <figure className="hero-product-carousel" aria-label="Product and manufacturing photographs">
        <div className="hero-product-media">
          {visibleImages.map((slide, index) => (
            <div key={slide.image} className="hero-product-slide transition-opacity duration-[600ms] ease-in-out motion-reduce:transition-none"
              style={{ opacity: index === carouselIndex(active, count) ? 1 : 0 }}
              aria-hidden={index !== carouselIndex(active, count)}>
              <img src={slide.image} alt={slide.alt} className="hero-product-image" width={380} height={250} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} />
            </div>
          ))}
          <span aria-hidden="true" className="hero-carousel-progress"><i style={{ width: `${((carouselIndex(active, count) + 1) / count) * 100}%` }} /></span>
        </div>
        <figcaption key={currentImage.image} className="hero-product-caption hero-caption-transition">
          <h2>{currentImage.title ?? currentImage.alt}</h2>
          <p>{currentImage.description ?? ""}</p>
        </figcaption>
      </figure>
      </div>

      <p className="sr-only" aria-live={playing ? "off" : "polite"}>
        Slide {carouselIndex(active,count) + 1} of {count}
      </p>
    </section>
  );
}

