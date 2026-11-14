"use client";

import { useEffect, useRef, useState } from "react";
import { productFootnote, products, type Category } from "@/content/products";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import { Chevron } from "./Icons";

type Filter = "all" | Category | `product:${string}`;
type OpenMenu = Category | null;

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "onion", label: "Onion" },
  { id: "garlic", label: "Garlic" },
];

function menuLabel(slug: string, name: string) {
  const labels: Record<string, string> = {
    "pink-onion": "Pink Onion",
    "dehydrated-onion-flakes": "Dehydrated Onion Flakes",
    "dehydrated-minced-onion": "Minced Onion",
    "dehydrated-onion-granules": "Onion Granules",
    "dehydrated-onion-powder": "Onion Powder",
    "dehydrated-garlic-flakes": "Garlic Flakes",
    "dehydrated-minced-garlic": "Minced Garlic",
    "dehydrated-garlic-granules": "Garlic Granules",
    "dehydrated-garlic-powder": "Garlic Powder",
  };
  return labels[slug] ?? name;
}

/** Filterable product grid with category menus and dynamic product filtering. */
export function ProductGrid({ initial = "all" }: { initial?: "all" | Category }) {
  const [filter, setFilter] = useState<Filter>(initial);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<Category, HTMLButtonElement | null>>({ onion: null, garlic: null });

  useEffect(() => {
    if (!openMenu) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        triggerRefs.current[openMenu]?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openMenu]);

  const selectedSlug = filter.startsWith("product:") ? filter.slice("product:".length) : null;
  const activeCategory = selectedSlug
    ? products.find((product) => product.slug === selectedSlug)?.category
    : filter === "all" ? null : filter;
  const shown = filter === "all"
    ? products
    : selectedSlug
      ? products.filter((product) => product.slug === selectedSlug)
      : products.filter((product) => product.category === filter);

  function chooseCategory(category: Category) {
    setFilter(category);
    setOpenMenu((current) => current === category ? null : category);
  }

  function chooseProduct(slug: string) {
    setFilter(`product:${slug}`);
    setOpenMenu(null);
  }

  return (
    <div ref={rootRef}>
      <div role="group" aria-label="Filter products" className="mb-8 flex flex-wrap items-start gap-2 sm:gap-3">
        <button
          type="button"
          aria-pressed={filter === "all"}
          onClick={() => { setFilter("all"); setOpenMenu(null); }}
          className={`rounded-full border-[1.5px] px-3 py-2 text-xs font-bold transition-colors sm:px-5 sm:text-sm ${filter === "all" ? "border-forest bg-forest text-on-forest" : "border-line bg-card text-ink hover:border-copper-ink hover:text-copper-ink"}`}
        >
          All
        </button>
        {CATEGORIES.map(({ id, label }) => {
          const categoryProducts = products.filter((product) => product.category === id);
          const isActive = activeCategory === id;
          const isOpen = openMenu === id;
          return (
            <div className="relative" key={id}>
              <button
                ref={(node) => { triggerRefs.current[id] = node; }}
                type="button"
                aria-pressed={isActive}
                aria-expanded={isOpen}
                aria-controls={`${id}-product-menu`}
                onClick={() => chooseCategory(id)}
                className={`inline-flex items-center gap-1.5 rounded-full border-[1.5px] px-3 py-2 text-xs font-bold transition-colors sm:gap-2 sm:px-5 sm:text-sm ${isActive ? "border-forest bg-forest text-on-forest" : "border-line bg-card text-ink hover:border-copper-ink hover:text-copper-ink"}`}
              >
                {label}<Chevron size={17} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <ul
                  id={`${id}-product-menu`}
                  aria-label={`${label} products`}
                  className={`absolute ${id === "garlic" ? "right-0 sm:left-0 sm:right-auto" : "left-0"} top-[calc(100%+0.25rem)] z-30 max-h-72 min-w-56 max-w-[calc(100vw-2.5rem)] overflow-y-auto rounded-2xl border border-line bg-paper p-2 shadow-xl animate-[menu-pop_160ms_ease-out]`}
                >
                  {categoryProducts.map((product) => {
                    const selected = selectedSlug === product.slug;
                    return (
                      <li key={product.slug}>
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() => chooseProduct(product.slug)}
                          className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-beige ${selected ? "bg-beige text-forest" : "text-ink"}`}
                        >
                          {menuLabel(product.slug, product.name)}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        Showing {shown.length} product{shown.length === 1 ? "" : "s"}{selectedSlug ? `: ${products.find((product) => product.slug === selectedSlug)?.name}` : ""}
      </p>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((product, index) => (
          <li key={product.slug}>
            <Reveal delay={(index % 4) * 70} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          </li>
        ))}
      </ul>
      <div className="mt-8 space-y-2 text-sm">
        <p>{productFootnote}</p>
        <p className="text-xs">Pink Onion photo: <a href="https://commons.wikimedia.org/wiki/File:Bangalore_rose_onion.jpg" target="_blank" rel="noreferrer">Maaimpex / Wikimedia Commons</a>, licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</p>
      </div>
    </div>
  );
}
