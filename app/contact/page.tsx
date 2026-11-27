import Container from "@/components/ui/Container";
import ContactForm from "@/components/contact/ContactForm";
import { PLAZOS } from "@/data/plazos";
import { SITE_CONFIG } from "@/data/site-config";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Contacto y Consultas | Javier Espinosa",
  description:
    "Contacta con Javier Espinosa en Tenerife para solicitar una copia Fine Art, pedir presupuesto para un reportaje o resolver cualquier duda.",
  path: "/contact",
});

const CONTACT_INFO = [
  {
    label: "Correo Electrónico de Contacto",
    value: SITE_CONFIG.contactEmail,
    href: `mailto:${SITE_CONFIG.contactEmail}`,
    note: `Atención directa por el autor · ${PLAZOS.respuesta}`,
  },
  {
    label: "Base de Operaciones",
    value: SITE_CONFIG.locationLabel,
    note: "Base en Tenerife con disponibilidad para desplazamientos",
  },
];

export default function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-28 pb-24 text-[#EBE7DF]">
      <Container className="relative z-10">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
            Atención Personalizada
          </p>
          <h1 className="mt-2 font-serif text-3xl font-light tracking-wide text-[#EBE7DF] sm:text-5xl">
            Contacto
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#A39E93] font-light">
            Escríbeme para encargar una lámina, pedir presupuesto para una sesión o hacer cualquier consulta.
          </p>
        </div>

        {/* Content Layout */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Main Form (8 cols) */}
          <div className="relative border border-white/[0.1] bg-[#151618] p-6 sm:p-10 lg:col-span-8">
            <h2 className="font-serif text-xl sm:text-2xl font-light text-[#EBE7DF]">
              Envíame un mensaje
            </h2>

            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          {/* Sidebar Info (4 cols) */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <div className="border border-white/[0.08] bg-[#151618] p-6 sm:p-8">
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-[#C5A880]">
                Contacto Directo
              </h2>
              <div className="mt-5 space-y-5">
                {CONTACT_INFO.map((item) => (
                  <div key={item.label} className="border-b border-white/[0.06] pb-4 last:border-b-0 last:pb-0">
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
