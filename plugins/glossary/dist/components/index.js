import { h } from "preact"

// ── helpers (same as course-context/dist/shared.js) ──
const fm = (f) => f?.frontmatter ?? {}
const baseName = (f) => (f?.relativePath ?? f?.filePath ?? f?.slug ?? "").split("/").pop().replace(/\.md$/, "")
const pathToRoot = (slug) => {
  const up = slug.split("/").filter(Boolean).slice(0, -1).map(() => "..").join("/")
  return up || "."
}
const href = (cur, target) => pathToRoot(cur) + "/" + target
const asList = (v) => (Array.isArray(v) ? v.map(String) : typeof v === "string" && v ? [v] : [])
const letterOf = (term) => {
  const c = term.normalize("NFD").replace(/[̀-ͯ]/g, "").charAt(0).toUpperCase()
  return c >= "A" && c <= "Z" ? c : "#"
}

export const GlossaryBody = () => {
  const GlossaryBody = ({ fileData, allFiles }) => {
    const slug = fileData.slug
    const courses = new Map()
    for (const f of allFiles) {
      const m = fm(f)
      if (m.type === "course" && m.course) courses.set(String(m.course), { title: m.title ?? m.course, color: m.color || "#0f766e" })
    }

    const entries = []
    for (const f of allFiles) {
      const m = fm(f)
      if (m.type !== "concept") continue
      const term = m.title ?? baseName(f)
      const course = String(m.course ?? "")
      const desc = typeof f.description === "string" ? f.description : ""
      entries.push({ term, course, slug: f.slug, desc })
      for (const a of asList(m.aliases)) {
        if (a && a !== term) entries.push({ term: a, course, slug: f.slug, see: term })
      }
    }
    entries.sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }))

    const groups = new Map()
    for (const e of entries) {
      const l = letterOf(e.term)
      if (!groups.has(l)) groups.set(l, [])
      groups.get(l).push(e)
    }
    const letters = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]
    const conceptCount = entries.filter((e) => !e.see).length

    return h("div", { class: "glossary" },
      h("p", { class: "gl-intro" },
        `${conceptCount} concepts and ${entries.length - conceptCount} aliases across ${courses.size} ${courses.size === 1 ? "course" : "courses"}. Hover a term to preview it.`),
      h("div", { class: "gl-tools cn-card" },
        h("input", { class: "gl-search", type: "search", placeholder: "Filter terms…", "aria-label": "Filter terms" }),
        h("div", { class: "gl-chips" },
          h("button", { class: "gl-chip active", "data-course": "" }, "All"),
          ...[...courses.entries()].map(([name, c]) =>
            h("button", { class: "gl-chip", "data-course": name, style: `--c:${c.color}` }, h("span", { class: "gl-dot" }), c.title)))),
      h("nav", { class: "gl-letters", "aria-label": "Letters" },
        ...letters.map((l) =>
          groups.has(l)
            ? h("a", { href: `#gl-${l === "#" ? "num" : l}`, "data-letter": l, "data-no-popover": "true" }, l)
            : h("span", { class: "gl-off" }, l))),
      ...[...groups.entries()].map(([l, list]) =>
        h("section", { class: "gl-group", id: `gl-${l === "#" ? "num" : l}`, "data-letter": l },
          h("h2", { class: "gl-letter" }, l),
          h("dl", { class: "gl-list" },
            ...list.map((e) => {
              const c = courses.get(e.course)
              return h("div", { class: "gl-entry" + (e.see ? " gl-alias" : ""), "data-course": e.course, "data-term": e.term.toLowerCase() },
                h("dt", null,
                  h("a", { class: "internal", href: href(slug, e.slug) }, e.term),
                  c ? h("span", { class: "gl-badge", style: `--c:${c.color}` }, c.title) : null),
                h("dd", null, e.see ? h("span", { class: "gl-see" }, "see ", h("a", { class: "internal", href: href(slug, e.slug) }, e.see)) : e.desc))
            })))))
  }

  GlossaryBody.afterDOMLoaded = `
document.addEventListener("nav", () => {
  const root = document.querySelector(".glossary")
  if (!root) return
  const input = root.querySelector(".gl-search")
  const chips = [...root.querySelectorAll(".gl-chip")]
  let course = ""
  const apply = () => {
    const q = (input.value || "").trim().toLowerCase()
    for (const e of root.querySelectorAll(".gl-entry")) {
      const ok = (!course || e.dataset.course === course) && (!q || e.dataset.term.includes(q))
      e.hidden = !ok
    }
    for (const g of root.querySelectorAll(".gl-group")) {
      const any = g.querySelector(".gl-entry:not([hidden])")
      g.hidden = !any
      const a = root.querySelector('.gl-letters a[data-letter="' + g.dataset.letter + '"]')
      if (a) a.classList.toggle("gl-dim", !any)
    }
  }
  const onChip = (ev) => {
    const b = ev.currentTarget
    course = b.dataset.course
    chips.forEach((c) => c.classList.toggle("active", c === b))
    apply()
  }
  chips.forEach((c) => c.addEventListener("click", onChip))
  input.addEventListener("input", apply)
  window.addCleanup?.(() => {
    chips.forEach((c) => c.removeEventListener("click", onChip))
    input.removeEventListener("input", apply)
  })
})
`

  GlossaryBody.css = `
.glossary .gl-intro { color: var(--gray); }
.gl-tools { position: sticky; top: .5rem; z-index: 5; display: flex; flex-wrap: wrap; gap: .6rem; align-items: center; padding: .6rem .7rem; margin: 1rem 0 .8rem; }
.gl-search { flex: 1 1 200px; padding: .5rem .8rem; border-radius: 10px; border: 1px solid var(--lightgray);
  background: var(--light); color: var(--dark); font: inherit; }
.gl-search:focus { outline: 2px solid var(--accent-line); border-color: var(--accent); }
.gl-chips { display: flex; flex-wrap: wrap; gap: .35rem; }
.gl-chip { display: inline-flex; align-items: center; gap: .35rem; padding: .3rem .75rem; border-radius: 999px; cursor: pointer;
  font: inherit; font-size: .82rem; color: var(--darkgray); background: transparent; border: 1px solid var(--lightgray); }
.gl-chip.active { color: var(--light); background: var(--c, var(--accent)); border-color: var(--c, var(--accent)); }
.gl-chip.active .gl-dot { background: var(--light); }
.gl-dot { width: .5rem; height: .5rem; border-radius: 50%; background: var(--c); }
.gl-letters { display: flex; flex-wrap: wrap; gap: .15rem; margin-bottom: 1rem; }
.gl-letters a, .gl-letters span { display: grid; place-items: center; width: 1.7rem; height: 1.7rem; border-radius: 7px; font-size: .8rem; font-weight: 600; }
.gl-letters a { color: var(--accent); background: var(--accent-soft); text-decoration: none; }
.gl-letters a:hover { background: var(--accent); color: var(--light); }
.gl-letters .gl-off, .gl-letters a.gl-dim { color: var(--gray); background: transparent; opacity: .45; }
.glossary h2.gl-letter { font-size: 1.6rem; border: none; margin: 1.6rem 0 .4rem; color: var(--accent); scroll-margin-top: 5rem; }
.glossary h2.gl-letter::before { display: none; }
.gl-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: .1rem 1.4rem; margin: 0; }
.gl-entry { padding: .5rem 0; border-bottom: 1px dashed var(--lightgray); break-inside: avoid; }
.gl-entry[hidden], .gl-group[hidden] { display: none; }
.gl-entry dt { display: flex; align-items: center; gap: .45rem; flex-wrap: wrap; font-weight: 600; }
.gl-entry dd { margin: .15rem 0 0; font-size: .82rem; line-height: 1.4; color: var(--gray); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.gl-alias dt a { font-weight: 500; font-style: italic; }
.gl-badge { font-size: .65rem; font-weight: 700; padding: .05rem .45rem; border-radius: 999px; color: var(--c);
  background: color-mix(in oklab, var(--c) 12%, transparent); text-transform: uppercase; letter-spacing: .04em; }
`
  return GlossaryBody
}
