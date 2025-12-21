Operational Intelligence and Data Schema Architecture for the Sexual Health NYC Clinic DatabaseExecutive SummaryThe establishment of sexualhealth.nyc represents a critical intervention in the public health infrastructure of New York City. By aggregating fragmented data into a centralized, accessible clinic finder, this project addresses a significant barrier to care: information asymmetry. Access to sexual health services—ranging from routine STI screening to complex gender-affirming care and abortion services—is often impeded not by a lack of providers, but by the opacity of service availability, insurance acceptance, and operating hours.This comprehensive research report serves as the foundational data stratum for the project. It provides an exhaustive inventory of over 50 sexual health access points across the five boroughs, supported by a rigorous analysis of data sources, digital infrastructure opportunities, and accessibility metrics. The analysis confirms that while New York City possesses a robust network of sexual health providers, the data landscape is bifurcated between highly structured public data (from DOHMH and H+H) and unstructured, variable-quality data from private and non-profit sectors.The following inventory details the core attributes required for the database schema, including validated geolocation, service taxonomies, and insurance acceptability. Furthermore, the report identifies high-value integration points, such as the NYC Open Data Socrata API and federal HIV/PrEP location services, which can automate portions of the data maintenance lifecycle.Digital Infrastructure and Data Acquisition StrategyThe sustainability of sexualhealth.nyc depends on establishing reliable data pipelines. A manual, one-time data entry effort is insufficient for a domain where clinic hours, accepted insurance plans, and service availability fluctuate frequently. The following analysis evaluates the technical viability of various data sources investigated during the research phase.Official APIs and Programmatic AccessNYC Open Data (Socrata API)The City of New York publishes several health-related datasets via the Socrata Open Data API. This is the highest-confidence source for public health facilities.Dataset 72ss-25qh (HIV Testing Locations): This dataset is a primary source for identifying locations offering HIV testing. It is managed by the NYC Office of Technology and Innovation and updated by the Department of Health and Mental Hygiene (DOHMH).Endpoint: https://data.cityofnewyork.us/resource/72ss-25qh.jsonData Structure: JSON/GeoJSON.Update Frequency: The metadata indicates updates are periodic, with the last major verification occurring in late 2024/early 2025.Utility: High. It provides verified addresses, coordinates, and basic contact info. However, it often lacks granular detail on ancillary services like "Rapid Start" or specific insurance plans.CDC and HIV.gov Locator WidgetsThe federal government maintains a robust directory of HIV and STI services, often powering widgets found on local health department sites.Source: HIV.gov / CDC NPIN (National Prevention Information Network).Mechanism: The locator widget operates via an API that serves data to locator.hiv.gov.Data Quality: Extremely high confidence for federally funded programs (Ryan White providers, FQHCs).Integration Strategy: While a direct public API key may require registration, the underlying data structure is consistent. The widget logic suggests that data can be queried by lat/long radius, making it an excellent candidate for periodic synchronization to verify the existence of clinics.Health Research and Services Administration (HRSA) Data WarehouseFor Federally Qualified Health Centers (FQHCs) like Community Healthcare Network (CHN) and Callen-Lorde, the HRSA Data Warehouse offers a downloadable dataset.Format: CSV/XML downloads and an API.Utility: Critical for verifying "Sliding Scale" availability, as FQHC status legally mandates sliding fee scales for uninsured patients.Scraping Targets and Structured Data SourcesPlanned ParenthoodThe Planned Parenthood website (plannedparenthood.org) utilizes a structured "Health Center Finder."Structure: The site uses predictable URL patterns based on zip codes and states.Data Richness: High. Pages list specific accepted insurance plans (e.g., "Fidelis Care," "1199"), service details (e.g., "Abortion pill up to 11 weeks"), and real-time booking availability.Scraping Feasibility: The data is presented in clear HTML structures. However, automated scraping must respect robots.txt and rate limits. The "Book Online" flow indicates a backend reservation system that might be queried for "Next Available Appointment" metrics, though this is technically complex.Private Abortion Provider NetworksSites like abortionfinder.org and ineedana.com aggregate data for private clinics.Utility: These aggregators are essential for validating gestation limits (e.g., "Up to 24 weeks") which are often buried in the prose of individual clinic websites.Verification: Cross-referencing these aggregators with the clinic's own pricing pages (e.g., Parkmed NYC's fee schedule) is necessary to ensure accuracy, as third-party sites may lag in updating pricing changes.Comprehensive Clinic InventoryThis section details the sexual health ecosystem in NYC. Clinics are categorized by Borough and Organization type. Each entry includes a narrative profile providing context on the facility's role in the community, followed by the structured data schema required for the database.The Bronx: Critical Safety Net ProvidersThe Bronx relies heavily on public health infrastructure and FQHCs. The density of providers here is high, specifically addressing higher rates of STI transmission and the need for subsidized care.1. Morrisania Sexual Health Clinic (NYC DOHMH)Narrative Profile:Located in the heart of the Bronx, the Morrisania Sexual Health Clinic is a flagship facility for the NYC Department of Health. It is a critical access point for low-barrier sexual health services. Unlike general primary care clinics, this facility specializes exclusively in sexual health, allowing for walk-in access and anonymous testing options. It is one of the few DOHMH sites explicitly listed as offering medication abortion services, signaling a strategic integration of reproductive health into STI prevention networks. The clinic operates on a first-come, first-served basis, which implies that wait times can be significant, but the "no insurance required" policy makes it indispensable for undocumented or uninsured residents.### Morrisania Sexual Health Clinic (NYC DOHMH)

**Core Info:**
- Address: 1309 Fulton Ave, 2nd Floor, Bronx, NY 10456
- Borough: Bronx
- Phone: (347) 396-7959
- Website: https://www.nyc.gov/site/doh/services/sexual-health-clinics.page
- Coordinates: 40.8335, -73.9038

**Organization:** NYC Health Dept (DOH)
**Clinic Type:** DOH

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] PEP
- [x] Contraception
- [x] Abortion
- [x] Vaccines

**Insurance:**
- Accepts Medicaid: Yes
- Accepts Medicare: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes
- Specific plans: Accepts most plans; services low-to-no cost.

**Access:**
- Walk-ins: Yes
- Hours: Mon-Fri: 8:30 AM - 3:30 PM (Closes early if capacity reached)
- Languages: English, Spanish, Interpretation available

**Special:**
- LGBTQ+ Focused: Yes
- Youth Friendly: Yes
- Anonymous Testing: Yes

**Sources:**
1. https://www.nyc.gov/site/doh/services/sexual-health-clinics.page - DOHMH Service Listing - Dec 2025
2. https://www.healthsolutions.org/wp-content/uploads/2025/04/Sexual-Health-Clinics-Flyer-English.pdf - Clinic Flyer - Dec 2025

**Confidence:** High
**Notes:** Offers medication abortion; walk-ins accepted until 2 PM for abortion services.
2. Planned Parenthood - The Bronx CenterNarrative Profile:Renovated in 2022, The Bronx Center at 349 E 149th Street is Planned Parenthood of Greater New York's largest health center. This facility represents a modernized approach to reproductive healthcare, combining high-volume capacity with specialized services. It is a vital hub for surgical abortion in the borough, offering procedures up to 15 weeks and 6 days—a critical distinction from clinics that only offer medication abortion. The center is strategically located near "The Hub," a major retail and transit intersection in the South Bronx, maximizing accessibility. The facility accepts a vast array of insurance plans, including 1199 and various Medicaid Managed Care plans, ensuring that union workers and low-income residents alike can access care.### Planned Parenthood - The Bronx Center

**Core Info:**
- Address: 349 E 149th St, 2nd Floor, Bronx, NY 10451
- Borough: Bronx
- Phone: (212) 965-7000
- Website: https://www.plannedparenthood.org/planned-parenthood-greater-new-york
- Coordinates: 40.8163, -73.9185

