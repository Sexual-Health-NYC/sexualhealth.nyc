# Data Research Prompt for Sexual Health NYC Clinic Finder

## Project Context

We're building sexualhealth.nyc - a comprehensive, free clinic finder for sexual health services in New York City. The goal is to help people find clinics offering STI testing, HIV testing, PrEP, PEP, contraception, abortion, and gender-affirming care.

We need to populate a database with detailed, accurate, up-to-date information for every sexual health clinic in NYC's five boroughs (Manhattan, Brooklyn, Queens, Bronx, Staten Island).

---

## Your Task

Research and compile detailed information for sexual health clinics in NYC. For each clinic, provide:

1. **All data fields** listed in the schema below
2. **Source URL** for each piece of information
3. **Last verified date** (when you confirmed the info)
4. **Confidence level** (high/medium/low based on source reliability)

Additionally, identify:

- **APIs or open data sources** we can programmatically fetch from
- **Websites with structured data** we can scrape
- **Organizations** that maintain clinic directories

---

## Full Data Schema

### Core Information (Required)

| Field       | Type   | Description                                       | Example                                |
| ----------- | ------ | ------------------------------------------------- | -------------------------------------- |
| Clinic Name | text   | Official name                                     | "Callen-Lorde Community Health Center" |
| Address     | text   | Full street address with ZIP                      | "356 W 18th St, New York, NY 10011"    |
| Borough     | enum   | Manhattan, Brooklyn, Queens, Bronx, Staten Island | "Manhattan"                            |
| Phone       | phone  | Primary phone number                              | "(212) 271-7200"                       |
| Website     | URL    | Official website                                  | "https://callen-lorde.org"             |
| Latitude    | number | WGS84 coordinate                                  | 40.7421                                |
| Longitude   | number | WGS84 coordinate                                  | -74.0018                               |

### Organization & Type

| Field        | Type | Description                       | Options                                                                                                                                                                  |
| ------------ | ---- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Organization | enum | Parent organization if multi-site | Planned Parenthood, Callen-Lorde, NYC Health Dept (DOH), Community Healthcare Network, GMHC, NYC Health + Hospitals, Mount Sinai, NYU Langone, Northwell Health, [other] |
| Clinic Type  | enum | Type of facility                  | DOH, Planned Parenthood, FQHC, LGBTQ+ Center, Hospital, Private                                                                                                          |

### Services Offered (checkboxes)

| Field                 | Description                            |
| --------------------- | -------------------------------------- |
| STI Testing           | Offers STI/STD testing                 |
| HIV Testing           | Offers HIV testing                     |
| PrEP                  | Offers PrEP (pre-exposure prophylaxis) |
| PEP                   | Offers PEP (post-exposure prophylaxis) |
| Contraception         | Offers birth control services          |
| Abortion              | Offers abortion services               |
| Gender-Affirming Care | Offers hormone therapy, etc.           |
| Vaccines              | Offers HPV, Hepatitis vaccines         |

### Service Subtypes (checkboxes)

| Field                        | Description                                                      |
| ---------------------------- | ---------------------------------------------------------------- |
| Medication Abortion          | Offers abortion pill (mifepristone/misoprostol)                  |
| In-Clinic Abortion           | Offers surgical/procedural abortion                              |
| Abortion: Medication (limit) | Gestation limit for medication abortion (e.g., "Up to 12 weeks") |
| Abortion: Procedure (limit)  | Gestation limit for procedure (e.g., "Up to 24 weeks")           |
| IUD Insertion                | Offers IUD insertion                                             |
| IUD Removal                  | Offers IUD removal                                               |
| Implant (Nexplanon)          | Offers arm implant                                               |
| Depo-Provera Shot            | Offers birth control shot                                        |
| Emergency Contraception      | Offers Plan B / morning after pill                               |
| PrEP Consultation            | Offers PrEP consultation/prescription                            |
| PEP Consultation             | Offers PEP consultation                                          |
| HIV Rapid Test               | Offers rapid HIV testing                                         |
| Full STI Panel               | Offers comprehensive STI testing                                 |
| HPV Vaccine                  | Offers HPV vaccination                                           |
| Hepatitis Vaccine            | Offers Hepatitis A/B vaccination                                 |
| HRT (Hormone Therapy)        | Offers hormone replacement therapy                               |
| Pap Smear                    | Offers cervical cancer screening                                 |
| Pregnancy Test               | Offers pregnancy testing                                         |

