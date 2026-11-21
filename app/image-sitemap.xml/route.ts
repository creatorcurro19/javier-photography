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
 * Sitemap XML dedicado exclusivamente a Google Images (/image-sitemap.xml).
 * Cumple la especificación actual http://www.google.com/schemas/sitemap-image/1.1
 */
export async function GET() {
  const photos = getAllPhotos();
  const projects = getAllProjects();

  const entries: { loc: string; images: string[] }[] = [
    ...PHOTO_CATEGORIES.map((category) => ({
      loc: `${SITE_URL}/portfolio/${category}`,
      images: getPhotosByCategory(category).map((p) => `${SITE_URL}${p.image}`),
    })),
    ...projects.map((project) => ({
      loc: `${SITE_URL}/projects/${project.slug}`,
      images: getProjectPhotos(project).map((p) => `${SITE_URL}${p.image}`),
    })),
    ...photos.map((photo) => ({
      loc: `${SITE_URL}/portfolio/${photo.slug}`,
      images: [`${SITE_URL}${photo.image}`],
    })),
  ];

  const urlNodes = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
${entry.images
  .map(
    (img) => `    <image:image>
      <image:loc>${escapeXml(img)}</image:loc>
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
