"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { AndalusianStarMark } from "@/components/ui/AndalusianMotif";
import { useLanguage } from "@/lib/i18n";

export default function HomeQuickContact() {
  const { lang, t } = useLanguage();
  const phone = process.env.NEXT_PUBLIC_WHATSAPP;

  return (
    <section
      aria-label={t("Contacto directo", "Direct contact")}
      className="relative border-t border-[#C5A880]/20 bg-[#0B0C0E] py-16 sm:py-20"
    >
      <Container>
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#C5A880]/25 bg-[#121417]/80 p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#C5A880]">
            <AndalusianStarMark className="h-3 w-3 text-[#C5A880]" />
            <span>{t("Contacto Directo & Encargos", "Direct Inquiries & Commissions")}</span>
          </div>

          <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF]">
            {t(
              "¿Planeas un proyecto editorial o buscas una pieza para tu espacio?",
              "Planning an editorial assignment or seeking a print for your space?"
            )}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm font-light text-[#8E8A80] leading-relaxed">
            {t(
              "Atiendo personalmente cada solicitud de adquisición de copias Fine Art, encargos en las Islas Canarias o internacional, y cesión de licencias de archivo.",
              "I personally attend each request for certified prints, bespoke photographic commissions in the Canary Islands or abroad, and archive licensing."
            )}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs uppercase tracking-wider">
            <Link
              href="/contact"
              className="w-full sm:w-auto rounded-lg border border-[#C5A880] bg-[#C5A880] px-7 py-3.5 text-[#0B0C0E] font-semibold transition hover:bg-white hover:border-white"
            >
              {t("Escribir mensaje directo →", "Send direct message →")}
            </Link>

            {phone && phone.trim() !== "" && (
              <a
                href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  lang === "en"
                    ? "Hello Javier, I am contacting you from your website."
                    : "Hola Javier, te contacto desde tu web."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto rounded-lg border border-white/20 bg-[#151719] px-7 py-3.5 text-[#EBE7DF] transition hover:border-[#25D366] hover:text-[#25D366]"
              >
                WhatsApp ↗
              </a>
            )}

            <a
              href="mailto:javierespinosa1995@hotmail.com"
              className="w-full sm:w-auto rounded-lg border border-white/10 bg-[#151719] px-7 py-3.5 text-[#8E8A80] transition hover:border-white/30 hover:text-[#EBE7DF]"
            >
              Email ↗
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
