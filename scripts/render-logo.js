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
  const horizontalLogoSvg = `
    <svg width="280" height="60" viewBox="0 0 280 60" xmlns="http://www.w3.org/2000/svg">
      <!-- Shield icon on left -->
      <g transform="translate(5, 5)">
        <path d="M25 2 L48 10 L48 30 C48 40, 25 48, 25 48 C25 48, 2 40, 2 30 L2 10 Z" fill="#7b2cbf" stroke="#ffffff" stroke-width="1.5"/>
        <line x1="15" y1="15" x2="15" y2="35" stroke="#e63946" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="18" y1="15" x2="32" y2="35" stroke="#0096c7" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="12" y1="25" x2="38" y2="25" stroke="#9d4edd" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="32" y1="15" x2="18" y2="35" stroke="#ffd60a" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="35" y1="15" x2="35" y2="35" stroke="#06a77d" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="25" cy="25" r="6.5" fill="none" stroke="#ffffff" stroke-width="1.8"/>
      </g>
      <!-- Text -->
      <text x="65" y="40" font-family="Montserrat" font-size="24" font-weight="700" fill="#7b2cbf">sexualhealth.nyc</text>
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
