import { useId } from "react";

interface AndalusianStarMarkProps {
  className?: string;
}

/**
 * Estrella andalusí de 8 puntas (emblema minimalista para cabecera, títulos y firma).
 */
export function AndalusianStarMark({
  className = "h-3.5 w-3.5 text-[#C5A880]/70",
}: AndalusianStarMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <rect x="6" y="6" width="12" height="12" />
      <rect
        x="6"
        y="6"
        width="12"
        height="12"
        transform="rotate(45 12 12)"
      />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Micro-cenefa arquitectónica de 7px para bordes sutiles (Navbar, modales, cesta).
 */
export function AndalusianMicroCenefa({
  className = "text-[#C5A880]/30",
}: {
  className?: string;
}) {
  const rawId = useId();
  const patId = `andalusian-micro-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none h-[7px] w-full select-none overflow-hidden ${className}`}
    >
      <svg className="h-[7px] w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patId}
            width="24"
            height="7"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0.75"
              x2="24"
              y2="0.75"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeOpacity="0.65"
            />
            <path
              d="M 0,3.5 L 6,1.2 L 12,3.5 L 6,5.8 Z M 12,3.5 L 18,1.2 L 24,3.5 L 18,5.8 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeOpacity="0.85"
            />
            <circle cx="12" cy="3.5" r="0.8" fill="currentColor" />
            <circle cx="0" cy="3.5" r="0.8" fill="currentColor" />
            <circle cx="24" cy="3.5" r="0.8" fill="currentColor" />
            <line
              x1="0"
              y1="6.25"
              x2="24"
              y2="6.25"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeOpacity="0.65"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patId})`} />
      </svg>
    </div>
  );
}

interface AndalusianCenefaProps {
  className?: string;
  /** Suaviza los extremos izquierdo y derecho con un degradado */
  fadeEdges?: boolean;
  /** Variante del motivo geométrico de la cenefa */
  variant?: "estrella" | "sebka";
}

/**
 * Cenefa horizontal de inspiración andalusí (lacería de ocho puntas y sebka).
 */
export function AndalusianCenefa({
  className = "text-[#C5A880]/40",
  fadeEdges = true,
  variant = "estrella",
}: AndalusianCenefaProps) {
  const rawId = useId();
  const patId = `andalusian-cenefa-${variant}-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none w-full select-none overflow-hidden ${className}`}
      style={
        fadeEdges
          ? {
              maskImage:
                "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            }
          : undefined
      }
    >
      {variant === "estrella" ? (
        <svg
          className="h-6 w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id={patId}
              width="56"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="1.5"
                x2="56"
                y2="1.5"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeOpacity="0.9"
              />
              <line
                x1="0"
                y1="4"
                x2="56"
                y2="4"
                stroke="currentColor"
                strokeWidth="0.45"
                strokeDasharray="1.5 2.5"
                strokeOpacity="0.65"
              />
              <line
                x1="0"
                y1="20"
                x2="56"
                y2="20"
                stroke="currentColor"
                strokeWidth="0.45"
                strokeDasharray="1.5 2.5"
                strokeOpacity="0.65"
              />
              <line
                x1="0"
                y1="22.5"
                x2="56"
                y2="22.5"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeOpacity="0.9"
              />

              <path
                d="M 0,12 L 14,4 L 28,12 L 14,20 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeOpacity="0.8"
              />
              <path
                d="M 28,12 L 42,4 L 56,12 L 42,20 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeOpacity="0.8"
              />
              <path
                d="M 0,4 L 14,12 L 0,20 M 56,4 L 42,12 L 56,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
                strokeOpacity="0.55"
              />

              <g stroke="currentColor" fill="none" strokeWidth="0.75">
                <rect x="24.5" y="8.5" width="7" height="7" />
                <rect
                  x="24.5"
                  y="8.5"
                  width="7"
                  height="7"
                  transform="rotate(45 28 12)"
                />
                <rect x="-3.5" y="8.5" width="7" height="7" />
                <rect
                  x="-3.5"
                  y="8.5"
                  width="7"
                  height="7"
                  transform="rotate(45 0 12)"
                />
                <rect x="52.5" y="8.5" width="7" height="7" />
                <rect
                  x="52.5"
                  y="8.5"
                  width="7"
                  height="7"
                  transform="rotate(45 56 12)"
                />
              </g>

              <circle cx="28" cy="12" r="1" fill="currentColor" fillOpacity="0.9" />
              <circle cx="14" cy="12" r="0.8" fill="currentColor" fillOpacity="0.6" />
              <circle cx="42" cy="12" r="0.8" fill="currentColor" fillOpacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patId})`} />
        </svg>
      ) : (
        <svg
          className="h-6 w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id={patId}
              width="44"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="1.5"
                x2="44"
                y2="1.5"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeOpacity="0.85"
              />
              <line
                x1="0"
                y1="22.5"
                x2="44"
                y2="22.5"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeOpacity="0.85"
              />
              <path
                d="M 0,20 Q 11,4 22,20 Q 33,4 44,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeOpacity="0.85"
              />
              <path
                d="M -11,20 Q 0,4 11,20 Q 22,4 33,20 Q 44,4 55,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
                strokeOpacity="0.55"
              />
              <path
                d="M 0,4 Q 11,20 22,4 Q 33,20 44,4"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
                strokeOpacity="0.5"
              />
              <circle cx="11" cy="12" r="1" fill="currentColor" fillOpacity="0.85" />
              <circle cx="33" cy="12" r="1" fill="currentColor" fillOpacity="0.85" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patId})`} />
        </svg>
      )}
    </div>
  );
}

/**
 * Cenefa vertical (inspirada en el alfiz nazarí y mudéjar)
 * para enmarcar los márgenes laterales de cada página.
 */
export function AndalusianVerticalCenefa({
  className = "text-[#C5A880]/28",
}: {
  className?: string;
}) {
  const rawId = useId();
  const patId = `andalusian-vcenefa-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none h-full w-6 select-none overflow-hidden ${className}`}
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
      }}
    >
      <svg className="h-full w-6" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patId}
            width="24"
            height="56"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="1.5"
              y1="0"
              x2="1.5"
              y2="56"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeOpacity="0.85"
            />
            <line
              x1="22.5"
              y1="0"
              x2="22.5"
              y2="56"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeOpacity="0.85"
            />
            <path
              d="M 12,0 L 20,14 L 12,28 L 4,14 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.7"
              strokeOpacity="0.75"
            />
            <path
              d="M 12,28 L 20,42 L 12,56 L 4,42 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.7"
              strokeOpacity="0.75"
            />
            <g stroke="currentColor" fill="none" strokeWidth="0.7">
              <rect x="8.5" y="24.5" width="7" height="7" />
              <rect
                x="8.5"
                y="24.5"
                width="7"
                height="7"
                transform="rotate(45 12 28)"
              />
            </g>
            <circle cx="12" cy="28" r="0.95" fill="currentColor" fillOpacity="0.9" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patId})`} />
      </svg>
    </div>
  );
}

