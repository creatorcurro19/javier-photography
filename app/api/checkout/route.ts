import { NextResponse } from "next/server";
import { BASE_PRINT_FORMATS, formatPaperDimensions } from "@/data/formatos";
import { WORKS_EN } from "@/data/works-en";
import { localizeHref } from "@/lib/i18n-helpers";
import { SITE_URL } from "@/lib/metadata";
import { normalizeOrder } from "@/lib/server/order";
import { getShippingZones } from "@/types/cart";

export async function POST(request: Request) {
  try {
    const raw = await request.json().catch(() => null);
    const checkoutLang =
      raw && typeof raw === "object" && (raw as Record<string, unknown>).lang === "en"
        ? "en"
        : "es";
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

    const printsPath = localizeHref("/prints", checkoutLang);
    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("locale", checkoutLang);
    params.append("customer_email", order.customer.email);
    params.append("client_reference_id", order.orderId);
    params.append(
      "success_url",
      `${SITE_URL}${printsPath}?pago=confirmado&ref=${encodeURIComponent(order.orderId)}`
    );
    params.append(
      "cancel_url",
      `${SITE_URL}${printsPath}?pago=cancelado&ref=${encodeURIComponent(order.orderId)}`
    );
    params.append("metadata[orderId]", order.orderId);
    params.append("metadata[customerName]", order.customer.nombre);
    params.append("metadata[customerPhone]", order.customer.telefono || "");
    params.append(
      "metadata[shippingAddress]",
      `${order.customer.direccion}, ${order.customer.codigoPostal} ${order.customer.ciudad} (${order.customer.pais})`.slice(0, 500)
    );
    params.append("metadata[shippingZone]", order.shippingZone || "canarias");
    params.append("metadata[shippingCostEur]", String(order.shippingCost ?? 0));
    params.append("metadata[subtotalEur]", String(order.subtotal));
    params.append("metadata[expectedTotalEur]", String(order.total ?? order.subtotal));

    order.items.forEach((item, index) => {
      const spec = BASE_PRINT_FORMATS[item.format.id];
      const localizedTitle =
        checkoutLang === "en" ? WORKS_EN[item.slug]?.title || item.title : item.title;
      const formatLabel =
        checkoutLang === "en" ? spec?.nameEn || item.format.name : item.format.name;
      const dimsLabel = formatPaperDimensions(
        spec?.dimensions || item.format.dimensions,
        checkoutLang
      );
      const finishLabel =
        checkoutLang === "en"
          ? item.framed
            ? "With Museum UV 99% Frame"
            : "Unframed Hahnemühle Photo Rag 308g print"
          : item.framed
            ? "Con Marco Museo UV 99%"
            : "Lámina Hahnemühle Photo Rag 308g";
      const description = `${formatLabel} (${dimsLabel}) · ${finishLabel}`;
      params.append(`line_items[${index}][quantity]`, String(item.quantity));
      params.append(`line_items[${index}][price_data][currency]`, "eur");
      params.append(
        `line_items[${index}][price_data][unit_amount]`,
        String(Math.round(item.unitPrice * 100))
      );
      params.append(
        `line_items[${index}][price_data][product_data][name]`,
        `Fine Art: ${localizedTitle}`
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

    // Envío en tubo rígido si aplica coste
    if (order.shippingCost && order.shippingCost > 0) {
      const shippingIdx = order.items.length;
      const localizedZones = getShippingZones(checkoutLang);
      const zoneInfo = order.shippingZone ? localizedZones[order.shippingZone] : null;
      params.append(`line_items[${shippingIdx}][quantity]`, "1");
      params.append(`line_items[${shippingIdx}][price_data][currency]`, "eur");
      params.append(
        `line_items[${shippingIdx}][price_data][unit_amount]`,
        String(Math.round(order.shippingCost * 100))
      );
      params.append(
        `line_items[${shippingIdx}][price_data][product_data][name]`,
        checkoutLang === "en"
          ? `Insured rigid tube shipping (${zoneInfo?.label || "International"})`
          : `Envío asegurado en tubo rígido (${zoneInfo?.label || "Península"})`
      );
      params.append(
        `line_items[${shippingIdx}][price_data][product_data][description]`,
        zoneInfo?.deliveryDays ||
          (checkoutLang === "en"
            ? "Certified delivery in high-density rigid cylindrical tube"
            : "Entrega certificada en tubo rígido cilíndrico de alta densidad")
      );
    }

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
