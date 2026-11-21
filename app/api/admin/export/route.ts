import { NextResponse } from "next/server";
import { isAuthenticatedRequest } from "@/lib/server/admin-auth";
import { getCurrentWorks, generateWorksTsSource } from "@/lib/server/works-updater";

export async function GET(request: Request) {
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json(
      { ok: false, error: "No autorizado. Inicia sesión como administrador." },
      { status: 401 }
    );
  }

  const works = getCurrentWorks();
  const source = generateWorksTsSource(works);

  return new NextResponse(source, {
    status: 200,
    headers: {
      "Content-Type": "text/typescript; charset=utf-8",
      "Content-Disposition": 'attachment; filename="works.ts"',
      "Cache-Control": "no-store",
    },
  });
}
