import "server-only";
import fs from "fs";
import path from "path";
import { WORKS, SERIES } from "@/data/works";
import {
  SITE_SETTINGS,
  CUADERNO_POSTS,
  type SiteSettings,
  type CuadernoPost,
} from "@/data/site-config";
import {
  CATEGORY_COLOR_LABEL,
  CATEGORY_METADATA,
  PHOTO_CATEGORIES,
  type Photo,
  type PhotoCategory,
  type Project,
} from "@/types/photo";

const DEFAULT_HERO_SLUGS = [
  "ocaso-sobre-el-erg",
  "mirada-del-lince-boreal",
  "cumbre-nevada-al-alba",
  "cruzada-sobre-el-asfalto",
  "el-oficio-y-la-chispa",
];

function initWorks(): Photo[] {
  const list: Photo[] = WORKS.map((w) => ({ ...w }));
  // Inicializar heroOrder (1..5) si ninguna foto lo tiene asignado aún
  if (!list.some((w) => typeof w.heroOrder === "number")) {
    DEFAULT_HERO_SLUGS.forEach((slug, idx) => {
      const found = list.find((w) => w.slug === slug);
      if (found) found.heroOrder = idx + 1;
    });
  }
  // Inicializar categoryCover si ninguna foto de la categoría lo tiene asignado aún
  for (const cat of PHOTO_CATEGORIES) {
    if (!list.some((w) => w.category === cat && w.categoryCover)) {
      const defaultCoverImg = CATEGORY_METADATA[cat]?.coverImage;
      const found =
        list.find((w) => w.category === cat && w.image === defaultCoverImg) ??
        list.find((w) => w.category === cat);
      if (found) found.categoryCover = true;
    }
  }

  // Inicializar colorLabel y rating curatorial
  for (const w of list) {
    if (!w.colorLabel) {
      w.colorLabel = CATEGORY_COLOR_LABEL[w.category] || "green";
    }
    if (typeof w.rating !== "number") {
      const isHero = DEFAULT_HERO_SLUGS.includes(w.slug);
      const isCategoryCover = Boolean(w.categoryCover);
      const isFeatured = Boolean(w.featured);
      const hasStory = Boolean(w.story && w.story.trim().length > 25);
      if (isHero || isCategoryCover) {
        w.rating = 5;
      } else if (isFeatured || hasStory || Boolean(w.series)) {
        w.rating = 4;
      } else {
        w.rating = 3;
      }
    }
  }

  return list;
}

// Copia en memoria para reflejar los cambios inmediatamente en el runtime del servidor
const inMemoryWorks: Photo[] = initWorks();
const inMemorySeries: Project[] = SERIES.map((s) => ({
  ...s,
  statement: [...s.statement],
  photoIds: [...s.photoIds],
}));
let inMemorySiteSettings: SiteSettings = { ...SITE_SETTINGS };
const inMemoryCuadernoPosts: CuadernoPost[] = CUADERNO_POSTS.map((p) => ({
  ...p,
  body: [...p.body],
  cta: { ...p.cta },
}));

export function getCurrentWorks(): Photo[] {
  return inMemoryWorks;
}

export function getCurrentSeries(): Project[] {
  return inMemorySeries;
}

export function getCurrentSiteSettings(): SiteSettings {
  return inMemorySiteSettings;
}

export function getCurrentCuadernoPosts(): CuadernoPost[] {
  return inMemoryCuadernoPosts;
}

const FILE_HEADER = `import type { Photo, Project } from "@/types/photo";

/**
 * ÚNICA FUENTE DE VERDAD DEL ARCHIVO FOTOGRÁFICO (/data/works.ts)
 * Contiene las obras verificadas y las 8 series monográficas.
 * Todas las páginas, componentes, sitemaps, schemas JSON-LD y validadores de pedido leen de este módulo.
 */
`;

/**
 * Genera el contenido completo del archivo data/works.ts (series + obras) como TypeScript válido.
 */
export function generateWorksTsSource(
  worksToSerialize: Photo[] = inMemoryWorks,
  seriesToSerialize: Project[] = inMemorySeries
): string {
  return `${FILE_HEADER}
export const SERIES: Project[] = ${JSON.stringify(seriesToSerialize, null, 2)};

export const WORKS: Photo[] = ${JSON.stringify(worksToSerialize, null, 2)};

export const photos: Photo[] = WORKS;
export const PROJECTS: Project[] = SERIES;
`;
}

/**
 * Elimina campos que no corresponden a la categoría de la obra
 * (p. ej. condición de fauna en una foto de arquitectura).
 */
export function sanitizePhotoForCategory(photo: Photo): Photo {
  const clean: Photo = { ...photo };
  if (clean.category !== "fauna-naturaleza") {
    delete clean.wildlifeCondition;
    delete clean.realLocation;
  }
  if (!clean.heroOrder || clean.heroOrder < 1 || clean.heroOrder > 5) {
    delete clean.heroOrder;
  }
  if (!clean.categoryCover) {
    delete clean.categoryCover;
  }
  (["story", "location", "country", "maxFormatReason", "exifWarning"] as const).forEach((key) => {
    if (typeof clean[key] === "string" && (clean[key] as string).trim() === "") {
      delete clean[key];
    }
  });
  return clean;
}

