export type InboxType = "pedido" | "consulta" | "rally" | "licencia";
export type InboxStatus = "pendiente" | "atendido" | "enviado" | "archivado";

export interface InboxItem {
  id: string;
  type: InboxType;
  createdAt: string; // ISO
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  subject: string;
  message: string;
  status: InboxStatus;
  notes?: string;
  // Específico de pedidos
  orderTotal?: number;
  items?: Array<{
    title: string;
    format: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: string;
  // Específico de fotos de rally o consultas de obra
  photoTitle?: string;
  photoSlug?: string;
}

export const INITIAL_INBOX_ITEMS: InboxItem[] = [
  {
    id: "PED-2026-001",
    type: "pedido",
    createdAt: "2026-11-20T18:30:00.000Z",
    customerName: "Carlos Méndez de la Torre",
    customerEmail: "cmendez.arte@gmail.com",
    customerPhone: "+34 620 44 88 12",
    subject: "Reserva de Copia Fine Art — Mirada del lince boreal (50 × 70 cm)",
    message: "Hola Javier, me gustaría confirmar la reserva para mi despacho en Madrid. ¿Podrías indicarme el plazo estimado de llegada del tubo?",
    status: "pendiente",
    orderTotal: 255,
    items: [
      {
        title: "Mirada del lince boreal",
        format: "Formato Galería (50 × 70 cm)",
        quantity: 1,
        price: 255,
      },
    ],
    shippingAddress: "Calle Serrano 45, 3º Dcha, 28001 Madrid (España)",
    notes: "Coleccionista interesado en el certificado ISO 9706. Pago por transferencia bancaria.",
  },
  {
    id: "RAL-2026-002",
    type: "rally",
    createdAt: "2026-11-19T14:15:00.000Z",
    customerName: "Marcos Rodríguez (Escudería Teide Rally)",
    customerEmail: "marcos.rallyteam@outlook.es",
    customerPhone: "+34 639 12 34 56",
    subject: "Solicitud de fotografía de competición — Cruzada sobre el asfalto (Dorsal 8)",
    message: "Buenas tardes Javier, somos el equipo del BMW M3 E30 blanco. Vimos tu toma de la horquilla en el tramo de La Guancha y nos encantaría adquirir el archivo en máxima resolución para nuestras redes y cartelería de patrocinadores.",
    status: "atendido",
    photoTitle: "Cruzada sobre el asfalto",
    photoSlug: "cruzada-sobre-el-asfalto",
    notes: "Hablado por WhatsApp. Enviada previsualización con marca de agua. Pendiente confirmación de patrocinador.",
  },
  {
    id: "CON-2026-003",
    type: "consulta",
    createdAt: "2026-11-18T10:45:00.000Z",
    customerName: "Laura Benítez Soria",
    customerEmail: "lbenitez@arquitectura-estudio.com",
    customerPhone: "+34 670 99 11 22",
    subject: "Propuesta de documentación fotográfica — Vivienda unifamiliar en La Orotava",
    message: "Estimado Javier, nos ha gustado mucho tu serie de arquitectura y el tratamiento de la luz natural sobre piedra y madera. Tenemos una obra recién finalizada y quisiéramos valorar un reportaje diurno y crepuscular.",
    status: "pendiente",
    notes: "Revisar disponibilidad para la primera semana de diciembre.",
  },
];
