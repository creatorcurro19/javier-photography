import LegalPageContent from "@/components/legal/LegalPageContent";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Aviso Legal y Privacidad | Javier Espinosa",
  description:
    "Información legal, política de privacidad RGPD y protección de derechos de autor sobre el archivo fotográfico de Javier Espinosa Martínez.",
  path: "/legal",
});

export default function LegalPage() {
  return <LegalPageContent />;
}
