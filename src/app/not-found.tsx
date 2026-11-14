import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata = { title: "Page not found | OM Food and Spices LLP", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="section section-beige">
      <div className="container-x max-w-2xl text-center">
        <SectionHeading as="h1" size="display" eyebrow="404" line1="This page" line2="isn't here." align="center" />
        <p className="mt-6 text-lg">The page may have moved. Try our products, or send us an enquiry.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/products" className="btn btn-outline">View products</Link>
        </div>
      </div>
    </section>
  );
}
