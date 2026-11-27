import { LicensingView, getLicensingMetadata } from "@/lib/page-views";

export const metadata = getLicensingMetadata("en");

export default function EnLicensingPage() {
  return <LicensingView lang="en" />;
}
