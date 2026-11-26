export type InboxType = "pedido" | "consulta" | "rally" | "licencia";
export type InboxStatus = "pendiente" | "pagado" | "atendido" | "enviado" | "archivado";

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

export const INITIAL_INBOX_ITEMS: InboxItem[] = [];
