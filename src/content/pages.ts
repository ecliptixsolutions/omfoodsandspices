/**
 * Inner-page content. Anything the company has not supplied is a block with
 * `placeholder: true`, rendered with the label "Content to be provided by the company".
 * Do NOT replace placeholders with invented certifications, capacities, countries or statistics.
 */

export const PLACEHOLDER_LABEL = "Content to be provided by the company";

export type InfoSection = {
  heading: string;
  body?: string;
  steps?: { title: string; detail: string }[];
  placeholder?: boolean;
  /** What the company should supply, shown as a hint in the placeholder box */
  hint?: string;
};

export type InfoPage = {
  slug: string; // "" for /about
  path: string;
  title: string; // H1
  eyebrow: string;
  intro: string;
  image: string;
  imageAlt: string;
  seoTitle: string;
  seoDescription: string;
  sections: InfoSection[];
};

export const infoPages: InfoPage[] = [
  {
    "slug": "",
    "path": "/about",
    "eyebrow": "About us",
    "title": "Indian onion & garlic ingredient supplier",
    "intro": "OM Food and Spices LLP is based in Kikariya, Gujarat, India. We handle onion and garlic ingredient enquiries for food manufacturers, seasoning companies, importers, distributors and commercial kitchens seeking bulk supply.",
    "image": "/images/products/white-onion-flakes-1.webp",
    "imageAlt": "White dehydrated onion flakes from OM Food and Spices LLP",
    "seoTitle": "Indian onion & garlic ingredient supplier | OM Food",
    "seoDescription": "OM Food and Spices LLP is based in Kikariya, Gujarat, India. We handle onion and garlic ingredient enquiries for food manufacturers, seasoning companies, importers, distributors and commercial kitchens seeking bulk supply.",
    "sections": [
      {
        "heading": "Onion and garlic formats for food production",
        "body": "Compare white onion flakes, red onion flakes, kibbled onion, minced onion, granules and powder, alongside dehydrated garlic flakes, minced garlic, granules and powder. Choose by recipe texture, particle size and manufacturing conditions, then confirm the offered specification with the team."
      },
      {
        "heading": "Working with commercial ingredient buyers",
        "body": "Bring your application, target grade, quantity and destination to the enquiry. Samples, product documents, packaging and commercial terms can then be discussed against the requirements of your purchasing and technical teams."
      },
      {
        "heading": "Company information for supplier approval",
        "body": "Request the company information and available supporting documents needed for your vendor review. Published registration documents are available on the Certificates page; additional records require confirmation from OM Food and Spices LLP."
      }
    ]
  },
  {
    "slug": "plant",
    "path": "/about/plant",
    "eyebrow": "About us",
    "title": "Onion & garlic processing facility in Gujarat",
    "intro": "Our facility is based at Survey No. 125, P5, Kikariya, Gujarat. Buyers can discuss the processing stages relevant to their ingredient requirement and request available facility information during supplier approval.",
    "image": "/images/products/garlic-flakes-1.webp",
    "imageAlt": "Dehydrated garlic flakes supplied by OM Food and Spices LLP",
    "seoTitle": "Onion & garlic processing facility in Gujarat | OM Food",
    "seoDescription": "Our facility is based at Survey No. 125, P5, Kikariya, Gujarat. Buyers can discuss the processing stages relevant to their ingredient requirement and request available facility information during supplier approval.",
    "sections": [
      {
        "heading": "Facility location",
        "body": "Survey No. 125, OM Food and Spices LLP, P5, Kikariya, Gujarat 364280, India. Contact the team to confirm the location and any proposed appointment before travelling."
      },
      {
        "heading": "Reviewing processing capabilities",
        "body": "The process overview covers preparation, drying, grading, optical sorting, metal detection, packing and dispatch. Equipment settings, output specifications and the process applicable to your order should be confirmed directly; no production capacity is represented on this page."
      },
      {
        "heading": "Buyer visits and technical enquiries",
        "body": "Ask the team whether a visit, supplier questionnaire or technical discussion can be arranged. Share the purpose, product and information required so the company can confirm what is available."
      }
    ]
  },
  {
    "slug": "process",
    "path": "/about/process",
    "eyebrow": "About us",
    "title": "Dehydrated onion & garlic processing stages",
    "intro": "Follow the 18-stage plant overview from incoming raw material through preparation, drying, size grading, sorting, packing and dispatch. Product-specific settings and acceptance criteria are confirmed for the proposed ingredient.",
    "image": "/images/products/white-onion-flakes-1.webp",
    "imageAlt": "White dehydrated onion flakes",
    "seoTitle": "Onion & Garlic Dehydration Process | OM Food, Gujarat",
    "seoDescription": "Follow the 18-stage plant overview from incoming raw material through preparation, drying, size grading, sorting, packing and dispatch. Product-specific settings and acceptance criteria are confirmed for the proposed ingredient.",
    "sections": [
      {
        "heading": "From raw onion and garlic to packed ingredients",
        "body": "This sequence explains the processing stages described by the company. It is an overview for buyer discussions, not a guarantee of a particular treatment, test result or specification for every product.",
        "steps": [
          {
            "title": "Receiving and storage",
            "detail": "Receive incoming material and identify it for storage before processing."
          },
          {
            "title": "Feed hopper and controlled transfer",
            "detail": "Meter material into the line for controlled transfer to preparation."
          },
          {
            "title": "Initial screening, grading and destoning",
            "detail": "Separate material through screening, grading and destoning before washing."
          },
          {
            "title": "First washing",
            "detail": "Wash incoming material before the peeling stage."
          },
          {
            "title": "Peeling",
            "detail": "Remove outer layers before the final preparation wash."
          },
          {
            "title": "Second / final washing",
            "detail": "Wash peeled material before slicing or cutting."
          },
          {
            "title": "Slicing / cutting",
            "detail": "Prepare cut material for the drying stage; confirm the relevant cut requirement."
          },
          {
            "title": "Transfer to drying",
            "detail": "Transfer prepared material to the drying line."
          },
          {
            "title": "Main five-belt drying",
            "detail": "Pass material through the main five-belt dryer as part of dehydration."
          },
          {
            "title": "Two-stage hot drying",
            "detail": "Continue hot drying through the two-stage drying section."
          },
          {
            "title": "Cooling / cold drying",
            "detail": "Cool material following hot drying before downstream handling."
          },
          {
            "title": "Size grading and separation",
            "detail": "Separate dried material by size for the required ingredient format."
          },
          {
            "title": "Eight-chute optical sorting",
            "detail": "Use the eight-chute optical sorting stage to identify material for separation."
          },
          {
            "title": "All-metal detection and separation",
            "detail": "Pass material through all-metal detection and separation."
          },
          {
            "title": "Final inspection",
            "detail": "Inspect the finished ingredient before the packing stage."
          },
          {
            "title": "Packing",
            "detail": "Pack the ingredient against the agreed order and packaging requirement."
          },
          {
            "title": "Finished-goods storage",
            "detail": "Store identified packed goods before dispatch."
          },
          {
            "title": "Dispatch",
            "detail": "Dispatch the confirmed order with the agreed shipment requirements."
          }
        ]
      },
      {
        "heading": "From enquiry to supply",
        "body": "Start with the application, target specification, quantity and destination. Review sample and product information, then confirm the quotation, pack format and dispatch requirements through the Sourcing page."
      }
    ]
  },
  {
    "slug": "quality-food-safety",
    "path": "/about/quality-food-safety",
    "eyebrow": "About us",
    "title": "Quality review for dehydrated onion & garlic",
    "intro": "Approve an ingredient against a written specification and representative sample. Discuss product identity, particle size, relevant test records and batch documentation before confirming bulk onion or garlic supply.",
    "image": "/images/products/garlic-powder-1.webp",
    "imageAlt": "Dehydrated garlic powder",
    "seoTitle": "Quality review for dehydrated onion & garlic | OM Food",
    "seoDescription": "Approve an ingredient against a written specification and representative sample. Discuss product identity, particle size, relevant test records and batch documentation before confirming bulk onion or garlic supply.",
    "sections": [
      {
        "heading": "Product approval checkpoints",
        "body": "Review the requirements relevant to raw material, processing, sorting, metal detection and packed-product release. Ask which checks apply to the offered grade and batch, and agree acceptance limits with the team before ordering."
      },
      {
        "heading": "Laboratory reports and test scope",
        "body": "Request the available in-house or external report for the product being evaluated. Check the sample identity, method, reporting date and scope; do not treat a general company document as a test result for your shipment."
      },
      {
        "heading": "Batch identification and traceability",
        "body": "Discuss how the finished-product lot, pack identification and shipment documents connect to the order. Request the records needed for your own supplier approval and receiving procedure."
      },
      {
        "heading": "Food safety requirements and treatments",
        "body": "State the requirements of your application and destination market. Steam treatment, irradiation or other processes should only be specified when supported by an approved product record; this website does not claim that every grade receives such a treatment."
      },
      {
        "heading": "Certification checks",
        "body": "Use the Certificates page to view published company records. A GST registration is a tax document, not a food-safety certificate. Ask the team to confirm any additional certification, scope and validity required by your procurement policy."
      },
      {
        "heading": "Documents for your technical team",
        "body": "Include the specification, batch records and other evidence your company needs in the enquiry. Availability and the documents applicable to your proposed order are confirmed directly."
      }
    ]
  },
  {
    "slug": "responsible-manufacturing",
    "path": "/about/responsible-manufacturing",
    "eyebrow": "About us",
    "title": "Responsible ingredient sourcing & procurement",
    "intro": "Make sourcing decisions using product records and verifiable information. Buyers can discuss raw-material origin, packaging, handling and any environmental or workforce information required by their supplier policy.",
    "image": "/images/products/white-onion-granules-1.webp",
    "imageAlt": "White dehydrated onion granules",
    "seoTitle": "Responsible ingredient sourcing & procurement | OM Food",
    "seoDescription": "Make sourcing decisions using product records and verifiable information. Buyers can discuss raw-material origin, packaging, handling and any environmental or workforce information required by their supplier policy.",
    "sections": [
      {
        "heading": "Evidence before sustainability claims",
        "body": "No environmental certification, emissions saving or resource-use target is claimed here without a supporting company record. Include any sustainability questionnaire or evidence requirement in your enquiry so the team can confirm the information available."
      },
      {
        "heading": "A practical sourcing brief",
        "body": "Specify onion or garlic identity, the required form, pack format and destination. Ask for the origin and traceability information relevant to the offered product rather than assuming that all grades follow identical sourcing arrangements."
      }
    ]
  },
  {
    "slug": "packaging-export",
    "path": "/about/packaging-export",
    "eyebrow": "About us",
    "title": "Bulk ingredient packaging & export enquiries",
    "intro": "Plan packaging and shipment requirements for dehydrated onion and garlic before order approval. Share your pack weight, destination, labelling needs and delivery schedule with the team.",
    "image": "/images/products/garlic-granules-1.webp",
    "imageAlt": "Dehydrated garlic granules",
    "seoTitle": "Bulk ingredient packaging & export enquiries | OM Food",
    "seoDescription": "Plan packaging and shipment requirements for dehydrated onion and garlic before order approval. Share your pack weight, destination, labelling needs and delivery schedule with the team.",
    "sections": [
      {
        "heading": "Define the bulk packaging requirement",
        "body": "State the product, net pack weight, liner, outer packaging and required label details. Include pallet or private-label preferences where relevant. The team will confirm the pack options available for the offered ingredient."
      },
      {
        "heading": "Confirm the shipment loading plan",
        "body": "Container loading depends on pack dimensions, pallet requirements, shipment quantity and destination. Request a verified loading proposal for the agreed order rather than assuming a standard weight for every twenty-foot or forty-foot container."
      },
      {
        "heading": "Export documentation for the destination",
        "body": "Tell us the destination country and the documents requested by your importer or receiving team. Available product and shipment records, shipping arrangements and timelines require order-specific confirmation."
      },
      {
        "heading": "Agree commercial terms before dispatch",
        "body": "Discuss quotation validity, agreed specification, pack identification, delivery terms and the documents to accompany the order. The enquiry form supports one buying brief for several onion and garlic products."
      }
    ]
  }
];

