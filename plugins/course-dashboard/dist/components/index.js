import { h } from "preact"
import {
  courseOf, dateOf, fm, fmtDate, href, pathToRoot, site, slugList, tagLabel, titleOf,
} from "../../../course-context/dist/shared.js"

/** Home (index): pick up where you left off · courses table · recently updated | topics · glossary */
export const CourseDashboard = () => {
  const CourseDashboard = ({ fileData, allFiles }) => {
    if (fileData.slug !== "index") return null
    const slug = fileData.slug
    const s = site(allFiles)

    const rows = s.courses.map((c) => {
      const chapters = s.chapters(c.name)
      const concepts = s.concepts(c.name)
      const notes = [c.file, ...chapters, ...concepts]
      const last = notes.map((f) => dateOf(f, "modified")).filter(Boolean).sort((a, b) => b - a)[0]
      const allHref = href(slug, c.file.slug.replace(/index$/, "") + "all-concepts")
      return [
        h("div", null,
          h("a", { class: "cn-tbl-course", href: href(slug, c.file.slug) }, h("strong", null, c.title)),
          c.description ? h("div", { class: "muted cn-tbl-desc" }, c.description) : null),
        h("div", null, chapters.length),
        h("div", null, h("a", { href: allHref }, concepts.length)),
        h("div", null, last ? fmtDate(last) : "—"),
        h("div", null, h("div", { class: "bar cn-tbl-bar", "data-cn-of": slugList(concepts) }, h("i"))),
      ]
    })

    const notes = allFiles.filter((f) => ["chapter", "concept"].includes(fm(f).type))
    const recent = s.recent(notes, 6)
    const topics = s.topics(allFiles.filter((f) => fm(f).type === "concept"))
    const MAX = 6

    return h("div", { class: "cn-home" },
      h("section", { class: "sec", "data-cn-history": "", "data-root": pathToRoot(slug), hidden: true },
        h("span", { class: "lbl" }, "Pick up where you left off"),
        h("div", { class: "chips" })),

      rows.length
        ? h("section", { class: "sec" },
          h("span", { class: "lbl" }, "Courses"),
          h("div", { class: "cn-tbl-wrap" },
            h("div", { class: "tbl", role: "table" },
              ...["Course", "Chapters", "Concepts", "Updated", "Opened"].map((t) => h("div", { class: "th" }, t)),
              ...rows.flat())))
        : null,

      h("div", { class: "cn-layout" },
        h("section", { class: "cn-main" },
          recent.length
            ? [
              h("span", { class: "lbl" }, "Recently updated"),
              h("div", { class: "rows" },
                ...recent.map((f) =>
                  h("a", { class: "row", href: href(slug, f.slug) },
                    h("strong", null, titleOf(f)),
                    h("small", null, [courseOf(f, allFiles)?.title, fmtDate(dateOf(f, "modified"))].filter(Boolean).join(" · ")))))]
            : null),
        h("aside", { class: "cn-rail cn-rail-static" },
          topics.length
            ? h("div", null,
              h("span", { class: "lbl" }, "Topics"),
              h("div", { class: "chips cn-more" },
                ...topics.map(([t, n], i) =>
                  h("a", { class: "chip", href: href(slug, "tags/" + t), hidden: i >= MAX ? true : undefined }, `${tagLabel(t)} ${n}`)),
                topics.length > MAX
                  ? h("button", { class: "chip muted cn-more-btn", type: "button", "aria-label": `Show ${topics.length - MAX} more topics` }, `+ ${topics.length - MAX}`)
                  : null))
            : null,
          h("div", null,
            h("span", { class: "lbl" }, "Glossary"),
            h("div", { class: "rows" },
              h("a", { class: "row", href: href(slug, "glossary") }, h("strong", null, "Look up a term A–Z"), h("small", null, "→")))))))
  }
  return CourseDashboard
}
