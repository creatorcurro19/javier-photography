import "server-only";
import fs from "fs";
import path from "path";
import { WORKS, SERIES } from "@/data/works";
import type { Photo } from "@/types/photo";

// Memoria de sesión para reflejar cambios inmediatos en el runtime del servidor
const inMemoryWorks: Photo[] = [...WORKS];

export function getCurrentWorks(): Photo[] {
  return inMemoryWorks;
}

export function getWorkByIdOrSlug(idOrSlug: string): Photo | undefined {
  return inMemoryWorks.find(
    (w) => w.id === idOrSlug || w.slug === idOrSlug
  );
}

/**
 * Genera el contenido completo del archivo data/works.ts como TypeScript válido.
 */
export function generateWorksTsSource(worksToSerialize: Photo[]): string {
  const filePath = path.join(process.cwd(), "data", "works.ts");
  let seriesSection = "";

  if (fs.existsSync(filePath)) {
    try {
      const existing = fs.readFileSync(filePath, "utf8");
      const boundary = "export const WORKS: Photo[] = [";
      const idx = existing.indexOf(boundary);
      if (idx !== -1) {
        seriesSection = existing.substring(0, idx);
      }
    } catch (e) {
      console.warn("[works-updater] No se pudo leer el archivo existente:", e);
    }
  }

  // Si no se pudo leer el prefijo del archivo, generamos la cabecera estándar con SERIES
  if (!seriesSection) {
    seriesSection = `import type { Photo, Project } from "@/types/photo";

/**
 * ÚNICA FUENTE DE VERDAD DEL ARCHIVO FOTOGRÁFICO (/data/works.ts)
 * Contiene las 100 obras verificadas y las 8 series monográficas.
 * Todas las páginas, componentes, sitemaps, schemas JSON-LD y validadores de pedido leen de este módulo.
 */

export const SERIES: Project[] = ${JSON.stringify(SERIES, null, 2)};\n\n`;
  }

  const worksJson = JSON.stringify(worksToSerialize, null, 2);

  return `${seriesSection}export const WORKS: Photo[] = ${worksJson};

export const photos: Photo[] = WORKS;
export const PROJECTS: Project[] = SERIES;
`;
}

interface SaveResult {
  ok: boolean;
  persistedToDisk: boolean;
  persistedToGit: boolean;
  message: string;
  gitCommitUrl?: string;
  error?: string;
}

/**
 * Actualiza una fotografía en memoria, en disco (si es escribible) y en GitHub (si hay token).
 */
export async function saveWork(
  updatedPhoto: Photo,
  customGithubToken?: string
): Promise<SaveResult> {
  const index = inMemoryWorks.findIndex((w) => w.id === updatedPhoto.id);

  if (index === -1) {
    // Si no existe, añadir al catálogo
    inMemoryWorks.unshift(updatedPhoto);
  } else {
    // Reemplazar existente
    inMemoryWorks[index] = {
      ...inMemoryWorks[index],
      ...updatedPhoto,
    };
  }

  const fullSource = generateWorksTsSource(inMemoryWorks);
  let persistedToDisk = false;
  let persistedToGit = false;
  let gitCommitUrl: string | undefined;
  let diskError: string | undefined;

  // 1. Intentar persistir en disco local
  try {
    const filePath = path.join(process.cwd(), "data", "works.ts");
    fs.writeFileSync(filePath, fullSource, "utf8");
    persistedToDisk = true;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    diskError = errorMsg;
    console.warn("[works-updater] Sistema de archivos de solo lectura o error al guardar en disco:", errorMsg);
  }

  // 2. Intentar persistir mediante la API de GitHub si hay token configurado
  const githubToken = customGithubToken?.trim() || process.env.GITHUB_TOKEN?.trim();
  const repoOwner = process.env.GITHUB_REPO_OWNER || "creatorcurro19";
  const repoName = process.env.GITHUB_REPO_NAME || "javier-photography";

  if (githubToken) {
    try {
      const fileApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/data/works.ts`;
      
      // Obtener el SHA actual del archivo en GitHub
      const getRes = await fetch(fileApiUrl, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "JavierEspinosa-AdminPanel",
        },
        cache: "no-store",
      });

      if (getRes.ok) {
        const fileData = await getRes.json();
        const currentSha = fileData.sha;

        // Cometer los cambios
        const base64Content = Buffer.from(fullSource, "utf8").toString("base64");
        const commitRes = await fetch(fileApiUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
            "User-Agent": "JavierEspinosa-AdminPanel",
          },
          body: JSON.stringify({
            message: `Editorial: actualización de obra "${updatedPhoto.title}" [${updatedPhoto.id}]`,
            content: base64Content,
            sha: currentSha,
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
          const errData = await commitRes.text();
          console.error("[works-updater] Error al cometer en GitHub:", errData);
        }
      } else {
        console.warn("[works-updater] No se pudo obtener el SHA de GitHub:", await getRes.text());
      }
    } catch (gitErr) {
      console.error("[works-updater] Excepción en llamada a GitHub API:", gitErr);
    }
  }

  let message = `Fotografía "${updatedPhoto.title}" actualizada con éxito.`;
  if (persistedToGit) {
    message += " Sincronizada directamente en GitHub (despliegue automático en Vercel iniciado).";
  } else if (persistedToDisk) {
    message += " Guardada directamente en el archivo local data/works.ts.";
  } else {
    message += " Guardada en la sesión activa y memoria del navegador. Puedes exportar el archivo para conservarlo de forma permanente.";
  }

  return {
    ok: true,
    persistedToDisk,
    persistedToGit,
    gitCommitUrl,
    message,
    error: diskError,
  };
}
