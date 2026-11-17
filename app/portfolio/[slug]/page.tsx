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
  isPhotoCategory,
  PHOTO_CATEGORIES,
} from "@/lib/photos";
import { generateBreadcrumbSchema, generatePhotoSchema } from "@/lib/schema";
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
      title: `${meta.title} | Javier Espinosa`,
      description: meta.description,
      path: `/portfolio/${slug}`,
      image: meta.coverImage,
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
  const info = CATEGORY_METADATA[category];
  const isSebka =
    category === "arquitectura-urbana" || category === "viajes-cultura";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      {/* Filigrana andalusí y cenefas laterales discretas en el fondo de la colección */}
      <AndalusianCollectionBackdrop variant={isSebka ? "sebka" : "laceria"} />

      <Container className="relative z-10">
        <header className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-white/30" />
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#8E8A80]">
              {info.code} · Disciplina de Autor
            </p>
          </div>
          <h1 className="mt-4 font-serif text-5xl font-light md:text-6xl text-[#EBE7DF]">
            {info.title}
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-[#8E8A80]">
            {info.subtitle}
          </p>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#8E8A80] font-light">
            {info.description}
          </p>
        </header>

        <AndalusianCenefa
          variant={isSebka ? "sebka" : "estrella"}
          className="mt-10 text-[#C5A880]/32"
        />

        <div className="mt-8">
          <CategoryNav activeCategory={category} />
        </div>

        <div className="mt-16">
          <ExhibitionGallery photos={photos} />
        </div>

        <AndalusianCenefa
          variant={isSebka ? "sebka" : "estrella"}
          className="mt-20 text-[#C5A880]/28"
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
    { name: "Portfolio", path: "/portfolio" },
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
      <AndalusianCollectionBackdrop variant={isSebka ? "sebka" : "laceria"} />
      <JsonLd data={[generatePhotoSchema(photo), breadcrumb]} />
      <PhotoKeyboardNav prevSlug={prev?.slug} nextSlug={next?.slug} />
      <MobilePhotoActionBar photo={photo} />
      
      {/* Breadcrumb Bar */}
      <div className="relative z-10 pt-24 border-b border-[#C5A880]/15 bg-[#0B0C0E]/80 backdrop-blur-md">
        <Container className="py-4">
          <nav aria-label="Miga de pan" className="flex items-center gap-2 text-xs font-mono text-[#8E8A80]">
            <Link href="/" className="hover:text-[#EBE7DF] transition">Inicio</Link>
            <span className="text-white/20">/</span>
            <Link href="/portfolio" className="hover:text-[#EBE7DF] transition">Colecciones</Link>
            <span className="text-white/20">/</span>
            <Link href={`/portfolio/${photo.category}`} className="hover:text-[#EBE7DF] transition">
              {categoryInfo?.title ?? photo.category}
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-[#EBE7DF] truncate">{photo.title}</span>
          </nav>
        </Container>
      </div>

      <div className="relative z-10 pt-6">
        <PhotoHero photo={photo} categoryPhotos={getPhotosByCategory(photo.category)} />
      </div>

      <Container className="relative z-10 mt-14 space-y-16">
        <AndalusianCenefa
          variant={isSebka ? "sebka" : "estrella"}
          className="text-[#C5A880]/36"
        />
        <PhotoMeta photo={photo} />
        <div className="grid gap-12 border-t border-[#C5A880]/15 pt-12 lg:grid-cols-2">
          <ExifPanel photo={photo} />
          <EquipmentPanel photo={photo} />
        </div>
        <StorySection photo={photo} />
        <AwardsList photo={photo} />
        <LocationMap photo={photo} />
        <div className="grid gap-12 lg:grid-cols-2">
          <LicensingLinks photo={photo} />
          <PrintCTA photo={photo} />
        </div>

        <AndalusianDivider />

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
