import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/metadata";
import { isMobilePushConfigured } from "@/lib/server/mobile-push";

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
  const mobilePushStatus = isMobilePushConfigured();

  const stripeFlagActive = process.env.NEXT_PUBLIC_STRIPE_ACTIVE === "true";

  const integrations = {
    stripe: {
      configured: Boolean(stripeKey),
      webhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      flagActive: stripeFlagActive,
      ready: Boolean(stripeKey) && stripeFlagActive,
      adaptivePricingEnabled: process.env.STRIPE_ADAPTIVE_PRICING !== "false",
      automaticTaxEnabled: process.env.STRIPE_AUTOMATIC_TAX === "true",
      mode:
        stripeKey.startsWith("sk_live_") || stripeKey.startsWith("rk_live_")
          ? "live"
          : stripeKey.startsWith("sk_test_") || stripeKey.startsWith("rk_test_")
            ? "test"
            : "reservation-only",
    },
    email: {
      resendConfigured: Boolean(resendKey),
      customFromConfigured: Boolean(resendFrom),
      recipientOverride: Boolean((process.env.RESEND_TO_EMAIL ?? "").trim()),
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
    mobilePush: {
      ntfyConfigured: mobilePushStatus.ntfyConfigured,
      telegramConfigured: mobilePushStatus.telegramConfigured,
      ready: mobilePushStatus.anyConfigured,
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
