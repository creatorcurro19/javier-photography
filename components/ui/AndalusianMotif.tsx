import { useId } from "react";

interface AndalusianCenefaProps {
  className?: string;
  /** Suaviza los extremos izquierdo y derecho con un degradado */
  fadeEdges?: boolean;
  /** Variante del motivo geométrico de la cenefa */
  variant?: "estrella" | "sebka";
}

/**
 * Cenefa horizontal discreta de inspiración andalusí (lacería de ocho puntas y sebka).
 * Pensada como firma arquitectónica sutil para los encabezados y fondos de las colecciones.
 */
export function AndalusianCenefa({
  className = "text-[#C5A880]/25",
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
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            }
          : undefined
      }
    >
      {variant === "estrella" ? (
        <svg
          className="h-5 w-full sm:h-6"
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
              {/* Doble filete superior e inferior */}
              <line
                x1="0"
                y1="1.5"
                x2="56"
                y2="1.5"
                stroke="currentColor"
                strokeWidth="0.7"
                strokeOpacity="0.85"
              />
              <line
                x1="0"
                y1="4"
                x2="56"
                y2="4"
                stroke="currentColor"
                strokeWidth="0.4"
                strokeDasharray="1.5 2.5"
                strokeOpacity="0.6"
              />
              <line
                x1="0"
                y1="20"
                x2="56"
                y2="20"
                stroke="currentColor"
                strokeWidth="0.4"
                strokeDasharray="1.5 2.5"
                strokeOpacity="0.6"
              />
              <line
                x1="0"
                y1="22.5"
                x2="56"
                y2="22.5"
                stroke="currentColor"
                strokeWidth="0.7"
                strokeOpacity="0.85"
              />

              {/* Lacería diagonal continua */}
              <path
                d="M 0,12 L 14,4 L 28,12 L 14,20 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.65"
                strokeOpacity="0.7"
              />
              <path
                d="M 28,12 L 42,4 L 56,12 L 42,20 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.65"
                strokeOpacity="0.7"
              />
              <path
                d="M 0,4 L 14,12 L 0,20 M 56,4 L 42,12 L 56,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.55"
                strokeOpacity="0.5"
              />

              {/* Estrella andalusí de 8 puntas central */}
              <g stroke="currentColor" fill="none" strokeWidth="0.65">
                <rect x="24.5" y="8.5" width="7" height="7" />
                <rect
                  x="24.5"
                  y="8.5"
                  width="7"
                  height="7"
                  transform="rotate(45 28 12)"
                />
                {/* Medias estrellas en los extremos para enlace continuo */}
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

              {/* Micro-puntos centrales */}
              <circle cx="28" cy="12" r="0.9" fill="currentColor" fillOpacity="0.85" />
              <circle cx="14" cy="12" r="0.7" fill="currentColor" fillOpacity="0.5" />
              <circle cx="42" cy="12" r="0.7" fill="currentColor" fillOpacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patId})`} />
        </svg>
      ) : (
        <svg
          className="h-5 w-full sm:h-6"
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
              {/* Filetes de encuadre */}
              <line
                x1="0"
                y1="1.5"
                x2="44"
                y2="1.5"
                stroke="currentColor"
                strokeWidth="0.65"
                strokeOpacity="0.8"
              />
              <line
                x1="0"
                y1="22.5"
                x2="44"
                y2="22.5"
                stroke="currentColor"
                strokeWidth="0.65"
                strokeOpacity="0.8"
              />
              {/* Arcos entrelazados (arquería / sebka horizontal) */}
              <path
                d="M 0,20 Q 11,4 22,20 Q 33,4 44,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.7"
                strokeOpacity="0.75"
              />
              <path
                d="M -11,20 Q 0,4 11,20 Q 22,4 33,20 Q 44,4 55,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.55"
                strokeOpacity="0.45"
              />
              <path
                d="M 0,4 Q 11,20 22,4 Q 33,20 44,4"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.55"
                strokeOpacity="0.4"
              />
              <circle cx="11" cy="12" r="0.9" fill="currentColor" fillOpacity="0.75" />
              <circle cx="33" cy="12" r="0.9" fill="currentColor" fillOpacity="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patId})`} />
        </svg>
      )}
    </div>
  );
}

interface AndalusianBackgroundPatternProps {
  /** Geometría andalusí: lacería de 8 puntas (Alhambra/Alcázar) o sebka (Giralda) */
  variant?: "laceria" | "sebka";
  /** Estilo de desvanecimiento para integrarse con discreción en el fondo oscuro */
  mask?: "top" | "radial" | "edges" | "none";
  className?: string;
}

/**
 * Fondo arquitectónico de filigrana geométrica andalusí en baja opacidad.
 * Aporta textura y origen cultural sin competir jamás con las fotografías.
 */
export function AndalusianBackgroundPattern({
  variant = "laceria",
  mask = "top",
  className = "text-[#C5A880]/[0.06]",
}: AndalusianBackgroundPatternProps) {
  const rawId = useId();
  const patId = `andalusian-bg-${variant}-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const maskStyle =
    mask === "top"
      ? {
          maskImage:
            "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.65) 45%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.65) 45%, transparent 100%)",
        }
      : mask === "radial"
      ? {
          maskImage:
            "radial-gradient(ellipse 80% 75% at 50% 25%, black 15%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 75% at 50% 25%, black 15%, transparent 85%)",
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
              {/* Estrella mudéjar central de 8 puntas */}
              <g stroke="currentColor" fill="none" strokeWidth="0.75">
                <rect x="27" y="27" width="18" height="18" />
                <rect
                  x="27"
                  y="27"
                  width="18"
                  height="18"
                  transform="rotate(45 36 36)"
                />

                {/* Cuartos de estrella en las 4 esquinas */}
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

                {/* Lacería conectora axial y diagonal */}
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
              {/* Paño de Sebka (arcos romboidales entrelazados) */}
              <g stroke="currentColor" fill="none" strokeWidth="0.75">
                <path d="M 0,36 C 10,18 14,0 24,0 C 34,0 38,18 48,36 C 38,54 34,72 24,72 C 14,72 10,54 0,36 Z" />
                <path d="M -24,0 C -14,-18 -10,-36 0,-36 C 10,-36 14,-18 24,0 C 14,18 10,36 0,36 C -10,36 -14,18 -24,0 Z" />
                <path d="M 24,0 C 34,-18 38,-36 48,-36 C 58,-36 62,-18 72,0 C 62,18 58,36 48,36 C 38,36 34,18 24,0 Z" />
                <path d="M -24,72 C -14,54 -10,36 0,36 C 10,36 14,54 24,72 C 14,90 10,108 0,108 C -10,108 -14,90 -24,72 Z" />
                <path d="M 24,72 C 34,54 38,36 48,36 C 58,36 62,54 72,72 C 62,90 58,108 48,108 C 38,108 34,90 24,72 Z" />
                {/* Detalle de rosetón interior */}
                <path
                  d="M 24,28 L 28,36 L 24,44 L 20,36 Z"
                  strokeOpacity="0.55"
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
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C5A880]/20 to-[#C5A880]/30" />
      <svg
        className="h-4 w-4 text-[#C5A880]/45"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <rect x="6" y="6" width="12" height="12" />
        <rect
          x="6"
          y="6"
          width="12"
          height="12"
          transform="rotate(45 12 12)"
        />
        <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#C5A880]/20 to-[#C5A880]/30" />
    </div>
  );
}
