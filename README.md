# Cedar Fort Digital — Stronghold™ website

Marketing site for Cedar Fort Digital and the Stronghold™ Governance Operations Suite.

- **Live site:** https://white-dune-0c55b5a10.7.azurestaticapps.net/
- **Custom domain:** www.cedarfortdigital.com (apex `cedarfortdigital.com` redirects to `www`)
- **Hosting:** Azure Static Web Apps

## Structure

Static HTML — no build step. Open `index.html` locally to preview.

```
index.html                       Homepage
governance-by-design.html         Governance by Design™ framework
products.html                    Products overview (5 components)
assurance-operations-engine.html Stronghold Assurance Operations Engine™
enforce.html                     Stronghold Enforce™
governance-core.html             Stronghold Governance Core™
oversight-intelligence.html      Stronghold Oversight Intelligence™
vendor-sentinel.html             Stronghold Vendor Sentinel™
standards.html                   Standards & Regulatory Alignment
government.html                  Government / Public Sector
about.html                       About + team
contact.html                     Contact / request a demo

assets/
  styles.css                     Design system
  site.js                        Minimal JS (mobile nav, form ack)

images/
  Logos/                         Cedar Fort + Stronghold + community logos
  Team Photographs/              Team portraits
  Graphics/                      Framework diagram, Jacksonville skyline
  icon-images/                   Iconography (SVG, tinted via CSS mask)
  web-backgrounds/               Optional background patterns
```

## Design system

- **Palette:** deep chocolate `#241810` + cream/ivory `#FAF6ED` + copper accent `#A0602C`
- **Typography:** Fraunces (display serif) + Inter (sans body)
- **Direction:** editorial, consulting-grade, light-led with selective dark sections for emphasis

## Deployment

Commits to `main` deploy automatically to the Azure Static Web App via GitHub Actions.
The workflow file is managed by Azure (added automatically when the SWA was linked to this repo).
