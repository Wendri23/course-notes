# Course notes UI — handoff

Redesign of the Quartz site that publishes the Obsidian course notes (vault: `course-notes/content`). Goal of the site: **reading and learning**. This folder is everything a new chat needs to implement the design in Quartz.

- Live wireframes (Design canvas, private): https://claude.ai/artifact/DCXgWLz7E81FWpi49MBdxN
- `wireframes/*.dc.html` — source of the 8 boards (Design-canvas format: markup + one `<style>` block; they need the canvas runtime to render, read them as HTML/CSS specs)
- `tokens.css` — the shared stylesheet, identical on every page (tokens + components)

## Paste this in the new chat

> I'm implementing a UI redesign of my Quartz course-notes site. Read `ui-handoff/README.md` (spec), `ui-handoff/tokens.css` (shared styles) and the boards in `ui-handoff/wireframes/`. Implement it in Quartz: theme in `quartz.config.ts`, styles in `quartz/styles/custom.scss`, layout in `quartz.layout.ts`, and custom components only where Quartz has no equivalent. Respect the hard rules. Start by locating my Quartz project and listing what maps to built-in components vs what needs a custom component, then propose the order of work.

## Hard rules (non-negotiable)

1. **The .md note is rendered as-is.** UI components only go *around* it, fed by generic data: frontmatter, folders, headings, links/backlinks, file dates, browser storage. Never restructure note content, never generate content (no quizzes, flashcards, summaries).
2. **Minimalist.** No navbar. Black & white + one accent used sparingly.
3. **"Opened" not "read".** A note counts as opened once it has been visited (browser storage). States: ✓ opened / ○ not yet — no partial state. Never write "read".
4. **No reading-time indicators.**
5. **Back = real parent**, never browser history (breadcrumb + back link).
6. Notes and code in English.

## Design system

| Token | Light | Dark | Use |
|---|---|---|---|
| bg | `#ffffff` | `#141414` | page background |
| ink | `#111111` | `#ededed` | text, links, filled nodes, primary button |
| muted | `#595959` | `#9a9a9a` | meta, labels, breadcrumb |
| ctl | `#d4d4d4` | `#3d3d3d` | field/chip borders, resting link underline |
| line | `#e5e5e5` | `#2a2a2a` | dividers, rows |
| **accent · vermillon** | `#E34234` | `#FF6A4D` | see accent budget |

- **Type:** Inter for UI/body (`font-feature-settings: "cv11"`), **Newsreader 500** for titles (h1 48px, letter-spacing −.015em). Sizes 48 / 17 (note body) / 15 / 14 / 13 / 12 (uppercase labels, .08em tracking).
- **Spacing:** 8 grid — 8, 16, 24, 48, 64 (main ↔ rail), 96 (before footer).
- **Layout:** page max 1200px, padding 48/32, right rail 280px **sticky** (scrolls inside if taller than the screen).
- **Borders:** 1px only. Square corners everywhere except chips (pill).
- **Reading width:** note body max **68ch**, 17px / 1.65.
- **Links:** underlined 1px in `ctl` inside text, breadcrumb, rail, tables; plain in A–Z lists, rows, chips. **Hover on every link: 2px vermillon underline**; rows underline their title; chips get a vermillon border.
- **Focus:** `:focus-visible` → 2px vermillon outline, 2px offset, on every interactive element.
- **Accent budget (only here):** progress bar fill · dot before the last opened note (Home) · active heading in "On this page" · hover underline / chip border · keyboard focus · active graph node. Never for text color, backgrounds, headings, buttons or ✓/○ marks.
- **Theme:** follows the device (`prefers-color-scheme`) until the user flips the **sun/moon switch in the footer**; choice persisted (Quartz: `saved-theme`).

### Components
`row` (title left, muted meta + → right, bottom hairline) · `chip` (pill, 13px) · `field` (40px, 1px ctl border, search has magnifier + `Ctrl K` kbd) · `btn` (filled ink, 32px, 13px text — only "Continue") · `bar` (4px progress) · `lbl` (12px uppercase section label) · `links` (vertical list) · `back` (← link above a hairline) · `cols` (A–Z multi-column list with letter headers and ✓/○ marks) · `toc` (left hairline, active item in accent) · `graph` (bordered, expand button top-right → full graph) · `pn` (previous / next chapter) · footer (credit left, theme switch right).

## Pages

