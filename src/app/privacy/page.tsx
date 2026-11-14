import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legal } from "@/content/pages";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: legal.privacy.seoTitle, description: legal.privacy.seoDescription, path: "/privacy" });

export default function PrivacyPage() {
  const c = site.contact;
  return (
    <LegalPage title="Privacy Policy" updated="1 November 2026">
      <p>
        This is a general-purpose privacy notice for the {site.name} website. It should be reviewed by the company (and its legal adviser) before launch.
      </p>
      <h2>Information we collect</h2>
      <p>
        When you submit the enquiry form we receive the details you enter: name, company, email, phone/WhatsApp, country, product interest, quantity, packaging, destination, timeline and message.
        If you contact us by phone, email or WhatsApp we receive the details you share in that conversation.
      </p>
      <h2>How we use it</h2>
      <p>We use this information only to respond to your enquiry, discuss products and quotations, and communicate with you about your request.</p>
      <h2>Spam protection</h2>
      <p>The form uses a hidden field and timing checks to block automated spam, and may use Google reCAPTCHA where enabled. Google&apos;s Privacy Policy and Terms apply to reCAPTCHA.</p>
      <h2>Sharing</h2>
      <p>
        Enquiries are delivered to our email inbox through an email delivery service. We do not sell your information. We may share it where required by law.
      </p>
      <h2>Retention and your choices</h2>
      <p>We keep enquiry correspondence for as long as needed to handle your request and for ordinary business records. To ask us to access, correct or delete your information, contact us.</p>
      <h2>Contact</h2>
      <p>
        {site.name}, {c.addressLines.join(" ")}. Email: <a href={`mailto:${c.email}`}>{c.email}</a>. Phone: <a href={`tel:${c.phoneTel}`}>{c.phoneDisplay}</a>.
      </p>
    </LegalPage>
  );
}
