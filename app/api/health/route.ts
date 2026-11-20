import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/metadata";

/**
 * Diagnóstico público de configuración en producción (/api/health).
 * Solo expone indicadores booleanos (jamás valores secretos ni claves).
 */
export async function GET() {
  const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";
  const resendKey = process.env.RESEND_API_KEY ?? "";
  const resendFrom = process.env.RESEND_FROM_EMAIL ?? "";
  const newsletterProvider = process.env.NEWSLETTER_PROVIDER ?? "";
  const newsletterAudience = process.env.NEWSLETTER_AUDIENCE_ID ?? "";
  const newsletterWebhook = process.env.NEWSLETTER_WEBHOOK_URL ?? "";
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "";

  const integrations = {
    stripe: {
      configured: Boolean(stripeKey),
      mode: stripeKey.startsWith("sk_live_")
        ? "live"
        : stripeKey.startsWith("sk_test_")
          ? "test"
          : "reservation-only",
    },
    email: {
      resendConfigured: Boolean(resendKey),
      customFromConfigured: Boolean(resendFrom),
      fallbackRelay: "formsubmit",
    },
    newsletter: {
      webhookConfigured: Boolean(newsletterWebhook),
      resendAudienceConfigured:
        newsletterProvider === "resend" && Boolean(resendKey) && Boolean(newsletterAudience),
      emailFallbackConfigured: Boolean(resendKey),
    },
    whatsapp: {
      configured: Boolean(whatsapp.trim()),
    },
    siteUrl: SITE_URL,
  };

  return NextResponse.json({
    ok: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    integrations,
  });
}
