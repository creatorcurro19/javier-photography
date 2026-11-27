import { PLAZOS } from "@/data/plazos";
import type { CartOrder } from "@/types/cart";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrapEmailShell(title: string, subtitle: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#0B0C0E;color:#EBE7DF;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0B0C0E;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#151618;border:1px solid rgba(197,168,128,0.35);">
          <!-- Top Gold Accent Bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#8A6F4E,#C5A880,#E5CCA8,#C5A880,#8A6F4E);"></td>
          </tr>

          <!-- Header Monogram -->
          <tr>
            <td align="center" style="padding:36px 32px 24px 32px;border-bottom:1px solid rgba(197,168,128,0.2);">
              <div style="display:inline-block;border:1px solid rgba(197,168,128,0.55);padding:8px 16px;font-family:Arial,Helvetica,sans-serif;font-size:18px;letter-spacing:6px;color:#F7F4EE;margin-bottom:16px;">
                JE
              </div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C5A880;">
                ${escapeHtml(subtitle)}
              </div>
              <h1 style="margin:12px 0 0 0;font-size:26px;font-weight:300;color:#F7F4EE;letter-spacing:1px;">
                ${escapeHtml(title)}
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#D4CEC3;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 32px;background-color:#0E0F11;border-top:1px solid rgba(197,168,128,0.2);font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8E8A80;letter-spacing:1px;">
              <p style="margin:0 0 6px 0;color:#C5A880;letter-spacing:3px;text-transform:uppercase;">
                JAVIER ESPINOSA · THE ART OF SEEING
              </p>
              <p style="margin:0;">
                Hahnemühle Photo Rag® 308 g/m² · Norma ISO 9706 · Certificado Firmado y Numerado
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildItemsTableHtml(order: CartOrder): string {
  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="font-family:Georgia,serif;font-size:15px;color:#F7F4EE;">${escapeHtml(item.title)}</div>
          <div style="font-size:12px;color:#8E8A80;margin-top:3px;">
            ${escapeHtml(item.format.name)} (${escapeHtml(item.format.dimensions)}) · ${
              item.framed ? "Con Marco Museo UV 99%" : "Lámina suelta Hahnemühle"
            } · Cantidad: ${item.quantity}
          </div>
        </td>
        <td align="right" style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);font-family:monospace;font-size:14px;color:#EBE7DF;white-space:nowrap;">
          ${item.totalPrice} €
        </td>
      </tr>`
    )
    .join("");

  const shippingRow =
    order.shippingCost !== undefined
      ? `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);font-size:12px;color:#8E8A80;">
          Envío asegurado en tubo rígido (${order.shippingZone === "canarias" ? "Canarias" : order.shippingZone === "peninsula" ? "Península y Baleares" : order.shippingZone === "europa" ? "Unión Europea y Europa" : "Estados Unidos y Resto del Mundo"})
        </td>
        <td align="right" style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);font-family:monospace;font-size:13px;color:#EBE7DF;">
          ${order.shippingCost === 0 ? "Gratis (incluido)" : `${order.shippingCost} €`}
        </td>
      </tr>`
      : "";

  const finalTotal = order.total ?? order.subtotal + (order.shippingCost ?? 0);

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0;border-top:1px solid rgba(197,168,128,0.25);">
      ${rows}
      ${shippingRow}
      <tr>
        <td style="padding:16px 0 0 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#C5A880;">
          Importe Total
        </td>
        <td align="right" style="padding:16px 0 0 0;font-family:Georgia,serif;font-size:22px;color:#F7F4EE;">
          ${finalTotal} €
        </td>
      </tr>
    </table>`;
}

