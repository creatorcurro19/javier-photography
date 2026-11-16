import Container from "@/components/ui/Container";
import AboutInteractiveStudio from "@/components/about/AboutInteractiveStudio";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Sobre el Autor | Javier Espinosa",
  description:
    "Monografía y declaración artística de Javier Espinosa Martínez. Fotógrafo español especializado en fauna salvaje, rally, arquitectura y narrativa documental con sistema Canon EOS R7.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#101112] pt-32 pb-28 text-[#D8D5CD]">
      <Container>
        <AboutInteractiveStudio />
      </Container>
    </div>
  );
}
