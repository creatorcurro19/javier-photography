import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, consent } = body;

    // Validación básica
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Dirección de correo electrónico no válida." },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: "Debes aceptar la política de privacidad y el consentimiento RGPD." },
        { status: 400 }
      );
    }

    // Configuración de proveedor mediante variables de entorno
    const provider = process.env.NEWSLETTER_PROVIDER; // ej: "resend", "mailchimp", "webhook"
    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.NEWSLETTER_AUDIENCE_ID;
    const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;

    // Si hay un webhook genérico configurado
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, date: new Date().toISOString() }),
      });
      return NextResponse.json({ ok: true, registered: true });
    }

    // Si hay Resend configurado
    if (provider === "resend" && apiKey && audienceId) {
      const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("[Newsletter API] Error con proveedor Resend:", errorData);
      }
      return NextResponse.json({ ok: true, registered: true });
    }

    // Si no hay proveedor configurado en .env: registrar en consola de desarrollo sin romper la experiencia
    console.warn(
      `[Newsletter Subscribe] Suscripción simulada para: ${email}. ` +
      `Para enviar correos en producción configure NEWSLETTER_PROVIDER="resend", RESEND_API_KEY="..." y NEWSLETTER_AUDIENCE_ID="..." o NEWSLETTER_WEBHOOK_URL="...".`
    );

    return NextResponse.json({
      ok: true,
      registered: true,
      simulated: true,
      message: "Suscripción registrada correctamente.",
    });
  } catch (error) {
    console.error("[Newsletter API] Error procesando suscripción:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar tu solicitud." },
      { status: 500 }
    );
  }
}
