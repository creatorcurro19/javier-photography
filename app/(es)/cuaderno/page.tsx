import { CuadernoView, getCuadernoMetadata } from "@/lib/page-views";

export const metadata = getCuadernoMetadata("es");

export default function CuadernoPage() {
  return <CuadernoView lang="es" />;
}
