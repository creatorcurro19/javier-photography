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

      {/* Fine Art & Commissions Inquiries */}
      <section className="bg-[#101112] py-24 sm:py-32 border-t border-[#1D2021]">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#95836B]">
              Copias Fine Art & Encargos
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#D8D5CD]">
              Obra de Autor para Coleccionismo
            </h2>
            <p className="mt-5 text-sm sm:text-base font-light text-[#D8D5CD]/75 leading-relaxed">
              Tiradas limitadas certificadas bajo norma ISO 9706 sobre papel de algodón 100% Hahnemühle Photo Rag 308g,
              y encargos de cobertura documental, automovilismo y territorio.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/prints"
                className="border border-[#D8D5CD] bg-[#D8D5CD] px-7 py-3 text-[11px] uppercase tracking-[0.24em] text-[#101112] font-medium transition hover:bg-transparent hover:text-white"
              >
                Catálogo de Prints
              </Link>
              <Link
                href="/contact"
                className="border border-[#1D2021] bg-[#141617] px-7 py-3 text-[11px] uppercase tracking-[0.24em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
              >
                Iniciar Consulta
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
