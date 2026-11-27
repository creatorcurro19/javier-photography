import { ProjectsView, getProjectsMetadata } from "@/lib/page-views";

export const metadata = getProjectsMetadata("en");

export default function EnProjectsPage() {
  return <ProjectsView lang="en" />;
}
