import { localizeHref } from "@/lib/i18n-helpers";
import { getLocalizedPhoto, getLocalizedProject } from "@/lib/i18n-works";
import { SITE_URL } from "@/lib/metadata";
import {
  getAllPhotos,
  getAllProjects,
  getPhotosByCategory,
  getProjectPhotos,
  PHOTO_CATEGORIES,
} from "@/lib/photos";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Sitemap XML bilingüe (ES + EN/US) dedicado a Google Images (/image-sitemap.xml).
 * Cumple la especificación http://www.google.com/schemas/sitemap-image/1.1
 */
export async function GET() {
  const photos = getAllPhotos();
  const projects = getAllProjects();

  const formatGeo = (loc?: string, country?: string) =>
    loc
      ? `${loc}${country && !loc.includes(country) ? `, ${country}` : ""}`
      : undefined;

  const esEntries = [
    ...PHOTO_CATEGORIES.map((category) => ({
      loc: `${SITE_URL}/portfolio/${category}`,
      images: getPhotosByCategory(category).map((p) => ({
        url: `${SITE_URL}${p.image}`,
        title: `${p.title} — Javier Espinosa`,
        caption: p.alt || p.description,
        geo: formatGeo(p.location, p.country),
      })),
    })),
    ...projects.map((project) => ({
      loc: `${SITE_URL}/projects/${project.slug}`,
      images: getProjectPhotos(project).map((p) => ({
        url: `${SITE_URL}${p.image}`,
        title: `${p.title} — ${project.title}`,
        caption: p.alt || p.description,
        geo: p.location || project.location,
      })),
    })),
    ...photos.map((photo) => ({
      loc: `${SITE_URL}/portfolio/${photo.slug}`,
      images: [
        {
          url: `${SITE_URL}${photo.image}`,
          title: `${photo.title} — Javier Espinosa Fotografía`,
          caption: `${photo.description} (${photo.alt})`,
          geo: formatGeo(photo.location, photo.country),
        },
      ],
    })),
  ];

  const enEntries = [
    ...PHOTO_CATEGORIES.map((category) => ({
      loc: `${SITE_URL}${localizeHref(`/portfolio/${category}`, "en")}`,
      images: getPhotosByCategory(category).map((raw) => {
        const p = getLocalizedPhoto(raw, "en");
        return {
          url: `${SITE_URL}${p.image}`,
          title: `${p.title} — Javier Espinosa Fine Art Prints`,
          caption: p.alt || p.description,
          geo: formatGeo(p.location, p.country),
        };
      }),
    })),
    ...projects.map((rawProj) => {
      const project = getLocalizedProject(rawProj, "en");
      return {
        loc: `${SITE_URL}${localizeHref(`/projects/${project.slug}`, "en")}`,
        images: getProjectPhotos(rawProj).map((raw) => {
          const p = getLocalizedPhoto(raw, "en");
          return {
            url: `${SITE_URL}${p.image}`,
            title: `${p.title} — ${project.title}`,
            caption: p.alt || p.description,
            geo: p.location || project.location,
          };
        }),
      };
    }),
    ...photos.map((raw) => {
      const photo = getLocalizedPhoto(raw, "en");
      return {
        loc: `${SITE_URL}${localizeHref(`/portfolio/${photo.slug}`, "en")}`,
        images: [
          {
            url: `${SITE_URL}${photo.image}`,
            title: `${photo.title} — Javier Espinosa Photography`,
            caption: `${photo.description} (${photo.alt})`,
            geo: formatGeo(photo.location, photo.country),
          },
        ],
      };
    }),
  ];

  const entries = [...esEntries, ...enEntries];

  const urlNodes = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
${entry.images
  .map(
    (img) => `    <image:image>
      <image:loc>${escapeXml(img.url)}</image:loc>${
        img.title ? `\n      <image:title>${escapeXml(img.title)}</image:title>` : ""
      }${
        img.caption ? `\n      <image:caption>${escapeXml(img.caption)}</image:caption>` : ""
      }${
        img.geo ? `\n      <image:geo_location>${escapeXml(img.geo)}</image:geo_location>` : ""
      }
    </image:image>`,
  )
  .join("\n")}
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlNodes}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
