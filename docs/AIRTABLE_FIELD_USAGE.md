# Airtable Field Usage Analysis

Generated: 2024-12-24

This document maps every Airtable field to its usage in the codebase.

---

## Summary

| Category         | Total Fields | Used   | Unused |
| ---------------- | ------------ | ------ | ------ |
| Basic Info       | 8            | 8      | 0      |
| Services         | 7            | 6      | 1      |
| Gender-Affirming | 12           | 11     | 1      |
| PrEP             | 3            | 3      | 0      |
| Abortion         | 7            | 4      | 3      |
| Insurance/Cost   | 7            | 4      | 3      |
| Access           | 4            | 2      | 2      |
| Location/Transit | 4            | 4      | 0      |
| Demographics     | 4            | 1      | 3      |
| Metadata         | 3            | 1      | 2      |
| **TOTAL**        | **59**       | **44** | **15** |

---

## Unused Fields (15 total)

These fields are fetched from Airtable but never displayed or used in filtering:

| Field                           | Category     | Potential Use                             |
| ------------------------------- | ------------ | ----------------------------------------- |
| `has_vaccines`                  | Services     | Could add vaccine filter/badge            |
| `gender_affirming_youth_policy` | GAC          | Text field - could display policy details |
| `in_clinic_abortion`            | Abortion     | Could distinguish from medication-only    |
| `abortion_medication_limit`     | Abortion     | Text version of max weeks                 |
| `abortion_procedure_limit`      | Abortion     | Text version of max weeks                 |
| `insurance_plans`               | Insurance    | Full list of accepted plans               |
| `medicaid_mcos`                 | Insurance    | Specific Medicaid MCOs accepted           |
| `medicaid_type`                 | Insurance    | straight/managed/both classification      |
| `express_testing`               | Access       | Could add as quick fact or filter         |
| `anonymous_testing`             | Access       | Could add as quick fact or filter         |
| `youth_friendly`                | Demographics | Could add as filter option                |
| `organization`                  | Demographics | Parent org name                           |
| `clinic_type`                   | Demographics | Classification of clinic                  |
| `data_sources`                  | Metadata     | Where data came from                      |
| `is_virtual`                    | Metadata     | Already handled by separate file          |

---

## Field Details by Category

### Basic Information

| Field        | Used | Components                                                                                                                             | How Used                               |
| ------------ | ---- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `id`         | YES  | ClinicMarkers, SearchAutocomplete, ClinicListView, VirtualClinicSection                                                                | Key prop, marker ID                    |
| `name`       | YES  | ClinicDetailPanel, ClinicServices, ClinicContact, ClinicAddress, ClinicPopup, SearchAutocomplete, VirtualClinicSection, ClinicListView | Display in headers, search, popups     |
| `address`    | YES  | ClinicAddress, ClinicPopup, SearchAutocomplete                                                                                         | Display, copy-to-clipboard, directions |
| `borough`    | YES  | ClinicAddress, SearchAutocomplete, ClinicListView, App                                                                                 | Display, filtering                     |
| `phone`      | YES  | ClinicContact, ClinicPopup, VirtualClinicSection                                                                                       | tel: links, call buttons               |
| `website`    | YES  | ClinicContact, VirtualClinicSection, ClinicPopup                                                                                       | External links                         |
| `hours`      | YES  | ClinicHours, ClinicStatusBadge, ClinicPopup, App                                                                                       | Schedule display, open now filtering   |
| `hours_text` | YES  | ClinicPopup                                                                                                                            | Fallback text display                  |

### Services

| Field               | Used | Components                                             | How Used                  |
| ------------------- | ---- | ------------------------------------------------------ | ------------------------- |
| `has_sti_testing`   | YES  | ClinicServices, ClinicPopup, App                       | Badge, filtering          |
| `has_hiv_testing`   | YES  | ClinicServices, ClinicPopup                            | Badge                     |
| `has_prep`          | YES  | ClinicServices, VirtualClinicSection, ClinicPopup, App | Badge, filtering          |
| `has_pep`           | YES  | ClinicServices, ClinicPopup                            | Badge                     |
| `has_contraception` | YES  | ClinicServices, VirtualClinicSection, App              | Badge, filtering          |
| `has_abortion`      | YES  | ClinicServices, App                                    | Badge, filtering          |
| `has_vaccines`      | NO   | -                                                      | Not displayed or filtered |

### Gender-Affirming Care

| Field                               | Used | Components                           | How Used                   |
| ----------------------------------- | ---- | ------------------------------------ | -------------------------- |
| `has_gender_affirming`              | YES  | VirtualClinicSection, App            | Badge, filtering           |
| `gender_affirming_youth`            | YES  | ClinicServices                       | Badge                      |
| `gender_affirming_hormones`         | YES  | ClinicServices, VirtualClinicSection | Badge                      |
| `gender_affirming_surgery`          | YES  | ClinicServices                       | Badge (legacy)             |
| `gender_affirming_informed_consent` | YES  | ClinicServices, VirtualClinicSection | Badge                      |
| `gender_affirming_top_surgery`      | YES  | ClinicServices                       | Badge                      |
| `gender_affirming_bottom_surgery`   | YES  | ClinicServices                       | Badge                      |
| `gender_affirming_ffs`              | YES  | ClinicServices                       | Badge                      |
| `gender_affirming_fms`              | YES  | ClinicServices                       | Badge                      |
| `gender_affirming_voice`            | YES  | ClinicServices                       | Badge                      |
| `gender_affirming_electrolysis`     | YES  | ClinicServices                       | Badge                      |
| `gender_affirming_laser`            | YES  | ClinicServices                       | Badge                      |
| `gender_affirming_youth_policy`     | NO   | -                                    | Text field never displayed |

