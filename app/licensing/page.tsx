import LicensingPageContent from "@/components/licensing/LicensingPageContent";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { getLicensedPhotos } from "@/lib/photos";
import { generateBreadcrumbSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Licencias de Imagen Editorial | Javier Espinosa",
  description:
    "Cesión de derechos y licencias Rights-Managed en alta resolución (TIFF y JPEG) para editoriales, prensa, campañas e interiorismo.",
  path: "/licensing",
});

export default function LicensingPage() {
  const allLicensed = getLicensedPhotos();
  const licensed = allLicensed.filter((p) => p.prints || p.featured).slice(0, 18);

  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Licencias de Imagen", path: "/licensing" },
        ])}
      />
      <LicensingPageContent
        totalLicensedCount={allLicensed.length}
        featuredLicensed={licensed}
      />
    </>
  );
}
