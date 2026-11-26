import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { updateInboxItem } from "@/lib/server/inbox-store";
import { DESTINATION_EMAIL, sendWithResend } from "@/lib/server/email";

export const runtime = "nodejs";

/** Tolerancia de 5 minutos para evitar ataques de repetición (igual que la librería oficial de Stripe). */
const SIGNATURE_TOLERANCE_SECONDS = 300;

/**
 * Verifica la cabecera `Stripe-Signature` (esquema v1: HMAC-SHA256 de `${t}.${body}`).
 * https://docs.stripe.com/webhooks#verify-manually
 */
function verifyStripeSignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = header.split(",").map((p) => p.trim().split("=") as [string, string]);
  const timestamp = parts.find(([k]) => k === "t")?.[1];
  const signatures = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!timestamp || signatures.length === 0) return false;

  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  if (!Number.isFinite(age) || age > SIGNATURE_TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`, "utf8").digest();
  return signatures.some((sig) => {
    const received = Buffer.from(sig, "hex");
    return received.length === expected.length && timingSafeEqual(received, expected);
  });
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    // Sin secreto no hay forma de comprobar que el aviso viene de Stripe: no se procesa nada.
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET no configurado; evento rechazado.");
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 503 });
  }

  const rawBody = await request.text();
  if (!verifyStripeSignature(rawBody, request.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "Firma de Stripe no válida" }, { status: 400 });
  }

  let event: { type?: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Payload JSON inválido" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data?.object || {};
      // Con métodos de pago diferidos la sesión puede completarse sin cobro todavía.
      if (session.payment_status !== "paid") {
        return NextResponse.json({ received: true, ignored: "payment_status != paid" });
      }

      const metadata = (session.metadata as Record<string, string>) || {};
      const orderId =
        metadata.orderId ||
        (session.client_reference_id as string) ||
        (session.id as string);

      const amountTotal =
        typeof session.amount_total === "number" ? session.amount_total / 100 : undefined;
      const currency = ((session.currency as string) || "eur").toUpperCase();
      const customerEmail =
        (session.customer_details as { email?: string })?.email ||
        (session.customer_email as string) ||
        metadata.customerEmail;
      const paymentIntent = session.payment_intent as string | undefined;

      console.info(
        `[stripe-webhook] Pago confirmado para pedido ${orderId}: ${amountTotal} ${currency}`
      );

      // Actualizar estado en el Inbox del Admin
      if (orderId) {
        await updateInboxItem(orderId, {
          status: "pagado",
          notes: `Pago online completado vía Stripe (${amountTotal} ${currency}). Ref pasarela: ${paymentIntent || session.id}`,
        }).catch((err) => {
          console.warn("[stripe-webhook] Error actualizando estado en inbox:", err);
        });
      }

      // Notificar al fotógrafo por email
      await sendWithResend(
        {
          to: [DESTINATION_EMAIL],
          subject: `[PAGO RECIBIDO · STRIPE] Pedido ${orderId} — ${amountTotal} ${currency}`,
          text: [
            `PAGO CONFIRMADO VÍA STRIPE CHECKOUT`,
            `===================================`,
            `Referencia de Pedido: ${orderId}`,
            `Importe Cobrado: ${amountTotal} ${currency}`,
            `Cliente: ${metadata.customerName || "No especificado"} (${customerEmail || "Sin email"})`,
            `Dirección de Envío: ${metadata.shippingAddress || "Ver pedido original"}`,
            `Zona de Envío: ${metadata.shippingZone || "No especificada"}`,
            `ID de Transacción Stripe: ${paymentIntent || session.id}`,
            ``,
            `El estado del pedido en tu panel de administración ha pasado automáticamente a "Pagado (Stripe)".`,
            `Ya puedes comenzar a imprimir la copia en papel Hahnemühle Photo Rag 308g y preparar el tubo rígido.`,
          ].join("\n"),
        },
        "stripe-payment-confirmed"
      ).catch((err) => {
        console.warn("[stripe-webhook] Error enviando aviso de pago:", err);
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[stripe-webhook] Error procesando webhook:", error);
    return NextResponse.json(
      { error: "Error interno procesando evento Stripe" },
      { status: 500 }
    );
  }
}
