# Source Scraping: Build the Superset

## Goal

Scrape all primary source directories/PDFs that Gemini referenced but couldn't access, plus competitor abortion finders. Ensure we have a superset of:

1. All clinics they list
2. All attributes/services they track that we don't

## Sources to Scrape

### Abortion Finders (Competitor Analysis)

- [ ] **AbortionFinder.org**
  - NYC providers: https://www.abortionfinder.org/abortion-guides-by-state/abortion-in-new-york/providers
  - State guide: https://www.abortionfinder.org/abortion-guides-by-state/abortion-in-new-york
  - Has: gestational limits, telehealth options, financial aid info

- [ ] **INeedAnA.com**
  - NYC clinics: https://www.ineedana.com/us/new-york/new-york
  - Has: gestational limits per clinic, medication vs procedural, walk-in availability
  - Example: Metropolitan offers in-clinic up to 22 weeks, pills up to 11 weeks

- [ ] **Planned Parenthood locator**
  - Need to find API or scrape location finder

### Gender-Affirming Care Directories (PDFs - FOUND!)

- [ ] **Amida Care GIST Provider Listings**
  - May 2025 (latest): https://www.amidacareny.org/wp-content/uploads/GIST-Provider-List-English-May-2025.pdf
  - Jan 2025: https://www.amidacareny.org/wp-content/uploads/GIST-Provider-Listing-January-2025-English.pdf
  - Sept 2024: https://www.amidacareny.org/wp-content/uploads/gist-provider-listing-september-2024-english-revised_20241017115310.pdf
  - Electrolysis guide: https://www.amidacareny.org/wp-content/uploads/sites/2/gist-electrolysis-and-laser-hair-removal-guide-2024_2024151516.pdf
  - GIST FAQ: https://www.amidacareny.org/wp-content/uploads/gist-faq-2024-english_2024151517.pdf
  - Contains: CHCs, electrolysis providers, hair transplant surgeons, Medicaid-accepting ancillary services

- [ ] **MetroPlus LGBTQI Resource Guide (2022)**
  - English: https://metroplus.org/wp-content/uploads/2022/08/MKT-22.042_2022-LGBTQI-Resource-Guide-Refresh-2022_web-version.pdf
  - Spanish: https://metroplus.org/wp-content/uploads/2022/08/MKT-22.042s_2022-LGBTQI-Resource-Guide-Refresh-2022_web-version.pdf
  - Contains: Community centers, providers, social services

- [ ] **NYC Comptroller's LGBTQ+ Guide (2025)**
  - PDF: https://comptroller.nyc.gov/wp-content/uploads/documents/LGBTQIA-Guide-2025.pdf
  - Directory: https://comptroller.nyc.gov/lgbtq/
  - Contains: Comprehensive social services, substance abuse, housing, mental health

- [ ] **Erin Reed's Informed Consent HRT Map**
  - Article: https://www.erininthemorning.com/p/erins-informed-consent-hrt-map-how
  - Resources: https://www.erinreedwrites.com/resources
  - Contains: Verified informed consent clinics (no therapist letters for HRT)
  - Note: Google Maps based, may need manual extraction for NYC

### Government/Official Sources

- [ ] **NYC H+H Pride Health Centers**
  - Main page: https://www.nychealthandhospitals.org/services/lgbtq-health-care-services/
  - Individual pages per location (Metropolitan, Bellevue, Woodhull, Lincoln, Jacobi, Gouverneur)
  - Contains: Which facility offers which procedures (surgery, voice coaching, puberty blockers, etc.)

- [ ] **NYS DOH Designated AIDS Centers (DAC) List**
  - Main page: https://www.health.ny.gov/diseases/aids/providers/standards/designated_aids_centers/index.htm
  - Clinic contacts PDF: https://www.health.ny.gov/diseases/aids/providers/testing/docs/dac_clinics.pdf
  - Searchable: https://profiles.health.ny.gov/hospital/designated_center/AIDS+Center
  - Provider directory: https://providerdirectory.aidsinstituteny.org/
  - Contains: 38 AIDS Centers with contact info

