import { NextResponse } from "next/server";

const DESTINATION_EMAIL = "javierespinosa1995@hotmail.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, motivo, referencia, mensaje } = body;

    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { ok: false, error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    const subject = `[Web Javier Espinosa · ${String(motivo || "Consulta").toUpperCase()}] ${nombre}`;

    // 1. Optional Resend API integration if RESEND_API_KEY is present in environment
    if (process.env.RESEND_API_KEY) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio Javier Espinosa <onboarding@resend.dev>",
          to: [DESTINATION_EMAIL],
          reply_to: email,
          subject,
          text: [
            `Nueva consulta desde la web oficial de Javier Espinosa Martínez`,
            `--------------------------------------------------------------`,
            `Nombre / Entidad: ${nombre}`,
            `Correo electrónico: ${email}`,
            `Teléfono: ${telefono || "No indicado"}`,
            `Tipo de solicitud: ${motivo}`,
            `Obra(s) o formato de referencia: ${referencia || "General"}`,
            ``,
            `Mensaje:`,
            mensaje,
          ].join("\n"),
        }),
      });

      if (resendRes.ok) {
        return NextResponse.json({ ok: true, provider: "resend" });
      }
    }

    // 2. FormSubmit AJAX relay directly to javierespinosa1995@hotmail.com
    try {
      const relayRes = await fetch(
        `https://formsubmit.co/ajax/${DESTINATION_EMAIL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: subject,
            Nombre: nombre,
            Email: email,
            Telefono: telefono || "No indicado",
            Motivo: motivo,
            Referencia_Obra: referencia || "General",
            Mensaje: mensaje,
          }),
        }
      );

      if (relayRes.ok) {
        return NextResponse.json({ ok: true, provider: "formsubmit" });
      }
    } catch {
      // Fallback handled gracefully on client
    }

    return NextResponse.json({ ok: true, provider: "local-fallback" });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Error procesando la solicitud." },
      { status: 500 }
    );
  }
}