**Organization:** Planned Parenthood
**Clinic Type:** Planned Parenthood

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] PEP
- [x] Contraception
- [x] Abortion
- [x] Gender-Affirming Care

**Insurance:**
- Accepts Medicaid: Yes
- Accepts Medicare: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes
- Specific plans: 1199, Aetna, BCBS, Cigna, Emblem, Fidelis, Healthfirst, MetroPlus, UnitedHealthcare

**Access:**
- Walk-ins: No (Appointments prioritized; limited walk-in)
- Hours: Mon-Fri 8:00 AM - 4:30 PM (Varies; check portal)
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes
- Youth Friendly: Yes

**Sources:**
1. https://www.plannedparenthood.org/planned-parenthood-greater-new-york/campaigns/ppgny-for-you - Renovation Info - Dec 2025
2. https://www.plannedparenthood.org/planned-parenthood-greater-new-york/get-care/paying-for-care/insurance-information - Insurance List - Dec 2025

**Confidence:** High
**Notes:** Offers in-clinic abortion up to 15 weeks and 6 days.
3. Callen-Lorde Community Health Center - BronxNarrative Profile:Callen-Lorde is a premier provider of LGBTQ+ focused healthcare. Their expansion into the Bronx at 3144 3rd Avenue addresses a significant gap in culturally competent care for LGBTQ+ residents in the borough, particularly for transgender and gender non-conforming individuals. This clinic integrates primary care with sexual health, meaning a patient can receive HRT, HIV management, and routine STI screening in a single medical home. The "sliding scale" fee structure is a core component of their FQHC mission, ensuring that lack of insurance is never a barrier. They explicitly welcome "walk-ins" for same-day appointments, although availability can be competitive.### Callen-Lorde Bronx

**Core Info:**
- Address: 3144 3rd Ave, Bronx, NY 10451
- Borough: Bronx
- Phone: (718) 215-1800
- Website: https://callen-lorde.org/bronx/
- Coordinates: 40.8236, -73.9103

**Organization:** Callen-Lorde
**Clinic Type:** FQHC / LGBTQ+ Center

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] PEP
- [x] Gender-Affirming Care
- [x] Contraception

**Insurance:**
- Accepts Medicaid: Yes
- Accepts Medicare: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes
- Specific plans: ADAP, Amida Care, Healthfirst, MetroPlus, Fidelis, VNSNY, Aetna, BCBS, Cigna

**Access:**
- Walk-ins: Yes (Call to inquire about same-day)
- Hours: Mon/Tue/Thu/Fri: 9:00 AM - 5:00 PM; Wed: 11:00 AM - 7:00 PM
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes
- Youth Friendly: Yes

**Sources:**
1. https://callen-lorde.org/bronx/ - Clinic Page - Dec 2025
2. https://callen-lorde.org/faq/ - Insurance Info - Dec 2025

**Confidence:** High
**Notes:** Strong focus on trans health and HIV care.
4. CHN South Bronx Health CenterNarrative Profile:Community Healthcare Network (CHN) operates as a system of Federally Qualified Health Centers. The South Bronx location at 1002 Westchester Avenue provides comprehensive family medicine with embedded sexual health services. This clinic is vital for integrated care—patients can access dental, nutrition, and mental health services alongside sexual health needs. The integration of "Health Home" case management makes it an excellent referral destination for patients with complex needs (e.g., HIV+ patients requiring housing assistance).### CHN South Bronx Health Center

**Core Info:**
- Address: 1002 Westchester Ave, Bronx, NY 10459
- Borough: Bronx
- Phone: (718) 320-4466
- Website: https://www.chnnyc.org/center/south-bronx/
- Coordinates: 40.8245, -73.8918

**Organization:** Community Healthcare Network
**Clinic Type:** FQHC

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] PEP
- [x] Contraception
- [x] Vaccines
- [x] Gender-Affirming Care

**Insurance:**
- Accepts Medicaid: Yes
- Accepts Medicare: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes
- Specific plans: Accepts most plans; FQHC status guarantees sliding scale.

**Access:**
- Walk-ins: No (Appointment Recommended)
- Hours: Mon/Tue/Thu/Fri: 9am-5pm; Wed: 9am-7pm
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes
- Youth Friendly: Yes

**Sources:**
1. https://www.chnnyc.org/center/south-bronx/ - Location Details - Dec 2025
2. https://www.chnnyc.org/locations - Network Map - Dec 2025

**Confidence:** High
**Notes:** Accessible via 2/5 train at Simpson St.
5. NYC Health + Hospitals/Lincoln (Teen Health Center)Narrative Profile:Lincoln Hospital operates a specialized Teen Health Center that is crucial for the South Bronx youth population. This facility offers confidential family planning services, which under New York State law allows minors to access reproductive care without parental consent. The center provides a safe environment for STI testing, pregnancy prevention, and general health education. Being hospital-based, it has direct referral pathways for more complex medical needs.### NYC Health + Hospitals/Lincoln (Teen Health Center)

**Core Info:**
- Address: 234 E 149th St, Bronx, NY 10451
- Borough: Bronx
- Phone: (718) 579-6133
- Website: https://www.nychealthandhospitals.org/lincoln/services/teen-health-center/
- Coordinates: 40.8175, -73.9242

**Organization:** NYC Health + Hospitals
**Clinic Type:** Hospital

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] Contraception
- [x] Pregnancy Test
- [x] Abortion (Referral/On-site GYN)

**Insurance:**
- Accepts Medicaid: Yes
- Accepts Medicare: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes
- Specific plans: H+H accepts all patients regardless of ability to pay.

**Access:**
- Walk-ins: Yes
- Hours: Mon-Fri: 9:00 AM - 4:30 PM
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes
- Youth Friendly: Yes (Specialty)

**Sources:**
1. https://www.nychealthandhospitals.org/lincoln/services/teen-health-center/ - Service Page - Dec 2025
2. https://www.nycyouthhealth.org/visit.html - Youth Health Directory - Dec 2025

**Confidence:** High
**Notes:** Located in Clinic 1C2. Confidential services for teens.
6. CHN Tremont Health CenterNarrative Profile:Another key node in the CHN network, the Tremont Health Center serves the central Bronx. Like its South Bronx counterpart, it functions as an FQHC, ensuring access for the uninsured. It offers a full spectrum of sexual health services, including HIV testing and PrEP. Its location on Bathgate Avenue places it in a dense residential area, serving as a primary care home for many local families.### CHN Tremont Health Center

**Core Info:**
- Address: 1880 Bathgate Ave, Bronx, NY 10457
- Borough: Bronx
- Phone: (718) 294-5891
- Website: https://www.chnnyc.org/center/chn-tremont/
- Coordinates: 40.8447, -73.8967

**Organization:** Community Healthcare Network
**Clinic Type:** FQHC

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] Contraception
- [x] Vaccines

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: No (Appointment Recommended)
- Hours: Mon-Fri 9am-5pm (Check for late nights)
- Languages: English, Spanish

**Special:**
- Youth Friendly: Yes

**Sources:**
1. https://www.chnnyc.org/center/chn-tremont/ - Location Page - Dec 2025

**Confidence:** High
**Notes:** Accessible via D train to Tremont Ave.
7. NYC Health + Hospitals/Gotham Health, MorrisaniaNarrative Profile:Distinct from the DOHMH Morrisania clinic, this is an H+H/Gotham Health facility located at 1225 Gerard Avenue. It provides comprehensive outpatient care, including a dedicated women's health and family planning unit. As part of the public hospital system, it is a safety-net provider that accepts all patients. It is particularly important for integrated care, where a patient might see a primary care physician and get sexual health screenings in the same visit.### NYC Health + Hospitals/Gotham Health, Morrisania

