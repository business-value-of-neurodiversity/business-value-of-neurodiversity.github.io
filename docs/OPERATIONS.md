# Operations: one-time setup & maintenance (developers)

## 1. One-time setup

1. **Create the GitHub repo** and push this project (`main` branch).
2. `src/admin/config.yml` already points at `business-value-of-neurodiversity/business-value-of-neurodiversity.github.io`; update `backend.repo`, `site_url` and `display_url` if the repo or domain ever changes.
3. **GitHub Pages:** the repo is named `business-value-of-neurodiversity.github.io`, so GitHub serves it as the organization site at `https://business-value-of-neurodiversity.github.io/` (domain root, no path prefix).
   Settings → Pages → Source: *GitHub Actions*. The workflow in `.github/workflows/deploy.yml` builds with no prefix. If you later use a project repo instead, set `PATH_PREFIX=/<repo>/` in the workflow.
4. **Give editors access:** add them as collaborators (write access) — or have them use a fine-grained
   Personal Access Token limited to this repo (Contents: read/write). Sveltia supports *Sign In Using Access Token*
   with no extra infrastructure.
5. **Optional "Sign in with GitHub" button:** deploy an OAuth proxy such as
   [`sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth) (Cloudflare Worker), register a GitHub OAuth app,
   and set `backend.base_url` in `config.yml` to the worker's URL.
6. **Optional review step:** protect `main` and let editors work on a branch/PR — note that Sveltia commits directly
   to the configured branch, so keep this simple unless review is required.

## 2. Day-to-day

- Editors save → a commit on `main` → the Action rebuilds → live in 1–2 minutes. Watch the *Actions* tab if it doesn't.
- To roll back: revert the commit on GitHub (the Action redeploys automatically).
- `npm run build` locally before merging developer changes; the build fails loudly on template errors.

## 3a. Starting a new edition (e.g. March 2028)

1. `npm run new-edition -- 2028` (see `scripts/new-edition.mjs`). It is idempotent and never overwrites existing files.
2. Check `git diff`: new `src/_data/editions/2028/`, `src/editions/2028/`, a new entry in `src/_data/events.json`, and three new collections in `src/admin/config.yml`.
3. Commit and push. Editors now see "2028 · Page content / Speakers / Organizers" in `/admin`.
4. Optionally copy last year's data (`cp src/_data/editions/2027/hosts.json ...`) to pre-fill recurring items such as hosts.
5. Editors switch **Status** to `published` when the edition is ready (removes the "details coming soon" banner).

To change what a *blank* edition looks like, edit `scripts/edition-template/` (existing editions are not affected).

## 3. Changing the content model (keep these three in sync)

| Step | File |
|---|---|
| 1. Add the data field | `src/_data/editions/<year>/<file>.json` (or front matter in `src/editions/<year>/speakers/*.md`); also add it to `scripts/edition-template/` |
| 2. Render it | the relevant template in `src/events/event-*.njk` or `src/_includes/partials/` |
| 3. Expose it to editors | `src/admin/config.yml` for existing editions **and** `scripts/edition-template/cms.yml` for future ones |

Fields not listed in `config.yml` (e.g. `edition_nav`, `favicon` in `site.json`) are preserved by the CMS but cannot be edited there.

## 4. Upgrades

- `npm outdated` / Dependabot for Eleventy and `@sveltia/cms`; Sveltia is a pre-1.0 project so read release notes before bumping.
- Node version is pinned in `.nvmrc` (used by the workflow).
- After a CMS upgrade, open `/admin` locally and open one item from each collection to check the forms still load.

## 5. Known limitations to review

- Sveltia CMS has no *editorial workflow* (draft → review → publish) mode; each save is a direct commit.
- Local editing ("Work with Local Repository") needs Chrome/Edge (File System Access API).
- Dates/times in the schedule are free text (e.g. `9:45am`); the site does not validate or sort them.
- The CMS `kind` select for breaks stores an empty string for normal sessions; templates treat only `"break"` specially.
