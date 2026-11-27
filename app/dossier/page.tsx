import DossierPageContent from "@/components/dossier/DossierPageContent";
import { getFormatPriceRanges } from "@/data/formatos";
import { WORKS } from "@/data/works";
import { buildPageMetadata } from "@/lib/metadata";
import { getFeaturedPhotos } from "@/lib/photos";

export const metadata = buildPageMetadata({
  title: "Dossier de Autor y Prensa | Javier Espinosa",
  description:
    "Dossier editorial de Javier Espinosa Martínez: enfoque, colecciones, selección de obra Fine Art, equipo y contacto para prensa y galerías.",
  path: "/dossier",
});

export default function DossierPage() {
  const plates = getFeaturedPhotos().slice(0, 6);
  const priceRanges = getFormatPriceRanges(WORKS);

  return <DossierPageContent plates={plates} priceRanges={priceRanges} />;
}