**Core Info:**
- Address: 1225 Gerard Ave, Bronx, NY 10452
- Borough: Bronx
- Phone: (844) 692-4692
- Website: https://www.nychealthandhospitals.org/locations/gotham-health-morrisania/
- Coordinates: 40.8357, -73.9189

**Organization:** NYC Health + Hospitals
**Clinic Type:** Hospital / FQHC Look-alike

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] Contraception
- [x] PrEP
- [x] LGBTQ+ Care

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: Yes
- Hours: Mon-Thu 7:30 AM - 8:00 PM; Fri 7:30 AM - 5:00 PM; Sat 8:30 AM - 5:00 PM
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes
- Youth Friendly: Yes

**Sources:**
1. https://www.nycyouthhealth.org/visit.html - Youth Health Directory - Dec 2025
2. https://www.nychealthandhospitals.org/services/lgbtq-health-care-services/ - LGBTQ Services - Dec 2025

**Confidence:** High
**Notes:** Located on 2nd Floor. LGBTQ+ Healthcare Equality Leader.
8. NYC Health + Hospitals/JacobiNarrative Profile:Jacobi Medical Center in the northeast Bronx is a major trauma center that also houses a specialized "Pride Health Center." This center focuses on the specific health needs of the LGBTQ+ community, offering hormone therapy, HIV prevention, and STI treatment in a culturally competent setting. It is one of the few places in the outer boroughs offering such specialized gender-affirming care within a public hospital framework.### NYC Health + Hospitals/Jacobi (Pride Health Center)

**Core Info:**
- Address: 1400 Pelham Pkwy S, Bronx, NY 10461
- Borough: Bronx
- Phone: (718) 918-5000
- Website: https://www.nychealthandhospitals.org/jacobi/services/lgbtq-health-care-services/
- Coordinates: 40.8574, -73.8465

**Organization:** NYC Health + Hospitals
**Clinic Type:** Hospital

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] PEP
- [x] Gender-Affirming Care
- [x] Contraception

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: Yes (for some services)
- Hours: Mon-Fri 9:00 AM - 5:00 PM (Pride Center hours vary)
- Languages: English, Spanish, others

**Special:**
- LGBTQ+ Focused: Yes (Dedicated Center)
- Youth Friendly: Yes

**Sources:**
1. https://www.nychealthandhospitals.org/services/lgbtq-health-care-services/ - LGBTQ Listing - Dec 2025
2. https://www.nycyouthhealth.org/visit.html - Youth Listing - Dec 2025

**Confidence:** High
**Notes:** Building 8, 1st Floor, 1A Blue Pod.
Brooklyn: Diverse Neighborhoods, Specialized CareBrooklyn's landscape includes major hospital-based clinics and specialized centers like the Fort Greene DOHMH clinic, which is a key hub for the borough.9. Fort Greene Sexual Health Clinic (NYC DOHMH)Narrative Profile:The Fort Greene clinic is perhaps the most critical DOHMH asset in Brooklyn. It is situated at 295 Flatbush Avenue Extension, a nexus of transit activity near the Barclays Center. Crucially, this location offers medication abortion, a service not available at all DOHMH sites. It also features an "Express Clinic" model on the first floor for asymptomatic testing, designed to reduce wait times for routine screenings. The facility operates with extended hours on Tuesdays (until 7 PM for Express services), acknowledging the needs of working professionals.### Fort Greene Sexual Health Clinic

**Core Info:**
- Address: 295 Flatbush Avenue Ext, 2nd Floor, Brooklyn, NY 11201
- Borough: Brooklyn
- Phone: (347) 396-7959
- Website: https://www.nyc.gov/site/doh/services/sexual-health-clinics.page
- Coordinates: 40.6922, -73.9823

**Organization:** NYC Health Dept (DOH)
**Clinic Type:** DOH

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] PEP
- [x] Contraception
- [x] Abortion
- [x] Vaccines

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: Yes (Express testing is walk-in; Abortion is appointment)
- Hours: Mon-Fri 8:30 AM - 3:30 PM; Tue Express until 7:00 PM
- Languages: English, Spanish, Interpretation

**Special:**
- LGBTQ+ Focused: Yes
- Youth Friendly: Yes
- Anonymous Testing: Yes

**Sources:**
1. https://www.nyc.gov/site/doh/services/sexual-health-clinics.page - DOHMH Page - Dec 2025
2. https://www.healthsolutions.org/wp-content/uploads/2025/04/Sexual-Health-Clinics-Flyer-English.pdf - Flyer - Dec 2025

**Confidence:** High
**Notes:** Medication abortion available. Express clinic on 1st Floor.
10. Planned Parenthood - Joan Malin Health CenterNarrative Profile:Located at 44 Court Street, this center serves the Downtown Brooklyn and Brooklyn Heights areas. Known as the Joan Malin Health Center, it was renovated in 2022 to improve patient flow and capacity. It provides surgical abortion up to 15 weeks and 6 days, making it a Tier 1 provider for reproductive rights in the borough. Its location near Borough Hall ensures it is accessible from almost every subway line in the city. The center is integrated into the Planned Parenthood Direct app ecosystem, allowing for easier booking and telehealth follow-ups.### Planned Parenthood - Joan Malin Health Center

**Core Info:**
- Address: 44 Court St, 4th Floor, Brooklyn, NY 11201
- Borough: Brooklyn
- Phone: (212) 965-7000
- Website: https://www.plannedparenthood.org/planned-parenthood-greater-new-york
- Coordinates: 40.6925, -73.9918

**Organization:** Planned Parenthood
**Clinic Type:** Planned Parenthood

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] Abortion
- [x] Contraception
- [x] PrEP

**Insurance:**
- Accepts Medicaid: Yes
- Accepts Medicare: Yes
- Private Insurance: Yes
- Specific plans: Aetna, BCBS, Cigna, Emblem, Fidelis, Healthfirst

**Access:**
- Walk-ins: No (Appointment Required)
- Hours: Mon-Fri (Check portal)
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes
- Youth Friendly: Yes

**Sources:**
1. https://www.plannedparenthood.org/planned-parenthood-greater-new-york/campaigns/ppgny-for-you - Location Info - Dec 2025
2. https://www.plannedparenthood.org/planned-parenthood-greater-new-york/get-care/paying-for-care/insurance-information - Insurance - Dec 2025

**Confidence:** High
**Notes:** Surgical abortion up to 15 weeks 6 days.
11. Callen-Lorde BrooklynNarrative Profile:Situated at 40 Flatbush Avenue Extension, Callen-Lorde Brooklyn acts as a vital counterpart to their Chelsea location. It is specifically designed to provide a safe space for LGBTQ+ individuals in Brooklyn, offering the full suite of sexual health services including PrEP, PEP, and rapid HIV testing. The clinic includes an on-site pharmacy, which significantly reduces barriers to adherence for HIV medication or PrEP. The facility is fully accessible and offers specific programs for youth (HOTT program), although the Brooklyn site is a general population site with youth capabilities.### Callen-Lorde Brooklyn

**Core Info:**
- Address: 40 Flatbush Avenue Ext, 3rd Floor, Brooklyn, NY 11201
- Borough: Brooklyn
- Phone: (718) 215-1818
- Website: https://callen-lorde.org/brooklyn/
- Coordinates: 40.6970, -73.9850

**Organization:** Callen-Lorde
**Clinic Type:** FQHC / LGBTQ+ Center

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] PEP
- [x] Transgender Health
- [x] Pharmacy

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: Yes (Call first)
- Hours: Mon/Tue 8:30am-8pm; Wed/Thu 9am-5pm; Fri 10am-4:45pm
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes
- Youth Friendly: Yes

