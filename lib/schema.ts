import { absoluteUrl } from "@/lib/metadata";
import type { Photo, Project } from "@/types/photo";

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Person", "Photographer"],
    "@id": absoluteUrl("/#author"),
    name: "Javier Espinosa Martínez",
    alternateName: "Javier Espinosa Fotografía",
    url: absoluteUrl("/"),
    image: absoluteUrl("/images/portfolio/hero/hero.jpg"),
    email: "mailto:javierespinosa1995@hotmail.com",
    jobTitle: "Fotógrafo de Autor — Landscapes, Wildlife, Motorsport, Architecture & Documentary",
    description:
      "Fotógrafo español afincado en Tenerife (Canarias), especializado en cinco disciplinas fundamentales: Landscapes, Wildlife, Motorsport, Urban & Architecture y Documentary. Sistema óptico de precisión Canon EOS R7 (10-600mm) y obra gráfica Fine Art en papel Hahnemühle Photo Rag 308g bajo norma ISO 9706.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tenerife",
      addressRegion: "Canarias",
      addressCountry: "ES",
    },
    knowsAbout: [
      "Landscapes: Fotografía de paisaje y territorio",
      "Wildlife: Fotografía de fauna y biodiversidad",
      "Motorsport: Fotografía de automovilismo y rally",
      "Urban & Architecture: Fotografía de arquitectura y espacio",
      "Documentary: Fotografía documental y tradición",
      "Impresión Fine Art Hahnemühle ISO 9706",
    ],
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

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": photo.prints
      ? ["ImageObject", "Photograph", "VisualArtwork"]
      : ["ImageObject", "Photograph"],
    "@id": pageUrl,
    name: photo.title,
    headline: photo.title,
    description: photo.description,
    contentUrl: imgUrl,
    url: pageUrl,
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
    copyrightNotice: `© ${photo.year} Javier Espinosa Martínez. Todos los derechos reservados.`,
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
      name: "Javier Espinosa Martínez",
    },
    dateCreated: `${photo.year}`,
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

  if (photo.prints) {
    schema.artform = "Fotografía Fine Art de Autor";
    schema.artMedium = "Impresión Giclée de 12 tintas sobre algodón Hahnemühle Photo Rag 308 g/m²";
    schema.surface = "Papel 100% Algodón ISO 9706";
    schema.offers = {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "240",
      highPrice: "890",
      offerCount: "3",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/prints?obra=${encodeURIComponent(photo.title)}`),
      seller: {
        "@type": "Person",
        name: "Javier Espinosa Martínez",
      },
    };
  }

  return schema;
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
