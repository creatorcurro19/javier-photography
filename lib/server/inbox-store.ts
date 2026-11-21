import "server-only";
import fs from "fs";
import path from "path";
import { INITIAL_INBOX_ITEMS, type InboxItem, type InboxStatus } from "@/data/inbox";
import { commitFilesToGithub } from "@/lib/server/works-updater";

let inMemoryInbox: InboxItem[] = INITIAL_INBOX_ITEMS.map((item) => ({ ...item }));

export function serializeInboxFile(items: InboxItem[]): string {
  return `export type InboxType = "pedido" | "consulta" | "rally" | "licencia";
export type InboxStatus = "pendiente" | "pagado" | "atendido" | "enviado" | "archivado";

export interface InboxItem {
  id: string;
  type: InboxType;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  subject: string;
  message: string;
  status: InboxStatus;
  notes?: string;
  orderTotal?: number;
  items?: Array<{
    title: string;
    format: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: string;
  photoTitle?: string;
  photoSlug?: string;
}

export const INITIAL_INBOX_ITEMS: InboxItem[] = ${JSON.stringify(items, null, 2)};
`;
}

async function persistInbox(commitMessage: string): Promise<void> {
  const content = serializeInboxFile(inMemoryInbox);

  // 1. Escritura local en disco si no estamos en producción de solo lectura
  try {
    const filePath = path.join(process.cwd(), "data", "inbox.ts");
    fs.writeFileSync(filePath, content, "utf8");
  } catch {
    // Entorno de solo lectura
  }

  // 2. Persistencia en GitHub mediante commit atómico si hay token configurado
  try {
    await commitFilesToGithub(commitMessage, [
      {
        path: "data/inbox.ts",
        content,
        encoding: "utf-8",
      },
    ]);
  } catch (error) {
    console.warn("[inbox-store] Error sincronizando con GitHub:", error);
  }
}

export function getInboxItems(): InboxItem[] {
  return [...inMemoryInbox].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function addInboxItem(
  data: Omit<InboxItem, "id" | "createdAt" | "status"> & {
    id?: string;
    status?: InboxStatus;
    createdAt?: string;
  }
): Promise<InboxItem> {
  const prefix = data.type === "pedido" ? "PED" : data.type === "rally" ? "RAL" : "CON";
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const id = data.id || `${prefix}-${new Date().getFullYear()}-${randomSuffix}`;
  const createdAt = data.createdAt || new Date().toISOString();
  const status: InboxStatus = data.status || "pendiente";

  const newItem: InboxItem = {
    ...data,
    id,
    createdAt,
    status,
  };

  inMemoryInbox = [newItem, ...inMemoryInbox];
  await persistInbox(`feat(inbox): nuevo registro ${newItem.id} (${newItem.customerName})`);
  return newItem;
}

export async function updateInboxItem(
  id: string,
  patch: Partial<Pick<InboxItem, "status" | "notes">>
): Promise<InboxItem | null> {
  const index = inMemoryInbox.findIndex((it) => it.id === id);
  if (index === -1) return null;

  const updated: InboxItem = {
    ...inMemoryInbox[index],
    ...patch,
  };

  inMemoryInbox[index] = updated;
  await persistInbox(`chore(inbox): actualizar estado ${id} -> ${updated.status}`);
  return updated;
}

export async function deleteInboxItem(id: string): Promise<boolean> {
  const prevLen = inMemoryInbox.length;
  inMemoryInbox = inMemoryInbox.filter((it) => it.id !== id);
  if (inMemoryInbox.length !== prevLen) {
    await persistInbox(`chore(inbox): eliminar registro ${id}`);
    return true;
  }
  return false;
}