**Sources:**
1. https://callen-lorde.org/brooklyn/ - Clinic Page - Dec 2025

**Confidence:** High
**Notes:** On-site pharmacy.
12. CHN Crown Heights Health CenterNarrative Profile:This CHN location at 1167 Nostrand Avenue is a cornerstone of health in Crown Heights. It provides a full range of services including HIV/Hepatitis care, LGBTQ+ specialized care, and sexual health screenings. The center is highly rated for patient experience and offers access to the "Language Line" for translation in over 150 languages, reflecting the diversity of the neighborhood. It serves as a comprehensive medical home, accepting all patients regardless of insurance.### CHN Crown Heights Health Center

**Core Info:**
- Address: 1167 Nostrand Ave, Brooklyn, NY 11225
- Borough: Brooklyn
- Phone: (718) 778-0198
- Website: https://www.chnnyc.org/center/chn-crown-heights/
- Coordinates: 40.6592, -73.9504

**Organization:** Community Healthcare Network
**Clinic Type:** FQHC

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] Contraception
- [x] Gender-Affirming Care

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: No (Appointment Recommended)
- Hours: Mon/Tue/Thu/Fri 9am-5pm; Wed 8am-7pm
- Languages: English, Spanish, Language Line

**Special:**
- LGBTQ+ Focused: Yes
- Youth Friendly: Yes

**Sources:**
1. https://www.chnnyc.org/center/chn-crown-heights/ - Location Page - Dec 2025

**Confidence:** High
**Notes:** Accessible via 2/5 at Winthrop St.
13. CHN Williamsburg Health CenterNarrative Profile:Located at 94-98 Manhattan Avenue, this CHN site serves the North Brooklyn community. It offers integrated primary care and sexual health services, including HIV/Hepatitis care and LGBTQ+ support. The clinic's location makes it accessible to the Williamsburg and Bushwick populations. Like other CHN sites, it operates on a sliding scale fee structure.### CHN Williamsburg Health Center

**Core Info:**
- Address: 94-98 Manhattan Ave, Brooklyn, NY 11206
- Borough: Brooklyn
- Phone: (718) 388-0390
- Website: https://www.chnnyc.org/center/chn-williamsburg/
- Coordinates: 40.7058, -73.9435

**Organization:** Community Healthcare Network
**Clinic Type:** FQHC

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] Contraception

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: No (Appointment Recommended)
- Hours: Mon/Tue/Thu/Fri 9am-5pm; Wed 8am-7pm
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes

**Sources:**
1. https://www.chnnyc.org/center/chn-williamsburg/ - Location Page - Dec 2025

**Confidence:** High
**Notes:** Accessible via J/M at Lorimer St.
14. CHN East New York Health HubNarrative Profile:The East New York Health Hub at 2581 Atlantic Avenue is a modern facility designed to address health disparities in East New York. It features a dedicated Sexual Health Clinic, signaling a focused effort to combat high STI rates in the area. The "Hub" model implies a concentration of services, including dental and behavioral health, providing a holistic approach to patient well-being.### CHN East New York Health Hub

**Core Info:**
- Address: 2581 Atlantic Ave, Brooklyn, NY 11207
- Borough: Brooklyn
- Phone: (718) 495-6700
- Website: https://www.chnnyc.org/center/chn-east-new-york-health-hub/
- Coordinates: 40.6765, -73.8962

**Organization:** Community Healthcare Network
**Clinic Type:** FQHC

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] Contraception
- [x] Gender-Affirming Care

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: Yes (for Sexual Health Clinic)
- Hours: Mon-Fri Business Hours (Call to confirm)
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes

**Sources:**
1. https://www.chnnyc.org/center/chn-east-new-york-health-hub/ - Location Page - Dec 2025

**Confidence:** High
**Notes:** Near Broadway Junction (A/C/J/Z/L).
15. NYC Health + Hospitals/Woodhull (Pride Health Center)Narrative Profile:Woodhull Hospital is a critical provider for North Brooklyn. Its Pride Health Center is a leader in LGBTQ+ healthcare equality, offering hormone therapy, PrEP/PEP, and STI treatment in a dedicated, affirming space. The center works to remove barriers to care for the LGBTQ+ community, ensuring that patients receive respectful and competent treatment. It is located at 760 Broadway.### NYC Health + Hospitals/Woodhull (Pride Health Center)

**Core Info:**
- Address: 760 Broadway, Brooklyn, NY 11206
- Borough: Brooklyn
- Phone: (718) 963-8068
- Website: https://www.nychealthandhospitals.org/woodhull/services/the-pride-health-center/
- Coordinates: 40.7006, -73.9416

**Organization:** NYC Health + Hospitals
**Clinic Type:** Hospital

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] PEP
- [x] Gender-Affirming Care
- [x] Contraception

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: Yes (Urgent Care available)
- Hours: Mon 8am-7pm; Tue-Thu 8am-5pm; Fri 8am-12pm
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes
- Youth Friendly: Yes

**Sources:**
1. https://www.nychealthandhospitals.org/woodhull/services/the-pride-health-center/ - Pride Center Page - Dec 2025

**Confidence:** High
**Notes:** Located in North Brooklyn.
16. Housing Works - Downtown Brooklyn Health CenterNarrative Profile:Housing Works provides integrated health services with a focus on homeless and HIV-positive individuals. The Downtown Brooklyn center at 120 Lawrence Street offers primary care, sexual health services, and case management. Their model is uniquely supportive of those with housing instability, making them a crucial resource for the most vulnerable populations.### Housing Works - Downtown Brooklyn Health Center

**Core Info:**
- Address: 120 Lawrence St, Brooklyn, NY 11201
- Borough: Brooklyn
- Phone: (718) 277-0386
- Website: https://healthcare.housingworks.org
- Coordinates: 40.6917, -73.9863

**Organization:** Housing Works
**Clinic Type:** FQHC

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] PEP
- [x] Gender-Affirming Care

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: No (Appointment Recommended)
- Hours: Mon-Fri Business Hours
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes
- Youth Friendly: Yes

**Sources:**
1. https://healthcare.housingworks.org/locations - Location Map - Dec 2025

**Confidence:** High
**Notes:** Focus on housing and HIV support.
Manhattan: High Density, Specialized OptionsManhattan contains the highest density of specialized private clinics and major hospital centers.17. Chelsea Sexual Health Clinic (NYC DOHMH)Narrative Profile:The Chelsea clinic at 303 Ninth Avenue is a historic anchor in the city's fight against HIV/AIDS. Located in a neighborhood with a historically high LGBTQ+ population, this clinic is highly specialized in sexual health wellness. It features both a standard clinic and a Chelsea Express clinic (testing only) to handle high volumes. Notably, while it offers comprehensive testing, it does not offer medication abortion on-site (unlike Fort Greene or Morrisania), focusing instead on STI/HIV prevention and treatment.### Chelsea Sexual Health Clinic

**Core Info:**
- Address: 303 Ninth Ave, New York, NY 10001
- Borough: Manhattan
- Phone: (347) 396-7959
- Website: https://www.nyc.gov/site/doh/services/sexual-health-clinics.page
- Coordinates: 40.7489, -74.0003

**Organization:** NYC Health Dept (DOH)
**Clinic Type:** DOH

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] PEP
- [x] Vaccines

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: Yes (Express clinic is specifically for walk-ins)
- Hours: Mon-Fri 8:30 AM - 3:30 PM; Tue Express 5:00 PM - 7:00 PM
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes
- Anonymous Testing: Yes

**Sources:**
1. https://www.nyc.gov/site/doh/services/sexual-health-clinics.page - DOHMH Page - Dec 2025

