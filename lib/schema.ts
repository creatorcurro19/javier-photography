import { SITE_CONFIG } from "@/data/site-config";
import { localizeHref, translatePaper, type SiteLang } from "@/lib/i18n-helpers";
import { getLocalizedPhoto, getLocalizedProject } from "@/lib/i18n-works";
import { absoluteUrl } from "@/lib/metadata";
import { getFormatsForPhoto } from "@/types/cart";
import {
  CATEGORY_METADATA,
  type Photo,
  type PhotoCategory,
  type Project,
} from "@/types/photo";

export function generateWebSiteSchema(lang: SiteLang = "es") {
  const isEn = lang === "en";
  const searchTarget = `${absoluteUrl(localizeHref("/portfolio", lang))}?q={search_term_string}`;
  return {
    "@context": "https://schema.org",
    "@type": ["WebSite", "ArtGallery"],
    "@id": absoluteUrl("/#website"),
    name: isEn ? "Javier Espinosa Photography" : "Javier Espinosa Fotografía",
    alternateName: "Javier Espinosa — Fine Art & Documentary Photography",
    url: absoluteUrl(localizeHref("/", lang)),
    image: absoluteUrl("/images/portfolio/paisajes-documental/mar-de-dunas-al-ocaso.jpg"),
    inLanguage: isEn ? "en-US" : "es-ES",
    priceRange: "€€–€€€",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Puerto de la Cruz, Tenerife",
      addressRegion: isEn ? "Canary Islands" : "Canarias",
      addressCountry: "ES",
    },
    sameAs: [
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.saatchi,
      SITE_CONFIG.social.getty,
    ],
    description: isEn
      ? "Official gallery and Fine Art print archive of independent photographer Javier Espinosa: wildlife at 600mm, volcanic landscapes, classic rally, architecture, and documentary photography on Hahnemühle Photo Rag 308g cotton paper shipped worldwide."
      : "Galería oficial y archivo fotográfico de Javier Espinosa, fotógrafo independiente afincado en Tenerife: naturaleza, paisajes, arquitectura, motor clásico y cultura con luz natural. Copias Fine Art en papel Hahnemühle Photo Rag 308g.",
    publisher: {
      "@id": absoluteUrl("/#author"),
    },
    creator: {
      "@id": absoluteUrl("/#author"),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: searchTarget,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generatePersonSchema(lang: SiteLang = "es") {
  const isEn = lang === "en";
  return {
    "@context": "https://schema.org",
    "@type": ["Person", "Photographer", "VisualArtist"],
    "@id": absoluteUrl("/#author"),
    name: "Javier Espinosa Martínez",
    alternateName: [
      "Javier Espinosa Fotografía",
      "Javier Espinosa Photography",
    ],
    url: absoluteUrl(localizeHref("/", lang)),
    image: absoluteUrl("/images/portfolio/hero/hero.jpg"),
    email: `mailto:${SITE_CONFIG.contactEmail}`,
    jobTitle: isEn
      ? "Independent Fine Art & Documentary Photographer — Wildlife, Landscape, Motorsport & Architecture"
      : "Fotógrafo Independiente & Fine Art Photographer — Naturaleza, Paisajes, Arquitectura y Cultura",
    description: isEn
      ? "Independent photographer based in Tenerife (Canary Islands) creating Fine Art prints on 100% cotton Hahnemühle Photo Rag 308g paper and Rights-Managed photography across wildlife, landscape, historic rally motorsport, architecture, and documentary essays."
      : "Soy Javier Espinosa, fotógrafo independiente afincado en Tenerife. Mi fotografía se mueve entre la naturaleza, los paisajes, la arquitectura y la cultura buscando nuevas maneras de mirar, con luz natural y copias Fine Art en papel Hahnemühle Photo Rag 308g.",
    knowsLanguage: isEn ? ["en", "es"] : ["es", "en"],
    nationality: {
      "@type": "Country",
      name: "Spain",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tenerife",
      addressRegion: isEn ? "Canary Islands" : "Canarias",
      addressCountry: "ES",
    },
    knowsAbout: [
      "Landscapes: Fine Art Landscape Photography",
      "Wildlife: Wildlife & Bird Photography at 600mm",
      "Motorsport: Classic & Historic Rally Photography",
      "Urban & Architecture: Architectural & Heritage Photography",
      "Documentary: Cultural Crafts & Documentary Photography",
      "Museum-grade Fine Art Printing (Hahnemühle Photo Rag 308g ISO 9706)",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isEn
        ? "Fine Art Prints, Commissions & Licensing Catalog"
        : "Catálogo de Obras y Servicios de Autor",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: isEn
            ? "Limited Edition Hahnemühle Photo Rag 308g Prints (Worldwide & US Shipping)"
            : "Copias Fine Art Hahnemühle Photo Rag 308g",
          url: absoluteUrl(localizeHref("/prints", lang)),
        },
        {
          "@type": "OfferCatalog",
          name: isEn
            ? "Photography Commissions & Historic Rally Coverage"
            : "Servicios de Fotografía y Cobertura de Rally",
          url: absoluteUrl(localizeHref("/servicios", lang)),
        },
        {
          "@type": "OfferCatalog",
          name: isEn
            ? "High-Resolution 16-bit TIFF Image Licensing"
            : "Licencias de Imagen en Alta Resolución",
          url: absoluteUrl(localizeHref("/licensing", lang)),
        },
      ],
    },
    sameAs: [
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.saatchi,
      SITE_CONFIG.social.getty,
    ],
  };
}

