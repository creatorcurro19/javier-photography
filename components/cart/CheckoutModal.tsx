"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CartItem, OrderCustomer, CartOrder } from "@/types/cart";
import { clearCart } from "@/lib/cart";
import { trackEvent } from "@/lib/analytics";

interface CheckoutModalProps {
  items: CartItem[];
  subtotal: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

export default function CheckoutModal({
  items,
  subtotal,
  isOpen,
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const [customer, setCustomer] = useState<OrderCustomer>({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    pais: "España",
    notas: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!privacyAccepted) {
      setError("Debe aceptar la política de privacidad para tramitar el pedido.");
      return;
    }

    if (!customer.nombre.trim() || !customer.email.trim() || !customer.direccion.trim()) {
      setError("Por favor complete los campos obligatorios marcados con asterisco (*).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      setError("Por favor indique una dirección de correo electrónico válida.");
      return;
    }

    setLoading(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `JE-${new Date().getFullYear()}-${randomSuffix}`;

    const orderPayload: CartOrder = {
      orderId,
      customer,
      items,
      subtotal,
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Registrar pedido y enviar notificación al autor (importes recalculados en servidor)
      const orderRes = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      }).catch(() => null);
      const orderData = orderRes ? await orderRes.json().catch(() => null) : null;

      if (orderRes?.status === 400) {
        setError(orderData?.error ?? "Revisa los datos del pedido.");
        return;
      }

      // 2. Si Stripe está configurado en el servidor, redirigir a pasarela de pago segura
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      }).catch(() => null);

      const checkoutData = checkoutRes
        ? await checkoutRes.json().catch(() => null)
        : null;

      if (checkoutData?.mode === "stripe" && checkoutData?.url) {
        trackEvent("checkout_iniciado", { modo: "stripe", importe: subtotal });
        clearCart();
        window.location.href = checkoutData.url;
        return;
      }

      // Sin pago online: solo confirmamos si el pedido ha llegado de verdad a Javier.
      if (!orderData?.ok) {
        const mail = orderData?.destinationEmail ?? "javierespinosa1995@hotmail.com";
        setError(
          `No hemos podido registrar el pedido automáticamente. Tu cesta se conserva: escríbenos a ${mail} indicando la referencia ${orderId} o usa WhatsApp.`
        );
        return;
      }

      trackEvent("checkout_iniciado", { modo: "reserva", importe: subtotal });
      clearCart();
      onSuccess(orderId);
    } catch {
      setError("Error de conexión. Tu cesta se conserva; inténtalo de nuevo en unos segundos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl border border-white/[0.1] bg-[#0B0C0E] p-6 sm:p-10 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8E8A80]">
              Tramitación de Adquisición
            </p>
            <h2 id="checkout-title" className="mt-1 font-serif text-2xl font-light text-[#EBE7DF]">
              Reserva de Obra Fine Art
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#8E8A80] hover:text-white transition"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Selected Artworks Quick Summary */}
        <div className="mt-6 border border-white/[0.06] bg-[#151618]/60 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80] mb-3">
            Obras en la Cesta ({items.length})
          </p>
          <div className="space-y-2.5 max-h-40 overflow-y-auto no-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs font-light">
                <div className="flex items-center gap-3 truncate pr-4">
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden bg-black/40 border border-white/10">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="truncate">
                    <p className="text-[#EBE7DF] font-serif truncate">{item.title}</p>
                    <p className="font-mono text-[10px] text-[#8E8A80]">
                      {item.format.name} · {item.framed ? "Enmarcado Museo" : "Lámina suelta"} ({item.quantity}×)
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs text-[#EBE7DF] shrink-0">{item.totalPrice} €</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between font-mono text-xs">
            <span className="text-[#8E8A80] uppercase tracking-wider">Total a tramitar:</span>
            <span className="text-[#EBE7DF] text-sm font-semibold">{subtotal} €</span>
          </div>
        </div>

        {/* Customer Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {error && (
            <div className="border border-red-500/40 bg-red-950/20 p-3 text-xs font-mono text-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkout-nombre" className="block text-[11px] uppercase tracking-wider font-mono text-[#8E8A80]">
                Nombre y Apellidos / Entidad <span className="text-[#EBE7DF]">*</span>
              </label>
              <input
                id="checkout-nombre"
                type="text"
                required
                value={customer.nombre}
                onChange={(e) => setCustomer({ ...customer, nombre: e.target.value })}
                placeholder="Ej. Carmen Rodríguez"
                className="mt-1.5 w-full border border-white/[0.1] bg-[#151618] px-3.5 py-2.5 text-xs text-[#EBE7DF] placeholder-[#8E8A80]/40 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="checkout-email" className="block text-[11px] uppercase tracking-wider font-mono text-[#8E8A80]">
                Correo Electrónico <span className="text-[#EBE7DF]">*</span>
              </label>
              <input
                id="checkout-email"
                type="email"
                required
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                placeholder="tu@correo.com"
                className="mt-1.5 w-full border border-white/[0.1] bg-[#151618] px-3.5 py-2.5 text-xs text-[#EBE7DF] placeholder-[#8E8A80]/40 focus:border-white/40 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkout-tel" className="block text-[11px] uppercase tracking-wider font-mono text-[#8E8A80]">
                Teléfono de Contacto <span className="text-[#8E8A80]/60">(Opcional)</span>
              </label>
              <input
                id="checkout-tel"
                type="tel"
                value={customer.telefono}
                onChange={(e) => setCustomer({ ...customer, telefono: e.target.value })}
                placeholder="+34 600 000 000"
                className="mt-1.5 w-full border border-white/[0.1] bg-[#151618] px-3.5 py-2.5 text-xs text-[#EBE7DF] placeholder-[#8E8A80]/40 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="checkout-pais" className="block text-[11px] uppercase tracking-wider font-mono text-[#8E8A80]">
                País de Entrega <span className="text-[#EBE7DF]">*</span>
              </label>
              <input
                id="checkout-pais"
                type="text"
                required
                value={customer.pais}
                onChange={(e) => setCustomer({ ...customer, pais: e.target.value })}
                placeholder="España"
                className="mt-1.5 w-full border border-white/[0.1] bg-[#151618] px-3.5 py-2.5 text-xs text-[#EBE7DF] placeholder-[#8E8A80]/40 focus:border-white/40 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="checkout-dir" className="block text-[11px] uppercase tracking-wider font-mono text-[#8E8A80]">
              Dirección de Entrega <span className="text-[#EBE7DF]">*</span>
            </label>
            <input
              id="checkout-dir"
              type="text"
              required
              value={customer.direccion}
              onChange={(e) => setCustomer({ ...customer, direccion: e.target.value })}
              placeholder="Calle, número, piso, puerta"
              className="mt-1.5 w-full border border-white/[0.1] bg-[#151618] px-3.5 py-2.5 text-xs text-[#EBE7DF] placeholder-[#8E8A80]/40 focus:border-white/40 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkout-ciudad" className="block text-[11px] uppercase tracking-wider font-mono text-[#8E8A80]">
                Ciudad <span className="text-[#EBE7DF]">*</span>
              </label>
              <input
                id="checkout-ciudad"
                type="text"
                required
                value={customer.ciudad}
                onChange={(e) => setCustomer({ ...customer, ciudad: e.target.value })}
                placeholder="Ej. Madrid / Santa Cruz de Tenerife"
                className="mt-1.5 w-full border border-white/[0.1] bg-[#151618] px-3.5 py-2.5 text-xs text-[#EBE7DF] placeholder-[#8E8A80]/40 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="checkout-cp" className="block text-[11px] uppercase tracking-wider font-mono text-[#8E8A80]">
                Código Postal <span className="text-[#EBE7DF]">*</span>
              </label>
              <input
                id="checkout-cp"
                type="text"
                required
                value={customer.codigoPostal}
                onChange={(e) => setCustomer({ ...customer, codigoPostal: e.target.value })}
                placeholder="28001"
                className="mt-1.5 w-full border border-white/[0.1] bg-[#151618] px-3.5 py-2.5 text-xs text-[#EBE7DF] placeholder-[#8E8A80]/40 focus:border-white/40 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="checkout-notas" className="block text-[11px] uppercase tracking-wider font-mono text-[#8E8A80]">
              Notas para el autor o solicitud de dedicatoria manuscrita
            </label>
            <textarea
              id="checkout-notas"
              rows={2}
              value={customer.notas}
              onChange={(e) => setCustomer({ ...customer, notas: e.target.value })}
              placeholder="Instrucciones para la entrega, tono de enmarcado deseado o dedicatoria..."
              className="mt-1.5 w-full border border-white/[0.1] bg-[#151618] px-3.5 py-2 text-xs text-[#EBE7DF] placeholder-[#8E8A80]/40 focus:border-white/40 focus:outline-none"
            />
          </div>

          <div className="flex items-start gap-2.5 pt-1">
            <input
              id="checkout-privacidad"
              type="checkbox"
              required
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="mt-1 h-3.5 w-3.5 accent-[#EBE7DF]"
            />
            <label htmlFor="checkout-privacidad" className="text-[11px] text-[#8E8A80] font-light leading-relaxed">
              Acepto la{" "}
              <Link href="/legal#privacidad" target="_blank" className="text-[#EBE7DF] underline decoration-white/30 hover:text-white">
                Política de Privacidad
              </Link>
              . Los datos se emplearán exclusivamente para la facturación, certificación y entrega de la obra.
            </label>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-[#8E8A80] font-mono text-center sm:text-left">
              <span>Pago seguro tras confirmación de serie</span>
              <span className="block text-[10px] text-white/40">Transferencia / Factura proforma</span>
            </div>

            <button
              type="submit"
              disabled={loading || !privacyAccepted}
              className="w-full sm:w-auto inline-flex items-center justify-center border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-[#0B0C0E] font-medium transition hover:bg-transparent hover:text-white disabled:opacity-50"
            >
              {loading ? "Registrando pedido..." : `Confirmar Reserva (${subtotal} €) →`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