### Insurance & Payment

| Field                    | Type         | Description                              |
| ------------------------ | ------------ | ---------------------------------------- |
| Accepts Medicaid         | checkbox     | Accepts Medicaid                         |
| Accepts Medicare         | checkbox     | Accepts Medicare                         |
| Sliding Scale            | checkbox     | Offers sliding scale pricing             |
| No Insurance OK          | checkbox     | Can be seen without insurance            |
| NYS Emergency Medicaid   | checkbox     | Accepts NYS Emergency Medicaid           |
| Insurance Plans Accepted | multi-select | Specific plans (see list below)          |
| Medicaid MCOs            | multi-select | Specific Medicaid managed care orgs      |
| Abortion Price Range     | text         | e.g., "$600-$1500"                       |
| STI Testing Price        | text         | e.g., "$0-$250" or "Free with insurance" |
| Sliding Scale Details    | text         | Income requirements, discount details    |

**Insurance Plans (45 options):**
1199, Aetna Commercial, Aetna Medicare, BCBS EPO, BCBS Empire PPO, BCBS HMO, BCBS Local, BCBS PPO, BCBS Northeastern NY/Highmark, CDPHP, Cigna, Emblem Health CHP, Emblem Health CMO, Emblem Health Commercial, Emblem Health Essential, Emblem Health HIP, Emblem Health HMO, Excellus BCBS, Fidelis Care CHP, Fidelis Care Essential, Fidelis Care HARP, Fidelis Care Medicaid, Fidelis Care Medicare, Fidelis Care QHP, Medicaid, Medicaid Family Planning, Medicaid for Pregnant Women, Medicare, Molina, MultiPlan First Health, MultiPlan PHCS, MultiPlan POMCO, MVP Commercial, MVP Medicare, MagnaCare, Tricare, UHC Choice Plus, UHC Commercial, UHC Empire Plan, UHC Medicaid, UHC Medicare, UHC Oxford, Wellcare CHP, Wellcare Essential, Wellcare MMC

**Medicaid MCOs:**
Healthfirst, MetroPlus, Fidelis Care, Amerigroup, Affinity/Molina, Empire BCBS HealthPlus, WellCare, UnitedHealthcare, VNS Health, Amida Care

### Access & Availability

| Field            | Type     | Description                |
| ---------------- | -------- | -------------------------- |
| Walk-ins OK      | checkbox | Accepts walk-in patients   |
| Appointment Only | checkbox | Requires appointment       |
| Hours            | text     | Operating hours (detailed) |
| Languages        | text     | Languages spoken           |

### Special Populations

| Field             | Type     | Description                                      |
| ----------------- | -------- | ------------------------------------------------ |
| LGBTQ+ Focused    | checkbox | Specializes in LGBTQ+ care                       |
| Youth Friendly    | checkbox | Serves minors without parental consent           |
| Anonymous Testing | checkbox | Offers anonymous (not just confidential) testing |

### Transit (calculate or research)

| Field          | Type | Description                       |
| -------------- | ---- | --------------------------------- |
| Nearest Subway | text | e.g., "A/C/E at 14th St (0.2 mi)" |
| Nearest Bus    | text | e.g., "M14A, M14D (0.1 mi)"       |

### Metadata

| Field         | Type | Description                            |
| ------------- | ---- | -------------------------------------- |
| Last Verified | date | When info was last confirmed           |
| Verified By   | enum | Phone call, Website, Government data   |
| Data Sources  | text | URLs or source names                   |
| Notes         | text | Special info, temporary closures, etc. |

---

## Priority Clinics to Research

### Tier 1: Major Providers (multi-location)

1. **Planned Parenthood of Greater New York** - All NYC locations

   - Note: Manhattan Health Center (Margaret Sanger) closed Oct 2024
   - Current locations in Brooklyn, Queens, Bronx, Staten Island

2. **Callen-Lorde Community Health Center** - All locations

   - Main: 356 W 18th St, Manhattan
   - Other sites in Chelsea, Bronx

