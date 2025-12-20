// Generate accessible color pairs for service pills
// Strategy: lighter background with darker text for better contrast

const theme = {
  colors: {
    primary: "#7b2cbf",
    stiTesting: "#7b2cbf",
    prep: "#0096c7",
    pep: "#e63946",
    contraception: "#06a77d",
    abortion: "#ff6b6b",
    lgbtq: "#ff006e",
  },
};

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Convert RGB to hex
function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

// Calculate relative luminance
function luminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function contrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Darken a color
function darken(hex, amount) {
  const rgb = hexToRgb(hex);
  return rgbToHex(
    rgb.r * (1 - amount),
    rgb.g * (1 - amount),
    rgb.b * (1 - amount),
  );
}

// Lighten a color
function lighten(hex, amount) {
  const rgb = hexToRgb(hex);
  return rgbToHex(
    rgb.r + (255 - rgb.r) * amount,
    rgb.g + (255 - rgb.g) * amount,
    rgb.b + (255 - rgb.b) * amount,
  );
}

console.log("=== Accessible Service Pill Colors ===");
console.log(
  "Strategy: Light background with dark text (needs 4.5:1 for 14px text)",
);
console.log();

const services = [
  { name: "STI Testing", baseColor: theme.colors.stiTesting },
  { name: "HIV Testing", baseColor: theme.colors.primary },
  { name: "PrEP", baseColor: theme.colors.prep },
  { name: "PEP", baseColor: theme.colors.pep },
  { name: "Contraception", baseColor: theme.colors.contraception },
  { name: "Abortion", baseColor: theme.colors.abortion },
  { name: "LGBTQ", baseColor: theme.colors.lgbtq },
];

const results = [];

services.forEach(({ name, baseColor }) => {
  // Try darkening for text, lightening for background
  let textColor = darken(baseColor, 0.3);
  let bgColor = lighten(baseColor, 0.85);

  // Adjust until we get 4.5:1 contrast
  let ratio = contrastRatio(textColor, bgColor);
  let iterations = 0;

  while (ratio < 4.5 && iterations < 50) {
    if (ratio < 4.5) {
      // Need more contrast - darken text more
      textColor = darken(baseColor, 0.3 + iterations * 0.02);
    }
    ratio = contrastRatio(textColor, bgColor);
    iterations++;
  }

  const passAA = ratio >= 4.5;
  const status = passAA ? "✓ PASS AA" : "✗ FAIL";

  results.push({ name, textColor, bgColor, ratio });

  console.log(name);
  console.log(`  Background: ${bgColor}`);
  console.log(`  Text:       ${textColor}`);
  console.log(`  Contrast:   ${ratio.toFixed(2)}:1  ${status}`);
  console.log();
});

console.log("=== Updated theme.js colors ===");
console.log();
console.log("Service pill backgrounds (use with dark text):");
results.forEach(({ name, bgColor }) => {
  const key = name
    .toLowerCase()
    .replace(/ /g, "")
    .replace("stitesting", "stiTestingBg")
    .replace("hivtesting", "hivTestingBg")
    .replace("prep", "prepBg")
    .replace("pep", "pepBg")
    .replace("contraception", "contraceptionBg")
    .replace("abortion", "abortionBg")
    .replace("lgbtq", "lgbtqBg");
  console.log(`  ${key}: "${bgColor}",`);
});
console.log();
console.log("Service pill text colors:");
results.forEach(({ name, textColor }) => {
  const key = name
    .toLowerCase()
    .replace(/ /g, "")
    .replace("stitesting", "stiTestingText")
    .replace("hivtesting", "hivTestingText")
    .replace("prep", "prepText")
    .replace("pep", "pepText")
    .replace("contraception", "contraceptionText")
    .replace("abortion", "abortionText")
    .replace("lgbtq", "lgbtqText");
  console.log(`  ${key}: "${textColor}",`);
});
