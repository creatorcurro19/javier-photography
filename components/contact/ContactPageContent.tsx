"use client";

import Container from "@/components/ui/Container";
import ContactForm from "@/components/contact/ContactForm";
import { getPlazos } from "@/data/plazos";
import { SITE_CONFIG } from "@/data/site-config";
import { useLanguage } from "@/lib/i18n";

export default function ContactPageContent() {
  const { lang, t } = useLanguage();
  const plazos = getPlazos(lang);

  const contactInfo = [
    {
      label: t("Correo Electrónico de Contacto", "Contact Email"),
      value: SITE_CONFIG.contactEmail,
      href: `mailto:${SITE_CONFIG.contactEmail}`,
      note: `${t("Atención directa por el autor", "Direct author response")} · ${plazos.respuesta}`,
    },
    {
      label: t("Base de Operaciones", "Home Base"),
      value: lang === "en" ? SITE_CONFIG.locationLabelEn : SITE_CONFIG.locationLabel,
      note: t(
        "Base en Tenerife con disponibilidad para desplazamientos",
        "Based in Tenerife and available to travel"
      ),
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-28 pb-24 text-[#EBE7DF]">
      <Container className="relative z-10">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
            {t("Atención Personalizada", "Personal Attention")}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-light tracking-wide text-[#EBE7DF] sm:text-5xl">
            {t("Contacto", "Contact")}
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#A39E93] font-light">
            {t(
              "Escríbeme para encargar una lámina, pedir presupuesto para una sesión o hacer cualquier consulta.",
              "Write to commission a print, request a quote for a shoot, or ask any question."
            )}
          </p>
        </div>

        {/* Content Layout */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Main Form (8 cols) */}
          <div className="relative border border-white/[0.1] bg-[#151618] p-6 sm:p-10 lg:col-span-8">
            <h2 className="font-serif text-xl sm:text-2xl font-light text-[#EBE7DF]">
              {t("Envíame un mensaje", "Send me a message")}
            </h2>

            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          {/* Sidebar Info (4 cols) */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <div className="border border-white/[0.08] bg-[#151618] p-6 sm:p-8">
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-[#C5A880]">
                {t("Contacto Directo", "Direct Contact")}
              </h2>
              <div className="mt-5 space-y-5">
                {contactInfo.map((item) => (
                  <div
                    key={item.label}
                    className="border-b border-white/[0.06] pb-4 last:border-b-0 last:pb-0"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-1.5 block font-mono text-sm text-[#EBE7DF] transition hover:text-white hover:underline underline-offset-4"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1.5 font-mono text-sm text-[#EBE7DF]">{item.value}</p>
                    )}
                    <p className="mt-1 text-xs text-[#8E8A80] font-light">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
