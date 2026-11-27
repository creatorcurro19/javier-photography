import { NextResponse, after } from "next/server";
import { isAuthenticatedRequest, isSameOriginRequest } from "@/lib/server/admin-auth";
import {
  getCurrentWorks,
  getCurrentSeries,
  getCurrentSiteSettings,
  getCurrentCuadernoPosts,
  saveWork,
  deleteWork,
  batchCreateWorks,
  bulkUpdatePrices,
  saveSeriesItem,
  deleteSeriesItem,
  saveSiteConfig,
  restoreCatalogSnapshot,
  bulkUpdateWorks,
  setPhotoSeries,
} from "@/lib/server/works-updater";
import type { Photo, PhotoCategory, Project } from "@/types/photo";
import type { SiteSettings, CuadernoPost } from "@/data/site-config";
import { notifySearchEngines } from "@/lib/server/search-ping";

function pingSearchIfPublished(persistedToGit: boolean, paths: string[]) {
  if (!persistedToGit && process.env.VERCEL !== "1") return;
  try {
    after(() => notifySearchEngines(paths));
  } catch {
    void notifySearchEngines(paths);
  }
}

function serializeSeries(): Project[] {
  return getCurrentSeries().map((s) => ({
    ...s,
    statement: [...s.statement],
    photoIds: [...s.photoIds],
  }));
}

