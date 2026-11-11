import { h } from "preact"

// ── helpers (same as course-context/dist/shared.js) ──
const fm = (f) => f?.frontmatter ?? {}
const baseName = (f) => (f?.relativePath ?? f?.filePath ?? f?.slug ?? "").split("/").pop().replace(/\.md$/, "")
const pathToRoot = (slug) => {
  const up = slug.split("/").filter(Boolean).slice(0, -1).map(() => "..").join("/")
  return up || "."
}
const simplify = (s) => (s === "index" ? "" : s.endsWith("/index") ? s.slice(0, -6) : s)
const href = (cur, target) => {
  const t = simplify(target)
  return t === "" ? pathToRoot(cur) + "/" : pathToRoot(cur) + "/" + t
}
const linkTarget = (v) => (typeof v === "string" ? v.replace(/^\[\[|\]\]$/g, "").split("|")[0].split("#")[0].trim() : "")

/** Chapters of a course in order, each with its concepts. */
function chaptersOf(course, allFiles) {
  const chapters = allFiles
    .filter((f) => fm(f).type === "chapter" && String(fm(f).course) === course)
    .sort((a, b) => (Number(fm(a).chapter) || 99) - (Number(fm(b).chapter) || 99))
  const concepts = allFiles.filter((f) => fm(f).type === "concept" && String(fm(f).course) === course)
  return chapters.map((ch) => {
    const name = baseName(ch)
    const own = concepts.filter((c) => linkTarget(fm(c).source) === name)
    const items = [ch, ...own]
    const done = items.filter((f) => fm(f).status === "reviewed").length
    return { file: ch, name, n: fm(ch).chapter, concepts: own, pct: Math.round((done / items.length) * 100) }
  })
}

export const LearningPath = () => {
  const LearningPath = ({ fileData, allFiles }) => {
    const m = fm(fileData)
    if (!m.course) return null
    const slug = fileData.slug
    const chapters = chaptersOf(String(m.course), allFiles)
    if (chapters.length === 0) return null

    // Course page: full timeline
    if (m.type === "course") {
      const total = chapters.reduce((s, c) => s + c.concepts.length, 0)
      return h("nav", { class: "learning-path cn-card", "aria-label": "Learning path" },
        h("div", { class: "lp-head" },
          h("span", { class: "lp-kicker" }, "Learning path"),
          h("span", { class: "lp-sum" }, `${chapters.length} chapters · ${total} concepts`)),
        h("ol", { class: "lp-steps" },
          ...chapters.map((c, i) =>
            h("li", { class: "lp-step", style: `--p:${c.pct}%` },
              h("span", { class: "lp-num" }, c.n ?? i + 1),
              h("div", { class: "lp-body" },
                h("a", { class: "internal lp-title", href: href(slug, c.file.slug) },
                  fm(c.file).title ?? c.name),
                h("div", { class: "lp-meta" },
                  h("span", null, `${c.concepts.length} concepts`),
                  h("span", { class: "lp-mini" }, h("span", null)),
                  h("span", null, `${c.pct}%`)))))))
    }

    // Chapter page: position in the path + previous / next
    if (m.type === "chapter") {
      const i = chapters.findIndex((c) => c.file.slug === slug)
      if (i < 0) return null
      const prev = chapters[i - 1]
      const next = chapters[i + 1]
      return h("nav", { class: "lp-chapter", "aria-label": "Chapter navigation" },
        h("div", { class: "lp-dots" },
          ...chapters.map((c, j) =>
            h("a", {
              class: "lp-dot" + (j === i ? " current" : j < i ? " before" : ""),
              href: href(slug, c.file.slug),
              title: `${c.n}. ${fm(c.file).title ?? c.name}`,
              "data-no-popover": "true",
            }, c.n ?? j + 1))),
        h("div", { class: "lp-prevnext" },
          prev ? h("a", { class: "internal", href: href(slug, prev.file.slug) }, "← ", fm(prev.file).title ?? prev.name) : h("span"),
          next ? h("a", { class: "internal", href: href(slug, next.file.slug) }, fm(next.file).title ?? next.name, " →") : h("span")))
    }
    return null
  }

  LearningPath.css = `
.learning-path { margin: 1.2rem 0 1.6rem; padding: 1rem 1.2rem 1.1rem; }
.lp-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: .8rem; }
.lp-kicker { font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--accent); }
.lp-sum { font-size: .8rem; color: var(--gray); }
.lp-steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: .6rem; counter-reset: none; }
.lp-step { position: relative; display: flex; gap: .6rem; align-items: flex-start; margin: 0; padding: .6rem .7rem;
  border-radius: 12px; background: var(--accent-soft); border: 1px solid var(--accent-line); }
.lp-num { flex: none; display: grid; place-items: center; width: 1.8rem; height: 1.8rem; border-radius: 50%;
  font-weight: 700; font-size: .85rem; color: var(--light); background: var(--accent); }
.lp-body { min-width: 0; display: flex; flex-direction: column; gap: .25rem; }
.learning-path a.lp-title { font-weight: 600; font-size: .9rem; line-height: 1.25; text-decoration: none; }
.lp-meta { display: flex; align-items: center; gap: .4rem; font-size: .72rem; color: var(--gray); }
.lp-mini { flex: 1; min-width: 24px; height: 4px; border-radius: 9px; background: var(--lightgray); overflow: hidden; }
.lp-mini > span { display: block; height: 100%; width: var(--p); background: var(--accent); }
.lp-chapter { margin: .4rem 0 1.4rem; padding: .7rem 0; border-top: 1px solid var(--lightgray); border-bottom: 1px solid var(--lightgray); }
.lp-dots { display: flex; align-items: center; gap: 0; margin-bottom: .5rem; }
.lp-dots .lp-dot { position: relative; display: grid; place-items: center; width: 1.7rem; height: 1.7rem; border-radius: 50%;
  font-size: .75rem; font-weight: 700; text-decoration: none; color: var(--darkgray); background: var(--lightgray); flex: none; }
.lp-dots .lp-dot + .lp-dot { margin-left: 1.4rem; }
.lp-dots .lp-dot + .lp-dot::before { content: ""; position: absolute; right: 100%; width: 1.4rem; height: 2px; background: var(--lightgray); }
.lp-dots .lp-dot.before { background: var(--accent-line); color: var(--dark); }
.lp-dots .lp-dot.current { background: var(--accent); color: var(--light); box-shadow: 0 0 0 4px var(--accent-soft); }
.lp-prevnext { display: flex; justify-content: space-between; gap: 1rem; font-size: .88rem; }
.lp-prevnext a { text-decoration: none !important; }
`
  return LearningPath
}
