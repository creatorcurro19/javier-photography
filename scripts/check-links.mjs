#!/usr/bin/env node
/**
 * Comprueba la integridad de enlaces internos y rutas de imágenes en el repositorio.
 * Uso estático: node scripts/check-links.mjs
 * Uso con servidor levantado: node scripts/check-links.mjs --url=http://127.0.0.1:3000
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BASE_URL_ARG = process.argv.find((a) => a.startsWith("--url="));
const LIVE_URL = BASE_URL_ARG ? BASE_URL_ARG.slice("--url=".length).replace(/\/$/, "") : null;

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (/\.(ts|tsx|mjs)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

// 1. Recolectar rutas reales de app/
const appPages = new Set(["/"]);
for (const file of walk(path.join(ROOT, "app"))) {
  if (path.basename(file) === "page.tsx") {
    const relDir = path.relative(path.join(ROOT, "app"), path.dirname(file));
    const route = relDir === "" ? "/" : `/${relDir.replace(/\\/g, "/")}`;
    appPages.add(route);
  }
}

// 2. Recolectar slugs y rutas de imágenes desde data/works.ts y data/service-landings.ts
const worksSrc = fs.readFileSync(path.join(ROOT, "data/works.ts"), "utf8");
const seriesStart = worksSrc.indexOf("= [", worksSrc.indexOf("export const SERIES")) + 2;
const seriesEnd = worksSrc.indexOf("];", seriesStart) + 1;
const seriesList = JSON.parse(worksSrc.slice(seriesStart, seriesEnd));

const worksStart = worksSrc.indexOf("= [", worksSrc.indexOf("export const WORKS")) + 2;
const worksEnd = worksSrc.lastIndexOf("];") + 1;
const worksList = JSON.parse(worksSrc.slice(worksStart, worksEnd));

const nextCfgSrc = fs.readFileSync(path.join(ROOT, "next.config.ts"), "utf8");
const redirects = new Set();
for (const m of nextCfgSrc.matchAll(/"source":\s*"(\/[^"]+)"/g)) {
  redirects.add(m[1]);
}

const landingsSrc = fs.readFileSync(path.join(ROOT, "data/service-landings.ts"), "utf8");
const serviceSlugs = new Set([...landingsSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]));

const configSrc = fs.readFileSync(path.join(ROOT, "data/site-config.ts"), "utf8");
const cuadernoStart = configSrc.indexOf("= [", configSrc.indexOf("export const CUADERNO_POSTS")) + 2;
const cuadernoEnd = configSrc.indexOf("];", cuadernoStart) + 1;
const cuadernoPosts = JSON.parse(configSrc.slice(cuadernoStart, cuadernoEnd));

const categories = new Set([
  "fauna-naturaleza",
  "paisajes-documental",
  "coches-rally",
  "arquitectura-urbana",
  "viajes-cultura",
]);
const workSlugs = new Set(worksList.map((w) => w.slug));
const seriesSlugs = new Set(seriesList.map((s) => s.slug));
const cuadernoSlugs = new Set(cuadernoPosts.map((c) => c.slug));

const errors = [];

// 3. Verificar que cada imagen referenciada exista en public/
for (const w of worksList) {
  const imgFile = path.join(ROOT, "public", w.image);
  if (!fs.existsSync(imgFile)) {
    errors.push(`Imagen ausente en public: ${w.image} (obra ${w.slug})`);
  }
}
for (const s of seriesList) {
  const imgFile = path.join(ROOT, "public", s.coverImage);
  if (!fs.existsSync(imgFile)) {
    errors.push(`Portada de serie ausente: ${s.coverImage} (serie ${s.slug})`);
  }
}

// 4. Comprobar href="/..." estáticos en app/, components/ y data/
function isValidInternalPath(rawPath) {
  const cleanPath = rawPath.split("#")[0].split("?")[0];
  if (!cleanPath || cleanPath === "/") return true;
  if (appPages.has(cleanPath)) return true;
  if (redirects.has(cleanPath)) return true;
  if (fs.existsSync(path.join(ROOT, "public", cleanPath))) return true;
  if (cleanPath.startsWith("/api/")) return true;

  if (cleanPath.startsWith("/portfolio/")) {
    const slug = cleanPath.slice("/portfolio/".length);
    return categories.has(slug) || workSlugs.has(slug);
  }
  if (cleanPath.startsWith("/projects/")) {
    const slug = cleanPath.slice("/projects/".length);
    return seriesSlugs.has(slug);
  }
  if (cleanPath.startsWith("/servicios/")) {
    const slug = cleanPath.slice("/servicios/".length);
    return serviceSlugs.has(slug);
  }
  if (cleanPath.startsWith("/cuaderno/")) {
    const slug = cleanPath.slice("/cuaderno/".length);
    return cuadernoSlugs.has(slug);
  }
  return false;
}

const staticLinks = new Set();
for (const dir of ["app", "components", "data"]) {
  for (const file of walk(path.join(ROOT, dir))) {
    const text = fs.readFileSync(file, "utf8");
    const lines = text.split("\n");
    lines.forEach((line, idx) => {
      for (const m of line.matchAll(/href=["'](\/[^"']*)["']/g)) {
        const href = m[1];
        if (href.startsWith("//")) continue;
        staticLinks.add(href.split("#")[0].split("?")[0] || "/");
        if (!isValidInternalPath(href)) {
          errors.push(`Enlace roto (${path.relative(ROOT, file)}:${idx + 1}): ${href}`);
        }
      }
    });
  }
}

if (errors.length > 0) {
  console.error("\n✗ Errores de enlaces o recursos:\n");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`✓ Validación estática de enlaces OK (${staticLinks.size} rutas comprobadas, ${worksList.length} imágenes verificadas).`);

if (LIVE_URL) {
  const toFetch = new Set([
    ...appPages,
    "/projects/la-gomera",
    "/stories",
    ...[...categories].map((c) => `/portfolio/${c}`),
    ...[...seriesSlugs].map((s) => `/projects/${s}`),
    ...[...serviceSlugs].map((s) => `/servicios/${s}`),
    ...worksList.slice(0, 10).map((w) => `/portfolio/${w.slug}`),
  ]);
  // Omitir rutas dinámicas sin parámetro concreto
  const concrete = [...toFetch].filter((p) => !p.includes("["));
  const liveFailures = [];
  for (const route of concrete) {
    try {
      const res = await fetch(`${LIVE_URL}${route}`, { redirect: "follow" });
      if (res.status >= 400) {
        liveFailures.push(`${res.status} ${route}`);
      }
    } catch (err) {
      liveFailures.push(`ERR ${route}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  if (liveFailures.length > 0) {
    console.error("\n✗ Fallos HTTP en rutas:\n", liveFailures.join("\n"));
    process.exit(1);
  }
  console.log(`✓ Comprobación HTTP en vivo OK (${concrete.length} rutas sin 404/500).`);
}
