const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../public/clinics.geojson");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

console.log("Data Validation Report\n");
console.log("=".repeat(60));

let issues = {
  incompleteAddresses: [],
  emailsInPhone: [],
  missingPhone: [],
  missingWebsite: [],
  missingBorough: [],
};

data.features.forEach((feature, index) => {
  const props = feature.properties;
  const name = props.name;

  // Check for incomplete addresses (missing city, state, zip)
  if (
    props.address &&
    !props.address.includes("NY") &&
    !props.address.includes("New York")
  ) {
    issues.incompleteAddresses.push({
      name,
      address: props.address,
    });
  }

  // Check for emails in phone field
  if (props.phone && props.phone.includes("@")) {
    issues.emailsInPhone.push({
      name,
      phone: props.phone,
    });
  }

  // Check for missing critical fields
  if (!props.phone || props.phone === "") {
    issues.missingPhone.push(name);
  }

  if (!props.website || props.website === "") {
    issues.missingWebsite.push(name);
  }

  if (!props.borough || props.borough === "") {
    issues.missingBorough.push(name);
  }
});

// Print results
console.log(`\n📍 INCOMPLETE ADDRESSES (${issues.incompleteAddresses.length})`);
console.log("Missing city/state/zip - won't work well in map apps:\n");
issues.incompleteAddresses.slice(0, 10).forEach(({ name, address }) => {
  console.log(`  ❌ ${name}`);
  console.log(`     ${address}\n`);
});
if (issues.incompleteAddresses.length > 10) {
  console.log(`  ... and ${issues.incompleteAddresses.length - 10} more\n`);
}

console.log(`\n📧 EMAILS IN PHONE FIELD (${issues.emailsInPhone.length})`);
console.log("Privacy risk - will spam these people:\n");
issues.emailsInPhone.forEach(({ name, phone }) => {
  console.log(`  ❌ ${name}`);
  console.log(`     ${phone}\n`);
});

console.log(`\n📞 MISSING PHONE (${issues.missingPhone.length})`);
console.log(
  `Clinics without phone numbers: ${issues.missingPhone.slice(0, 5).join(", ")}${issues.missingPhone.length > 5 ? ", ..." : ""}\n`,
);

console.log(`\n🌐 MISSING WEBSITE (${issues.missingWebsite.length})`);
console.log(
  `Clinics without websites: ${issues.missingWebsite.slice(0, 5).join(", ")}${issues.missingWebsite.length > 5 ? ", ..." : ""}\n`,
);

console.log(`\n🗺️  MISSING BOROUGH (${issues.missingBorough.length})`);
if (issues.missingBorough.length > 0) {
  console.log(`Clinics without borough: ${issues.missingBorough.join(", ")}\n`);
}

console.log("\n" + "=".repeat(60));
console.log(`\nTotal clinics: ${data.features.length}`);
console.log(
  `Issues found: ${issues.incompleteAddresses.length + issues.emailsInPhone.length + issues.missingPhone.length + issues.missingWebsite.length + issues.missingBorough.length}`,
);
console.log("\n");
