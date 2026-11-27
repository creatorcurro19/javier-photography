import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailContent from "@/components/projects/ProjectDetailContent";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { getAllProjects, getProjectBySlug, getProjectPhotos } from "@/lib/photos";
import { generateBreadcrumbSchema, generateProjectSchema } from "@/lib/schema";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return buildPageMetadata({
    title: `${project.title} | Javier Espinosa`,
    description: project.description,
    path: `/projects/${project.slug}`,
    image: project.coverImage,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectPhotos = getProjectPhotos(project);
  const allProjects = getAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : undefined;
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : undefined;

  return (
    <>
      <JsonLd data={generateProjectSchema(project, projectPhotos)} />
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Series", path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` },
        ])}
      />
      <ProjectDetailContent
        rawProject={project}
        projectPhotos={projectPhotos}
        prevProject={prevProject}
        nextProject={nextProject}
        totalProjects={allProjects.length}
      />
    </>
  );
}
