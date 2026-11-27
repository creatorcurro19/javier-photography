"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import type { CartItem, OrderCustomer, CartOrder, ShippingZoneId } from "@/types/cart";
import { SHIPPING_ZONES, getShippingZones } from "@/types/cart";
import { clearCart } from "@/lib/cart";
import { PAGOS_ACTIVOS, SITE_CONFIG } from "@/data/site-config";
import { BASE_PRINT_FORMATS } from "@/data/formatos";
import { WORKS_EN } from "@/data/works-en";
import { trackEvent } from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n";
import { formatApproxUsd, formatApproxUsdShort, useUsdRate } from "@/lib/currency";

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
  const { lang, t } = useLanguage();
  const usdRate = useUsdRate(lang === "en");
  const [customer, setCustomer] = useState<OrderCustomer>({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    pais: lang === "en" ? "United States" : "España",
    notas: "",
  });

  const [shippingZone, setShippingZone] = useState<ShippingZoneId>(
    lang === "en" ? "internacional" : "canarias"
  );
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "transferencia">(
    PAGOS_ACTIVOS ? "stripe" : "transferencia"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(true);

  if (!isOpen) return null;

  const localizedZones = getShippingZones(lang);
  const currentZone = localizedZones[shippingZone] ?? SHIPPING_ZONES[shippingZone];
  const shippingCost = currentZone.cost;
  const totalAmount = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!privacyAccepted) {
      setError(
        t(
          "Debe aceptar la política de privacidad para tramitar el pedido.",
          "Please accept the privacy policy to submit your order."
        )
      );
      return;
    }

    if (!customer.nombre.trim() || !customer.email.trim() || !customer.direccion.trim()) {
      setError(
        t(
          "Por favor complete los campos obligatorios marcados con asterisco (*).",
          "Please complete the required fields marked with an asterisk (*)."
        )
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      setError(
        t(
          "Por favor indique una dirección de correo electrónico válida.",
          "Please enter a valid email address."
        )
      );
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
      shippingZone,
      shippingCost,
      total: totalAmount,
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Si el cliente eligió pago online con tarjeta/Apple Pay/Link, solicitar sesión Stripe primero
      if (paymentMethod === "stripe") {
        const checkoutRes = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...orderPayload, lang }),
        }).catch(() => null);

        const checkoutData = checkoutRes
          ? await checkoutRes.json().catch(() => null)
          : null;

        if (checkoutRes?.status === 400) {
          setError(checkoutData?.error ?? t("Revisa los datos del pedido.", "Please check your order details."));
          return;
        }

        if (checkoutData?.mode === "stripe" && checkoutData?.url) {
          trackEvent("checkout_iniciado", { modo: "stripe", importe: totalAmount });
          // No vaciamos la cesta aquí: si el comprador vuelve desde Stripe sin pagar (?pago=cancelado), conserva sus obras;
          // PaymentFeedback la vacía al volver tras pago confirmado (?pago=confirmado).
          window.location.href = checkoutData.url;
          return;
        }
      }

      // 2. Modo transferencia bancaria o respaldo en reserva cuando Stripe no está activo
      const orderRes = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...orderPayload, lang }),
      }).catch(() => null);
      const orderData = orderRes ? await orderRes.json().catch(() => null) : null;

      if (orderRes?.status === 400) {
        setError(orderData?.error ?? t("Revisa los datos del pedido.", "Please check your order details."));
        return;
      }

      if (!orderData?.ok) {
        const mail = orderData?.destinationEmail ?? SITE_CONFIG.contactEmail;
        setError(
          t(
            `No hemos podido registrar el pedido automáticamente. Tu cesta se conserva: escríbenos a ${mail} indicando la referencia ${orderId} o usa WhatsApp.`,
            `We could not register the order automatically. Your bag is saved: email ${mail} quoting reference ${orderId}.`
          )
        );
        return;
      }

      trackEvent("checkout_iniciado", { modo: "reserva", importe: totalAmount });
      clearCart();
      onSuccess(orderId);
    } catch {
      setError(
        t(
          "Error de conexión. Tu cesta se conserva; inténtalo de nuevo en unos segundos.",
          "Connection error. Your bag is saved; please try again in a few seconds."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
    >
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-white/[0.1] bg-[#0B0C0E] p-5 sm:p-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8E8A80]">
              {t("Tramitación de Adquisición", "Print Order Processing")}
            </p>
            <h2 id="checkout-title" className="mt-1 font-serif text-2xl font-light text-[#EBE7DF]">
              {t("Reserva de Obra Fine Art", "Fine Art Print Reservation")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#8E8A80] hover:text-white transition"
            aria-label={t("Cerrar modal", "Close modal")}
          >
            ✕
          </button>
        </div>

        {/* Selected Artworks Quick Summary */}
        <div className="mt-6 border border-white/[0.06] bg-[#151618]/60 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80] mb-3">
            {t(`Obras en la Cesta (${items.length})`, `Prints in Bag (${items.length})`)}
          </p>
          <div className="space-y-2.5 max-h-40 overflow-y-auto no-scrollbar">
            {items.map((item) => {
              const displayTitle =
                lang === "en" ? WORKS_EN[item.photoId]?.title ?? item.title : item.title;
              const formatSpec = BASE_PRINT_FORMATS[item.format.id];
              const displayFormat =
                lang === "en" && formatSpec ? formatSpec.nameEn : item.format.name;
              return (
              <div key={item.id} className="flex items-center justify-between text-xs font-light">
                <div className="flex items-center gap-3 truncate pr-4">
                  <div className="relative h-10 shrink-0 overflow-hidden bg-black/40 border border-white/10">
                    <Image
                      src={item.image}
                      alt={displayTitle}
                      width={item.width ?? 72}
                      height={item.height ?? 72}
                      sizes="72px"
                      quality={75}
                      className={
                        item.width && item.height
                          ? "block h-full w-auto"
                          : "block h-full w-auto max-w-[52px] object-contain"
                      }
                    />
                  </div>
                  <div className="truncate">
                    <p className="text-[#EBE7DF] font-serif truncate">{displayTitle}</p>
                    <p className="font-mono text-[10px] text-[#8E8A80]">
                      {displayFormat} ({item.format.dimensions}) · {t("Envío en tubo rígido", "Rigid tube delivery")} ({item.quantity}×)
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs text-[#EBE7DF] shrink-0">
                  {item.totalPrice} €{lang === "en" ? ` (${formatApproxUsdShort(item.totalPrice, usdRate)})` : ""}
                </span>
              </div>
              );
            })}
          </div>

          {/* Selector de Zona de Envío e Impuestos */}
          <div className="mt-4 border-t border-white/[0.08] pt-3">
            <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[#C5A880] mb-2">
              {t("Zona de Envío en Tubo Rígido e Impuestos:", "Rigid Tube Shipping Zone & Taxes:")}
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {(Object.keys(localizedZones) as ShippingZoneId[]).map((zId) => {
                const z = localizedZones[zId];
                const active = shippingZone === zId;
                return (
                  <button
                    key={zId}
                    type="button"
                    onClick={() => setShippingZone(zId)}
                    className={`border p-2.5 text-left font-mono text-[10px] transition ${
                      active
                        ? "border-[#C5A880] bg-[#C5A880]/15 text-[#EBE7DF]"
                        : "border-white/[0.08] bg-[#0B0C0E] text-[#A39E93] hover:text-white"
                    }`}
                  >
                    <span className="block font-semibold text-[#EBE7DF]">{z.label}</span>
                    <span className="block mt-0.5 text-[#C5A880]">
                      {t("Envío:", "Shipping:")}{" "}
                      {z.cost === 0
                        ? t("0 € (Incluido)", "€0 (Included)")
                        : `+${z.cost} €${lang === "en" ? ` (${formatApproxUsdShort(z.cost, usdRate)})` : ""}`}
                    </span>
                    <span className="block mt-0.5 text-[9px] text-[#A39E93]">{z.deliveryDays}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 font-mono text-[10px] text-[#A39E93]">
              {currentZone.taxNote}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.08] space-y-1 font-mono text-xs">
            <div className="flex items-center justify-between text-[#A39E93]">
              <span>{t("Subtotal copias Fine Art:", "Fine Art prints subtotal:")}</span>
              <span>
                {subtotal} €{lang === "en" ? ` (${formatApproxUsdShort(subtotal, usdRate)})` : ""}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#A39E93]">
              <span>{t(`Envío asegurado en tubo rígido (${currentZone.label}):`, `Insured rigid tube shipping (${currentZone.label}):`)}</span>
              <span>
                {shippingCost === 0
                  ? t("0 € (Incluido)", "€0 (Included)")
                  : `${shippingCost} €${lang === "en" ? ` (${formatApproxUsdShort(shippingCost, usdRate)})` : ""}`}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 text-sm">
              <span className="text-[#EBE7DF] uppercase tracking-wider">{t("Total a tramitar:", "Order total:")}</span>
              <span className="text-[#EBE7DF] font-semibold">
                {totalAmount} €{lang === "en" ? ` (${formatApproxUsd(totalAmount, usdRate)})` : ""}
              </span>
            </div>
            {lang === "en" && (
              <p className="pt-1 text-[10px] text-[#8E8A80]">
                Charged in Euros (EUR) at checkout. USD figures use the daily ECB reference rate.
              </p>
            )}
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
                {t("Nombre y Apellidos / Entidad", "Full Name / Organization")} <span className="text-[#EBE7DF]">*</span>
              </label>
              <input
                id="checkout-nombre"
                type="text"
                required
                value={customer.nombre}
                onChange={(e) => setCustomer({ ...customer, nombre: e.target.value })}
                placeholder={t("Ej. Carmen Rodríguez", "e.g. Jane Doe")}
                className="mt-1.5 w-full border border-white/[0.1] bg-[#151618] px-3.5 py-2.5 text-xs text-[#EBE7DF] placeholder-[#8E8A80]/40 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="checkout-email" className="block text-[11px] uppercase tracking-wider font-mono text-[#8E8A80]">
                {t("Correo Electrónico", "Email Address")} <span className="text-[#EBE7DF]">*</span>
              </label>
              <input
                id="checkout-email"
                type="email"
                required
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                placeholder={t("tu@correo.com", "you@example.com")}
                className="mt-1.5 w-full border border-white/[0.1] bg-[#151618] px-3.5 py-2.5 text-xs text-[#EBE7DF] placeholder-[#8E8A80]/40 focus:border-white/40 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkout-tel" className="block text-[11px] uppercase tracking-wider font-mono text-[#8E8A80]">
                {t("Teléfono de Contacto", "Contact Phone")} <span className="text-[#8E8A80]/60">{t("(Opcional)", "(Optional)")}</span>
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
                {t("País de Entrega", "Delivery Country")} <span className="text-[#EBE7DF]">*</span>
              </label>
              <input
                id="checkout-pais"
                type="text"
                required
                value={customer.pais}
                onChange={(e) => setCustomer({ ...customer, pais: e.target.value })}
                placeholder={t("España", "Spain")}
                className="mt-1.5 w-full border border-white/[0.1] bg-[#151618] px-3.5 py-2.5 text-xs text-[#EBE7DF] placeholder-[#8E8A80]/40 focus:border-white/40 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="checkout-dir" className="block text-[11px] uppercase tracking-wider font-mono text-[#8E8A80]">
              {t("Dirección de Entrega", "Street Address")} <span className="text-[#EBE7DF]">*</span>
            </label>
            <input
              id="checkout-dir"
              type="text"
              required
              value={customer.direccion}
              onChange={(e) => setCustomer({ ...customer, direccion: e.target.value })}
              placeholder={t("Calle, número, piso, puerta", "Street, number, apartment")}
              className="mt-1.5 w-full border border-white/[0.1] bg-[#151618] px-3.5 py-2.5 text-xs text-[#EBE7DF] placeholder-[#8E8A80]/40 focus:border-white/40 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkout-ciudad" className="block text-[11px] uppercase tracking-wider font-mono text-[#8E8A80]">
                {t("Ciudad", "City")} <span className="text-[#EBE7DF]">*</span>
              </label>
              <input
                id="checkout-ciudad"
                type="text"
                required
                value={customer.ciudad}
                onChange={(e) => setCustomer({ ...customer, ciudad: e.target.value })}
                placeholder={t("Ej. Madrid / Santa Cruz de Tenerife", "e.g. Madrid / London")}
                className="mt-1.5 w-full border border-white/[0.1] bg-[#151618] px-3.5 py-2.5 text-xs text-[#EBE7DF] placeholder-[#8E8A80]/40 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="checkout-cp" className="block text-[11px] uppercase tracking-wider font-mono text-[#8E8A80]">
                {t("Código Postal", "Postal Code")} <span className="text-[#EBE7DF]">*</span>
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
              {t(
                "Notas para el autor o solicitud de dedicatoria manuscrita",
                "Notes for the author or handwritten dedication request"
              )}
            </label>
            <textarea
              id="checkout-notas"
              rows={2}
              value={customer.notas}
              onChange={(e) => setCustomer({ ...customer, notas: e.target.value })}
              placeholder={t("Instrucciones para la entrega o dedicatoria...", "Delivery instructions or dedication note...")}
              className="mt-1.5 w-full border border-white/[0.1] bg-[#151618] px-3.5 py-2 text-xs text-[#EBE7DF] placeholder-[#8E8A80]/40 focus:border-white/40 focus:outline-none"
            />
          </div>

          {/* Modalidad de Pago */}
          <div className="border border-white/[0.08] bg-[#121316] p-4 space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C5A880]">
              {t("Modalidad de Pago", "Payment Method")}
            </p>

            {PAGOS_ACTIVOS && (
              <label
                className={`flex items-start gap-3 p-3 border cursor-pointer transition ${
                  paymentMethod === "stripe"
                    ? "border-[#C5A880] bg-[#C5A880]/10 text-white"
                    : "border-white/[0.08] bg-[#151618] text-[#8E8A80] hover:border-white/20"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                  className="mt-1 accent-[#C5A880]"
                />
                <div className="flex-1 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="font-medium text-[#EBE7DF]">
                      {t("Tarjeta de crédito / débito, Apple Pay, Google Pay", "Credit / Debit Card, Apple Pay, Google Pay")}
                    </span>
                    <span className="text-[10px] font-mono text-[#C5A880] border border-[#C5A880]/30 px-1.5 py-0.5">
                      {t("Pago Online Cifrado", "Encrypted Online Payment")}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#A39E93] leading-relaxed">
                    {t("Pago seguro instantáneo con tarjeta. Sin recargos adicionales.", "Instant secure card checkout with zero extra fees.")}
                  </p>
                </div>
              </label>
            )}

            <label
              className={`flex items-start gap-3 p-3 border cursor-pointer transition ${
                paymentMethod === "transferencia"
                  ? "border-[#C5A880] bg-[#C5A880]/10 text-white"
                  : "border-white/[0.08] bg-[#151618] text-[#8E8A80] hover:border-white/20"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="transferencia"
                checked={paymentMethod === "transferencia"}
                onChange={() => setPaymentMethod("transferencia")}
                className="mt-1 accent-[#C5A880]"
              />
              <div className="flex-1 text-xs">
                <span className="font-medium text-[#EBE7DF]">
                  {t("Transferencia bancaria / Factura proforma", "Bank transfer / Proforma invoice")}
                </span>
                <p className="mt-1 text-[11px] text-[#A39E93] leading-relaxed">
                  {t(
                    "Te remitiremos los datos bancarios (IBAN) por correo electrónico tras validar la disponibilidad de la tirada.",
                    "We will email bank transfer (IBAN) details after verifying numbered edition availability."
                  )}
                </p>
              </div>
            </label>
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
              {t("Acepto la ", "I accept the ")}
              <Link href="/legal#privacidad" target="_blank" className="text-[#EBE7DF] underline decoration-white/30 hover:text-white">
                {t("Política de Privacidad", "Privacy Policy")}
              </Link>
              {t(
                ". Los datos se emplearán exclusivamente para la facturación, certificación y entrega de la obra.",
                ". Your information will only be used for invoicing, edition certification, and shipping."
              )}
            </label>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-[#8E8A80] font-mono text-center sm:text-left">
              <span>
                {PAGOS_ACTIVOS && paymentMethod === "stripe"
                  ? t("Pasarela cifrada SSL 256 bits", "256-bit SSL encrypted checkout")
                  : t("Pago seguro tras confirmación", "Secure payment after confirmation")}
              </span>
              <span className="block text-[10px] text-white/40">
                {PAGOS_ACTIVOS && paymentMethod === "stripe"
                  ? "Apple Pay · Google Pay · Visa · Mastercard"
                  : t("Transferencia bancaria / Confirmación directa", "Bank transfer / Direct confirmation")}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || !privacyAccepted}
              className="w-full sm:w-auto inline-flex items-center justify-center border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-[#0B0C0E] font-medium transition hover:bg-transparent hover:text-white disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? t("Procesando adquisición...", "Processing order...")
                : paymentMethod === "stripe"
                ? t(
                    `Pagar con Tarjeta (${totalAmount} €) →`,
                    `Pay by Card (€${totalAmount} / ${formatApproxUsd(totalAmount, usdRate)}) →`
                  )
                : t(
                    `Confirmar Reserva (${totalAmount} €) →`,
                    `Confirm Reservation (€${totalAmount} / ${formatApproxUsd(totalAmount, usdRate)}) →`
                  )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
