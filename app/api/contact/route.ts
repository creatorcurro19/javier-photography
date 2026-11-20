import { NextResponse } from "next/server";
import { buildContactOwnerEmailHtml } from "@/lib/email-templates";
import { DESTINATION_EMAIL, relayWithFormSubmit, sendWithResend } from "@/lib/server/email";
import { getClientIp, rateLimit } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`contact:${ip}`, 10, 10 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { ok: false, error: "Demasiados intentos seguidos. Espera unos minutos e inténtalo de nuevo." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Datos de consulta no válidos." },
        { status: 400 }
      );
    }

    const { nombre, email, telefono, motivo, referencia, mensaje, _gotcha } = body;

    // Anti-spam honeypot: reject bots silently
    if (_gotcha) {
      return NextResponse.json({ ok: true, provider: "spam-filtered" });
    }

    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { ok: false, error: "Faltan campos obligatorios (nombre, correo o mensaje)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email))) {
      return NextResponse.json(
        { ok: false, error: "El formato de correo electrónico no es válido." },
        { status: 400 }
      );
    }

    const cleanNombre = String(nombre).trim().slice(0, 140);
    const cleanEmail = String(email).trim().slice(0, 160);
    const cleanTelefono = telefono ? String(telefono).trim().slice(0, 40) : "";
    const cleanMotivo = String(motivo || "Consulta").trim().slice(0, 80);
    const cleanReferencia = referencia ? String(referencia).trim().slice(0, 200) : "";
    const cleanMensaje = String(mensaje).trim().slice(0, 4000);

    const subject = `[Web Javier Espinosa · ${cleanMotivo.toUpperCase()}] ${cleanNombre}`;

    // 1. Envío mediante Resend API si RESEND_API_KEY está configurada
    const resendOk = await sendWithResend(
      {
        to: [DESTINATION_EMAIL],
        replyTo: cleanEmail,
        subject,
        html: buildContactOwnerEmailHtml({
          nombre: cleanNombre,
          email: cleanEmail,
          motivo: cleanMotivo,
          asunto: cleanReferencia || subject,
          mensaje: cleanMensaje,
        }),
        text: [
          `Nueva consulta desde la web oficial de Javier Espinosa Martínez`,
          `--------------------------------------------------------------`,
          `Nombre / Entidad: ${cleanNombre}`,
          `Correo electrónico: ${cleanEmail}`,
          `Teléfono: ${cleanTelefono || "No indicado"}`,
          `Tipo de solicitud: ${cleanMotivo}`,
          `Obra(s) o formato de referencia: ${cleanReferencia || "General"}`,
          ``,
          `Mensaje:`,
          cleanMensaje,
        ].join("\n"),
      },
      "contact"
    );

    if (resendOk) {
      return NextResponse.json({ ok: true, provider: "resend" });
    }

    // 2. FormSubmit AJAX relay directo a javierespinosa1995@hotmail.com
    const relay = await relayWithFormSubmit(
      {
        _subject: subject,
        _replyto: cleanEmail,
        Nombre: cleanNombre,
        Email: cleanEmail,
        Telefono: cleanTelefono || "No indicado",
        Motivo: cleanMotivo,
        Referencia_Obra: cleanReferencia || "General",
        Mensaje: cleanMensaje,
      },
      "contact"
    );

    if (relay === "sent") {
      return NextResponse.json({ ok: true, provider: "formsubmit" });
    }

    if (relay === "needs-activation") {
      return NextResponse.json(
        {
          ok: false,
          needsActivation: true,
          error:
            "FormSubmit ha enviado un correo de activación a javierespinosa1995@hotmail.com. Revisa tu bandeja de entrada o correo no deseado y haz clic en 'Activate Form'.",
          destinationEmail: DESTINATION_EMAIL,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        missingConfig: true,
        error: "Pasarela automática no disponible. Por favor, utilice el envío directo por gestor de correo.",
        destinationEmail: DESTINATION_EMAIL,
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("[contact] Error procesando consulta:", error);
    return NextResponse.json(
      { ok: false, error: "Error procesando la solicitud." },
      { status: 500 }
    );
  }
}
