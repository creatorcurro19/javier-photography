import { SITE_URL } from "@/lib/metadata";
import { getAllPhotos } from "@/lib/photos";
import { CATEGORY_METADATA } from "@/types/photo";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const FEED_BUILD_DATE = "Fri, 27 Nov 2026 23:00:00 GMT";

function getPhotoPubDate(year: number | undefined, index: number): string {
  const safeYear = year && Number.isFinite(year) ? Math.min(Math.max(Math.trunc(year), 2020), 2026) : 2025;
  const ts = Date.UTC(safeYear, 10, 27) - index * 3_600_000;
  return new Date(ts).toUTCString();
}

/**
 * Canal RSS 2.0 + Media RSS + WebSub (Google PubSubHubbub) con todas las obras del catálogo.
 * Permite la sindicación y descubrimiento automático en agregadores visuales, lectores RSS y buscadores.
 */
export async function GET() {
  const photos = getAllPhotos();

  const itemsXml = photos
    .map((photo, index) => {
      const url = `${SITE_URL}/portfolio/${photo.slug}`;
      const imgUrl = `${SITE_URL}${photo.image}`;
      const catTitle = CATEGORY_METADATA[photo.category]?.title ?? photo.category;
      const loc = photo.location
        ? `${photo.location}${photo.country && !photo.location.includes(photo.country) ? `, ${photo.country}` : ""}`
        : "Tenerife, España";
      const pubDate = getPhotoPubDate(photo.year, index);

      return `    <item>
      <title>${escapeXml(`${photo.title} — ${loc}`)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(catTitle)}</category>
      <description>${escapeXml(`${photo.description} (${loc} · ${photo.camera} · ${photo.focalLength})`)}</description>
      <enclosure url="${escapeXml(imgUrl)}" type="image/jpeg" length="1500000" />
      <media:content url="${escapeXml(imgUrl)}" type="image/jpeg" medium="image" width="${photo.width}" height="${photo.height}">
        <media:title>${escapeXml(photo.title)}</media:title>
        <media:description>${escapeXml(photo.alt || photo.description)}</media:description>
        <media:credit role="photographer">Javier Espinosa Martínez</media:credit>
      </media:content>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Javier Espinosa Fotografía — Tenerife · Fine Art &amp; Naturaleza</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>Archivo fotográfico de Javier Espinosa Martínez en Tenerife: fauna salvaje, paisajes, rally histórico, arquitectura y documental. Láminas Fine Art en papel de algodón.</description>
    <language>es-ES</language>
    <lastBuildDate>${FEED_BUILD_DATE}</lastBuildDate>
    <atom:link href="${escapeXml(`${SITE_URL}/feed.xml`)}" rel="self" type="application/rss+xml" />
    <atom:link href="https://pubsubhubbub.appspot.com/" rel="hub" />
${itemsXml}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
