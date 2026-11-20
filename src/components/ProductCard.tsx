import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/content/products";
import { EnquiryButton } from "./EnquiryButton";

/**
 * Image-first product card. The whole card links to the detail page (stretched title link);
 * "Request details" sits above it and opens the enquiry form pre-filled with this product.
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <article className="card card-hover image-motion-card group relative flex h-full flex-col overflow-hidden">
      <div className="image-motion-frame relative aspect-square overflow-hidden bg-beige">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 296px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-[center_85%]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-forest px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-on-forest">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl leading-tight">
          <Link prefetch={false} href={`/products/${product.slug}`} className="no-underline after:absolute after:inset-0 after:content-[''] hover:text-copper-ink">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed">{product.description}</p>
        <EnquiryButton variant="link" productSlugs={[product.slug]} className="relative z-10 mt-4 self-start">
          Request details
        </EnquiryButton>
      </div>
    </article>
  );
}