interface AndalusianBackgroundPatternProps {
  /** Geometría andalusí: lacería de 8 puntas (Alhambra/Alcázar) o sebka (Giralda) */
  variant?: "laceria" | "sebka";
  /** Estilo de desvanecimiento para integrarse en el fondo oscuro */
  mask?: "top" | "radial" | "edges" | "none";
  className?: string;
}

/**
 * Fondo arquitectónico de filigrana geométrica andalusí.
 */
export function AndalusianBackgroundPattern({
  variant = "laceria",
  mask = "top",
  className = "text-[#C5A880]/[0.11]",
}: AndalusianBackgroundPatternProps) {
  const rawId = useId();
  const patId = `andalusian-bg-${variant}-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const maskStyle =
    mask === "top"
      ? {
          maskImage:
            "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.7) 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.7) 55%, transparent 100%)",
        }
      : mask === "radial"
      ? {
          maskImage:
            "radial-gradient(ellipse 85% 75% at 50% 35%, black 25%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 50% 35%, black 25%, transparent 90%)",
        }
      : mask === "edges"
      ? {
          maskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
        }
      : undefined;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 select-none overflow-hidden ${className}`}
      style={maskStyle}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {variant === "laceria" ? (
            <pattern
              id={patId}
              width="72"
              height="72"
              patternUnits="userSpaceOnUse"
            >
              <g stroke="currentColor" fill="none" strokeWidth="0.75">
                <rect x="27" y="27" width="18" height="18" />
                <rect
                  x="27"
                  y="27"
                  width="18"
                  height="18"
                  transform="rotate(45 36 36)"
                />

                <rect x="-9" y="-9" width="18" height="18" />
                <rect
                  x="-9"
                  y="-9"
                  width="18"
                  height="18"
                  transform="rotate(45 0 0)"
                />
                <rect x="63" y="-9" width="18" height="18" />
                <rect
                  x="63"
                  y="-9"
                  width="18"
                  height="18"
                  transform="rotate(45 72 0)"
                />
                <rect x="-9" y="63" width="18" height="18" />
                <rect
                  x="-9"
                  y="63"
                  width="18"
                  height="18"
                  transform="rotate(45 0 72)"
                />
                <rect x="63" y="63" width="18" height="18" />
                <rect
                  x="63"
                  y="63"
                  width="18"
                  height="18"
                  transform="rotate(45 72 72)"
                />

                <line x1="0" y1="36" x2="23.2" y2="36" strokeOpacity="0.7" />
                <line x1="48.8" y1="36" x2="72" y2="36" strokeOpacity="0.7" />
                <line x1="36" y1="0" x2="36" y2="23.2" strokeOpacity="0.7" />
                <line x1="36" y1="48.8" x2="36" y2="72" strokeOpacity="0.7" />

                <line x1="0" y1="18" x2="18" y2="0" strokeOpacity="0.65" />
                <line x1="54" y1="0" x2="72" y2="18" strokeOpacity="0.65" />
                <line x1="0" y1="54" x2="18" y2="72" strokeOpacity="0.65" />
                <line x1="54" y1="72" x2="72" y2="54" strokeOpacity="0.65" />
              </g>

              <circle cx="36" cy="36" r="1.4" fill="currentColor" />
              <circle cx="0" cy="0" r="1.4" fill="currentColor" />
              <circle cx="72" cy="0" r="1.4" fill="currentColor" />
              <circle cx="0" cy="72" r="1.4" fill="currentColor" />
              <circle cx="72" cy="72" r="1.4" fill="currentColor" />
            </pattern>
          ) : (
            <pattern
              id={patId}
              width="48"
              height="72"
              patternUnits="userSpaceOnUse"
            >
              <g stroke="currentColor" fill="none" strokeWidth="0.75">
                <path d="M 0,36 C 10,18 14,0 24,0 C 34,0 38,18 48,36 C 38,54 34,72 24,72 C 14,72 10,54 0,36 Z" />
                <path d="M -24,0 C -14,-18 -10,-36 0,-36 C 10,-36 14,-18 24,0 C 14,18 10,36 0,36 C -10,36 -14,18 -24,0 Z" />
                <path d="M 24,0 C 34,-18 38,-36 48,-36 C 58,-36 62,-18 72,0 C 62,18 58,36 48,36 C 38,36 34,18 24,0 Z" />
                <path d="M -24,72 C -14,54 -10,36 0,36 C 10,36 14,54 24,72 C 14,90 10,108 0,108 C -10,108 -14,90 -24,72 Z" />
                <path d="M 24,72 C 34,54 38,36 48,36 C 58,36 62,54 72,72 C 62,90 58,108 48,108 C 38,108 34,90 24,72 Z" />
                <path
                  d="M 24,28 L 28,36 L 24,44 L 20,36 Z"
                  strokeOpacity="0.6"
                />
              </g>
              <circle cx="24" cy="36" r="1.2" fill="currentColor" />
              <circle cx="0" cy="0" r="1.2" fill="currentColor" />
              <circle cx="48" cy="0" r="1.2" fill="currentColor" />
              <circle cx="0" cy="72" r="1.2" fill="currentColor" />
              <circle cx="48" cy="72" r="1.2" fill="currentColor" />
            </pattern>
          )}
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patId})`} />
      </svg>
    </div>
  );
}

/**
 * Composición arquitectónica completa para el fondo de cualquier página o sección:
 * filigrana continua sutil en todo el lienzo + cabecera realzada + cenefas laterales estilo alfiz.
 */
export function AndalusianCollectionBackdrop({
  variant = "laceria",
}: {
  variant?: "laceria" | "sebka";
}) {
  return (
    <>
      {/* Textura geométrica ambiental continua a lo largo de toda la página */}
      <AndalusianBackgroundPattern
        variant={variant}
        mask="none"
        className="text-[#C5A880]/[0.045]"
      />

      {/* Cabecera arquitectónica con mayor presencia que se funde hacia abajo */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px]">
        <AndalusianBackgroundPattern
          variant={variant}
          mask="top"
          className="text-[#C5A880]/[0.11]"
        />
      </div>

      {/* Cenefas laterales (efecto alfiz de museo andalusí) */}
      <div className="pointer-events-none absolute inset-y-20 left-2.5 hidden lg:block">
        <AndalusianVerticalCenefa className="text-[#C5A880]/26" />
      </div>
      <div className="pointer-events-none absolute inset-y-20 right-2.5 hidden lg:block">
        <AndalusianVerticalCenefa className="text-[#C5A880]/26" />
      </div>
    </>
  );
}

/** Alias semántico para reutilizar el mismo fondo arquitectónico en páginas no-colección */
export const AndalusianPageBackdrop = AndalusianCollectionBackdrop;

/**
 * Esquinas ornamentales sutiles inspiradas en taracea granadina para paneles destacados.
 */
export function AndalusianCornerOrnaments({
  className = "text-[#C5A880]/45",
}: {
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 select-none ${className}`}>
      {/* Esquina superior izquierda */}
      <svg className="absolute top-2.5 left-2.5 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M 1,14 L 1,1 L 14,1" />
        <path d="M 5,10 L 5,5 L 10,5" strokeOpacity="0.6" />
        <circle cx="5" cy="5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
      {/* Esquina superior derecha */}
      <svg className="absolute top-2.5 right-2.5 h-5 w-5 -scale-x-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M 1,14 L 1,1 L 14,1" />
        <path d="M 5,10 L 5,5 L 10,5" strokeOpacity="0.6" />
        <circle cx="5" cy="5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
      {/* Esquina inferior izquierda */}
      <svg className="absolute bottom-2.5 left-2.5 h-5 w-5 -scale-y-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M 1,14 L 1,1 L 14,1" />
        <path d="M 5,10 L 5,5 L 10,5" strokeOpacity="0.6" />
        <circle cx="5" cy="5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
      {/* Esquina inferior derecha */}
      <svg className="absolute bottom-2.5 right-2.5 h-5 w-5 scale-[-1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M 1,14 L 1,1 L 14,1" />
        <path d="M 5,10 L 5,5 L 10,5" strokeOpacity="0.6" />
        <circle cx="5" cy="5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}

interface AndalusianDividerProps {
  className?: string;
}

/**
 * Separador editorial sobrio con pequeña estrella andalusí de 8 puntas en el centro.
 */
export function AndalusianDivider({ className = "" }: AndalusianDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-4 select-none ${className}`}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C5A880]/30 to-[#C5A880]/50" />
      <AndalusianStarMark className="h-4 w-4 text-[#C5A880]/65" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#C5A880]/30 to-[#C5A880]/50" />
    </div>
  );
}
