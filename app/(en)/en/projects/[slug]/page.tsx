import type { Metadata } from "next";
import {
  ProjectDetailView,
  getProjectDetailMetadata,
} from "@/lib/page-views";
import { getAllProjects } from "@/lib/photos";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getProjectDetailMetadata(slug, "en");
}

export default async function EnProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <ProjectDetailView slug={slug} lang="en" />;
}
