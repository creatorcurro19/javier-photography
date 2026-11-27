import ContactPageContent from "@/components/contact/ContactPageContent";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Contacto y Consultas | Javier Espinosa",
  description:
    "Contacta con Javier Espinosa en Tenerife para solicitar una copia Fine Art, pedir presupuesto para un reportaje o resolver cualquier duda.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageContent />;
}
