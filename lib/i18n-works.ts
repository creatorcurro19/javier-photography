import type { Photo, Project } from "@/types/photo";
import { WORKS_EN, SERIES_EN } from "@/data/works-en";
import {
  translateCountry,
  translateDiscipline,
  translateLocation,
  translateMaxFormatReason,
  translatePaper,
  type SiteLang,
} from "@/lib/i18n-helpers";

export function getLocalizedPhoto(photo: Photo, lang: SiteLang): Photo {
  if (lang !== "en") return photo;
  const tr = WORKS_EN[photo.id];
  const seriesTr = photo.seriesSlug ? SERIES_EN[photo.seriesSlug] : undefined;

  return {
    ...photo,
    title: tr?.title ?? photo.title,
    alt: tr?.alt ?? photo.alt,
    description: tr?.description ?? photo.description,
    story: tr?.story ?? photo.story,
    location: translateLocation(photo.location, "en"),
    realLocation: translateLocation(photo.realLocation, "en"),
    country: translateCountry(photo.country, "en"),
    evento: translateLocation(photo.evento, "en"),
    lugar: translateLocation(photo.lugar, "en"),
    series: seriesTr?.title ?? photo.series,
    maxFormatReason: translateMaxFormatReason(photo.maxFormatReason, "en"),
    pricing: photo.pricing
      ? {
          ...photo.pricing,
          paper: translatePaper(photo.pricing.paper, "en"),
        }
      : undefined,
  };
}

export function getLocalizedProject(project: Project, lang: SiteLang): Project {
  if (lang !== "en") return project;
  const tr = SERIES_EN[project.id] ?? SERIES_EN[project.slug];
  if (!tr) {
    return {
      ...project,
      discipline: translateDiscipline(project.discipline, "en"),
      location: translateLocation(project.location, "en"),
    };
  }

  return {
    ...project,
    title: tr.title,
    subtitle: tr.subtitle,
    discipline: tr.discipline,
    location: tr.location,
    description: tr.description,
    statement: tr.statement,
  };
}
