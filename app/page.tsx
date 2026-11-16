import Hero from "@/components/home/Hero";
import SelectedWork from "@/components/home/SelectedWork";
import CollectionsOverview from "@/components/home/CollectionsOverview";
import AboutPreview from "@/components/home/AboutPreview";
import StoriesPreview from "@/components/home/StoriesPreview";
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
      <SelectedWork />
      <StoriesPreview />
      <AboutPreview />

      {/* Commercial Section CTA */}
      <section className="bg-neutral-950 py-24 border-t border-neutral-900">
        <Container>
          <div className="rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900/80 to-black p-10 md:p-16 text-center max-w-4xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.4em] text-neutral-400">
              Servicios y Encargos Fotográficos
            </span>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl font-light text-neutral-100">
              ¿Tienes un proyecto en mente?
            </h2>
            <p className="mt-6 text-base font-light text-neutral-300 leading-relaxed max-w-2xl mx-auto">
              Realizo encargos de cobertura de automovilismo y rally histórico, proyectos documentales de territorio,
              fotografía de arquitectura y venta de copias de autor Fine Art de alta conservación.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/servicios"
                className="border border-neutral-200 bg-neutral-100 px-8 py-3.5 text-xs font-mono uppercase tracking-[0.25em] text-neutral-950 font-medium transition hover:bg-white hover:text-black hover:border-white"
              >
                Ver Servicios y Encargos
              </Link>
              <Link
                href="/prints"
                className="border border-neutral-700 bg-neutral-900/60 px-8 py-3.5 text-xs font-mono uppercase tracking-[0.25em] text-neutral-200 transition hover:border-neutral-400 hover:text-white"
              >
                Catálogo de Prints
              </Link>
              <Link
                href="/contact"
                className="border border-transparent px-6 py-3.5 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 hover:text-neutral-200"
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
