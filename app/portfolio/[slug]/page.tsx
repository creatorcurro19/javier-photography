import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import Container from "@/components/ui/Container";
import {
  AndalusianCollectionBackdrop,
  AndalusianCenefa,
  AndalusianDivider,
} from "@/components/ui/AndalusianMotif";
import CategoryNav from "@/components/portfolio/CategoryNav";
import ExhibitionGallery from "@/components/portfolio/ExhibitionGallery";
import AwardsList from "@/components/photo/AwardsList";
import EquipmentPanel from "@/components/photo/EquipmentPanel";
import ExifPanel from "@/components/photo/ExifPanel";
import LicensingLinks from "@/components/photo/LicensingLinks";
import LocationMap from "@/components/photo/LocationMap";
import PhotoHero from "@/components/photo/PhotoHero";
import PhotoKeyboardNav from "@/components/photo/PhotoKeyboardNav";
import PhotoMeta from "@/components/photo/PhotoMeta";
import MobilePhotoActionBar from "@/components/photo/MobilePhotoActionBar";
import PrintCTA from "@/components/photo/PrintCTA";
import RelatedPhotos from "@/components/photo/RelatedPhotos";
import StorySection from "@/components/photo/StorySection";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata, buildPhotoMetadata } from "@/lib/metadata";
import {
  getAllPhotoSlugs,
  getAdjacentPhotos,
  getPhotoBySlug,
  getPhotosByCategory,
  getProjectsByCategory,
  isPhotoCategory,
  PHOTO_CATEGORIES,
} from "@/lib/photos";
import {
  generateBreadcrumbSchema,
  generateCategoryCollectionSchema,
  generatePhotoSchema,
} from "@/lib/schema";
import { CATEGORY_METADATA, type PhotoCategory } from "@/types/photo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return [
    ...PHOTO_CATEGORIES.map((category) => ({ slug: category })),
    ...getAllPhotoSlugs().map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (isPhotoCategory(slug)) {
    const meta = CATEGORY_METADATA[slug];
    return buildPageMetadata({
      title: meta.seoTitle,
      description: meta.seoDescription,
      path: `/portfolio/${slug}`,
      image: meta.coverImage,
      keywords: meta.seoKeywords,
    });
  }

  const photo = getPhotoBySlug(slug);
  if (!photo) {
    return {};
  }

  return buildPhotoMetadata(photo);
}

