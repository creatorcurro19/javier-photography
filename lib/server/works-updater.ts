import "server-only";
import fs from "fs";
import path from "path";
import { WORKS, SERIES } from "@/data/works";
import type { Photo, Project } from "@/types/photo";

// Copia en memoria para reflejar los cambios inmediatamente en el runtime del servidor
const inMemoryWorks: Photo[] = WORKS.map((w) => ({ ...w }));
const inMemorySeries: Project[] = SERIES.map((s) => ({ ...s, photoIds: [...s.photoIds] }));

export function getCurrentWorks(): Photo[] {
  return inMemoryWorks;
}

export function getCurrentSeries(): Project[] {
  return inMemorySeries;
}

const FILE_HEADER = `import type { Photo, Project } from "@/types/photo";

/**
 * ÚNICA FUENTE DE VERDAD DEL ARCHIVO FOTOGRÁFICO (/data/works.ts)
 * Contiene las 100 obras verificadas y las 8 series monográficas.
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
  // Elimina cadenas vacías opcionales para no ensuciar el archivo
  (["story", "location", "country", "maxFormatReason", "exifWarning"] as const).forEach((key) => {
    if (typeof clean[key] === "string" && (clean[key] as string).trim() === "") {
      delete clean[key];
    }
  });
  return clean;
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

interface SaveResult {
  ok: boolean;
  persistedToDisk: boolean;
  persistedToGit: boolean;
  message: string;
  photo: Photo;
  gitCommitUrl?: string;
  error?: string;
}

/**
 * Actualiza una fotografía en memoria, en disco (si es escribible) y en GitHub (si hay token).
 */
export async function saveWork(
  incomingPhoto: Photo,
  seriesSlugs?: string[],
  customGithubToken?: string
): Promise<SaveResult> {
  let updatedPhoto = sanitizePhotoForCategory(incomingPhoto);
  updatedPhoto = applySeriesMembership(updatedPhoto, seriesSlugs);

  const index = inMemoryWorks.findIndex((w) => w.id === updatedPhoto.id);
  if (index === -1) {
    inMemoryWorks.unshift(updatedPhoto);
  } else {
    // Reemplazo completo para que los campos eliminados desaparezcan de verdad
    inMemoryWorks[index] = updatedPhoto;
  }

  const fullSource = generateWorksTsSource();
  let persistedToDisk = false;
  let persistedToGit = false;
  let gitCommitUrl: string | undefined;
  let diskError: string | undefined;

  // 1. Persistir en disco local (solo funciona en desarrollo; en Vercel el disco es de solo lectura)
  if (process.env.VERCEL !== "1") {
    try {
      const filePath = path.join(process.cwd(), "data", "works.ts");
      fs.writeFileSync(filePath, fullSource, "utf8");
      persistedToDisk = true;
    } catch (err: unknown) {
      diskError = err instanceof Error ? err.message : String(err);
      console.warn("[works-updater] No se pudo guardar en disco:", diskError);
    }
  }

  // 2. Persistir mediante la API de GitHub si hay token configurado (dispara el redespliegue en Vercel)
  const githubToken = customGithubToken?.trim() || process.env.GITHUB_TOKEN?.trim();
  const repoOwner = process.env.GITHUB_REPO_OWNER || "creatorcurro19";
  const repoName = process.env.GITHUB_REPO_NAME || "javier-photography";

  if (githubToken) {
    try {
      const fileApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/data/works.ts`;
      const headers = {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "JavierEspinosa-AdminPanel",
      };

      const getRes = await fetch(`${fileApiUrl}?ref=main`, { headers, cache: "no-store" });
      if (getRes.ok) {
        const fileData = await getRes.json();
        const commitRes = await fetch(fileApiUrl, {
          method: "PUT",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Editorial: actualización de obra "${updatedPhoto.title}" [${updatedPhoto.id}]`,
            content: Buffer.from(fullSource, "utf8").toString("base64"),
            sha: fileData.sha,
            branch: "main",
            committer: {
              name: "Javier Espinosa",
              email: "javierespinosa1995@hotmail.com",
            },
          }),
        });

        if (commitRes.ok) {
          const commitData = await commitRes.json();
          persistedToGit = true;
          gitCommitUrl = commitData?.commit?.html_url;
        } else {
          console.error("[works-updater] Error al guardar en GitHub:", await commitRes.text());
        }
      } else {
        console.warn("[works-updater] No se pudo leer el archivo en GitHub:", await getRes.text());
      }
    } catch (gitErr) {
      console.error("[works-updater] Excepción en llamada a GitHub API:", gitErr);
    }
  }

  let message: string;
  if (persistedToGit) {
    message = `"${updatedPhoto.title}" guardada. La web se actualizará sola en 1–2 minutos.`;
  } else if (persistedToDisk) {
    message = `"${updatedPhoto.title}" guardada en data/works.ts (entorno local).`;
  } else {
    message = `"${updatedPhoto.title}" NO se ha publicado en la web: falta conectar GitHub (botón Sincronizar).`;
  }

  return {
    ok: true,
    persistedToDisk,
    persistedToGit,
    gitCommitUrl,
    message,
    photo: updatedPhoto,
    error: diskError,
  };
}
