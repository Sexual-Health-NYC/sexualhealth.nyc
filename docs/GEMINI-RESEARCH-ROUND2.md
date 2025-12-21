# Sexual Health NYC - Research Round 2

## Context

This is a follow-up research request for sexualhealth.nyc. We've completed initial data collection with 61 clinics, but have significant gaps that need to be filled.

**Current Database Status:**

- 61 total clinics
- 46 have coordinates (15 missing)
- 36 have phone numbers (25 missing)
- 36 have hours (25 missing)
- 48 have services marked

---

## Priority 1: Missing NYC Health + Hospitals Locations

We only have 7 of ~11 H+H locations. Research and provide full details for these MISSING hospitals' sexual health / women's health / Pride Health services:

### Missing H+H Facilities:

1. **Kings County Hospital** (Brooklyn) - Women's Health, HIV services
2. **Elmhurst Hospital** (Queens) - Sexual health services
3. **Queens Hospital Center** (Jamaica, Queens) - Women's health
4. **Harlem Hospital** (Manhattan) - Sexual health, Pride services
5. **Coney Island Hospital** (Brooklyn) - Women's health
6. **North Central Bronx Hospital** - Sexual health services

For each, provide:

- Exact department/clinic name for sexual health services
- Address with floor/suite
- Phone number for the specific clinic (not main hospital)
- Hours of operation
- Services offered (STI testing, HIV testing, PrEP, PEP, contraception, abortion referrals)
- Whether they have a Pride Health Center or LGBTQ+ specific services

---

## Priority 2: Missing Abortion Provider

**All Women's Medical of Queens**

- Address: 120-34 Queens Blvd, Suite 420, Kew Gardens, NY 11415
- Need: Phone, hours, services, insurance accepted, gestational limits (reported up to 24 weeks)
- Verify if still operating

---

## Priority 3: Complete Data for Existing Records

### Records Missing Coordinates (need address verification/correction):

1. The Mount Sinai Comprehensive Health – Downtown: 275 7th Ave, New York, NY 10001
2. Queens Abortion Pill: 120-34 Queens Blvd suite 420D, Kew Gardens, NY 11415
3. Early Options: 124 E 40th St #702, New York, NY 10016
4. Professional Gynecological Services: 14 DeKalb Ave 2nd Floor, Brooklyn, NY 11201
5. Maze Women's Sexual Health - NYC: 633 3rd Ave #9b, New York, NY 10017
6. Bellevue Hospital Center OB/GYN: 462 1st Ave, New York, NY 10016
7. NYC Health + Hospitals/Metropolitan: 1901 1st Ave, New York, NY 10029
8. Eastside Gynecology: 635 Madison Ave #1200, New York, NY 10022
9. Planned Parenthood - Queens (Diane L. Max): 21-41 45th Rd, Queens, NY 11101
10. NYC DOH - Fort Greene Express Clinic: 295 Flatbush Ave Ext First Floor, Brooklyn, NY 11201
11. Brooklyn Abortion Clinic: 14 DeKalb Ave 4th Floor, Brooklyn, NY 11201
12. Dr. Emily Women's Health Center: 642 Southern Blvd, Bronx, NY 10455
13. Labtek STD Testing Centers: 41 Elizabeth St, New York, NY 10013
14. Manhattan Sexual Health and Wellness: 215 Lexington Ave, New York, NY 10016

**For each, verify address and provide coordinates (latitude, longitude).**

### Records Missing Phone Numbers:

Need phone numbers for these 25 clinics:

1. The Mount Sinai Comprehensive Health – Downtown
2. Queens Abortion Pill
3. The Institute for Family Health
4. Early Options
5. Professional Gynecological Services
6. Maze Women's Sexual Health - NYC
7. Bellevue Hospital Center OB/GYN
8. NYC Health + Hospitals/Metropolitan
9. Eastside Gynecology
10. NYC DOH - Corona Sexual Health Clinic
11. Destination Tomorrow
12. Planned Parenthood - Queens (Diane L. Max)
13. NYC DOH - Fort Greene Express Clinic
14. Community Health Center of Richmond - South Avenue
15. Callen-Lorde Community Health Center (main Chelsea location)
16. Brooklyn Abortion Clinic
17. NYC DOH - Morrisania Sexual Health Clinic
18. Dr. Emily Women's Health Center
19. Planned Parenthood - Manhattan (Margaret Sanger Center) - **VERIFY IF CLOSED**
20. Labtek STD Testing Centers
21. Manhattan Sexual Health and Wellness
22. Community Health Action of Staten Island (CHASI)
23. NYC DOH - Chelsea Express Clinic

---

## Priority 4: Verify Closures