/**
 * Aplica reglas de exclusividad para Carrusel Hero (1..5), Portada de Categoría y Portada de Serie.
 */
function applyPlacementExclusivity(photo: Photo, seriesCoverSlugs?: string[]): void {
  if (photo.heroOrder && photo.heroOrder >= 1 && photo.heroOrder <= 5) {
    for (const w of inMemoryWorks) {
      if (w.id !== photo.id && w.heroOrder === photo.heroOrder) {
        delete w.heroOrder;
      }
    }
  }
  if (photo.categoryCover) {
    for (const w of inMemoryWorks) {
      if (w.id !== photo.id && w.category === photo.category && w.categoryCover) {
        delete w.categoryCover;
      }
    }
  }
  if (Array.isArray(seriesCoverSlugs)) {
    for (const series of inMemorySeries) {
      if (seriesCoverSlugs.includes(series.slug)) {
        series.coverImage = photo.image;
      }
    }
  }
}

/**
 * Sincroniza la pertenencia de la obra a las series monográficas.
 */
function applySeriesMembership(photo: Photo, seriesSlugs: string[] | undefined): Photo {
  if (!seriesSlugs) return photo;

  const valid = new Set(inMemorySeries.map((s) => s.slug));
  const wanted = seriesSlugs.filter((slug) => valid.has(slug));

  for (const series of inMemorySeries) {
    const isMember = series.photoIds.includes(photo.id);
    const shouldBe = wanted.includes(series.slug);
    if (shouldBe && !isMember) series.photoIds.push(photo.id);
    if (!shouldBe && isMember) series.photoIds = series.photoIds.filter((id) => id !== photo.id);
  }

  const updated: Photo = { ...photo };
  const primary = inMemorySeries.find((s) => s.slug === wanted[0]);
  if (primary) {
    updated.series = primary.title;
    updated.seriesSlug = primary.slug;
  } else {
    delete updated.series;
    delete updated.seriesSlug;
  }
  return updated;
}

/**
 * Sincroniza los campos series / seriesSlug de todas las fotos a partir de inMemorySeries.
 */
function syncAllPhotosSeriesTags(): void {
  for (const work of inMemoryWorks) {
    const matching = inMemorySeries.find((s) => s.photoIds.includes(work.id));
    if (matching) {
      work.series = matching.title;
      work.seriesSlug = matching.slug;
    } else {
      delete work.series;
      delete work.seriesSlug;
    }
  }
}

/**
 * Asegura que todas las series tengan como coverImage una foto existente en el catálogo.
 */
function ensureValidSeriesCovers(): void {
  const validImages = new Set(inMemoryWorks.map((w) => w.image));
  for (const series of inMemorySeries) {
    series.photoIds = series.photoIds.filter((id) =>
      inMemoryWorks.some((w) => w.id === id)
    );
    if (!validImages.has(series.coverImage)) {
      const firstSeriesPhoto = series.photoIds
        .map((id) => inMemoryWorks.find((w) => w.id === id))
        .find((w): w is Photo => Boolean(w));
      const fallbackCategoryPhoto = inMemoryWorks.find(
        (w) => w.category === series.category
      );
      const replacement =
        firstSeriesPhoto ?? fallbackCategoryPhoto ?? inMemoryWorks[0];
      if (replacement) {
        series.coverImage = replacement.image;
      }
    }
  }
}

export interface GithubFileEntry {
  path: string;
  content: string;
  encoding: "utf-8" | "base64";
}

/**
 * Realiza un commit atómico (uno o varios archivos a la vez) en la rama main de GitHub.
 */
