"use client";

import { usePathname } from "next/navigation";
import { whatsappLink } from "@/content/site";
import { useEnquiry } from "./EnquiryProvider";
import { WhatsAppButton } from "./WhatsAppButton";
import { Plus } from "./Icons";

/** Floating WhatsApp (bottom right) and Quick Enquiry (bottom left). Compact on phones. */
export function FloatingActions() {
  const pathname = usePathname();
  const { openEnquiry } = useEnquiry();
  return (
    <>
      {pathname !== "/enquiry" && (
        <button
          type="button"
          onClick={() => openEnquiry()}
          className="on-dark fixed bottom-4 left-4 z-30 inline-flex items-center gap-2 rounded-full bg-forest px-4 py-3 text-sm font-bold text-on-forest shadow-lift ring-2 ring-paper hover:bg-forest-deep sm:bottom-6 sm:left-6 sm:px-5"
        >
          <Plus size={18} className="text-copper-light" />
          Quick Enquiry
        </button>
      )}
      <WhatsAppButton href={whatsappLink()} className="fixed bottom-4 right-4 z-30 sm:bottom-6 sm:right-6" />
    </>
  );
}
