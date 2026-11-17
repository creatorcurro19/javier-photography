/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Luxury Andalusian 512x512 SVG Monogram (JE) for Javier Espinosa Fotografía
// Combines the classic Al-Andalus 8-pointed star (estrella de ocho puntas / lacería nazarí)
// with the refined ivory JE monogram on deep obsidian.
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="42%" r="68%">
      <stop offset="0%" stop-color="#191A1D"/>
      <stop offset="65%" stop-color="#101114"/>
      <stop offset="100%" stop-color="#08090B"/>
    </radialGradient>

    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5CCA8"/>
      <stop offset="48%" stop-color="#C5A880"/>
      <stop offset="100%" stop-color="#8A6F4E"/>
    </linearGradient>

    <linearGradient id="ivoryGrad" gradientUnits="userSpaceOnUse" x1="256" y1="176" x2="256" y2="350">
      <stop offset="0%" stop-color="#F7F4EE"/>
      <stop offset="100%" stop-color="#D4CEC3"/>
    </linearGradient>

    <!-- Subtle Andalusian laceria background texture clipped to rounded icon -->
    <pattern id="bgLaceria" width="64" height="64" patternUnits="userSpaceOnUse">
      <g stroke="#C5A880" stroke-opacity="0.11" fill="none" stroke-width="1">
        <rect x="22" y="22" width="20" height="20"/>
        <rect x="22" y="22" width="20" height="20" transform="rotate(45 32 32)"/>
        <line x1="0" y1="32" x2="18" y2="32"/>
        <line x1="46" y1="32" x2="64" y2="32"/>
        <line x1="32" y1="0" x2="32" y2="18"/>
        <line x1="32" y1="46" x2="32" y2="64"/>
      </g>
    </pattern>

    <clipPath id="iconClip">
      <rect width="512" height="512" rx="112"/>
    </clipPath>

    <filter id="monogramShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.75"/>
    </filter>
  </defs>

  <g clip-path="url(#iconClip)">
    <!-- Deep Obsidian Canvas -->
    <rect width="512" height="512" fill="url(#bgGrad)"/>

    <!-- Subtle Ambient Arabesque Laceria Watermark -->
    <rect width="512" height="512" fill="url(#bgLaceria)"/>

    <!-- Outer Framing Rim (Double Gold Hairline) -->
    <rect x="14" y="14" width="484" height="484" rx="98" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" stroke-opacity="0.45"/>
    <rect x="24" y="24" width="464" height="464" rx="88" fill="none" stroke="url(#goldGrad)" stroke-width="1" stroke-opacity="0.25" stroke-dasharray="4 6"/>

    <!-- Andalusian 8-Pointed Star (Rub el Hizb / Estrella Nazarí) Framing the Monogram -->
    <g fill="none" stroke="url(#goldGrad)">
      <!-- Outer interlocked squares -->
      <rect x="96" y="96" width="320" height="320" stroke-width="5.5" stroke-opacity="0.88"/>
      <rect x="96" y="96" width="320" height="320" stroke-width="5.5" stroke-opacity="0.88" transform="rotate(45 256 256)"/>

      <!-- Inner parallel filigree squares -->
      <rect x="112" y="112" width="288" height="288" stroke-width="2" stroke-opacity="0.5"/>
      <rect x="112" y="112" width="288" height="288" stroke-width="2" stroke-opacity="0.5" transform="rotate(45 256 256)"/>
    </g>

    <!-- Inner dark medallion backing so JE reads crisp even at 16px/32px -->
    <circle cx="256" cy="256" r="154" fill="#0C0D10" fill-opacity="0.92" stroke="url(#goldGrad)" stroke-width="2.2" stroke-opacity="0.65"/>
    <circle cx="256" cy="256" r="142" fill="none" stroke="url(#goldGrad)" stroke-width="1.2" stroke-opacity="0.35" stroke-dasharray="4 6"/>

    <!-- Eight Golden Cardinal & Diagonal Star Rosette Beads -->
    <g fill="url(#goldGrad)">
      <circle cx="256" cy="54" r="6"/>
      <circle cx="256" cy="458" r="6"/>
      <circle cx="54" cy="256" r="6"/>
      <circle cx="458" cy="256" r="6"/>
      <circle cx="114" cy="114" r="5"/>
      <circle cx="398" cy="114" r="5"/>
      <circle cx="114" cy="398" r="5"/>
      <circle cx="398" cy="398" r="5"/>
    </g>

    <!-- Center Monogram: JE -->
    <g filter="url(#monogramShadow)">
      <!-- Letter J -->
      <path d="M 228 176 L 228 302 C 228 334 209 350 179 350 C 154 350 139 336 132 322 L 151 307 C 157 318 166 326 179 326 C 195 326 202 315 202 295 L 202 176 Z"
            fill="url(#ivoryGrad)"/>
      <!-- J serif top bar -->
      <path d="M 190 176 L 240 176 L 240 189 L 190 189 Z" fill="url(#ivoryGrad)"/>

      <!-- Letter E -->
      <path d="M 272 176 L 372 176 L 372 200 L 300 200 L 300 247 L 360 247 L 360 270 L 300 270 L 300 324 L 376 324 L 376 348 L 272 348 Z"
            fill="url(#ivoryGrad)"/>

      <!-- Miniature 8-Pointed Gold Star Emblem between J and E -->
      <g transform="translate(251, 258)" fill="url(#goldGrad)">
        <rect x="-5.5" y="-5.5" width="11" height="11"/>
        <rect x="-5.5" y="-5.5" width="11" height="11" transform="rotate(45)"/>
      </g>
    </g>
  </g>
</svg>`;

async function main() {
  const root = path.resolve(__dirname, "..");
  const publicDir = path.join(root, "public");
  const appDir = path.join(root, "app");

  // 1. Write SVG icons
  fs.writeFileSync(path.join(appDir, "icon.svg"), svgContent);
  fs.writeFileSync(path.join(publicDir, "icon.svg"), svgContent);
  console.log("Wrote icon.svg");

  const svgBuffer = Buffer.from(svgContent);

  // 2. Generate PNG 180x180 (Apple touch icon)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(appDir, "apple-icon.png"));
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, "apple-touch-icon.png"));
  console.log("Wrote apple-icon.png");

  // 3. Generate PNG 192x192 & 512x512 for PWA Manifest
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, "icon-192.png"));
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, "icon-512.png"));
  console.log("Wrote PWA manifest icons (192 & 512)");

  // 4. Generate 32x32 PNG for favicon.ico
  const ico32Buffer = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(appDir, "favicon.ico"), ico32Buffer);
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), ico32Buffer);
  console.log("Wrote favicon.ico");
}

main().catch(console.error);
