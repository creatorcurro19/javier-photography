/**
 * Elementos verificados de prueba social (clientes, publicaciones y testimonios).
 * REGLA ESTRICTA: No inventar testimonios ni clientes.
 * Si este array está vacío, la sección de prueba social NO se renderiza en el sitio.
 */

export interface SocialProofItem {
  id: string;
  type: "client" | "publication" | "testimonial";
  name: string;
  roleOrOutlet?: string;
  location?: string;
  year?: number;
  quote?: string;
  quoteEn?: string;
  logo?: string;
  url?: string;
}

/** Espacio reservado para testimonios o publicaciones reales verificadas cuando existan. */
export const socialProofItems: SocialProofItem[] = [];
