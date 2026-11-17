import { NextResponse } from "next/server";
import type { CartOrder } from "@/types/cart";

const DESTINATION_EMAIL = "javierespinosa1995@hotmail.com";

export async function POST(request: Request) {
  try {
    const order: CartOrder = await request.json();

    if (!order.customer || !order.customer.email || !order.items || order.items.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Datos de pedido incompletos." },
        { status: 400 }
      );
    }

    const { customer, items, subtotal, orderId } = order;

    const itemsSummary = items
      .map(
        (it, idx) =>
          `${idx + 1}. [${it.title}] — ${it.format.name} (${it.format.dimensions}) | ${
            it.framed ? "CON MARCO MUSEO (+ UV 99%)" : "Lámina suelta"
          } | Cantidad: ${it.quantity} | Subtotal: ${it.totalPrice} €`
      )
      .join("\n");

    const subject = `[NUEVO PEDIDO FINE ART · REF: ${orderId}] ${customer.nombre} — ${subtotal} €`;

    const textBody = [
      `SOLICITUD DE PEDIDO FINE ART — JAVIER ESPINOSA PHOTOGRAPHY`,
      `============================================================`,
      `Referencia de Pedido: ${orderId}`,
      `Fecha: ${new Date().toLocaleString("es-ES")}`,
      `Importe Total: ${subtotal} €`,
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

    // 1. Resend API if RESEND_API_KEY is present
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Galería Javier Espinosa <onboarding@resend.dev>",
            to: [DESTINATION_EMAIL],
            reply_to: customer.email,
            subject,
            text: textBody,
          }),
        });

        if (resendRes.ok) {
          return NextResponse.json({ ok: true, provider: "resend", orderId });
        }
      } catch {
        // Fallback to relay
      }
    }

    // 2. FormSubmit relay
    try {
      const relayRes = await fetch(
        `https://formsubmit.co/ajax/${DESTINATION_EMAIL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Referer: "https://javier-photography.vercel.app/",
            Origin: "https://javier-photography.vercel.app",
          },
          body: JSON.stringify({
            _subject: subject,
            _replyto: customer.email,
            _captcha: "false",
            _template: "table",
            Referencia_Pedido: orderId,
            Nombre_Cliente: customer.nombre,
            Email: customer.email,
            Telefono: customer.telefono,
            Direccion_Envio: `${customer.direccion}, ${customer.codigoPostal} ${customer.ciudad} (${customer.pais})`,
            Total_Pedido: `${subtotal} €`,
            Obras: itemsSummary,
            Notas: customer.notas || "Ninguna",
          }),
        }
      );

      const relayData = await relayRes.json().catch(() => null);
      if (relayRes.ok && relayData && (relayData.success === "true" || relayData.success === true)) {
        return NextResponse.json({ ok: true, provider: "formsubmit", orderId });
      }
    } catch {
      // Continue to response
    }

    return NextResponse.json({
      ok: true,
      provider: "client-confirmed",
      orderId,
      destinationEmail: DESTINATION_EMAIL,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Error procesando el pedido." },
      { status: 500 }
    );
  }
}
