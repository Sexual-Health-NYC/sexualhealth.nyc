# Claude's TODO List for Sexual Health NYC

## Recently Completed ✅

1. **Cleaned Airtable Data (Dec 20, 2024)**
   - Deleted 113 records with bad addresses (org names instead of street addresses)
   - Reduced from 156 → 43 clean records
   - Cleared 8 phone fields containing email addresses
   - Scripts created: `scripts/clean-bad-addresses.js`, `scripts/fix-emails-in-phone.js`

## High Priority - Data Collection 🔥

### 1. Find Real Addresses for Deleted Clinics

113 clinics were deleted because they had organization names instead of street addresses. Many of these are real clinics that need to be re-added with proper addresses.

**Examples of clinics that need addresses:**
- APICHA Community Health Center (found: 400 Broadway, New York, NY 10013)
- Callen-Lorde Community Health Center (found: 356 West 18th Street, New York, NY 10011)
- The Institute for Family Health (MOVED in 2017 - now at 230 West 17th Street, NY 10011)
- Planned Parenthood locations (found 3: Queens, Brooklyn, Bronx)
- Community Healthcare Network (multiple locations - need individual addresses)
- Caribbean Women's Health Association
- Many more...

**Action:**
- Check PLAN.md for listed data sources
- Search for clinic websites to find current addresses
- Use NYC Open Data, health dept directories
- Re-add clinics with verified street addresses to Airtable

### 2. Verify Remaining 43 Clinics Are Current

Check that all 43 remaining clinics:
- Are still open (not closed like Planned Parenthood 26 Bleecker - closed Oct 2025)
- Have correct, complete addresses with city, state, zip
- Have phone numbers (many DOH clinics missing - they share: 347-396-7959)

**Known Issues:**
- Mobilization for Justice is NOT a health clinic (legal services) - DELETE
- Institute for Family Health 16 East 16th - CLOSED 2017 - UPDATE or DELETE
- Planned Parenthood 26 Bleecker - CLOSED Oct 2025 - DELETE

### 3. Add Languages Offered

Research and add language support for each clinic. Common NYC languages:
- Spanish (most common)
- Chinese (Mandarin/Cantonese)
- Haitian Creole
- Russian
- Bengali
- Arabic
- Korean

**Sources:**
- Clinic websites
- Call clinics directly
- NYC Health Dept has multilingual services info
- DOH clinics offer interpretation services

### 4. Add Abortion Pricing Data

For clinics offering abortion services, add:
- Medication abortion cost
- Surgical abortion cost
- Gestational limit for each type
- Insurance accepted (Medicaid especially important)

**Known pricing (Planned Parenthood NYC):**
- Medication abortion: ~$600
- Surgical abortion: $600-$750 (varies by weeks)
- Medicaid covers abortion in NY

**Action:**
- Call clinics for current pricing
- Check clinic websites
- Note which accept Medicaid/sliding scale

## Medium Priority - Data Quality 📊

### 5. Geocode All Addresses

Once real addresses are added:
- Use NYC Planning Labs GeoSearch API to geocode
- Get lat/long coordinates
- Get BBL (Borough-Block-Lot) for deduplication
- Script already exists: `pipeline/geocoder.py`

### 6. Deduplicate by BBL

After geocoding:
- Group records by BBL (same building = same clinic)
- Merge duplicate records
- Keep record with most complete data
- See `docs/AIRTABLE_DATA_CLEANUP.md` for strategy

### 7. Add Missing Service Data

Many clinics missing:
- Contraception services
- Gender-affirming care
- Vaccines
- Hours of operation
- Walk-in vs appointment only
- Youth-friendly designation
- LGBTQ-focused designation

## Low Priority - Infrastructure 🔧

### 8. Add Data Sources Documentation

For each clinic record, track:
- Where data came from (NYC Open Data, website, phone call, etc.)
- When last verified
- Who verified it

### 9. Create Automated Phone Number Lookup

Script to:
- Search Google for clinic phone numbers
- Parse results
- Suggest phone numbers for review

### 10. Add Transit Information

For each clinic:
- Nearest subway station(s)
- Nearest bus routes
- Accessibility info

## Data Sources to Check (from PLAN.md)

1. **NYC Open Data** ✅ (already used)
   - HIV Testing Locations
   - DOH Sexual Health Clinics

2. **Planned Parenthood** ⚠️ (need to re-add current locations)
   - 3 current NYC locations: Queens, Brooklyn, Bronx
   - Old Manhattan location CLOSED Oct 2025

3. **NYC Health Department**
   - Sexual health clinics page
   - Call 347-396-7959 for all DOH clinics

4. **Major Health Networks** (need to research)
   - Callen-Lorde (LGBTQ+ focused)
   - APICHA (AAPI/LGBTQ+ focused)
   - Institute for Family Health
   - Community Healthcare Network
   - Mount Sinai
   - NYU Langone
   - NYC Health + Hospitals

5. **Community Organizations**
   - Caribbean Women's Health Association
   - Destination Tomorrow (Bronx LGBTQ center)
   - GMHC
   - BOOM!Health

## Scripts Created

- `scripts/clean-bad-addresses.js` - Delete records with org names as addresses
- `scripts/fix-emails-in-phone.js` - Clear email addresses from phone fields
- `scripts/fetch-airtable.js` - Pull data from Airtable to create GeoJSON
- `pipeline/geocoder.py` - Geocode addresses using NYC GeoSearch API
- `pipeline/update_clinics.py` - (started but not finished)

## Important Notes

- **NEVER edit `public/clinics.geojson` directly!** It's auto-generated from Airtable
- Run `node scripts/fetch-airtable.js` after updating Airtable to regenerate GeoJSON
- Airtable is source of truth: Base ID `app2GMlVxnjw6ifzz`, Table ID `tblx7sVpDo17Hkmmr`
- Token stored in `.env` as `AIRTABLE_TOKEN`

## Next Session Action Items

1. **IMMEDIATE:** Verify/fix the 43 remaining clinics (remove Mobilization for Justice, closed PP, closed Institute)
2. Research and re-add major clinics with proper addresses (Callen-Lorde, APICHA, PP locations, etc.)
3. Add phone numbers to DOH clinics (347-396-7959)
4. Start adding languages and abortion pricing data
5. Geocode everything once addresses are clean