export function generatePhotoSchema(rawPhoto: Photo, lang: SiteLang = "es") {
  const isEn = lang === "en";
  const photo = getLocalizedPhoto(rawPhoto, lang);
  const pageUrl = absoluteUrl(localizeHref(`/portfolio/${photo.slug}`, lang));
  const imgUrl = absoluteUrl(photo.image);
  const catMeta = CATEGORY_METADATA[photo.category];
  const licenseUrl = absoluteUrl(localizeHref("/licensing", lang));

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": photo.prints
      ? ["ImageObject", "Photograph", "VisualArtwork", "Product"]
      : ["ImageObject", "Photograph"],
    "@id": pageUrl,
    name: photo.title,
    headline: `${photo.title}${photo.location ? ` — ${photo.location}` : ""}`,
    caption: photo.description,
    description: photo.description,
    alternateName: photo.alt,
    image: imgUrl,
    thumbnailUrl: imgUrl,
    contentUrl: imgUrl,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    representativeOfPage: true,
    encodingFormat: "image/jpeg",
    inLanguage: isEn ? "en-US" : "es-ES",
    genre: catMeta
      ? isEn
        ? catMeta.titleEn
        : `${catMeta.title} / ${catMeta.titleEn}`
      : photo.category,
    width: {
      "@type": "QuantitativeValue",
      value: photo.width,
      unitCode: "E37",
    },
    height: {
      "@type": "QuantitativeValue",
      value: photo.height,
      unitCode: "E37",
    },
    // Google Images Licensable Badge Required Fields
    license: licenseUrl,
    acquireLicensePage: licenseUrl,
    creditText: "Javier Espinosa Martínez",
    copyrightNotice: isEn
      ? `© ${photo.year} Javier Espinosa Martínez. All rights reserved.`
      : `© ${photo.year} Javier Espinosa Martínez. Todos los derechos reservados / All rights reserved.`,
    copyrightYear: photo.year,
    creator: {
      "@type": "Person",
      "@id": absoluteUrl("/#author"),
      name: "Javier Espinosa Martínez",
      url: absoluteUrl(localizeHref("/about", lang)),
    },
    author: {
      "@type": "Person",
      "@id": absoluteUrl("/#author"),
      name: "Javier Espinosa Martínez",
    },
    copyrightHolder: {
      "@type": "Person",
      "@id": absoluteUrl("/#author"),
      name: "Javier Espinosa Martínez",
    },
    dateCreated: `${photo.year}`,
    datePublished: `${photo.year}-01-01`,
    keywords: photo.keywords.join(", "),
    exifData: [
      { "@type": "PropertyValue", name: "Camera", value: photo.camera },
      { "@type": "PropertyValue", name: "Lens", value: photo.lens },
      { "@type": "PropertyValue", name: "FocalLength", value: photo.focalLength },
      { "@type": "PropertyValue", name: "FNumber", value: photo.aperture },
      { "@type": "PropertyValue", name: "ExposureTime", value: photo.shutter },
      { "@type": "PropertyValue", name: "ISOSpeedRatings", value: String(photo.iso) },
    ],
  };

  if (photo.location) {
    schema.contentLocation = {
      "@type": "Place",
      name: photo.location,
      ...(photo.country
        ? {
            address: {
              "@type": "PostalAddress",
              addressLocality: photo.location,
              addressCountry: photo.country,
            },
          }
        : {}),
      ...(photo.coordinates
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: photo.coordinates.lat,
              longitude: photo.coordinates.lng,
            },
          }
        : {}),
    };
  }

  const pricing = photo.pricing;
  const formats = getFormatsForPhoto(photo, lang);
  const editionTotal = pricing?.editionTotal ?? 25;

  schema.artform = isEn
    ? "Limited Edition Fine Art Photography"
    : "Fotografía Fine Art de Autor / Fine Art Photography";
  schema.artMedium = pricing?.paper
    ? translatePaper(pricing.paper, lang)
    : isEn
      ? "12-pigment archival Giclée print on 100% cotton Hahnemühle Photo Rag 308 gsm"
      : "Impresión Giclée de 12 tintas pigmentadas sobre papel 100% algodón Hahnemühle Photo Rag 308 g/m²";
  schema.surface = isEn
    ? "ISO 9706 Certified Archival Fine Art Paper (shipped unframed in rigid protective tube)"
    : "Papel Fine Art Certificado ISO 9706 (entrega en tubo rígido sin marco)";
  schema.artEdition = isEn
    ? `Signed and numbered limited edition of ${editionTotal} prints`
    : `Edición limitada numerada y firmada de ${editionTotal} ejemplares`;

  if (photo.prints) {
    const makeDeliveryTime = (minTransit: number, maxTransit: number) => ({
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 2,
        maxValue: 4,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: minTransit,
        maxValue: maxTransit,
        unitCode: "DAY",
      },
    });

    schema.sku = `JE-${photo.id.toUpperCase()}`;
    schema.mpn = photo.id;
    schema.brand = {
      "@type": "Brand",
      name: "Javier Espinosa",
    };
    schema.category = catMeta
      ? isEn
        ? catMeta.titleEn
        : catMeta.title
      : photo.category;

    const shippingDetails = [
      {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "48.00",
          currency: "EUR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: ["US", "CA", "AU", "JP", "MX"],
        },
        deliveryTime: makeDeliveryTime(5, 10),
      },
      {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "32.00",
          currency: "EUR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: ["GB", "DE", "FR", "IT", "NL", "PT", "BE", "AT", "SE", "IE"],
        },
        deliveryTime: makeDeliveryTime(4, 7),
      },
      {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0.00",
          currency: "EUR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressRegion: "Canarias",
          addressCountry: "ES",
        },
        deliveryTime: makeDeliveryTime(1, 3),
      },
      {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "18.00",
          currency: "EUR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "ES",
        },
        deliveryTime: makeDeliveryTime(2, 5),
      },
    ];

    const merchantReturnPolicy = {
      "@type": "MerchantReturnPolicy",
      applicableCountry: isEn ? ["US", "ES"] : ["ES", "US"],
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 14,
      returnMethod: "https://schema.org/ReturnByMail",
    };

    const offerUrl = absoluteUrl(`${localizeHref(`/portfolio/${photo.slug}`, lang)}#adquirir-copia`);
    const availableFormats = ([formats.estudio, formats.galeria, formats.coleccion]).filter(
      (fmt) => !fmt.disabled
    );
    const prices = availableFormats.map((fmt) => fmt.price);
    const lowPrice = String(Math.min(...prices));
    const highPrice = String(Math.max(...prices));
    const tubeTag = isEn ? "Rigid tube" : "Tubo rígido";

    schema.offers = {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice,
      highPrice,
      offerCount: String(availableFormats.length),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: offerUrl,
      seller: {
        "@type": "Person",
        "@id": absoluteUrl("/#author"),
        name: "Javier Espinosa Martínez",
      },
      shippingDetails,
      hasMerchantReturnPolicy: merchantReturnPolicy,
      offers: availableFormats.map((fmt) => ({
        "@type": "Offer",
        name: `${photo.title} — ${fmt.name} (${fmt.dimensions} · Ed. ${editionTotal} · ${tubeTag})`,
        price: String(fmt.price),
        priceCurrency: "EUR",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        url: offerUrl,
        shippingDetails,
        hasMerchantReturnPolicy: merchantReturnPolicy,
      })),
    };
  }

  return schema;
}