### PrEP Services

| Field                | Used | Components                       | How Used              |
| -------------------- | ---- | -------------------------------- | --------------------- |
| `prep_ap_registered` | YES  | ClinicServices, ClinicQuickFacts | Badge, quick fact     |
| `prep_starter`       | YES  | ClinicServices                   | Badge (via filtering) |
| `prep_prescriber`    | YES  | ClinicServices                   | Badge (via filtering) |

### Abortion Services

| Field                           | Used | Components                | How Used                          |
| ------------------------------- | ---- | ------------------------- | --------------------------------- |
| `medication_abortion`           | YES  | VirtualClinicSection      | Badge                             |
| `abortion_medication_max_weeks` | YES  | VirtualClinicSection, App | Badge, gestational filtering      |
| `abortion_procedure_max_weeks`  | YES  | App                       | Gestational filtering             |
| `offers_late_term`              | YES  | App                       | Gestational filtering (24+ weeks) |
| `in_clinic_abortion`            | NO   | -                         | Not displayed                     |
| `abortion_medication_limit`     | NO   | -                         | Text version, not used            |
| `abortion_procedure_limit`      | NO   | -                         | Text version, not used            |

### Insurance & Cost

| Field              | Used | Components                            | How Used                   |
| ------------------ | ---- | ------------------------------------- | -------------------------- |
| `accepts_medicaid` | YES  | ClinicInsurance, ClinicQuickFacts     | Badge, filtering           |
| `accepts_medicare` | YES  | ClinicInsurance                       | Badge                      |
| `sliding_scale`    | YES  | ClinicInsurance, VirtualClinicSection | Badge                      |
| `no_insurance_ok`  | YES  | ClinicInsurance, ClinicQuickFacts     | Badge, highlighted         |
| `insurance_plans`  | NO   | -                                     | Full plan list never shown |
| `medicaid_mcos`    | NO   | -                                     | MCO breakdown never shown  |
| `medicaid_type`    | NO   | -                                     | Classification never used  |

### Access & Availability

| Field               | Used | Components                       | How Used                  |
| ------------------- | ---- | -------------------------------- | ------------------------- |
| `walk_in`           | YES  | ClinicQuickFacts, FilterControls | Quick fact, filter option |
| `appointment_only`  | YES  | ClinicHours                      | Warning badge             |
| `express_testing`   | NO   | -                                | Not displayed or filtered |
| `anonymous_testing` | NO   | -                                | Not displayed or filtered |

### Location & Transit

| Field       | Used | Components                        | How Used                    |
| ----------- | ---- | --------------------------------- | --------------------------- |
| `latitude`  | YES  | ClinicMarkers, ClinicAddress, Map | Map positioning, directions |
| `longitude` | YES  | ClinicMarkers, ClinicAddress, Map | Map positioning, directions |
| `transit`   | YES  | ClinicAddress, App                | Subway display, filtering   |
| `bus`       | YES  | ClinicAddress, App                | Bus display, filtering      |

### Demographics & Specialty

| Field            | Used | Components           | How Used                   |
| ---------------- | ---- | -------------------- | -------------------------- |
| `lgbtq_focused`  | YES  | VirtualClinicSection | Badge                      |
| `youth_friendly` | NO   | -                    | Not displayed or filtered  |
| `organization`   | NO   | -                    | Parent org never shown     |
| `clinic_type`    | NO   | -                    | Classification never shown |

### Metadata

| Field           | Used | Components              | How Used                                 |
| --------------- | ---- | ----------------------- | ---------------------------------------- |
| `last_verified` | YES  | ClinicVerificationBadge | Relative time display                    |
| `data_sources`  | NO   | -                       | Explicitly not used (comment in code)    |
| `is_virtual`    | NO   | -                       | Handled by separate virtual-clinics.json |

---

## Hours Table Fields

| Field          | Used | How Used                       |
| -------------- | ---- | ------------------------------ |
| `Clinic`       | YES  | Links to parent clinic         |
| `Department`   | YES  | Groups hours by department     |
| `Days of Week` | YES  | Day selection for display      |
| `Open Time`    | YES  | Opening time display           |
| `Close Time`   | YES  | Closing time display           |
| `All Day`      | YES  | 24-hour operation indicator    |
| `Notes`        | YES  | Additional context             |
| `Label`        | NO   | Auto-generated, not used in UI |

---

## Recommendations

### High-Value Unused Fields to Consider

1. **`express_testing`** - Valuable for users needing quick results
2. **`anonymous_testing`** - Important for privacy-conscious users
3. **`youth_friendly`** - Helps minors find appropriate services
4. **`has_vaccines`** - HPV/Hep vaccines are relevant to sexual health

### Low-Priority Unused Fields

1. **`organization`** / **`clinic_type`** - Mostly internal classification
2. **`data_sources`** - Administrative metadata
3. **`medicaid_mcos`** / **`medicaid_type`** - Too granular for most users
4. **`abortion_*_limit`** - Redundant with max_weeks fields

### Fields That Could Be Removed from Fetch

If storage/bandwidth is a concern, these could be dropped from the GeoJSON:

- `abortion_medication_limit` (text duplicate of max_weeks)
- `abortion_procedure_limit` (text duplicate of max_weeks)
- `data_sources` (explicitly not used)
- `is_virtual` (handled separately)
