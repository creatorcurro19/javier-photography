import type { Metadata } from "next";
import { CATEGORY_METADATA, type Photo } from "@/types/photo";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://javier-photography.vercel.app");
const SITE_NAME = "Javier Espinosa Fotografía";
const DEFAULT_OG = "/opengraph-image";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function buildLanguageAlternates(path: string) {
  const cleanUrl = absoluteUrl(path);
  const sep = cleanUrl.includes("?") ? "&" : "?";
  return {
    canonical: cleanUrl,
    languages: {
      "es-ES": cleanUrl,
      es: cleanUrl,
      en: `${cleanUrl}${sep}lang=en`,
      "x-default": cleanUrl,
    },
  };
}

export function buildPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    keywords,
    alternates: buildLanguageAlternates(path),
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "es_ES",
      alternateLocale: ["en_US", "en_GB"],
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function buildPhotoMetadata(photo: Photo): Metadata {
  const catMeta = CATEGORY_METADATA[photo.category];
  const title = `${photo.title}${photo.location ? ` — ${photo.location}` : ""}`;
  const modeNote = photo.prints
    ? "Edición Fine Art Hahnemühle Photo Rag 308g & Licencia Editorial"
    : "Archivo Fotográfico de Autor & Licencia Editorial";
  const richDescription = `${photo.description} ${
    photo.location ? `Localización: ${photo.location}${photo.country ? ` (${photo.country})` : ""}. ` : ""
  }Disciplina: ${catMeta?.title ?? photo.category} (${catMeta?.titleEn ?? ""}). Captura: ${photo.camera} · ${photo.focalLength} · ${photo.aperture} · ${photo.shutter} · ISO ${photo.iso}. ${modeNote}.`;
  const path = `/portfolio/${photo.slug}`;
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(photo.image);

  return {
    title,
    description: richDescription,
    keywords: [
      ...photo.keywords,
      photo.title,
      ...(photo.location ? [photo.location] : []),
      catMeta?.title ?? photo.category,
      catMeta?.titleEn ?? "Fine Art Photography",
      "Javier Espinosa Martínez",
    ],
    alternates: buildLanguageAlternates(path),
    openGraph: {
      title: `${title} | Javier Espinosa Fotografía`,
      description: richDescription,
      url,
      siteName: SITE_NAME,
      type: "article",
      locale: "es_ES",
      alternateLocale: ["en_US", "en_GB"],
      images: [
        {
          url: imageUrl,
          width: photo.width,
          height: photo.height,
          alt: photo.alt,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Javier Espinosa Fotografía`,
      description: richDescription,
      images: [imageUrl],
    },
  };
}
