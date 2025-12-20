# sexualhealth.nyc

An interactive map of sexual health clinics in NYC. Find free and low-cost STI testing, PrEP, and reproductive health services near you.

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript with Mapbox GL JS
- **Build System**: Vite
- **Hosting**: Vercel
- **Development Tool**: Tidewave

## Development Setup

### Prerequisites

- Node.js (see `.tool-versions` for version)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone git@github.com:Sexual-Health-NYC/sexualhealth.nyc.git
cd sexualhealth.nyc

# Install dependencies
npm install
```

### Running Locally

#### Option 1: Standard Development

```bash
npm run dev
```

This will start the Vite dev server at http://localhost:5173

#### Option 2: Development with Tidewave

Tidewave provides an enhanced development experience with AI-powered code assistance.

**Terminal 1 - Run Vite:**

```bash
npm run dev
```

**Terminal 2 - Tidewave Desktop App:**

1. Download and open [Tidewave](https://tidewave.ai/install) desktop app
2. Connect to http://localhost:5173

**Terminal 3 - Claude Code (Optional):**

```bash
claude
```

The Tidewave MCP server is configured in `~/.claude/claude_mcp_config.json` and will be available in Claude Code.

### Building for Production

```bash
npm run build
```

This builds the site to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

The site is automatically deployed to Vercel:

- **Production**: Merges to `main` branch automatically deploy to production
- **Preview**: Pull requests automatically get preview deployments with unique URLs

### Manual Deployment

If needed, you can deploy manually:

```bash
npm run build
npx vercel --prod
```

## Project Structure

```
sexualhealthnyc/
├── index.html              # Main landing page
├── test-embed.html         # Embeddable map component
├── clinics.geojson         # Clinic location data
├── public/                 # Static assets (served as-is)
├── data/                   # Source data files
├── pipeline/               # Data processing scripts
│   ├── upload_to_arcgis.py
│   └── requirements.txt
├── docs/                   # Documentation
├── vite.config.js          # Vite configuration
├── vercel.json             # Vercel deployment config (includes security headers)
├── .claude/                # Claude Code configuration
│   └── rules               # Rules for Tidewave integration
└── package.json
```

## Security Headers

The site is configured with the following security headers (see `vercel.json`):

- **Content-Security-Policy**: Restricts resource loading to trusted sources (Mapbox, GoatCounter analytics)
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Referrer-Policy**: Controls referrer information sent to other sites

## Data Pipeline

The `pipeline/` directory contains scripts for processing and uploading clinic data:

```bash
cd pipeline
pip install -r requirements.txt
python upload_to_arcgis.py
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
