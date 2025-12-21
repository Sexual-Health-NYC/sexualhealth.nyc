// Check WCAG contrast ratios for theme colors
// WCAG AA requires 4.5:1 for normal text, 3:1 for large text (18px+ or 14px+ bold)

const theme = {
  colors: {
    primary: "#7b2cbf",
    stiTesting: "#7b2cbf",
    prep: "#0096c7",
    pep: "#e63946",
    contraception: "#06a77d",
    abortion: "#ff6b6b",
    lgbtq: "#ff006e",
    textPrimary: "#212529",
    textSecondary: "#5a6570",
    background: "#ffffff",
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

// Check service pill colors (white text on colored backgrounds)
console.log("=== Service Pills (white text on colored background) ===");
console.log(
  "WCAG AA: 4.5:1 normal, 3:1 large (our pills use 14px medium weight)",
);
console.log();

const servicePills = [
  { name: "STI Testing", color: theme.colors.stiTesting },
  { name: "HIV Testing", color: theme.colors.primary },
  { name: "PrEP", color: theme.colors.prep },
  { name: "PEP", color: theme.colors.pep },
  { name: "Contraception", color: theme.colors.contraception },
  { name: "Abortion", color: theme.colors.abortion },
  { name: "LGBTQ", color: theme.colors.lgbtq },
];

servicePills.forEach(({ name, color }) => {
  const ratio = contrastRatio(color, "#ffffff");
  const passAA = ratio >= 4.5;
  const passAALarge = ratio >= 3;
  const status = passAA
    ? "✓ PASS AA"
    : passAALarge
      ? "⚠ PASS AA Large only"
      : "✗ FAIL";
  console.log(`${name.padEnd(20)} ${color}  ${ratio.toFixed(2)}:1  ${status}`);
});

console.log();
console.log("=== Text Colors on White Background ===");
console.log();

const textColors = [
  { name: "Primary Text", color: theme.colors.textPrimary },
  { name: "Secondary Text", color: theme.colors.textSecondary },
];

textColors.forEach(({ name, color }) => {
  const ratio = contrastRatio(color, theme.colors.background);
  const passAA = ratio >= 4.5;
  const status = passAA ? "✓ PASS AA" : "✗ FAIL";
  console.log(`${name.padEnd(20)} ${color}  ${ratio.toFixed(2)}:1  ${status}`);
});