export const sourcingPage = {
  "eyebrow": "Sourcing",
  "title": [
    "Source bulk onion & garlic",
    "from Gujarat, India"
  ],
  "intro": "Plan dehydrated ingredient procurement around your food application, target grade and delivery requirements. Request samples, review the offered specification and discuss bulk supply and export documentation in one enquiry.",
  "seoTitle": "Bulk Onion & Garlic Ingredient Sourcing India | OM Food",
  "seoDescription": "Plan dehydrated ingredient procurement around your food application, target grade and delivery requirements. Request samples, review the offered specification and discuss bulk supply and export documentation in one enquiry.",
  "support": {
    "title": "A procurement brief for bulk and export supply",
    "text": "Give the team the ingredient name, form, cut size or mesh, order quantity, packaging and destination. Request the available specification and documents for supplier approval, then confirm the quotation and dispatch requirements before ordering.",
    "points": [
      "Bulk quantities and trial orders both welcome",
      "Export enquiries welcome — share your destination",
      "Specifications and documents confirmed directly"
    ]
  },
  "image": "/images/products/red-onion-flakes-1.webp",
  "imageAlt": "Dehydrated red onion flakes"
};

export const certificatesPage = {
  eyebrow: "Certificates & downloads",
  title: "Certificates & downloads",
  intro: "View and download the company’s GST, APEDA, IEC and Udyam registration documents. Check each document’s purpose and scope before using it in a supplier review.",
  seoTitle: "Certificates & Downloads | OM Food and Spices LLP",
  seoDescription: "View and download GST, APEDA RCMC, Importer-Exporter Code and Udyam registration documents for OM Food and Spices LLP.",
  documents: [
    {
      title: "GST registration certificate",
      description: "Government of India · Form GST REG-06 · GSTIN 24AAKFO2365E1ZE · issued 8 September 2026. This is a tax registration, not a food-safety certification.",
      href: "/documents/om-food-and-spices-gst-registration.pdf",
      size: "226 KB",
    },
    {
      title: "APEDA Registration-cum-Membership Certificate (RCMC)",
      description: "Agricultural and Processed Food Products Export Development Authority · issued 24 June 2026 · stated validity through 23 June 2031.",
      href: "/documents/om-food-and-spices-apeda-rcmc.pdf",
      size: "88 KB",
    },
    {
      title: "Importer-Exporter Code (IEC)",
      description: "Directorate General of Foreign Trade · issued 22 June 2026 · last modified 8 September 2026.",
      href: "/documents/om-food-and-spices-iec.pdf",
      size: "57 KB",
    },
    {
      title: "Udyam registration certificate — updated address",
      description: "Ministry of Micro, Small and Medium Enterprises · registered 14 May 2026 · updated-address certificate page.",
      href: "/documents/om-food-and-spices-udyam-registration.pdf",
      size: "230 KB",
    },
  ],
  emptyTitle: "Documents available on request",
  emptyText:
    "No public documents have been published yet. Tell us what you need — such as product specifications or company documents — and the team will confirm what can be shared.",
};

