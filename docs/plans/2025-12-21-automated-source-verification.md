# Automated Source Verification System

## Problem

Volunteer verification doesn't scale. We need automated checks to catch changes between human verification cycles.

## Goal

Build a trust-based system where sources that previously matched verified data can auto-update when they change.

## Design

### Trust Model

For each (clinic, field, source) tuple, track:

- `source_value_at_verification`: What the source said when volunteer verified
- `verified_value`: What volunteer confirmed as correct
- `trusted`: Boolean - did source match verified value?

When source changes:

- If `trusted` → auto-update, log change, notify owner
- If not `trusted` → flag for human review only

### Data Structure

```json
{
  "clinic_id": "rec123",
  "field": "hours",
  "source": "callen-lorde.org",
  "source_value_at_verification": "Mon-Fri 9-5",
  "verified_value": "Mon-Fri 9-5",
  "verified_at": "2025-12-01",
  "trusted": true
}
```

Store in: Airtable "Source Snapshots" table or JSON file in repo

### Sources to Monitor

Priority sources with structured/scrapable data:

1. NYC H+H locations API (if exists)
2. Planned Parenthood location finder
3. Callen-Lorde website
4. NYC DOH clinic pages
5. Individual clinic websites (harder, less structured)

### GitHub Action

Weekly cron job:

1. Fetch current values from known sources
2. Compare against last snapshot
3. If changed:
   - Check trust status
   - If trusted: update Airtable, regenerate clinics.geojson, create PR
   - If untrusted: create GitHub issue for review
4. Update snapshots

### Notification Options

1. **GitHub Issues** - Simple, trackable
2. **Email via Resend** - Already have this set up
3. **Linear** - If project moves there

### Implementation Steps

1. [ ] Create Source Snapshots table in Airtable (or JSON file)
2. [ ] Build scraper for 2-3 priority sources (H+H, PP, Callen-Lorde)
3. [ ] Create `scripts/check-sources.js` that:
   - Fetches current source values
   - Compares to snapshots
   - Outputs diff report
4. [ ] Create GitHub Action workflow on weekly cron
5. [ ] Add trust marking to volunteer verification flow
6. [ ] Build auto-update logic for trusted sources

### Open Questions

- How to handle sources that are sometimes right, sometimes wrong?
- Should we track trust per-field or per-source overall?
- How to bootstrap trust for existing data? Mark all current matches as trusted?
- Rate limiting / politeness for scraping?

### Risks

- Websites change structure → scrapers break
- False positives flood owner with notifications
- Trusted source makes mistake → bad data propagates

Mitigation: Start conservative (flag everything), build trust over time