export function generateCategoryCollectionSchema(
  category: PhotoCategory,
  photos: Photo[],
  lang: SiteLang = "es"
) {
  const isEn = lang === "en";
  const info = CATEGORY_METADATA[category];
  const catUrl = absoluteUrl(localizeHref(`/portfolio/${category}`, lang));
  const licenseUrl = absoluteUrl(localizeHref("/licensing", lang));

  return {
    "@context": "https://schema.org",
    "@type": ["CollectionPage", "ImageGallery"],
    "@id": catUrl,
    name: isEn
      ? `${info.titleEn} — Javier Espinosa Photography`
      : `${info.title} (${info.titleEn}) — Javier Espinosa Fotografía`,
    alternateName: isEn ? info.title : info.titleEn,
    headline: isEn ? info.subtitleEn : info.subtitle,
    description: isEn ? info.descriptionEn : info.description,
    url: catUrl,
    inLanguage: isEn ? "en-US" : "es-ES",
    numberOfItems: photos.length,
    author: {
      "@type": "Person",
      "@id": absoluteUrl("/#author"),
      name: "Javier Espinosa Martínez",
    },
    image: photos.map((raw) => {
      const p = getLocalizedPhoto(raw, lang);
      return {
        "@type": "ImageObject",
        name: p.title,
        caption: p.description,
        description: p.alt,
        contentUrl: absoluteUrl(p.image),
        url: absoluteUrl(localizeHref(`/portfolio/${p.slug}`, lang)),
        creditText: "Javier Espinosa Martínez",
        copyrightNotice: `© ${p.year} Javier Espinosa Martínez`,
        license: licenseUrl,
        acquireLicensePage: licenseUrl,
        creator: {
          "@type": "Person",
          name: "Javier Espinosa Martínez",
        },
      };
    }),
  };
}

