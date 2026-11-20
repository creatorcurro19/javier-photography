import "server-only";

import { getAllPhotos } from "@/lib/photos";
import type { Photo } from "@/types/photo";
import type { UnlockedClientGallery } from "@/types/client-gallery";

export interface ClientGallery {
  code: string;
  aliases?: string[];
  clientName: string;
  projectTitle: string;
  date: string;
  location: string;
  note: string;
  maxSelection: number;
  photoSlugs: string[];
}

/**
 * Registro de entregas privadas para clientes de encargos (rallyes, arquitectura, editorial).
 * PROTEGIDO CON `server-only`: este archivo jamás se incluye en el bundle JavaScript del navegador.
 * Para crear una nueva entrega, añade un bloque con una clave única y los slugs de obra.
 */
export const CLIENT_GALLERIES: ClientGallery[] = [
  {
    code: "RALLY2026",
    aliases: ["DEMO", "MUESTRA"],
    clientName: "Escudería Histórica · Sala de Muestra",
    projectTitle: "Cobertura Tramo Cronometrado & Asistencia",
    date: "Temporada 2026",
    location: "Tenerife · Canarias",
    note: "Selección privada en alta resolución para revisión del equipo. Marca tus fotografías favoritas y pulsa «Enviar Selección» para recibir los archivos máster calibrados (TIFF 16-bit / JPEG 300 DPI).",
    maxSelection: 10,
    photoSlugs: [
      "parque-de-trabajo",
      "optica-clasica-en-el-box",
      "preparacion-en-paddock",
      "clasico-a-tres-ruedas",
      "trazada-del-golf-mk1",
      "frenada-en-horquilla",
    ],
  },
];

export function findClientGallery(rawCode: string): ClientGallery | undefined {
  const normalized = rawCode.trim().toUpperCase();
  if (!normalized) return undefined;
  return CLIENT_GALLERIES.find(
    (g) =>
      g.code.toUpperCase() === normalized ||
      g.aliases?.some((a) => a.toUpperCase() === normalized)
  );
}

export function resolveClientGallery(rawCode: string): UnlockedClientGallery | undefined {
  const found = findClientGallery(rawCode);
  if (!found) return undefined;

  const allPhotos = getAllPhotos();
  const bySlug = new Map(allPhotos.map((p) => [p.slug, p]));
  const matched = found.photoSlugs
    .map((slug) => bySlug.get(slug))
    .filter((p): p is Photo => Boolean(p));

  const photos =
    matched.length > 0
      ? matched
      : allPhotos.filter((p) => p.category === "coches-rally").slice(0, 6);

  return {
    code: found.code,
    clientName: found.clientName,
    projectTitle: found.projectTitle,
    date: found.date,
    location: found.location,
    note: found.note,
    maxSelection: found.maxSelection,
    photos,
  };
}
