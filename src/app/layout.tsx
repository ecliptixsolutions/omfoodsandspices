import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/content/site";
import { organizationLd } from "@/lib/seo";
import { EnquiryProvider } from "@/components/EnquiryProvider";
import { ImageMotion } from "@/components/ImageMotion";
import { FloatingActions } from "@/components/FloatingActions";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { TopBar } from "@/components/TopBar";
import { LocaleProvider } from "@/components/LocaleProvider";
import { cookies, headers } from "next/headers";
import { getPublishedCategories, getPublishedProducts } from "@/lib/products.server";
import { getPublicContact, getPublicGeneralSettings } from "@/lib/site-content.server";
import { isAdminPreview } from "@/lib/admin/auth.server";
import { AdminPreviewBanner } from "@/components/AdminPreviewBanner";

// Manrope (SIL Open Font License), self-hosted so there is no render-blocking request to Google Fonts.
const manrope = localFont({
  src: [
    { path: "../fonts/manrope-latin-wght-normal.woff2", weight: "200 800", style: "normal" },
  ],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Roboto", "sans-serif"],
  adjustFontFallback: "Arial",
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  if (requestHeaders.get("x-om-path")?.startsWith("/admin")) {
    return {
      metadataBase: new URL(site.url),
      title: { default: "Admin sign in | OM Food and Spices LLP", template: "%s" },
      robots: { index: false, follow: false },
    };
  }
  const settings = await getPublicGeneralSettings();
  return {
    metadataBase: new URL(site.url),
    title: { default: settings.websiteTitle, template: "%s" },
    description: settings.seoDescription,
    applicationName: settings.companyName,
    verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#21392c",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("om_locale")?.value;
  const initialLocale = savedLocale === "hi" || savedLocale === "gu" ? savedLocale : "en";

  // The admin screens need only the shared styles and locale context. Skipping
  // public-site CMS queries keeps login available when Hostinger is unreachable.
  if (requestHeaders.get("x-om-path")?.startsWith("/admin")) {
    return (
      <html lang={initialLocale} className={manrope.variable}>
        <body suppressHydrationWarning>
          <LocaleProvider initialLocale={initialLocale}>
            <main id="main" tabIndex={-1} className="outline-none">{children}</main>
          </LocaleProvider>
        </body>
      </html>
    );
  }

  const [publishedProducts, publishedCategories, contact, general] = await Promise.all([
    getPublishedProducts(), getPublishedCategories(), getPublicContact(), getPublicGeneralSettings(),
  ]);
  const preview = await isAdminPreview();
  return (
    <html lang={initialLocale} className={manrope.variable}>
      <body suppressHydrationWarning>
        <a href="#main" className="skip-link">Skip to content</a>
        <LocaleProvider initialLocale={initialLocale}>
        <EnquiryProvider products={publishedProducts} categories={publishedCategories} contact={contact}>
          <div className="public-site-chrome">
            {preview && <AdminPreviewBanner />}
            <TopBar contact={contact} />
            <Header logo={general.logo} companyName={general.companyName} />
          </div>
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <ImageMotion />
          <div className="public-site-chrome">
            <Footer contact={contact} logo={general.logo} companyName={general.companyName} />
            <FloatingActions />
          </div>
        </EnquiryProvider>
        </LocaleProvider>
        <JsonLd data={organizationLd(contact, general.companyName, general.logo)} />
        <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: general.companyName, url: site.url, publisher: { "@id": `${site.url}/#organization` } }} />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) && <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)});`}</Script>
        </>}
      </body>
    </html>
  );
}
