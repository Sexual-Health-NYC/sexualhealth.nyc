const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function renderLogo() {
  const browser = await chromium.launch();
  const publicDir = path.join(__dirname, "../public");

  // Logo sizes to generate
  const logoSizes = [
    { name: "logo-192.png", size: 192 },
    { name: "logo-512.png", size: 512 },
    { name: "logo.png", size: 280 },
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

  await browser.close();
  console.log("Done!");
}

renderLogo().catch(console.error);
