import { NextResponse } from "next/server";
import { isAuthenticatedRequest } from "@/lib/server/admin-auth";
import { getCurrentWorks, getCurrentSeries, saveWork } from "@/lib/server/works-updater";
import type { Photo } from "@/types/photo";

export async function GET(request: Request) {
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json(
      { ok: false, error: "No autorizado. Inicia sesión." },
      { status: 401 }
    );
  }

  const works = getCurrentWorks();
  const series = getCurrentSeries().map((s) => ({
    slug: s.slug,
    title: s.title,
    category: s.category,
    photoIds: s.photoIds,
  }));

  return NextResponse.json({
    ok: true,
    total: works.length,
    works,
    series,
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
    if (!body || !body.photo) {
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
    const customGithubToken =
      typeof body.githubToken === "string" ? body.githubToken.trim() : undefined;

    const result = await saveWork(photo, seriesSlugs, customGithubToken);
    const series = getCurrentSeries().map((s) => ({
      slug: s.slug,
      title: s.title,
      category: s.category,
      photoIds: s.photoIds,
    }));

    return NextResponse.json({
      ok: result.ok,
      message: result.message,
      published: result.persistedToGit || result.persistedToDisk,
      persistedToDisk: result.persistedToDisk,
      persistedToGit: result.persistedToGit,
      gitCommitUrl: result.gitCommitUrl,
      photo: result.photo,
      series,
    });
  } catch (error) {
    console.error("[admin-works] Error actualizando obra:", error);
    return NextResponse.json(
      { ok: false, error: "Error en el servidor al guardar la fotografía." },
      { status: 500 }
    );
  }
}
