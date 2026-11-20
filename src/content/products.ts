/**
 * Product catalogue. Only formats named by the company are listed.
 * No specifications, shelf life, capacities or prices are stated — those are
 * "on request" and confirmed directly by the company.
 */

export type Category = string;
export type Form = "fresh" | "flakes" | "minced" | "granules" | "powder";

export type Product = {
  slug: string;
  name: string;
  /** Short name used in forms / chips */
  shortName: string;
  category: Category;
  form: Form;
  /** Other trade names buyers may use */
  alsoKnownAs?: string[];
  description: string; // one line for cards
  overview: string; // paragraph for detail page
  forms: string[];
  applications: string[];
  image: string;
  imageAlt: string;
  galleryImages?: string[];
  seoTitle: string;
  seoDescription: string;
};

export const products: Product[] = [
  {
    "slug": "pink-onion",
    "name": "Pink Onion",
    "shortName": "Pink Onion",
    "category": "onion",
    "form": "fresh",
    "description": "Pink Onion enquiries for commercial sourcing; confirm product identity, preparation and grade before ordering.",
    "overview": "Discuss Pink Onion requirements with our Gujarat-based team. The product name does not define colour, cut size or preparation: specify whether you need whole or processed onion, your application and quantity. Confirm the offered product against a representative sample and written specification before approval.",
    "forms": [
      "Product preparation and grade on request"
    ],
    "applications": [
      "Food processing and manufacturing",
      "Commercial kitchens"
    ],
    "image": "/images/products/pink-onion-chopped.webp",
    "imageAlt": "Red chopped onion from OM Food and Spices LLP",
    "seoTitle": "Pink Onion Supplier India | Bulk Enquiries | OM Food",
    "seoDescription": "Pink Onion enquiries for commercial sourcing; confirm product identity, preparation and grade before ordering. Request samples, specifications and bulk export pricing from OM Food and Spices LLP, Gujarat."
  },
  {
    "slug": "dehydrated-onion-flakes",
    "name": "White onion flakes / kibbled onion",
    "shortName": "White onion flakes / kibbled",
    "category": "onion",
    "form": "flakes",
    "alsoKnownAs": [
      "Kibbled onion",
      "Onion flakes"
    ],
    "description": "White onion flakes and kibbled onion for visible pieces in soups, ready meals and savoury blends.",
    "overview": "Source dehydrated white onion flakes or kibbled onion for recipes that need visible onion texture. These trade names do not establish a universal cut size: include the required particle range, colour and acceptable fines in your buying brief. Request a sample for rehydration and texture trials, together with the offered specification, bulk pack options and quotation.",
    "forms": [
      "Flakes",
      "Kibbled"
    ],
    "applications": [
      "Instant & prepared foods",
      "Bakery applications",
      "Restaurants and commercial kitchens",
      "Food processing and manufacturing"
    ],
    "image": "/images/products/white-onion-flakes-1.webp",
    "imageAlt": "White dehydrated onion flakes in a tray",
    "galleryImages": [
      "/images/products/white-onion-flakes-1.webp",
      "/images/products/white-onion-flakes-2.webp"
    ],
    "seoTitle": "White onion flakes / kibbled Supplier India | Bulk Enquiries | OM Food",
    "seoDescription": "White onion flakes and kibbled onion for visible pieces in soups, ready meals and savoury blends. Request samples, specifications and bulk export pricing from OM Food and Spices LLP, Gujarat."
  },
  {
    "slug": "red-onion-flakes",
    "name": "Red onion flakes",
    "shortName": "Red onion flakes",
    "category": "onion",
    "form": "flakes",
    "alsoKnownAs": [
      "Dehydrated red onion flakes"
    ],
    "description": "Dehydrated red onion flakes for prepared meals, savoury seasonings and visible onion texture.",
    "overview": "Compare dehydrated red onion flakes for recipes where ingredient appearance and piece size matter. Evaluate colour, flavour and texture in the finished food rather than assuming they match a white onion grade. Share your cut-size requirement, application, bulk quantity and destination to discuss sample availability and export supply terms.",
    "forms": [
      "Flakes"
    ],
    "applications": [
      "Instant & prepared foods",
      "Seasonings & spice blends",
      "Restaurants and commercial kitchens",
      "Food processing and manufacturing"
    ],
    "image": "/images/products/red-onion-flakes-1.webp",
    "imageAlt": "Dehydrated red onion flakes",
    "galleryImages": [
      "/images/products/red-onion-flakes-1.webp",
      "/images/products/red-onion-flakes-2.webp"
    ],
    "seoTitle": "Red onion flakes Supplier India | Bulk Enquiries | OM Food",
    "seoDescription": "Dehydrated red onion flakes for prepared meals, savoury seasonings and visible onion texture. Request samples, specifications and bulk export pricing from OM Food and Spices LLP, Gujarat."
  },
  {
    "slug": "dehydrated-minced-onion",
    "name": "Minced onion",
    "shortName": "Minced onion",
    "category": "onion",
    "form": "minced",
    "description": "Smaller dehydrated onion pieces for sauces, instant soups and prepared-food formulations.",
    "overview": "Dehydrated minced onion provides smaller visible pieces than typical flakes and can suit sauces, soups and instant meals. Specify the particle distribution needed for your process, then assess hydration and texture at serving time. Request the relevant grade, sample and packaging details when comparing bulk minced onion supply.",
    "forms": [
      "Minced"
    ],
    "applications": [
      "Instant & prepared foods",
      "Sauces & condiments",
      "Restaurants and commercial kitchens",
      "Food processing and manufacturing"
    ],
    "image": "/images/products/minced-onion-photo.webp",
    "imageAlt": "Minced onion in a glass container from OM Food and Spices LLP",
    "seoTitle": "Minced onion Supplier India | Bulk Enquiries | OM Food",
    "seoDescription": "Smaller dehydrated onion pieces for sauces, instant soups and prepared-food formulations. Request samples, specifications and bulk export pricing from OM Food and Spices LLP, Gujarat."
  },
  {
    "slug": "dehydrated-onion-granules",
    "name": "White onion granules",
    "shortName": "White onion granules",
    "category": "onion",
    "form": "granules",
    "description": "White onion granules for dry seasoning blends, snack coatings and savoury bakery mixes.",
    "overview": "White onion granules offer a granular ingredient format between larger pieces and fine powder. For dry blends and snack coatings, compare particle size with the other ingredients and evaluate distribution in a production trial. Include the required mesh or sieve range, pack preference and quantity in your bulk onion granules enquiry.",
    "forms": [
      "Granules",
      "Fine granules"
    ],
    "applications": [
      "Seasonings & spice blends",
      "Snacks & savoury foods",
      "Bakery applications",
      "Food processing and manufacturing"
    ],
    "image": "/images/products/white-onion-granules-1.webp",
    "imageAlt": "White dehydrated onion granules",
    "galleryImages": [
      "/images/products/white-onion-granules-1.webp",
      "/images/products/white-onion-granules-2.webp",
      "/images/products/white-onion-granules-3.webp",
      "/images/products/white-onion-granules-4.webp"
    ],
    "seoTitle": "White onion granules Supplier India | Bulk Enquiries | OM Food",
    "seoDescription": "White onion granules for dry seasoning blends, snack coatings and savoury bakery mixes. Request samples, specifications and bulk export pricing from OM Food and Spices LLP, Gujarat."
  },
  {
    "slug": "dehydrated-onion-powder",
    "name": "White onion powder",
    "shortName": "White onion powder",
    "category": "onion",
    "form": "powder",
    "description": "Fine white onion powder for flavour distribution in seasonings, sauces and snack coatings.",
    "overview": "Dehydrated white onion powder is suited to recipes that need onion flavour without large visible pieces. Assess dispersion in sauces, coverage in snack seasonings and behaviour during dry blending. Request the offered mesh specification, handling guidance and representative sample before confirming a bulk onion powder order.",
    "forms": [
      "Powder"
    ],
    "applications": [
      "Seasonings & spice blends",
      "Snacks & savoury foods",
      "Sauces & condiments",
      "Food processing and manufacturing"
    ],
    "image": "/images/products/white-onion-powder-1.webp",
    "imageAlt": "Fine white dehydrated onion powder",
    "galleryImages": [
      "/images/products/white-onion-powder-1.webp",
      "/images/products/white-onion-powder-2.webp"
    ],
    "seoTitle": "White onion powder Supplier India | Bulk Enquiries | OM Food",
    "seoDescription": "Fine white onion powder for flavour distribution in seasonings, sauces and snack coatings. Request samples, specifications and bulk export pricing from OM Food and Spices LLP, Gujarat."
  },
  {
    "slug": "dehydrated-garlic-flakes",
    "name": "Dehydrated garlic flakes",
    "shortName": "Garlic flakes",
    "category": "garlic",
    "form": "flakes",
    "description": "Dehydrated garlic flakes and sliced pieces for soups, prepared foods and commercial kitchens.",
    "overview": "Dehydrated garlic flakes are a visible-piece garlic ingredient for soups, savoury foods and commercial recipes. Flakes and slices may describe different cuts, so confirm the actual dimensions and appearance rather than relying on the name alone. Share your application, quantity and destination for sample review and a bulk garlic flakes quotation.",
    "forms": [
      "Flakes"
    ],
    "applications": [
      "Instant & prepared foods",
      "Bakery applications",
      "Restaurants and commercial kitchens",
      "Food processing and manufacturing"
    ],
    "image": "/images/products/garlic-flakes-1.webp",
    "imageAlt": "Dehydrated garlic flakes",
    "galleryImages": [
      "/images/products/garlic-flakes-1.webp",
      "/images/products/garlic-flakes-2.webp",
      "/images/products/garlic-flakes-3.webp",
      "/images/products/garlic-flakes-4.webp",
      "/images/products/garlic-flakes-5.webp"
    ],
    "seoTitle": "Garlic flakes Supplier India | Bulk Enquiries | OM Food",
    "seoDescription": "Dehydrated garlic flakes and sliced pieces for soups, prepared foods and commercial kitchens. Request samples, specifications and bulk export pricing from OM Food and Spices LLP, Gujarat."
  },
  {
    "slug": "dehydrated-minced-garlic",
    "name": "Dehydrated minced garlic",
    "shortName": "Minced garlic",
    "category": "garlic",
    "form": "minced",
    "description": "Dehydrated minced garlic for smaller visible pieces in sauces, soups and savoury recipes.",
    "overview": "Dehydrated minced garlic suits applications that need garlic pieces smaller than flakes, including sauces and instant-food preparations. Evaluate particle size, hydration and texture in your own process. Ask for a representative grade, specification and pack options when sourcing bulk minced garlic from India.",
    "forms": [
      "Minced"
    ],
    "applications": [
      "Instant & prepared foods",
      "Sauces & condiments",
      "Restaurants and commercial kitchens",
      "Food processing and manufacturing"
    ],
    "image": "/images/products/minced-garlic-photo.webp",
    "imageAlt": "Dehydrated minced garlic in a glass container from OM Food and Spices LLP",
    "seoTitle": "Minced garlic Supplier India | Bulk Enquiries | OM Food",
    "seoDescription": "Dehydrated minced garlic for smaller visible pieces in sauces, soups and savoury recipes. Request samples, specifications and bulk export pricing from OM Food and Spices LLP, Gujarat."
  },
  {
    "slug": "dehydrated-garlic-granules",
    "name": "Dehydrated garlic granules",
    "shortName": "Garlic granules",
    "category": "garlic",
    "form": "granules",
    "description": "Garlic granules for dry seasonings, savoury snack coatings and food manufacturing blends.",
    "overview": "Dehydrated garlic granules provide a granular garlic format for seasoning companies and food manufacturers. Match the sieve range to your blend to assess ingredient distribution and segregation during handling. Include target mesh, annual or order quantity, packaging and destination in your garlic granules export enquiry.",
    "forms": [
      "Granules",
      "Fine granules"
    ],
    "applications": [
      "Seasonings & spice blends",
      "Snacks & savoury foods",
      "Bakery applications",
      "Food processing and manufacturing"
    ],
    "image": "/images/products/garlic-granules-1.webp",
    "imageAlt": "Dehydrated garlic granules",
    "galleryImages": [
      "/images/products/garlic-granules-1.webp",
      "/images/products/garlic-granules-2.webp"
    ],
    "seoTitle": "Garlic granules Supplier India | Bulk Enquiries | OM Food",
    "seoDescription": "Garlic granules for dry seasonings, savoury snack coatings and food manufacturing blends. Request samples, specifications and bulk export pricing from OM Food and Spices LLP, Gujarat."
  },
  {
    "slug": "dehydrated-garlic-powder",
    "name": "Dehydrated garlic powder",
    "shortName": "Garlic powder",
    "category": "garlic",
    "form": "powder",
    "description": "Fine dehydrated garlic powder for spice blends, sauces and savoury food formulations.",
    "overview": "Garlic powder distributes garlic flavour in dry spice blends, sauces and commercial food recipes without large visible pieces. Compare the offered mesh, dispersion and handling performance in a sample trial. Request the applicable specification and bulk packaging options before agreeing a garlic powder supply quotation.",
    "forms": [
      "Powder"
    ],
    "applications": [
      "Seasonings & spice blends",
      "Snacks & savoury foods",
      "Sauces & condiments",
      "Food processing and manufacturing"
    ],
    "image": "/images/products/garlic-powder-1.webp",
    "imageAlt": "Fine dehydrated garlic powder",
    "galleryImages": [
      "/images/products/garlic-powder-1.webp",
      "/images/products/garlic-powder-2.webp",
      "/images/products/garlic-powder-3.webp"
    ],
    "seoTitle": "Garlic powder Supplier India | Bulk Enquiries | OM Food",
    "seoDescription": "Fine dehydrated garlic powder for spice blends, sauces and savoury food formulations. Request samples, specifications and bulk export pricing from OM Food and Spices LLP, Gujarat."
  }
];
export const productBySlug=(slug:string)=>products.find(p=>p.slug===slug);
export const productsByCategory=(c:Category)=>products.filter(p=>p.category===c&&p.form!=="fresh");
export const productFootnote="Confirm the offered specification, sample, packaging and commercial terms before approving an ingredient order.";
