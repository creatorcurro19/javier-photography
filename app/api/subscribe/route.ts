import { NextResponse } from "next/server";
import { RESEND_OWNER_EMAIL, relayWithFormSubmit, sendWithResend } from "@/lib/server/email";
import { getClientIp, rateLimit } from "@/lib/server/rate-limit";
import { notifyOwnerMobile } from "@/lib/server/mobile-push";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(`subscribe:${ip}`, 8, 10 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Demasiados intentos seguidos. Inténtalo de nuevo en unos minutos." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await req.json().catch(() => null);
    const rawEmail = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const consent = Boolean(body?.consent);

    if (!rawEmail || rawEmail.length > 160 || !EMAIL_RE.test(rawEmail)) {
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

    const provider = process.env.NEWSLETTER_PROVIDER;
    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.NEWSLETTER_AUDIENCE_ID;
    const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
    const timestamp = new Date().toISOString();

    const mobilePushPromise = notifyOwnerMobile({
      kind: "newsletter",
      title: `Nuevo coleccionista suscrito`,
      message: `${rawEmail}\nAlta en avisos de nuevas tiradas Fine Art (RGPD aceptado).`,
      priority: 3,
      tags: ["sparkles", "email"],
      tab: "inbox",
    }).catch(() => ({ ntfySent: false, telegramSent: false, anySent: false }));

    // 1. Webhook externo si está configurado
    if (webhookUrl) {
      try {
        const whRes = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: rawEmail, consent: true, date: timestamp }),
        });
        if (whRes.ok) {
          await mobilePushPromise;
          return NextResponse.json({ ok: true, registered: true, provider: "webhook" });
        }
        console.error(`[subscribe] Webhook devolvió ${whRes.status}`);
      } catch (err) {
        console.error("[subscribe] Error conectando con webhook:", err);
      }
    }

    // 2. Resend Audiences si están configurados NEWSLETTER_PROVIDER="resend", RESEND_API_KEY y NEWSLETTER_AUDIENCE_ID
    if (provider === "resend" && apiKey && audienceId) {
      try {
        const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: rawEmail,
            unsubscribed: false,
          }),
        });

        if (res.ok) {
          await mobilePushPromise;
          return NextResponse.json({ ok: true, registered: true, provider: "resend-audience" });
        }
        const errorData = await res.json().catch(() => ({}));
        console.error("[subscribe] Error en Resend Audiences:", errorData);
      } catch (err) {
        console.error("[subscribe] Error de red con Resend Audiences:", err);
      }
    }

    // 3. Respaldo por correo al autor (Resend transactional o FormSubmit) para no perder ningún suscriptor
    const subject = `[NUEVO SUSCRIPTOR TIRADAS FINE ART] ${rawEmail}`;
    const text = [
      `Nueva alta en Avisos de Nuevas Tiradas de Autor (RGPD aceptado)`,
      `---------------------------------------------------------------`,
      `Correo del coleccionista: ${rawEmail}`,
      `Consentimiento RGPD: Sí (${timestamp})`,
    ].join("\n");

    const emailedViaResend = await sendWithResend(
      {
        to: [RESEND_OWNER_EMAIL],
        replyTo: rawEmail,
        subject,
        text,
      },
      "subscribe-fallback"
    );

    if (emailedViaResend) {
      await mobilePushPromise;
      return NextResponse.json({ ok: true, registered: true, provider: "resend-email" });
    }

    const relay = await relayWithFormSubmit(
      {
        _subject: subject,
        _replyto: rawEmail,
        Suscriptor_Email: rawEmail,
        Consentimiento_RGPD: `Aceptado (${timestamp})`,
        Lista: "Avisos de Nuevas Tiradas Fine Art",
      },
      "subscribe-fallback"
    );

    const mobilePush = await mobilePushPromise;

    if (relay === "sent") {
      return NextResponse.json({ ok: true, registered: true, provider: "formsubmit" });
    }

    if (mobilePush.anySent) {
      return NextResponse.json({ ok: true, registered: true, provider: "mobile-push" });
    }

    console.warn(
      `[subscribe] No hay proveedor de newsletter ni relé activo para registrar a ${rawEmail}. ` +
        `Configura RESEND_API_KEY (y opcionalmente NEWSLETTER_PROVIDER="resend" + NEWSLETTER_AUDIENCE_ID) o NEWSLETTER_WEBHOOK_URL.`
    );

    return NextResponse.json(
      {
        ok: false,
        registered: false,
        error:
          "El servicio de suscripción automática no está disponible en este momento. Puedes escribirnos desde Contacto para unirte a la lista privada.",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("[subscribe] Error inesperado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar la suscripción." },
      { status: 500 }
    );
  }
}
