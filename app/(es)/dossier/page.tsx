import { DossierView, getDossierMetadata } from "@/lib/page-views";

export const metadata = getDossierMetadata("es");

export default function DossierPage() {
  return <DossierView />;
}