**Confirm status of these potentially closed/moved clinics:**

1. **Planned Parenthood - Manhattan (Margaret Sanger Center)**

   - Reports say closed Oct 2024
   - If closed, remove from database
   - If moved, provide new location

2. **NYC DOHMH STD Control - Chelsea**
   - Marked as "CLOSED AS OF 3/23"
   - Verify if this refers to Chelsea Sexual Health Clinic or a separate facility
   - If separate and closed, confirm removal

---

## Priority 5: Service Details for Abortion Providers

For all clinics offering abortion, we need:

- **Medication abortion max weeks** (number)
- **Procedure abortion max weeks** (number)
- **Offers late-term (20+ weeks)** (yes/no)

### Clinics needing abortion details:

1. Parkmed NYC - (have: up to 27.6 weeks) - confirm medication vs procedure limits
2. Choices Women's Medical Center - gestational limits?
3. Brooklyn Abortion Clinic - gestational limits?
4. Queens Abortion Pill - medication only? limit?
5. Early Options - gestational limits?
6. Dr. Emily Women's Health Center - gestational limits?
7. Professional Gynecological Services - gestational limits?
8. All Women's Medical of Queens - gestational limits?

---

## Priority 6: Additional Clinics to Research

### Independent/Private Abortion Clinics (verify existence and details):

1. **Manhattan Women's Health & Wellness** - 635 Madison Ave
2. **All Women's Medical** - 120-34 Queens Blvd, Kew Gardens
3. **Ambulatory Surgical Center of Brooklyn** - if exists
4. **Any other licensed abortion facilities in NYC**

### Additional LGBTQ+ Health Centers:

1. **SAGE** - Services for LGBTQ+ elders (if they offer sexual health)
2. **Ali Forney Center** - Youth services (sexual health component?)
3. **Hetrick-Martin Institute** - Youth LGBTQ+ (health services?)

### Youth-Specific Clinics:

1. **School-based health centers** with sexual health services
2. **Planned Parenthood Teen Clinics** - any separate teen-focused locations?

---

## Output Format

For each clinic researched, provide:

```
### [Clinic Name]

**Core Info:**
- Address: [full address with suite/floor]
- Borough: [Manhattan/Brooklyn/Queens/Bronx/Staten Island]
- Phone: [phone number]
- Website: [URL]
- Coordinates: [latitude], [longitude]

**Organization:** [parent org if applicable]
**Clinic Type:** [DOH/FQHC/Hospital/LGBTQ+ Center/Planned Parenthood/Private]

**Services:**
- [ ] STI Testing
- [ ] HIV Testing
- [ ] PrEP
- [ ] PEP
- [ ] Contraception
- [ ] Abortion
- [ ] Gender-Affirming Care
- [ ] Vaccines

**Abortion Details (if applicable):**
- Medication abortion max weeks: [number]
- Procedure abortion max weeks: [number]
- Offers late-term (20+ weeks): Yes/No

**Insurance:**
- Accepts Medicaid: Yes/No
- Accepts Medicare: Yes/No
- Sliding Scale: Yes/No
- No Insurance OK: Yes/No

**Access:**
- Walk-ins: Yes/No
- Hours: [detailed hours]
- Languages: [list]

**Special:**
- LGBTQ+ Focused: Yes/No
- Youth Friendly: Yes/No

**Sources:**
1. [URL] - [what info] - [date accessed]

**Confidence:** High/Medium/Low
**Notes:** [any special info]
```

---

## Data Sources to Use

1. **NYC Open Data** - data.cityofnewyork.us

   - HIV Testing Locations dataset
   - Health facility directories

2. **NYC Health + Hospitals** - nychealthandhospitals.org

   - Individual hospital pages
   - Pride Health Center listings

3. **Provider Websites**

   - Direct clinic websites
   - Planned Parenthood health center finder
   - Callen-Lorde locations page

4. **Abortion Directories**

   - abortionfinder.org
   - ineedana.com
   - National Abortion Federation

5. **Google Maps / Google Business**
   - Verify addresses
   - Get coordinates
   - Check hours and phone numbers

---

## Deliverables

1. **Complete data** for all missing H+H facilities (Priority 1)
2. **All Women's Medical of Queens** full profile (Priority 2)
3. **Coordinates** for all 15 clinics missing them (Priority 3)
4. **Phone numbers** for all 25 clinics missing them (Priority 3)
5. **Closure verification** for Margaret Sanger and Chelsea STD Control (Priority 4)
6. **Gestational limits** for all abortion providers (Priority 5)
7. **New clinic profiles** for any additional facilities found (Priority 6)

Format all data using the template above so it can be easily imported into our Airtable database.
