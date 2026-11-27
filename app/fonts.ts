import localFont from "next/font/local";

export const dmSans = localFont({
  src: [
    {
      path: "./fonts/dm-sans-latin.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/dm-sans-italic-latin.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-dm-sans",
  fallback: ["system-ui", "sans-serif"],
});

export const cormorantGaramond = localFont({
  src: [
    {
      path: "./fonts/cormorant-garamond-latin.woff2",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "./fonts/cormorant-garamond-italic-latin.woff2",
      weight: "300 700",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-cormorant",
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
