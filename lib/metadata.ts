import type { Metadata } from "next";
import type { Photo } from "@/types/photo";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://javierespinosa.vercel.app");
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
  const title = `${photo.title}${photo.location ? ` (${photo.location})` : ""}`;
  const richDescription = `${photo.description} [${photo.camera} · ${photo.focalLength} · ${photo.aperture} · ${photo.shutter} · ISO ${photo.iso}]`;
  const path = `/portfolio/${photo.slug}`;

  return {
    title,
    description: richDescription,
    keywords: photo.keywords,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title: `${title} | Javier Espinosa Fotografía`,
      description: richDescription,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      type: "article",
      locale: "es_ES",
      images: [
        {
          url: absoluteUrl(photo.image),
          width: photo.width,
          height: photo.height,
          alt: photo.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Javier Espinosa Fotografía`,
      description: richDescription,
      images: [absoluteUrl(photo.image)],
    },
  };
}
