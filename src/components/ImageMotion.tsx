"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: SSR images stay visible, and carousel tracks are never transformed. */
export function ImageMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.querySelector("#main");
    if (!root || typeof IntersectionObserver === "undefined") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const images = new Set<HTMLImageElement>();
    const targets = new Set<HTMLElement>();
    const animations = new Set<Animation>();
    const cleanup: (() => void)[] = [];
    const frames: Keyframe[] = [
      { opacity: 0, transform: "translateY(20px) scale(.97)" },
      { opacity: 1, transform: "none" },
    ];
    let initialStagger = 0;
    function animate(element: HTMLElement, frames: Keyframe[], duration: number, delay = 0) {
      if (preference.matches || typeof element.animate !== "function") return;
      const animation = element.animate(frames, { duration, delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
      animations.add(animation);
      animation.finished.catch(() => {}).finally(() => animations.delete(animation));
    }
    const observer = new IntersectionObserver(entries => {
      let stagger = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target as HTMLElement;
        target.dataset.imageReveal = "done";
        observer.unobserve(target);
        animate(target, frames, 700, (stagger++ % 4) * 100);
      }
    }, { threshold: .05 });
    function reveal(target: HTMLElement) {
      if (targets.has(target) || target.dataset.imageReveal === "done") return;
      targets.add(target);
      // Reuse existing Reveal wrappers. First-screen imagery gets the same subtle reveal
      // instead of being silently skipped, so the enhancement is actually perceptible.
      if (preference.matches || target.closest("[data-scroll-reveal]")) {
        target.dataset.imageReveal = "done";
        return;
      }
      if (target.getBoundingClientRect().top < innerHeight) {
        target.dataset.imageReveal = "initial";
        const frame = requestAnimationFrame(() => {
          target.dataset.imageReveal = "done";
          animate(target, frames, 700, (initialStagger++ % 4) * 100);
        });
        cleanup.push(() => cancelAnimationFrame(frame));
        return;
      }
      target.dataset.imageReveal = "pending";
      observer.observe(target);
    }
    function register(image: HTMLImageElement) {
      if (images.has(image)) return;
      images.add(image);
      const hero = image.closest<HTMLElement>(".hero-product-carousel");
      image.dataset.imageMotion = hero ? "carousel" : "standard";
      reveal(hero ?? image.closest<HTMLElement>(".image-motion-frame") ?? image);
      if (hero) return; // The hero already owns its synchronized 600ms crossfade.
      const loaded = () => {
        const wasPending = image.dataset.imageLoading === "pending";
        delete image.dataset.imageLoading;
        if (wasPending && image.naturalWidth) animate(image, [{ opacity: 0 }, { opacity: 1 }], 550);
      };
      const pending = () => {
        if (image.complete || image.fetchPriority === "high" || image.getBoundingClientRect().top < innerHeight || preference.matches) {
          delete image.dataset.imageLoading;
        } else image.dataset.imageLoading = "pending";
      };
      pending();
      image.addEventListener("load", loaded);
      image.addEventListener("error", loaded);
      cleanup.push(() => { image.removeEventListener("load", loaded); image.removeEventListener("error", loaded); delete image.dataset.imageLoading; });
    }
    function scan(node: Element) {
      if (node instanceof HTMLImageElement) register(node);
      node.querySelectorAll("img").forEach(register);
    }
    scan(root);
    const mutations = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) if (node instanceof Element) scan(node);
      }
    });
    mutations.observe(root, { childList: true, subtree: true });
    const reduce = () => {
      if (!preference.matches) return;
      animations.forEach(animation => animation.cancel());
      observer.disconnect();
      targets.forEach(target => { target.dataset.imageReveal = "done"; });
      images.forEach(image => { delete image.dataset.imageLoading; });
    };
    preference.addEventListener("change", reduce);
    return () => {
      observer.disconnect(); mutations.disconnect();
      preference.removeEventListener("change", reduce);
      animations.forEach(animation => animation.cancel());
      cleanup.forEach(dispose => dispose());
      targets.forEach(target => { if (target.dataset.imageReveal === "pending") delete target.dataset.imageReveal; });
    };
  }, [pathname]);
  return null;
}