export async function GET(request: Request) {
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json(
      { ok: false, error: "No autorizado. Inicia sesión." },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const works = getCurrentWorks();

  return NextResponse.json(
    {
      ok: true,
      total: works.length,
      works,
      series: serializeSeries(),
      siteSettings: getCurrentSiteSettings(),
      cuadernoPosts: getCurrentCuadernoPosts(),
      githubConfigured: Boolean(process.env.GITHUB_TOKEN?.trim()),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { ok: false, error: "Origen de solicitud no permitido." },
      { status: 403 }
    );
  }
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json(
      { ok: false, error: "No autorizado. Inicia sesión." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Cuerpo de solicitud vacío." },
        { status: 400 }
      );
    }

    const customGithubToken =
      typeof body.githubToken === "string" ? body.githubToken.trim() : undefined;

    // 1. Borrado por POST
    if (body.action === "delete" && typeof body.id === "string") {
      const delRes = await deleteWork(body.id.trim(), customGithubToken);
      if (!delRes.ok) {
        return NextResponse.json(
          { ok: false, error: delRes.message },
          { status: 404 }
        );
      }
      pingSearchIfPublished(delRes.persistedToGit, ["/"]);
      return NextResponse.json({
        ok: true,
        message: delRes.message,
        published: delRes.persistedToGit || delRes.persistedToDisk,
        persistedToDisk: delRes.persistedToDisk,
        persistedToGit: delRes.persistedToGit,
        deletedId: delRes.deletedId,
        works: getCurrentWorks(),
        series: serializeSeries(),
      });
    }

    // 2. Subida en lote (#1)
    if (body.action === "batch-create" && Array.isArray(body.items)) {
      const items = (body.items as { photo: Photo; imageBase64: string }[]).filter(
        (it) => it && it.photo && it.photo.id && it.photo.title && typeof it.imageBase64 === "string"
      );
      if (items.length === 0) {
        return NextResponse.json(
          { ok: false, error: "No hay fotografías válidas en el lote." },
          { status: 400 }
        );
      }
      const seriesSlugs = Array.isArray(body.seriesSlugs)
        ? (body.seriesSlugs as unknown[]).filter((s): s is string => typeof s === "string")
        : undefined;
      const batchRes = await batchCreateWorks(items, seriesSlugs, customGithubToken);
      pingSearchIfPublished(
        batchRes.persistedToGit,
        batchRes.createdPhotos.flatMap((p) => [
          `/portfolio/${p.slug}`,
          `/portfolio/${p.category}`,
        ])
      );
      return NextResponse.json({
        ok: batchRes.ok,
        message: batchRes.message,
        published: batchRes.persistedToGit || batchRes.persistedToDisk,
        createdPhotos: batchRes.createdPhotos,
        works: getCurrentWorks(),
        series: serializeSeries(),
      });
    }

    // 3. Cambio de precios en bloque (#2)
    if (body.action === "bulk-prices") {
      const scope = (body.scope || "all") as "all" | PhotoCategory;
      const mode = (body.mode === "delta" ? "delta" : "set") as "set" | "delta";
      const bulkRes = await bulkUpdatePrices(
        {
          scope,
          mode,
          estudio: typeof body.estudio === "number" ? body.estudio : undefined,
          galeria: typeof body.galeria === "number" ? body.galeria : undefined,
          coleccion: typeof body.coleccion === "number" ? body.coleccion : undefined,
          deltaAmount: typeof body.deltaAmount === "number" ? body.deltaAmount : undefined,
          editionTotal: typeof body.editionTotal === "number" ? body.editionTotal : undefined,
          prints: typeof body.prints === "boolean" ? body.prints : undefined,
        },
        customGithubToken
      );
      return NextResponse.json({
        ok: bulkRes.ok,
        message: bulkRes.message,
        published: bulkRes.persistedToGit || bulkRes.persistedToDisk,
        updatedCount: bulkRes.updatedCount,
        works: getCurrentWorks(),
        series: serializeSeries(),
      });
    }

    // 3b. Operaciones por lote sobre fotografías (asignar a serie, cambiar categoría, venta, etc.)
    if (body.action === "bulk-works" && body.params && Array.isArray(body.params.ids)) {
      const bulkRes = await bulkUpdateWorks(body.params, customGithubToken);
      return NextResponse.json({
        ok: bulkRes.ok,
        message: bulkRes.message,
        published: bulkRes.persistedToGit || bulkRes.persistedToDisk,
        updatedCount: bulkRes.updatedCount,
        works: getCurrentWorks(),
        series: serializeSeries(),
      });
    }

    // 3c. Asignación rápida de colecciones para una fotografía
    if (body.action === "set-photo-series" && typeof body.photoId === "string" && Array.isArray(body.seriesSlugs)) {
      const sRes = await setPhotoSeries(body.photoId, body.seriesSlugs, customGithubToken);
      return NextResponse.json({
        ok: sRes.ok,
        message: sRes.message,
        published: sRes.persistedToGit || sRes.persistedToDisk,
        works: getCurrentWorks(),
        series: serializeSeries(),
      });
    }

    // 4. Guardar una Serie Monográfica (#4 / #1)
    if (body.action === "save-series" && body.seriesItem) {
      const seriesItem = body.seriesItem as Project;
      if (!seriesItem.slug || !seriesItem.title?.trim()) {
        return NextResponse.json(
          { ok: false, error: "La serie debe tener título y slug." },
          { status: 400 }
        );
      }
      const sRes = await saveSeriesItem(seriesItem, customGithubToken);
      pingSearchIfPublished(sRes.persistedToGit, [`/projects/${seriesItem.slug}`]);
      return NextResponse.json({
        ok: sRes.ok,
        message: sRes.message,
        published: sRes.persistedToGit || sRes.persistedToDisk,
        seriesItem: sRes.seriesItem,
        works: getCurrentWorks(),
        series: serializeSeries(),
      });
    }

    // 4b. Eliminar una Serie Monográfica (#1)
    if (body.action === "delete-series" && typeof body.slug === "string") {
      const dRes = await deleteSeriesItem(body.slug.trim(), customGithubToken);
      if (!dRes.ok) {
        return NextResponse.json({ ok: false, error: dRes.message }, { status: 404 });
      }
      return NextResponse.json({
        ok: true,
        message: dRes.message,
        published: dRes.persistedToGit || dRes.persistedToDisk,
        deletedSlug: dRes.deletedSlug,
        works: getCurrentWorks(),
        series: serializeSeries(),
      });
    }

    // 4c. Guardar Ajustes de la Web, Retrato y Cuaderno de Campo (#4)
    if (body.action === "save-site-config" && body.siteSettings) {
      const settings = body.siteSettings as SiteSettings;
      const posts = Array.isArray(body.cuadernoPosts)
        ? (body.cuadernoPosts as CuadernoPost[])
        : getCurrentCuadernoPosts();
      const portraitBase64 =
        typeof body.portraitBase64 === "string" && body.portraitBase64.trim().length > 0
          ? body.portraitBase64.trim()
          : undefined;
      const cRes = await saveSiteConfig(settings, posts, portraitBase64, customGithubToken);
      return NextResponse.json({
        ok: cRes.ok,
        message: cRes.message,
        published: cRes.persistedToGit || cRes.persistedToDisk,
        siteSettings: cRes.siteSettings,
        cuadernoPosts: cRes.cuadernoPosts,
      });
    }

    // 5. Deshacer último cambio / restaurar foto borrada (#7)
    if (
      body.action === "restore-snapshot" &&
      Array.isArray(body.works) &&
      Array.isArray(body.series)
    ) {
      const label = typeof body.label === "string" ? body.label : "acción anterior";
      const rRes = await restoreCatalogSnapshot(
        body.works as Photo[],
        body.series as Project[],
        label,
        customGithubToken
      );
      return NextResponse.json({
        ok: rRes.ok,
        message: rRes.message,
        published: rRes.persistedToGit || rRes.persistedToDisk,
        works: getCurrentWorks(),
        series: serializeSeries(),
      });
    }

    // 6. Guardar o crear una fotografía individual
    if (!body.photo) {
      return NextResponse.json(
        { ok: false, error: "Datos de fotografía no proporcionados." },
        { status: 400 }
      );
    }

    const photo = body.photo as Photo;
    if (!photo.id || !photo.title?.trim()) {
      return NextResponse.json(
        { ok: false, error: "La obra debe tener al menos ID y título." },
        { status: 400 }
      );
    }

    const seriesSlugs = Array.isArray(body.seriesSlugs)
      ? (body.seriesSlugs as unknown[]).filter((s): s is string => typeof s === "string")
      : undefined;
    const seriesCoverSlugs = Array.isArray(body.seriesCoverSlugs)
      ? (body.seriesCoverSlugs as unknown[]).filter((s): s is string => typeof s === "string")
      : undefined;
    const imageBase64 =
      typeof body.imageBase64 === "string" && body.imageBase64.trim().length > 0
        ? body.imageBase64.trim()
        : undefined;

    const result = await saveWork(
      photo,
      seriesSlugs,
      customGithubToken,
      imageBase64,
      seriesCoverSlugs
    );
    pingSearchIfPublished(result.persistedToGit, [
      `/portfolio/${result.photo.slug}`,
      `/portfolio/${result.photo.category}`,
    ]);

    return NextResponse.json({
      ok: result.ok,
      message: result.message,
      published: result.persistedToGit || result.persistedToDisk,
      persistedToDisk: result.persistedToDisk,
      persistedToGit: result.persistedToGit,
      gitCommitUrl: result.gitCommitUrl,
      photo: result.photo,
      works: getCurrentWorks(),
      series: serializeSeries(),
    });
  } catch (error) {
    console.error("[admin-works] Error procesando obra:", error);
    return NextResponse.json(
      { ok: false, error: "Error en el servidor al guardar la fotografía." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { ok: false, error: "Origen de solicitud no permitido." },
      { status: 403 }
    );
  }
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json(
      { ok: false, error: "No autorizado. Inicia sesión." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    const id = typeof body?.id === "string" ? body.id.trim() : "";
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Falta el ID de la fotografía a eliminar." },
        { status: 400 }
      );
    }

    const customGithubToken =
      typeof body?.githubToken === "string" ? body.githubToken.trim() : undefined;

    const delRes = await deleteWork(id, customGithubToken);
    if (!delRes.ok) {
      return NextResponse.json(
        { ok: false, error: delRes.message },
        { status: 404 }
      );
    }
    pingSearchIfPublished(delRes.persistedToGit, ["/"]);

    return NextResponse.json({
      ok: true,
      message: delRes.message,
      published: delRes.persistedToGit || delRes.persistedToDisk,
      persistedToDisk: delRes.persistedToDisk,
      persistedToGit: delRes.persistedToGit,
      deletedId: delRes.deletedId,
      works: getCurrentWorks(),
      series: serializeSeries(),
    });
  } catch (error) {
    console.error("[admin-works] Error eliminando obra:", error);
    return NextResponse.json(
      { ok: false, error: "Error en el servidor al eliminar la fotografía." },
      { status: 500 }
    );
  }
}
