#!/usr/bin/env node
/**
 * Importador automático de fotografías con extracción EXIF y optimización Web.
 *
 * Uso:
 *   npm run photos:import -- [carpeta] --category <categoria> [--dry-run] [--featured] [--prints]
 *
 * Categorías válidas:
 *   - fauna-naturaleza
 *   - paisajes-documental
 *   - coches-rally
 *   - arquitectura-urbana
 *   - viajes-cultura
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import exifr from "exifr";

const CATEGORY_PREFIX = {
  "fauna-naturaleza": "fn",
  "paisajes-documental": "pd",
  "coches-rally": "cr",
  "arquitectura-urbana": "au",
  "viajes-cultura": "vc",
};

const VALID_CATEGORIES = Object.keys(CATEGORY_PREFIX);
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);
const MAX_LONG_EDGE = 2200;

function parseArgs(argv) {
  const args = {
    folder: "photos-inbox",
    category: "",
    dryRun: false,
    featured: false,
    prints: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--featured") {
      args.featured = true;
    } else if (arg === "--prints") {
      args.prints = true;
    } else if (arg === "--category" || arg === "-c") {
      args.category = argv[++i] || "";
    } else if (arg.startsWith("--category=")) {
      args.category = arg.split("=")[1] || "";
    } else if (!arg.startsWith("-")) {
      args.folder = arg;
    }
  }
  return args;
}

function slugify(input) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleFromFilename(baseName) {
  const cleaned = baseName
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "Obra sin título";
  return cleaned
    .split(" ")
    .map((word, idx) => {
      const lower = word.toLowerCase();
      if (idx > 0 && ["de", "del", "la", "el", "en", "y", "a", "al", "sobre", "con", "por"].includes(lower)) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function normalizeCamera(rawModel) {
  if (!rawModel) return "Canon EOS R7";
  const m = String(rawModel).trim();
  if (/R7/i.test(m)) return "Canon EOS R7";
  if (/750D/i.test(m)) return "Canon EOS 750D";
  return m.startsWith("Canon") ? m : m;
}

function normalizeLens(rawLens, focalNum) {
  const l = String(rawLens || "").trim();
  if (/150-600/i.test(l) || (focalNum && focalNum > 150)) {
    return "Sigma 150-600mm f/5-6.3 DG OS HSM Contemporary";
  }
  if (/10-18/i.test(l) || (focalNum && focalNum < 18)) {
    return "Canon EF-S 10-18mm f/4.5-5.6 IS STM";
  }
  if (/18-150/i.test(l)) {
    return "Canon RF-S 18-150mm f/3.5-6.3 IS STM";
  }
  return l || "Canon RF-S 18-150mm f/3.5-6.3 IS STM";
}

function formatShutter(exposureTime) {
  const n = Number(exposureTime);
  if (!Number.isFinite(n) || n <= 0) return "1/500s";
  if (n >= 1) return `${Math.round(n * 10) / 10}s`;
  return `1/${Math.round(1 / n)}s`;
}

function formatAperture(fNumber) {
  const n = Number(fNumber);
  if (!Number.isFinite(n) || n <= 0) return "f/5.6";
  const rounded = Math.round(n * 10) / 10;
  return `f/${rounded}`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!VALID_CATEGORIES.includes(args.category)) {
    console.error(
      `\n✗ Debes indicar una categoría válida con --category <categoria>.\n` +
        `  Categorías disponibles: ${VALID_CATEGORIES.join(", ")}\n` +
        `  Ejemplo: npm run photos:import -- photos-inbox --category coches-rally\n`
    );
    process.exit(1);
  }

  const rootDir = process.cwd();
  const inboxDir = path.resolve(rootDir, args.folder);
  const photosTsPath = path.join(rootDir, "data", "photos.ts");

  if (!fs.existsSync(inboxDir)) {
    console.error(`\n✗ No existe la carpeta de entrada: ${inboxDir}`);
    console.error(`  Créala y coloca dentro tus archivos JPG/TIFF antes de ejecutar el comando.\n`);
    process.exit(1);
  }

  const photosSource = fs.readFileSync(photosTsPath, "utf8");
  const prefix = CATEGORY_PREFIX[args.category];

  // Detectar IDs y slugs existentes
  const existingSlugs = new Set(
    [...photosSource.matchAll(/"slug":\s*"([^"]+)"/g)].map((m) => m[1])
  );
  const existingIdsForCategory = [
    ...photosSource.matchAll(new RegExp(`"id":\\s*"${prefix}-(\\d+)"`, "g")),
  ].map((m) => Number(m[1]));

  let nextIdNum =
    existingIdsForCategory.length > 0 ? Math.max(...existingIdsForCategory) + 1 : 1;

  // Metadatos opcionales en meta.json dentro de la carpeta
  const globalMetaPath = path.join(inboxDir, "meta.json");
  const globalMeta = fs.existsSync(globalMetaPath)
    ? JSON.parse(fs.readFileSync(globalMetaPath, "utf8"))
    : {};

  const files = fs
    .readdirSync(inboxDir)
    .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    console.log(`\n○ No se encontraron imágenes en ${inboxDir}.\n`);
    process.exit(0);
  }

  console.log(`\n==============================================================`);
  console.log(` Importador de Archivo · Javier Espinosa Photography`);
  console.log(`==============================================================`);
  console.log(`Carpeta origen : ${inboxDir}`);
  console.log(`Categoría      : ${args.category} (prefijo ${prefix}-XX)`);
  console.log(`Modo           : ${args.dryRun ? "SIMULACIÓN (--dry-run)" : "ESCRITURA REAL"}`);
  console.log(`Imágenes       : ${files.length}\n`);

  const outDir = path.join(rootDir, "public", "images", "portfolio", args.category);
  if (!args.dryRun) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const newEntries = [];

  for (const file of files) {
    const fullPath = path.join(inboxDir, file);
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);

    // Sidecar individual <archivo>.json o entrada en meta.json
    const sidecarPath = path.join(inboxDir, `${baseName}.json`);
    const sidecar = fs.existsSync(sidecarPath)
      ? JSON.parse(fs.readFileSync(sidecarPath, "utf8"))
      : globalMeta[file] || globalMeta[baseName] || {};

    const title = sidecar.title ? String(sidecar.title).trim() : titleFromFilename(baseName);
    const baseSlug = slugify(sidecar.slug || title || baseName);

    if (!baseSlug) {
      console.warn(`⚠ Omitiendo "${file}": no se pudo generar un slug válido.`);
      continue;
    }

    if (existingSlugs.has(baseSlug)) {
      console.warn(`⚠ Omitiendo "${file}": el slug "${baseSlug}" ya existe en data/photos.ts.`);
      continue;
    }
    existingSlugs.add(baseSlug);

    // Lectura EXIF real
    const exif = (await exifr.parse(fullPath, { gps: true }).catch(() => null)) || {};
    const focalNum = Number(exif.FocalLength);
    const camera = sidecar.camera || normalizeCamera(exif.Model);
    const lens = sidecar.lens || normalizeLens(exif.LensModel || exif.Lens, focalNum);
    const iso = Number(sidecar.iso || exif.ISO || 400);
    const aperture = sidecar.aperture || formatAperture(exif.FNumber);
    const shutter = sidecar.shutter || formatShutter(exif.ExposureTime);
    const focalLength =
      sidecar.focalLength || (Number.isFinite(focalNum) && focalNum > 0 ? `${Math.round(focalNum)}mm` : "50mm");

    const dateObj = exif.DateTimeOriginal || exif.CreateDate;
    const year =
      Number(sidecar.year) ||
      (dateObj instanceof Date && !Number.isNaN(dateObj.getFullYear())
        ? dateObj.getFullYear()
        : new Date().getFullYear());

    // Procesar con sharp para calcular dimensiones reales tras redimensionar a máx 2200px
    const pipeline = sharp(fullPath)
      .rotate()
      .resize({
        width: MAX_LONG_EDGE,
        height: MAX_LONG_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85, mozjpeg: true });

    const { data: jpegBuffer, info } = await pipeline.toBuffer({ resolveWithObject: true });
    const outFile = path.join(outDir, `${baseSlug}.jpg`);

    if (!args.dryRun) {
      fs.writeFileSync(outFile, jpegBuffer);
    }

    const id = `${prefix}-${String(nextIdNum).padStart(2, "0")}`;
    nextIdNum++;

    const description =
      sidecar.description ||
      `Fotografía de autor (${title}) capturada con ${camera} y óptica ${lens} a ${focalLength}.`;

    const alt = sidecar.alt || `${title}: ${description.replace(/\.$/, "")}`;

    const entry = {
      id,
      slug: baseSlug,
      title,
      category: args.category,
      image: `/images/portfolio/${args.category}/${baseSlug}.jpg`,
      width: info.width,
      height: info.height,
      alt,
      ...(sidecar.location ? { location: String(sidecar.location) } : {}),
      ...(sidecar.country ? { country: String(sidecar.country) } : {}),
      ...(Number.isFinite(exif.latitude) && Number.isFinite(exif.longitude)
        ? {
            coordinates: {
              lat: Number(exif.latitude.toFixed(5)),
              lng: Number(exif.longitude.toFixed(5)),
            },
          }
        : {}),
      camera,
      lens,
      iso,
      aperture,
      shutter,
      focalLength,
      description,
      ...(sidecar.story ? { story: String(sidecar.story) } : {}),
      year,
      featured: Boolean(sidecar.featured ?? args.featured),
      prints: Boolean(sidecar.prints ?? args.prints),
      licensing: sidecar.licensing ?? true,
      keywords: Array.isArray(sidecar.keywords)
        ? sidecar.keywords
        : [args.category, "autor", camera.toLowerCase(), focalLength],
    };

    newEntries.push(entry);
    console.log(
      `✓ [${entry.id}] ${entry.title} (${entry.width}×${entry.height}) · ${entry.camera} · ${entry.focalLength} ${entry.aperture} ${entry.shutter} ISO ${entry.iso}`
    );
  }

  if (newEntries.length === 0) {
    console.log(`\n○ No hay obras nuevas que añadir.\n`);
    return;
  }

  const serializedEntries = newEntries
    .map((e) =>
      JSON.stringify(e, null, 2)
        .split("\n")
        .map((line) => `  ${line}`)
        .join("\n")
    )
    .join(",\n");

  if (args.dryRun) {
    console.log(`\n--- Vista previa JSON (--dry-run, no se ha modificado data/photos.ts) ---\n`);
    console.log(serializedEntries);
    console.log(`\nSimulación completada (${newEntries.length} obra(s)).\n`);
    return;
  }

  const closingIndex = photosSource.lastIndexOf("];");
  if (closingIndex === -1) {
    throw new Error("No se encontró el cierre '];' en data/photos.ts");
  }

  const beforeClosing = photosSource.slice(0, closingIndex).trimEnd();
  const updatedSource = `${beforeClosing},\n${serializedEntries}\n];\n`;

  fs.writeFileSync(photosTsPath, updatedSource, "utf8");
  console.log(`\n✓ Se han añadido ${newEntries.length} obra(s) a data/photos.ts y public/images/portfolio/${args.category}/.\n`);
}

main().catch((err) => {
  console.error("\n✗ Error importando fotografías:", err);
  process.exit(1);
});
