import "server-only";
import { SITE_CONFIG } from "@/data/site-config";

/**
 * Utilidades de envío de correo compartidas por las rutas API.
 * - Resend si hay RESEND_API_KEY.
 * - FormSubmit como relé de respaldo.
 * Todas devuelven `true` solo si el proveedor confirma la entrega, y registran el fallo en los logs de Vercel.
 */

export const DESTINATION_EMAIL = SITE_CONFIG.contactEmail;

/**
 * Destinatario privado de avisos internos vía Resend.
 * Útil si la cuenta de Resend usa otro buzón o un relay de Apple mientras no haya dominio propio verificado.
 */
export const RESEND_OWNER_EMAIL = (process.env.RESEND_TO_EMAIL ?? "").trim() || DESTINATION_EMAIL;

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Javier Espinosa Fotografía <onboarding@resend.dev>";

export interface ResendPayload {
  to: string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}

export async function sendWithResend(payload: ResendPayload, context: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  // El remitente sandbox de Resend solo puede entregar al email propietario de la cuenta Resend.
  const isSandboxSender = FROM_EMAIL.toLowerCase().includes("onboarding@resend.dev");
  const ownerTarget = RESEND_OWNER_EMAIL.toLowerCase();
  if (isSandboxSender && !payload.to.every((addr) => addr.trim().toLowerCase() === ownerTarget)) {
    console.info(
      `[email:${context}] Omitido envío externo con onboarding@resend.dev hasta verificar RESEND_FROM_EMAIL con dominio propio.`
    );
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: payload.to,
        reply_to: payload.replyTo,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[email:${context}] Resend respondió ${res.status}: ${detail.slice(0, 300)}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`[email:${context}] Error de red con Resend:`, error);
    return false;
  }
}

export type RelayResult = "sent" | "needs-activation" | "failed";

export async function relayWithFormSubmit(
  fields: Record<string, string>,
  context: string
): Promise<RelayResult> {
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${DESTINATION_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Referer: `${SITE_CONFIG.siteUrl}/`,
        Origin: SITE_CONFIG.siteUrl,
      },
      body: JSON.stringify({ _captcha: "false", _template: "table", ...fields }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data && (data.success === "true" || data.success === true)) return "sent";
    if (data?.message && String(data.message).toLowerCase().includes("activation")) {
      console.warn(`[email:${context}] FormSubmit pendiente de activación.`);
      return "needs-activation";
    }
    console.error(`[email:${context}] FormSubmit falló (${res.status}):`, data);
    return "failed";
  } catch (error) {
    console.error(`[email:${context}] Error de red con FormSubmit:`, error);
    return "failed";
  }
}
