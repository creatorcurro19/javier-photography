import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import Container from "@/components/ui/Container";
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

  return (
    <div className="min-h-screen bg-[#101112] pt-36 pb-28 text-[#D8D5CD]">
      <Container>
        <header className="max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-[0.4em] text-[#95836B]">
            {info.code} · Disciplina
          </p>
          <h1 className="mt-4 font-serif text-5xl font-light md:text-6xl text-[#D8D5CD]">
            {info.title}
          </h1>
          <p className="mt-3 text-xs font-mono uppercase tracking-[0.2em] text-[#95836B]">
            {info.subtitle}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-[#D8D5CD]/80 font-light">
            {info.description}
          </p>
        </header>

        <div className="mt-12">
          <CategoryNav activeCategory={category} />
        </div>

        <div className="mt-16">
          <ExhibitionGallery photos={photos} />
        </div>
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

  return (
    <article className="min-h-screen bg-[#101112] pb-28 text-[#D8D5CD]">
      <JsonLd data={[generatePhotoSchema(photo), breadcrumb]} />
      <PhotoKeyboardNav prevSlug={prev?.slug} nextSlug={next?.slug} />
      
      {/* Breadcrumb Bar */}
      <div className="pt-24 border-b border-[#1D2021] bg-[#101112]/60">
        <Container className="py-4">
          <nav aria-label="Miga de pan" className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Link href="/" className="hover:text-[#D8D5CD] transition">Inicio</Link>
            <span className="text-[#95836B]">/</span>
            <Link href="/portfolio" className="hover:text-[#D8D5CD] transition">Portfolio</Link>
            <span className="text-[#95836B]">/</span>
            <Link href={`/portfolio/${photo.category}`} className="hover:text-[#D8D5CD] transition">
              {categoryInfo?.title ?? photo.category}
            </Link>
            <span className="text-[#95836B]">/</span>
            <span className="text-[#D8D5CD] truncate">{photo.title}</span>
          </nav>
        </Container>
      </div>

      <div className="pt-6">
        <PhotoHero photo={photo} categoryPhotos={getPhotosByCategory(photo.category)} />
      </div>

      <Container className="mt-16 space-y-16">
        <PhotoMeta photo={photo} />
        <div className="grid gap-12 border-t border-[#1D2021] pt-12 lg:grid-cols-2">
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

        {/* Adjacent Photo Navigation */}
        <nav aria-label="Navegación entre obras de la misma colección" className="border-t border-[#1D2021] pt-10">
          <div className="flex items-center justify-between gap-4 text-xs font-mono uppercase tracking-[0.2em]">
            {prev ? (
              <Link
                href={`/portfolio/${prev.slug}`}
                className="group flex flex-col items-start gap-1 text-neutral-400 hover:text-[#D8D5CD] transition"
              >
                <span className="text-[10px] text-[#95836B] group-hover:text-[#D8D5CD]">← Anterior</span>
                <span className="font-serif text-base normal-case tracking-normal text-[#D8D5CD] group-hover:text-white truncate max-w-[180px] sm:max-w-xs">{prev.title}</span>
              </Link>
            ) : <div />}

            <Link
              href={`/portfolio/${photo.category}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-neutral-400 hover:text-[#D8D5CD] transition text-xs font-mono"
            >
              <span>Colección {categoryInfo?.title} ({totalInCat})</span>
            </Link>

            {next ? (
              <Link
                href={`/portfolio/${next.slug}`}
                className="group flex flex-col items-end gap-1 text-neutral-400 hover:text-[#D8D5CD] transition text-right"
              >
                <span className="text-[10px] text-[#95836B] group-hover:text-[#D8D5CD]">Siguiente →</span>
                <span className="font-serif text-base normal-case tracking-normal text-[#D8D5CD] group-hover:text-white truncate max-w-[180px] sm:max-w-xs">{next.title}</span>
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