export type CategoryPage = {
  category: "onion" | "garlic";
  path: string;
  eyebrow: string;
  title: string[];
  intro: string;
  image: string;
  galleryImages?: string[];
  imageAlt: string;
  seoTitle: string;
  seoDescription: string;
  applicationsTitle: string;
  faqs: { q: string; a: string }[];
  ctaProduct: string;
};

export const categoryPages: Record<"onion" | "garlic", CategoryPage> = {
  "onion": {
    "category": "onion",
    "path": "/dehydrated-onions",
    "eyebrow": "Dehydrated onion ingredients",
    "title": [
      "Dehydrated onion supplier India",
      "bulk formats for industry"
    ],
    "intro": "Source white onion flakes, red onion flakes, kibbled onion, minced onion, granules and powder for commercial food production. Compare visible texture, particle size and application needs before requesting a sample or bulk quotation.",
    "image": "/images/products/white-onion-flakes-1.webp",
    "galleryImages": [
      "/images/products/white-onion-flakes-1.webp",
      "/images/products/white-onion-granules-1.webp",
      "/images/products/white-onion-powder-1.webp",
      "/images/products/red-onion-flakes-1.webp"
    ],
    "imageAlt": "Dehydrated white and red onion ingredient formats",
    "seoTitle": "Dehydrated Onion Supplier India | Bulk Ingredients | OM Food",
    "seoDescription": "Source white onion flakes, red onion flakes, kibbled onion, minced onion, granules and powder for commercial food production. Compare visible texture, particle size and application needs before requesting a sample or bulk quotation.",
    "applicationsTitle": "Where dehydrated onion is used",
    "ctaProduct": "dehydrated-onion-flakes",
    "faqs": [
      {
        "q": "How do I choose a dehydrated onion format?",
        "a": "Choose flakes for larger visible pieces, minced onion for smaller pieces, and granules or powder for finer distribution. Compare actual particle size and recipe performance in a sample trial."
      },
      {
        "q": "What should a bulk onion specification include?",
        "a": "State the product identity, cut size or mesh, intended application, required documentation and packaging. Confirm the supplier specification and sample against your approval criteria."
      },
      {
        "q": "Can I request a onion sample and export quotation?",
        "a": "Use the enquiry form for samples or quotations. Include quantity, destination and target specification; availability, sample terms and delivery arrangements require company confirmation."
      }
    ]
  },
  "garlic": {
    "category": "garlic",
    "path": "/dehydrated-garlic",
    "eyebrow": "Dehydrated garlic ingredients",
    "title": [
      "Dehydrated garlic supplier India",
      "flakes, minced, granules & powder"
    ],
    "intro": "Compare dehydrated garlic flakes and slices, minced garlic, granules and powder for seasoning production, sauces, soups and savoury foods. Share the required cut, mesh, quantity and destination for sample and export enquiries.",
    "image": "/images/products/garlic-flakes-1.webp",
    "galleryImages": [
      "/images/products/garlic-flakes-1.webp",
      "/images/products/garlic-granules-1.webp",
      "/images/products/garlic-powder-1.webp"
    ],
    "imageAlt": "Dehydrated garlic flakes, granules and powder",
    "seoTitle": "Dehydrated Garlic Supplier India | Bulk Ingredients | OM Food",
    "seoDescription": "Compare dehydrated garlic flakes and slices, minced garlic, granules and powder for seasoning production, sauces, soups and savoury foods. Share the required cut, mesh, quantity and destination for sample and export enquiries.",
    "applicationsTitle": "Where dehydrated garlic is used",
    "ctaProduct": "dehydrated-garlic-flakes",
    "faqs": [
      {
        "q": "How do I choose a dehydrated garlic format?",
        "a": "Choose flakes for larger visible pieces, minced garlic for smaller pieces, and granules or powder for finer distribution. Compare actual particle size and recipe performance in a sample trial."
      },
      {
        "q": "What should a bulk garlic specification include?",
        "a": "State the product identity, cut size or mesh, intended application, required documentation and packaging. Confirm the supplier specification and sample against your approval criteria."
      },
      {
        "q": "Can I request a garlic sample and export quotation?",
        "a": "Use the enquiry form for samples or quotations. Include quantity, destination and target specification; availability, sample terms and delivery arrangements require company confirmation."
      }
    ]
  }
};

export const legal = {
  privacy: {
    seoTitle: "Privacy Policy | OM Food and Spices LLP",
    seoDescription: "How OM Food and Spices LLP handles information submitted through this website.",
  },
  terms: {
    seoTitle: "Terms of Use | OM Food and Spices LLP",
    seoDescription: "Terms of use for the OM Food and Spices LLP website.",
  },
};
