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

interface GithubFileEntry {
  path: string;
  content: string;
  encoding: "utf-8" | "base64";
}

/**
 * Realiza un commit atómico (uno o varios archivos a la vez) en la rama main de GitHub.
 */
async function commitFilesToGithub(
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
    // 1. Obtener el último commit de main
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

    // 2. Obtener el árbol base del último commit
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

    // 3. Crear los blobs para cada archivo (data/works.ts y/o imagen subida)
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

    // 4. Crear el nuevo árbol
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

    // 5. Crear el commit
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

    // 6. Actualizar la referencia main
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
 * Crea o actualiza una fotografía (con subida opcional de archivo de imagen)
 * en memoria, en disco local y en GitHub.
 */
export async function saveWork(
  incomingPhoto: Photo,
  seriesSlugs?: string[],
  customGithubToken?: string,
  imageBase64?: string
): Promise<SaveResult> {
  let updatedPhoto = sanitizePhotoForCategory(incomingPhoto);

  // Si viene una imagen nueva codificada en base64, preparamos su ruta canónica
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

  const index = inMemoryWorks.findIndex((w) => w.id === updatedPhoto.id);
  const isNew = index === -1;
  if (isNew) {
    inMemoryWorks.unshift(updatedPhoto);
  } else {
    inMemoryWorks[index] = updatedPhoto;
  }

  const fullSource = generateWorksTsSource();
  let persistedToDisk = false;
  let diskError: string | undefined;

  // 1. Persistir en disco local (entorno de desarrollo)
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
      const filePath = path.join(process.cwd(), "data", "works.ts");
      fs.writeFileSync(filePath, fullSource, "utf8");
      persistedToDisk = true;
    } catch (err: unknown) {
      diskError = err instanceof Error ? err.message : String(err);
      console.warn("[works-updater] No se pudo guardar en disco:", diskError);
    }
  }

  // 2. Persistir en GitHub (commit atómico de data/works.ts + imagen si se subió)
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
      ? `Nueva fotografía "${updatedPhoto.title}" añadida. Se publicará en la web en ~1 minuto.`
      : `"${updatedPhoto.title}" guardada. La web se actualizará sola en ~1 minuto.`;
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

interface DeleteResult {
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

  const fullSource = generateWorksTsSource();
  let persistedToDisk = false;
  let diskError: string | undefined;

  if (process.env.VERCEL !== "1") {
    try {
      const filePath = path.join(process.cwd(), "data", "works.ts");
      fs.writeFileSync(filePath, fullSource, "utf8");
      persistedToDisk = true;
    } catch (err: unknown) {
      diskError = err instanceof Error ? err.message : String(err);
      console.warn("[works-updater] No se pudo guardar en disco tras eliminar:", diskError);
    }
  }

  const gitResult = await commitFilesToGithub(
    `Editorial: eliminación de obra "${removed.title}" [${removed.id}]`,
    [{ path: "data/works.ts", content: fullSource, encoding: "utf-8" }],
    customGithubToken
  );

  let message: string;
  if (gitResult.ok) {
    message = `"${removed.title}" eliminada del catálogo. La web se actualizará en ~1 minuto.`;
  } else if (persistedToDisk) {
    message = `"${removed.title}" eliminada de data/works.ts (entorno local).`;
  } else {
    message = `"${removed.title}" eliminada solo en sesión: falta conectar GitHub.`;
  }

  return {
    ok: true,
    persistedToDisk,
    persistedToGit: gitResult.ok,
    message,
    deletedId: photoId,
    error: diskError,
  };
}
