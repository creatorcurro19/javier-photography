import { NextResponse } from "next/server";
import { isAuthenticatedRequest, isSameOriginRequest } from "@/lib/server/admin-auth";
import { isMobilePushConfigured, notifyOwnerMobile } from "@/lib/server/mobile-push";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ ok: false, error: "Origen no permitido" }, { status: 403 });
  }
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const status = isMobilePushConfigured();
  if (!status.anyConfigured) {
    return NextResponse.json({
      ok: false,
      configured: false,
      channels: status,
      error:
        "No hay canal push móvil configurado en Vercel todavía (ADMIN_NTFY_TOPIC o TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID).",
    });
  }

  const result = await notifyOwnerMobile({
    kind: "test",
    title: "Prueba · Estudio Javier Espinosa",
    message:
      "Los avisos push en tu móvil funcionan correctamente. Al pulsar aquí abrirás directamente tu bandeja de consultas.",
    priority: 4,
    tags: ["camera", "white_check_mark"],
    tab: "inbox",
  });

  return NextResponse.json({
    ok: result.anySent,
    configured: true,
    channels: status,
    result,
  });
}
