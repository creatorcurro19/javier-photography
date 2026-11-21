import { NextResponse } from "next/server";
import { isAuthenticatedRequest } from "@/lib/server/admin-auth";
import { getCurrentWorks, saveWork } from "@/lib/server/works-updater";
import type { Photo } from "@/types/photo";

export async function GET(request: Request) {
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json(
      { ok: false, error: "No autorizado. Inicia sesión como administrador." },
      { status: 401 }
    );
  }

  const works = getCurrentWorks();

  return NextResponse.json({
    ok: true,
    total: works.length,
    works,
  });
}

export async function POST(request: Request) {
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json(
      { ok: false, error: "No autorizado. Inicia sesión como administrador." },
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
    if (!photo.id || !photo.title) {
      return NextResponse.json(
        { ok: false, error: "La obra debe tener al menos ID y Título." },
        { status: 400 }
      );
    }

    const customGithubToken = typeof body.githubToken === "string" ? body.githubToken.trim() : undefined;
    const result = await saveWork(photo, customGithubToken);

    return NextResponse.json({
      ok: result.ok,
      message: result.message,
      persistedToDisk: result.persistedToDisk,
      persistedToGit: result.persistedToGit,
      gitCommitUrl: result.gitCommitUrl,
      photo,
    });
  } catch (error) {
    console.error("[admin-works] Error actualizando obra:", error);
    return NextResponse.json(
      { ok: false, error: "Error en el servidor al guardar la fotografía." },
      { status: 500 }
    );
  }
}
