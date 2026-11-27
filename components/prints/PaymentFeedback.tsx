"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { clearCart } from "@/lib/cart";

export default function PaymentFeedback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pago = searchParams.get("pago");
  const ref = searchParams.get("ref");

  // El aviso se deriva de la URL; solo guardamos si el usuario lo ha cerrado.
  const [dismissed, setDismissed] = useState(false);
  const visible = !dismissed && (pago === "confirmado" || pago === "cancelado");

  // Efecto con sistema externo (localStorage del carrito): vaciar la cesta tras pago confirmado.
  useEffect(() => {
    if (pago === "confirmado") clearCart();
  }, [pago]);

  const handleDismiss = () => {
    setDismissed(true);
    // Limpiar searchParams de la URL de forma limpia
    router.replace("/prints", { scroll: false });
  };

  if (!visible || !pago) return null;

  if (pago === "confirmado") {
    return (
      <aside
        aria-label="Confirmación de pago de adquisición Fine Art"
        className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      >
        <div className="relative w-full max-w-xl border border-[#C5A880]/40 bg-[#0B0C0E] p-6 sm:p-10 text-center shadow-2xl">
          {/* Doble marco dorado sutil */}
          <div className="absolute inset-2 pointer-events-none border border-[#C5A880]/15" />

          {/* Emblema superior */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#C5A880]/40 bg-[#C5A880]/10 text-[#C5A880]">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.75"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.3em] text-[#C5A880]">
            Adquisición de Obra Fine Art
          </p>

          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-light text-[#F7F4EE]">
            ¡Pago Confirmado con Éxito!
          </h2>

          {ref && (
            <div className="mt-4 inline-block border border-white/10 bg-white/[0.04] px-4 py-1.5 font-mono text-xs text-[#EBE7DF]">
              Referencia: <span className="font-semibold text-[#C5A880]">{ref}</span>
            </div>
          )}

          <div className="mt-6 space-y-3 text-left text-xs sm:text-sm text-[#A39E93] leading-relaxed border-t border-white/10 pt-5">
            <p>
              Hemos recibido tu abono de forma segura. Javier Espinosa Martínez ha recibido los detalles del encargo.
            </p>
            <div className="space-y-1.5 bg-[#15161B] p-3.5 border border-white/[0.06] text-xs">
              <p className="text-[#C5A880] font-mono uppercase tracking-wider text-[10px]">
                Próximos Pasos:
              </p>
              <p>
                1. <strong>Impresión Giclée:</strong> Copia producida en papel 100% algodón <em>Hahnemühle Photo Rag 308g</em> bajo norma ISO 9706.
              </p>
              <p>
                2. <strong>Firma y Certificado:</strong> Numeración correlativa y firma autógrafa a lápiz de grafito.
              </p>
              <p>
                3. <strong>Envío Asegurado:</strong> Protección en papel seda libre de ácido y tubo rígido de alta densidad (3-4 mm). Recibirás el localizador en tu correo.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleDismiss}
              className="border border-[#C5A880] bg-[#C5A880] px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] font-medium text-[#0B0C0E] transition hover:bg-transparent hover:text-[#F7F4EE] cursor-pointer"
            >
              Explorar Catálogo de Obras
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // pago === "cancelado"
  return (
    <aside
      aria-label="Aviso de pago cancelado"
      className="relative z-30 mb-8 border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 text-amber-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-medium text-sm text-[#F7F4EE]">
              El proceso de pago no fue completado
            </p>
            <p className="text-xs text-[#A39E93] mt-0.5">
              Tus obras seleccionadas se mantienen en tu cesta por si deseas reintentarlo con otra tarjeta o tramitar la reserva por transferencia bancaria.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="self-end sm:self-auto px-3 py-1 text-xs font-mono uppercase tracking-wider border border-white/20 text-[#EBE7DF] hover:bg-white/10 transition cursor-pointer"
        >
          Entendido
        </button>
      </div>
    </aside>
  );
}
