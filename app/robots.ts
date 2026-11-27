import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  const disallowed = [
    "/api/admin/",
    "/api/checkout",
    "/api/order",
    "/api/webhooks/",
    "/cliente",
    "/en/cliente",
    "/admin",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/en/", "/api/og"],
        disallow: disallowed,
      },
      {
        userAgent: ["Googlebot-Image", "Googlebot"],
        allow: ["/", "/images/portfolio/", "/en/"],
        disallow: disallowed,
      },
      {
        userAgent: ["GPTBot", "CCBot", "Google-Extended"],
        disallow: "/images/portfolio/",
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/image-sitemap.xml`,
    ],
  };
}
