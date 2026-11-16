import type { Metadata } from "next";
import type { Photo } from "@/types/photo";

const SITE_URL = "https://www.javierespinosa.com";
const SITE_NAME = "Javier Espinosa Fotografía";
const DEFAULT_OG = "/images/portfolio/hero/hero.jpg";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
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
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "es_ES",
      images: [{ url: imageUrl, alt: title }],
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
  const title = photo.title;
  const description = photo.description;
  const path = `/portfolio/${photo.slug}`;

  return {
    title,
    description,
    keywords: photo.keywords,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      type: "article",
      locale: "es_ES",
      images: [{ url: absoluteUrl(photo.image), alt: photo.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(photo.image)],
    },
  };
}