export function buildOrderOwnerEmailHtml(order: CartOrder): string {
  const { customer, orderId } = order;
  const body = `
    <p style="margin:0 0 16px 0;">
      Se ha registrado una nueva solicitud de obra Fine Art con referencia
      <strong style="color:#C5A880;">${escapeHtml(orderId)}</strong>.
    </p>
    <div style="background-color:#0E0F11;border:1px solid rgba(255,255,255,0.08);padding:16px 20px;margin-bottom:20px;">
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#C5A880;margin-bottom:8px;">
        Datos del Coleccionista
      </div>
      <p style="margin:4px 0;"><strong style="color:#F7F4EE;">Nombre:</strong> ${escapeHtml(customer.nombre)}</p>
      <p style="margin:4px 0;"><strong style="color:#F7F4EE;">Email:</strong> ${escapeHtml(customer.email)}</p>
      <p style="margin:4px 0;"><strong style="color:#F7F4EE;">Teléfono:</strong> ${escapeHtml(customer.telefono || "No indicado")}</p>
      <p style="margin:4px 0;"><strong style="color:#F7F4EE;">Envío:</strong> ${escapeHtml(customer.direccion)}, ${escapeHtml(customer.codigoPostal)} ${escapeHtml(customer.ciudad)} (${escapeHtml(customer.pais)})</p>
      ${
        customer.notas
          ? `<p style="margin:8px 0 0 0;"><strong style="color:#F7F4EE;">Notas:</strong> ${escapeHtml(customer.notas)}</p>`
          : ""
      }
    </div>
    ${buildItemsTableHtml(order)}
  `;

  return wrapEmailShell(
    `Nuevo Pedido Fine Art · ${orderId}`,
    "Adquisición de Obra Certificada",
    body
  );
}

export function buildOrderCustomerEmailHtml(order: CartOrder): string {
  const { customer, orderId } = order;
  const body = `
    <p style="margin:0 0 16px 0;">
      Estimado/a <strong style="color:#F7F4EE;">${escapeHtml(customer.nombre)}</strong>,
    </p>
    <p style="margin:0 0 16px 0;">
      Gracias por tu interés en la obra de Javier Espinosa Martínez. Hemos registrado correctamente tu reserva con referencia
      <strong style="color:#C5A880;">${escapeHtml(orderId)}</strong>.
    </p>
    ${buildItemsTableHtml(order)}
    <p style="margin:20px 0 0 0;font-size:13px;color:#8E8A80;">
      Cada ejemplar se produce bajo demanda con supervisión de color sobre papel 100% algodón Hahnemühle Photo Rag® 308 g/m², numerado y firmado a mano por el autor. ${PLAZOS.copias}
    </p>
  `;

  return wrapEmailShell(
    `Confirmación de Reserva · ${orderId}`,
    "Colección Fine Art · Javier Espinosa",
    body
  );
}

export function buildContactOwnerEmailHtml(payload: {
  nombre: string;
  email: string;
  motivo: string;
  asunto: string;
  mensaje: string;
}): string {
  const body = `
    <div style="background-color:#0E0F11;border:1px solid rgba(255,255,255,0.08);padding:16px 20px;margin-bottom:20px;">
      <p style="margin:4px 0;"><strong style="color:#C5A880;">Remitente:</strong> ${escapeHtml(payload.nombre)}</p>
      <p style="margin:4px 0;"><strong style="color:#C5A880;">Email:</strong> ${escapeHtml(payload.email)}</p>
      <p style="margin:4px 0;"><strong style="color:#C5A880;">Motivo:</strong> ${escapeHtml(payload.motivo)}</p>
      <p style="margin:4px 0;"><strong style="color:#C5A880;">Asunto:</strong> ${escapeHtml(payload.asunto)}</p>
    </div>
    <div style="padding:18px 20px;border-left:2px solid #C5A880;background-color:#0E0F11;white-space:pre-wrap;color:#F7F4EE;">
      ${escapeHtml(payload.mensaje)}
    </div>
  `;

  return wrapEmailShell(
    payload.asunto || "Nueva Consulta Privada",
    "Contacto Directo · Estudio Javier Espinosa",
    body
  );
}
