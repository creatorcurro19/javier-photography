"use client";

import { track } from "@vercel/analytics";

/**
 * Eventos de conversión medidos en Vercel Web Analytics (sin cookies, compatible RGPD).
 * Mantener los nombres estables: se usan como filtros en el panel de Vercel.
 */
export type ConversionEvent =
  | "contacto_enviado"
  | "checkout_iniciado"
  | "newsletter_alta"
  | "whatsapp_click"
  | "anadir_cesta"
  | "portal_cliente_acceso"
  | "portal_cliente_seleccion";

type EventProps = Record<string, string | number | boolean | null>;

export function trackEvent(name: ConversionEvent, props?: EventProps): void {
  try {
    track(name, props);
  } catch {
    // La analítica nunca debe romper la experiencia
  }
}
