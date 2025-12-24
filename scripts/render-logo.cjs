const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const toIco = require("to-ico");
const sharp = require("sharp");

async function renderLogo() {
  const publicDir = path.join(__dirname, "../public");

  // SVG Sources
  const logoSvgPath = path.join(publicDir, "logo.svg");
  const iconSvgPath = path.join(publicDir, "logo-icon.svg");
  const logoSvg = fs.readFileSync(logoSvgPath);
  const iconSvg = fs.readFileSync(iconSvgPath);

  // 1. Generate Icon-only assets using Sharp (Guaranteed transparency)
  const iconSizes = [
    { name: "apple-touch-icon.png", size: 180 },
    { name: "favicon-192.png", size: 192 },
    { name: "favicon-512.png", size: 512 },
    { name: "favicon.png", size: 64 },
    { name: "logo-192.png", size: 192 },
    { name: "logo-512.png", size: 512 },
    { name: "logo.png", size: 512 },
  ];

  console.log("Generating icons with Sharp...");
  for (const config of iconSizes) {
    await sharp(iconSvg)
      .resize(config.size, config.size)
      .png()
      .toFile(path.join(publicDir, config.name));
    console.log(`Created ${config.name}`);
  }

  // 2. Generate Assets with Text using Playwright (for font rendering)
  console.log("Launching browser for text-based assets...");
  const browser = await chromium.launch();

  const horizontalLogoSizes = [
    { name: "logo-horizontal.png", width: 280, height: 60 },
    { name: "logo-horizontal@2x.png", width: 560, height: 120 },
    { name: "logo-horizontal@3x.png", width: 840, height: 180 },
  ];

  const horizontalLogoSvg = `
    <svg width="260" height="60" viewBox="0 0 260 60" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(2, 5) scale(0.25)">
        <path d="M100 40 C 80 40, 50 50, 50 90 C 50 140, 80 160, 100 160 C 120 160, 150 140, 150 90 C 150 50, 120 40, 100 40" fill="#FF6B6B" />
        <path d="M100 40 Q 90 10, 120 10 Q 130 30, 100 40" fill="#4ECDC4" />
        <path d="M100 65 C 85 65, 75 75, 75 90 C 75 110, 100 135, 100 135 C 100 135, 125 110, 125 90 C 125 75, 115 65, 100 65 Z" fill="white" />
        <rect x="96" y="78" width="8" height="24" rx="2" fill="#FF6B6B" />
        <rect x="88" y="86" width="24" height="8" rx="2" fill="#FF6B6B" />
      </g>
      <text x="52" y="40" font-family="Montserrat" font-size="24" font-weight="700" fill="#0D8078">sexualhealth.nyc</text>
    </svg>
  `;

  for (const config of horizontalLogoSizes) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: config.width, height: config.height });
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap" rel="stylesheet" />
        <style>
          body { margin: 0; padding: 0; background: transparent; overflow: hidden; }
          svg { display: block; width: ${config.width}px; height: ${config.height}px; }
        </style>
      </head>
      <body>${horizontalLogoSvg}</body>
      </html>
    `);
    await page.waitForTimeout(1000); // More time for fonts
    await page.screenshot({
      path: path.join(publicDir, config.name),
      omitBackground: true,
    });
    console.log(`Created ${config.name}`);
    await page.close();
  }

  // OG Image (opaque background is fine/preferred here)
  const ogPage = await browser.newPage();
  await ogPage.setViewportSize({ width: 1200, height: 630 });
  const ogImageSvg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#f8f9fa"/>
      <g transform="translate(450, 120) scale(1.5)">
        <path d="M100 40 C 80 40, 50 50, 50 90 C 50 140, 80 160, 100 160 C 120 160, 150 140, 150 90 C 150 50, 120 40, 100 40" fill="#FF6B6B" />
        <path d="M100 40 Q 90 10, 120 10 Q 130 30, 100 40" fill="#4ECDC4" />
        <path d="M100 65 C 85 65, 75 75, 75 90 C 75 110, 100 135, 100 135 C 100 135, 125 110, 125 90 C 125 75, 115 65, 100 65 Z" fill="white" />
        <rect x="96" y="78" width="8" height="24" rx="2" fill="#FF6B6B" />
        <rect x="88" y="86" width="24" height="8" rx="2" fill="#FF6B6B" />
      </g>
      <text x="600" y="480" text-anchor="middle" font-family="Montserrat" font-size="64" font-weight="700" fill="#0D8078">sexualhealth.nyc</text>
      <text x="600" y="550" text-anchor="middle" font-family="Montserrat" font-size="32" font-weight="500" fill="#5a6570">Find Free &amp; Low-Cost Clinics</text>
    </svg>
  `;
  await ogPage.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap" rel="stylesheet" />
      <style>
        body { margin: 0; padding: 0; }
        text { font-family: 'Montserrat', sans-serif; }
      </style>
    </head>
    <body>${ogImageSvg}</body>
    </html>
  `);
  await ogPage.waitForTimeout(1000);
  await ogPage.screenshot({ path: path.join(publicDir, "og-image.png") });
  console.log("Created og-image.png");
  await ogPage.close();

  await browser.close();

  // Convert favicon.png to favicon.ico
  const faviconPng = path.join(publicDir, "favicon.png");
  const faviconIco = path.join(publicDir, "favicon.ico");
  const faviconBuffer = fs.readFileSync(faviconPng);
  const icoBuffer = await toIco([faviconBuffer], { sizes: [64] });
  fs.writeFileSync(faviconIco, icoBuffer);
  console.log("Created favicon.ico");
  console.log("Done!");
}

renderLogo().catch(console.error);
