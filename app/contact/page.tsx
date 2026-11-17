import { Suspense } from "react";
import Container from "@/components/ui/Container";
import ContactForm from "@/components/contact/ContactForm";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Contacto Privado & Consultas | Javier Espinosa",
  description:
    "Póngase en contacto con Javier Espinosa Martínez para encargos fotográficos, adquisición de copias Fine Art, licencias de uso o exposiciones.",
  path: "/contact",
});

const CONTACT_INFO = [
  {
    label: "Correo Electrónico",
    value: "javierespinosa1995@hotmail.com",
    href: "mailto:javierespinosa1995@hotmail.com",
    note: "Respuesta habitual en menos de 24 horas",
  },
  {
    label: "Base de Operaciones",
    value: "Tenerife, Canarias, España",
    note: "Base insular con disponibilidad para desplazamientos a Península e internacionales",
  },
  {
    label: "Especialidades",
    value: "Rally / Motor · Arquitectura · Fauna · Viajes",
    note: "Equipo Canon EOS R7 y ópticas de precisión",
  },
  {
    label: "Tiradas Fine Art",
    value: "Saatchi Art & Edición Directa Hahnemühle 308g",
    href: "https://www.saatchiart.com/javier-espinosa-photography",
    note: "Certificado de autenticidad y numeración de autor",
  },
  {
    label: "Banco de Licencias",
    value: "Getty Images / iStock Portfolio",
    href: "https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image",
    note: "Descarga inmediata para agencias y editoriales",
  },
  {
    label: "Instagram Oficial",
    value: "@Javier.espinosa19",
    href: "https://www.instagram.com/Javier.espinosa19/",
    note: "Publicaciones recientes y cuaderno de viaje",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <Container>
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-white/30" />
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#8E8A80]">
              The Art of Seeing · Contacto Directo
            </p>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-[#EBE7DF] sm:text-5xl lg:text-6xl">
            Iniciar una conversación
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#8E8A80] font-light">
            Ya sea para la cobertura técnica de una prueba de automoción, un proyecto arquitectónico, 
            la adquisición de una obra en soporte de algodón Hahnemühle o la cesión de derechos para una publicación editorial, 
            describa sus requerimientos y recibirá una propuesta detallada.
          </p>
        </div>

        {/* Content Layout */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Main Form (8 cols) */}
          <div className="border border-white/[0.08] bg-[#151618] p-8 sm:p-12 lg:col-span-8">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#8E8A80]">
              Formulario de Consulta
            </h2>
            <p className="mt-1 font-serif text-2xl font-light text-[#EBE7DF]">
              Especifique los detalles de su proyecto
            </p>

            <div className="mt-8">
              <Suspense
                fallback={
                  <div className="py-12 text-center text-sm font-mono text-[#8E8A80]">
                    Cargando formulario de contacto...
                  </div>
                }
              >
                <ContactForm />
              </Suspense>
            </div>
          </div>

          {/* Sidebar Info (4 cols) */}
          <div className="flex flex-col gap-8 lg:col-span-4">
            <div className="border border-white/[0.08] bg-[#151618] p-8 sm:p-10">
              <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#8E8A80]">
                Información Directa
              </h2>
              <div className="mt-6 space-y-6">
                {CONTACT_INFO.map((item) => (
                  <div key={item.label} className="border-b border-white/[0.06] pb-5">
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
