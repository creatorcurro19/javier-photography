import { absoluteUrl } from "@/lib/metadata";
import {
  CATEGORY_METADATA,
  type Photo,
  type PhotoCategory,
  type Project,
} from "@/types/photo";

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["WebSite", "ArtGallery"],
    "@id": absoluteUrl("/#website"),
    name: "Javier Espinosa Fotografía",
    alternateName: "Javier Espinosa — Fine Art & Documentary Photography",
    url: absoluteUrl("/"),
    inLanguage: ["es-ES", "en"],
    description:
      "Galería oficial y archivo fotográfico de Javier Espinosa Martínez. Fotografía de autor en Tenerife y España: fauna salvaje (Wildlife), paisajes (Landscapes), automovilismo (Motorsport), arquitectura (Architecture) y documental (Documentary). Ediciones limitadas Fine Art en papel Hahnemühle Photo Rag 308g.",
    publisher: {
      "@id": absoluteUrl("/#author"),
    },
    creator: {
      "@id": absoluteUrl("/#author"),
    },
  };
}

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Person", "Photographer", "VisualArtist"],
    "@id": absoluteUrl("/#author"),
    name: "Javier Espinosa Martínez",
    alternateName: [
      "Javier Espinosa Fotografía",
      "Javier Espinosa Photography",
    ],
    url: absoluteUrl("/"),
    image: absoluteUrl("/images/portfolio/hero/hero.jpg"),
    email: "mailto:javierespinosa1995@hotmail.com",
    jobTitle:
      "Fotógrafo de Autor & Fine Art Photographer — Landscapes, Wildlife, Motorsport, Architecture & Documentary",
    description:
      "Fotógrafo español afincado en Tenerife (Canarias), especializado en cinco disciplinas fundamentales: Landscapes, Wildlife, Motorsport, Urban & Architecture y Documentary. Sistema óptico de precisión Canon EOS R7 (10-600mm) y obra gráfica Fine Art en papel Hahnemühle Photo Rag 308g bajo norma ISO 9706.",
    knowsLanguage: ["es", "en"],
    nationality: {
      "@type": "Country",
      name: "Spain",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tenerife",
      addressRegion: "Canarias",
      addressCountry: "ES",
    },
    knowsAbout: [
      "Landscapes: Fotografía de paisaje y territorio (Fine Art Landscape Photography)",
      "Wildlife: Fotografía de fauna salvaje y biodiversidad (Wildlife Photography)",
      "Motorsport: Fotografía de automovilismo y rally histórico (Motorsport Photography)",
      "Urban & Architecture: Fotografía de arquitectura y patrimonio (Architectural Photography)",
      "Documentary: Fotografía documental, oficios y tradición (Documentary Photography)",
      "Impresión Fine Art Hahnemühle Photo Rag 308g ISO 9706",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catálogo de Obras y Servicios de Autor",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Copias Fine Art Hahnemühle Photo Rag 308g",
          url: absoluteUrl("/prints"),
        },
        {
          "@type": "OfferCatalog",
          name: "Servicios de Fotografía y Cobertura de Rally",
          url: absoluteUrl("/servicios"),
        },
        {
          "@type": "OfferCatalog",
          name: "Licencias de Imagen en Alta Resolución",
          url: absoluteUrl("/licensing"),
        },
      ],
    },
    sameAs: [
      "https://www.instagram.com/Javier.espinosa19/",
      "https://www.saatchiart.com/javier-espinosa-photography",
      "https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image",
    ],
  };
}

