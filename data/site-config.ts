import { PLAZOS } from "@/data/plazos";
import type { SiteLang } from "@/lib/i18n-helpers";

export interface CuadernoPost {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  date: string;
  author: string;
  categoryLabel: string;
  relatedWorkSlug: string;
  status: "borrador" | "publicado";
  body: string[];
  cta: {
    label: string;
    href: string;
  };
}

export interface SiteSettings {
  authorPortraitUrl: string;
  showAuthorPortrait: boolean;
  showCuaderno: boolean;
  contactEmail: string;
  whatsappNumber: string;
  instagramUrl: string;
  locationLabel: string;
  basePrintPrice: number;
  baseCommissionPrice: number;
  baseLicensePrice: number;
}

export const SITE_SETTINGS: SiteSettings = {
  "authorPortraitUrl": "/images/portfolio/hero/hero.jpg",
  "showAuthorPortrait": false,
  "showCuaderno": false,
  "contactEmail": "javierespinosa1995@hotmail.com",
  "whatsappNumber": "",
  "instagramUrl": "https://www.instagram.com/Javier.espinosa19/",
  "locationLabel": "Puerto de la Cruz · Tenerife (Islas Canarias)",
  "basePrintPrice": 95,
  "baseCommissionPrice": 150,
  "baseLicensePrice": 45
};

export const PAGOS_ACTIVOS: boolean =
  process.env.NEXT_PUBLIC_STRIPE_ACTIVE === "true";

const DEFAULT_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://javier-photography.vercel.app");

export const SITE_CONFIG = {
  siteUrl: DEFAULT_SITE_URL,
  siteHost: DEFAULT_SITE_URL.replace(/^https?:\/\//, "").replace(/\/$/, ""),
  siteName: "Javier Espinosa Fotografía",
  authorName: "Javier Espinosa Martínez",
  contactEmail: SITE_SETTINGS.contactEmail,
  locationLabel: SITE_SETTINGS.locationLabel,
  locationLabelEn: "Puerto de la Cruz · Tenerife (Canary Islands)",
  pagosActivos: PAGOS_ACTIVOS,
  social: {
    instagram: SITE_SETTINGS.instagramUrl,
    saatchi: "https://www.saatchiart.com/javier-espinosa-photography",
    getty:
      "https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image",
  },
  plazos: PLAZOS,
  navigation: [
    { href: "/portfolio", labelEs: "Fotos", labelEn: "Photos" },
    { href: "/prints", labelEs: "Comprar Láminas", labelEn: "Buy Prints" },
    { href: "/about", labelEs: "Sobre mí", labelEn: "About" },
    { href: "/contact", labelEs: "Contacto", labelEn: "Contact" },
  ],
} as const;

export const CUADERNO_POSTS: CuadernoPost[] = [
  {
    "slug": "borrador-01-observacion-fauna-600mm",
    "number": "01",
    "title": "Notas sobre distancia, espera y luz natural a 600mm",
    "subtitle": "Borrador 01 · Notas sobre distancia, espera y luz natural con teleobjetivo",
    "date": "Próxima publicación",
    "author": "Javier Espinosa Martínez",
    "categoryLabel": "Fauna y Naturaleza",
    "relatedWorkSlug": "cuervo-canario-ante-las-cumbres",
    "status": "borrador",
    "body": [
      "Cuaderno de campo en preparación por Javier Espinosa Martínez."
    ],
    "cta": {
      "label": "Ver obra relacionada y copias Fine Art",
      "href": "/portfolio/cuervo-canario-ante-las-cumbres"
    }
  },
  {
    "slug": "borrador-02-luz-y-bruma-en-tenerife",
    "number": "02",
    "title": "Entre el Teide y Anaga: el contraste del alisio y la cumbre",
    "subtitle": "Borrador 02 · Cuaderno sobre el contraste entre la cumbre volcánica y la laurisilva",
    "date": "Próxima publicación",
    "author": "Javier Espinosa Martínez",
    "categoryLabel": "Paisajes y Territorio",
    "relatedWorkSlug": "cumbre-nevada-al-alba",
    "status": "borrador",
    "body": [
      "Cuaderno de campo en preparación por Javier Espinosa Martínez."
    ],
    "cta": {
      "label": "Explorar serie Entre la Bruma y el Volcán",
      "href": "/projects/entre-la-bruma-y-el-volcan"
    }
  },
  {
    "slug": "borrador-03-tramo-y-asistencia-rally-historico",
    "number": "03",
    "title": "Crónica de tramo y parque de asistencia en rally clásico",
    "subtitle": "Borrador 03 · Apuntes sobre fotografía de rally histórico en Canarias",
    "date": "Próxima publicación",
    "author": "Javier Espinosa Martínez",
    "categoryLabel": "Coches y Rally",
    "relatedWorkSlug": "cruzada-sobre-el-asfalto",
    "status": "borrador",
    "body": [
      "Cuaderno de campo en preparación por Javier Espinosa Martínez."
    ],
    "cta": {
      "label": "Consultar cobertura de Rally Histórico",
      "href": "/servicios/fotografo-rally-motorsport"
    }
  }
];

export const CUADERNO_POSTS_EN: Record<
  string,
  Pick<CuadernoPost, "title" | "subtitle" | "date" | "categoryLabel" | "body" | "cta">
> = {
  "borrador-01-observacion-fauna-600mm": {
    title: "Notes on distance, waiting, and natural light at 600mm",
    subtitle: "Draft 01 · Notes on distance, patience, and natural light with a super-telephoto lens",
    date: "Upcoming publication",
    categoryLabel: "Wildlife & Nature",
    body: ["Field journal entry in preparation by Javier Espinosa Martínez."],
    cta: {
      label: "View related work & Fine Art prints",
      href: "/portfolio/cuervo-canario-ante-las-cumbres",
    },
  },
  "borrador-02-luz-y-bruma-en-tenerife": {
    title: "Between Teide and Anaga: trade-wind mist and volcanic summit",
    subtitle: "Draft 02 · Field notes on the contrast between volcanic peaks and laurel cloud forest",
    date: "Upcoming publication",
    categoryLabel: "Landscapes & Territory",
    body: ["Field journal entry in preparation by Javier Espinosa Martínez."],
    cta: {
      label: "Explore Between Mist & Volcano series",
      href: "/projects/entre-la-bruma-y-el-volcan",
    },
  },
  "borrador-03-tramo-y-asistencia-rally-historico": {
    title: "Stage & service park chronicle in historic rallying",
    subtitle: "Draft 03 · Notes on classic rally photography in the Canary Islands",
    date: "Upcoming publication",
    categoryLabel: "Cars & Historic Rally",
    body: ["Field journal entry in preparation by Javier Espinosa Martínez."],
    cta: {
      label: "Inquire Historic Rally coverage",
      href: "/servicios/fotografo-rally-motorsport",
    },
  },
};

export function getLocalizedCuadernoPost<T extends CuadernoPost>(post: T, lang: SiteLang): T {
  if (lang !== "en") return post;
  const tr = CUADERNO_POSTS_EN[post.slug];
  if (!tr) return post;
  return { ...post, ...tr };
}
