import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CuadernoPostContent from "@/components/stories/CuadernoPostContent";
import JsonLd from "@/components/seo/JsonLd";
import { getAllCuadernoPosts, getCuadernoPostBySlug } from "@/data/cuaderno";
import { buildPageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllCuadernoPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getCuadernoPostBySlug(slug);
  if (!post) return {};

  return buildPageMetadata({
    title: `Cuaderno #${post.number} | Javier Espinosa`,
    description: post.subtitle,
    path: `/cuaderno/${post.slug}`,
    image: post.relatedWork?.image,
  });
}

export default async function CuadernoPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getCuadernoPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Inicio", path: "/" },
    { name: "Cuaderno", path: "/cuaderno" },
    { name: `Borrador ${post.number}`, path: `/cuaderno/${post.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <CuadernoPostContent rawPost={post} />
    </>
  );
}
