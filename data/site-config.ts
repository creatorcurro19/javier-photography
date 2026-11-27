import { PLAZOS } from "@/data/plazos";

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
  pagosActivos: PAGOS_ACTIVOS,
  social: {
    instagram: SITE_SETTINGS.instagramUrl,
    saatchi: "https://www.saatchiart.com/javier-espinosa-photography",
    getty:
      "https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image",
  },
  plazos: PLAZOS,
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
