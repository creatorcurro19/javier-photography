import { DossierView, getDossierMetadata } from "@/lib/page-views";

export const metadata = getDossierMetadata("en");

export default function EnDossierPage() {
  return <DossierView />;
}