export async function commitFilesToGithub(
  commitMessage: string,
  files: GithubFileEntry[],
  customGithubToken?: string
): Promise<{ ok: boolean; commitUrl?: string }> {
  const githubToken = customGithubToken?.trim() || process.env.GITHUB_TOKEN?.trim();
  if (!githubToken) return { ok: false };

  const repoOwner = process.env.GITHUB_REPO_OWNER || "creatorcurro19";
  const repoName = process.env.GITHUB_REPO_NAME || "javier-photography";
  const baseApi = `https://api.github.com/repos/${repoOwner}/${repoName}`;
  const headers = {
    Authorization: `Bearer ${githubToken}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "JavierEspinosa-AdminPanel",
  };

  try {
    const refRes = await fetch(`${baseApi}/git/ref/heads/main`, {
      headers,
      cache: "no-store",
    });
    if (!refRes.ok) {
      console.error("[works-updater] No se pudo obtener ref/heads/main:", await refRes.text());
      return { ok: false };
    }
    const refData = await refRes.json();
    const latestCommitSha: string = refData.object.sha;

    const commitRes = await fetch(`${baseApi}/git/commits/${latestCommitSha}`, {
      headers,
      cache: "no-store",
    });
    if (!commitRes.ok) {
      console.error("[works-updater] No se pudo obtener el commit base:", await commitRes.text());
      return { ok: false };
    }
    const commitData = await commitRes.json();
    const baseTreeSha: string = commitData.tree.sha;

    const treeEntries: { path: string; mode: "100644"; type: "blob"; sha: string }[] = [];
    for (const file of files) {
      const blobRes = await fetch(`${baseApi}/git/blobs`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          content: file.content,
          encoding: file.encoding,
        }),
      });
      if (!blobRes.ok) {
        console.error(`[works-updater] Error creando blob para ${file.path}:`, await blobRes.text());
        return { ok: false };
      }
      const blobData = await blobRes.json();
      treeEntries.push({
        path: file.path,
        mode: "100644",
        type: "blob",
        sha: blobData.sha,
      });
    }

    const newTreeRes = await fetch(`${baseApi}/git/trees`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeEntries,
      }),
    });
    if (!newTreeRes.ok) {
      console.error("[works-updater] Error creando git tree:", await newTreeRes.text());
      return { ok: false };
    }
    const newTreeData = await newTreeRes.json();

    const newCommitRes = await fetch(`${baseApi}/git/commits`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message: commitMessage,
        tree: newTreeData.sha,
        parents: [latestCommitSha],
        author: {
          name: "Javier Espinosa",
          email: "javierespinosa1995@hotmail.com",
        },
      }),
    });
    if (!newCommitRes.ok) {
      console.error("[works-updater] Error creando git commit:", await newCommitRes.text());
      return { ok: false };
    }
    const newCommitData = await newCommitRes.json();

    const updateRefRes = await fetch(`${baseApi}/git/refs/heads/main`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        sha: newCommitData.sha,
      }),
    });
    if (!updateRefRes.ok) {
      console.error("[works-updater] Error actualizando ref/heads/main:", await updateRefRes.text());
      return { ok: false };
    }

    return { ok: true, commitUrl: newCommitData.html_url };
  } catch (err) {
    console.error("[works-updater] Excepción en commitFilesToGithub:", err);
    return { ok: false };
  }
}

function writeWorksToLocalDisk(fullSource: string): { ok: boolean; error?: string } {
  if (process.env.VERCEL === "1") return { ok: false };
  try {
    const filePath = path.join(process.cwd(), "data", "works.ts");
    fs.writeFileSync(filePath, fullSource, "utf8");
    return { ok: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[works-updater] No se pudo guardar en disco:", msg);
    return { ok: false, error: msg };
  }
}

export interface SaveResult {
  ok: boolean;
  persistedToDisk: boolean;
  persistedToGit: boolean;
  message: string;
  photo: Photo;
  gitCommitUrl?: string;
  error?: string;
}

/**
 * Crea o actualiza una fotografía (con subida opcional de archivo de imagen)
 * en memoria, en disco local y en GitHub.
 */
export async function saveWork(
  incomingPhoto: Photo,
  seriesSlugs?: string[],
  customGithubToken?: string,
  imageBase64?: string,
  seriesCoverSlugs?: string[]
): Promise<SaveResult> {
  let updatedPhoto = sanitizePhotoForCategory(incomingPhoto);

  let cleanBase64: string | undefined;
  let repoImagePath: string | undefined;
  if (imageBase64 && imageBase64.trim().length > 0) {
    cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "").trim();
    const safeSlug = updatedPhoto.slug.replace(/[^a-z0-9-]/gi, "-").toLowerCase() || updatedPhoto.id;
    updatedPhoto = {
      ...updatedPhoto,
      slug: safeSlug,
      image: `/images/portfolio/${updatedPhoto.category}/${safeSlug}.jpg`,
    };
    repoImagePath = `public/images/portfolio/${updatedPhoto.category}/${safeSlug}.jpg`;
  }

  updatedPhoto = applySeriesMembership(updatedPhoto, seriesSlugs);
  applyPlacementExclusivity(updatedPhoto, seriesCoverSlugs);

  const index = inMemoryWorks.findIndex((w) => w.id === updatedPhoto.id);
  const isNew = index === -1;
  if (isNew) {
    inMemoryWorks.unshift(updatedPhoto);
  } else {
    inMemoryWorks[index] = updatedPhoto;
  }
  ensureValidSeriesCovers();

  const fullSource = generateWorksTsSource();
  let persistedToDisk = false;
  let diskError: string | undefined;

  if (process.env.VERCEL !== "1") {
    try {
      if (cleanBase64) {
        const safeSlug = updatedPhoto.slug.replace(/[^a-z0-9-]/gi, "-").toLowerCase() || updatedPhoto.id;
        const absImgPath = path.join(
          process.cwd(),
          "public",
          "images",
          "portfolio",
          updatedPhoto.category,
          `${safeSlug}.jpg`
        );
        fs.mkdirSync(path.dirname(absImgPath), { recursive: true });
        fs.writeFileSync(absImgPath, Buffer.from(cleanBase64, "base64"));
      }
      const diskRes = writeWorksToLocalDisk(fullSource);
      persistedToDisk = diskRes.ok;
      diskError = diskRes.error;
    } catch (err: unknown) {
      diskError = err instanceof Error ? err.message : String(err);
    }
  }

  const filesToCommit: GithubFileEntry[] = [
    { path: "data/works.ts", content: fullSource, encoding: "utf-8" },
  ];
  if (cleanBase64 && repoImagePath) {
    filesToCommit.push({
      path: repoImagePath,
      content: cleanBase64,
      encoding: "base64",
    });
  }

  const commitVerb = isNew ? "nueva obra" : "actualización de obra";
  const gitResult = await commitFilesToGithub(
    `Editorial: ${commitVerb} "${updatedPhoto.title}" [${updatedPhoto.id}]`,
    filesToCommit,
    customGithubToken
  );

  let message: string;
  if (gitResult.ok) {
    message = isNew
      ? `Nueva fotografía "${updatedPhoto.title}" añadida y publicada.`
      : `"${updatedPhoto.title}" guardada y publicada.`;
  } else if (persistedToDisk) {
    message = `"${updatedPhoto.title}" guardada en data/works.ts (entorno local).`;
  } else {
    message = `"${updatedPhoto.title}" NO se ha publicado en la web: falta conectar GitHub.`;
  }

  return {
    ok: true,
    persistedToDisk,
    persistedToGit: gitResult.ok,
    gitCommitUrl: gitResult.commitUrl,
    message,
    photo: updatedPhoto,
    error: diskError,
  };
}

/**
 * Subida en lote (#1): crea múltiples fotografías y sube todos sus archivos .jpg en un único commit atómico.
 */
export async function batchCreateWorks(
  items: { photo: Photo; imageBase64: string }[],
  seriesSlugs?: string[],
  customGithubToken?: string
): Promise<{
  ok: boolean;
  persistedToDisk: boolean;
  persistedToGit: boolean;
  message: string;
  createdPhotos: Photo[];
}> {
  const createdPhotos: Photo[] = [];
  const filesToCommit: GithubFileEntry[] = [];

  for (const item of items) {
    let cleanPhoto = sanitizePhotoForCategory(item.photo);
    const cleanBase64 = item.imageBase64.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "").trim();
    const safeSlug = cleanPhoto.slug.replace(/[^a-z0-9-]/gi, "-").toLowerCase() || cleanPhoto.id;
    cleanPhoto = {
      ...cleanPhoto,
      slug: safeSlug,
      image: `/images/portfolio/${cleanPhoto.category}/${safeSlug}.jpg`,
    };
    cleanPhoto = applySeriesMembership(cleanPhoto, seriesSlugs);
    inMemoryWorks.unshift(cleanPhoto);
    createdPhotos.push(cleanPhoto);

    filesToCommit.push({
      path: `public/images/portfolio/${cleanPhoto.category}/${safeSlug}.jpg`,
      content: cleanBase64,
      encoding: "base64",
    });

    if (process.env.VERCEL !== "1" && cleanBase64) {
      try {
        const absImgPath = path.join(
          process.cwd(),
          "public",
          "images",
          "portfolio",
          cleanPhoto.category,
          `${safeSlug}.jpg`
        );
        fs.mkdirSync(path.dirname(absImgPath), { recursive: true });
        fs.writeFileSync(absImgPath, Buffer.from(cleanBase64, "base64"));
      } catch {
        // ignore local write errors
      }
    }
  }

  ensureValidSeriesCovers();
  const fullSource = generateWorksTsSource();
  const diskRes = writeWorksToLocalDisk(fullSource);
  filesToCommit.push({ path: "data/works.ts", content: fullSource, encoding: "utf-8" });

  const gitResult = await commitFilesToGithub(
    `Editorial: subida en lote de ${createdPhotos.length} fotografías`,
    filesToCommit,
    customGithubToken
  );

  const message = gitResult.ok
    ? `${createdPhotos.length} fotografías añadidas al catálogo y publicadas.`
    : diskRes.ok
    ? `${createdPhotos.length} fotografías guardadas en entorno local.`
    : `${createdPhotos.length} fotografías añadidas solo en sesión.`;

  return {
    ok: true,
    persistedToDisk: diskRes.ok,
    persistedToGit: gitResult.ok,
    message,
    createdPhotos,
  };
}

/**
 * Ajuste de precios en bloque (#2): modifica los precios de todo el catálogo o de una categoría en un solo paso.
 */
export async function bulkUpdatePrices(
  params: {
    scope: "all" | PhotoCategory;
    mode: "set" | "delta";
    estudio?: number;
    galeria?: number;
    coleccion?: number;
    deltaAmount?: number;
    editionTotal?: number;
    prints?: boolean;
  },
  customGithubToken?: string
): Promise<{
  ok: boolean;
  persistedToDisk: boolean;
  persistedToGit: boolean;
  updatedCount: number;
  message: string;
}> {
  let updatedCount = 0;
  for (const w of inMemoryWorks) {
    if (params.scope !== "all" && w.category !== params.scope) continue;
    updatedCount += 1;

    const current = w.pricing ?? {
      estudio: 95,
      galeria: 175,
      coleccion: 290,
      dimensions: {
        estudio: "30 × 45 cm",
        galeria: "50 × 70 cm",
        coleccion: "70 × 100 cm",
      },
      paper: "Hahnemühle Photo Rag 308g (100% Algodón)",
      editionTotal: 25,
      score: 85,
    };

    if (params.mode === "set") {
      w.pricing = {
        ...current,
        estudio:
          typeof params.estudio === "number" && params.estudio >= 20
            ? Math.round(params.estudio)
            : current.estudio,
        galeria:
          typeof params.galeria === "number" && params.galeria >= 20
            ? Math.round(params.galeria)
            : current.galeria,
        coleccion:
          typeof params.coleccion === "number" && params.coleccion >= 20
            ? Math.round(params.coleccion)
            : current.coleccion,
        editionTotal:
          typeof params.editionTotal === "number" && params.editionTotal >= 1
            ? Math.round(params.editionTotal)
            : current.editionTotal,
      };
    } else if (params.mode === "delta" && typeof params.deltaAmount === "number") {
      const d = Math.round(params.deltaAmount);
      w.pricing = {
        ...current,
        estudio: Math.max(20, current.estudio + d),
        galeria: Math.max(30, current.galeria + d),
        coleccion: Math.max(50, current.coleccion + d),
      };
    }

    if (typeof params.prints === "boolean") {
      w.prints = params.prints;
    }
  }

  const fullSource = generateWorksTsSource();
  const diskRes = writeWorksToLocalDisk(fullSource);
  const scopeLabel =
    params.scope === "all"
      ? "todo el catálogo"
      : CATEGORY_METADATA[params.scope]?.title ?? params.scope;

  const gitResult = await commitFilesToGithub(
    `Editorial: actualización de precios en lote (${scopeLabel}, ${updatedCount} obras)`,
    [{ path: "data/works.ts", content: fullSource, encoding: "utf-8" }],
    customGithubToken
  );

  return {
    ok: true,
    persistedToDisk: diskRes.ok,
    persistedToGit: gitResult.ok,
    updatedCount,
    message: `Precios actualizados en ${updatedCount} obras (${scopeLabel}).`,
  };
}

/**
 * Edición de una Serie Monográfica (#4): actualiza textos, portada y orden de fotografías de una serie.
 */
export async function saveSeriesItem(
  incomingSeries: Project,
  customGithubToken?: string
): Promise<{
  ok: boolean;
  persistedToDisk: boolean;
  persistedToGit: boolean;
  seriesItem: Project;
  message: string;
}> {
  const idx = inMemorySeries.findIndex((s) => s.slug === incomingSeries.slug || s.id === incomingSeries.id);
  const cleanSeries: Project = {
    ...incomingSeries,
    statement: incomingSeries.statement.map((p) => p.trim()).filter((p) => p.length > 0),
    photoIds: incomingSeries.photoIds.filter((id) => inMemoryWorks.some((w) => w.id === id)),
  };

  if (idx === -1) {
    inMemorySeries.push(cleanSeries);
  } else {
    inMemorySeries[idx] = cleanSeries;
  }

  ensureValidSeriesCovers();
  syncAllPhotosSeriesTags();

  const fullSource = generateWorksTsSource();
  const diskRes = writeWorksToLocalDisk(fullSource);
  const gitResult = await commitFilesToGithub(
    `Editorial: actualización de serie "${cleanSeries.title}"`,
    [{ path: "data/works.ts", content: fullSource, encoding: "utf-8" }],
    customGithubToken
  );

  return {
    ok: true,
    persistedToDisk: diskRes.ok,
    persistedToGit: gitResult.ok,
    seriesItem: cleanSeries,
    message: `Serie "${cleanSeries.title}" actualizada y publicada.`,
  };
}

/**
 * Eliminación de una Serie Monográfica (#1): elimina la serie sin borrar las fotografías del catálogo general.
 */
export async function deleteSeriesItem(
  seriesSlug: string,
  customGithubToken?: string
): Promise<{
  ok: boolean;
  persistedToDisk: boolean;
  persistedToGit: boolean;
  deletedSlug: string;
  message: string;
}> {
  const idx = inMemorySeries.findIndex(
    (s) => s.slug === seriesSlug || s.id === seriesSlug
  );
  if (idx === -1) {
    return {
      ok: false,
      persistedToDisk: false,
      persistedToGit: false,
      deletedSlug: seriesSlug,
      message: "La serie ya no existe.",
    };
  }
  const [removed] = inMemorySeries.splice(idx, 1);
  syncAllPhotosSeriesTags();

  const fullSource = generateWorksTsSource();
  const diskRes = writeWorksToLocalDisk(fullSource);
  const gitResult = await commitFilesToGithub(
    `Editorial: eliminación de serie "${removed.title}"`,
    [{ path: "data/works.ts", content: fullSource, encoding: "utf-8" }],
    customGithubToken
  );

  return {
    ok: true,
    persistedToDisk: diskRes.ok,
    persistedToGit: gitResult.ok,
    deletedSlug: seriesSlug,
    message: `Serie "${removed.title}" eliminada (sus fotos se conservan en el archivo general).`,
  };
}

export function generateSiteConfigTsSource(
  settings: SiteSettings = inMemorySiteSettings,
  posts: CuadernoPost[] = inMemoryCuadernoPosts
): string {
  return `export interface CuadernoPost {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  date: string;
  author: string;
  categoryLabel: string;
  relatedWorkSlug: string;
  status: "borrador" | "publicado";
  body: string[];
  cta: {
    label: string;
    href: string;
  };
}

export interface SiteSettings {
  authorPortraitUrl: string;
  showAuthorPortrait: boolean;
  showCuaderno: boolean;
  contactEmail: string;
  whatsappNumber: string;
  instagramUrl: string;
  locationLabel: string;
  basePrintPrice: number;
  baseCommissionPrice: number;
  baseLicensePrice: number;
}

export const SITE_SETTINGS: SiteSettings = ${JSON.stringify(settings, null, 2)};

export const CUADERNO_POSTS: CuadernoPost[] = ${JSON.stringify(posts, null, 2)};
`;
}

/**
 * Guarda los Ajustes de la Web (retrato de Sobre mí, visibilidad y artículos del Cuaderno, contacto/WhatsApp y tarifas base).
 */
export async function saveSiteConfig(
  incomingSettings: SiteSettings,
  incomingPosts: CuadernoPost[],
  portraitBase64?: string,
  customGithubToken?: string
): Promise<{
  ok: boolean;
  persistedToDisk: boolean;
  persistedToGit: boolean;
  siteSettings: SiteSettings;
  cuadernoPosts: CuadernoPost[];
  message: string;
}> {
  let nextSettings: SiteSettings = {
    ...inMemorySiteSettings,
    ...incomingSettings,
  };

  let cleanPortraitBase64: string | undefined;
  const repoPortraitPath = "public/images/portfolio/hero/retrato-javier-espinosa.jpg";
  if (portraitBase64 && portraitBase64.trim().length > 0) {
    cleanPortraitBase64 = portraitBase64
      .replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "")
      .trim();
    nextSettings = {
      ...nextSettings,
      authorPortraitUrl: "/images/portfolio/hero/retrato-javier-espinosa.jpg",
      showAuthorPortrait: true,
    };
  }

  inMemorySiteSettings = nextSettings;
  inMemoryCuadernoPosts.length = 0;
  for (const p of incomingPosts) {
    inMemoryCuadernoPosts.push({
      ...p,
      body: p.body.map((b) => b.trim()).filter((b) => b.length > 0),
      cta: { ...p.cta },
    });
  }

  const configSource = generateSiteConfigTsSource();
  let persistedToDisk = false;

  if (process.env.VERCEL !== "1") {
    try {
      if (cleanPortraitBase64) {
        const absPortrait = path.join(
          process.cwd(),
          "public",
          "images",
          "portfolio",
          "hero",
          "retrato-javier-espinosa.jpg"
        );
        fs.mkdirSync(path.dirname(absPortrait), { recursive: true });
        fs.writeFileSync(absPortrait, Buffer.from(cleanPortraitBase64, "base64"));
      }
      const configPath = path.join(process.cwd(), "data", "site-config.ts");
      fs.writeFileSync(configPath, configSource, "utf8");
      persistedToDisk = true;
    } catch (err) {
      console.warn("[works-updater] No se pudo guardar data/site-config.ts en disco:", err);
    }
  }

  const filesToCommit: GithubFileEntry[] = [
    { path: "data/site-config.ts", content: configSource, encoding: "utf-8" },
  ];
  if (cleanPortraitBase64) {
    filesToCommit.push({
      path: repoPortraitPath,
      content: cleanPortraitBase64,
      encoding: "base64",
    });
  }

  const gitResult = await commitFilesToGithub(
    "Editorial: actualización de Ajustes de la Web y Cuaderno de Campo",
    filesToCommit,
    customGithubToken
  );

  return {
    ok: true,
    persistedToDisk,
    persistedToGit: gitResult.ok,
    siteSettings: inMemorySiteSettings,
    cuadernoPosts: inMemoryCuadernoPosts,
    message: gitResult.ok
      ? "Ajustes de la web y Cuaderno guardados y publicados."
      : persistedToDisk
      ? "Ajustes guardados en entorno local."
      : "Ajustes guardados solo en sesión.",
  };
}

/**
 * Restaurar estado anterior (#7: Deshacer último cambio / recuperar foto borrada).
 */
export async function restoreCatalogSnapshot(
  worksSnapshot: Photo[],
  seriesSnapshot: Project[],
  label: string,
  customGithubToken?: string
): Promise<{
  ok: boolean;
  persistedToDisk: boolean;
  persistedToGit: boolean;
  message: string;
}> {
  inMemoryWorks.length = 0;
  for (const w of worksSnapshot) {
    inMemoryWorks.push({ ...w });
  }
  inMemorySeries.length = 0;
  for (const s of seriesSnapshot) {
    inMemorySeries.push({
      ...s,
      statement: [...(s.statement ?? [])],
      photoIds: [...(s.photoIds ?? [])],
    });
  }
  ensureValidSeriesCovers();

  const fullSource = generateWorksTsSource();
  const diskRes = writeWorksToLocalDisk(fullSource);
  const gitResult = await commitFilesToGithub(
    `Editorial: deshacer cambio (${label})`,
    [{ path: "data/works.ts", content: fullSource, encoding: "utf-8" }],
    customGithubToken
  );

  return {
    ok: true,
    persistedToDisk: diskRes.ok,
    persistedToGit: gitResult.ok,
    message: `Cambio deshecho: ${label}.`,
  };
}

export interface DeleteResult {
  ok: boolean;
  persistedToDisk: boolean;
  persistedToGit: boolean;
  message: string;
  deletedId: string;
  error?: string;
}

/**
 * Elimina una fotografía del catálogo y de cualquier serie en la que estuviera incluida.
 */
export async function deleteWork(
  photoId: string,
  customGithubToken?: string
): Promise<DeleteResult> {
  const index = inMemoryWorks.findIndex((w) => w.id === photoId);
  if (index === -1) {
    return {
      ok: false,
      persistedToDisk: false,
      persistedToGit: false,
      message: "La fotografía ya no existe en el catálogo.",
      deletedId: photoId,
    };
  }

  const [removed] = inMemoryWorks.splice(index, 1);
  for (const series of inMemorySeries) {
    if (series.photoIds.includes(photoId)) {
      series.photoIds = series.photoIds.filter((id) => id !== photoId);
    }
  }
  ensureValidSeriesCovers();

  const fullSource = generateWorksTsSource();
  const diskRes = writeWorksToLocalDisk(fullSource);

  const gitResult = await commitFilesToGithub(
    `Editorial: eliminación de obra "${removed.title}" [${removed.id}]`,
    [{ path: "data/works.ts", content: fullSource, encoding: "utf-8" }],
    customGithubToken
  );

  let message: string;
  if (gitResult.ok) {
    message = `"${removed.title}" eliminada del catálogo.`;
  } else if (diskRes.ok) {
    message = `"${removed.title}" eliminada de data/works.ts (entorno local).`;
  } else {
    message = `"${removed.title}" eliminada solo en sesión: falta conectar GitHub.`;
  }

  return {
    ok: true,
    persistedToDisk: diskRes.ok,
    persistedToGit: gitResult.ok,
    message,
    deletedId: photoId,
    error: diskRes.error,
  };
}

export interface BulkWorksParams {
  ids: string[];
  actionType:
    | "addToSeries"
    | "removeFromSeries"
    | "setCategory"
    | "setPrints"
    | "setFeatured"
    | "delete";
  targetSeriesSlug?: string;
  targetCategory?: PhotoCategory;
  printsValue?: boolean;
  featuredValue?: boolean;
}

/**
 * Realiza operaciones por lote sobre múltiples fotografías a la vez:
 * asignación a colecciones, cambio de categoría, activación de venta, destacado o borrado múltiple.
 */
export async function bulkUpdateWorks(
  params: BulkWorksParams,
  customGithubToken?: string
): Promise<{
  ok: boolean;
  persistedToDisk: boolean;
  persistedToGit: boolean;
  updatedCount: number;
  message: string;
}> {
  const targetIds = new Set(params.ids);
  let updatedCount = 0;
  let commitMessage = "";

  if (params.actionType === "delete") {
    const toDelete = inMemoryWorks.filter((w) => targetIds.has(w.id));
    updatedCount = toDelete.length;
    for (let i = inMemoryWorks.length - 1; i >= 0; i--) {
      if (targetIds.has(inMemoryWorks[i].id)) {
        inMemoryWorks.splice(i, 1);
      }
    }
    for (const s of inMemorySeries) {
      s.photoIds = s.photoIds.filter((id) => !targetIds.has(id));
    }
    ensureValidSeriesCovers();
    syncAllPhotosSeriesTags();
    commitMessage = `Editorial: eliminación en lote de ${updatedCount} fotografías`;
  } else if (params.actionType === "addToSeries" && params.targetSeriesSlug) {
    const series = inMemorySeries.find(
      (s) => s.slug === params.targetSeriesSlug || s.id === params.targetSeriesSlug
    );
    if (!series) {
      return {
        ok: false,
        persistedToDisk: false,
        persistedToGit: false,
        updatedCount: 0,
        message: "La colección seleccionada no existe.",
      };
    }
    for (const id of params.ids) {
      if (inMemoryWorks.some((w) => w.id === id) && !series.photoIds.includes(id)) {
        series.photoIds.push(id);
        updatedCount++;
      }
    }
    ensureValidSeriesCovers();
    syncAllPhotosSeriesTags();
    commitMessage = `Editorial: ${updatedCount} obras añadidas a la colección "${series.title}"`;
  } else if (params.actionType === "removeFromSeries" && params.targetSeriesSlug) {
    const series = inMemorySeries.find(
      (s) => s.slug === params.targetSeriesSlug || s.id === params.targetSeriesSlug
    );
    if (!series) {
      return {
        ok: false,
        persistedToDisk: false,
        persistedToGit: false,
        updatedCount: 0,
        message: "La colección seleccionada no existe.",
      };
    }
    const initialLen = series.photoIds.length;
    series.photoIds = series.photoIds.filter((id) => !targetIds.has(id));
    updatedCount = initialLen - series.photoIds.length;
    ensureValidSeriesCovers();
    syncAllPhotosSeriesTags();
    commitMessage = `Editorial: ${updatedCount} obras retiradas de la colección "${series.title}"`;
  } else if (params.actionType === "setCategory" && params.targetCategory) {
    for (const w of inMemoryWorks) {
      if (targetIds.has(w.id)) {
        w.category = params.targetCategory;
        const sanitized = sanitizePhotoForCategory(w);
        Object.assign(w, sanitized);
        updatedCount++;
      }
    }
    const catLabel = CATEGORY_METADATA[params.targetCategory]?.title || params.targetCategory;
    commitMessage = `Editorial: cambio de categoría a ${catLabel} en ${updatedCount} obras`;
  } else if (params.actionType === "setPrints") {
    const val = Boolean(params.printsValue);
    for (const w of inMemoryWorks) {
      if (targetIds.has(w.id)) {
        w.prints = val;
        updatedCount++;
      }
    }
    commitMessage = `Editorial: venta Fine Art ${val ? "activada" : "pausada"} en ${updatedCount} obras`;
  } else if (params.actionType === "setFeatured") {
    const val = Boolean(params.featuredValue);
    for (const w of inMemoryWorks) {
      if (targetIds.has(w.id)) {
        w.featured = val;
        if (!val) delete w.featuredOrder;
        updatedCount++;
      }
    }
    commitMessage = `Editorial: estado portada ${val ? "activado" : "desactivado"} en ${updatedCount} obras`;
  }

  const fullSource = generateWorksTsSource();
  const diskRes = writeWorksToLocalDisk(fullSource);
  const gitResult = await commitFilesToGithub(
    commitMessage || `Editorial: actualización en lote de ${updatedCount} fotografías`,
    [{ path: "data/works.ts", content: fullSource, encoding: "utf-8" }],
    customGithubToken
  );

  return {
    ok: true,
    persistedToDisk: diskRes.ok,
    persistedToGit: gitResult.ok,
    updatedCount,
    message: `${updatedCount} fotografías actualizadas con éxito.`,
  };
}

/**
 * Actualiza de forma ágil las colecciones a las que pertenece una fotografía concreta.
 */
export async function setPhotoSeries(
  photoId: string,
  seriesSlugs: string[],
  customGithubToken?: string
): Promise<{
  ok: boolean;
  persistedToDisk: boolean;
  persistedToGit: boolean;
  message: string;
}> {
  const photo = inMemoryWorks.find((w) => w.id === photoId);
  if (!photo) {
    return { ok: false, persistedToDisk: false, persistedToGit: false, message: "Obra no encontrada." };
  }
  const slugSet = new Set(seriesSlugs);
  for (const s of inMemorySeries) {
    const shouldBeIn = slugSet.has(s.slug) || slugSet.has(s.id);
    const currentlyIn = s.photoIds.includes(photoId);
    if (shouldBeIn && !currentlyIn) {
      s.photoIds.push(photoId);
    } else if (!shouldBeIn && currentlyIn) {
      s.photoIds = s.photoIds.filter((id) => id !== photoId);
    }
  }
  ensureValidSeriesCovers();
  syncAllPhotosSeriesTags();

  const fullSource = generateWorksTsSource();
  const diskRes = writeWorksToLocalDisk(fullSource);
  const gitResult = await commitFilesToGithub(
    `Editorial: colecciones actualizadas para "${photo.title}" [${photo.id}]`,
    [{ path: "data/works.ts", content: fullSource, encoding: "utf-8" }],
    customGithubToken
  );

  return {
    ok: true,
    persistedToDisk: diskRes.ok,
    persistedToGit: gitResult.ok,
    message: `Colecciones de "${photo.title}" actualizadas.`,
  };
}
