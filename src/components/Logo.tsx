import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

/** Company-supplied logo used in the header, mobile menu and footer. */
export function Logo({ tone = "light", className = "", src = "/images/logo.png", name = site.name, priority=false }: { tone?: "light" | "dark"; className?: string; src?: string; name?: string;priority?:boolean }) {
  return (
    <Link href="/" className={`inline-flex shrink-0 items-center overflow-hidden no-underline ${tone === "dark" ? "rounded-md" : ""} ${className}`} aria-label={`${name} — home`}>
      <Image src={src} alt={`${name} logo`} width={1405} height={775} priority={priority} sizes="(min-width: 1280px) 185px, (min-width: 640px) 170px, 145px" className="h-auto w-[145px] sm:w-[170px] xl:w-[185px]" />
    </Link>
  );
}
