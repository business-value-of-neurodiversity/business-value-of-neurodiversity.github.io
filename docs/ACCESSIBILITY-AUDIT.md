# WCAG 2.2 accessibility review

**Scope:** the public site (home, Events, each edition's pages, Resources, About Us) as of the current `main`.
**Target:** WCAG 2.2 Level AA.
**Not in scope:** the Sveltia CMS at `/admin/` (third-party UI) and the external ticketing site behind "Register Here".

## How it was checked (and what that does *not* cover)

| Method | What it covered | Limits |
|---|---|---|
| axe-core run in Node/jsdom on all built pages | Structure rules: alt text, labels, landmarks, headings, ARIA, lists, duplicate IDs, `lang` | jsdom has no layout, so axe could not judge colour contrast, visibility or `<h1>` presence; those were checked separately below |
| Contrast computed by hand from every colour pair in `style.css` | SC 1.4.3, 1.4.11 | Text over photos was not measured |
| Browser measurements at 1280, 768, 375 and 320 px | Reflow (1.4.10), target size (2.5.8), text-spacing override (1.4.12) | Done in an emulated browser, not on real devices |
| Source review | Keyboard behaviour, link names, alt text, headings | A human keyboard + screen-reader walkthrough (NVDA/JAWS/VoiceOver) has **not** been done and is still needed |

Automated tools catch only a fraction of WCAG failures; treat this as a strong first pass, not a certification.

## Status of fixes (updated)

| Fix | Status |
|---|---|
| A1 hidden `<h1>` on 2026 overview | **Applied**; every page now has exactly one h1 |
| A2 heading skip on `/events/` | **Applied**; axe reports 0 violations on all pages |
| A3 focus ring on red/black bands | **Applied** (white 3px ring; verified in browser on the red block) |
| A4 sticky header vs. focus | **Applied** (`scroll-padding-top` / `scroll-margin-top`); **still needs a manual keyboard check**, which could not be confirmed in the test browser |
| A5 "Learn More" link name | **Applied** (hidden text names the event) |
| A6 Esc dismisses hover menu | **Applied and tested** (hover → Esc closes it; it re-opens after the pointer leaves and returns) |
| A7 click-target size | **Applied** (Resources and card links grew from ~20px to 43–46px tall) |
| A8 duplicate logo alt text | **Applied** |
| A9 redirect stub `lang` | **Applied** |
| A10 reduced motion | **Applied** |
| A11 `px` to `rem` font sizes | **Not applied** (larger mechanical change; recommended next) |
| Section C (design issues) | **Open**, for the designer |

## A. Non-compliant or at-risk elements, with fixes (original findings)

| # | Issue | WCAG SC | Where | Proposed fix | Effort |
|---|---|---|---|---|---|
| A1 | **No `<h1>`** on the March 2026 overview page (the logo image is the only title; other editions have an h1) | 1.3.1, 2.4.6 (AA); best practice | `src/events/event-home.njk` (logo branch) | Add `<h1 class="visually-hidden">{{ d.event.title }}: {{ d.event.subtitle }}</h1>` before the logo image | 1 line |
| A2 | **Heading level skipped** on `/events/` (h1 → h3 on the edition cards) | 1.3.1 (A) | `src/_includes/partials/edition-cards.njk` | Change the card heading from `<h3>` to `<h2>` (same CSS class) | 1 line |
| A3 | **Focus ring invisible on red/black bands.** The focus outline is red; on the red "next forum" block it is red-on-red (1.00:1, needs 3:1); on black it is only 3.26:1 | 2.4.7 (AA), 1.4.11 (AA) | `.feature`, `.band.dark`, `.page-hero` | Add `.feature :focus-visible, .band.dark :focus-visible, .page-hero :focus-visible { outline-color: #fff; }` | 1 rule |
| A4 | **Sticky header may cover the focused element** (Shift+Tab / skip-link target). The page has no `scroll-padding-top`. This is a known failure pattern; I could **not confirm it in the test browser** | 2.4.11 Focus Not Obscured (AA, new in 2.2) | `.site-header { position: sticky }` on screens wider than 900px | `html { scroll-padding-top: 5rem; }` | 1 line; **verify by keyboard** |
| A5 | **Ambiguous link text:** "Learn More" in the upcoming-forum block does not say what it leads to | 2.4.4 (A) | `src/index.njk` | `Learn More<span class="visually-hidden"> about {{ ev.title }}</span>` | 1 line |
| A6 | **Hover menu cannot be dismissed with Esc** when opened by mouse (Esc only works when focus is inside, or for the mobile panel) | 1.4.13 Content on Hover or Focus (AA) | Past Events dropdown, `base.njk` script + CSS | On Esc, set `data-dismissed` on `.has-sub`; CSS `.has-sub[data-dismissed] > .sub-nav { display:none }`; clear the attribute on `mouseleave`/`focusout` | ~8 lines |
| A7 | **Tiny click targets** on Resources links and Past-Events card titles (19–22 px tall). These *pass* 2.5.8 through the spacing exception (nothing is within 24 px), but are below the recommended 44 px | 2.5.8 (AA) – passes narrowly | `.resource-list a`, `.edition-card h3 a` | `display:inline-block; padding: 8px 0;` | 2 lines |
| A8 | **Redundant image text:** host logos have `alt="Name"` right next to the visible name, so screen readers read it twice | 1.1.1 (best practice) | `.host` blocks in `index`, `about`, `event-home`, `event-organizers` | Use `alt=""` when the name is displayed beside the logo | 4 spots |
| A9 | **Redirect stub pages have no `lang`** and no `<html>` wrapper | 3.1.1 (A) – very low impact | `src/legacy-redirects.njk` | Wrap in `<html lang="en">…</html>` | 2 lines |
| A10 | **Smooth scrolling ignores "reduce motion"** | 2.3.3 (AAA) / good practice | `html { scroll-behavior: smooth }` | `@media (prefers-reduced-motion: reduce){ html{ scroll-behavior:auto } }` | 1 rule |
| A11 | **Fixed `px` font sizes** in headers and several components do not scale with a "text-only" zoom setting (Firefox) | 1.4.4 (AA) – browser zoom is fine | `style.css` | Convert `px` font sizes to `rem` | Medium (mechanical) |

## B. Checked and passing

- **Contrast (1.4.3):** body 18.9:1; muted grey text 7.5:1; red links/headings on white 6.0:1 and on the light-grey band 5.4:1; white on red buttons and the red feature 6.0:1; footer/tagline text 14.5:1.
- **Reflow (1.4.10):** no horizontal scrolling at 320 px on any page.
- **Text spacing (1.4.12):** no clipping or overflow with the WCAG override values (the only clipped box is the intentionally hidden home `<h1>`).
- **Structure:** `lang="en"` on all pages, one `<main>` per page, unique page titles, no duplicate IDs, correct landmarks (`nav` has an accessible name), skip link present, `aria-expanded` on the Menu button.
- **Images:** all content images have alt text; decorative edition-card and resource logos use `alt=""`.
- **Not applicable:** forms, authentication (3.3.8), drag gestures (2.5.7), time limits, media.
- **Consistent Help (3.2.6):** the contact email appears in the same footer position on every page.

## C. Design issues for the designer (not quick code fixes)

1. **Logo.** The series logo was made by erasing the date from the 2026 PNG. A raster logo with thin type does not scale crisply at high zoom. Please supply an official **SVG** logo (dateless, plus an alt-text wording).
2. **Navigation model.** Pages inside an edition *replace* the main nav with the edition nav + "Back to Home". Within each group the navigation is consistent (3.2.3 passes), but a visitor on a past-edition page cannot reach Resources or About Us without going home first, and the site has **no search or site map**, so "Multiple Ways" (2.4.5) is only weakly met. Consider a shared footer with site-wide links.
3. **Dropdown on touch devices wider than 900 px** (iPad landscape): the Past Events menu opens only on hover/focus; tapping navigates to `/events/` instead. Content stays reachable, but a **disclosure-button pattern** (separate link and chevron button) needs a design decision.
4. **Line length.** Bios and schedule descriptions run ~100+ characters per line on wide screens (1.4.8, AAA). Constrain body text to ~65–80 characters.
5. **Very small text.** The role tags ("MODERATOR", "PANELIST") and the "Takeaways for" labels are ~11–12 px uppercase. They pass contrast but are hard to read; set a minimum of 14 px.
6. **Red as the only emphasis colour.** Links, headings, buttons, labels and focus rings all share one red. It passes contrast, but the shared hue makes links, headings and decorations less distinguishable. A secondary accent or consistent link underlines would help.
7. **Resources layout.** Items with and without logos align differently. Decide on a consistent logo slot (or a placeholder tile).
8. **Registration (external).** The ticketing site is outside our control; it should be reviewed separately, and the forum should offer a non-web contact (email is in the footer) for people who cannot use it.

## D. Recommended next steps

1. Apply A1–A6 and A8–A10 (about an hour of work).
2. Do a keyboard-only pass of every page, including Esc on the dropdown and the sticky-header/focus check (A4).
3. Do a screen-reader pass (VoiceOver + NVDA) on Home, an edition's Schedule and Speakers pages, and the mobile Menu.
4. Add axe-core to the GitHub Actions build so regressions are caught on each content edit.
5. Hand section C to the designer; re-test after changes.
