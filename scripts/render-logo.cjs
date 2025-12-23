const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const toIco = require("to-ico");

async function renderLogo() {
  const browser = await chromium.launch();
  const publicDir = path.join(__dirname, "../public");

  // Logo sizes to generate (for PWA icons)
  const logoSizes = [
    { name: "logo-192.png", size: 192 },
    { name: "logo-512.png", size: 512 },
  ];

  // Horizontal logo with text (1x, 2x, 3x for retina)
  const horizontalLogoSizes = [
    { name: "logo-horizontal.png", width: 280, height: 60 },
    { name: "logo-horizontal@2x.png", width: 560, height: 120 },
    { name: "logo-horizontal@3x.png", width: 840, height: 180 },
  ];

  const logoSvg = fs.readFileSync(path.join(publicDir, "logo.svg"), "utf8");

  for (const config of logoSizes) {
    const page = await browser.newPage();
    await page.setViewportSize({
      width: config.size + 40,
      height: config.size + 40,
    });

    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <style>
          body {
            margin: 0;
            padding: 20px;
            background: white;
          }
          svg {
            width: ${config.size}px;
            height: ${config.size}px;
          }
          text {
            font-family: 'Montserrat', sans-serif;
          }
        </style>
      </head>
      <body>${logoSvg}</body>
      </html>
    `);

    // Wait for fonts to load
    await page.waitForTimeout(500);

    const element = await page.$("svg");
    await element.screenshot({
      path: path.join(publicDir, config.name),
      omitBackground: true,
    });
    console.log(`Created ${config.name}`);
    await page.close();
  }

  // Render horizontal logos (icon + text)
  // Using #0D8078 - teal that passes WCAG AA (4.8:1)
  const horizontalLogoSvg = `
    <svg width="260" height="60" viewBox="0 0 260 60" xmlns="http://www.w3.org/2000/svg">
      <!-- Apple/heart icon on left -->
      <g transform="translate(2, 5) scale(0.25)">
        <path d="M100 40 C 80 40, 50 50, 50 90 C 50 140, 80 160, 100 160 C 120 160, 150 140, 150 90 C 150 50, 120 40, 100 40" fill="#FF6B6B" />
        <path d="M100 40 Q 90 10, 120 10 Q 130 30, 100 40" fill="#4ECDC4" />
        <path d="M100 65 C 85 65, 75 75, 75 90 C 75 110, 100 135, 100 135 C 100 135, 125 110, 125 90 C 125 75, 115 65, 100 65 Z" fill="white" />
        <rect x="96" y="78" width="8" height="24" rx="2" fill="#FF6B6B" />
        <rect x="88" y="86" width="24" height="8" rx="2" fill="#FF6B6B" />
      </g>
      <!-- Text - closer to icon, teal color -->
      <text x="52" y="40" font-family="Montserrat" font-size="24" font-weight="700" fill="#0D8078">sexualhealth.nyc</text>
    </svg>
  `;

  for (const config of horizontalLogoSizes) {
    const page = await browser.newPage();
    await page.setViewportSize({
      width: config.width + 40,
      height: config.height + 40,
    });

    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap"
          rel="stylesheet"
        />
        <style>
          body {
            margin: 0;
            padding: 20px;
            background: transparent;
          }
          svg {
            width: ${config.width}px;
            height: ${config.height}px;
          }
          text {
            font-family: 'Montserrat', sans-serif;
          }
        </style>
      </head>
      <body>${horizontalLogoSvg}</body>
      </html>
    `);

    // Wait for fonts to load
    await page.waitForTimeout(500);

    const element = await page.$("svg");
    await element.screenshot({
      path: path.join(publicDir, config.name),
      omitBackground: true,
    });
    console.log(`Created ${config.name}`);
    await page.close();
  }

  // Icon sizes (square, no text - for favicons, apple-touch-icon, etc.)
  const iconSizes = [
    { name: "apple-touch-icon.png", size: 180 },
    { name: "favicon-192.png", size: 192 },
    { name: "favicon-512.png", size: 512 },
    { name: "favicon.png", size: 32 },
  ];

  const iconSvg = fs.readFileSync(
    path.join(publicDir, "logo-icon.svg"),
    "utf8",
  );

  for (const config of iconSizes) {
    const page = await browser.newPage();
    await page.setViewportSize({
      width: config.size + 40,
      height: config.size + 40,
    });

    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 20px;
            background: white;
          }
          svg {
            width: ${config.size}px;
            height: ${config.size}px;
          }
        </style>
      </head>
      <body>${iconSvg}</body>
      </html>
    `);

    const element = await page.$("svg");
    await element.screenshot({
      path: path.join(publicDir, config.name),
      omitBackground: true,
    });
    console.log(`Created ${config.name}`);
    await page.close();
  }

  await browser.close();

  // Convert favicon.png to favicon.ico
  const faviconPng = path.join(publicDir, "favicon.png");
  const faviconIco = path.join(publicDir, "favicon.ico");
  const faviconBuffer = fs.readFileSync(faviconPng);
  const icoBuffer = await toIco([faviconBuffer], { sizes: [32] });
  fs.writeFileSync(faviconIco, icoBuffer);
  console.log("Created favicon.ico");

  console.log("Done!");
}

renderLogo().catch(console.error);
