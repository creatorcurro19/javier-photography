/**
 * TRABAJOS Y COLABORACIONES VERIFICADAS (/data/trabajos.ts)
 * Mantener vacío mientras no existan publicaciones, clientes o proyectos confirmados por el autor.
 */

export interface TrabajoItem {
  id: string;
  title: string;
  titleEn?: string;
  clientOrMedium: string;
  clientOrMediumEn?: string;
  year: number;
  category?: string;
  url?: string;
  description?: string;
  descriptionEn?: string;
}

export const TRABAJOS: TrabajoItem[] = [];
