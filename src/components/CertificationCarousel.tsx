"use client";

import { useEffect, useState } from "react";

const logos = [
  { src: "/images/certificates/fssai-logo.png", alt: "FSSAI" },
  { src: "/images/certificates/apeda-logo.png", alt: "APEDA" },
  { src: "/images/certificates/udyam-registration.png", alt: "UDYAM Registration" },
  { src: "/images/recognitions/gst-logo.jpeg", alt: "GST" },
  { src: "/images/recognitions/iec-logo.png", alt: "IEC" },
];

/** Rotates complete logo cards, so no logo is clipped at the strip edges. */
export function CertificationCarousel() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setOffset((current) => (current + 1) % logos.length), 2600);
    return () => window.clearInterval(timer);
  }, []);

  const visibleLogos = logos.map((_, index) => logos[(index + offset) % logos.length]);
  return (
    <section className="certification-carousel" aria-label="Registrations and recognition logos">
      <ul className="certification-carousel-row">
        {visibleLogos.map((logo, index) => (
          <li key={`${logo.src}-${offset}-${index}`} className="certification-carousel-item">
            <img src={logo.src} alt={logo.alt} />
          </li>
        ))}
      </ul>
    </section>
  );
}
