import Container from "@/components/ui/Container";
import AboutInteractiveStudio from "@/components/about/AboutInteractiveStudio";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "El Autor & The Art of Seeing | Javier Espinosa",
  description:
    "Monografía y declaración artística de Javier Espinosa Martínez. Fotógrafo español especializado en fauna salvaje, rally, arquitectura y narrativa documental con sistema Canon EOS R7.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0B0C0E] pt-32 pb-28 text-[#EBE7DF]">
      <Container>
        <AboutInteractiveStudio />
      </Container>
    </div>
  );
}
