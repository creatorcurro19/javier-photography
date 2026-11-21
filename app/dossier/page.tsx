import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PrintDossierButton from "@/components/dossier/PrintDossierButton";
import {
  AndalusianCenefa,
  AndalusianCornerOrnaments,
  AndalusianPageBackdrop,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";
import { buildPageMetadata } from "@/lib/metadata";
import { getFeaturedPhotos } from "@/lib/photos";
import { CATEGORY_METADATA } from "@/types/photo";

export const metadata = buildPageMetadata({
  title: "Dossier de Autor & Press Kit (PDF) | Javier Espinosa",
  description:
    "Dossier curatorial y Press Kit oficial de Javier Espinosa Martínez: biografía, cinco disciplinas, selección de obra Fine Art, equipo óptico y contacto para prensa y galerías.",
  path: "/dossier",
});

export default function DossierPage() {
  const plates = getFeaturedPhotos().slice(0, 6);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF] print:bg-white print:pt-6 print:pb-6 print:text-neutral-900">
      <div className="print:hidden">
        <AndalusianPageBackdrop variant="sebka" />
      </div>

      <Container className="relative z-10 max-w-4xl">
        {/* Barra superior de descarga */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#C5A880]/25 pb-6 print:hidden">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880]">
              Edición Curatorial · Formato A4
            </p>
            <p className="mt-1 text-xs text-[#8E8A80]">
              Listo para prensa, galerías, patrocinadores y estudios de arquitectura.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <PrintDossierButton />
            <Link
              href="/contact"
              className="border border-[#C5A880]/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#EBE7DF] transition hover:border-[#C5A880] hover:text-white"
            >
              Contacto
            </Link>
          </div>
        </div>

        {/* Documento Editorial del Dossier */}
        <article className="relative border border-[#C5A880]/30 bg-[#151618]/95 p-8 sm:p-14 print:border-neutral-300 print:bg-white print:p-6">
          <div className="print:hidden">
            <AndalusianCornerOrnaments className="text-[#C5A880]/60" />
          </div>

          {/* Portada del Dossier */}
          <header className="flex flex-col items-center text-center border-b border-[#C5A880]/25 pb-10 print:border-neutral-300">
            <Image
              src="/icon.svg"
              alt="Monograma JE — Javier Espinosa"
              width={64}
              height={64}
              className="h-14 w-14 rounded-xl ring-1 ring-[#C5A880]/40"
            />
            <div className="mt-5 flex items-center gap-2.5">
              <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#C5A880] print:text-neutral-600">
                Dossier de Autor & Press Kit
              </p>
              <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]" />
            </div>

            <h1 className="mt-3 font-sans text-3xl sm:text-5xl font-light tracking-[0.22em] uppercase text-[#F7F4EE] print:text-neutral-900">
              Javier Espinosa
            </h1>
            <p className="mt-2 font-serif italic text-xl text-[#E5D3B3] print:text-neutral-700">
              The Art of Seeing · Fotografía de Autor
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#8E8A80] print:text-neutral-600">
              Raíces Andaluzas · Base en Tenerife, Canarias · Movilidad Internacional
            </p>
          </header>

          {/* Declaración y Biografía */}
          <section className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-7 space-y-4">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880] print:text-neutral-700">
                01 · Enfoque y Trayectoria
              </h2>
              <blockquote className="border-l-2 border-[#C5A880]/60 pl-4 font-serif italic text-base leading-relaxed text-[#F7F4EE] print:text-neutral-900">
                «La fotografía no tiene que demostrar constantemente lo impresionante que es el mundo. A veces basta con detenerse a observarlo.»
              </blockquote>
              <p className="text-sm font-light leading-relaxed text-[#D4CEC3] print:text-neutral-700">
                Fotógrafo español con raíces andaluzas y base en Tenerife (Islas Canarias). Su archivo abarca cinco ámbitos —<strong>Paisaje, Fauna salvaje, Automovilismo clásico, Arquitectura y Fotografía documental</strong>— unidos por una misma forma de mirar: atención a los detalles cotidianos, respeto por la huella del tiempo y trabajo exclusivo con luz natural, sin alteraciones generativas.
              </p>
            </div>

            <div className="md:col-span-5 border border-white/[0.08] bg-[#0B0C0E]/70 p-6 space-y-4 print:border-neutral-300 print:bg-neutral-50">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880] print:text-neutral-700">
                02 · Ficha Técnica &amp; Soporte
              </h2>
              <ul className="space-y-2.5 text-xs font-light text-[#D4CEC3] print:text-neutral-800">
                <li>
                  <strong className="font-mono uppercase text-[#EBE7DF] print:text-neutral-900">Cuerpo:</strong>{" "}
                  Canon EOS R7 (32,5 MP APS-C)
                </li>
                <li>
                  <strong className="font-mono uppercase text-[#EBE7DF] print:text-neutral-900">Ópticas:</strong>{" "}
                  Sigma 150-600mm Contemporary · Canon RF-S 18-150mm · Fijos luminosos
                </li>
                <li>
                  <strong className="font-mono uppercase text-[#EBE7DF] print:text-neutral-900">Fine Art:</strong>{" "}
                  Hahnemühle Photo Rag® 308 g/m² (100% algodón, ISO 9706)
                </li>
                <li>
                  <strong className="font-mono uppercase text-[#EBE7DF] print:text-neutral-900">Tiradas:</strong>{" "}
                  Ediciones limitadas (10 a 50 ejemplares), numeradas y firmadas a mano
                </li>
              </ul>
            </div>
          </section>

          <AndalusianCenefa
            variant="estrella"
            className="my-10 text-[#C5A880]/36 print:opacity-40"
          />

          {/* Selección de Láminas del Dossier */}
          <section>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880] print:text-neutral-700">
              03 · Selección de Obra Representativa
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {plates.map((photo) => (
                <figure
                  key={photo.id}
                  className="overflow-hidden border border-white/[0.08] bg-[#0B0C0E] print:border-neutral-300 print:bg-white"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={photo.image}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="p-3">
                    <p className="truncate font-serif text-xs text-[#F7F4EE] print:text-neutral-900">
                      {photo.title}
                    </p>
                    <p className="truncate font-mono text-[9px] uppercase tracking-wider text-[#8E8A80] print:text-neutral-600">
                      {CATEGORY_METADATA[photo.category]?.title} · {photo.year}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Tarifas Orientativas Fine Art y Contacto */}
          <section className="mt-10 grid grid-cols-1 gap-6 border-t border-[#C5A880]/20 pt-8 sm:grid-cols-2 print:border-neutral-300">
            <div>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880] print:text-neutral-700">
                04 · Formatos de Colección Fine Art
              </h2>
              <ul className="mt-3 space-y-1.5 font-mono text-xs text-[#D4CEC3] print:text-neutral-800">
                <li>Estudio (30×45 / 30×40 cm · Ed. 12–30) — 95 a 175 €</li>
                <li>Galería (50×70 / 45×60 cm · Ed. 12–30) — 165 a 310 €</li>
                <li>Gran Colección (60×90 / 70×100 cm · Ed. 12–30) — 280 a 510 €</li>
              </ul>
            </div>

            <div>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880] print:text-neutral-700">
                05 · Representación y Contacto Directo
              </h2>
              <ul className="mt-3 space-y-1.5 font-mono text-xs text-[#D4CEC3] print:text-neutral-800">
                <li>Email: javierespinosa1995@hotmail.com</li>
                <li>Web: javier-photography.vercel.app</li>
                <li>Saatchi Art · Getty Images / iStock · @Javier.espinosa19</li>
              </ul>
            </div>
          </section>
        </article>
      </Container>
    </div>
  );
}
