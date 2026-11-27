import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CategoryGalleryContent from "@/components/portfolio/CategoryGalleryContent";
import PhotoDetailContent from "@/components/portfolio/PhotoDetailContent";
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

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Inicio", path: "/" },
    { name: "Obra", path: "/portfolio" },
    { name: info.title, path: `/portfolio/${category}` },
  ]);

  return (
    <>
      <JsonLd data={[generateCategoryCollectionSchema(category, photos), breadcrumb]} />
      <CategoryGalleryContent category={category} photos={photos} />
    </>
  );
}

function PhotoDetail({ slug }: { slug: string }) {
  const photo = getPhotoBySlug(slug);
  if (!photo) {
    notFound();
  }

  const categoryInfo = CATEGORY_METADATA[photo.category];
  const categoryPhotos = getPhotosByCategory(photo.category);
  const { prev, next } = getAdjacentPhotos(photo);
  const totalInCat = categoryPhotos.length;

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Inicio", path: "/" },
    { name: "Obra", path: "/portfolio" },
    {
      name: categoryInfo?.title ?? photo.category,
      path: `/portfolio/${photo.category}`,
    },
    { name: photo.title, path: `/portfolio/${photo.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[generatePhotoSchema(photo), breadcrumb]} />
      <PhotoDetailContent
        rawPhoto={photo}
        categoryPhotos={categoryPhotos}
        prev={prev}
        next={next}
        totalInCat={totalInCat}
      />
    </>
  );
}

export default async function PortfolioSlugPage({ params }: PageProps) {
  const { slug } = await params;

  if (isPhotoCategory(slug)) {
    return <CategoryGallery category={slug} />;
  }

  return <PhotoDetail slug={slug} />;
}
