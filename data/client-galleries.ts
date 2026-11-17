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
 * Para crear una nueva entrega, añade un bloque con una clave única y los slugs o rutas de obra.
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
      "cruzada-sobre-el-asfalto-cr-1",
      "aceleracion-plena-cr-3",
      "apoyo-del-autobianchi-a112-cr-15",
      "trazada-en-curva-cr-2",
      "duelo-en-el-tramo-cr-4",
      "enfoque-en-asistencia-cr-5",
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
