# Localization (i18n) Plan for sexualhealth.nyc

## Executive Summary

Plan to add multilingual support to the React app, with initial focus on Spanish (largest non-English speaking demographic in NYC).

## 1. User-Visible Content Requiring Localization

### A. UI Strings (Code)

All hardcoded English strings in components:

**Service Labels:**

- STI Testing → Pruebas de ITS
- HIV Testing → Pruebas de VIH
- PrEP → PrEP
- PEP → PEP
- Contraception → Anticonceptivos
- Abortion → Aborto

**Insurance Labels:**

- Accepts Medicaid → Acepta Medicaid
- Accepts Medicare → Acepta Medicare
- No Insurance Required → No se requiere seguro
- Sliding Scale → Escala móvil

**Section Headers:**

- Services → Servicios
- Hours → Horario
- Insurance & Cost → Seguro y Costo
- Walk-ins → Atención sin cita
- Contact → Contacto
- Address → Dirección
- Phone → Teléfono
- Website → Sitio web

**Action Buttons:**

- Open in Maps → Abrir en Mapas
- Copy address → Copiar dirección
- Copied! → ¡Copiado!
- Call Now → Llamar ahora
- Visit Website → Visitar sitio web
- Get Directions → Obtener direcciones
- Apply → Aplicar
- Clear All → Borrar todo
- Map → Mapa
- List → Lista

**Status Messages:**

- Unknown - contact clinic to verify → Desconocido - contacte a la clínica para verificar
- Walk-ins accepted → Se aceptan visitas sin cita
- Open → Abierto
- Closed → Cerrado
- Opens at [time] → Abre a las [time]
- Closes at [time] → Cierra a las [time]

**Filter/Search:**

- Filter clinics → Filtrar clínicas
- [N] clinics found → [N] clínicas encontradas
- No clinics match your filters → Ninguna clínica coincide con sus filtros

### B. Data Enum Values (GeoJSON)

**Borough Names (shown in filters and addresses):**

- Manhattan → Manhattan
- Brooklyn → Brooklyn
- Queens → Queens
- Bronx → El Bronx / Bronx
- Staten Island → Staten Island

**Note:** Borough names are typically NOT translated in NYC (even Spanish speakers say "Brooklyn", "Queens"). Consider keeping English but allowing override.

### C. Content NOT Requiring Localization

**Internal metadata (not shown to users):**

- `clinic_type` (DOH, HIV Testing, etc.)
- `data_source` (NYC Open Data, etc.)
- Boolean field names (`has_sti_testing`, `accepts_medicaid`, etc.)

**Clinic-specific data (entered by clinics):**

- Clinic names (keep original)
- Addresses (keep original - official USPS format)
- Phone numbers (format-only localization)
- Website URLs (keep original)
- Hours text (special case - see below)

### D. Special Case: Hours Field

Current: Freeform English text like "Monday-Friday 9am-5pm"

**Option 1 - Keep English with disclaimer:**

- Add note: "Hours listed in English" / "Horario en inglés"
- Quickest solution, no data migration

**Option 2 - Structured data (future enhancement):**

- Migrate to structured format:
  ```json
  "hours": {
    "monday": { "open": "09:00", "close": "17:00" },
    "tuesday": { "open": "09:00", "close": "17:00" }
  }
  ```
- Display localized: "lunes-viernes 9am-5pm"
- Requires data migration script

**Recommendation:** Start with Option 1, plan Option 2 for future.

## 2. Technology Recommendations

### react-i18next (RECOMMENDED)

**Why:**

- Industry standard for React i18n
- Hooks-based API (`useTranslation()`)
- Lazy loading of translations
- Pluralization support
- Namespace support for code splitting
- 11k+ stars, actively maintained

**Installation:**

```bash
npm install react-i18next i18next i18next-http-backend
```

**Basic Usage:**

```jsx
import { useTranslation } from "react-i18next";

function Component() {
  const { t } = useTranslation();
  return <h1>{t("services.stiTesting")}</h1>; // → "STI Testing" or "Pruebas de ITS"
}
```

### Alternative: react-intl (FormatJS)

**Pros:**

- Better number/date formatting
- ICU message format

**Cons:**

- More complex API
- Heavier bundle size
- Overkill for our needs

**Verdict:** Not recommended for this project.

## 3. Implementation Architecture

