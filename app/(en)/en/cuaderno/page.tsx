import { CuadernoView, getCuadernoMetadata } from "@/lib/page-views";

export const metadata = getCuadernoMetadata("en");

export default function EnCuadernoPage() {
  return <CuadernoView lang="en" />;
}
