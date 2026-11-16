import type { MetadataRoute } from "next";

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
    sitemap: "https://www.javierespinosa.com/sitemap.xml",
  };
}
