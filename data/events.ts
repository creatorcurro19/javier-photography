import type { PhotoCategory } from "@/types/photo";

/**
 * Calendario de próximas coberturas, desplazamientos y asistencias a rallyes o exposiciones.
 * REGLA ESTRICTA: No inventar eventos ni fechas.
 * Si este array está vacío (o todas las fechas han pasado), la sección NO se renderiza en el sitio.
 */

export interface UpcomingEvent {
  id: string;
  title: string;
  titleEn?: string;
  /** Fecha de inicio en formato ISO YYYY-MM-DD (usada para ordenar y ocultar eventos ya pasados) */
  startDate: string;
  /** Fecha de fin opcional en formato ISO YYYY-MM-DD */
  endDate?: string;
  /** Texto legible de fecha (ej. "14 – 16 Noviembre 2026") */
  displayDate: string;
  displayDateEn?: string;
  location: string;
  locationEn?: string;
  discipline: string;
  disciplineEn?: string;
  category: PhotoCategory;
  /** Estado de disponibilidad para encargos de equipos o prensa durante el evento */
  availability: "abierta" | "ultimas-plazas" | "completa";
  notes?: string;
  notesEn?: string;
  url?: string;
}

// Ejemplo de uso para cuando Javier confirme una fecha en calendario:
// {
//   id: "rally-historico-tenerife",
//   title: "Rallye Histórico en Tenerife · Cobertura de Tramo y Paddock",
//   startDate: "2026-12-12",
//   endDate: "2026-12-13",
//   displayDate: "12 – 13 Diciembre 2026",
//   location: "Tenerife · Islas Canarias",
//   discipline: "Automovilismo & Rally",
//   category: "coches-rally",
//   availability: "abierta",
//   notes: "Disponible para cobertura dedicada de escuderías y vehículos participantes.",
// }
export const upcomingEvents: UpcomingEvent[] = [];

export function getActiveUpcomingEvents(referenceDate = new Date()): UpcomingEvent[] {
  const todayIso = referenceDate.toISOString().slice(0, 10);
  return upcomingEvents
    .filter((ev) => (ev.endDate || ev.startDate) >= todayIso)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}
