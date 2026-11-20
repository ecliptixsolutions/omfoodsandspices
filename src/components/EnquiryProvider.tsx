"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { EnquiryType } from "@/lib/enquiry";
import dynamic from "next/dynamic";
import { Close } from "./Icons";
import type { Product } from "@/content/products";
import type { ContactSettings } from "@/lib/site-content.server";
import { site } from "@/content/site";
import type { PublicCategory } from "@/lib/products.server";

type OpenOpts = { productSlugs?: string[]; type?: EnquiryType };
type Ctx = { openEnquiry: (opts?: OpenOpts) => void; contact: ContactSettings };

const EnquiryContext = createContext<Ctx | null>(null);
const EnquiryForm=dynamic(()=>import("./EnquiryForm").then(m=>m.EnquiryForm),{loading:()=> <p role="status" className="py-8">Loading enquiry form…</p>});

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used inside <EnquiryProvider>");
  return ctx;
}

/**
 * Provides `openEnquiry()` to the whole site and renders the enquiry modal.
 * Uses the native <dialog> element: focus is trapped, Escape closes, and focus
 * returns to the button that opened it.
 */
export function EnquiryProvider({ children, products, categories, contact = site.contact }: { children: ReactNode; products?: Product[]; categories?: PublicCategory[]; contact?: ContactSettings }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [opts, setOpts] = useState<OpenOpts>({});
  const [formKey, setFormKey] = useState(0);

  const openEnquiry = useCallback((o: OpenOpts = {}) => {
    setOpts(o);
    setFormKey((k) => k + 1);
    setOpen(true);
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (isOpen && !d.open) d.showModal();
    if (!isOpen && d.open) d.close();
  }, [isOpen]);

  const value = useMemo(() => ({ openEnquiry, contact }), [openEnquiry, contact]);

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      <dialog
        ref={ref}
        className="modal"
        aria-labelledby="enquiry-modal-title"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 pb-4 pt-6">
          <div>
            <p className="eyebrow mb-1">Quick enquiry</p>
            <h2 id="enquiry-modal-title" className="text-2xl sm:text-3xl">
              Request a quote or sample
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close enquiry form"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-card text-ink hover:bg-beige"
          >
            <Close size={20} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 pb-8 pt-6">
          {isOpen && <EnquiryForm key={formKey} idPrefix="modal" initialSlugs={opts.productSlugs} initialType={opts.type} products={products} categories={categories} contact={contact} />}
        </div>
      </dialog>
    </EnquiryContext.Provider>
  );
}
