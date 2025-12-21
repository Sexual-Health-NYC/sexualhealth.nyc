# Airtable Schema Update Plan

To support granular filtering for Gender-Affirming Care and PrEP, please add the following fields to the **Clinics** table in Airtable.

## 1. Gender-Affirming Care

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| `Gender Affirming Care (Youth)` | Checkbox | Specifically for minors (<18/19) |
| `Gender Affirming Hormones` | Checkbox | Offers HRT (Estrogen/Testosterone) |
| `Gender Affirming Surgery` | Checkbox | Offers surgical procedures |
| `Gender Affirming Youth Policy` | Single Line Text | e.g. "Existing patients only", "Waitlist", "Accepting new patients" |

## 2. PrEP Services

| Field Name | Type | Notes |
| :--- | :--- | :--- |
| `PrEP-AP Registered` | Checkbox | Is this provider registered with the PrEP Assistance Program? |

*(Note: We are inferring "PrEP Starter" vs "Prescriber" based on Clinic Type "DOH" vs others, so no new column needed for that).*

## 3. Implementation Steps

1.  **Add Columns:** Log into Airtable and add these 5 columns.
2.  **Populate Data:**
    *   For **NYU Langone**, check `Gender Affirming Care (Youth)` and set Policy to "Call to verify (policy in flux)".
    *   For **DOH Clinics**, ensure `Clinic Type` is "DOH" (auto-infers PrEP Starter).
    *   For **PrEP-AP**, use the NYS DOH PDF to check off registered clinics.
3.  **Deploy:** Run `npm run fetch-data` to pull the new fields into the app.