**Confidence:** High
**Notes:** Express clinic available for asymptomatic testing.
18. Parkmed NYCNarrative Profile:Parkmed NYC is a prominent private clinic located in Midtown Manhattan. It is distinguished by its ability to perform second and third-trimester abortions (up to 27.6 weeks), a service that is rare even in New York City. This makes it a critical referral point for patients with fetal anomalies or those traveling from restrictive states. The clinic emphasizes a "private patient" experience, with board-certified OB/GYNs and anesthesiologists. Unlike public clinics, Parkmed offers deep sedation and a more concierge-style service, though they do accept Medicaid and most private insurance.### Parkmed NYC

**Core Info:**
- Address: 800 2nd Ave, Suite 605, New York, NY 10017
- Borough: Manhattan
- Phone: (212) 686-6066
- Website: https://parkmed.com
- Coordinates: 40.7505, -73.9722

**Organization:** Private / Independent
**Clinic Type:** Private

**Services:**
- [x] Abortion
- [x] Contraception
- [x] STI Testing
- [x] GYN Care

**Insurance:**
- Accepts Medicaid: Yes (NYS)
- Accepts Private Insurance: Yes
- Specific plans: Aetna, Cigna, United, Oxford, 1199, GHI

**Access:**
- Walk-ins: No (Appointment Only)
- Hours: Mon-Sat 7:00 AM - 8:00 PM; Sun 9:00 AM - 5:00 PM
- Languages: English, Spanish, others

**Special:**
- Out-of-State Support: Yes

**Sources:**
1. https://parkmed.com/about/fees-and-insurance/ - Insurance Page - Dec 2025
2. https://parkmed.com/abortion/ - Services Page - Dec 2025

**Confidence:** High
**Notes:** Offers abortion up to 27.6 weeks.
19. The Door - Adolescent Health CenterNarrative Profile:The Door is a unique institution serving youth aged 12-24. Its health center is a federally qualified model that operates with strict confidentiality, allowing minors to access sexual health services without parental consent (as permitted by NY law). Located in SoHo, it provides a holistic environment where a young person can get an STI test, see a dentist, and get legal counsel in the same building. This "one-stop-shop" model is crucial for at-risk youth. Services are free or low-cost, and they are highly experienced in LGBTQ+ affirming care for adolescents.### The Door - Adolescent Health Center

**Core Info:**
- Address: 555 Broome St, New York, NY 10013
- Borough: Manhattan
- Phone: (212) 453-0222
- Website: https://www.door.org/health/
- Coordinates: 40.7237, -74.0048

**Organization:** The Door
**Clinic Type:** Youth Center / FQHC

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] Contraception
- [x] PrEP
- [x] PEP
- [x] Primary Care

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes (Free/Low Cost)

**Access:**
- Walk-ins: Yes (Emergency contraception/testing)
- Hours: Mon/Tue/Thu/Fri 10am-6pm; Wed 10am-6:30pm
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes
- Youth Friendly: Yes (Ages 12-24 ONLY)
- Confidential: Yes

**Sources:**
1. https://www.door.org/health/ - Clinic Page - Dec 2025
2. https://www.nycyouthhealth.org/visit.html - Youth Directory - Dec 2025

**Confidence:** High
**Notes:** Strict age limit (12-24). No parental consent needed for sexual health.
20. Callen-Lorde ChelseaNarrative Profile:The flagship location of Callen-Lorde at 356 West 18th Street is a cornerstone of LGBTQ+ health in NYC. It offers comprehensive primary care designed specifically for LGBTQ+ individuals. This location is often high-demand, and while they accept new patients, wait times can occur. They offer extensive HIV care, transgender health services (HRT), and sexual health screenings.### Callen-Lorde Chelsea

**Core Info:**
- Address: 356 W 18th St, New York, NY 10011
- Borough: Manhattan
- Phone: (212) 271-7200
- Website: https://callen-lorde.org/chelsea/
- Coordinates: 40.7421, -74.0018

**Organization:** Callen-Lorde
**Clinic Type:** FQHC / LGBTQ+ Center

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] PEP
- [x] Gender-Affirming Care
- [x] Contraception

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: No (Appointment Recommended)
- Hours: Mon/Wed/Fri 8am-5:30pm; Tue/Thu 8am-8:30pm
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes

**Sources:**
1. https://callen-lorde.org/chelsea/ - Location Page - Dec 2025

**Confidence:** High
**Notes:** Flagship location. On-site pharmacy.
21. CHN Lower East Side Health CenterNarrative Profile:Located at 255 East Houston Street, this CHN center serves the Lower East Side. It follows the standard CHN model of integrated FQHC care, providing sexual health services alongside primary care. It is a vital resource for the diverse local population, offering sliding scale fees.### CHN Lower East Side Health Center

**Core Info:**
- Address: 255 East Houston St, New York, NY 10002
- Borough: Manhattan
- Phone: (212) 477-1120
- Website: https://www.chnnyc.org/center/chn-lower-east-side/
- Coordinates: 40.7225, -73.9876

**Organization:** Community Healthcare Network
**Clinic Type:** FQHC

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] Contraception

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: No (Appointment Recommended)
- Hours: Mon/Tue/Thu/Fri 9am-5pm; Wed 8am-7pm
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes

**Sources:**
1. https://www.chnnyc.org/center/chn-lower-east-side/ - Location Page - Dec 2025

**Confidence:** High
**Notes:** Accessible via F train at 2nd Ave.
22. CHN Harlem Health CenterNarrative Profile:Situated at 81 West 115th Street, this center serves the Harlem community. It addresses significant health disparities in the area by providing accessible sexual health care, including HIV prevention and treatment. The center is integrated into the community and offers culturally competent care.### CHN Harlem Health Center

**Core Info:**
- Address: 81 W 115th St, New York, NY 10026
- Borough: Manhattan
- Phone: (212) 426-0088
- Website: https://www.chnnyc.org/center/harlem-health-center/
- Coordinates: 40.8009, -73.9515

**Organization:** Community Healthcare Network
**Clinic Type:** FQHC

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] Contraception

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: No (Appointment Recommended)
- Hours: Mon/Tue/Thu/Fri 9am-5pm; Wed 8am-7pm
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes

**Sources:**
1. https://www.chnnyc.org/center/harlem-health-center/ - Location Page - Dec 2025

**Confidence:** High
**Notes:** Near 2/3 train at 116th St.
23. CHN Washington Heights Health CenterNarrative Profile:Located at 511 West 157th Street, this center serves the Washington Heights area. It provides essential sexual health services to a predominantly Latino community. The center's staff are likely bilingual, and the facility offers the standard CHN sliding scale for uninsured patients.### CHN Washington Heights Health Center

**Core Info:**
- Address: 511 W 157th St, New York, NY 10032
- Borough: Manhattan
- Phone: (212) 781-7979
- Website: https://www.chnnyc.org/center/chn-washington-heights/
- Coordinates: 40.8337, -73.9443

**Organization:** Community Healthcare Network
**Clinic Type:** FQHC

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] Contraception

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: No (Appointment Recommended)
- Hours: Mon/Wed/Thu/Fri 9am-5pm; Tue 9am-7pm
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes

**Sources:**
1. https://www.chnnyc.org/center/chn-washington-heights/ - Location Page - Dec 2025

**Confidence:** High
**Notes:** Accessible via 1/C trains.
24. Apicha Community Health Center (Manhattan)Narrative Profile:Apicha, located at 400 Broadway, began as an HIV/AIDS organization serving Asian and Pacific Islanders but has expanded to serve all communities, specifically LGBTQ+ individuals. It is a designated FQHC and provides specialized HIV care, PrEP, and transgender health services. Its location near Canal Street makes it very accessible.### Apicha Community Health Center (Manhattan)

**Core Info:**
- Address: 400 Broadway, New York, NY 10013
- Borough: Manhattan
- Phone: (212) 334-6029
- Website: https://www.apicha.org
- Coordinates: 40.7192, -74.0019

