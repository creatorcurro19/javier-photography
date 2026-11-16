/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// High-end 512x512 SVG Icon for Javier Espinosa Fotografía
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#181A1B"/>
      <stop offset="100%" stop-color="#0D0E0F"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#B8A48B"/>
      <stop offset="50%" stop-color="#95836B"/>
      <stop offset="100%" stop-color="#73624D"/>
    </linearGradient>
    <linearGradient id="ivoryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EDEAE3"/>
      <stop offset="100%" stop-color="#C5C2BA"/>
    </linearGradient>
    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  <rect x="12" y="12" width="488" height="488" rx="100" fill="none" stroke="#25282A" stroke-width="2"/>

  <!-- Optical Outer Ring -->
  <circle cx="256" cy="256" r="212" fill="none" stroke="#1F2224" stroke-width="2"/>
  <circle cx="256" cy="256" r="196" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-opacity="0.35" stroke-dasharray="6 8"/>

  <!-- Camera Viewfinder Corner Crosshairs -->
  <path d="M 96 156 L 96 96 L 156 96" fill="none" stroke="url(#goldGrad)" stroke-width="3" stroke-linecap="round"/>
  <path d="M 416 156 L 416 96 L 356 96" fill="none" stroke="url(#goldGrad)" stroke-width="3" stroke-linecap="round"/>
  <path d="M 96 356 L 96 416 L 156 416" fill="none" stroke="url(#goldGrad)" stroke-width="3" stroke-linecap="round"/>
  <path d="M 416 356 L 416 416 L 356 416" fill="none" stroke="url(#goldGrad)" stroke-width="3" stroke-linecap="round"/>

  <!-- Center Monogram: JE -->
  <g filter="url(#subtleGlow)">
    <!-- Letter J -->
    <path d="M 226 160 L 226 312 C 226 348 206 366 172 366 C 144 366 128 350 120 334 L 140 318 C 146 330 156 340 172 340 C 190 340 198 328 198 304 L 198 160 Z"
          fill="url(#ivoryGrad)"/>
    <!-- J serif top bar -->
    <path d="M 188 160 L 236 160 L 236 172 L 188 172 Z" fill="url(#ivoryGrad)"/>

    <!-- Letter E -->
    <path d="M 266 160 L 376 160 L 376 186 L 298 186 L 298 240 L 364 240 L 364 264 L 298 264 L 298 336 L 380 336 L 380 364 L 266 364 Z"
          fill="url(#ivoryGrad)"/>

    <!-- Optical Bronze Center Indicator Dot -->
    <circle cx="247" cy="252" r="5.5" fill="url(#goldGrad)"/>
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

  // 4. Generate 32x32 & 48x48 PNG and ICO
  const ico32Buffer = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(appDir, "favicon.ico"), ico32Buffer);
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), ico32Buffer);
  console.log("Wrote favicon.ico");
}

main().catch(console.error);
