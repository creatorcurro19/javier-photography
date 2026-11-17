"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  getCartSummary,
  subscribeCart,
  getCartSnapshot,
  getCartServerSnapshot,
} from "@/lib/cart";

export default function CartButton() {
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot, getCartServerSnapshot);
  const { totalItems } = useMemo(() => getCartSummary(items), [items]);

  const openDrawer = () => {
    window.dispatchEvent(new Event("open-cart-drawer"));
  };

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={`Ver cesta de la compra (${totalItems} ${totalItems === 1 ? "obra" : "obras"})`}
      className="group relative flex items-center gap-2 border border-white/[0.1] bg-[#151618] px-2.5 py-1.5 sm:px-3 transition hover:border-white/30 hover:bg-[#202226] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
    >
      {/* Luxury Minimalist Bag Icon */}
      <svg
        className="h-4 w-4 text-[#EBE7DF] transition group-hover:scale-105"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>

      <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.25em] text-[#EBE7DF]">
        Cesta
      </span>

      {totalItems > 0 && (
        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EBE7DF] px-1 font-mono text-[9px] font-bold text-[#0B0C0E]">
          {totalItems}
        </span>
      )}
    </button>
  );
}
