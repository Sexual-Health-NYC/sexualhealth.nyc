# Missing Data Fields

The current `clinics.geojson` is missing critical fields specified in `PLAN.md`. The UI has filters for these fields, but they don't work because the data doesn't exist.

## Currently Missing Fields

### Insurance (CRITICAL - filters exist but don't work!)

- `accepts_medicaid` (boolean) - UI filter exists
- `medicaid_type` (string: "straight" | "managed" | "both") - For Straight Medicaid vs Managed Medicaid (MCOs)
- `medicaid_mcos` (string) - Specific MCOs like "Healthfirst, Fidelis, MetroPlus"
- `accepts_medicare` (boolean) - UI filter exists
- `sliding_scale` (boolean) - UI filter exists
- `no_insurance_ok` (boolean) - UI filter exists

### Services (CRITICAL - filters exist but don't work!)

- `has_contraception` (boolean) - UI filter exists
- `has_abortion` (boolean) - UI filter exists

### Verification & Quality

- `insurance_verified` (string: "confirmed" | "listed" | "unknown")
- `last_verified` (date)
- `verified_by` (string: "phone" | "website" | "government_data")

### Special Populations

- `lgbtq_focused` (boolean)
- `youth_friendly` (boolean)
- `anonymous_testing` (boolean)

### Transit

- `transit` (string) - Nearest subway/bus info
- `nearest_subway` (string)
- `nearest_bus` (string)

## Current Schema (what exists)

```json
{
  "name": "string",
  "address": "string",
  "borough": "string",
  "phone": "string",
  "website": "string",
  "clinic_type": "string",
  "has_sti_testing": "boolean",
  "has_hiv_testing": "boolean",
  "has_prep": "boolean",
  "has_pep": "boolean",
  "hours": "string",
  "walk_in": "boolean|null",
  "data_source": "string",
  "notes": "string"
}
```

## Data Quality Issues (Urgent)

### Email Addresses in Phone Field (8 clinics)

**Privacy Risk:** Individual staff emails are exposed publicly in the phone field, will get spammed.

Examples:

- `sean@destinationtomorrow.org, asantiago@destinationtomorrow.org, ...`
- `ahardikar@callen-lorde.org, ngoykhberg@callen-lorde.org, ashardikar@gmail.com`

**Fix Needed:**

- Separate general clinic contact emails (info@, contact@) from individual staff contacts
- Add `contact_email` field for public general email
- Add `internal_contacts` field (not displayed) for staff emails used during data verification
- Remove all emails from `phone` field

Run `node scripts/validate-data.js` to see full list.

### Incomplete Addresses (9 clinics)

Missing city, state, zip - won't work in map apps or clipboard copy.

Examples:

- `356 West 18th Street` → Should be `356 West 18th Street, New York, NY 10011`
- `452 E 149th St` → Should be `452 E 149th St, Bronx, NY 10455`

**Fix Needed:** Add full addresses with city, state, zip to all clinics.

Run `node scripts/validate-data.js` to see full list.

## Next Steps

1. **Data Collection** - Per PLAN.md, this requires:
   - Scraping clinic websites
   - Phone calls to verify (especially for Medicaid MCOs)
   - Prioritize high-traffic clinics (Planned Parenthood, DOH clinics)

2. **Immediate Fix** - Can add these fields with `null` values as placeholders:

   ```bash
   # Add missing boolean fields with null defaults
   # Add string fields with empty string defaults
   ```

3. **UI Update** - Once data exists:
   - Split "Accepts Medicaid" into "Straight Medicaid" and "Managed Medicaid" filters
   - Show MCO names if available in clinic details

## Medicaid Nuance (from PLAN.md)

This is **critical** for NYC:

- **Straight Medicaid** - Direct government coverage
- **Managed Medicaid** - Through MCOs (Healthfirst, Fidelis, MetroPlus, etc.)

**Some clinics accept one but not the other.** This is the difference between getting care and getting turned away.
