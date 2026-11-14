import { WhatsAppIcon } from "./Icons";

/** Round WhatsApp button. Pass a `whatsappLink(message)` href (see src/content/site.ts). */
export function WhatsAppButton({ href, className = "", label = "Chat with us on WhatsApp" }: { href: string; className?: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opens in a new tab)`}
      className={`grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-on-copper shadow-lift ring-2 ring-paper transition-transform hover:scale-105 ${className}`}
    >
      <WhatsAppIcon size={30} />
    </a>
  );
}