### File Structure

```
src/
  locales/
    en/
      common.json       # UI strings
      services.json     # Service labels
      insurance.json    # Insurance labels
      sections.json     # Section headers
      actions.json      # Buttons/actions
      messages.json     # Status messages
    es/
      common.json
      services.json
      insurance.json
      sections.json
      actions.json
      messages.json
  i18n.js              # i18next config
  components/
    LanguageSwitcher.jsx  # Language toggle component
```

### Translation File Example

**src/locales/en/services.json:**

```json
{
  "stiTesting": "STI Testing",
  "hivTesting": "HIV Testing",
  "prep": "PrEP",
  "pep": "PEP",
  "contraception": "Contraception",
  "abortion": "Abortion"
}
```

**src/locales/es/services.json:**

```json
{
  "stiTesting": "Pruebas de ITS",
  "hivTesting": "Pruebas de VIH",
  "prep": "PrEP",
  "pep": "PEP",
  "contraception": "Anticonceptivos",
  "abortion": "Aborto"
}
```

### Component Refactoring Pattern

**Before:**

```jsx
const services = [];
if (clinic.has_sti_testing)
  services.push({ label: "STI Testing", bgColor: ... });
```

**After:**

```jsx
const { t } = useTranslation('services');
const services = [];
if (clinic.has_sti_testing)
  services.push({ label: t('stiTesting'), bgColor: ... });
```

### Handling Data Enum Values

**Approach 1 - Translation lookup (RECOMMENDED):**

Keep borough names in English in GeoJSON, translate at display time:

```jsx
const { t } = useTranslation("locations");

// In filter options
const boroughOptions = [
  { value: "Manhattan", label: t("boroughs.manhattan") },
  { value: "Brooklyn", label: t("boroughs.brooklyn") },
  // ...
];

// In clinic display
<p>
  {clinic.address}
  <br />
  {t(`boroughs.${clinic.borough}`)}, NY
</p>;
```

**Translation files:**

```json
// en/locations.json
{
  "boroughs": {
    "Manhattan": "Manhattan",
    "Brooklyn": "Brooklyn",
    "Queens": "Queens",
    "Bronx": "Bronx",
    "Staten Island": "Staten Island"
  }
}

// es/locations.json
{
  "boroughs": {
    "Manhattan": "Manhattan",
    "Brooklyn": "Brooklyn",
    "Queens": "Queens",
    "Bronx": "El Bronx",
    "Staten Island": "Staten Island"
  }
}
```

**Approach 2 - Store translations in GeoJSON (NOT RECOMMENDED):**

Would require:

- Duplicating data: `borough: "Bronx", borough_es: "El Bronx"`
- Data bloat
- Complex data migration
- Hard to add new languages

**Verdict:** Use Approach 1 (lookup table).

## 4. Language Detection & Persistence

### Language Detection Strategy

**Priority order:**

1. User's explicit selection (if previously set)
2. Browser language (`navigator.language`)
3. Default to English

```js
// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "es"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    // ... resources
  });
```

### Language Switcher UI

**Location:** Top-right corner of FilterBar, next to Map/List toggle

**Design:**

```jsx
function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      aria-label="Select language"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
```

**Alternative (if more languages added later):** Dropdown with flags

## 5. Implementation Phases

### Phase 1: Setup & Infrastructure (1-2 hours)

- [ ] Install react-i18next dependencies
- [ ] Create `src/i18n.js` configuration
- [ ] Create `src/locales/en/` and `src/locales/es/` directory structure
- [ ] Add LanguageSwitcher component to FilterBar
- [ ] Test language switching works

### Phase 2: Extract UI Strings (2-3 hours)

- [ ] Create all English translation JSON files
- [ ] Refactor FilterBar to use `t()`
- [ ] Refactor ClinicDetailPanel to use `t()`
- [ ] Refactor ClinicBottomSheet to use `t()`
- [ ] Refactor ClinicMarkers tooltips to use `t()`
- [ ] Refactor ClinicListView to use `t()`
- [ ] Refactor App.jsx (Map/List toggle, aria labels) to use `t()`
- [ ] Test all components in English

### Phase 3: Spanish Translations (2-3 hours)

- [ ] Translate all JSON files to Spanish
- [ ] Review translations with native Spanish speaker
- [ ] Test all components in Spanish
- [ ] Fix any layout issues (Spanish text often longer)

