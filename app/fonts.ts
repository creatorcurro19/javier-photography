import localFont from "next/font/local";

export const plusJakarta = localFont({
  src: [
    {
      path: "./fonts/plus-jakarta-sans-latin.woff2",
      weight: "200 800",
      style: "normal",
    },
    {
      path: "./fonts/plus-jakarta-sans-italic-latin.woff2",
      weight: "200 800",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-plus-jakarta",
  fallback: ["system-ui", "sans-serif"],
});

export const playfair = localFont({
  src: [
    {
      path: "./fonts/playfair-display-latin.woff2",
      weight: "400 900",
      style: "normal",
    },
    {
      path: "./fonts/playfair-display-italic-latin.woff2",
      weight: "400 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-playfair",
  fallback: ["Georgia", "serif"],
});

export const jetbrainsMono = localFont({
  src: [
    {
      path: "./fonts/jetbrains-mono-latin.woff2",
      weight: "100 800",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-jetbrains-mono",
  fallback: ["monospace"],
});
