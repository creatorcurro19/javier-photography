import StoriesPageContent from "@/components/stories/StoriesPageContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getAllPhotos, getPhotosWithStory } from "@/lib/photos";

export const metadata = buildPageMetadata({
  title: "Cuaderno de Campo y Relatos | Javier Espinosa",
  description:
    "Notas de campo, contexto técnico y relatos detrás de cada fotografía: fauna, paisaje, tramos de rally y cultura local por Javier Espinosa.",
  path: "/stories",
});

export default function StoriesPage() {
  const stories = getPhotosWithStory();
  const totalWorksCount = getAllPhotos().length;

  return (
    <StoriesPageContent stories={stories} totalWorksCount={totalWorksCount} />
  );
}
