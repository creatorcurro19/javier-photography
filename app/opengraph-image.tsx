import { ImageResponse } from "next/og";

export const alt = "Javier Espinosa — The Art of Seeing · Fotografía de Autor";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B0C0E",
          backgroundImage:
            "radial-gradient(circle at 50% 42%, #191A1F 0%, #0B0C0E 70%)",
          color: "#F7F4EE",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        {/* Marco exterior dorado doble */}
        <div
          style={{
            position: "absolute",
            inset: "28px",
            border: "1.5px solid rgba(197, 168, 128, 0.45)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "40px",
            border: "1px solid rgba(197, 168, 128, 0.22)",
            display: "flex",
          }}
        />

        {/* Estrella andalusí de 8 puntas con monograma JE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "112px",
            height: "112px",
            position: "relative",
            marginBottom: "28px",
          }}
        >
          <svg
            width="112"
            height="112"
            viewBox="0 0 120 120"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <rect
              x="22"
              y="22"
              width="76"
              height="76"
              fill="none"
              stroke="#C5A880"
              strokeWidth="2"
            />
            <rect
              x="22"
              y="22"
              width="76"
              height="76"
              fill="none"
              stroke="#C5A880"
              strokeWidth="2"
              transform="rotate(45 60 60)"
            />
            <circle
              cx="60"
              cy="60"
              r="36"
              fill="#0C0D10"
              stroke="#C5A880"
              strokeOpacity="0.65"
              strokeWidth="1.2"
            />
          </svg>
          <span
            style={{
              fontSize: "34px",
              letterSpacing: "4px",
              color: "#F7F4EE",
              fontWeight: 500,
              fontFamily: "sans-serif",
            }}
          >
            JE
          </span>
        </div>

        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "14px",
            letterSpacing: "6px",
            textTransform: "uppercase",
            color: "#C5A880",
            fontFamily: "monospace",
          }}
        >
          <span>MUSEO DIGITAL DE FOTOGRAFÍA DE AUTOR</span>
        </div>

        {/* Título principal */}
        <div
          style={{
            marginTop: "18px",
            fontSize: "64px",
            letterSpacing: "14px",
            textTransform: "uppercase",
            fontWeight: 300,
            color: "#F7F4EE",
            fontFamily: "sans-serif",
          }}
        >
          JAVIER ESPINOSA
        </div>

        {/* Subtítulo editorial */}
        <div
          style={{
            marginTop: "14px",
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: "28px",
            fontStyle: "italic",
            color: "#E5D3B3",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "1px",
              backgroundColor: "rgba(197, 168, 128, 0.55)",
            }}
          />
          <span>The Art of Seeing</span>
          <div
            style={{
              width: "48px",
              height: "1px",
              backgroundColor: "rgba(197, 168, 128, 0.55)",
            }}
          />
        </div>

        {/* Disciplinas y garantía */}
        <div
          style={{
            marginTop: "36px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "13px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#8E8A80",
            fontFamily: "monospace",
          }}
        >
          <span>LANDSCAPES</span>
          <span style={{ color: "#C5A880" }}>·</span>
          <span>WILDLIFE</span>
          <span style={{ color: "#C5A880" }}>·</span>
          <span>MOTORSPORT</span>
          <span style={{ color: "#C5A880" }}>·</span>
          <span>ARCHITECTURE</span>
          <span style={{ color: "#C5A880" }}>·</span>
          <span>DOCUMENTARY</span>
        </div>

        {/* Pie discreto */}
        <div
          style={{
            position: "absolute",
            bottom: "58px",
            fontSize: "12px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "rgba(197, 168, 128, 0.7)",
            fontFamily: "monospace",
          }}
        >
          FINE ART EDITIONS · HAHNEMÜHLE 308G · ISO 9706
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
