import type { MetadataRoute } from "next";
import { CUADERNO_POSTS } from "@/data/cuaderno";
import { SERVICE_LANDINGS } from "@/data/service-landings";
import { localizeHref } from "@/lib/i18n-helpers";
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

const BASE = SITE_URL;

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
  const lastModified = new Date();
  const featuredImages = getFeaturedPhotos().map((p) => `${BASE}${p.image}`);
  const printableImages = getPrintablePhotos().map((p) => `${BASE}${p.image}`);

  const staticRoutes: MetadataRoute.Sitemap = [
    ...buildBilingualEntry("/", {
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
      images: featuredImages.slice(0, 6),
    }),
    ...buildBilingualEntry("/selected-work", {
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
      images: featuredImages,
    }),
    ...buildBilingualEntry("/portfolio", {
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
      images: featuredImages,
    }),
    ...buildBilingualEntry("/projects", {
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    }),
    ...buildBilingualEntry("/prints", {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      images: printableImages,
    }),
    ...buildBilingualEntry("/servicios", {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    }),
    ...buildBilingualEntry("/licensing", {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    }),
    ...buildBilingualEntry("/cuaderno", {
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
    ...buildBilingualEntry("/about", {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    ...buildBilingualEntry("/dossier", {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    }),
    ...buildBilingualEntry("/contact", {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    }),
    ...buildBilingualEntry("/legal", {
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    }),
    ...buildBilingualEntry("/condiciones", {
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    }),
  ];

  const cuadernoRoutes: MetadataRoute.Sitemap = CUADERNO_POSTS.flatMap((post) =>
    buildBilingualEntry(`/cuaderno/${post.slug}`, {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    })
  );

  const categoryRoutes: MetadataRoute.Sitemap = PHOTO_CATEGORIES.flatMap((category) => {
    const catPhotos = getPhotosByCategory(category);
    return buildBilingualEntry(`/portfolio/${category}`, {
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      images: catPhotos.map((p) => `${BASE}${p.image}`),
    });
  });

  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().flatMap((project) => {
    const projPhotos = getProjectPhotos(project);
    return buildBilingualEntry(`/projects/${project.slug}`, {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
      images: projPhotos.map((p) => `${BASE}${p.image}`),
    });
  });

  const photoRoutes: MetadataRoute.Sitemap = getAllPhotos().flatMap((photo) =>
    buildBilingualEntry(`/portfolio/${photo.slug}`, {
      lastModified,
      changeFrequency: "monthly",
      priority: photo.featured || photo.prints ? 0.8 : 0.7,
      images: [`${BASE}${photo.image}`],
    })
  );

  const serviceRoutes: MetadataRoute.Sitemap = SERVICE_LANDINGS.flatMap((service) =>
    buildBilingualEntry(`/servicios/${service.slug}`, {
      lastModified,
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
