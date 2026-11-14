"use client";

import { useId, useState } from "react";
import type { FaqItem } from "@/content/faq";
import { Plus } from "./Icons";

/** Accessible accordion — native buttons, aria-expanded/controls, smooth height animation (grid-rows). One open at a time. */
export function FAQ({ items, defaultOpen = 0 }: { items: FaqItem[]; defaultOpen?: number | null }) {
  const uid = useId().replace(/:/g, "");
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${uid}-q${i}`;
        const panelId = `${uid}-a${i}`;
        return (
          <div key={item.q}>
            <h3 className="!text-base !tracking-normal">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-extrabold text-ink hover:text-copper-ink"
              >
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-card text-copper-ink transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                >
                  <Plus size={18} />
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} data-open={isOpen} className="acc-panel" inert={!isOpen}>
              <div>
                <p className="max-w-3xl pb-6 pr-14">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