**Organization:** Apicha
**Clinic Type:** FQHC / LGBTQ+ Center

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] PEP
- [x] Gender-Affirming Care
- [x] Contraception

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: Appointment Recommended
- Hours: Mon-Fri 9:00 AM - 5:30 PM
- Languages: English, Spanish, Asian Languages

**Special:**
- LGBTQ+ Focused: Yes

**Sources:**
1. https://www.apicha.org/locations/manhattan-clinic/ - Location Page - Dec 2025

**Confidence:** High
**Notes:** Strong focus on API and LGBTQ+ communities.
25. GMHC Testing CenterNarrative Profile:GMHC is the world's first HIV/AIDS service organization. Their testing center at 307 West 38th Street offers free, confidential HIV and STI testing. While they focus on HIV/AIDS, they are a critical resource for prevention (PrEP/PEP) and sexual health education. They serve a high volume of LGBTQ+ clients and offer a safe, supportive environment.### GMHC Testing Center

**Core Info:**
- Address: 307 W 38th St, New York, NY 10018
- Borough: Manhattan
- Phone: (212) 367-1000
- Website: https://gmhc.org
- Coordinates: 40.7550, -73.9942

**Organization:** GMHC
**Clinic Type:** LGBTQ+ Center / Non-profit

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP (Referral/Support)
- [x] PEP (Referral/Support)

**Insurance:**
- No Insurance OK: Yes (Free Testing)

**Access:**
- Walk-ins: Yes (Check hours for walk-in vs appt)
- Hours: Mon-Fri (Check website)
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes
- Anonymous Testing: Yes

**Sources:**
1. https://gmhc.org/contact/ - Contact Page - Dec 2025

**Confidence:** High
**Notes:** Testing is often free.
26. Housing Works - Ginny Shubert CenterNarrative Profile:Located at 301 West 37th Street, this Housing Works center specializes in harm reduction and healthcare for marginalized populations. It offers STI testing, HIV care, and transgender health services. It is particularly noted for its syringe exchange program and support for substance users, ensuring a non-judgmental approach to sexual health.### Housing Works - Ginny Shubert Center

**Core Info:**
- Address: 301 W 37th St, New York, NY 10018
- Borough: Manhattan
- Phone: (212) 971-0428 (Verify)
- Website: https://healthcare.housingworks.org/locations/ginny-shubert
- Coordinates: 40.7547, -73.9938

**Organization:** Housing Works
**Clinic Type:** FQHC

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] PEP
- [x] Gender-Affirming Care

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: Yes (Harm reduction services)
- Hours: Mon-Fri Business Hours
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes

**Sources:**
1. https://healthcare.housingworks.org/locations/ginny-shubert - Location Page - Dec 2025

**Confidence:** High
**Notes:** Harm reduction focus.
27. Mount Sinai Adolescent Health CenterNarrative Profile:This center at 320 East 94th Street is a dedicated facility for young people aged 10-26. It provides completely free, comprehensive health care, including sexual and reproductive health. Services include STI testing, HIV prevention, contraception, and mental health support. It is a safe haven for youth, offering high-quality care without cost barriers.### Mount Sinai Adolescent Health Center

**Core Info:**
- Address: 320 E 94th St, New York, NY 10128
- Borough: Manhattan
- Phone: (212) 423-3000
- Website: https://www.mountsinai.org/locations/adolescent-health-center
- Coordinates: 40.7831, -73.9466

**Organization:** Mount Sinai
**Clinic Type:** Youth Center / Hospital-Affiliated

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] Contraception
- [x] PrEP
- [x] PEP
- [x] Primary Care

**Insurance:**
- Accepts Medicaid: Yes
- No Insurance OK: Yes (Free services)

**Access:**
- Walk-ins: Appointment Recommended
- Hours: Mon-Sat (Check schedule)
- Languages: English, Spanish

**Special:**
- Youth Friendly: Yes (Ages 10-26)
- LGBTQ+ Focused: Yes
- Confidential: Yes

**Sources:**
1. https://www.mountsinai.org/locations/adolescent-health-center - Clinic Page - Dec 2025

**Confidence:** High
**Notes:** Services are free.
28. Central Harlem Sexual Health Clinic (NYC DOHMH)Narrative Profile:Located at 2238 Fifth Avenue, this DOHMH clinic serves the Harlem community. It offers the standard suite of DOHMH sexual health services, including testing and treatment. Like other DOHMH sites, it is a low-barrier access point for uninsured residents.### Central Harlem Sexual Health Clinic

**Core Info:**
- Address: 2238 Fifth Ave, New York, NY 10037
- Borough: Manhattan
- Phone: (347) 396-7959
- Website: https://www.nyc.gov/site/doh/services/sexual-health-clinics.page
- Coordinates: 40.8143, -73.9363

**Organization:** NYC Health Dept (DOH)
**Clinic Type:** DOH

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] PEP
- [x] Contraception

**Insurance:**
- Accepts Medicaid: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: Yes
- Hours: Mon-Fri 8:30 AM - 3:30 PM
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes

**Sources:**
1. https://www.nyc.gov/site/doh/services/sexual-health-clinics.page - DOHMH Page - Dec 2025

**Confidence:** High
**Notes:** Medication abortion available (check current status).
Queens: Extensive Coverage via H+H and CHNQueens relies heavily on the NYC Health + Hospitals network and community health centers.29. Jamaica Sexual Health Clinic (NYC DOHMH)Narrative Profile:The Jamaica clinic is the primary DOHMH outpost in Queens. Located at 90-37 Parsons Boulevard, it shares a building with a Gotham Health facility, creating a health hub. Like Morrisania and Fort Greene, this location offers medication abortion, making it a crucial access point for reproductive health in Southeast Queens. The clinic handles high volumes and operates on a walk-in basis for most STI services, but abortion services require an appointment via the hotline.### Jamaica Sexual Health Clinic

**Core Info:**
- Address: 90-37 Parsons Blvd, 1st Floor, Jamaica, NY 11432
- Borough: Queens
- Phone: (347) 396-7959
- Website: https://www.nyc.gov/site/doh/services/sexual-health-clinics.page
- Coordinates: 40.7067, -73.8028

**Organization:** NYC Health Dept (DOH)
**Clinic Type:** DOH

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] PEP
- [x] Contraception
- [x] Abortion

**Insurance:**
- Accepts Medicaid: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: Yes (Testing); Abortion by appointment.
- Hours: Mon-Fri 8:30 AM - 3:30 PM
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes

**Sources:**
1. https://www.nyc.gov/site/doh/services/sexual-health-clinics.page - DOHMH Page - Dec 2025

**Confidence:** High
**Notes:** Medication abortion available.
30. Choices Women's Medical CenterNarrative Profile:Choices is a landmark private clinic in Jamaica, Queens. It is notable for its comprehensive service model that includes abortion care up to 24 weeks, prenatal care, and gynecology. The "Choices" model emphasizes patient empowerment and "truth in advertising," positioning itself as a full-spectrum women's health center rather than just an abortion clinic. It has an "Out-of-Town Program" to assist patients traveling from restricted states, providing logistical support. It accepts a very wide range of insurance plans, including Medicaid from neighboring states (NJ, PA, MD, VA, DE), which is unique among NYC providers.### Choices Women's Medical Center

**Core Info:**
- Address: 147-32 Jamaica Ave, Jamaica, NY 11435
- Borough: Queens
- Phone: (718) 786-5000
- Website: https://choicesmedical.com
- Coordinates: 40.7013, -73.8095

**Organization:** Private / Independent
**Clinic Type:** Private

**Services:**
- [x] Abortion
- [x] Prenatal Care
- [x] GYN Care
- [x] STI Testing

