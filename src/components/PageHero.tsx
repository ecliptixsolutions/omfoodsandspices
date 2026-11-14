import Image from "next/image";
import Link from "next/link";
import { EnquiryButton } from "./EnquiryButton";
import { SectionHeading } from "./SectionHeading";
import { ProductGallery } from "./ProductGallery";

type Crumb = { label: string; href?: string };

/** Hero for inner pages: breadcrumb, eyebrow, two-tone H1, intro, CTAs, optional image. */
export function PageHero({
  eyebrow,
  line1,
  line2,
  intro,
  crumbs,
  image,
  imageAlt,
  galleryImages,
  productSlugs,
  cta = true,
  priorityImage = true,
}: {
  eyebrow: string;
  line1: string;
  line2?: string;
  intro: string;
  crumbs: Crumb[];
  image?: string;
  imageAlt?: string;
  galleryImages?: string[];
  productSlugs?: string[];
  cta?: boolean;
  priorityImage?: boolean;
}) {
  return (
    <section className="section-beige border-b border-line">
      <div className={`container-x grid items-center gap-10 py-14 lg:py-20 ${image ? "lg:grid-cols-[1.1fr_0.9fr]" : ""}`}>
        <div>
          <nav aria-label="Breadcrumb" className="mb-6 text-sm">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-2">
                  {c.href ? (
                    <Link href={c.href} className="font-semibold text-copper-ink hover:underline">{c.label}</Link>
                  ) : (
                    <span aria-current="page" className="font-semibold text-ink">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && <span aria-hidden="true">/</span>}
                </li>
              ))}
            </ol>
          </nav>
          <SectionHeading as="h1" size="display" eyebrow={eyebrow} line1={line1} line2={line2} />
          <p className="mt-6 max-w-xl text-lg">{intro}</p>
          {cta && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <EnquiryButton type="quote" productSlugs={productSlugs}>Request a quote</EnquiryButton>
              <EnquiryButton type="sample" productSlugs={productSlugs} variant="link">Get sample</EnquiryButton>
            </div>
          )}
        </div>
        {image && galleryImages?.length ? (
          <ProductGallery images={galleryImages} alt={imageAlt ?? ""} />
        ) : image && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-line shadow-lift">
            <Image
              src={image}
              alt={imageAlt ?? ""}
              fill
              priority={priorityImage}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
