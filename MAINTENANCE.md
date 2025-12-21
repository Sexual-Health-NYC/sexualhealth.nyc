# Ongoing Maintenance Guide

This guide covers the routine tasks required to keep **sexualhealth.nyc** accurate, up-to-date, and fully localized.

## 1. Updating Clinic Data

The canonical source of truth for all clinic data is **Airtable**.

### Step A: Edit Data in Airtable
1.  Log in to the [Airtable Base](https://airtable.com/).
2.  **Add/Edit Clinics:** Use the `Clinics` table. Ensure you fill out:
    *   **Clinic Name:** Official name.
    *   **Core Info:** Phone, Website, Address (Coordinates are auto-calculated if you have the script, otherwise enter manually).
    *   **Services:** Check all that apply.
    *   **Hours:** Link to records in the `Hours` table.
3.  **Edit Hours:** Use the `Hours` table.
    *   Create a record for each schedule (e.g., "General", "Walk-in").
    *   Link it to the Clinic.
    *   Set Days, Open Time, Close Time.

### Step B: Sync Data to App
Once Airtable is updated, you must pull the data into the application.

1.  **Run the Fetch Script:**
    ```bash
    npm run fetch-data
    ```
    *This pulls data from Airtable and updates `public/clinics.geojson`.*

2.  **Verify:**
    *   Check the terminal output for summary stats.
    *   Run `npm run dev` to see the changes locally.

3.  **Commit & Deploy:**
    ```bash
    git add public/clinics.geojson
    git commit -m "data: Update clinic data from Airtable"
    git push
    ```
    *Vercel will automatically deploy the changes.*

---

## 2. Managing Translations

The app supports **20 languages**. Some text (like "STI Testing") is static, but other text (like "Women's Health Department") comes from the data.

### Step A: Identify New Strings
When you add new clinic types or department names in Airtable, they need to be translated.

1.  **Run the Harvest Script:**
    ```bash
    python3 pipeline/manage_dynamic_translations.py
    ```
2.  **Check Output:**
    *   **✅ All languages are fully synced!** -> You are done.
    *   **⚠️ [Lang]: missing X strings** -> proceed to Step B.
    *   If new strings are found, the script creates `pipeline/missing_translations.json`.

### Step B: Translate
1.  **Get Translations:** Take the list from `pipeline/missing_translations.json` and translate them (using an LLM like Claude/ChatGPT or a human).
2.  **Update Files:**
    *   Open `public/locales/{lang}/dynamic.json`.
    *   Add the new key-value pair.
    *   *Example:* `"Women's Health": "Salud de la mujer"` (for Spanish).

### Step C: Deploy Translations
```bash
git add public/locales/
git commit -m "i18n: Update dynamic translations"
git push
```

---

## 3. Volunteer Management

We rely on volunteers to verify data.

*   **Volunteer Guide:** Share `docs/VOLUNTEER_GUIDE.md` with new volunteers.
*   **Target List:** Run this script to generate a fresh list of clinics with missing data:
    ```bash
    python3 pipeline/data_completeness_report.py
    ```
    *This updates `docs/VOLUNTEER_CALL_LIST.md`.*

---

## 4. Troubleshooting

### "Hours not showing"
*   Check Airtable: Is the `Hours` record actually linked to the `Clinic` record?
*   Run `npm run fetch-data`.

### "Map not loading"
*   Check `VITE_MAPBOX_TOKEN` in `.env`.
*   Ensure `clinics.geojson` is valid JSON.

### "Translation missing key"
*   Run `python3 pipeline/manage_dynamic_translations.py` to see if it catches it.
*   Check `public/locales/en/dynamic.json` to see if the key exists there.
