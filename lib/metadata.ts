import type { Metadata } from "next";
import { SITE_CONFIG } from "@/data/site-config";
import { localizeHref, normalizeRoutePath, type SiteLang } from "@/lib/i18n-helpers";
import { getLocalizedPhoto } from "@/lib/i18n-works";
import { CATEGORY_METADATA, type Photo } from "@/types/photo";

export const SITE_URL = SITE_CONFIG.siteUrl;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function buildLanguageAlternates(path: string, lang: SiteLang = "es") {
  const basePath = normalizeRoutePath(path);
  const esUrl = absoluteUrl(basePath);
  const enUrl = absoluteUrl(localizeHref(basePath, "en"));

  return {
    canonical: lang === "en" ? enUrl : esUrl,
    languages: {
      "es-ES": esUrl,
      es: esUrl,
      "en-US": enUrl,
      en: enUrl,
      "x-default": enUrl,
    },
  };
}

const BRAND_SUFFIX = " | Javier Espinosa";
const MAX_TITLE_LEN = 60;
const MAX_DESC_LEN = 155;

/**
 * Formatea cualquier título garantizando longitud < 60 caracteres sin cortes con "…".
 */
export function formatSeoTitle(rawTitle: string, lang: SiteLang = "es"): string {
  const cleaned = rawTitle
    .replace(/\s*\|\s*Javier Espinosa(\s+Fotograf[íi]a|\s+Photography)?/gi, "")
    .replace(/^Javier Espinosa\s*\|\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return lang === "en"
      ? `Fine Art Photography${BRAND_SUFFIX}`
      : `Fotografía de Autor${BRAND_SUFFIX}`;
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
  image,
  type = "website",
  robots,
  lang = "es",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  robots?: Metadata["robots"];
  lang?: SiteLang;
}): Metadata {
  const localizedPath = localizeHref(path, lang);
  const url = absoluteUrl(localizedPath);
  const seoTitle = formatSeoTitle(title, lang);
  const seoDescription = formatSeoDescription(description);
  const fallbackOgCard = `${SITE_URL}/api/og?title=${encodeURIComponent(
    seoTitle.replace(/\s*\|\s*Javier Espinosa.*$/i, "")
  )}&subtitle=${encodeURIComponent(formatSeoDescription(seoDescription))}&badge=${
    lang === "en" ? "FINE%20ART%20PRINTS" : "FINE%20ART"
  }&lang=${lang}`;
  const resolvedImage = image ? absoluteUrl(image) : fallbackOgCard;
  const ogImages = image
    ? [
        { url: resolvedImage, alt: seoTitle },
        { url: fallbackOgCard, width: 1200, height: 630, alt: seoTitle },
      ]
    : [{ url: fallbackOgCard, width: 1200, height: 630, alt: seoTitle }];

  const siteName =
    lang === "en" ? "Javier Espinosa Photography" : SITE_CONFIG.siteName;

  return {
    title: {
      absolute: seoTitle,
    },
    description: seoDescription,
    ...(robots ? { robots } : {}),
    alternates: buildLanguageAlternates(path, lang),
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url,
      siteName,
      type,
      locale: lang === "en" ? "en_US" : "es_ES",
      alternateLocale: lang === "en" ? ["es_ES", "en_GB"] : ["en_US", "en_GB"],
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [resolvedImage],
    },
  };
}

export function buildPhotoMetadata(
  rawPhoto: Photo,
  lang: SiteLang = "es"
): Metadata {
  const photo = getLocalizedPhoto(rawPhoto, lang);
  const catMeta = CATEGORY_METADATA[photo.category];
  const seoTitle = formatSeoTitle(photo.title, lang);
  const locText = photo.location
    ? `${photo.location}${
        photo.country && !photo.location.includes(photo.country)
          ? `, ${photo.country}`
          : ""
      }`
    : "";
  const baseDesc = photo.description.replace(/\s+/g, " ").trim();
  const baseWithDot = baseDesc.endsWith(".") ? baseDesc : `${baseDesc}.`;

  let rawDescription: string;
  if (lang === "en") {
    const printNote = photo.prints
      ? ` Limited Fine Art cotton print${locText ? ` (${locText})` : ""}.`
      : locText && !baseDesc.toLowerCase().includes(locText.toLowerCase())
      ? ` ${locText}.`
      : "";
    const candidate = `${baseWithDot}${printNote}`;
    rawDescription =
      candidate.length <= MAX_DESC_LEN
        ? candidate
        : baseWithDot.length <= MAX_DESC_LEN
        ? baseWithDot
        : `${photo.title}${locText ? ` (${locText})` : ""}. ${
            catMeta?.titleEn ?? "Fine Art Photography"
          } · ${photo.focalLength}.`;
  } else {
    const locAddition =
      locText && !baseDesc.toLowerCase().includes(locText.toLowerCase())
        ? ` ${locText}.`
        : "";
    const candidate = `${baseWithDot}${locAddition}`;
    rawDescription =
      candidate.length <= MAX_DESC_LEN
        ? candidate
        : baseWithDot.length <= MAX_DESC_LEN
        ? baseWithDot
        : `${photo.title}${locText ? ` (${locText})` : ""}. ${
            catMeta?.title ?? "Fotografía de autor"
          } con ${photo.focalLength}.`;
  }

  const seoDescription = formatSeoDescription(rawDescription);
  const basePath = `/portfolio/${photo.slug}`;
  const url = absoluteUrl(localizeHref(basePath, lang));
  const photoImageUrl = absoluteUrl(photo.image);
  const ogCardUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(
    photo.title
  )}&subtitle=${encodeURIComponent(
    photo.location ||
      (lang === "en" ? catMeta?.titleEn : catMeta?.title) ||
      (lang === "en" ? "Fine Art Photography" : "Fotografía de Autor")
  )}&badge=${encodeURIComponent(
    (lang === "en" ? catMeta?.codeEn : catMeta?.code) || "FINE ART"
  )}&lang=${lang}`;

  const siteName =
    lang === "en" ? "Javier Espinosa Photography" : SITE_CONFIG.siteName;

  return {
    title: {
      absolute: seoTitle,
    },
    description: seoDescription,
    alternates: buildLanguageAlternates(basePath, lang),
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url,
      siteName,
      type: "article",
      locale: lang === "en" ? "en_US" : "es_ES",
      alternateLocale: lang === "en" ? ["es_ES", "en_GB"] : ["en_US", "en_GB"],
      images: [
        {
          url: photoImageUrl,
          width: photo.width,
          height: photo.height,
          alt: photo.alt || `${photo.title} — ${siteName}`,
          type: "image/jpeg",
        },
        {
          url: ogCardUrl,
          width: 1200,
          height: 630,
          alt: `${photo.title} — ${siteName}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [photoImageUrl],
    },
  };
}
