import { ProjectsView, getProjectsMetadata } from "@/lib/page-views";

export const metadata = getProjectsMetadata("es");

export default function ProjectsPage() {
  return <ProjectsView lang="es" />;
}
