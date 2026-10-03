# Fired Arts · Regional Growth HQ

An authenticated React/Vite command center that separates the Fired Arts research archive from live campaigns, contacts, assets, metrics, and connected provider actions.

## Included surfaces

- Overview: regional-growth framing, outreach snapshot, PYOP radius, offer lanes, competitors, and 30-day timeline.
- Outreach: searchable working database with segment/status filters and target detail drawers.
- Competitors: direct, indirect, creative, partner, and regional positioning notes.
- Offers: Fired Arts To Go, school tile-wall fundraising, homeschool curriculum, Senior Socials, adult nights, downtown packages, and pickup retention.
- Operations: all-inclusive pricing, one-week firing, 60-day pickup hold, birthday capacity, booking stack comparisons, and readiness checklist.
- Research → Original files: all 22 supplied CSV, XLSX, HTML, and DOCX files remain available in their original formats with open and download actions.
- Fire Creator Suite: Gemini-backed content drafts, evidence-grounded insights, critique, Imagen generation, cloud assets, planning, and reusable templates.
- Connections: Google Analytics, Calendar, Gmail draft handoff, Meta insights, and provider post verification through authenticated server endpoints.

## Run locally

```bash
npm install
npm run dev
```

Production use requires Firebase, Gemini, Google, Meta, and Vercel variables. Follow [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md). When configuration is missing, the app shows a setup gate rather than falling back to demo data.

## Design direction

Deep ink navigation rail, warm paper canvas, cobalt, terracotta, marigold, and editorial serif typography. Fired Arts brand imagery is preserved under `public/brand/`; approved and AI-generated campaign imagery is stored in the protected Firebase asset library with provenance labels.