export function generateProjectSchema(
  rawProject: Project,
  photos: Photo[],
  lang: SiteLang = "es"
) {
  const project = getLocalizedProject(rawProject, lang);
  const licenseUrl = absoluteUrl(localizeHref("/licensing", lang));

  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: project.title,
    headline: project.subtitle,
    description: project.description,
    url: absoluteUrl(localizeHref(`/projects/${project.slug}`, lang)),
    inLanguage: lang === "en" ? "en-US" : "es-ES",
    dateCreated: project.year,
    author: {
      "@type": "Person",
      name: "Javier Espinosa Martínez",
      url: absoluteUrl(localizeHref("/about", lang)),
    },
    about: project.discipline,
    image: photos.map((raw) => {
      const p = getLocalizedPhoto(raw, lang);
      return {
        "@type": "ImageObject",
        name: p.title,
        contentUrl: absoluteUrl(p.image),
        url: absoluteUrl(localizeHref(`/portfolio/${p.slug}`, lang)),
        creditText: "Javier Espinosa Martínez",
        copyrightNotice: `© ${p.year} Javier Espinosa Martínez`,
        license: licenseUrl,
        acquireLicensePage: licenseUrl,
      };
    }),
  };
}

export function generateServiceSchema(lang: SiteLang = "es") {
  const isEn = lang === "en";
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: isEn
      ? "Javier Espinosa Martínez — Photography Commissions & Fine Art Prints"
      : "Javier Espinosa Martínez — Servicios Fotográficos y Obra Fine Art",
    url: absoluteUrl(localizeHref("/servicios", lang)),
    image: absoluteUrl("/images/portfolio/coches-rally/cruzada-sobre-el-asfalto.jpg"),
    email: SITE_CONFIG.contactEmail,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tenerife",
      addressRegion: isEn ? "Canary Islands" : "Canarias",
      addressCountry: "ES",
    },
    sameAs: [
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.saatchi,
      SITE_CONFIG.social.getty,
    ],
    areaServed: isEn
      ? [
          { "@type": "Place", name: "Tenerife & Canary Islands" },
          { "@type": "Country", name: "Spain" },
        ]
      : [
          { "@type": "Place", name: "Tenerife y Canarias" },
          { "@type": "Country", name: "España" },
        ],
    founder: {
      "@type": "Person",
      name: "Javier Espinosa Martínez",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isEn
        ? "Author Photography Services & Archival Prints"
        : "Servicios Fotográficos de Autor",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isEn
              ? "Historic Rally & Motorsport Photography"
              : "Fotografía de Automovilismo y Rally Histórico",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isEn
              ? "Architecture, Interiors & Heritage Photography"
              : "Fotografía de Arquitectura, Espacios y Patrimonio",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isEn
              ? "Documentary & Editorial Photography"
              : "Proyectos Documentales y Fotografía Editorial",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isEn
              ? "Fine Art Prints for Collectors & Interiors"
              : "Obra Gráfica Fine Art para Coleccionismo e Interiorismo",
          },
        },
      ],
    },
  };
}

