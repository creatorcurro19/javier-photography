import "server-only";
import { SITE_CONFIG } from "@/data/site-config";
import type { Photo } from "@/types/photo";

interface JpegAuthorMetadata {
  artist: string;
  creator: string;
  copyright: string;
  title: string;
  description: string;
  webUrl: string;
  location: string;
  country: string;
  keywords: string[];
}

function encodeEvenUtf8(text: string): Buffer {
  const buf = Buffer.from(`${text}\0`, "utf8");
  return buf.length % 2 === 1 ? Buffer.concat([buf, Buffer.from([0])]) : buf;
}

function buildExifSegment({
  artist,
  copyright,
  description,
}: Pick<JpegAuthorMetadata, "artist" | "copyright" | "description">): Buffer {
  const descBuf = encodeEvenUtf8(description);
  const artBuf = encodeEvenUtf8(artist);
  const copyBuf = encodeEvenUtf8(copyright);

  const numEntries = 3;
  const dataOffsetStart = 8 + 2 + numEntries * 12 + 4;
  const tiffLen = dataOffsetStart + descBuf.length + artBuf.length + copyBuf.length;
  const tiff = Buffer.alloc(tiffLen);

  tiff.write("II", 0, "ascii");
  tiff.writeUInt16LE(42, 2);
  tiff.writeUInt32LE(8, 4);
  tiff.writeUInt16LE(numEntries, 8);

  let cursor = dataOffsetStart;
  const entries = [
    { tag: 0x010e, buf: descBuf },
    { tag: 0x013b, buf: artBuf },
    { tag: 0x8298, buf: copyBuf },
  ];

  entries.forEach((entry, idx) => {
    const pos = 10 + idx * 12;
    tiff.writeUInt16LE(entry.tag, pos);
    tiff.writeUInt16LE(2, pos + 2);
    tiff.writeUInt32LE(entry.buf.length, pos + 4);
    tiff.writeUInt32LE(cursor, pos + 8);
    entry.buf.copy(tiff, cursor);
    cursor += entry.buf.length;
  });

  tiff.writeUInt32LE(0, 10 + numEntries * 12);

  const payload = Buffer.concat([Buffer.from("Exif\0\0", "ascii"), tiff]);
  const seg = Buffer.alloc(4 + payload.length);
  seg[0] = 0xff;
  seg[1] = 0xe1;
  seg.writeUInt16BE(2 + payload.length, 2);
  payload.copy(seg, 4);
  return seg;
}

function escapeXml(value: string): string {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildXmpSegment(meta: JpegAuthorMetadata): Buffer {
  const keywordsXml = meta.keywords
    .map((k) => `<rdf:li>${escapeXml(k)}</rdf:li>`)
    .join("");
  const xmpXml = `<?xpacket begin="\uFEFF" id="W5M0MpCcehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/"
    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
    xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/"
    xmpRights:Marked="True"
    xmpRights:WebStatement="${escapeXml(meta.webUrl)}"
    photoshop:Credit="${escapeXml(meta.creator)}"
    photoshop:City="${escapeXml(meta.location)}"
    photoshop:Country="${escapeXml(meta.country)}"
    Iptc4xmpCore:Location="${escapeXml(meta.location)}">
   <dc:creator><rdf:Seq><rdf:li>${escapeXml(meta.creator)}</rdf:li></rdf:Seq></dc:creator>
   <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${escapeXml(meta.title)}</rdf:li></rdf:Alt></dc:title>
   <dc:description><rdf:Alt><rdf:li xml:lang="x-default">${escapeXml(meta.description)}</rdf:li></rdf:Alt></dc:description>
   <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${escapeXml(meta.copyright)}</rdf:li></rdf:Alt></dc:rights>
   <dc:subject><rdf:Bag>${keywordsXml}</rdf:Bag></dc:subject>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;

  const payload = Buffer.concat([
    Buffer.from("http://ns.adobe.com/xap/1.0/\0", "ascii"),
    Buffer.from(xmpXml, "utf8"),
  ]);
  const seg = Buffer.alloc(4 + payload.length);
  seg[0] = 0xff;
  seg[1] = 0xe1;
  seg.writeUInt16BE(2 + payload.length, 2);
  payload.copy(seg, 4);
  return seg;
}

/**
 * Inyecta segmentos EXIF e XMP/IPTC de autoría, copyright y URL sin recompresión en un JPEG.
 */
export function injectLosslessJpegMetadata(
  jpegBuf: Buffer,
  meta: JpegAuthorMetadata
): Buffer {
  if (jpegBuf.length < 4 || jpegBuf[0] !== 0xff || jpegBuf[1] !== 0xd8) {
    return jpegBuf;
  }

  const kept: Buffer[] = [jpegBuf.subarray(0, 2)];
  let pos = 2;
  while (pos < jpegBuf.length) {
    if (jpegBuf[pos] !== 0xff) break;
    const marker = jpegBuf[pos + 1];
    if (marker === 0xda || marker === 0xd9) {
      kept.push(jpegBuf.subarray(pos));
      break;
    }
    if (pos + 4 > jpegBuf.length) break;
    const segLen = jpegBuf.readUInt16BE(pos + 2);
    const segEnd = pos + 2 + segLen;
    if (segEnd > jpegBuf.length) break;

    let drop = false;
    if (marker === 0xe1) {
      const hdr = jpegBuf.subarray(pos + 4, Math.min(segEnd, pos + 36)).toString("ascii");
      if (hdr.startsWith("Exif\0\0") || hdr.startsWith("http://ns.adobe.com/xap/1.0/\0")) {
        drop = true;
      }
    }
    if (!drop) kept.push(jpegBuf.subarray(pos, segEnd));
    pos = segEnd;
  }

  const exifSeg = buildExifSegment(meta);
  const xmpSeg = buildXmpSegment(meta);
  return Buffer.concat([kept[0], exifSeg, xmpSeg, ...kept.slice(1)]);
}

/**
 * Aplica metadatos de autor y licencia a una imagen base64 de una obra si es JPEG válido.
 */
export function embedAuthorMetadataInBase64Jpeg(
  cleanBase64: string,
  photo: Photo
): string {
  try {
    const rawBuf = Buffer.from(cleanBase64, "base64");
    const loc = photo.location
      ? `${photo.location}${photo.country && !photo.location.includes(photo.country) ? `, ${photo.country}` : ""}`
      : "Tenerife, España";
    const stamped = injectLosslessJpegMetadata(rawBuf, {
      artist: SITE_CONFIG.authorName,
      creator: SITE_CONFIG.authorName,
      copyright: `© ${photo.year} ${SITE_CONFIG.authorName}. Todos los derechos reservados · ${SITE_CONFIG.siteUrl}/portfolio/${photo.slug}`,
      title: photo.title,
      description: `${photo.title} — ${photo.description} (${loc}) · Fotografía de ${SITE_CONFIG.authorName}`,
      webUrl: `${SITE_CONFIG.siteUrl}/portfolio/${photo.slug}`,
      location: photo.location || "Tenerife",
      country: photo.country || "España",
      keywords: Array.from(
        new Set([...(photo.keywords || []), "Javier Espinosa Martínez", "Fotografía en Tenerife"])
      ),
    });
    return stamped.toString("base64");
  } catch {
    return cleanBase64;
  }
}
