import ProjectsPageContent from "@/components/projects/ProjectsPageContent";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { getAllProjects, getProjectPhotos } from "@/lib/photos";
import { generateBreadcrumbSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Series Fotográficas Documentales | Javier Espinosa",
  description:
    "Series fotográficas y ensayos documentales de Javier Espinosa: La Vera, paisaje volcánico de Canarias, rally histórico, Marrakech, Sahara y fauna.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getAllProjects().map((proj) => ({
    ...proj,
    resolvedPhotos: getProjectPhotos(proj),
  }));

  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Series Monográficas", path: "/projects" },
        ])}
      />
      <ProjectsPageContent projects={projects} />
    </>
  );
}
