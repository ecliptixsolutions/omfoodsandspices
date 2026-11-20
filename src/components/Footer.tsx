import Link from "next/link";
import { footerColumns, site } from "@/content/site";
import { Clock, Mail, Phone, Pin } from "./Icons";
import { Logo } from "./Logo";
import type { ContactSettings } from "@/lib/site-content.server";

export function Footer({ contact = site.contact, logo, companyName = site.name }: { contact?: ContactSettings; logo?: string; companyName?: string }) {
  const c = contact;
  return (
    <footer className="on-dark bg-forest text-on-forest-muted">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr]">
        <div>
          <Logo tone="dark" src={logo} name={companyName} />
          <p className="mt-6 text-lg font-extrabold text-on-forest">{site.tagline}</p>
          <p className="mt-2 max-w-xs text-[0.95rem]">{site.footerLine}</p>
        </div>

        {footerColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="eyebrow mb-4 !text-copper-light">{col.title}</h2>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[0.95rem] text-on-forest no-underline hover:text-copper-light hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="eyebrow mb-4 !text-copper-light">Bulk ingredient enquiries</h2>
          <ul className="space-y-3.5 text-[0.95rem]">
            <li className="flex gap-3">
              <Phone size={18} className="mt-1 shrink-0 text-copper-light" />
              <a href={`tel:${c.phoneTel}`} className="text-on-forest no-underline hover:text-copper-light hover:underline">{c.phoneDisplay}</a>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="mt-1 shrink-0 text-copper-light" />
              <a href={`mailto:${c.email}`} className="break-all text-on-forest no-underline hover:text-copper-light hover:underline">{c.email}</a>
            </li>
            <li className="flex gap-3">
              <Pin size={18} className="mt-1 shrink-0 text-copper-light" />
              <address className="not-italic">
                {c.addressLines.map((l) => (
                  <span key={l} className="block">{l}</span>
                ))}
              </address>
            </li>
            <li className="flex gap-3">
              <Clock size={18} className="mt-1 shrink-0 text-copper-light" />
              <span>
                {c.hours}
                <span className="block text-sm">({c.hoursNote.replace(/\.$/, "")})</span>
              </span>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-4">
            {([["Google Maps", c.mapsUrl], ["Facebook", c.facebookUrl], ["Instagram", c.instagramUrl], ["LinkedIn", c.linkedinUrl]] as const).map(([label, url]) => url && /^https?:\/\//i.test(url) ? <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="text-on-forest underline">{label}</a> : null)}
          </div>
        </div>
      </div>

      {/* extra bottom padding on small screens keeps the floating buttons clear of the legal links */}
      <div className="border-t border-line-forest">
        <div className="container-x flex flex-col items-center justify-between gap-3 pb-24 pt-6 text-sm sm:flex-row sm:pb-6">
          <p>© 2026 {companyName}</p>
          <ul className="flex items-center gap-5">
            <li><Link href="/privacy" className="text-on-forest no-underline hover:text-copper-light hover:underline">Privacy</Link></li>
            <li><Link href="/terms" className="text-on-forest no-underline hover:text-copper-light hover:underline">Terms</Link></li>
            <li><Link href="/blog" className="text-on-forest no-underline hover:text-copper-light hover:underline">Ingredient guides</Link></li>
            <li><Link href="/enquiry" className="text-on-forest no-underline hover:text-copper-light hover:underline">Contact</Link></li>
          </ul>
          <p className="font-bold uppercase tracking-[0.18em] text-on-forest">Gujarat, India</p>
        </div>
      </div>
    </footer>
  );
}
