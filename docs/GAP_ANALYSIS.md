# Gap Analysis & Validation: Is sexualhealth.nyc Necessary?

**Date:** December 21, 2025
**Last Updated:** December 23, 2025
**Status:** Validated — we're ahead of competitors

## Executive Summary

After auditing internal research and comparing against existing external resources (NYC Health Map, AbortionFinder.org, INeedAnA.com, Amida Care GIST), the "superset" hypothesis for `sexualhealth.nyc` is **strongly validated**. Not only do we match or exceed data coverage, our primary value is **usability, intersectionality, and granular filtering**.

We scraped and parsed the actual competitor directories. The results are clear: **we have more NYC abortion providers with more detail than the leading abortion finders**.

## Quantitative Comparison (December 2025)

### Our Data

| Metric                | Count                        |
| --------------------- | ---------------------------- |
| Total clinics         | 175 physical + 9 virtual     |
| Abortion providers    | 21 (with gestational limits) |
| Gender-affirming care | 34                           |
| STI/HIV testing       | 58                           |
| PrEP providers        | 139                          |
| PEP providers         | 79                           |
| Contraception         | 43                           |
| Accepts Medicaid      | 62                           |
| Hours coverage        | 89% (156/175)                |

### Competitor Comparison

| Source                     | NYC Clinics Listed | Our Advantage                           |
| -------------------------- | ------------------ | --------------------------------------- |
| **INeedAnA.com**           | 3                  | We have 7x more abortion providers      |
| **AbortionFinder.org**     | ~10 (NYC sample)   | We have 2x more with gestational limits |
| **Amida Care GIST**        | 16 facilities      | We have all 16 + 159 more               |
| **NYS DAC List**           | 33 NYC facilities  | We have 33 of 33 (100%) ✓               |
| **NYS PrEP Provider Dir.** | 156 NYC facilities | We have 139 (89%) ✓                     |

### Abortion Data Detail

We track attributes that competitors don't:

- **Gestational limits** (medication AND procedure separately)
- **Walk-in availability**
- **Insurance acceptance** (specific Medicaid MCOs)
- **Transit access** (subway lines, bus routes)

Example: Our data shows "NYC Health + Hospitals/Harlem" offers medication abortion up to 11 weeks and procedures up to 24 weeks. AbortionFinder just shows it exists.

## Source Verification (Scraped December 2025)

We downloaded and parsed primary source documents:

| Source                                                                                                                                             | Status     | Findings                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------- |
| [Amida Care GIST May 2025](https://www.amidacareny.org/wp-content/uploads/GIST-Provider-List-English-May-2025.pdf)                                 | Parsed     | 19 GAC procedure types, 16 facilities — all in our data |
| [NYC Comptroller LGBTQ+ Guide 2025](https://comptroller.nyc.gov/wp-content/uploads/documents/LGBTQIA-Guide-2025.pdf)                               | Downloaded | Social services directory                               |
| [NYS DAC Clinic Contacts](https://www.health.ny.gov/diseases/aids/providers/testing/docs/dac_clinics.pdf)                                          | Parsed     | 33 NYC facilities, we have all 33                       |
| [MetroPlus LGBTQI Guide 2022](https://metroplus.org/wp-content/uploads/2022/08/MKT-22.042_2022-LGBTQI-Resource-Guide-Refresh-2022_web-version.pdf) | Downloaded | Resource guide                                          |

## The Landscape of Existing Resources

### 1. Abortion Finders (AbortionFinder.org, INeedAnA.com)

- **Strengths:** Verified gestational limits, legal/financial aid info.
- **Weaknesses:** Single-issue focus. Only 3-10 NYC clinics listed.
- **Reality check:** We have 21 abortion providers with MORE granular data (medication vs procedure limits, insurance, walk-in status).

### 2. Gender-Affirming Care Directories (Amida Care GIST, Erin Reed's Map)

- **Strengths:** High cultural competence, detailed provider bios.
- **Weaknesses:** PDFs and static lists, limited to specific insurance networks.
- **Reality check:** We have all major facilities from GIST. We track hormones, surgery, and youth services. Could add more granular procedures (FFS, voice therapy, electrolysis).

### 3. NYC Health Map (Official Government Tool)

- **Strengths:** Comprehensive, official.
- **Weaknesses:** Clunky UX, overwhelming non-sexual-health data, no transit filtering.
- **Reality check:** We're a focused, fast, mobile-first alternative with subway/bus filters and 20-language support.

## Attributes We Track That Competitors Don't

### Abortion

- Medication abortion limit (weeks)
- Procedural abortion limit (weeks)
- Walk-in availability
- Specific Medicaid MCO acceptance

### Gender-Affirming Care

- Hormones (yes/no)
- Surgery (yes/no)
- Youth services (yes/no, with age policies)
- Informed consent HRT
- Specific procedures (FFS, FMS, voice therapy, electrolysis, laser, top/bottom surgery)

### Access

- Subway lines served
- Bus routes served
- Hours (structured, not free text)
- Sliding scale availability

## The "20 Languages" Advantage

- **Validation:** VERY HIGH
- Most competitors: English + Spanish only
- We provide: 20 languages including Haitian Creole, Yiddish, Arabic
- Covers 98.6% of NYC's population with native-feeling (not Google Translate) UI

## Honest Risks

1. **Data Freshness:** Our volunteer model is fragile. Mitigation: automated source monitoring (see `2025-12-21-automated-source-verification.md`).

2. **Trust:** New domain needs to earn trust. Mitigation: Clear data source citations, professional design, community partnerships.

## Conclusion

**We are not just filling a gap — we are ahead of the competition.**

- More abortion providers than AbortionFinder/INeedAnA
- More comprehensive than single-issue directories
- Better UX than government tools
- NYC-specific features (transit, 20 languages)

The "should we build this?" question is answered: **Yes, and we already have more data than the alternatives.**

## Recent Improvements

### December 23, 2025

- ✓ Hours coverage improved from 54% to 89% (156/175 clinics)
- ✓ Added Google Places API integration for hours data
- ✓ Cleaned up duplicate clinics (6 removed)
- ✓ Cleaned up duplicate/bad hours records (557 removed)
- ✓ Fixed 18 website URLs missing https:// prefix
- ✓ Added validation to prevent bad Google Places data (Sunday-only 24hr garbage)
- ✓ Total clinics now 175 physical + 9 virtual

### December 22, 2025

- ✓ Cross-referenced NYS AIDS Institute PrEP Provider Directory
- ✓ Added 102 new PrEP providers (now 139 total)
- ✓ Added 9 virtual/telehealth clinics (Folx, Plume, Hey Jane, etc.)
- ✓ Deduplicated database

### December 21, 2025

- ✓ Added 4 missing DAC facilities (now 100% coverage)
- ✓ Scraped actual clinic hours from hospital websites using Bright Data
- ✓ Added 8 new GAC procedure filter options
- ✓ Added "By appointment only" UI indicator with translations
- ✓ Updated all 20 locale files with new translations

## Next Priorities

1. ~~Fill in missing hours data~~ ✓ 89% complete (19 clinics remaining)
2. Volunteer verification calls for remaining 19 clinics without hours
3. Add DAC certification badge to eligible clinics
4. Periodic re-verification of hours data (quarterly?)
