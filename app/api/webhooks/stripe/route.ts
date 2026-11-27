import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { buildStripePaymentCustomerEmailHtml } from "@/lib/email-templates";
import { buildWhatsAppReplyUrl } from "@/lib/phone";
import { addInboxItem, updateInboxItem } from "@/lib/server/inbox-store";
import { DESTINATION_EMAIL, RESEND_OWNER_EMAIL, sendWithResend } from "@/lib/server/email";
import { notifyOwnerMobile } from "@/lib/server/mobile-push";

export const runtime = "nodejs";

/** Tolerancia de 5 minutos para evitar ataques de repetición (igual que la librería oficial de Stripe). */
const SIGNATURE_TOLERANCE_SECONDS = 300;
const MAX_TRACKED_EVENTS = 500;
const processedEvents = new Set<string>();

function rememberProcessedEvent(eventId: string) {
  processedEvents.add(eventId);
  if (processedEvents.size > MAX_TRACKED_EVENTS) {
    const oldest = processedEvents.values().next().value;
    if (oldest) processedEvents.delete(oldest);
  }
}

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

function extractSessionContext(session: Record<string, unknown>) {
  const metadata = (session.metadata as Record<string, string>) || {};
  const sessionId = typeof session.id === "string" ? session.id : "";
  const orderId =
    metadata.orderId ||
    (session.client_reference_id as string) ||
    sessionId ||
    "STRIPE-SESSION";
  const amountTotal =
    typeof session.amount_total === "number" ? session.amount_total / 100 : undefined;
  const currency = ((session.currency as string) || "eur").toUpperCase();
  const amountLabel =
    amountTotal !== undefined
      ? `${Number.isInteger(amountTotal) ? amountTotal : amountTotal.toFixed(2)} ${currency}`
      : `Importe pendiente (${currency})`;

  const presentmentDetails = session.presentment_details as
    | { presentment_amount?: number; presentment_currency?: string }
    | undefined;
  const presentmentNote =
    presentmentDetails &&
    typeof presentmentDetails.presentment_amount === "number" &&
    typeof presentmentDetails.presentment_currency === "string" &&
    presentmentDetails.presentment_currency.toUpperCase() !== currency
      ? ` (Cobro Adaptive Pricing al cliente: ${(presentmentDetails.presentment_amount / 100).toFixed(2)} ${presentmentDetails.presentment_currency.toUpperCase()})`
      : "";

  const customerDetails = session.customer_details as
    | { email?: string; name?: string; phone?: string }
    | undefined;
  const customerName = metadata.customerName || customerDetails?.name || "No especificado";
  const customerEmail =
    customerDetails?.email || (session.customer_email as string) || metadata.customerEmail || "";
  const customerPhone = metadata.customerPhone || customerDetails?.phone || "";
  const shippingAddress = metadata.shippingAddress || "Ver pedido original";
  const shippingZone = metadata.shippingZone || "No especificada";
  const itemsSummary = metadata.itemsSummary || "";
  const lang: "es" | "en" = metadata.lang === "en" ? "en" : "es";
  const paymentIntent =
    typeof session.payment_intent === "string" ? session.payment_intent : undefined;
  const gatewayRef = paymentIntent || sessionId;
  const isMockEvent = sessionId.startsWith("cs_test_mock_");

  return {
    orderId,
    sessionId,
    amountTotal,
    amountLabel,
    currency,
    presentmentNote,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    shippingZone,
    itemsSummary,
    lang,
    gatewayRef,
    isMockEvent,
  };
}

