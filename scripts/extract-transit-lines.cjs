const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/clinics.geojson'), 'utf8'));
const subway = new Set();
const bus = new Set();

data.features.forEach(f => {
  // Subway: extract line letters before 'at'
  if (f.properties.transit) {
    f.properties.transit.split(',').forEach(t => {
      const match = t.trim().match(/^([A-Z0-9\/]+)\s+at/i);
      if (match) {
        match[1].split('/').forEach(line => subway.add(line.toUpperCase()));
      }
    });
  }

  // Bus: extract route name
  if (f.properties.bus) {
    f.properties.bus.split(',').forEach(b => {
      const clean = b.trim().split(' at ')[0].split('...')[0].trim();
      if (clean && /^[A-Z]+[0-9]+/i.test(clean)) {
        bus.add(clean.toUpperCase());
      }
    });
  }
});

// Sort subway: numbers first, then letters
const subwayArr = Array.from(subway).sort((a, b) => {
  const aNum = parseInt(a), bNum = parseInt(b);
  const aIsNum = !isNaN(aNum), bIsNum = !isNaN(bNum);
  if (aIsNum && bIsNum) return aNum - bNum;
  if (aIsNum) return -1;
  if (bIsNum) return 1;
  return a.localeCompare(b);
});

// Sort bus: by prefix then number
const busArr = Array.from(bus).sort((a, b) => {
  const prefixA = a.match(/^[A-Z]+/)[0];
  const prefixB = b.match(/^[A-Z]+/)[0];
  if (prefixA !== prefixB) return prefixA.localeCompare(prefixB);
  const numA = parseInt(a.match(/[0-9]+/)[0]);
  const numB = parseInt(b.match(/[0-9]+/)[0]);
  return numA - numB;
});

console.log('SUBWAY LINES (' + subwayArr.length + '):');
console.log(subwayArr.join(', '));
console.log('\nBUS ROUTES (' + busArr.length + '):');
console.log(busArr.join(', '));

// Output as JSON for use in app
const output = {
  subwayLines: subwayArr,
  busRoutes: busArr
};
fs.writeFileSync(path.join(__dirname, '../src/data/transitLines.json'), JSON.stringify(output, null, 2));
console.log('\nWrote to src/data/transitLines.json');
