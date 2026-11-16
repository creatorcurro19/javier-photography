import { Suspense } from "react";
import Container from "@/components/ui/Container";
import ContactForm from "@/components/contact/ContactForm";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Contacto | Javier Espinosa",
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
    value: "España (Península Ibérica)",
    note: "Disponibilidad para desplazamientos nacionales e internacionales",
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
    <div className="min-h-screen bg-[#101112] pt-36 pb-28 text-[#D8D5CD]">
      <Container>
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-[#95836B] font-mono">
            Contacto & Solicitudes
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-[#D8D5CD] sm:text-5xl lg:text-6xl">
            Iniciar una conversación
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#D8D5CD]/80 sm:text-lg font-light">
            Ya sea para la cobertura técnica de una prueba de automoción, un proyecto arquitectónico, 
            la adquisición de una obra en soporte de algodón o la cesión de derechos para una publicación, 
            describa sus requerimientos y recibirá una propuesta detallada.
          </p>
        </div>

        {/* Content Layout */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Main Form (8 cols) */}
          <div className="border border-[#1D2021] bg-[#1D2021]/30 p-8 sm:p-12 lg:col-span-8 rounded-xl">
            <h2 className="text-xs uppercase tracking-[0.3em] text-[#95836B] font-mono">
              Formulario de Consulta
            </h2>
            <p className="mt-1 font-serif text-2xl text-[#D8D5CD]">
              Especifique los detalles de su proyecto
            </p>

            <div className="mt-8">
              <Suspense
                fallback={
                  <div className="py-12 text-center text-sm text-neutral-500">
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
            <div className="border border-[#1D2021] bg-[#1D2021]/40 p-8 sm:p-10 rounded-xl">
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#95836B] font-mono">
                Información Directa
              </h2>
              <div className="mt-6 space-y-6">
                {CONTACT_INFO.map((item) => (
                  <div key={item.label} className="border-b border-[#1D2021] pb-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#95836B] font-mono">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-1.5 block font-mono text-sm text-[#D8D5CD] transition hover:text-white"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1.5 text-sm text-[#D8D5CD]">{item.value}</p>
                    )}
                    <p className="mt-1 text-xs text-neutral-400 font-light">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#1D2021] bg-[#1D2021]/20 p-8 sm:p-10 rounded-xl">
              <h3 className="text-xs uppercase tracking-[0.3em] text-[#95836B] font-mono">
                Compromiso de Trabajo
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-[#D8D5CD]/70 font-light">
                Cada encargo se aborda con preparación topográfica previa, estudio de iluminación 
                y entrega ágil de archivos revelados en perfiles estándar para reproducción litográfica o digital.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
