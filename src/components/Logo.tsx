import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

/** Company-supplied logo used in the header, mobile menu and footer. */
export function Logo({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <Link href="/" className={`inline-flex shrink-0 items-center overflow-hidden no-underline ${tone === "dark" ? "rounded-md" : ""} ${className}`} aria-label={`${site.name} — home`}>
      <Image src="/images/logo.png" alt="OM Food and Spices LLP logo" width={1405} height={775} priority className="h-auto w-[145px] sm:w-[170px] xl:w-[185px]" />
    </Link>
  );
}
