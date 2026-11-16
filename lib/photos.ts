import { photos } from "@/data/photos";
import { PROJECTS } from "@/data/projects";
import {
  PHOTO_CATEGORIES,
  type Photo,
  type PhotoCategory,
  type Project,
} from "@/types/photo";

export { PHOTO_CATEGORIES };

export function isPhotoCategory(value: string): value is PhotoCategory {
  return PHOTO_CATEGORIES.includes(value as PhotoCategory);
}

export function getAllPhotos(): Photo[] {
  return [...photos].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

export function getPhotoBySlug(slug: string): Photo | undefined {
  return photos.find((photo) => photo.slug === slug);
}

/** Localiza la ficha de una fotografía a partir de su ruta pública (útil para portadas). */
export function getPhotoByImage(image: string): Photo | undefined {
  return photos.find((photo) => photo.image === image);
}

export function getFeaturedPhotos(): Photo[] {
  return photos
    .filter((photo) => photo.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
}

export function getPhotosByCategory(category: PhotoCategory): Photo[] {
  return getAllPhotos().filter((photo) => photo.category === category);
}

export function getPhotosWithStory(): Photo[] {
  return getAllPhotos().filter((photo) => photo.story && photo.story.trim().length > 0);
}

export function getPrintablePhotos(): Photo[] {
  return getAllPhotos().filter((photo) => photo.prints);
}

export function getLicensedPhotos(): Photo[] {
  return getAllPhotos().filter((photo) => photo.licensing || photo.getty || photo.shutterstock);
}

export function getCategoriesWithCount(): { category: PhotoCategory; count: number }[] {
  return PHOTO_CATEGORIES.map((category) => ({
    category,
    count: getPhotosByCategory(category).length,
  })).filter((entry) => entry.count > 0);
}

export function getRelatedPhotos(photo: Photo, limit = 4): Photo[] {
  const scored = photos
    .filter((candidate) => candidate.id !== photo.id)
    .map((candidate) => {
      let score = 0;
      if (candidate.category === photo.category) score += 3;
      const sharedKeywords = candidate.keywords.filter((keyword) =>
        photo.keywords.includes(keyword),
      );
      score += sharedKeywords.length;
      if (photo.country && candidate.country === photo.country) score += 1;
      return { candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ candidate }) => candidate);
}

export function getAllPhotoSlugs(): string[] {
  return photos.map((photo) => photo.slug);
}

export function getAdjacentPhotos(photo: Photo): { prev?: Photo; next?: Photo } {
  const categoryPhotos = getPhotosByCategory(photo.category);
  const index = categoryPhotos.findIndex((p) => p.id === photo.id);
  if (index === -1) return {};
  const prev = index > 0 ? categoryPhotos[index - 1] : undefined;
  const next = index < categoryPhotos.length - 1 ? categoryPhotos[index + 1] : undefined;
  return { prev, next };
}

export function getAllProjects(): Project[] {
  return PROJECTS;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

export function getProjectPhotos(project: Project): Photo[] {
  return project.photoIds
    .map((id) => photos.find((p) => p.id === id))
    .filter((p): p is Photo => Boolean(p));
}
