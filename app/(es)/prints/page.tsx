import { PrintsView, getPrintsMetadata } from "@/lib/page-views";

export const metadata = getPrintsMetadata("es");

export default function PrintsPage() {
  return <PrintsView lang="es" />;
}
