// Eleventy configuration. This is *infrastructure* — maintained by developers.
// Content lives in src/_data, src/speakers, src/organizers and the page files;
// presentation lives in src/_includes and src/assets/css.

export default function (eleventyConfig) {
  // Static files copied as-is into the built site.
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin/config.yml");
  // Sveltia CMS bundle is served from our own site (version pinned by package-lock.json).
  eleventyConfig.addPassthroughCopy({
    "node_modules/@sveltia/cms/dist/sveltia-cms.js": "admin/sveltia-cms.js",
  });

  const byOrder = (a, b) => (a.data.order ?? 999) - (b.data.order ?? 999);

  // People live in src/editions/<slug>/{speakers,organizers}/*.md
  eleventyConfig.addCollection("speakers", (api) =>
    api.getFilteredByGlob("src/editions/*/speakers/*.md").sort(byOrder)
  );
  eleventyConfig.addCollection("organizers", (api) =>
    api.getFilteredByGlob("src/editions/*/organizers/*.md").sort(byOrder)
  );
  // Keep only the people belonging to one edition (the folder name is the slug).
  eleventyConfig.addFilter("forEdition", (items, slug) =>
    items.filter((i) => i.filePathStem.split("/")[2] === String(slug))
  );
  // Group speakers by their session heading, in order of first appearance.
  eleventyConfig.addFilter("groupBySession", (items) => {
    const groups = new Map();
    for (const s of items) {
      if (!groups.has(s.data.session)) groups.set(s.data.session, []);
      groups.get(s.data.session).push(s);
    }
    return [...groups].map(([session, people]) => ({ session, people }));
  });

  // Upcoming vs. past editions. `events` is newest-first (src/_data/events.json);
  // an edition is "past" when its event.json status is "past".
  const join = (events, editions) => events.map((e) => ({ ...e, ed: editions[e.slug] }));
  // The soonest edition that has not taken place yet (or null).
  eleventyConfig.addFilter("upcomingEdition", (events, editions) => {
    const open = join(events, editions).filter((e) => e.ed?.event?.status !== "past");
    return open.length ? open[open.length - 1] : null;
  });
  eleventyConfig.addFilter("pastEditions", (events, editions) =>
    join(events, editions).filter((e) => e.ed?.event?.status === "past")
  );

  // Slug-ish anchor ids for headings.
  eleventyConfig.addFilter("anchor", (s) =>
    String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  );
  // First letter(s) of a name, used when a person has no photo.
  eleventyConfig.addFilter("initials", (s) =>
    String(s).replace(/^(Dr\.|Mr\.|Ms\.)\s+/i, "").split(/\s+/).map((w) => w[0]).slice(0, 2).join("")
  );

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
    // Leave as "/" for the organization site. Set PATH_PREFIX=/repo-name/ only for a GitHub Pages project site.
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
}
