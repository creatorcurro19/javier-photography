import type { Photo } from "@/types/photo";

type LocationMapProps = {
  photo: Photo;
};

export default function LocationMap({ photo }: LocationMapProps) {
  if (!photo.coordinates) {
    return null;
  }

  const { lat, lng } = photo.coordinates;
  const placeName = photo.location
    ? `${photo.location}${photo.country ? `, ${photo.country}` : ""}`
    : `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;

  const query = encodeURIComponent(placeName);
  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&z=10&output=embed`;

  return (
    <section aria-labelledby="map-heading" className="border-t border-neutral-900 pt-12">
      <span className="text-xs font-mono uppercase tracking-[0.35em] text-neutral-500">
        Territorio
      </span>
      <h2
        id="map-heading"
        className="mt-2 font-serif text-3xl font-light text-neutral-100"
      >
        Localización
      </h2>
      <p className="mt-4 text-sm text-neutral-400">
        {placeName}
      </p>
      <div className="mt-6 aspect-[21/9] w-full overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
        <iframe
          title={`Mapa de localización de ${photo.title} en ${query}`}
          src={embedUrl}
          className="h-full w-full border-0 opacity-80 contrast-125 grayscale invert hover:opacity-100 transition-opacity"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