### Phase 4: Hours Field Handling (30 min)

- [ ] Add "Hours listed in English" note when locale is Spanish
- [ ] Update Hours section with conditional note

### Phase 5: Testing & Refinement (1-2 hours)

- [ ] Test language switching on all pages
- [ ] Test RTL layout (if adding Arabic/Hebrew later)
- [ ] Test with screen readers in both languages
- [ ] Fix any overflow/layout issues
- [ ] Verify localStorage persistence works

### Phase 6: Documentation (30 min)

- [ ] Document translation workflow for contributors
- [ ] Create CONTRIBUTING_TRANSLATIONS.md guide
- [ ] Add instructions for adding new languages

**Total Estimated Time:** 8-12 hours

## 6. Future Enhancements

### Additional Languages

Based on NYC demographics, priority order:

1. Spanish (done in Phase 3)
2. Chinese (Simplified) - 普通话
3. Russian - Русский
4. Bengali - বাংলা
5. Haitian Creole - Kreyòl Ayisyen
6. Korean - 한국어

### Structured Hours Data

- Migrate hours field to structured JSON
- Enable localized day/time formatting
- Add hours parsing/validation

### Localized Content Management

- Add CMS for clinic staff to provide translated hours/notes
- Store translations in Airtable
- Sync to GeoJSON with locale fields

### SEO & URLs

- Add language prefix to URLs (`/es/`, `/zh/`)
- Add `<html lang="es">` attribute switching
- Add hreflang meta tags for SEO

## 7. Translation Quality Assurance

### Professional Translation Needed

- Service labels (medical terminology must be accurate)
- Insurance terminology (legal/financial accuracy critical)
- Action button text (UX clarity)

### Community Review

- Partner with NYC health organizations serving Spanish-speaking communities
- Review with Destination Tomorrow, Callen-Lorde, etc.
- User testing with target demographic

### Translation Memory

- Use consistent terminology across all strings
- Maintain glossary:
  - PrEP → PrEP (keep acronym, not "profilaxis previa a la exposición")
  - PEP → PEP (keep acronym, not "profilaxis posterior a la exposición")
  - STI → ITS (Infecciones de transmisión sexual)
  - Medicaid → Medicaid (proper noun)

## 8. Accessibility Considerations

### Screen Reader Support

- Ensure lang attribute changes: `<html lang="es">`
- Test with screen readers in both languages
- ARIA labels must be translated

### Font Support

- Current fonts (Inter, Montserrat) support Spanish characters (á, é, í, ó, ú, ñ, ¿, ¡)
- For future languages: verify font coverage (Chinese requires different fonts)

### Right-to-Left (RTL) Support

- Not needed for Spanish
- If adding Arabic/Hebrew: use CSS logical properties
- Test with `dir="rtl"` attribute

## 9. Bundle Size Impact

### Estimated Bundle Size Increase

**Current bundle:** ~150KB (main.js)

**After i18n:**

- react-i18next: +15KB (gzipped)
- Translation JSONs: ~10KB per language (lazy loaded)
- Total increase: ~25-30KB for English + Spanish

**Mitigation:**

- Lazy load translation files (only load active language)
- Use namespace splitting (load only needed translations per route)
- Tree-shake unused i18next features

## 10. Open Questions / Decisions Needed

1. **Borough name translation:** Keep English or translate?
   - Recommendation: Keep English (NYC standard)

2. **Hours field strategy:** English-only with note, or structured data?
   - Recommendation: English-only for v1, structured later

3. **Language switcher placement:** FilterBar or dedicated header?
   - Recommendation: FilterBar top-right

4. **Default language:** Browser detection or always English?
   - Recommendation: Browser detection with localStorage override

5. **Translation provider:** Professional service or community?
   - Recommendation: Professional for medical terms, community review

6. **Additional languages:** Which to prioritize after Spanish?
   - Recommendation: Chinese (Simplified) based on NYC demographics

## 11. Success Metrics

### Post-Launch Tracking

- Language switcher usage rate
- % of sessions in Spanish vs English
- Bounce rate by language
- Clinic detail views by language
- Geographic distribution of Spanish users

### Goals

- 20%+ of users select Spanish within 3 months
- No increase in bounce rate for Spanish users
- Positive feedback from Spanish-speaking community orgs
