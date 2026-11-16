import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: ["GPTBot", "CCBot", "Google-Extended"],
        disallow: "/images/portfolio/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
