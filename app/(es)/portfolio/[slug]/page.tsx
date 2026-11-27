import type { Metadata } from "next";
import {
  PortfolioSlugView,
  getPortfolioSlugMetadata,
} from "@/lib/page-views";
import { getAllPhotoSlugs, PHOTO_CATEGORIES } from "@/lib/photos";

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
  return getPortfolioSlugMetadata(slug, "es");
}

export default async function PortfolioSlugPage({ params }: PageProps) {
  const { slug } = await params;
  return <PortfolioSlugView slug={slug} lang="es" />;
}
