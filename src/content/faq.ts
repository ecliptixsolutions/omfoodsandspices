/**
 * FAQ answers must stay consistent with the facts the company has provided:
 * formats, enquiry/quotation flow, "subject to company confirmation".
 * No certifications, shelf life, capacities, prices or export countries are claimed.
 */
export type FaqItem = { q: string; a: string };

export const faqs: FaqItem[] = [
  {
    q: "Which products can I enquire about?",
    a: "You can enquire about dehydrated onion (flakes / kibbled, minced, granules and powder) and dehydrated garlic (flakes, minced, granules and powder). Product formats and availability are subject to company confirmation.",
  },
  {
    q: "Can I request a sample before placing an order?",
    a: "Yes. Choose “Get Sample” or select “Sample / Trial Order” in the enquiry form and tell us the product and your destination. Sample availability and terms are confirmed directly by the company.",
  },
  {
    q: "How do I get a quotation?",
    a: "Fill in the single enquiry form with the product, form, required quantity and destination, or message us on WhatsApp. The team will reply directly. Pricing is shared only after company confirmation.",
  },
  {
    q: "Can I request custom sizes or packaging?",
    a: "You can mention the size, mesh or packaging you need in the enquiry. Whether it can be supplied is confirmed directly by the company for each requirement.",
  },
  {
    q: "Are specifications and certificates available?",
    a: "Specifications and documentation are discussed and confirmed directly with you for each enquiry. Approved public documents appear on the Certificates & downloads page; other documentation is shared after company confirmation.",
  },
  {
    q: "Can I request bulk quantities?",
    a: "Yes. Bulk supply enquiries are welcome. Tell us the quantity you need, and availability and lead times are confirmed directly by the company.",
  },
  {
    q: "Can I enquire about international shipping?",
    a: "Yes. Export enquiries are welcome. Share your destination country in the enquiry form; shipping arrangements, documents and timelines depend on confirmation by the company.",
  },
  {
    q: "How do I contact your team?",
    a: "Use the enquiry form, call +91 81407 12205, message us on WhatsApp, or email Omfoodandspicesllp@gmail.com. We are available Monday–Sunday, 9:00 AM–6:30 PM IST (subject to holiday variations).",
  },
];
