import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/en/", "/api/og"],
        disallow: [
          "/api/admin/",
          "/api/checkout",
          "/api/order",
          "/api/webhooks/",
          "/cliente",
          "/en/cliente",
          "/admin",
        ],
      },
      {
        userAgent: ["Googlebot-Image", "Googlebot"],
        allow: [
          "/images/portfolio/",
          "/portfolio/",
          "/projects/",
          "/prints",
          "/selected-work",
          "/en/",
          "/en/portfolio/",
          "/en/projects/",
          "/en/prints",
          "/en/selected-work",
        ],
        disallow: [
          "/api/admin/",
          "/api/checkout",
          "/api/order",
          "/api/webhooks/",
          "/cliente",
          "/en/cliente",
          "/admin",
        ],
      },
      {
        userAgent: ["GPTBot", "CCBot", "Google-Extended"],
        disallow: "/images/portfolio/",
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/image-sitemap.xml`,
      `${SITE_URL}/feed.xml`,
    ],
  };
}
