# sexualhealth.nyc

An interactive map of sexual health clinics in NYC. Find free and low-cost STI testing, PrEP, and reproductive health services near you.

## Tech Stack

- **Frontend**: React (Vite)
- **Internationalization**: i18next (20 languages supported)
- **Map**: Mapbox GL JS / react-map-gl
- **Styling**: Standard CSS with theme-based variables
- **Hosting**: Vercel

...

## Data Pipeline

The `pipeline/` directory contains scripts for processing clinic data and maintaining translations:

### Data Management
```bash
# Fetch latest clinic data from Airtable
npm run fetch-data
```

### Translation Maintenance
We support 20 languages 100%. To maintain this coverage:

1. **Check for missing strings**:
   ```bash
   python3 pipeline/check_static_translations.py
   ```
   This scans the code for `t()` calls and identifies keys missing from any language.

2. **Sync dynamic data**:
   ```bash
   python3 pipeline/manage_dynamic_translations.py
   ```
   This harvests unique strings from the clinic data (like subway lines or special notes) and syncs them to the dynamic locales.

3. **Apply manual translations**:
   ```bash
   python3 pipeline/apply_translations.py
   ```
   This script contains a dictionary of translations for core UI elements and applies them across all 20 languages.

## Project Structure

```
sexualhealthnyc/
├── src/                    # React source code
│   ├── components/         # UI components
│   ├── store/              # State management (Zustand)
│   ├── utils/              # Business logic (hours, etc.)
│   └── i18n.js             # Translation config
├── public/
│   └── locales/            # Translation JSON files (20 languages)
├── pipeline/               # Data and translation scripts
│   ├── check_static_translations.py
│   ├── apply_translations.py
│   └── manage_dynamic_translations.py
├── data/                   # Source data files
├── docs/                   # Documentation
└── ...
```

## Tidewave Configuration

Tidewave is configured for this project with:

- **Vite Plugin**: Enabled in `vite.config.js`
- **MCP Server**: Configured for Claude Code integration
- **Claude Rules**: Custom rules in `.claude/rules` for optimal AI assistance

Note: Tidewave is a development-only tool and is not included in production builds.

## Contact Form Setup

The site includes a serverless contact form at `/contact.html` that submits corrections via `/api/submit-correction`.

### Setting up Email Notifications

1. **Sign up for Resend**: Go to https://resend.com and create a free account (3,000 emails/month free)
2. **Get API Key**: https://resend.com/api-keys
3. **Add to local dev** (optional):
   ```bash
   cp .env.example .env
   # Edit .env and add your RESEND_API_KEY
   ```
4. **Add to Vercel**:
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add `RESEND_API_KEY` with your key value
   - Redeploy

### Verify Domain for Sending (Optional)

To send from `corrections@sexualhealth.nyc` instead of a Resend domain:

1. Go to https://resend.com/domains
2. Add `sexualhealth.nyc`
3. Add the DNS records they provide to your domain
4. Once verified, emails will send from `corrections@sexualhealth.nyc`

Until then, emails send from `onboarding@resend.dev` (still works, just looks less professional).

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Push and create a pull request
4. Wait for preview deployment to verify changes
5. Merge to `main` for production deployment

## License

ISC
