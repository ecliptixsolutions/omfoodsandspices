import { site } from "@/content/site";
import { Phone } from "./Icons";

export function TopBar() {
  return (
    <div className="on-dark bg-forest-deep text-on-forest">
      <div className="container-x flex items-center justify-between gap-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] sm:text-xs">
        <p className="hidden truncate sm:block">{site.topBarText}</p>
        <p className="truncate sm:hidden">Bulk supply &amp; export enquiries welcome</p>
        <a href={`tel:${site.contact.phoneTel}`} className="inline-flex shrink-0 items-center gap-2 no-underline hover:text-copper-light">
          <Phone size={14} />
          <span>{site.contact.phoneDisplay}</span>
        </a>
      </div>
    </div>
  );
}
