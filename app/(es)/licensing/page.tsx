import { LicensingView, getLicensingMetadata } from "@/lib/page-views";

export const metadata = getLicensingMetadata("es");

export default function LicensingPage() {
  return <LicensingView lang="es" />;
}
