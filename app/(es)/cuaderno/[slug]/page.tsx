import type { Metadata } from "next";
import { getAllCuadernoPosts } from "@/data/cuaderno";
import {
  CuadernoPostView,
  getCuadernoPostMetadata,
} from "@/lib/page-views";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllCuadernoPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getCuadernoPostMetadata(slug, "es");
}

export default async function CuadernoPostPage({ params }: PageProps) {
  const { slug } = await params;
  return <CuadernoPostView slug={slug} lang="es" />;
}
