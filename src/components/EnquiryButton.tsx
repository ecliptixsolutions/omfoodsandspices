"use client";

import type { ReactNode } from "react";
import type { EnquiryType } from "@/lib/enquiry";
import { useEnquiry } from "./EnquiryProvider";
import { ArrowUpRight } from "./Icons";

type Props = {
  children: ReactNode;
  productSlugs?: string[];
  type?: EnquiryType;
  variant?: "primary" | "outline" | "link";
  className?: string;
  arrow?: boolean;
};

/** A button that opens the enquiry modal, optionally pre-filled with product(s) and enquiry type. */
export function EnquiryButton({ children, productSlugs, type, variant = "primary", className = "", arrow = true }: Props) {
  const { openEnquiry } = useEnquiry();
  const cls = variant === "link" ? "link-arrow" : variant === "outline" ? "btn btn-outline" : "btn btn-primary";
  return (
    <button type="button" className={`${cls} ${className}`} onClick={() => openEnquiry({ productSlugs, type })}>
      {children}
      {arrow && <ArrowUpRight size={variant === "link" ? 16 : 16} />}
    </button>
  );
}
