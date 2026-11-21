import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";
import {
  getAllPhotos,
  getAllProjects,
  getFeaturedPhotos,
  getPhotosByCategory,
  getPrintablePhotos,
  getProjectPhotos,
  PHOTO_CATEGORIES,
} from "@/lib/photos";
import { SERVICE_LANDINGS } from "@/data/service-landings";
import { CUADERNO_POSTS } from "@/data/cuaderno";

const BASE = SITE_URL;

function withLangAlternates(url: string) {
  return {
    languages: {
      es: url,
      en: `${url}?lang=en`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const featuredImages = getFeaturedPhotos().map((p) => `${BASE}${p.image}`);
  const printableImages = getPrintablePhotos().map((p) => `${BASE}${p.image}`);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: withLangAlternates(`${BASE}`),
      images: featuredImages.slice(0, 6),
    },
    {
      url: `${BASE}/selected-work`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
      alternates: withLangAlternates(`${BASE}/selected-work`),
      images: featuredImages,
    },
    {
      url: `${BASE}/portfolio`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
      alternates: withLangAlternates(`${BASE}/portfolio`),
      images: featuredImages,
    },
    {
      url: `${BASE}/projects`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: withLangAlternates(`${BASE}/projects`),
    },
    {
      url: `${BASE}/prints`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: withLangAlternates(`${BASE}/prints`),
      images: printableImages,
    },
    {
      url: `${BASE}/servicios`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: withLangAlternates(`${BASE}/servicios`),
    },
    {
      url: `${BASE}/licensing`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: withLangAlternates(`${BASE}/licensing`),
    },
    {
      url: `${BASE}/cuaderno`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: withLangAlternates(`${BASE}/cuaderno`),
    },
    {
      url: `${BASE}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: withLangAlternates(`${BASE}/about`),
    },
    {
      url: `${BASE}/dossier`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
      alternates: withLangAlternates(`${BASE}/dossier`),
    },
    {
      url: `${BASE}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
      alternates: withLangAlternates(`${BASE}/contact`),
    },
    {
      url: `${BASE}/legal`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: withLangAlternates(`${BASE}/legal`),
    },
    {
      url: `${BASE}/condiciones`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: withLangAlternates(`${BASE}/condiciones`),
    },
  ];

  const cuadernoRoutes: MetadataRoute.Sitemap = CUADERNO_POSTS.map((post) => ({
    url: `${BASE}/cuaderno/${post.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.75,
    alternates: withLangAlternates(`${BASE}/cuaderno/${post.slug}`),
  }));

  const categoryRoutes: MetadataRoute.Sitemap = PHOTO_CATEGORIES.map((category) => {
    const url = `${BASE}/portfolio/${category}`;
    const catPhotos = getPhotosByCategory(category);
    return {
      url,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: withLangAlternates(url),
      images: catPhotos.map((p) => `${BASE}${p.image}`),
    };
  });

  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map((project) => {
    const url = `${BASE}/projects/${project.slug}`;
    const projPhotos = getProjectPhotos(project);
    return {
      url,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: withLangAlternates(url),
      images: projPhotos.map((p) => `${BASE}${p.image}`),
    };
  });

  const photoRoutes: MetadataRoute.Sitemap = getAllPhotos().map((photo) => {
    const url = `${BASE}/portfolio/${photo.slug}`;
    return {
      url,
      lastModified,
      changeFrequency: "monthly",
      priority: photo.featured || photo.prints ? 0.8 : 0.7,
      alternates: withLangAlternates(url),
      images: [`${BASE}${photo.image}`],
    };
  });

  const serviceRoutes: MetadataRoute.Sitemap = SERVICE_LANDINGS.map((service) => {
    const url = `${BASE}/servicios/${service.slug}`;
    return {
      url,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: withLangAlternates(url),
      images: [`${BASE}${service.heroImage}`],
    };
  });

  return [
    ...staticRoutes,
    ...cuadernoRoutes,
    ...serviceRoutes,
    ...categoryRoutes,
    ...projectRoutes,
    ...photoRoutes,
  ];
}
