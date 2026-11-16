import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";
import { getAllPhotos, getAllProjects, PHOTO_CATEGORIES } from "@/lib/photos";
import { CATEGORY_METADATA } from "@/types/photo";

const BASE = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}`, lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/portfolio`, lastModified, changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE}/projects`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/prints`, lastModified, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/servicios`, lastModified, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/licensing`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/stories`, lastModified, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/about`, lastModified, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/contact`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/legal`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = PHOTO_CATEGORIES.map((category) => ({
    url: `${BASE}/portfolio/${category}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.85,
    images: [`${BASE}${CATEGORY_METADATA[category].coverImage}`],
  }));

  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map((project) => ({
    url: `${BASE}/projects/${project.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
    images: [`${BASE}${project.coverImage}`],
  }));

  const photoRoutes: MetadataRoute.Sitemap = getAllPhotos().map((photo) => ({
    url: `${BASE}/portfolio/${photo.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: photo.featured || photo.prints ? 0.75 : 0.65,
    images: [`${BASE}${photo.image}`],
  }));

  return [...staticRoutes, ...categoryRoutes, ...projectRoutes, ...photoRoutes];
}