export function generateFAQSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; path: string }[],
  lang: SiteLang = "es"
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizeHref(item.path, lang)),
    })),
  };
}

export function generateCollectionListSchema({
  name,
  description,
  path,
  items,
  lang = "es",
}: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string; image?: string }[];
  lang?: SiteLang;
}) {
  const pageUrl = absoluteUrl(localizeHref(path, lang));
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageUrl,
    name,
    description,
    url: pageUrl,
    inLanguage: lang === "en" ? "en-US" : "es-ES",
    isPartOf: { "@id": absoluteUrl("/#website") },
    author: { "@id": absoluteUrl("/#author") },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(localizeHref(item.path, lang)),
        ...(item.image ? { image: absoluteUrl(item.image) } : {}),
      })),
    },
  };
}

export function generateArticleSchema({
  headline,
  description,
  path,
  image,
  articleSection,
  author = "Javier Espinosa Martínez",
  datePublished,
  lang = "es",
}: {
  headline: string;
  description: string;
  path: string;
  image?: string;
  articleSection?: string;
  author?: string;
  datePublished?: string;
  lang?: SiteLang;
}) {
  const pageUrl = absoluteUrl(localizeHref(path, lang));
  const isoDate =
    datePublished && /^\d{4}-\d{2}-\d{2}/.test(datePublished.trim())
      ? datePublished.trim()
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": pageUrl,
    headline,
    description,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    inLanguage: lang === "en" ? "en-US" : "es-ES",
    ...(articleSection ? { articleSection } : {}),
    ...(image ? { image: absoluteUrl(image) } : {}),
    ...(isoDate ? { datePublished: isoDate } : {}),
    dateModified: "2026-11-27",
    author: {
      "@type": "Person",
      "@id": absoluteUrl("/#author"),
      name: author,
      url: absoluteUrl(localizeHref("/about", lang)),
    },
    publisher: {
      "@type": "Person",
      "@id": absoluteUrl("/#author"),
      name: "Javier Espinosa Martínez",
    },
  };
}
