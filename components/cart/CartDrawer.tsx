"use client";

import { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  removeFromCart,
  updateQuantity,
  getCartSummary,
  clearCart,
  subscribeCart,
  getCartSnapshot,
  getCartServerSnapshot,
} from "@/lib/cart";
import CheckoutModal from "@/components/cart/CheckoutModal";
import {
  AndalusianMicroCenefa,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";

export default function CartDrawer() {
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot, getCartServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleDirectCheckout = () => {
      setIsOpen(true);
      setCheckoutOpen(true);
    };
    window.addEventListener("open-cart-drawer", handleOpen);
    window.addEventListener("open-checkout-direct", handleDirectCheckout);
    return () => {
      window.removeEventListener("open-cart-drawer", handleOpen);
      window.removeEventListener("open-checkout-direct", handleDirectCheckout);
    };
  }, []);

  useEffect(() => {
    if (isOpen || checkoutOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, checkoutOpen]);

  const { subtotal, totalItems } = useMemo(() => getCartSummary(items), [items]);

  const handleCheckoutSuccess = (orderId: string) => {
    setCheckoutOpen(false);
    setConfirmedOrderId(orderId);
  };

  return (
    <>
      {/* Slide-over Backdrop */}
      {isOpen && (
        <div
          role="presentation"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* Slide-over Panel */}
      <aside
        aria-label="Cesta de Colección Fine Art"
        aria-hidden={!isOpen}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/[0.08] bg-[#0B0C0E] shadow-[0_20px_70px_rgba(0,0,0,0.9)] transition-all duration-500 ease-out select-none ${
          isOpen
            ? "translate-x-0 visible"
            : "translate-x-full invisible pointer-events-none"
        }`}
      >
        {/* Drawer Header */}
        <header className="flex h-20 items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-3">
            <AndalusianStarMark className="h-4 w-4 text-[#C5A880]/75" />
            <span className="font-serif text-lg font-light text-[#EBE7DF]">
              Cesta de Colección
            </span>
            <span className="rounded-full border border-[#C5A880]/30 bg-[#151618] px-2.5 py-0.5 font-mono text-[10px] text-[#C5A880]">
              {totalItems} {totalItems === 1 ? "obra" : "obras"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar cesta"
            className="p-2 text-[#8E8A80] transition hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <AndalusianMicroCenefa className="text-[#C5A880]/35" />

        {/* Confirmation Screen */}
        {confirmedOrderId ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center overflow-y-auto">
            <div className="mx-auto flex h-14 w-14 items-center justify-center border border-white/20 bg-white/5 text-[#EBE7DF]">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-5 font-serif text-2xl font-light text-[#EBE7DF]">
              Pedido Registrado
            </h3>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-[#8E8A80]">
              Referencia: <span className="text-[#EBE7DF] font-semibold">{confirmedOrderId}</span>
            </p>
            <p className="mt-4 text-xs leading-relaxed text-[#8E8A80] font-light max-w-xs">
              Se ha enviado la solicitud de reserva a <strong className="text-[#EBE7DF]">Javier Espinosa Martínez</strong>. Recibirás en breve un correo con la disponibilidad del ejemplar numerado, opciones de pago seguro y seguimiento de laboratorio.
            </p>

            <div className="mt-8 space-y-3 w-full">
              <button
                type="button"
                onClick={() => {
                  setConfirmedOrderId(null);
                  setIsOpen(false);
                }}
                className="w-full border border-[#EBE7DF] bg-[#EBE7DF] py-3 font-mono text-xs uppercase tracking-[0.25em] text-[#0B0C0E] font-medium transition hover:bg-transparent hover:text-white"
              >
                Volver a la Galería
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center border border-white/10 bg-[#151618] text-[#8E8A80]">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="mt-4 font-serif text-xl font-light text-[#EBE7DF]">
              Tu cesta está vacía
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8E8A80] font-light max-w-xs">
              Selecciona una obra en el catálogo Fine Art para encargar tiradas limitadas sobre papel de algodón Hahnemühle Photo Rag® 308g con certificado de autor.
            </p>
            <Link
              href="/prints"
              onClick={() => setIsOpen(false)}
              className="mt-6 inline-flex border border-white/20 bg-[#151618] px-6 py-2.5 font-mono text-xs uppercase tracking-[0.25em] text-[#EBE7DF] transition hover:border-white/40 hover:text-white"
            >
              Explorar Copias Fine Art →
            </Link>
          </div>
        ) : (
          /* Item List */
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-5 no-scrollbar">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border border-white/[0.06] bg-[#151618]/70 p-4 transition hover:border-white/20"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/portfolio/${item.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="relative h-20 w-20 shrink-0 overflow-hidden bg-[#0B0C0E] border border-white/10"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-light text-[#EBE7DF] truncate">
                          <Link
                            href={`/portfolio/${item.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="hover:underline underline-offset-4"
                          >
                            {item.title}
                          </Link>
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Eliminar ${item.title} de la cesta`}
                          className="text-xs text-[#8E8A80] hover:text-white transition"
                        >
                          ✕
                        </button>
                      </div>

                      <p className="mt-1 font-mono text-[10px] text-[#8E8A80]">
                        {item.format.name} · {item.format.dimensions}
                      </p>

                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#8E8A80] border border-white/[0.06] bg-black/40 px-1.5 py-0.5">
                          Fine Art ISO 9706
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#C5A880] border border-[#C5A880]/25 bg-black/40 px-1.5 py-0.5">
                          Lámina en tubo rígido
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Line Total */}
                    <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2">
                      <div className="flex items-center border border-white/10 bg-[#0B0C0E]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 font-mono text-xs text-[#8E8A80] hover:text-white transition"
                          aria-label="Reducir cantidad"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono text-xs text-[#EBE7DF]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 font-mono text-xs text-[#8E8A80] hover:text-white transition"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono text-xs font-semibold text-[#EBE7DF]">
                        {item.totalPrice} €
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Archival Guarantees */}
              <div className="border border-white/[0.06] bg-[#151618]/30 p-4 text-[11px] text-[#8E8A80] space-y-1.5 font-light">
                <p className="flex items-center gap-2">
                  <span className="text-[#EBE7DF]">✓</span> Certificado de autenticidad con holograma y firma manuscrita.
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#EBE7DF]">✓</span> Impresión mineral de conservación bajo norma ISO 9706.
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#EBE7DF]">✓</span> Embalaje técnico protegido y seguro de transporte a todo riesgo.
                </p>
              </div>
            </div>

            {/* Drawer Footer & Checkout Action */}
            <footer className="border-t border-white/[0.08] bg-[#151618] p-6 sm:p-8 space-y-4">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-[#8E8A80]">
                  <span>Subtotal de obra:</span>
                  <span>{subtotal} €</span>
                </div>
                <div className="flex items-center justify-between text-[#8E8A80]">
                  <span>Certificación y embalaje:</span>
                  <span className="text-[#EBE7DF]">Incluido (0 €)</span>
                </div>
                <div className="flex items-center justify-between text-[#8E8A80]">
                  <span>Transporte asegurado:</span>
                  <span className="text-white/60">Calculado por destino</span>
                </div>
                <div className="border-t border-white/[0.08] pt-2 flex items-center justify-between text-sm">
                  <span className="text-[#EBE7DF] uppercase tracking-wider font-serif">Total Estimado:</span>
                  <span className="text-base font-semibold text-[#EBE7DF]">{subtotal} €</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full border border-[#EBE7DF] bg-[#EBE7DF] py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-[#0B0C0E] font-semibold transition hover:bg-transparent hover:text-white"
                >
                  Tramitar Pedido de Colección →
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => clearCart()}
                    className="font-mono text-[10px] uppercase tracking-wider text-[#8E8A80] hover:text-red-300 transition"
                  >
                    Vaciar cesta
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="font-mono text-[10px] uppercase tracking-wider text-[#8E8A80] hover:text-[#EBE7DF] transition"
                  >
                    Seguir explorando
                  </button>
                </div>
              </div>
            </footer>
          </>
        )}
      </aside>

      {/* Checkout Modal */}
      <CheckoutModal
        items={items}
        subtotal={subtotal}
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />
    </>
  );
}
