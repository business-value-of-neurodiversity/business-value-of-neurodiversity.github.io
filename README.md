# Innovating Pittsburgh 2026

Website for the *Innovating Pittsburgh: The Business Value of Neurodiversity* forum
(March 4, 2026, Carnegie Mellon University). Rebuilt from the original Google Site as a
static site: **Eleventy** (build) + **Sveltia CMS** (editing UI) + **Git/GitHub** (storage, history, deploys).

```
Editor ──► Sveltia CMS (/admin) ──► Git commit on GitHub ──► GitHub Action ──► Eleventy build ──► Published site
```

## Quick start (developers)

```bash
npm install
npm start          # http://localhost:8080  (live reload)
npm run build      # outputs ./_site
```

Edit content without a login while developing: open <http://localhost:8080/admin/>, choose
**Work with Local Repository** (Chrome/Edge), and select this folder. Changes are written to files on disk.

## Site structure

```
/                         Home: series logo, mission, audience, featured upcoming forum, links to past forums
/events/                  Past Events (list of past editions)
/events/2026/ ...         One folder of pages per edition: overview, schedule/, speakers/,
/events/2027/ ...         event-details/, event-sponsors/, organizers/
/resources/               Resources
/about/                   About Us
```

**Main nav (5 items):** Home · Upcoming: *<next edition>* · Past Events ▾ · Resources · About Us.
The "Upcoming" item and the Past Events dropdown are generated from each edition's **Status**
(`src/_data/editions/<year>/event.json`): `planned` or `published` = upcoming, `past` = past.
The upcoming edition is the soonest one that is not `past`. When a forum has taken place, an editor sets its Status to `past`
and it moves into the Past Events menu automatically; the next `planned` edition becomes "Upcoming".

Pages inside an edition (`/events/<year>/...`) show **only** that edition's own header (edition name, its section links, and a red **← Back to Home** pill at the far left) instead of the site-wide nav; the header is `src/_includes/partials/edition-header.njk`.

**Responsive:** at 900px and narrower (tablets, phones) both headers collapse behind a **Menu** / **Sections** button (small script at the bottom of `src/_includes/layouts/base.njk`; without JavaScript the nav simply stays visible). The responsive rules are at the end of `src/assets/css/style.css`.

All editions share one set of page templates (`src/events/event-*.njk`); only the data differs.
Old top-level URLs such as `/schedule/` redirect to `/events/2026/...`.

## Where things live

| What | Where | Who edits |
|---|---|---|
| Home page text (mission, audience), Resources, About Us | `src/_data/series.json`, `resources.json`, `about.json` | **Content editors**, via `/admin` |
| Series logo and host logos | `src/assets/images/series/` | **Content editors** (upload) |
| One edition's text, schedule, prices, sponsors, hosts | `src/_data/editions/<year>/*.json` | **Content editors**, via `/admin` |
| One edition's speaker & organizer bios, photos, order | `src/editions/<year>/{speakers,organizers}/*.md` | **Content editors**, via `/admin` |
| Images and logos | `src/assets/images/editions/<year>/` | **Content editors**, via `/admin` |
| Page layouts and components | `src/_includes/layouts/`, `src/_includes/partials/`, `src/events/*.njk`, `src/index.njk` | Developers |
| Colors, fonts, spacing | `src/assets/css/style.css` | Developers (or a web designer) |
| Edition section menu, favicon, global site name | `src/_data/site.json` | Developers |
| Which editions exist / menu order | `src/_data/events.json` (managed by `npm run new-edition`) | Developers |
| Build, collections, URLs | `eleventy.config.js` | Developers |
| CMS form definitions | `src/admin/config.yml` (per-edition blocks generated from `scripts/edition-template/cms.yml`) | Developers |
| Deploy pipeline | `.github/workflows/deploy.yml` | Developers |

## Adding a new edition

```bash
npm run new-edition -- 2028          # or: npm run new-edition -- 2028 October
```

This creates blank data for the edition, registers it in the Events menu, and adds its forms to the CMS.
Editors then fill it in at `/admin` and switch its **Status** from `planned` to `published` when ready.
Commit the result. (March 2027 was created this way.)

**See [docs/ROLES.md](docs/ROLES.md)** for the full split of responsibilities,
[docs/EDITOR-GUIDE.md](docs/EDITOR-GUIDE.md) for non-technical editors, and
[docs/OPERATIONS.md](docs/OPERATIONS.md) for one-time setup and maintenance.

## Notes from the migration

- The original site had a duplicate/legacy `speakers-1` page ("Meet the Experts"); it was not carried over.
- Source typo preserved: the organizers blurb reads "nothing with us without us" (probably intended "nothing about us without us").
- The sponsor logos' tier assignment (mespace → *Opportunity Amplifier*; the other three → *Community Allies*) was inferred from page order; please verify.
- Shawnte Knox's photo could not be downloaded from Google (HTTP 403) so a placeholder with initials is shown. Add one in `/admin → Organizers`.
- Parking/lodging hyperlinks on the original Event Details page were not retrievable and are not included.
- The series logo (`src/assets/images/series/forum-series-logo.png`) was derived from the 2026 logo by erasing the "March 4, 2026" line. Replace it with an official dateless logo when available (in `/admin`, Site-wide pages → Home page).
- The home page mission statement, audience descriptions, and the Resources/About Us copy were drafted from the original site's wording; please review and edit.