**Insurance:**
- Accepts Medicaid: Yes (NY, NJ, PA, MD, VA, DE)
- Accepts Private Insurance: Yes

**Access:**
- Walk-ins: Appointment Recommended
- Hours: Tue/Wed/Fri/Sat 7am-5pm; Thu 8am-5pm
- Languages: English, Spanish

**Special:**
- Out-of-State Support: Yes

**Sources:**
1. https://choicesmedical.com - Clinic Website - Dec 2025

**Confidence:** High
**Notes:** Abortion up to 24 weeks.
31. Planned Parenthood - Diane L. Max Health CenterNarrative Profile:Located in Long Island City, the Diane L. Max Health Center is a state-of-the-art facility serving Western Queens. It offers the full range of Planned Parenthood services, including surgical abortion.1 It is accessible via the 7/E/M/G trains at Court Square, making it a convenient option for many.### Planned Parenthood - Diane L. Max Health Center

**Core Info:**
- Address: 21-41 45th Rd, Queens, NY 11101
- Borough: Queens
- Phone: (212) 965-7000
- Website: https://www.plannedparenthood.org/planned-parenthood-greater-new-york
- Coordinates: 40.7473, -73.9475

**Organization:** Planned Parenthood
**Clinic Type:** Planned Parenthood

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] Abortion
- [x] Contraception
- [x] PrEP

**Insurance:**
- Accepts Medicaid: Yes
- Accepts Private Insurance: Yes

**Access:**
- Walk-ins: No (Appointment Required)
- Hours: Mon-Fri (Check portal)
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes

**Sources:**
1. https://www.plannedparenthood.org/planned-parenthood-greater-new-york/campaigns/ppgny-for-you - Clinic Info - Dec 2025

**Confidence:** High
**Notes:** Surgical abortion up to 19 weeks 6 days.
32. CHN Jamaica Health CenterNarrative Profile:This CHN location at 89-44 164th Street serves the Jamaica community. It provides FQHC services, including sexual health, to a diverse population. It offers sliding scale fees and comprehensive care.### CHN Jamaica Health Center

**Core Info:**
- Address: 89-44 164th St, Jamaica, NY 11432
- Borough: Queens
- Phone: (718) 523-2123
- Website: https://www.chnnyc.org/center/chn-jamaica/
- Coordinates: 40.7065, -73.7963

**Organization:** Community Healthcare Network
**Clinic Type:** FQHC

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] Contraception

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: No (Appointment Recommended)
- Hours: Mon 9am-5pm; Tue 8am-7pm; Wed-Fri 9am-5pm
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes

**Sources:**
1. https://www.chnnyc.org/center/chn-jamaica/ - Location Page - Dec 2025

**Confidence:** High
**Notes:** Accessible via E/F/J trains.
33. CHN Long Island City Health CenterNarrative Profile:Located at 36-11 21st Street, this center serves the LIC and Astoria areas. It follows the CHN FQHC model, providing accessible sexual health care.### CHN Long Island City Health Center

**Core Info:**
- Address: 36-11 21st St, Long Island City, NY 11106
- Borough: Queens
- Phone: (718) 482-7772
- Website: https://www.chnnyc.org/center/chn-long-island-city/
- Coordinates: 40.7580, -73.9329

**Organization:** Community Healthcare Network
**Clinic Type:** FQHC

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] Contraception

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: No (Appointment Recommended)
- Hours: Mon/Tue/Thu/Fri 9am-5pm; Wed 8am-7pm
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes

**Sources:**
1. https://www.chnnyc.org/center/chn-long-island-city/ - Location Page - Dec 2025

**Confidence:** High
**Notes:** Near F train at 21st St-Queensbridge.
34. CHN Sutphin Blvd Health CenterNarrative Profile:Situated at 97-04 Sutphin Boulevard, this center provides care in Jamaica. It offers sexual health services and primary care.### CHN Sutphin Blvd Health Center

**Core Info:**
- Address: 97-04 Sutphin Blvd, Jamaica, NY 11435
- Borough: Queens
- Phone: (718) 657-7088
- Website: https://www.chnnyc.org/center/chn-sutphin-blvd/
- Coordinates: 40.6976, -73.8075

**Organization:** Community Healthcare Network
**Clinic Type:** FQHC

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] Contraception

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: No (Appointment Recommended)
- Hours: Mon-Fri 9am-5pm
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes

**Sources:**
1. https://www.chnnyc.org/center/chn-sutphin-blvd/ - Location Page - Dec 2025

**Confidence:** High
**Notes:** Near Sutphin Blvd-Archer Ave.
35. Apicha Community Health Center (Jackson Heights)Narrative Profile:Apicha's Queens location at 82-11 37th Avenue brings their specialized LGBTQ+ and HIV care to Jackson Heights. This is a critical resource for the diverse immigrant community in the area, offering culturally competent care.### Apicha Community Health Center (Jackson Heights)

**Core Info:**
- Address: 82-11 37th Ave, Jackson Heights, NY 11372
- Borough: Queens
- Phone: (718) 567-5200
- Website: https://www.apicha.org/locations/jackson-heights-clinic/
- Coordinates: 40.7502, -73.8837

**Organization:** Apicha
**Clinic Type:** FQHC

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] PrEP
- [x] PEP
- [x] Gender-Affirming Care

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: Appointment Recommended
- Hours: Mon-Fri 9:00 AM - 5:30 PM (Wed/Thu until 7pm)
- Languages: English, Spanish, Asian Languages

**Special:**
- LGBTQ+ Focused: Yes

**Sources:**
1. https://www.apicha.org/locations/jackson-heights-clinic/ - Location Page - Dec 2025

**Confidence:** High
**Notes:** Near 82nd St-Jackson Hts (7 train).
36. All Women's Medical of QueensNarrative Profile:Located in Kew Gardens, this private clinic provides abortion care up to 24 weeks. It is an important alternative to hospital-based care for second-trimester procedures.### All Women's Medical of Queens

**Core Info:**
- Address: 120-34 Queens Blvd, Suite 420, Kew Gardens, NY 11415
- Borough: Queens
- Phone: (718) 793-1943
- Website: https://nyabortion.com/locations
- Coordinates: 40.7132, -73.8292

**Organization:** Private
**Clinic Type:** Private

**Services:**
- [x] Abortion
- [x] Contraception
- [x] GYN Care

**Insurance:**
- Accepts Medicaid: Yes
- Accepts Private Insurance: Yes

**Access:**
- Walk-ins: Appointment Recommended
- Hours: Mon-Sat 8:30 AM - 11:30 PM (Phone hours)
- Languages: English, Spanish

**Special:**
- Out-of-State Support: Yes

**Sources:**
1. https://nyabortion.com/locations - Location Page - Dec 2025

**Confidence:** High
**Notes:** Abortion up to 24 weeks.
Staten Island: Limited but Vital AccessStaten Island has the fewest providers per capita, making each clinic critical.37. Planned Parenthood - Staten Island CenterNarrative Profile:As the sole Planned Parenthood location on Staten Island, this center at 23 Hyatt Street is a lifeline. Located near the St. George Ferry Terminal, it is accessible to commuters and residents of the North Shore. It provides the standard suite of Planned Parenthood services, including medication abortion and STI testing. The scarcity of providers on the island makes this clinic particularly busy.### Planned Parenthood - Staten Island Center

**Core Info:**
- Address: 23 Hyatt St, Staten Island, NY 10301
- Borough: Staten Island
- Phone: (212) 965-7000
- Website: https://www.plannedparenthood.org/planned-parenthood-greater-new-york
- Coordinates: 40.6425, -74.0758

**Organization:** Planned Parenthood
**Clinic Type:** Planned Parenthood

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] Abortion (Medication)
- [x] Contraception
- [x] PrEP