| Page | Main column | Right rail (sticky) |
|---|---|---|
| **Home** | Intro (index.md) + search on the same row (search = rail width) · "Pick up where you left off" chips (browser storage) · **Courses table** (course, chapters, concepts, updated, opened bar) · Recently updated rows | Topics chips (→ topic page) · Glossary row |
| **Course** (folder index) | Breadcrumb, title, index intro · stats "6 chapters · 104 concepts · 12% opened" + bar + **Continue** button · **Chapters** rows "N · Title — X concepts · Y opened →" (no concept list here) · "Browse all 104 concepts →" | Search · Topics · Glossary · Recently updated · Course graph (course at center → chapters) · ← Back to all courses |
| **All concepts** (per course) | Controls: Filter · Chapter select · "Not opened yet" checkbox · A–Z list, 3 columns, ✓/○ | Topics · Recently updated · ← Back to the course |
| **Glossary** (all courses) | Same list as All concepts, full width, 4 columns, Filter only. No rail | — |
| **Topic** (tag page) | Breadcrumb "Course notes › Topics › tag", `#tag` title, "N concepts tagged … · M opened", A–Z list of tagged concepts, 4 columns. No controls, no rail | — |
| **Chapter** | Breadcrumb (folders), title, meta "Draft · created … · updated …" (plain text) · **note as-is** · Concepts in this chapter (chips ✓/○) · Previous / next chapter | Search · Progress "4 / 11 concepts opened" + bar · On this page · Chapter graph · ← Back to the course |
| **Concept** | Breadcrumb course › chapter (from `source:` frontmatter), title, meta · **note as-is** · Related concepts (outgoing) · Mentioned in (backlinks) | Search · On this page · Local graph · ← Back to the chapter |

Every page: footer "Course notes · built with Quartz" + theme switch. Internal links inside the note get a ✓/○ read-state mark (a style, not a block). Hidden when empty: On this page, related/backlinks, prev/next at the ends.

### Data sources
- Chapter order: needs an `order` frontmatter field on chapter notes (site position ≠ chapter number in the note).
- Chapter counts = concept links in the chapter note. Concept's parent chapter = `source:` frontmatter.
- Opened state, progress %, continue / last opened = browser storage (localStorage).
- Recently updated = file dates. Topics = tags.

## Quartz mapping

`quartz.config.ts → configuration.theme` (secondary = ink, **not** the accent — otherwise every link turns vermillon):

```ts
theme: {
  fontOrigin: "googleFonts",
  cdnCaching: true,
  typography: { header: "Newsreader", body: "Inter", code: "IBM Plex Mono" },
  colors: {
    lightMode: {
      light: "#ffffff", lightgray: "#e5e5e5", gray: "#595959",
      darkgray: "#111111", dark: "#111111",
      secondary: "#111111", tertiary: "#E34234",
      highlight: "transparent", textHighlight: "rgba(227, 66, 52, 0.16)",
    },
    darkMode: {
      light: "#141414", lightgray: "#2a2a2a", gray: "#9a9a9a",
      darkgray: "#ededed", dark: "#ededed",
      secondary: "#ededed", tertiary: "#FF6A4D",
      highlight: "transparent", textHighlight: "rgba(255, 106, 77, 0.22)",
    },
  },
},
```

`quartz/styles/custom.scss` carries what the palette can't: link underline rules, Newsreader weight/size for titles, 68ch / 17px note body, accent on progress / TOC active / focus, 1px square borders. Selectors in the board are indicative — check them against the installed Quartz version.

### Likely component work
| Need | Quartz |
|---|---|
| Breadcrumb, search (Ctrl K), TOC, graph, backlinks, tag pages, folder pages, dark mode | built-in — restyle + relocate (search to top of the rail, theme switch to footer, remove Explorer/navbar) |
| Courses table, chapters rows, A–Z ✓/○ lists, controls, progress, continue, prev/next chapter, "Concepts in this chapter", read-state marks on links | custom components (+ a small client script for localStorage) |

## Open / not decided
- Mobile: rail moves below content — plan a collapsible "On this page" at the top, hide graph, rely on breadcrumb.
- Review items not applied yet: search trigger identical on every page (#6), "Related concepts" duplicates part of "Mentioned in" and the note's own links (#10 — board still shows both), Newsreader for h2/h3 inside notes (#11), off-grid spacings (#13), chips min 32px tap height on mobile (#16).
- Data mismatch to fix at build time: Home shows "protocol 35" but the topic page lists 31 — counts must come from one source (notes carrying the tag).
- Known bugs on the current live glossary (Quartz side): `&amp;` double-escaped in excerpts, table cells concatenated.
