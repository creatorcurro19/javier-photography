import { NextResponse } from "next/server";
import { resolveClientGallery } from "@/data/client-galleries";
import { getClientIp, rateLimit } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`client-gallery:${ip}`, 12, 10 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Demasiados intentos de acceso. Espera unos minutos antes de volver a intentarlo.",
        },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await request.json().catch(() => null);
    const rawCode = typeof body?.code === "string" ? body.code.trim() : "";

    if (!rawCode || rawCode.length > 40) {
      return NextResponse.json(
        { ok: false, error: "Introduce una clave de galería válida." },
        { status: 400 }
      );
    }

    const gallery = resolveClientGallery(rawCode);
    if (!gallery) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Clave no reconocida. Verifica el código proporcionado por el estudio (o prueba «DEMO» para ver una muestra).",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true, gallery });
  } catch (error) {
    console.error("[client-gallery] Error validando clave:", error);
    return NextResponse.json(
      { ok: false, error: "Error verificando la clave de acceso." },
      { status: 500 }
    );
  }
}