3. **NYC Health Department Sexual Health Clinics (DOH)** - All 8 locations

   - Morrisania (Bronx), Jamaica (Queens), Fort Greene (Brooklyn), Corona (Queens), Chelsea (Manhattan), Riverside (Manhattan), Central Harlem (Manhattan), STI Express (Manhattan)

4. **NYC Health + Hospitals** - Sexual health services at public hospitals

   - Bellevue, Elmhurst, Jacobi, Kings County, Lincoln, Metropolitan, Woodhull, etc.

5. **Community Healthcare Network** - ~14 locations

6. **GMHC** - HIV/AIDS services

### Tier 2: Specialized Providers

7. **Abortion-specific clinics** (independent providers)

   - Parkmed NYC, All Women's Medical, etc.

8. **LGBTQ+ focused clinics**

   - Apicha Community Health Center
   - GMHC
   - Housing Works

9. **Youth-focused clinics**

   - The Door
   - Mount Sinai Adolescent Health Center

10. **Federally Qualified Health Centers (FQHCs)** offering sexual health

---

## Known Data Sources to Investigate

### Government/Official

1. **NYC Open Data** (data.cityofnewyork.us)

   - Dataset `72ss-25qh`: HIV Testing Locations
   - Dataset `pwts-g83w`: DOHMH HIV Service Directory
   - Look for other relevant datasets

2. **NYS Health Department**

   - health.ny.gov - Provider directories
   - Medicaid provider lookup

3. **HRSA Data Warehouse** (data.hrsa.gov)

   - Federally Qualified Health Centers
   - Ryan White HIV/AIDS Program providers

4. **CDC/HIV.gov**
   - HIV testing site locator
   - PrEP provider locator

### Provider Directories

5. **Planned Parenthood Health Center Finder**

   - plannedparenthood.org/health-center

6. **National Abortion Federation**

   - prochoice.org/patients/find-a-provider/

7. **ineedana.com** - Abortion clinic finder

8. **PrEP Locator** (preplocator.org)

9. **GetTested** (gettested.cdc.gov) - STD testing locator

### Insurance Directories

10. **NY State of Health** marketplace provider directories
11. **Medicaid MCO directories** (Healthfirst, MetroPlus, Fidelis, etc.)

---

## Output Format

For each clinic, provide data in this format:

```
### [Clinic Name]

**Core Info:**
- Address: [full address]
- Borough: [borough]
- Phone: [phone]
- Website: [URL]
- Coordinates: [lat, lng]

**Organization:** [if applicable]
**Clinic Type:** [type]

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [ ] PrEP
- ... (check all that apply)

**Insurance:**
- Accepts Medicaid: Yes/No
- Accepts Medicare: Yes/No
- Sliding Scale: Yes/No
- No Insurance OK: Yes/No
- Specific plans: [list]

**Access:**
- Walk-ins: Yes/No
- Hours: [detailed hours]
- Languages: [list]

**Special:**
- LGBTQ+ Focused: Yes/No
- Youth Friendly: Yes/No

**Sources:**
1. [URL] - [what info came from here] - [date accessed]
2. [URL] - [what info came from here] - [date accessed]

**Confidence:** High/Medium/Low
**Notes:** [any special notes]
```

---

## API/Scraping Opportunities

Also identify and document:

1. **Official APIs** we can query programmatically

   - Endpoint URL
   - Authentication requirements
   - Rate limits
   - Data format

2. **Scrapable websites** with structured data

   - URL pattern
   - Data structure (HTML classes, JSON-LD, etc.)
   - Update frequency
   - Terms of service considerations

3. **Downloadable datasets**
   - Direct download URLs
   - Format (CSV, JSON, GeoJSON)
   - Update schedule

---

## Quality Standards

- **Verify against primary sources** (clinic's own website, official directories)
- **Cross-reference multiple sources** when possible
- **Flag outdated info** (anything older than 6 months)
- **Note discrepancies** between sources
- **Prioritize official sources** over aggregators

---

## Deliverables

1. **Clinic data** for 50-100+ clinics in the format above
2. **Source documentation** with URLs and access dates
3. **API/scraping guide** for automated data collection
4. **Data gaps report** - what info is hard to find
5. **Recommendations** for ongoing data maintenance
