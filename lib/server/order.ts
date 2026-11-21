import "server-only";

import {
  getFormatsForPhoto,
  type CartItem,
  type CartOrder,
  type OrderCustomer,
  type PrintFormat,
} from "@/types/cart";
import { getAllPhotos } from "@/lib/photos";
import type { Photo } from "@/types/photo";

/**
 * Normaliza y valida un pedido recibido desde el navegador.
 *
 * REGLA: nunca confiar en precios, formatos ni totales enviados por el cliente.
 * Todo importe se recalcula aquí a partir del catálogo (`PRINT_FORMATS` y `data/photos.ts`).
 */

const MAX_QTY_PER_ITEM = 10;
const MAX_ITEMS = 20;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ORDER_ID_RE = /^JE-\d{4}-\d{4,8}$/;

export type OrderValidationResult =
  | { ok: true; order: CartOrder }
  | { ok: false; error: string };

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function findPhoto(item: Partial<CartItem>): Photo | undefined {
  const photos = getAllPhotos();
  return (
    photos.find((p) => typeof item.slug === "string" && p.slug === item.slug) ??
    photos.find((p) => typeof item.photoId === "string" && p.id === item.photoId) ??
    photos.find((p) => typeof item.slug === "string" && p.id === item.slug) ??
    photos.find((p) => typeof item.image === "string" && p.image === item.image)
  );
}

function normalizeCustomer(raw: unknown): OrderCustomer | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Record<string, unknown>;
  const customer: OrderCustomer = {
    nombre: str(c.nombre, 120),
    email: str(c.email, 160).toLowerCase(),
    telefono: str(c.telefono, 40),
    direccion: str(c.direccion, 200),
    ciudad: str(c.ciudad, 100),
    codigoPostal: str(c.codigoPostal, 20),
    pais: str(c.pais, 80) || "España",
    notas: str(c.notas, 1000) || undefined,
  };
  if (!customer.nombre || !customer.direccion || !EMAIL_RE.test(customer.email)) return null;
  return customer;
}

export function normalizeOrder(raw: unknown): OrderValidationResult {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Datos de pedido incompletos." };
  }
  const input = raw as Partial<CartOrder>;

  const customer = normalizeCustomer(input.customer);
  if (!customer) {
    return { ok: false, error: "Datos del comprador incompletos o correo no válido." };
  }

  if (!Array.isArray(input.items) || input.items.length === 0 || input.items.length > MAX_ITEMS) {
    return { ok: false, error: "La cesta está vacía o no es válida." };
  }

  const items: CartItem[] = [];
  for (const rawItem of input.items as Partial<CartItem>[]) {
    const photo = findPhoto(rawItem);
    const formatId = rawItem?.format?.id as PrintFormat["id"] | undefined;
    const photoFormats = photo ? getFormatsForPhoto(photo) : undefined;
    const format = formatId && photoFormats ? photoFormats[formatId] : undefined;
    const quantity = Math.floor(Number(rawItem?.quantity));

    if (!photo || !format || !Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QTY_PER_ITEM) {
      return { ok: false, error: "Una de las obras de la cesta no es válida. Vacía la cesta y vuelve a añadirla." };
    }

    // Venta exclusiva de impresión Fine Art sin enmarcar enviada en tubo rígido
    const framed = false;
    const unitPrice = format.price;

    items.push({
      id: `${photo.slug}-${format.id}-print`,
      photoId: photo.id,
      slug: photo.slug,
      title: photo.title,
      image: photo.image,
      category: photo.category,
      format,
      framed,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
    });
  }

  const orderId =
    typeof input.orderId === "string" && ORDER_ID_RE.test(input.orderId)
      ? input.orderId
      : `JE-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  return {
    ok: true,
    order: {
      orderId,
      customer,
      items,
      subtotal: items.reduce((acc, it) => acc + it.totalPrice, 0),
      createdAt: new Date().toISOString(),
    },
  };
}
