"use client";

import { useLanguage } from "@/lib/i18n";

export default function WhatsAppButton() {
  const { lang, t } = useLanguage();
  // El número de teléfono se lee exclusivamente de la variable de entorno NEXT_PUBLIC_WHATSAPP
  const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP;

  // Si no está configurada la variable de entorno, NO se renderiza (REGLA: no inventar números)
  if (!rawPhone || rawPhone.trim() === "") {
    return null;
  }

  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
  const defaultText =
    lang === "en"
      ? "Hello Javier, I am writing to you from your website regarding your fine art prints and commissions."
      : "Hola Javier, te escribo desde tu web interesado en tus copias de autor y encargos fotográficos.";

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultText)}`;

  return (
    <aside
      aria-label={t("Contacto directo por WhatsApp", "Direct WhatsApp contact")}
      className="fixed bottom-6 right-6 z-40 print:hidden"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t(
          "Contactar por WhatsApp con Javier Espinosa",
          "Contact Javier Espinosa via WhatsApp"
        )}
        className="group flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#0B0C0E]/92 p-2.5 sm:px-4 sm:py-2.5 text-xs text-[#EBE7DF] shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-[#25D366] hover:bg-[#121B15] hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15Z" />
          </svg>
        </div>
        <span className="hidden font-mono text-[11px] uppercase tracking-wider text-[#EBE7DF] group-hover:text-white sm:inline">
          WhatsApp
        </span>
      </a>
    </aside>
  );
}
