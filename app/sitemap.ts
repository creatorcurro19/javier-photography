import type { MetadataRoute } from "next";
import { getAllPhotoSlugs, PHOTO_CATEGORIES } from "@/lib/photos";

const BASE = "https://www.javierespinosa.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/portfolio",
    "/servicios",
    "/prints",
    "/stories",
    "/about",
    "/contact",
    "/licensing",
  ];

  const categoryRoutes = PHOTO_CATEGORIES.map((category) => `/portfolio/${category}`);
  const photoRoutes = getAllPhotoSlugs().map((slug) => `/portfolio/${slug}`);
  const lastModified = new Date();

  return [...staticRoutes, ...categoryRoutes, ...photoRoutes].map((path) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency:
      path === "" ? ("weekly" as const) : path.startsWith("/portfolio/") ? ("monthly" as const) : ("monthly" as const),
    priority:
      path === ""
        ? 1.0
        : path === "/portfolio"
        ? 0.9
        : path === "/servicios" || path === "/prints"
        ? 0.8
        : path.split("/").length === 3 && PHOTO_CATEGORIES.includes(path.split("/")[2] as (typeof PHOTO_CATEGORIES)[number])
        ? 0.8
        : 0.6,
  }));
}
