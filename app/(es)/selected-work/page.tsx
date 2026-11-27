import { SelectedWorkView, getSelectedWorkMetadata } from "@/lib/page-views";

export const metadata = getSelectedWorkMetadata("es");

export default function SelectedWorkPage() {
  return <SelectedWorkView lang="es" />;
}
