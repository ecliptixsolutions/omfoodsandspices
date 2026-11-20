"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {useCarouselMotion} from "./useCarouselMotion";

export function ProductGallery({ images, alt, priority=false }: { images: string[]; alt: string; priority?:boolean }) {
  const [active, setActive] = useState(0);
  const ref=useRef<HTMLDivElement>(null);
  const playing=useCarouselMotion(ref);

  useEffect(() => {
    if(!playing||images.length<2)return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % images.length), 2500);
    return () => window.clearInterval(timer);
  }, [images.length,playing]);

  return (
    <div ref={ref}>
      <div className="image-motion-frame relative aspect-square overflow-hidden rounded-[1.75rem] border border-line bg-beige shadow-lift">
        <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ width: `${images.length * 100}%`, transform: `translateX(-${(active * 100) / images.length}%)` }}>
          {images.map((src, index) => (
            <div key={src} className="relative h-full shrink-0" style={{ width: `${100 / images.length}%` }} aria-hidden={index !== active}>
              <Image
                src={src}
                alt={alt}
                fill
                priority={priority && index === 0}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-[center_85%]"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-3" aria-label={`${alt} image thumbnails`}>
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show ${alt} image ${index + 1}`}
            aria-pressed={index === active}
            className={`image-motion-frame relative h-16 w-20 overflow-hidden rounded-lg border-2 bg-beige transition-colors ${index === active ? "border-copper" : "border-line hover:border-copper/60"}`}
          >
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