- [ ] **DOHMH Sexual Health Clinics**
  - Need to find current list with DoxyPEP, Mpox services

### Academic Medical Centers

- [ ] **Mount Sinai CTMS**
  - URL: mountsinai.org/locations/center-transgender-medicine-surgery
  - Contains: Surgeon bios, specific procedures offered

- [ ] **NYU Langone Transgender Health**
  - URL: nyulangone.org transgender health program
  - Contains: Provider list, adolescent program, surgery verification guide

### Community Health Center Networks

- [ ] **Callen-Lorde** - locations/services page
- [ ] **Apicha CHC** - locations/services page
- [ ] **Institute for Family Health** - locations page
- [ ] **Housing Works Health** - locations page

## Attributes to Extract (Superset)

Beyond what we currently track, look for:

### Abortion-specific

- [ ] Gestational limit (weeks) - INeedAnA has this per clinic
- [ ] Medication vs procedural availability
- [ ] Telehealth abortion available
- [ ] Financial assistance programs
- [ ] Walk-in/same-day availability

### GAC-specific

- [ ] Informed consent HRT (yes/no) - Erin's map
- [ ] Specific procedures: FFS, top surgery, bottom surgery, voice coaching - H+H grid
- [ ] Electrolysis/hair removal accepting Medicaid - Amida GIST
- [ ] Adolescent/youth services (puberty blockers)
- [ ] Letters of support available

### Insurance/Access

- [ ] Specific Medicaid plans accepted (Amida, MetroPlus, Healthfirst)
- [ ] Sliding scale details
- [ ] Ryan White funding
- [ ] ADAP enrollment help

### Social Services (from Comptroller's guide)

- [ ] Housing assistance
- [ ] Legal services
- [ ] Substance abuse treatment
- [ ] Food/meals
- [ ] Youth drop-in services

## Implementation

### Phase 1: Download PDFs ✓ URLs found

```bash
# Create directory
mkdir -p data/source-scrapes

# Download PDFs
curl -o data/source-scrapes/amida-gist-may-2025.pdf "https://www.amidacareny.org/wp-content/uploads/GIST-Provider-List-English-May-2025.pdf"
curl -o data/source-scrapes/amida-electrolysis-2024.pdf "https://www.amidacareny.org/wp-content/uploads/sites/2/gist-electrolysis-and-laser-hair-removal-guide-2024_2024151516.pdf"
curl -o data/source-scrapes/comptroller-lgbtq-2025.pdf "https://comptroller.nyc.gov/wp-content/uploads/documents/LGBTQIA-Guide-2025.pdf"
curl -o data/source-scrapes/metroplus-lgbtqi-2022.pdf "https://metroplus.org/wp-content/uploads/2022/08/MKT-22.042_2022-LGBTQI-Resource-Guide-Refresh-2022_web-version.pdf"
curl -o data/source-scrapes/nys-dac-clinics.pdf "https://www.health.ny.gov/diseases/aids/providers/testing/docs/dac_clinics.pdf"
```

### Phase 2: Parse & Extract

- PDFs: Use pdf-parse or Gemini to extract structured data
- Web pages: Puppeteer/Playwright for JS-rendered content
- INeedAnA/AbortionFinder: Scrape NYC clinic listings

### Phase 3: Cross-Reference

- Match against existing clinics by name + address
- Flag new clinics not in our database
- Flag new attributes we should add to schema

### Phase 4: Gap Report

- Generate: "Clinics in X but not in our data"
- Generate: "Attributes tracked by X that we don't have"

## Output

1. `data/source-scrapes/` directory with raw scraped data
2. `docs/research/SOURCE-GAP-ANALYSIS.md` with findings
3. Airtable import for new clinics (if any)
4. Schema update proposal for new attributes

## Notes

- All PDFs are publicly accessible (no member portal needed!)
- Crowdsourced data (Erin's map) should be treated as "needs verification"
- Competitor sites may have ToS issues - scrape respectfully, cache locally
- INeedAnA appears to use Airtable backend (rec\* IDs in URLs) - may have API
