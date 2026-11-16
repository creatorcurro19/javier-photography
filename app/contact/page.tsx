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
    value: "hello@javierespinosa.com",
    href: "mailto:hello@javierespinosa.com",
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
    value: "Hahnemühle Photo Rag 308g",
    note: "Certificado de autenticidad y numeración de autor",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black pt-36 pb-28 text-neutral-300">
      <Container>
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
            Contacto & Solicitudes
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-neutral-100 sm:text-5xl lg:text-6xl">
            Iniciar una conversación
          </h1>
          <p className="mt-6 text-base leading-relaxed text-neutral-400 sm:text-lg">
            Ya sea para la cobertura técnica de una prueba de automoción, un proyecto arquitectónico, 
            la adquisición de una obra en soporte de algodón o la cesión de derechos para una publicación, 
            describa sus requerimientos y recibirá una propuesta detallada.
          </p>
        </div>

        {/* Content Layout */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Main Form (8 cols) */}
          <div className="border border-neutral-800 bg-neutral-950/60 p-8 sm:p-12 lg:col-span-8 rounded-lg">
            <h2 className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              Formulario de Consulta
            </h2>
            <p className="mt-1 font-serif text-2xl text-neutral-100">
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
            <div className="border border-neutral-800 bg-neutral-950/40 p-8 sm:p-10 rounded-lg">
              <h2 className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                Información Directa
              </h2>
              <div className="mt-6 space-y-6">
                {CONTACT_INFO.map((item) => (
                  <div key={item.label} className="border-b border-neutral-900 pb-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-1.5 block font-mono text-sm text-neutral-200 transition hover:text-white"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1.5 text-sm text-neutral-200">{item.value}</p>
                    )}
                    <p className="mt-1 text-xs text-neutral-500">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-neutral-800 bg-neutral-950/20 p-8 sm:p-10 rounded-lg">
              <h3 className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                Compromiso de Trabajo
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-neutral-400">
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
