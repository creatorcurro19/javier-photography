import Hero from "@/components/home/Hero";
import CollectionsOverview from "@/components/home/CollectionsOverview";
import SelectedProjects from "@/components/home/SelectedProjects";
import AboutPreview from "@/components/home/AboutPreview";
import Container from "@/components/ui/Container";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Javier Espinosa Martínez | Fotografía de Autor",
  description:
    "Portfolio y archivo fotográfico de autor por Javier Espinosa Martínez. Fauna salvaje, paisaje documental, automovilismo clásico y rally histórico, arquitectura y etnografía.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <CollectionsOverview />
      <SelectedProjects />
      <AboutPreview />

      {/* Commercial Section CTA */}
      <section className="bg-[#101112] py-28 border-t border-[#1D2021]">
        <Container>
          <div className="rounded-2xl border border-[#1D2021] bg-gradient-to-b from-[#1D2021]/80 to-[#101112] p-10 md:p-16 text-center max-w-4xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.4em] text-[#95836B]">
              Servicios y Encargos Fotográficos
            </span>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl font-light text-[#D8D5CD]">
              ¿Tienes un proyecto en mente?
            </h2>
            <p className="mt-6 text-base font-light text-[#D8D5CD]/80 leading-relaxed max-w-2xl mx-auto">
              Realizo encargos de cobertura de automovilismo y rally histórico, proyectos documentales de territorio,
              fotografía de arquitectura y venta de copias de autor Fine Art de alta conservación.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/servicios"
                className="border border-[#D8D5CD] bg-[#D8D5CD] px-8 py-3.5 text-xs font-mono uppercase tracking-[0.25em] text-[#101112] font-semibold transition hover:bg-transparent hover:text-white"
              >
                Ver Servicios y Encargos
              </Link>
              <Link
                href="/prints"
                className="border border-[#1D2021] bg-[#1D2021]/60 px-8 py-3.5 text-xs font-mono uppercase tracking-[0.25em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
              >
                Catálogo de Prints
              </Link>
              <Link
                href="/contact"
                className="border border-transparent px-6 py-3.5 text-xs font-mono uppercase tracking-[0.25em] text-[#95836B] hover:text-[#D8D5CD]"
              >
                Contactar Directamente
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
