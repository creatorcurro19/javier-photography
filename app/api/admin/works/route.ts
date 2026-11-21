import { NextResponse } from "next/server";
import { isAuthenticatedRequest } from "@/lib/server/admin-auth";
import {
  getCurrentWorks,
  getCurrentSeries,
  saveWork,
  deleteWork,
} from "@/lib/server/works-updater";
import type { Photo } from "@/types/photo";

function serializeSeries() {
  return getCurrentSeries().map((s) => ({
    slug: s.slug,
    title: s.title,
    category: s.category,
    photoIds: s.photoIds,
  }));
}

export async function GET(request: Request) {
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json(
      { ok: false, error: "No autorizado. Inicia sesión." },
      { status: 401 }
    );
  }

  const works = getCurrentWorks();

  return NextResponse.json({
    ok: true,
    total: works.length,
    works,
    series: serializeSeries(),
    githubConfigured: Boolean(process.env.GITHUB_TOKEN?.trim()),
  });
}

export async function POST(request: Request) {
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

    // Si es una acción de borrado enviada por POST
    if (body.action === "delete" && typeof body.id === "string") {
      const delRes = await deleteWork(body.id.trim(), customGithubToken);
      if (!delRes.ok) {
        return NextResponse.json(
          { ok: false, error: delRes.message },
          { status: 404 }
        );
      }
      return NextResponse.json({
        ok: true,
        message: delRes.message,
        published: delRes.persistedToGit || delRes.persistedToDisk,
        persistedToDisk: delRes.persistedToDisk,
        persistedToGit: delRes.persistedToGit,
        deletedId: delRes.deletedId,
        series: serializeSeries(),
      });
    }

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
    const imageBase64 =
      typeof body.imageBase64 === "string" && body.imageBase64.trim().length > 0
        ? body.imageBase64.trim()
        : undefined;

    const result = await saveWork(photo, seriesSlugs, customGithubToken, imageBase64);

    return NextResponse.json({
      ok: result.ok,
      message: result.message,
      published: result.persistedToGit || result.persistedToDisk,
      persistedToDisk: result.persistedToDisk,
      persistedToGit: result.persistedToGit,
      gitCommitUrl: result.gitCommitUrl,
      photo: result.photo,
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

    return NextResponse.json({
      ok: true,
      message: delRes.message,
      published: delRes.persistedToGit || delRes.persistedToDisk,
      persistedToDisk: delRes.persistedToDisk,
      persistedToGit: delRes.persistedToGit,
      deletedId: delRes.deletedId,
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
