import fs from 'fs';
import { chromium } from 'playwright';

async function validate() {
  const geojson = JSON.parse(fs.readFileSync('public/clinics.geojson', 'utf8'));
  const clinics = geojson.features.filter(f => f.properties.website && !f.properties.is_virtual);
  
  console.log(`Validating ${clinics.length} clinics with websites...`);
  
  const browser = await chromium.launch();
  const discrepancies = [];

  // Limit concurrency to avoid getting blocked? Or just serial. Serial is safer for now.
  for (const clinic of clinics) {
    const p = clinic.properties;
    console.log(`Checking ${p.name}...`);
    
    try {
      const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' });
      const page = await context.newPage();
      
      // Short timeout to skip slow sites
      await page.goto(p.website, { timeout: 10000, waitUntil: 'domcontentloaded' }).catch(e => console.log(`  Timeout/Load error for ${p.website}: ${e.message}`));
      
      const text = await page.innerText('body').catch(() => "");
      
      const issues = [];

      // 1. Validate Phone
      // Simple check: does the last 4 digits exist nearby the area code?
      // Normalize our phone: remove non-digits
      const myPhone = p.phone.replace(/\D/g, ''); 
      if (myPhone.length >= 10) {
          // Normalize page text to just digits to search
          const pageDigits = text.replace(/\D/g, '');
          if (!pageDigits.includes(myPhone)) {
             // Try searching formatted? (212) 555-1234
             if (!text.includes(p.phone)) {
                 issues.push(`Phone mismatch: Site doesn't contain ${p.phone}`);
             }
          }
      }

      // 2. Validate Address (Fuzzy)
      // Check for street number and name
      if (p.address) {
          const streetNum = p.address.split(' ')[0];
          if (!text.includes(streetNum)) {
               // Address might be formatted differently, but number usually matches
               issues.push(`Address mismatch: Site might not list number ${streetNum} (${p.address})`);
          }
      }

      // 3. Validate Services (Keywords)
      const textLower = text.toLowerCase();
      if (p.has_abortion && !/abortion|termination|pregnancy/i.test(textLower)) {
        issues.push("Service mismatch: Listed as Abortion provider but keywords not found on home/landing page.");
      }
      if (p.has_prep && !/prep|pre-exposure/i.test(textLower)) {
        issues.push("Service mismatch: Listed as PrEP provider but 'PrEP' keyword not found on home/landing page.");
      }

      if (issues.length > 0) {
        discrepancies.push({
          name: p.name,
          url: p.website,
          issues
        });
      }
      
      await context.close();
    } catch (err) {
      console.error(`  Critical error checking ${p.name}: ${err.message}`);
      // Don't fail the whole script
    }
  }

  await browser.close();

  // Write Report
  let report = "# Website Validation Discrepancies\n\n";
  report += `Scanned ${clinics.length} clinics. Found potential issues in ${discrepancies.length}.\n\n`;
  
  discrepancies.forEach(d => {
    report += `### ${d.name}\n`;
    report += `**URL:** ${d.url}\n`;
    d.issues.forEach(i => report += `- ⚠️ ${i}\n`);
    report += "\n";
  });

  fs.writeFileSync('docs/DATA_DISCREPANCIES.md', report);
  console.log("Report generated at docs/DATA_DISCREPANCIES.md");
}

validate();
