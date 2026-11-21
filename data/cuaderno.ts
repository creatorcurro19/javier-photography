import { getPhotoBySlug } from "@/lib/photos";
import type { Photo } from "@/types/photo";
import { CUADERNO_POSTS, type CuadernoPost } from "@/data/site-config";

export { CUADERNO_POSTS, type CuadernoPost };

export function getAllCuadernoPosts(): (CuadernoPost & { relatedWork?: Photo })[] {
  return CUADERNO_POSTS.map((post) => ({
    ...post,
    relatedWork: getPhotoBySlug(post.relatedWorkSlug),
  }));
}

export function getCuadernoPostBySlug(
  slug: string
): (CuadernoPost & { relatedWork?: Photo }) | undefined {
  const post = CUADERNO_POSTS.find((p) => p.slug === slug);
  if (!post) return undefined;
  return {
    ...post,
    relatedWork: getPhotoBySlug(post.relatedWorkSlug),
  };
}
