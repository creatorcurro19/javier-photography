import type { CartItem } from "@/types/cart";
import { PRINT_FORMATS, getFormatsForPhoto } from "@/types/cart";
import { trackEvent } from "@/lib/analytics";

const CART_STORAGE_KEY = "javier_fine_art_cart";
const EMPTY_CART: CartItem[] = [];
let cartCache: CartItem[] = EMPTY_CART;
let rawCartCache = "";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return EMPTY_CART;
    if (raw !== rawCartCache) {
      rawCartCache = raw;
      cartCache = JSON.parse(raw);
    }
    return cartCache;
  } catch {
    return EMPTY_CART;
  }
}

export function subscribeCart(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("javier-cart-updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("javier-cart-updated", callback);
    window.removeEventListener("storage", callback);
  };
}

export function getCartSnapshot(): CartItem[] {
  return getCart();
}

export function getCartServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("javier-cart-updated"));
  } catch {
    // Ignore storage quota errors
  }
}

export function addToCart(
  item: Omit<CartItem, "id" | "unitPrice" | "totalPrice">
): CartItem {
  const current = getCart();
  const unitPrice = item.format.price;
  const itemId = `${item.slug}-${item.format.id}-print`;

  const existingIndex = current.findIndex((i) => i.id === itemId);

  let updated: CartItem[];

  if (existingIndex >= 0) {
    const existing = current[existingIndex];
    const newQty = existing.quantity + item.quantity;
    const updatedItem: CartItem = {
      ...existing,
      framed: false,
      unitPrice,
      quantity: newQty,
      totalPrice: unitPrice * newQty,
    };
    updated = [...current];
    updated[existingIndex] = updatedItem;
  } else {
    const newItem: CartItem = {
      ...item,
      framed: false,
      id: itemId,
      unitPrice,
      totalPrice: unitPrice * item.quantity,
    };
    updated = [...current, newItem];
  }

  saveCart(updated);
  trackEvent("anadir_cesta", {
    obra: item.slug,
    formato: item.format.id,
    enmarcado: item.framed,
    precio: unitPrice,
  });
  // Auto open cart drawer when item is added
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("open-cart-drawer"));
  }

  return updated.find((i) => i.id === itemId)!;
}

export function removeFromCart(itemId: string): void {
  const current = getCart();
  const updated = current.filter((i) => i.id !== itemId);
  saveCart(updated);
}

export function updateQuantity(itemId: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(itemId);
    return;
  }
  const current = getCart();
  const updated = current.map((i) => {
    if (i.id === itemId) {
      return {
        ...i,
        quantity,
        totalPrice: i.unitPrice * quantity,
      };
    }
    return i;
  });
  saveCart(updated);
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartSummary(items: CartItem[]): {
  subtotal: number;
  totalItems: number;
} {
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  return { subtotal, totalItems };
}

export { PRINT_FORMATS, getFormatsForPhoto };
