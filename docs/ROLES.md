# Who maintains what

The architecture deliberately separates **content** (words, people, images, dates) from
**presentation** (layouts, CSS) and **infrastructure** (build, hosting, CMS wiring), so that each can be
owned by the people best placed to own it.

## 1. Must be configured and maintained by computer-science / web experts

These need programming, command-line, or DevOps skills. A mistake here can break the whole site.

| Area | Files / systems | Typical tasks |
|---|---|---|
| **Repository & access control** | GitHub repo, branch protection, collaborators | Create the repo, grant/revoke editor access, enable branch protection if review is wanted |
| **Build tool** | `package.json`, `eleventy.config.js`, Node version (`.nvmrc`) | Upgrade Eleventy/Node, fix build errors, add collections or filters |
| **Templates (layout)** | `src/_includes/**`, `src/*.njk` | Change page structure, add a new section type, add a new page |
| **Styling** | `src/assets/css/style.css` | Brand colors, typography, responsive behavior, accessibility (contrast, focus, keyboard) |
| **Data schema** | `src/_data/*.json` field names + `src/admin/config.yml` | Add or rename a field. **Template, JSON and CMS config must change together** or editors' fields will do nothing |
| **CMS wiring** | `src/admin/config.yml`, `src/admin/index.html`, pinned `@sveltia/cms` version | Define forms, upgrade Sveltia, set repo/branch |
| **Authentication for the CMS** | GitHub OAuth app + a small auth proxy (e.g. Cloudflare Worker `sveltia-cms-auth`), or Personal Access Tokens | One-time setup; rotate secrets |
| **CI/CD & hosting** | `.github/workflows/deploy.yml`, GitHub Pages settings, DNS / custom domain, HTTPS | Fix failed deploys, move hosts, configure domain |
| **Dependency & security upkeep** | Dependabot/`npm audit`, GitHub Actions versions | Periodic updates |
| **Accessibility/SEO engineering** | Base layout meta tags, semantic HTML, sitemap/analytics if added | Audits, fixes. (Important for a neurodiversity-focused event) |
| **Starting a new edition** | `npm run new-edition -- <year>` | Scaffold blank data, Events-menu entry and CMS forms (a few minutes; then editors take over) |
| **Content model changes** | Adding a new *type* of content (e.g. a "Workshops" page, video embeds, a registration widget) | Design the data, template and CMS form |
| **Recovery** | Git history | Revert a bad commit, restore a deleted file, handle merge conflicts |

## 2. Can be managed by non-CS domain experts (event organizers, communications staff)

Everything below is done through the web form at `/admin` — no code, no command line, no Git knowledge needed
(Sveltia turns each "Save" into a Git commit for them, and every change can be undone from GitHub's history by a developer).

| Area | CMS section | Examples |
|---|---|---|
| **Event facts** | `<year> · Page content` → Event details | Date, time, check-in, venue, room, parking, hotels, contact email |
| **Registration** | Page content → Event details → Registration | Registration link, ticket types and prices, button text |
| **Home page copy** | Page content → Home page | Headlines, focus areas, "who should attend" audiences & takeaways, closing call-to-action |
| **Schedule** | Page content → Schedule | Add/reorder/edit sessions, times, descriptions, breaks, low-sensory-room notice |
| **Speakers** | Speakers | Add/remove speakers, bios, titles, photos, session grouping, display order |
| **Organizers** | Organizers | Add/remove people, bios, photos, order |
| **Sponsors** | Page content → Sponsors | Add sponsor logos, move sponsors between tiers, update intro/thank-you text |
| **Hosts & mission** | Page content → Host organizations / Organizers page | Host descriptions & logos, mission statements |
| **Images** | Any image field | Upload headshots and logos |
| **Filling in a new edition** | The new year's `Page content`, `Speakers`, `Organizers` | Once a developer has scaffolded the edition, everything on its pages is content-only |
| **Publishing an edition** | `<year> · Page content` → Event details → Status | Switch `planned` → `published` |
| **Home, Resources & About Us pages** | Site-wide pages | Mission statement, audience description, resource links, About Us text, logos |
| **Moving an edition between Upcoming and Past** | `<year> · Page content` → Event details → Status | `planned`/`published` → `past` after the event; the nav and home page update themselves |

### Rule of thumb
> If the change is **words, names, dates, prices, links, or pictures**, an editor can do it.
> If the change is **how the page is laid out, what kinds of things a page can contain, how people log in, or how it's published**, it's a developer task.

## 3. Shared / grey areas

| Area | Split |
|---|---|
| **Adding a new page** | Developer creates the template and CMS form once; editors then own the content. |
| **Navigation menu** | The five main items are developer-owned (a wrong link breaks every page), but the *Upcoming* label and the Past Events dropdown are filled in automatically from each edition's Status and *Name in the Events menu*. |
| **Visual brand** | Designer picks colors/fonts; a developer applies them in the CSS. |
| **Accessibility of content** | Editors own alt text (image "Name" fields), plain-language writing, heading text; developers own structure and contrast. |
| **Approving changes** | Optional: if reviews are desired, a developer sets up GitHub branch protection + pull requests. Out of the box, an editor's Save goes live in ~1–2 minutes. |
| **Granting an editor access** | A repository admin (developer or IT) adds the person to GitHub once; the editor does not need to understand GitHub afterward. |

## 4. Why this split works

- **Content is plain data** (`.json` and `.md`) – editors can't break layout, and developers can't accidentally rewrite editors' words.
- **Layouts never contain event facts** – the page templates only reference `site`, `home`, `schedule`, `speakers`, etc.
- **Git is the safety net** – each edit is a commit; anything can be rolled back.
- **The CMS config is the contract** – it limits what editors can change to the fields developers expose.
