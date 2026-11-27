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
    ? `${photo.location}${photo.country && !photo.location.includes(photo.country) ? `, ${photo.country}` : ""}`
    : `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;

  const query = encodeURIComponent(placeName);
  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&z=10&output=embed`;

  return (
    <section aria-labelledby="map-heading" className="border-t border-[#202226] pt-12">
      <span className="text-xs font-mono uppercase tracking-[0.35em] text-[#8E8A80]">
        Territorio
      </span>
      <h2
        id="map-heading"
        className="mt-2 font-serif text-3xl font-light text-[#EBE7DF]"
      >
        Localización
      </h2>
      <p className="mt-4 text-sm text-[#EBE7DF]/70 font-light">
        {placeName}
      </p>
      <div className="mt-6 aspect-[21/9] w-full overflow-hidden rounded-lg border border-[#202226] bg-[#202226]">
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
