import { h } from "preact"
import { courseOf, fm, href, key, kindOf, site, slugList, tagLabel, titleOf } from "../../../course-context/dist/shared.js"
import { azList, noteChip } from "../../../course-context/dist/ui.js"

/**
 * Sections around the note (main column), fed by frontmatter, folders and links only:
 *   course  → Chapters rows + "Browse all N concepts"
 *   chapter → Concepts in this chapter (chips ✓/○) + previous / next chapter
 *   concept → Related concepts (outgoing links, text + **Links** line) + Mentioned in (backlinks)
 *   topic   → A–Z list of the concepts carrying the tag
 * Every section is hidden when empty.
 */
export const LearningPath = () => {
  const LearningPath = ({ fileData, allFiles }) => {
    const kind = kindOf(fileData)
    const slug = fileData.slug
    const s = site(allFiles)
    const sections = []
    const sec = (label, ...children) => h("section", { class: "sec" }, label ? h("span", { class: "lbl" }, label) : null, ...children)

    if (kind === "course") {
      const course = courseOf(fileData, allFiles)
      if (!course) return null
      const chapters = s.chapters(course.name)
      const all = s.concepts(course.name)
      if (chapters.length) {
        sections.push(sec("Chapters",
          h("nav", { class: "rows", "aria-label": "Chapters" },
            ...chapters.map((ch, i) => {
              const list = s.conceptsOf(ch)
              return h("a", { class: "row", href: href(slug, ch.slug) },
                h("strong", { class: "ch" }, `${fm(ch).chapter ?? i + 1} · ${titleOf(ch)}`),
                h("small", null, `${list.length} concepts · `, h("span", { "data-cn-of": slugList(list) }, "0"), " opened →"))
            }))))
      }
      if (all.length) {
        sections.push(sec(null,
          h("div", { class: "rows" },
            h("a", { class: "row", href: href(slug, slug.replace(/index$/, "") + "all-concepts") },
              h("strong", null, `Browse all ${all.length} concepts`), h("small", null, "→")))))
      }
    }

    if (kind === "chapter") {
      const list = s.conceptsOf(fileData)
      if (list.length) sections.push(sec("Concepts in this chapter", h("div", { class: "chips" }, ...list.map((f) => noteChip(slug, f)))))
      const course = courseOf(fileData, allFiles)
      const chapters = course ? s.chapters(course.name) : []
      const i = chapters.findIndex((c) => key(c) === key(fileData))
      const prev = i > 0 ? chapters[i - 1] : null
      const next = i >= 0 ? chapters[i + 1] : null
      if (prev || next) {
        sections.push(sec(null,
          h("nav", { class: "pn", "aria-label": "Chapters" },
            prev ? h("a", { href: href(slug, prev.slug) }, h("small", null, "← Previous chapter"), h("strong", null, titleOf(prev))) : h("span"),
            next ? h("a", { href: href(slug, next.slug), style: "text-align: right" }, h("small", null, "Next chapter →"), h("strong", null, titleOf(next))) : h("span"))))
      }
    }

    if (kind === "concept") {
      // Related concepts = every concept the note links to, in the text and in its "**Links** :" line
      // (that line is tagged cn-links by course-context and hidden by CSS, so it is not shown twice).
      const me = key(fileData)
      const related = []
      const seen = new Set([me])
      for (const l of fileData.links ?? []) {
        const f = s.bySlug.get(String(l).replace(/\/index$/, ""))
        if (f && fm(f).type === "concept" && !seen.has(key(f))) {
          seen.add(key(f))
          related.push(f)
        }
      }
      if (related.length) sections.push(sec("Related concepts", h("div", { class: "chips" }, ...related.map((f) => noteChip(slug, f)))))

      const mentioned = allFiles
        .filter((f) => key(f) !== me && (f.links ?? []).some((l) => String(l).replace(/\/index$/, "") === me))
        .filter((f) => ["concept", "chapter", "course"].includes(fm(f).type))
        .sort((a, b) => {
          const rank = { course: 0, chapter: 1, concept: 2 }
          return rank[fm(a).type] - rank[fm(b).type] || titleOf(a).localeCompare(titleOf(b))
        })
      if (mentioned.length) {
        sections.push(sec("Mentioned in",
          h("div", { class: "chips" },
            ...mentioned.map((f) =>
              fm(f).type === "concept"
                ? noteChip(slug, f)
                : h("a", { class: "chip", href: href(slug, f.slug) }, `${titleOf(f)} (${fm(f).type})`)))))
      }
    }

    if (kind === "topic" || kind === "tags") {
      const tag = kind === "tags" ? "" : slug.slice("tags/".length).replace(/\/?index$/, "")
      const list = tag ? s.tagged(tag) : []
      if (list.length) sections.push(h("div", { class: "cn-topic" }, azList(slug, list, { c4: true })))
      else {
        // topics index: one row per topic, most used first
        const subs = s.subtopics(tag)
        if (subs.length) {
          sections.push(sec(null,
            h("nav", { class: "rows", "aria-label": "Topics" },
              ...subs.map(([t]) => {
                const files = s.tagged(t)
                return h("a", { class: "row", href: href(slug, "tags/" + t) },
                  h("strong", null, tagLabel(t)),
                  h("small", null, `${files.length} concepts · `, h("span", { "data-cn-of": slugList(files) }, "0"), " opened →"))
              }))))
        }
      }
    }

    if (!sections.length) return null
    return h("div", { class: "cn-sections" + (kind === "topic" || kind === "tags" ? " cn-wide" : "") }, ...sections)
  }
  return LearningPath
}
