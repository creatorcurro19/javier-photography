import { NextResponse } from "next/server";
import {
  buildOrderCustomerEmailHtml,
  buildOrderOwnerEmailHtml,
} from "@/lib/email-templates";
import { normalizeOrder } from "@/lib/server/order";
import { DESTINATION_EMAIL, relayWithFormSubmit, sendWithResend } from "@/lib/server/email";
import { addInboxItem } from "@/lib/server/inbox-store";

export async function POST(request: Request) {
  try {
    const raw = await request.json().catch(() => null);
    const result = normalizeOrder(raw);
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }
    // Importes recalculados en servidor a partir del catálogo.
    const order = result.order;
    const { customer, items, subtotal, shippingCost = 0, total = subtotal, shippingZone = "canarias", orderId } = order;

    const itemsSummary = items
      .map(
        (it, idx) =>
          `${idx + 1}. [${it.title}] — ${it.format.name} (${it.format.dimensions}) | ${
            it.framed ? "CON MARCO MUSEO (+ UV 99%)" : "Lámina suelta"
          } | Cantidad: ${it.quantity} | Subtotal: ${it.totalPrice} €`
      )
      .join("\n");

    const subject = `[NUEVO PEDIDO FINE ART · REF: ${orderId}] ${customer.nombre} — ${total} €`;

    const textBody = [
      `SOLICITUD DE PEDIDO FINE ART — JAVIER ESPINOSA PHOTOGRAPHY`,
      `============================================================`,
      `Referencia de Pedido: ${orderId}`,
      `Fecha: ${new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}`,
      `Subtotal Obras: ${subtotal} €`,
      `Gastos de Envío (${shippingZone}): ${shippingCost} €`,
      `Total del Pedido: ${total} €`,
      `Estado del pago: pendiente (si el comprador paga con Stripe recibirás un aviso aparte de "PAGO CONFIRMADO").`,
      ``,
      `DATOS DEL COLECCIONISTA / COMPRADOR:`,
      `------------------------------------`,
      `Nombre: ${customer.nombre}`,
      `Email: ${customer.email}`,
      `Teléfono: ${customer.telefono}`,
      `Dirección: ${customer.direccion}`,
      `Ciudad y C.P.: ${customer.ciudad}, ${customer.codigoPostal}`,
      `País: ${customer.pais}`,
      `Notas / Instrucciones: ${customer.notas || "Sin notas adicionales"}`,
      ``,
      `OBRAS SOLICITADAS:`,
      `------------------`,
      itemsSummary,
      ``,
      `SOPORTE: Papel 100% algodón Hahnemühle Photo Rag® 308 g/m² (ISO 9706).`,
      `CERTIFICADO: Numerado y firmado a mano por Javier Espinosa Martínez.`,
    ].join("\n");

    // Registrar en la bandeja de administración
    try {
      await addInboxItem({
        id: orderId,
        type: "pedido",
        customerName: customer.nombre,
        customerEmail: customer.email,
        customerPhone: customer.telefono || undefined,
        subject: `Pedido Fine Art (${orderId}) — ${total} €`,
        message: customer.notas || "Sin notas adicionales del cliente.",
        status: "pendiente",
        orderTotal: total,
        items: items.map((it) => ({
          title: it.title,
          format: `${it.format.name} (${it.format.dimensions})`,
          quantity: it.quantity,
          price: it.totalPrice,
        })),
        shippingAddress: `${customer.direccion}, ${customer.codigoPostal} ${customer.ciudad} (${customer.pais})`,
        notes: `Zona: ${shippingZone} (Envío: ${shippingCost} €). Total a cobrar: ${total} €`,
      });
    } catch (err) {
      console.warn("[order] Error guardando en bandeja de admin:", err);
    }

    // 1. Resend: aviso al autor + confirmación al comprador
    const ownerSent = await sendWithResend(
      {
        to: [DESTINATION_EMAIL],
        replyTo: customer.email,
        subject,
        text: textBody,
        html: buildOrderOwnerEmailHtml(order),
      },
      "order-owner"
    );

    if (ownerSent) {
      await sendWithResend(
        {
          to: [customer.email],
          replyTo: DESTINATION_EMAIL,
          subject: `Confirmación de Reserva Fine Art · Ref. ${orderId} — Javier Espinosa`,
          text: textBody,
          html: buildOrderCustomerEmailHtml(order),
        },
        "order-customer"
      );
      return NextResponse.json({ ok: true, provider: "resend", orderId, subtotal });
    }

    // 2. FormSubmit como respaldo
    const relay = await relayWithFormSubmit(
      {
        _subject: subject,
        _replyto: customer.email,
        Referencia_Pedido: orderId,
        Nombre_Cliente: customer.nombre,
        Email: customer.email,
        Telefono: customer.telefono,
        Direccion_Envio: `${customer.direccion}, ${customer.codigoPostal} ${customer.ciudad} (${customer.pais})`,
        Total_Pedido: `${subtotal} €`,
        Obras: itemsSummary,
        Notas: customer.notas || "Ninguna",
      },
      "order"
    );

    if (relay === "sent") {
      return NextResponse.json({ ok: true, provider: "formsubmit", orderId, subtotal });
    }

    // Informe honesto: el pedido NO ha llegado a Javier. El cliente debe ofrecer una vía alternativa.
    console.error(`[order] Pedido ${orderId} NO entregado por ningún proveedor de correo.`);
    return NextResponse.json(
      {
        ok: false,
        delivered: false,
        orderId,
        destinationEmail: DESTINATION_EMAIL,
        error:
          "No hemos podido registrar tu pedido automáticamente. Escríbenos directamente para completarlo.",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("[order] Error inesperado:", error);
    return NextResponse.json(
      { ok: false, error: "Error procesando el pedido." },
      { status: 500 }
    );
  }
}
