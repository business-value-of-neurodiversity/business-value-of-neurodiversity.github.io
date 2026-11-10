#!/usr/bin/env node
// Scaffold a new edition of the forum:  npm run new-edition -- 2028 [Month]
//
//  * copies the blank data files in scripts/edition-template/ to src/_data/editions/<year>/
//  * creates src/editions/<year>/{speakers,organizers}/ for people files
//  * registers the edition in src/_data/events.json (newest first -> Events menu)
//  * inserts the edition's forms into src/admin/config.yml
// Existing files are never overwritten, so the script is safe to re-run.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [year, month = "March"] = process.argv.slice(2);
if (!/^\d{4}$/.test(year ?? "")) {
  console.error("Usage: npm run new-edition -- <YYYY> [MonthName]");
  process.exit(1);
}
const fill = (t) => t.replaceAll("@@YEAR@@", year).replaceAll("March", month);
const tpl = path.join(root, "scripts/edition-template");
const log = (m) => console.log(m);

// 1. data files
const dataDir = path.join(root, "src/_data/editions", year);
fs.mkdirSync(dataDir, { recursive: true });
for (const f of fs.readdirSync(tpl).filter((f) => f.endsWith(".json"))) {
  const dest = path.join(dataDir, f);
  if (fs.existsSync(dest)) { log(`kept     ${path.relative(root, dest)}`); continue; }
  fs.writeFileSync(dest, fill(fs.readFileSync(path.join(tpl, f), "utf8")));
  log(`created  ${path.relative(root, dest)}`);
}

// 2. people folders (+ image folder)
for (const kind of ["speakers", "organizers"]) {
  const dir = path.join(root, "src/editions", year, kind);
  fs.mkdirSync(dir, { recursive: true });
  const dd = path.join(dir, `${kind}.json`);
  if (!fs.existsSync(dd)) fs.writeFileSync(dd, '{ "permalink": false }\n');
}
fs.mkdirSync(path.join(root, "src/assets/images/editions", year, "people"), { recursive: true });
for (const d of [`src/assets/images/editions/${year}/people`]) {
  const keep = path.join(root, d, ".gitkeep");
  if (!fs.existsSync(keep)) fs.writeFileSync(keep, "");
}

// 3. register in events.json (newest first)
const evPath = path.join(root, "src/_data/events.json");
const events = JSON.parse(fs.readFileSync(evPath, "utf8"));
if (!events.some((e) => e.slug === year)) {
  events.push({ slug: year });
  events.sort((a, b) => b.slug.localeCompare(a.slug));
  fs.writeFileSync(evPath, JSON.stringify(events, null, 2) + "\n");
  log("updated  src/_data/events.json");
}

// 4. CMS forms
const cfgPath = path.join(root, "src/admin/config.yml");
const cfg = fs.readFileSync(cfgPath, "utf8");
const marker = "  # @@EDITIONS-INSERT-ABOVE@@";
if (cfg.includes(`name: pages_${year}\n`)) {
  log("kept     CMS forms already present in src/admin/config.yml");
} else if (!cfg.includes(marker)) {
  console.error("Marker not found in src/admin/config.yml; add the forms manually.");
  process.exit(1);
} else {
  const block = fill(fs.readFileSync(path.join(tpl, "cms.yml"), "utf8"));
  fs.writeFileSync(cfgPath, cfg.replace(marker, block + marker));
  log("updated  src/admin/config.yml");
}
log(`\nDone. Run "npm start" and open /events/${year}/`);
