const fs = require('fs');
const path = require('path');

const geojson = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/clinics.geojson'), 'utf-8'));

const missingHours = [];
const needsMedicaid = [];

for (const f of geojson.features) {
  const p = f.properties;
  const hours = p.hours || [];
  const phone = p.phone || 'No phone';
  const website = p.website || '';
  const borough = p.borough || '';
  const name = p.name || '';

  const hasHours = hours && hours.length > 0;
  const acceptsMedicaid = p.accepts_medicaid || false;
  const hasMcoData = p.medicaid_mcos && p.medicaid_mcos.length > 0;

  const entry = {
    name,
    phone,
    website,
    borough,
    missingHours: !hasHours,
    needsMedicaid: acceptsMedicaid && !hasMcoData
  };

  if (!hasHours) {
    missingHours.push(entry);
  } else if (acceptsMedicaid && !hasMcoData) {
    needsMedicaid.push(entry);
  }
}

// Sort by borough then name
missingHours.sort((a, b) => (a.borough + a.name).localeCompare(b.borough + b.name));
needsMedicaid.sort((a, b) => (a.borough + a.name).localeCompare(b.borough + b.name));

// Generate markdown
let md = `# Volunteer Call List

Clinics sorted by priority, then borough.

## Priority 1: Missing Hours (${missingHours.length} clinics)

These clinics have no hours data at all.

`;

for (const c of missingHours) {
  md += `### ${c.name}\n`;
  md += `- **Phone:** ${c.phone}\n`;
  if (c.website) md += `- **Website:** ${c.website}\n`;
  md += `- **Borough:** ${c.borough}\n`;
  md += `- **Needs:** Hours${c.needsMedicaid ? ', Medicaid MCOs' : ''}\n\n`;
}

md += `---

## Priority 2: Needs Medicaid Plan Details (${needsMedicaid.length} clinics)

These clinics accept Medicaid but we don't know which specific plans.

`;

let currentBorough = null;
for (const c of needsMedicaid) {
  if (c.borough !== currentBorough) {
    currentBorough = c.borough;
    md += `### ${currentBorough}\n\n`;
  }

  md += `**${c.name}**\n`;
  md += `- Phone: ${c.phone}\n`;
  if (c.website) md += `- Website: ${c.website}\n`;
  md += '\n';
}

fs.writeFileSync(path.join(__dirname, '../docs/VOLUNTEER_CALL_LIST.md'), md);
console.log('Generated VOLUNTEER_CALL_LIST.md');
console.log(`  Missing hours: ${missingHours.length}`);
console.log(`  Needs Medicaid MCOs: ${needsMedicaid.length}`);
