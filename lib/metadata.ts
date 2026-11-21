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

const BRAND_SUFFIX = " | Javier Espinosa";
const MAX_TITLE_LEN = 60;
const MAX_DESC_LEN = 155;

/**
 * Formatea cualquier título bajo la plantilla "{Página} | Javier Espinosa"
 * sin duplicar la marca y garantizando longitud total <= 60 caracteres.
 */
export function formatSeoTitle(rawTitle: string): string {
  const cleaned = rawTitle
    .replace(/\s*\|\s*Javier Espinosa(\s+Fotograf[íi]a|\s+Photography)?/gi, "")
    .replace(/^Javier Espinosa\s*\|\s*/i, "")
    .trim();

  const maxPageLen = MAX_TITLE_LEN - BRAND_SUFFIX.length; // 42 chars
  let pagePart = cleaned || "Fotografía de Autor en Tenerife";
  if (pagePart.length > maxPageLen) {
    const sliced = pagePart.slice(0, maxPageLen - 1);
    const lastSpace = sliced.lastIndexOf(" ");
    pagePart = (lastSpace > 20 ? sliced.slice(0, lastSpace) : sliced).trim() + "…";
  }
  return `${pagePart}${BRAND_SUFFIX}`;
}

/**
 * Trunca la metadescripción sin cortar palabras, garantizando <= 155 caracteres.
 */
export function formatSeoDescription(rawDesc: string): string {
  const clean = rawDesc.replace(/\s+/g, " ").trim();
  if (clean.length <= MAX_DESC_LEN) return clean;
  const sliced = clean.slice(0, MAX_DESC_LEN - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return (lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trim() + "…";
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
  const seoTitle = formatSeoTitle(title);
  const seoDescription = formatSeoDescription(description);
  const ogImage =
    image === DEFAULT_OG
      ? `${SITE_URL}/api/og?title=${encodeURIComponent(
          seoTitle.replace(/\s*\|\s*Javier Espinosa.*$/i, "")
        )}&subtitle=${encodeURIComponent(seoDescription.slice(0, 100))}&badge=FINE%20ART`
      : absoluteUrl(image);

  return {
    title: {
      absolute: seoTitle,
    },
    description: seoDescription,
    keywords,
    alternates: buildLanguageAlternates(path),
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "es_ES",
      alternateLocale: ["en_US", "en_GB"],
      images: [{ url: ogImage, width: 1200, height: 630, alt: seoTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [ogImage],
    },
  };
}

export function buildPhotoMetadata(photo: Photo): Metadata {
  const catMeta = CATEGORY_METADATA[photo.category];
  const seoTitle = formatSeoTitle(photo.title);
  const locPart = photo.location
    ? `${photo.location}${photo.country && !photo.location.includes(photo.country) ? `, ${photo.country}` : ""}. `
    : "";
  const rawDescription = `${photo.description} ${locPart}${photo.camera} · ${photo.focalLength}. Copia Fine Art y licencia.`;
  const seoDescription = formatSeoDescription(rawDescription);
  const path = `/portfolio/${photo.slug}`;
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(photo.image);

  return {
    title: {
      absolute: seoTitle,
    },
    description: seoDescription,
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
      title: seoTitle,
      description: seoDescription,
      url,
      siteName: SITE_NAME,
      type: "article",
      locale: "es_ES",
      alternateLocale: ["en_US", "en_GB"],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: photo.alt,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [imageUrl],
    },
  };
}
