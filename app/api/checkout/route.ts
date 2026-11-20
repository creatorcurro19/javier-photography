import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/metadata";
import { normalizeOrder } from "@/lib/server/order";

export async function POST(request: Request) {
  try {
    const raw = await request.json().catch(() => null);
    const result = normalizeOrder(raw);
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }
    // Importes recalculados en servidor: se ignora cualquier precio enviado por el navegador.
    const order = result.order;

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({
        ok: true,
        mode: "reservation",
        orderId: order.orderId,
      });
    }

    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("customer_email", order.customer.email);
    params.append("client_reference_id", order.orderId);
    params.append(
      "success_url",
      `${SITE_URL}/prints?pago=confirmado&ref=${encodeURIComponent(order.orderId)}`
    );
    params.append(
      "cancel_url",
      `${SITE_URL}/prints?pago=cancelado&ref=${encodeURIComponent(order.orderId)}`
    );
    params.append("metadata[orderId]", order.orderId);
    params.append("metadata[customerName]", order.customer.nombre);
    params.append("metadata[customerPhone]", order.customer.telefono || "");
    params.append(
      "metadata[shippingAddress]",
      `${order.customer.direccion}, ${order.customer.codigoPostal} ${order.customer.ciudad} (${order.customer.pais})`.slice(0, 500)
    );
    params.append("metadata[expectedTotalEur]", String(order.subtotal));

    order.items.forEach((item, index) => {
      const description = `${item.format.name} (${item.format.dimensions}) · ${
        item.framed ? "Con Marco Museo UV 99%" : "Lámina Hahnemühle Photo Rag 308g"
      }`;
      params.append(`line_items[${index}][quantity]`, String(item.quantity));
      params.append(`line_items[${index}][price_data][currency]`, "eur");
      params.append(
        `line_items[${index}][price_data][unit_amount]`,
        String(Math.round(item.unitPrice * 100))
      );
      params.append(
        `line_items[${index}][price_data][product_data][name]`,
        `Fine Art: ${item.title}`
      );
      params.append(
        `line_items[${index}][price_data][product_data][description]`,
        description
      );
      if (item.image.startsWith("/")) {
        params.append(
          `line_items[${index}][price_data][product_data][images][0]`,
          `${SITE_URL}${item.image}`
        );
      }
    });

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await stripeRes.json().catch(() => null);

    if (!stripeRes.ok || !session?.url) {
      console.error(
        `[checkout] Stripe no creó la sesión (${stripeRes.status}) para ${order.orderId}:`,
        session?.error?.message ?? session
      );
      return NextResponse.json({
        ok: true,
        mode: "reservation",
        orderId: order.orderId,
      });
    }

    return NextResponse.json({
      ok: true,
      mode: "stripe",
      url: session.url,
      orderId: order.orderId,
    });
  } catch (error) {
    console.error("[checkout] Error inesperado:", error);
    return NextResponse.json(
      { ok: false, error: "Error inicializando el pago seguro." },
      { status: 500 }
    );
  }
}
