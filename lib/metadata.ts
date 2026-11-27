import type { Metadata } from "next";
import { SITE_CONFIG } from "@/data/site-config";
import { CATEGORY_METADATA, type Photo } from "@/types/photo";

export const SITE_URL = SITE_CONFIG.siteUrl;
const SITE_NAME = SITE_CONFIG.siteName;
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
 * Formatea cualquier título garantizando longitud < 60 caracteres sin cortes con "…".
 */
export function formatSeoTitle(rawTitle: string): string {
  const cleaned = rawTitle
    .replace(/\s*\|\s*Javier Espinosa(\s+Fotograf[íi]a|\s+Photography)?/gi, "")
    .replace(/^Javier Espinosa\s*\|\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return `Fotografía de Autor${BRAND_SUFFIX}`;
  }

  const withBrand = `${cleaned}${BRAND_SUFFIX}`;
  if (withBrand.length < MAX_TITLE_LEN) {
    return withBrand;
  }

  // Si la parte de página cabe íntegra (< 60 chars) sin la marca, se devuelve sin cortar ni truncar.
  if (cleaned.length < MAX_TITLE_LEN) {
    return cleaned;
  }

  const words = cleaned.split(" ");
  let out = "";
  for (const word of words) {
    const next = out ? `${out} ${word}` : word;
    if (next.length >= MAX_TITLE_LEN) break;
    out = next;
  }
  return out || cleaned.slice(0, MAX_TITLE_LEN - 1);
}

/**
 * Ajusta la metadescripción sin cortes ni puntos suspensivos ("…"), <= 155 caracteres.
 */
export function formatSeoDescription(rawDesc: string): string {
  const clean = rawDesc.replace(/\s+/g, " ").trim();
  if (clean.length <= MAX_DESC_LEN) return clean;

  // Buscar un final de frase completo dentro de [90, 155]
  const sentenceEnd = clean.lastIndexOf(". ", MAX_DESC_LEN);
  if (sentenceEnd >= 90) {
    return clean.slice(0, sentenceEnd + 1);
  }

  const words = clean.split(" ");
  let acc = "";
  for (const word of words) {
    const next = acc ? `${acc} ${word}` : word;
    if (next.length >= MAX_DESC_LEN) break;
    acc = next;
  }
  const trimmed = (acc || clean.slice(0, MAX_DESC_LEN - 1)).replace(/[,;:\s—-]+$/, "");
  return trimmed.endsWith(".") ? trimmed : `${trimmed}.`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG,
  robots,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  robots?: Metadata["robots"];
}): Metadata {
  const url = absoluteUrl(path);
  const seoTitle = formatSeoTitle(title);
  const seoDescription = formatSeoDescription(description);
  const ogImage =
    image === DEFAULT_OG
      ? `${SITE_URL}/api/og?title=${encodeURIComponent(
          seoTitle.replace(/\s*\|\s*Javier Espinosa.*$/i, "")
        )}&subtitle=${encodeURIComponent(formatSeoDescription(seoDescription))}&badge=FINE%20ART`
      : absoluteUrl(image);

  return {
    title: {
      absolute: seoTitle,
    },
    description: seoDescription,
    ...(robots ? { robots } : {}),
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
  const locText = photo.location
    ? `${photo.location}${photo.country && !photo.location.includes(photo.country) ? `, ${photo.country}` : ""}`
    : "";
  const baseDesc = photo.description.replace(/\s+/g, " ").trim();
  const baseWithDot = baseDesc.endsWith(".") ? baseDesc : `${baseDesc}.`;
  const locAddition = locText && !baseDesc.toLowerCase().includes(locText.toLowerCase())
    ? ` ${locText}.`
    : "";
  const rawCandidate = `${baseWithDot}${locAddition}`;
  const rawDescription =
    rawCandidate.length <= MAX_DESC_LEN
      ? rawCandidate
      : baseWithDot.length <= MAX_DESC_LEN
        ? baseWithDot
        : `${photo.title}${locText ? ` (${locText})` : ""}. ${catMeta?.title ?? "Fotografía de autor"} con ${photo.focalLength}.`;
  const seoDescription = formatSeoDescription(rawDescription);
  const path = `/portfolio/${photo.slug}`;
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(photo.image);
  const ogCardUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(
    photo.title
  )}&subtitle=${encodeURIComponent(
    photo.location || catMeta?.title || "Fotografía de Autor"
  )}&badge=${encodeURIComponent(catMeta?.code || "FINE ART")}`;

  return {
    title: {
      absolute: seoTitle,
    },
    description: seoDescription,
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
          width: photo.width,
          height: photo.height,
          alt: photo.alt,
          type: "image/jpeg",
        },
        {
          url: ogCardUrl,
          width: 1200,
          height: 630,
          alt: `${photo.title} — Javier Espinosa Fotografía`,
          type: "image/png",
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
