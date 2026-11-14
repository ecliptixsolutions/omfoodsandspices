import type { Metadata } from "next";
import { site } from "@/content/site";

type Opts = {
  title: string;
  description: string;
  path: string; // e.g. "/products"
  image?: string;
  noindex?: boolean;
};

/** Per-page metadata: unique title/description, canonical, Open Graph and Twitter cards. */
export function buildMetadata({ title, description, path, image = "/images/og-default.png", noindex }: Opts): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_IN",
      title,
      description,
      url,
      images: [{ url: image, width: 1405, height: 775, alt: `${site.name} — dehydrated onion and garlic ingredients` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export const abs = (path: string) => `${site.url}${path}`;

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}

export function organizationLd() {
  const c = site.contact;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      logo: abs("/images/logo.png"),
      slogan: site.tagline,
      description:
        "Dehydrated onion and garlic ingredients — flakes, minced, granules and powder — for food manufacturers, seasoning companies, commercial kitchens, importers and bulk buyers.",
      email: c.email,
      telephone: c.phoneTel,
      address: { "@type": "PostalAddress", ...c.address },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: c.phoneTel,
          email: c.email,
          areaServed: "Worldwide",
          availableLanguage: ["English"],
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${site.url}/#localbusiness`,
      name: site.name,
      url: site.url,
      image: abs("/images/og-default.png"),
      logo: abs("/images/logo.png"),
      telephone: c.phoneTel,
      email: c.email,
      address: { "@type": "PostalAddress", ...c.address },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: c.openingHours.days,
          opens: c.openingHours.opens,
          closes: c.openingHours.closes,
        },
      ],
      parentOrganization: { "@id": `${site.url}/#organization` },
    },
  ];
}
