# Airtable Schema

## Clinics Table

### New GAC Columns to Add

Based on Amida Care GIST directory analysis, add these checkbox columns:

| Column Name                     | Type     | Description                                    |
| ------------------------------- | -------- | ---------------------------------------------- |
| Gender Affirming FFS            | Checkbox | Facial feminization surgery                    |
| Gender Affirming FMS            | Checkbox | Facial masculinization surgery                 |
| Gender Affirming Voice          | Checkbox | Speech therapy / voice modification            |
| Gender Affirming Electrolysis   | Checkbox | Electrolysis hair removal                      |
| Gender Affirming Laser          | Checkbox | Laser hair removal                             |
| Gender Affirming Top Surgery    | Checkbox | Chest masculinization / breast augmentation    |
| Gender Affirming Bottom Surgery | Checkbox | Vaginoplasty / phalloplasty / metoidioplasty   |
| Informed Consent HRT            | Checkbox | Provides HRT without requiring therapy letters |

### Existing GAC Columns

- Gender-Affirming Care (checkbox) - umbrella "offers GAC"
- Gender Affirming Care (Youth) (checkbox)
- Gender Affirming Hormones (checkbox)
- Gender Affirming Surgery (checkbox) - keep for backwards compat, but new columns are more granular
- Gender Affirming Youth Policy (text)

### Data Sources for New Columns

**Amida Care GIST (May 2025)**

- Lists specific providers by procedure type
- Includes: FFS, FMS, top surgery, bottom surgery, voice therapy, electrolysis, laser
- PDF: https://www.amidacareny.org/wp-content/uploads/GIST-Provider-List-English-May-2025.pdf

**Erin Reed's Informed Consent Map**

- Crowdsourced but verified list of informed consent HRT clinics
- https://www.erininthemorning.com/p/erins-informed-consent-hrt-map-how

### NYC Providers by Procedure (from GIST)

| Procedure            | Providers                                                   |
| -------------------- | ----------------------------------------------------------- |
| FFS                  | Mt. Sinai, NYU Langone, Montefiore, Northwell               |
| Voice Therapy        | Mt. Sinai (Mark Courey)                                     |
| Electrolysis         | Nios Electrolysis, NY Electrolysis Office, L'Elite Medispa  |
| Top Surgery          | Mt. Sinai, NYU Langone, Montefiore                          |
| Bottom Surgery       | Mt. Sinai, NYU Langone                                      |
| Informed Consent HRT | Callen-Lorde, APICHA, Planned Parenthood, H+H Pride Centers |

---

## Missing DAC Clinics to Add

These 4 clinics appear in the NYS DOH Designated AIDS Center (DAC) list but are not in our database. DAC facilities provide comprehensive HIV/AIDS services and are required to have specific expertise in HIV care.

| Facility Name                       | Borough   | Address                          | Phone          | Notes                       |
| ----------------------------------- | --------- | -------------------------------- | -------------- | --------------------------- |
| St. Barnabas Hospital Health System | Bronx     | 4422 Third Ave, Bronx 10457      | (718) 960-9000 | DAC since 1988              |
| Kingsbrook Jewish Medical Center    | Brooklyn  | 585 Schenectady Ave, Bklyn 11203 | (718) 604-5000 | Part of One Brooklyn Health |
| SUNY Downstate Medical Center       | Brooklyn  | 450 Clarkson Ave, Bklyn 11203    | (718) 270-1000 | Academic medical center     |
| Lenox Hill Hospital - Northwell     | Manhattan | 100 E 77th St, NY 10075          | (212) 434-2000 | Part of Northwell Health    |

**Source:** NYS DOH DAC Clinic Contacts (https://www.health.ny.gov/diseases/aids/providers/dac/)

### Required Fields to Complete

When adding these clinics to Airtable, the following fields need to be populated:

- [ ] Name
- [ ] Address, City, State, ZIP
- [ ] Borough
- [ ] Phone
- [ ] Website
- [ ] Latitude / Longitude (geocode from address)
- [ ] HIV Testing (likely yes for DAC)
- [ ] HIV Care (yes - required for DAC designation)
- [ ] PrEP Services (verify individually)
- [ ] Hours of operation
- [ ] Insurance accepted
- [ ] Sliding scale availability
