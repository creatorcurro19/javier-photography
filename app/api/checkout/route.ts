import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { BASE_PRINT_FORMATS, formatPaperDimensions } from "@/data/formatos";
import { WORKS_EN } from "@/data/works-en";
import { localizeHref } from "@/lib/i18n-helpers";
import { SITE_URL } from "@/lib/metadata";
import { isSameOriginRequest } from "@/lib/server/admin-auth";
import { normalizeOrder } from "@/lib/server/order";
import { getClientIp, rateLimit } from "@/lib/server/rate-limit";
import { getShippingZones } from "@/types/cart";

/** Tax Code oficial de Stripe para envíos físicos (PostCheckoutSessions OpenAPI spec). */
const STRIPE_SHIPPING_TAX_CODE = "txcd_92010001";

export async function POST(request: Request) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json(
        { ok: false, error: "Origen de solicitud no permitido." },
        { status: 403 }
      );
    }

    const ip = getClientIp(request);
    const rl = rateLimit(`checkout:${ip}`, 8, 10 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { ok: false, error: "Demasiadas solicitudes de pago seguidas. Espera unos minutos." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const raw = await request.json().catch(() => null);
    if (raw && typeof raw === "object" && (raw as Record<string, unknown>)._gotcha) {
      return NextResponse.json({ ok: true, mode: "filtered" });
    }
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
    const automaticTaxEnabled = process.env.STRIPE_AUTOMATIC_TAX === "true";
    const adaptivePricingEnabled = process.env.STRIPE_ADAPTIVE_PRICING !== "false";
    const productTaxCode = process.env.STRIPE_PRODUCT_TAX_CODE?.trim() || "";

    const itemsSummary = order.items
      .map((it) => `${it.quantity}× ${it.title} (${it.format.name})`)
      .join(", ")
      .slice(0, 500);
    const shippingAddressSummary =
      `${order.customer.direccion}, ${order.customer.codigoPostal} ${order.customer.ciudad} (${order.customer.pais})`.slice(
        0,
        500
      );

    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("ui_mode", "hosted_page");
    params.append("origin_context", "web");
    params.append("submit_type", "pay");
    params.append("customer_creation", "if_required");
    params.append("locale", checkoutLang);
    params.append("customer_email", order.customer.email);
    params.append("client_reference_id", order.orderId);
    params.append(
      "branding_settings[display_name]",
      checkoutLang === "en" ? "Javier Espinosa Photography" : "Javier Espinosa Fotografía"
    );
    if (adaptivePricingEnabled) {
      params.append("adaptive_pricing[enabled]", "true");
    }
    if (automaticTaxEnabled) {
      params.append("automatic_tax[enabled]", "true");
      params.append("tax_id_collection[enabled]", "true");
      params.append("billing_address_collection", "required");
    }
    params.append(
      "success_url",
      `${SITE_URL}${printsPath}?pago=confirmado&ref=${encodeURIComponent(order.orderId)}&session_id={CHECKOUT_SESSION_ID}`
    );
    params.append(
      "cancel_url",
      `${SITE_URL}${printsPath}?pago=cancelado&ref=${encodeURIComponent(order.orderId)}`
    );
    params.append("payment_intent_data[description]", `Javier Espinosa Fine Art · ${order.orderId}`);
    params.append("payment_intent_data[receipt_email]", order.customer.email);
    params.append("payment_intent_data[metadata][orderId]", order.orderId);
    params.append(
      "payment_intent_data[metadata][shippingZone]",
      order.shippingZone || "canarias"
    );
    params.append("metadata[orderId]", order.orderId);
    params.append("metadata[lang]", checkoutLang);
    params.append("metadata[customerName]", order.customer.nombre);
    params.append("metadata[customerEmail]", order.customer.email);
    params.append("metadata[customerPhone]", order.customer.telefono || "");
    params.append("metadata[shippingAddress]", shippingAddressSummary);
    params.append("metadata[shippingZone]", order.shippingZone || "canarias");
    params.append("metadata[shippingCostEur]", String(order.shippingCost ?? 0));
    params.append("metadata[subtotalEur]", String(order.subtotal));
    params.append("metadata[expectedTotalEur]", String(order.total ?? order.subtotal));
    params.append("metadata[itemsSummary]", itemsSummary);

    order.items.forEach((item, index) => {
      const spec = BASE_PRINT_FORMATS[item.format.id];
      const localizedTitle =
        checkoutLang === "en" ? WORKS_EN[item.slug]?.title || item.title : item.title;
      const formatLabel =
        checkoutLang === "en" ? spec?.nameEn || item.format.name : item.format.name;
      const dimsLabel = formatPaperDimensions(
        item.format.dimensions || spec?.dimensions || "50 × 70 cm",
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
      if (automaticTaxEnabled) {
        params.append(`line_items[${index}][price_data][tax_behavior]`, "inclusive");
        if (productTaxCode) {
          params.append(`line_items[${index}][price_data][product_data][tax_code]`, productTaxCode);
        }
      }
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
      if (automaticTaxEnabled) {
        params.append(`line_items[${shippingIdx}][price_data][tax_behavior]`, "inclusive");
        params.append(
          `line_items[${shippingIdx}][price_data][product_data][tax_code]`,
          STRIPE_SHIPPING_TAX_CODE
        );
      }
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

    const bodyString = params.toString();
    const payloadHash = createHash("sha256").update(bodyString).digest("hex").slice(0, 24);
    const idempotencyKey = `${order.orderId}-${payloadHash}`;

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Idempotency-Key": idempotencyKey,
      },
      body: bodyString,
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
