import type { MetadataRoute } from "next";
import { CUADERNO_POSTS } from "@/data/cuaderno";
import { SERVICE_LANDINGS } from "@/data/service-landings";
import { localizeHref } from "@/lib/i18n-helpers";
import { SITE_URL } from "@/lib/metadata";
import {
  getAllPhotos,
  getAllProjects,
  getFeaturedPhotos,
  getPhotoBySlug,
  getPhotosByCategory,
  getPrintablePhotos,
  getProjectPhotos,
  PHOTO_CATEGORIES,
} from "@/lib/photos";

const BASE = SITE_URL;
const CATALOG_LAST_MODIFIED = new Date("2026-11-27T23:00:00.000Z");
const LEGAL_LAST_MODIFIED = new Date("2026-11-17T00:00:00.000Z");

function getPhotoLastModified(year?: number): Date {
  if (!year || !Number.isFinite(year)) return CATALOG_LAST_MODIFIED;
  const clamped = Math.min(Math.max(Math.trunc(year), 2020), 2026);
  if (clamped >= 2026) return CATALOG_LAST_MODIFIED;
  return new Date(Date.UTC(clamped, 11, 31));
}

function withLangAlternates(basePath: string) {
  const esUrl = `${BASE}${basePath === "/" ? "" : basePath}`;
  const enPath = localizeHref(basePath, "en");
  const enUrl = `${BASE}${enPath}`;
  return {
    languages: {
      "es-ES": esUrl,
      es: esUrl,
      "en-US": enUrl,
      en: enUrl,
      "x-default": enUrl,
    },
  };
}

function buildBilingualEntry(
  basePath: string,
  options: {
    lastModified: Date;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
    images?: string[];
  }
): MetadataRoute.Sitemap {
  const esUrl = `${BASE}${basePath === "/" ? "" : basePath}`;
  const enUrl = `${BASE}${localizeHref(basePath, "en")}`;
  const alternates = withLangAlternates(basePath);

  return [
    {
      url: esUrl,
      ...options,
      alternates,
    },
    {
      url: enUrl,
      ...options,
      alternates,
    },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const featuredImages = getFeaturedPhotos().map((p) => `${BASE}${p.image}`);
  const printableImages = getPrintablePhotos().map((p) => `${BASE}${p.image}`);
  const projectCoverImages = getAllProjects().map((p) => `${BASE}${p.coverImage}`);

  const staticRoutes: MetadataRoute.Sitemap = [
    ...buildBilingualEntry("/", {
      lastModified: CATALOG_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1.0,
      images: featuredImages.slice(0, 6),
    }),
    ...buildBilingualEntry("/selected-work", {
      lastModified: CATALOG_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.95,
      images: featuredImages,
    }),
    ...buildBilingualEntry("/portfolio", {
      lastModified: CATALOG_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.95,
      images: featuredImages,
    }),
    ...buildBilingualEntry("/projects", {
      lastModified: CATALOG_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
      images: projectCoverImages,
    }),
    ...buildBilingualEntry("/prints", {
      lastModified: CATALOG_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
      images: printableImages,
    }),
    ...buildBilingualEntry("/servicios", {
      lastModified: CATALOG_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.85,
    }),
    ...buildBilingualEntry("/licensing", {
      lastModified: CATALOG_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.85,
    }),
    ...buildBilingualEntry("/cuaderno", {
      lastModified: CATALOG_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
    ...buildBilingualEntry("/stories", {
      lastModified: CATALOG_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
    ...buildBilingualEntry("/about", {
      lastModified: CATALOG_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    ...buildBilingualEntry("/dossier", {
      lastModified: CATALOG_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.75,
    }),
    ...buildBilingualEntry("/contact", {
      lastModified: LEGAL_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.75,
    }),
    ...buildBilingualEntry("/legal", {
      lastModified: LEGAL_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    }),
    ...buildBilingualEntry("/condiciones", {
      lastModified: LEGAL_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    }),
  ];

  // Solo incluir artículos publicados con contenido sustancial (evitar thin-content drafts)
  const publishedCuadernoPosts = CUADERNO_POSTS.filter(
    (post) =>
      post.status === "publicado" &&
      post.body.join(" ").replace(/\s+/g, " ").trim().length >= 160
  );

  const cuadernoRoutes: MetadataRoute.Sitemap = publishedCuadernoPosts.flatMap((post) => {
    const relatedPhoto = getPhotoBySlug(post.relatedWorkSlug);
    return buildBilingualEntry(`/cuaderno/${post.slug}`, {
      lastModified: CATALOG_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.75,
      ...(relatedPhoto ? { images: [`${BASE}${relatedPhoto.image}`] } : {}),
    });
  });

  const categoryRoutes: MetadataRoute.Sitemap = PHOTO_CATEGORIES.flatMap((category) => {
    const catPhotos = getPhotosByCategory(category);
    return buildBilingualEntry(`/portfolio/${category}`, {
      lastModified: CATALOG_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
      images: catPhotos.map((p) => `${BASE}${p.image}`),
    });
  });

  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().flatMap((project) => {
    const projPhotos = getProjectPhotos(project);
    return buildBilingualEntry(`/projects/${project.slug}`, {
      lastModified: CATALOG_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.85,
      images: projPhotos.map((p) => `${BASE}${p.image}`),
    });
  });

  const photoRoutes: MetadataRoute.Sitemap = getAllPhotos().flatMap((photo) =>
    buildBilingualEntry(`/portfolio/${photo.slug}`, {
      lastModified: getPhotoLastModified(photo.year),
      changeFrequency: "monthly",
      priority: photo.featured || photo.prints ? 0.8 : 0.7,
      images: [`${BASE}${photo.image}`],
    })
  );

  const serviceRoutes: MetadataRoute.Sitemap = SERVICE_LANDINGS.flatMap((service) =>
    buildBilingualEntry(`/servicios/${service.slug}`, {
      lastModified: CATALOG_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.85,
      images: [`${BASE}${service.heroImage}`],
    })
  );

  return [
    ...staticRoutes,
    ...cuadernoRoutes,
    ...serviceRoutes,
    ...categoryRoutes,
    ...projectRoutes,
    ...photoRoutes,
  ];
}