function CategoryGallery({ category }: { category: PhotoCategory }) {
  const photos = getPhotosByCategory(category);
  const relatedProjects = getProjectsByCategory(category);
  const info = CATEGORY_METADATA[category];
  const isSebka =
    category === "arquitectura-urbana" || category === "viajes-cultura";

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Inicio", path: "/" },
    { name: "Obra", path: "/portfolio" },
    { name: info.title, path: `/portfolio/${category}` },
  ]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pb-28 text-[#EBE7DF]">
      <JsonLd data={[generateCategoryCollectionSchema(category, photos), breadcrumb]} />
      <div className="hidden">
        <AndalusianCollectionBackdrop variant={isSebka ? "sebka" : "laceria"} />
      </div>

      {/* Breadcrumb Bar */}
      <div className="relative z-10 pt-20 border-b border-white/[0.08] bg-[#0B0C0E]/80 backdrop-blur-md">
        <Container className="py-3.5">
          <nav aria-label="Miga de pan" className="flex items-center gap-2 text-xs font-mono text-[#A39E93]">
            <Link href="/" className="hover:text-[#EBE7DF] transition">Inicio</Link>
            <span className="text-white/25">/</span>
            <Link href="/portfolio" className="hover:text-[#EBE7DF] transition">Fotos</Link>
            <span className="text-white/25">/</span>
            <span className="text-[#EBE7DF] truncate">{info.title}</span>
          </nav>
        </Container>
      </div>

      <Container className="relative z-10 mt-10">
        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
            {photos.length} fotos
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-light text-[#EBE7DF]">
            {info.title}
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#A39E93] font-light">
            {info.description}
          </p>
          <p className="hidden mt-3 text-sm leading-relaxed text-[#8E8A80] font-light italic font-serif">
            {info.descriptionEn}
          </p>
        </header>

        <div className="hidden">
          <AndalusianCenefa
            variant={isSebka ? "sebka" : "estrella"}
            className="mt-10 text-[#C5A880]/32"
          />
        </div>

        <div className="mt-6">
          <CategoryNav activeCategory={category} />
        </div>

        <div className="mt-8">
          <ExhibitionGallery photos={photos} />
        </div>

        {/* Conexión Semántica con Series Monográficas y Servicios (oculta en versión minimalista) */}
        <section
          aria-label={`Ensayos monográficos y adquisiciones de ${info.title}`}
          className="hidden mt-20 grid-cols-1 gap-6 border-t border-[#C5A880]/20 pt-14 lg:grid-cols-12"
        >
          <div className="lg:col-span-7 border border-white/[0.08] bg-[#151618] p-7 sm:p-9">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#C5A880]">
              Ensayos Narrativos · Monograph Series
            </p>
            <h2 className="mt-2 font-serif text-2xl font-light text-[#EBE7DF]">
              Series monográficas de {info.title}
            </h2>
            <p className="mt-2 text-xs font-light leading-relaxed text-[#8E8A80]">
              Profundiza en el contexto documental, las notas de cuaderno de campo y la secuencia curatorial completa de cada proyecto asociado a esta disciplina.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {relatedProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="border border-white/15 bg-[#0B0C0E] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#EBE7DF] transition hover:border-[#C5A880] hover:text-white"
                >
                  {project.title} →
                </Link>
              ))}
              <Link
                href="/projects"
                className="border border-white/[0.08] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8E8A80] transition hover:text-[#EBE7DF]"
              >
                Ver las 8 Series
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 border border-white/[0.08] bg-[#151618] p-7 sm:p-9 flex flex-col justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#C5A880]">
                {category === "coches-rally"
                  ? "Cobertura, Equipos y Prensa · Motorsport"
                  : "Adquisición & Licencias · Fine Art & Licensing"}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-light text-[#EBE7DF]">
                {category === "coches-rally"
                  ? "Servicio para Pilotos, Escuderías y Prensa"
                  : "Copias Hahnemühle 308g y Encargos"}
              </h2>
              <p className="mt-2 text-xs font-light leading-relaxed text-[#8E8A80]">
                {category === "coches-rally"
                  ? "Las imágenes de rally se destinan a cobertura de prensa, medios especializados y cesión directa para pilotos, patrocinadores y equipos de competición."
                  : `Todas las obras de ${info.title} están disponibles bajo pedido como edición limitada en papel 100% algodón (ISO 9706) o licencia editorial de alta resolución (32,5 MP).`}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {category === "coches-rally" ? (
                <Link
                  href="/servicios/fotografo-rally-motorsport"
                  className="border border-[#EBE7DF] bg-[#EBE7DF] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] font-medium text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
                >
                  Dossier Rally y Encargos →
                </Link>
              ) : (
                <Link
                  href="/prints"
                  className="border border-[#EBE7DF] bg-[#EBE7DF] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] font-medium text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
                >
                  Catálogo Fine Art →
                </Link>
              )}
              <Link
                href={`/contact?motivo=${category === "coches-rally" ? "rally" : "consulta"}`}
                className="border border-white/15 bg-[#0B0C0E] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-[#EBE7DF] transition hover:border-[#C5A880]"
              >
                {category === "coches-rally" ? "Solicitar Cobertura" : "Encargos"}
              </Link>
            </div>
          </div>
        </section>

        <AndalusianCenefa
          variant={isSebka ? "sebka" : "estrella"}
          className="mt-16 text-[#C5A880]/28"
        />
      </Container>
    </div>
  );
}