async function handlePaidSession(session: Record<string, unknown>) {
  const ctx = extractSessionContext(session);
  const whatsappUrl = buildWhatsAppReplyUrl(
    ctx.customerPhone,
    ctx.lang === "en"
      ? `Hello ${ctx.customerName}, this is Javier Espinosa confirming payment for your Fine Art order ${ctx.orderId}.`
      : `Hola ${ctx.customerName}, soy Javier Espinosa. Confirmamos tu pago del pedido Fine Art (${ctx.orderId}).`
  );

  console.info(`[stripe-webhook] Pago confirmado para pedido ${ctx.orderId}: ${ctx.amountLabel}`);

  const paidNotes = `Pago online completado vía Stripe (${ctx.amountLabel})${ctx.presentmentNote}. Ref pasarela: ${ctx.gatewayRef}`;
  const updated = await updateInboxItem(ctx.orderId, {
    status: "pagado",
    notes: paidNotes,
  }).catch((err) => {
    console.warn("[stripe-webhook] Error actualizando estado en inbox:", err);
    return null;
  });

  // Si la función serverless arrancó en frío o el cliente pagó directo con Stripe sin /api/order previo, crear registro pagado.
  if (!updated && !ctx.isMockEvent) {
    await addInboxItem({
      id: ctx.orderId,
      type: "pedido",
      customerName: ctx.customerName,
      customerEmail: ctx.customerEmail,
      customerPhone: ctx.customerPhone || undefined,
      subject: `Pedido Fine Art (${ctx.orderId}) — ${ctx.amountLabel}`,
      message: ctx.itemsSummary || "Pedido completado directamente vía Stripe Checkout.",
      status: "pagado",
      orderTotal: ctx.amountTotal,
      shippingAddress: ctx.shippingAddress,
      notes: paidNotes,
    }).catch((err) => {
      console.warn("[stripe-webhook] Error creando registro pagado en inbox:", err);
    });
  }

  await notifyOwnerMobile({
    kind: "pago",
    title: `Pago Stripe confirmado · ${ctx.amountLabel}`,
    message: [
      `Pedido: ${ctx.orderId}`,
      `Cliente: ${ctx.customerName} (${ctx.customerEmail || "Sin email"})`,
      ctx.itemsSummary ? `Obras: ${ctx.itemsSummary}` : "",
      `Zona: ${ctx.shippingZone}${ctx.presentmentNote}`,
    ]
      .filter(Boolean)
      .join("\n"),
    priority: 5,
    tags: ["moneybag", "white_check_mark"],
    tab: "inbox",
    whatsappUrl,
  }).catch((err) => {
    console.warn("[stripe-webhook] Error enviando aviso móvil:", err);
  });

  await sendWithResend(
    {
      to: [RESEND_OWNER_EMAIL],
      replyTo: ctx.customerEmail || undefined,
      subject: `[PAGO RECIBIDO · STRIPE] Pedido ${ctx.orderId} — ${ctx.amountLabel}`,
      text: [
        `PAGO CONFIRMADO VÍA STRIPE CHECKOUT`,
        `===================================`,
        `Referencia de Pedido: ${ctx.orderId}`,
        `Importe Cobrado: ${ctx.amountLabel}${ctx.presentmentNote}`,
        `Cliente: ${ctx.customerName} (${ctx.customerEmail || "Sin email"})`,
        ctx.customerPhone ? `Teléfono: ${ctx.customerPhone}` : "",
        `Dirección de Envío: ${ctx.shippingAddress}`,
        `Zona de Envío: ${ctx.shippingZone}`,
        ctx.itemsSummary ? `Obras: ${ctx.itemsSummary}` : "",
        `ID de Transacción Stripe: ${ctx.gatewayRef}`,
        ``,
        `El estado del pedido en tu panel de administración ha pasado automáticamente a "Pagado (Stripe)".`,
        `Ya puedes comenzar a imprimir la copia en papel Hahnemühle Photo Rag 308g y preparar el tubo rígido.`,
      ]
        .filter(Boolean)
        .join("\n"),
    },
    "stripe-payment-confirmed"
  ).catch((err) => {
    console.warn("[stripe-webhook] Error enviando aviso de pago:", err);
  });

  if (ctx.customerEmail && !ctx.isMockEvent) {
    await sendWithResend(
      {
        to: [ctx.customerEmail],
        replyTo: DESTINATION_EMAIL,
        subject:
          ctx.lang === "en"
            ? `Payment Confirmed · Order ${ctx.orderId} — Javier Espinosa`
            : `Pago Confirmado · Pedido ${ctx.orderId} — Javier Espinosa`,
        text:
          ctx.lang === "en"
            ? `Dear ${ctx.customerName}, we received your Stripe payment (${ctx.amountLabel}) for order ${ctx.orderId}. Reference: ${ctx.gatewayRef}.`
            : `Estimado/a ${ctx.customerName}, hemos recibido tu pago vía Stripe (${ctx.amountLabel}) para el pedido ${ctx.orderId}. Ref: ${ctx.gatewayRef}.`,
        html: buildStripePaymentCustomerEmailHtml({
          orderId: ctx.orderId,
          customerName: ctx.customerName,
          amountLabel: ctx.amountLabel,
          itemsSummary: ctx.itemsSummary,
          shippingAddress: ctx.shippingAddress,
          lang: ctx.lang,
        }),
      },
      "stripe-payment-customer"
    ).catch((err) => {
      console.warn("[stripe-webhook] Error enviando recibo al cliente:", err);
    });
  }
}

async function handleAsyncPaymentFailed(session: Record<string, unknown>) {
  const ctx = extractSessionContext(session);
  console.warn(`[stripe-webhook] Pago diferido fallido para pedido ${ctx.orderId} (${ctx.gatewayRef})`);

  await updateInboxItem(ctx.orderId, {
    notes: `AVISO: El cobro diferido en Stripe falló (${ctx.gatewayRef}). No producir ni enviar hasta confirmar pago.`,
  }).catch(() => null);

  await notifyOwnerMobile({
    kind: "pago",
    title: `Pago Stripe fallido · ${ctx.orderId}`,
    message: `El pago diferido de ${ctx.customerName} (${ctx.customerEmail || "Sin email"}) no se completó. NO producir ni enviar la copia hasta confirmar cobro.`,
    priority: 5,
    tags: ["warning", "x"],
    tab: "inbox",
  }).catch(() => null);
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

  let event: { id?: string; type?: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Payload JSON inválido" }, { status: 400 });
  }

  if (typeof event.id === "string" && event.id && processedEvents.has(event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    const session = event.data?.object || {};

    if (event.type === "checkout.session.completed") {
      // Con métodos diferidos la sesión puede completarse antes de liquidarse el cobro.
      if (session.payment_status !== "paid") {
        if (typeof event.id === "string" && event.id) rememberProcessedEvent(event.id);
        return NextResponse.json({ received: true, ignored: "payment_status != paid" });
      }
      await handlePaidSession(session);
    } else if (event.type === "checkout.session.async_payment_succeeded") {
      await handlePaidSession(session);
    } else if (event.type === "checkout.session.async_payment_failed") {
      await handleAsyncPaymentFailed(session);
    } else if (event.type === "checkout.session.expired") {
      const ctx = extractSessionContext(session);
      console.info(`[stripe-webhook] Sesión expirada sin pago para ${ctx.orderId}`);
    }

    if (typeof event.id === "string" && event.id) {
      rememberProcessedEvent(event.id);
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