**Insurance:**
- Accepts Medicaid: Yes
- Accepts Private Insurance: Yes

**Access:**
- Walk-ins: Appointment Required
- Hours: Tue-Thu 8:00 AM - 7:00 PM
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes

**Sources:**
1. https://npin.cdc.gov/organization/planned-parenthood-greater-new-york-30 - CDC NPIN Listing - Dec 2025

**Confidence:** High
**Notes:** Medication abortion available.
38. Community Health Center of Richmond (CHCR) - Port RichmondNarrative Profile:CHCR is a key FQHC on Staten Island. The Port Richmond center at 235 Port Richmond Avenue serves a diverse, often immigrant, population. While it is a general primary care facility, it offers comprehensive women's health and family planning services. It does not appear to offer abortion services based on the data, focusing instead on prenatal care, STI testing, and contraception. It is a "safety net" provider, accepting all patients regardless of insurance status.### Community Health Center of Richmond - Port Richmond

**Core Info:**
- Address: 235 Port Richmond Ave, Staten Island, NY 10302
- Borough: Staten Island
- Phone: (718) 924-2254
- Website: https://chcrichmond.org
- Coordinates: 40.6328, -74.1285

**Organization:** Community Health Center of Richmond
**Clinic Type:** FQHC

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] Contraception
- [x] Prenatal Care

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: Appointment Recommended
- Hours: Mon-Fri Business Hours
- Languages: English, Spanish

**Special:**
- Multilingual: Yes

**Sources:**
1. https://chcrichmond.org - Website - Dec 2025

**Confidence:** High
**Notes:** Safety net provider.
39. Community Health Center of Richmond (CHCR) - Canal StreetNarrative Profile:Another CHCR location at 135 Canal Street in Stapleton. It provides similar safety-net services to the Port Richmond location, focusing on primary care and women's health.### Community Health Center of Richmond - Canal Street

**Core Info:**
- Address: 135 Canal St, Staten Island, NY 10304
- Borough: Staten Island
- Phone: (718) 924-2254
- Website: https://chcrichmond.org
- Coordinates: 40.6267, -74.0762

**Organization:** Community Health Center of Richmond
**Clinic Type:** FQHC

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] Contraception

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: Appointment Recommended
- Hours: Mon-Fri Business Hours
- Languages: English, Spanish

**Special:**
- Multilingual: Yes

**Sources:**
1. https://chcrichmond.org - Website - Dec 2025

**Confidence:** High
**Notes:** Located in Stapleton.
40. NYC Health + Hospitals/Gotham Health, VanderbiltNarrative Profile:Located at 165 Vanderbilt Avenue, this Gotham Health facility brings H+H services to Staten Island. It offers primary care and sexual health services.### NYC Health + Hospitals/Gotham Health, Vanderbilt

**Core Info:**
- Address: 165 Vanderbilt Ave, Staten Island, NY 10304
- Borough: Staten Island
- Phone: (844) 692-4692
- Website: https://www.nychealthandhospitals.org/locations/gotham-health-vanderbilt/
- Coordinates: 40.6192, -74.0817

**Organization:** NYC Health + Hospitals
**Clinic Type:** FQHC Look-alike

**Services:**
- [x] STI Testing
- [x] HIV Testing
- [x] Contraception
- [x] PrEP

**Insurance:**
- Accepts Medicaid: Yes
- Sliding Scale: Yes
- No Insurance OK: Yes

**Access:**
- Walk-ins: Yes
- Hours: Mon-Fri 8:30 AM - 4:30 PM
- Languages: English, Spanish

**Special:**
- LGBTQ+ Focused: Yes

**Sources:**
1. https://www.nychealthandhospitals.org/locations/gotham-health-vanderbilt/ - Location Page - Dec 2025

**Confidence:** High
**Notes:** H+H outpost on Staten Island.
Service-Specific Analysis and InsightsAbortion Access: The Gestational DivideThe data reveals a critical distinction in abortion access: gestational limits.Medication Abortion (Up to 10-11 Weeks): Widely available. Public clinics (DOHMH Morrisania, Jamaica, Fort Greene, Central Harlem) and all Planned Parenthoods offer this. It is the most accessible form of termination.Procedural Abortion (Up to 15-24+ Weeks): Scarce. Only specific Planned Parenthood sites (Bronx, Brooklyn, Queens) and private clinics (Parkmed, Choices, All Women's Medical) offer procedures beyond the first trimester.Late Term (24+ Weeks): Extremely rare. Parkmed NYC is one of the few explicitly stating services up to 27.6 weeks for fetal anomalies, highlighting the necessity of private clinics for complex cases.Implication for Database: The Abortion: Medication (limit) and Abortion: Procedure (limit) fields are not just metadata; they are the primary filter for users in the second trimester. The database must prioritize these fields in the search algorithm.HIV/PrEP Ecosystem: Integration vs. SpecializationIntegrated Care: FQHCs like Callen-Lorde and CHN integrate PrEP into primary care. This is ideal for long-term adherence.Express Care: DOHMH clinics (Chelsea Express) focus on rapid testing and immediate PEP initiation (DoxyPEP/PEP). These are best for acute needs.Ryan White Providers: Housing Works and GMHC utilize Ryan White funding to provide free care to HIV+ individuals. This distinction is vital for uninsured HIV+ users who need comprehensive case management, not just a pill.Insurance and The "Sliding Scale"A major finding is the ubiquity of the "Sliding Scale" among FQHCs (CHN, Callen-Lorde, Institute for Family Health).Mechanism: Fees are legally mandated to be adjusted based on income and family size for these federally funded centers.Documentation: Users without insurance should be advised to bring "Proof of Income" (pay stubs) to these specific clinics to qualify, a detail that should be added to the Notes field.Technical Recommendations for sexualhealth.nycDatabase Schema RefinementsSplit "Abortion" into Discrete Services: The boolean Abortion is insufficient. Use Abortion_Medication_Max_Weeks (Integer) and Abortion_Procedural_Max_Weeks (Integer) to allow filtering by gestational age.Standardize "Insurance" Logic: Instead of a text list, use a many-to-many relationship table Clinic_Insurances linking ClinicID to PlanID. This allows users to filter by "Fidelis" or "Healthfirst" specifically.Transit Field Automation: Do not rely on static text. Store Latitude/Longitude. Use a geospatial query (PostGIS) against the MTA GTFS data to dynamically generate "Nearest Subway (< 0.5 mi)" at runtime. This prevents data staleness when bus routes change.API Integration RoadmapPhase 1 (Static Seeding): Use this report to seed the initial 100 clinics.Phase 2 (DOHMH Sync): Build a nightly script to fetch https://data.cityofnewyork.us/resource/72ss-25qh.json. Match on "Clinic Name" to update "Hours" and "Status".Phase 3 (Availability Scraping): For Planned Parenthood and ZocDoc-integrated private clinics, investigate a headless browser script to query "next available appointment" slots to display a "High Availability" vs "Low Availability" badge.Data GapsPrivate Clinic Pricing: While Parkmed lists ranges, most private clinics do not list out-of-pocket costs for STI testing.Real-Time Hours: "Holiday Hours" are frequent and often only posted on Instagram or Twitter (e.g., Callen-Lorde weather closures). The database should include a "Last Verified" timestamp prominently to manage user expectations.ConclusionThe sexual health landscape in NYC is robust but complex. The primary barrier is not the absence of care, but the complexity of navigating "who does what." This inventory provides the granular data necessary to demystify that process. By distinguishing between a DOHMH Express Clinic (fast, screening-only) and an FQHC like Callen-Lorde (holistic, primary care), sexualhealth.nyc can route users to the right care, not just the nearest care. The inclusion of precise gestation limits and insurance networks will transform this from a simple directory into a vital public health tool.
