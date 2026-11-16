import { absoluteUrl } from "@/lib/metadata";
import type { Photo } from "@/types/photo";

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Javier Espinosa Martínez",
    url: absoluteUrl("/"),
    email: "mailto:javierespinosa1995@hotmail.com",
    jobTitle: "Fotógrafo de Autor & Documental",
    sameAs: [
      "https://www.instagram.com/Javier.espinosa19/",
      "https://www.saatchiart.com/javier-espinosa-photography",
      "https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image",
    ],
  };
}

export function generatePhotoSchema(photo: Photo) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Photograph",
    name: photo.title,
    description: photo.description,
    contentUrl: absoluteUrl(photo.image),
    url: absoluteUrl(`/portfolio/${photo.slug}`),
    author: {
      "@type": "Person",
      name: "Javier Espinosa Martínez",
    },
    copyrightHolder: {
      "@type": "Person",
      name: "Javier Espinosa Martínez",
    },
    dateCreated: `${photo.year}`,
    keywords: photo.keywords.join(", "),
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
    };
  }

  return schema;
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
