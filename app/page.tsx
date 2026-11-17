import Hero from "@/components/home/Hero";
import SelectedWork from "@/components/home/SelectedWork";
import CollectionsOverview from "@/components/home/CollectionsOverview";
import SelectedProjects from "@/components/home/SelectedProjects";
import AboutPreview from "@/components/home/AboutPreview";
import Container from "@/components/ui/Container";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/metadata";
import { getFeaturedPhotos } from "@/lib/photos";

export const metadata = buildPageMetadata({
  title: "Javier Espinosa | The Art of Seeing — Fotografía de Autor",
  description:
    "Galería y museo digital de fotografía de autor por Javier Espinosa Martínez. Fauna salvaje, paisaje documental, automovilismo clásico y rally histórico, arquitectura vernácula y etnografía.",
  path: "/",
});

export default function Home() {
  const featuredPhotos = getFeaturedPhotos();

  return (
    <>
      <Hero />
      <SelectedWork photos={featuredPhotos} />
      <CollectionsOverview />
      <SelectedProjects />
      <AboutPreview />

      {/* Collector's Acquisitions & Editorial Inquiries Alcove */}
      <section
        className="bg-[#0B0C0E] py-28 sm:py-36 border-t border-white/[0.08]"
        aria-label="Adquisición de Obra & Encargos"
      >
        <Container>
          <div className="max-w-4xl mx-auto text-center border border-white/[0.08] bg-[#151618] p-10 sm:p-16 lg:p-20 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-6 bg-white/30" />
              <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-[#8E8A80]">
                Coleccionismo & Encargos
              </p>
              <span className="h-px w-6 bg-white/30" />
            </div>

            <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#EBE7DF] tracking-tight">
              Obra de Autor & Tiradas Certificadas
            </h2>

            <p className="mt-6 max-w-2xl mx-auto text-sm sm:text-base font-light text-[#8E8A80] leading-relaxed">
              Ediciones limitadas impresas sobre papel de algodón 100% Hahnemühle Photo Rag® 308g con tintas de pigmento mineral UltraChrome PRO, bajo estricto cumplimiento de la norma ISO 9706 de conservación museística.
            </p>

            {/* Museum Quality Key Highlights */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-white/[0.08] py-6 font-mono text-[10px] uppercase tracking-wider text-[#8E8A80]">
              <div className="p-2">
                <span className="block text-white font-medium">Hahnemühle 308g</span>
                <span className="text-[9px] text-[#8E8A80]/70">100% Algodón Mate</span>
              </div>
              <div className="p-2 border-l border-white/[0.06]">
                <span className="block text-white font-medium">ISO 9706</span>
                <span className="text-[9px] text-[#8E8A80]/70">Longevidad 100+ Años</span>
              </div>
              <div className="p-2 border-l border-white/[0.06]">
                <span className="block text-white font-medium">Firma & Holograma</span>
                <span className="text-[9px] text-[#8E8A80]/70">Certificado Oficial</span>
              </div>
              <div className="p-2 border-l border-white/[0.06]">
                <span className="block text-white font-medium">Tiradas Limitadas</span>
                <span className="text-[9px] text-[#8E8A80]/70">Series de 10 a 50</span>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/prints"
                className="group inline-flex items-center gap-2 border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 text-[11px] uppercase tracking-[0.26em] text-[#0B0C0E] font-medium transition-all duration-300 hover:bg-transparent hover:text-white"
              >
                <span>Catálogo de Copias Fine Art</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-white/20 bg-transparent px-8 py-3.5 text-[11px] uppercase tracking-[0.26em] text-[#EBE7DF] transition-all duration-300 hover:border-white/50 hover:text-white"
              >
                Iniciar Consulta Privada
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
