import { NextResponse } from "next/server";
import { updateInboxItem } from "@/lib/server/inbox-store";
import { DESTINATION_EMAIL, sendWithResend } from "@/lib/server/email";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let event: { type?: string; data?: { object?: Record<string, unknown> } };

    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Payload JSON inválido" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data?.object || {};
      const metadata = (session.metadata as Record<string, string>) || {};
      const orderId =
        metadata.orderId ||
        (session.client_reference_id as string) ||
        (session.id as string);

      const amountTotal =
        typeof session.amount_total === "number"
          ? session.amount_total / 100
          : undefined;
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
