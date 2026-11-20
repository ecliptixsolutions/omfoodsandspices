import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legal } from "@/content/pages";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { getPublicContact } from "@/lib/site-content.server";

export const metadata: Metadata = buildMetadata({ title: legal.privacy.seoTitle, description: legal.privacy.seoDescription, path: "/privacy" });

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const c = await getPublicContact();
  return (
    <LegalPage title="Privacy Policy" updated="18 November 2026">
      <p>
        This notice explains how the {site.name} website handles ingredient enquiries, language preferences and access to website administration. Contact the company if you have a question about the information you provide.
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
        Enquiries are stored in the company&apos;s enquiry system. Where email delivery is configured, an enquiry notification is also sent through the email delivery service. Website hosting and database providers process information needed to operate these services. We do not sell enquiry information.
      </p>
      <h2>Language preferences and administration</h2>
      <p>A language-preference cookie remembers English, Hindi or Gujarati. Restricted administration uses a session cookie to keep authorized users signed in. These controls are separate from submitting a product enquiry.</p>
      <h2>Optional measurement and external links</h2>
      <p>Google Analytics loads only when a measurement identifier is configured for this website. WhatsApp, maps and other external links open services with their own privacy terms; a message is sent only when you choose to send it in that service.</p>
      <h2>Retention and your choices</h2>
      <p>We keep enquiry correspondence for as long as needed to handle your request and for ordinary business records. To ask us to access, correct or delete your information, contact us.</p>
      <h2>Contact</h2>
      <p>
        {site.name}, {c.addressLines.join(" ")}. Email: <a href={`mailto:${c.email}`}>{c.email}</a>. Phone: <a href={`tel:${c.phoneTel}`}>{c.phoneDisplay}</a>.
      </p>
    </LegalPage>
  );
}
