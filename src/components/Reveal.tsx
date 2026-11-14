"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Gentle fade/slide-in on scroll. Content is fully visible on the server and
 * without JavaScript; elements already in view on load are never hidden.
 * Honours prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"visible" | "hidden" | "shown">("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return; // already on screen — leave visible
    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = state === "hidden" ? "reveal-hidden" : state === "shown" ? "reveal-shown" : "";
  const Comp = Tag as "div";
  return (
    <Comp
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${cls} ${className}`}
      style={state === "shown" && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Comp>
  );
}
