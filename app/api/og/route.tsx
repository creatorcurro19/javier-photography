import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = (searchParams.get("title") || "JAVIER ESPINOSA").slice(0, 90);
    const badge = (searchParams.get("badge") || "FOTOGRAFÍA DE AUTOR").toUpperCase().slice(0, 36);
    const subtitle = (searchParams.get("subtitle") || "The Art of Seeing").slice(0, 110);
    const meta = (searchParams.get("meta") || "Fine Art Editions · Hahnemühle Photo Rag 308g · Tenerife").slice(0, 90);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#0B0C0E",
            backgroundImage:
              "radial-gradient(circle at 50% 38%, #16181D 0%, #0B0C0E 72%)",
            color: "#F7F4EE",
            padding: "52px 64px",
            position: "relative",
            fontFamily: "serif",
          }}
        >
          {/* Doble marco perimetral dorado */}
          <div
            style={{
              position: "absolute",
              inset: "22px",
              border: "1.5px solid rgba(197, 168, 128, 0.45)",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "30px",
              border: "1px solid rgba(197, 168, 128, 0.2)",
              display: "flex",
            }}
          />

          {/* Cabecera de la tarjeta: Monograma + Badge de Disciplina */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Monograma JE */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "52px",
                  height: "52px",
                  position: "relative",
                }}
              >
                <svg
                  width="52"
                  height="52"
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
                    strokeWidth="2.5"
                  />
                  <rect
                    x="22"
                    y="22"
                    width="76"
                    height="76"
                    fill="none"
                    stroke="#C5A880"
                    strokeWidth="2.5"
                    transform="rotate(45 60 60)"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="36"
                    fill="#0B0C0E"
                    stroke="#C5A880"
                    strokeWidth="1.5"
                  />
                </svg>
                <span
                  style={{
                    fontSize: "18px",
                    letterSpacing: "2px",
                    color: "#F7F4EE",
                    fontWeight: 600,
                    fontFamily: "sans-serif",
                  }}
                >
                  JE
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "13px",
                    letterSpacing: "4px",
                    textTransform: "uppercase",
                    color: "#F7F4EE",
                    fontFamily: "sans-serif",
                    fontWeight: 500,
                  }}
                >
                  JAVIER ESPINOSA
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#C5A880",
                    fontFamily: "monospace",
                    marginTop: "2px",
                  }}
                >
                  FOTOGRAFÍA DE AUTOR
                </span>
              </div>
            </div>

            {/* Badge de categoría / disciplina */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid rgba(197, 168, 128, 0.4)",
                backgroundColor: "rgba(197, 168, 128, 0.08)",
                padding: "8px 18px",
                fontSize: "11px",
                letterSpacing: "3px",
                color: "#E5D3B3",
                fontFamily: "monospace",
                textTransform: "uppercase",
              }}
            >
              {badge}
            </div>
          </div>

          {/* Bloque Central: Título y Subtítulo editorial */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginTop: "16px",
              marginBottom: "16px",
              maxWidth: "1000px",
            }}
          >
            <h1
              style={{
                fontSize: title.length > 40 ? "46px" : "56px",
                lineHeight: "1.15",
                fontWeight: 300,
                color: "#FFFFFF",
                margin: 0,
                letterSpacing: "-0.5px",
                fontFamily: "serif",
              }}
            >
              {title}
            </h1>

            {subtitle && (
              <p
                style={{
                  fontSize: "20px",
                  color: "#C5A880",
                  fontStyle: "italic",
                  marginTop: "16px",
                  lineHeight: "1.4",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span>{subtitle}</span>
              </p>
            )}
          </div>

          {/* Pie de la tarjeta con especificaciones técnicas */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(197, 168, 128, 0.25)",
              paddingTop: "20px",
              fontFamily: "monospace",
              fontSize: "11px",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "#8E8A80",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="10" height="10" viewBox="0 0 10 10">
                <polygon points="5,0 10,5 5,10 0,5" fill="#C5A880" />
              </svg>
              <span>{meta}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#C5A880" }}>
              <span>TENERIFE</span>
              <span>·</span>
              <span>ESPAÑA</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch (error) {
    console.error("[og-generator] Error generando Open Graph:", error);
    return new Response("Error generando imagen Open Graph", { status: 500 });
  }
}
