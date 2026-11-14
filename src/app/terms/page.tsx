import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legal } from "@/content/pages";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: legal.terms.seoTitle, description: legal.terms.seoDescription, path: "/terms" });

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="1 November 2026">
      <p>
        These general terms apply to your use of the {site.name} website. They should be reviewed by the company (and its legal adviser) before launch.
      </p>
      <h2>Information only</h2>
      <p>
        This website provides general information about our dehydrated onion and garlic ingredients. It is not an offer to sell. Product formats, availability, specifications, packaging, pricing, lead times and shipping are subject to confirmation by the company.
      </p>
      <h2>Enquiries</h2>
      <p>Submitting an enquiry does not create a binding order or contract. Order acceptance depends on confirmation by the company.</p>
      <h2>Accuracy</h2>
      <p>We try to keep information accurate, but it may change without notice. Please confirm details directly with us before relying on them.</p>
      <h2>Intellectual property</h2>
      <p>The content of this website belongs to {site.name} or its licensors. Please do not reproduce it without permission.</p>
      <h2>Governing law</h2>
      <p>The governing law and jurisdiction clause is to be confirmed by the company.</p>
    </LegalPage>
  );
}