export function generatePhotoSchema(photo: Photo) {
  const pageUrl = absoluteUrl(`/portfolio/${photo.slug}`);
  const imgUrl = absoluteUrl(photo.image);
  const catMeta = CATEGORY_METADATA[photo.category];

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
    contentUrl: imgUrl,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    representativeOfPage: true,
    encodingFormat: "image/jpeg",
    inLanguage: ["es-ES", "en"],
    genre: catMeta ? `${catMeta.title} / ${catMeta.titleEn}` : photo.category,
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
    license: absoluteUrl("/licensing"),
    acquireLicensePage: absoluteUrl("/licensing"),
    creditText: "Javier Espinosa Martínez",
    copyrightNotice: `© ${photo.year} Javier Espinosa Martínez. Todos los derechos reservados / All rights reserved.`,
    copyrightYear: photo.year,
    creator: {
      "@type": "Person",
      "@id": absoluteUrl("/#author"),
      name: "Javier Espinosa Martínez",
      url: absoluteUrl("/about"),
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
  const lowPrice = pricing ? String(pricing.estudio) : "120";
  const midPrice = pricing ? String(pricing.galeria) : "220";
  const highPrice = pricing ? String(pricing.coleccion) : "380";
  const dims = pricing?.dimensions ?? {
    estudio: "30 × 45 cm",
    galeria: "50 × 70 cm",
    coleccion: "70 × 100 cm",
  };
  const editionTotal = pricing?.editionTotal ?? 25;

  schema.artform = "Fotografía Fine Art de Autor / Fine Art Photography";
  schema.artMedium =
    pricing?.paper ??
    "Impresión Giclée de 12 tintas pigmentadas sobre papel 100% algodón Hahnemühle Photo Rag 308 g/m²";
  schema.surface = "Papel Fine Art Certificado ISO 9706 (entrega en tubo rígido sin marco)";
  schema.artEdition = `Edición limitada numerada y firmada de ${editionTotal} ejemplares`;
  if (photo.prints) {
    const shippingDetails = [
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
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "d",
          },
        },
      },
      {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "15.00",
          currency: "EUR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "ES",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 4,
            maxValue: 8,
            unitCode: "d",
          },
        },
      },
    ];

    const merchantReturnPolicy = {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "ES",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 14,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/FreeReturn",
    };

    schema.offers = {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice,
      highPrice,
      offerCount: "3",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: absoluteUrl(`/portfolio/${photo.slug}#adquirir-copia`),
      seller: {
        "@type": "Person",
        "@id": absoluteUrl("/#author"),
        name: "Javier Espinosa Martínez",
      },
      shippingDetails,
      hasMerchantReturnPolicy: merchantReturnPolicy,
      offers: [
        {
          "@type": "Offer",
          name: `${photo.title} — Formato Estudio (${dims.estudio} · Ed. ${editionTotal} · Tubo rígido)`,
          price: lowPrice,
          priceCurrency: "EUR",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          url: absoluteUrl(`/portfolio/${photo.slug}#adquirir-copia`),
          shippingDetails,
          hasMerchantReturnPolicy: merchantReturnPolicy,
        },
        {
          "@type": "Offer",
          name: `${photo.title} — Formato Galería (${dims.galeria} · Ed. ${editionTotal} · Tubo rígido)`,
          price: midPrice,
          priceCurrency: "EUR",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          url: absoluteUrl(`/portfolio/${photo.slug}#adquirir-copia`),
          shippingDetails,
          hasMerchantReturnPolicy: merchantReturnPolicy,
        },
        {
          "@type": "Offer",
          name: `${photo.title} — Gran Colección (${dims.coleccion} · Ed. ${editionTotal} · Tubo rígido)`,
          price: highPrice,
          priceCurrency: "EUR",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          url: absoluteUrl(`/portfolio/${photo.slug}#adquirir-copia`),
          shippingDetails,
          hasMerchantReturnPolicy: merchantReturnPolicy,
        },
      ],
    };
  }

  return schema;
}

export function generateCategoryCollectionSchema(
  category: PhotoCategory,
  photos: Photo[],
) {
  const info = CATEGORY_METADATA[category];
  return {
    "@context": "https://schema.org",
    "@type": ["CollectionPage", "ImageGallery"],
    "@id": absoluteUrl(`/portfolio/${category}`),
    name: `${info.title} (${info.titleEn}) — Javier Espinosa Fotografía`,
    alternateName: info.titleEn,
    headline: info.subtitle,
    description: info.description,
    url: absoluteUrl(`/portfolio/${category}`),
    inLanguage: ["es-ES", "en"],
    numberOfItems: photos.length,
    author: {
      "@type": "Person",
      "@id": absoluteUrl("/#author"),
      name: "Javier Espinosa Martínez",
    },
    image: photos.map((p) => ({
      "@type": "ImageObject",
      name: p.title,
      caption: p.description,
      description: p.alt,
      contentUrl: absoluteUrl(p.image),
      url: absoluteUrl(`/portfolio/${p.slug}`),
      creditText: "Javier Espinosa Martínez",
      copyrightNotice: `© ${p.year} Javier Espinosa Martínez`,
      license: absoluteUrl("/licensing"),
      acquireLicensePage: absoluteUrl("/licensing"),
      creator: {
        "@type": "Person",
        name: "Javier Espinosa Martínez",
      },
    })),
  };
}

export function generateProjectSchema(project: Project, photos: Photo[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: project.title,
    headline: project.subtitle,
    description: project.description,
    url: absoluteUrl(`/projects/${project.slug}`),
    dateCreated: project.year,
    author: {
      "@type": "Person",
      name: "Javier Espinosa Martínez",
      url: absoluteUrl("/about"),
    },
    about: project.discipline,
    image: photos.map((p) => ({
      "@type": "ImageObject",
      name: p.title,
      contentUrl: absoluteUrl(p.image),
      url: absoluteUrl(`/portfolio/${p.slug}`),
      creditText: "Javier Espinosa Martínez",
      copyrightNotice: `© ${p.year} Javier Espinosa Martínez`,
      license: absoluteUrl("/licensing"),
      acquireLicensePage: absoluteUrl("/licensing"),
    })),
  };
}

export function generateServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Javier Espinosa Martínez — Servicios Fotográficos y Obra Fine Art",
    url: absoluteUrl("/servicios"),
    image: absoluteUrl("/images/portfolio/coches-rally/cruzada-sobre-el-asfalto.jpg"),
    email: "javierespinosa1995@hotmail.com",
    priceRange: "€€",
    areaServed: [
      { "@type": "Country", name: "España" },
      { "@type": "Place", name: "Europa" },
    ],
    founder: {
      "@type": "Person",
      name: "Javier Espinosa Martínez",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios Fotográficos de Autor",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Fotografía de Automovilismo y Rally Histórico",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Fotografía de Arquitectura, Espacios y Patrimonio",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Proyectos Documentales y Fotografía Editorial",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Obra Gráfica Fine Art para Coleccionismo e Interiorismo",
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
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