function PhotoDetail({ slug }: { slug: string }) {
  const photo = getPhotoBySlug(slug);
  if (!photo) {
    notFound();
  }

  const categoryInfo = CATEGORY_METADATA[photo.category];
  const { prev, next } = getAdjacentPhotos(photo);
  const totalInCat = getPhotosByCategory(photo.category).length;

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Inicio", path: "/" },
    { name: "Obra", path: "/portfolio" },
    {
      name: categoryInfo?.title ?? photo.category,
      path: `/portfolio/${photo.category}`,
    },
    { name: photo.title, path: `/portfolio/${photo.slug}` },
  ]);

  const isSebka =
    photo.category === "arquitectura-urbana" || photo.category === "viajes-cultura";

  return (
    <article className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pb-36 lg:pb-28 text-[#EBE7DF]">
      <div className="hidden">
        <AndalusianCollectionBackdrop variant={isSebka ? "sebka" : "laceria"} />
      </div>
      <JsonLd data={[generatePhotoSchema(photo), breadcrumb]} />
      <PhotoKeyboardNav prevSlug={prev?.slug} nextSlug={next?.slug} />
      <MobilePhotoActionBar photo={photo} />
      
      {/* Breadcrumb Bar */}
      <div className="relative z-10 pt-20 border-b border-white/[0.08] bg-[#0B0C0E]/80 backdrop-blur-md">
        <Container className="py-3.5">
          <nav aria-label="Miga de pan" className="flex items-center gap-2 text-xs font-mono text-[#A39E93]">
            <Link href="/" className="hover:text-[#EBE7DF] transition">Inicio</Link>
            <span className="text-white/25">/</span>
            <Link href="/portfolio" className="hover:text-[#EBE7DF] transition">Fotos</Link>
            <span className="text-white/25">/</span>
            <Link href={`/portfolio/${photo.category}`} className="hover:text-[#EBE7DF] transition">
              {categoryInfo?.title ?? photo.category}
            </Link>
            <span className="text-white/25">/</span>
            <span className="text-[#EBE7DF] truncate">{photo.title}</span>
          </nav>
        </Container>
      </div>

      <div className="relative z-10 pt-4">
        <PhotoHero photo={photo} categoryPhotos={getPhotosByCategory(photo.category)} />
      </div>

      <Container className="relative z-10 mt-10 space-y-12">
        <PhotoMeta photo={photo} />

        <div>
          <PrintCTA photo={photo} />
        </div>

        {/* Paneles técnicos avanzados ocultos en versión minimalista (sin eliminar nada) */}
        <div className="hidden">
          <AndalusianCenefa
            variant={isSebka ? "sebka" : "estrella"}
            className="text-[#C5A880]/36"
          />
          <div className="grid gap-12 border-t border-[#C5A880]/15 pt-12 lg:grid-cols-2">
            <ExifPanel photo={photo} />
            <EquipmentPanel photo={photo} />
          </div>
          <StorySection photo={photo} />
          <AwardsList photo={photo} />
          <LocationMap photo={photo} />
          <LicensingLinks photo={photo} />
          <AndalusianDivider />
        </div>

        {/* Adjacent Photo Navigation */}
        <nav aria-label="Navegación entre obras de la misma colección" className="pt-2">
          <div className="flex items-center justify-between gap-4 text-xs font-mono uppercase tracking-[0.2em]">
            {prev ? (
              <Link
                href={`/portfolio/${prev.slug}`}
                className="group flex flex-col items-start gap-1 text-[#8E8A80] hover:text-[#EBE7DF] transition"
              >
                <span className="text-[10px] text-[#8E8A80] group-hover:text-[#EBE7DF]">← Anterior</span>
                <span className="font-serif text-base normal-case tracking-normal text-[#EBE7DF] group-hover:text-white truncate max-w-[180px] sm:max-w-xs">{prev.title}</span>
              </Link>
            ) : <div />}

            <Link
              href={`/portfolio/${photo.category}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-[#8E8A80] hover:text-[#EBE7DF] transition text-xs font-mono"
            >
              <span>Colección {categoryInfo?.title} ({totalInCat})</span>
            </Link>

            {next ? (
              <Link
                href={`/portfolio/${next.slug}`}
                className="group flex flex-col items-end gap-1 text-[#8E8A80] hover:text-[#EBE7DF] transition text-right"
              >
                <span className="text-[10px] text-[#8E8A80] group-hover:text-[#EBE7DF]">Siguiente →</span>
                <span className="font-serif text-base normal-case tracking-normal text-[#EBE7DF] group-hover:text-white truncate max-w-[180px] sm:max-w-xs">{next.title}</span>
              </Link>
            ) : <div />}
          </div>
        </nav>

        <RelatedPhotos photo={photo} />
      </Container>
    </article>
  );
}

export default async function PortfolioSlugPage({ params }: PageProps) {
  const { slug } = await params;

  if (isPhotoCategory(slug)) {
    return <CategoryGallery category={slug} />;
  }

  return <PhotoDetail slug={slug} />;
}
