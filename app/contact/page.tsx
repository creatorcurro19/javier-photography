import Container from "@/components/ui/Container";
import ContactForm from "@/components/contact/ContactForm";
import {
  AndalusianCenefa,
  AndalusianCornerOrnaments,
  AndalusianPageBackdrop,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Contacto Privado & Consultas | Javier Espinosa",
  description:
    "Póngase en contacto con Javier Espinosa Martínez para encargos fotográficos, adquisición de copias Fine Art, licencias de uso o exposiciones.",
  path: "/contact",
});

const CONTACT_INFO = [
  {
    label: "Correo Electrónico de Contacto",
    value: "javierespinosa1995@hotmail.com",
    href: "mailto:javierespinosa1995@hotmail.com",
    note: "Atención directa por el autor · Plazo de respuesta: 24–48 h laborables",
  },
  {
    label: "Base de Operaciones",
    value: "Puerto de la Cruz (Tenerife, Islas Canarias)",
    note: "Base insular con disponibilidad para desplazamientos a Península e internacionales",
  },
  {
    label: "Especialidades",
    value: "Rally / Motor · Arquitectura · Fauna · Documental",
    note: "Equipo Canon EOS R7 y ópticas de precisión",
  },
  {
    label: "Tiradas Fine Art",
    value: "Edición Directa en Tubo Rígido (Hahnemühle 308g / Baryta 340g) y Saatchi Art",
    href: "https://www.saatchiart.com/javier-espinosa-photography",
    note: "Certificado de autenticidad y numeración de autor",
  },
  {
    label: "Banco de Licencias Secundario",
    value: "Getty Images / iStock Portfolio",
    href: "https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image",
    note: "Licencia directa como canal principal; iStock para descarga de agencia",
  },
];

export default function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-28 pb-24 text-[#EBE7DF]">
      <div className="hidden">
        <AndalusianPageBackdrop variant="laceria" />
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="hidden items-center gap-2.5">
            <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]/75" />
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#C5A880]/85">
              The Art of Seeing · Contacto Directo
            </p>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
            Respuesta en 24–48 h
          </p>
          <h1 className="mt-2 font-serif text-3xl font-light tracking-wide text-[#EBE7DF] sm:text-5xl">
            Contacto
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#A39E93] font-light">
            Escríbeme para encargar una lámina, pedir presupuesto para una sesión o hacer cualquier consulta.
          </p>
        </div>

        <div className="hidden">
          <AndalusianCenefa
            variant="estrella"
            className="mt-10 text-[#C5A880]/38"
          />
        </div>

        {/* Content Layout */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Main Form (8 cols) */}
          <div className="relative border border-white/[0.1] bg-[#151618] p-6 sm:p-10 lg:col-span-8">
            <div className="hidden">
              <AndalusianCornerOrnaments className="text-[#C5A880]/50" />
            </div>
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
                {CONTACT_INFO.map((item, idx) => (
                  <div key={item.label} className={idx >= 2 ? "hidden" : "border-b border-white/[0.06] pb-4"}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
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

            <div className="border border-white/[0.08] bg-[#151618] p-8 sm:p-10">
              <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-[#8E8A80]">
                Compromiso de Trabajo
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-[#8E8A80] font-light">
                Cada encargo se aborda con preparación topográfica previa, estudio de iluminación natural 
                y entrega ágil de archivos revelados en perfiles estándar para reproducción litográfica o digital.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
