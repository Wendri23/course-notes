import { h } from "preact"
import { courseOf, fm, key, kindOf, site, titleOf } from "../../../course-context/dist/shared.js"
import { azFilterScript, azList } from "../../../course-context/dist/ui.js"

export const GlossaryBody = () => {
  const GlossaryBody = ({ fileData, allFiles }) => {
    const slug = fileData.slug
    const s = site(allFiles)

    if (kindOf(fileData) === "concepts") {
      const course = courseOf(fileData, allFiles)
      if (!course) return null
      const list = s.concepts(course.name)
      const chapters = s.chapters(course.name)
      // concept → chapters it belongs to (links from the chapter note, or its `source:`)
      const chapterKeys = new Map()
      for (const ch of chapters) {
        for (const c of s.conceptsOf(ch)) chapterKeys.set(key(c), [...(chapterKeys.get(key(c)) ?? []), key(ch)])
      }
      return h("div", { class: "cn-az", "data-cn-az": "" },
        h("div", { class: "controls" },
          h("label", { class: "field", style: "flex: 1 1 260px" }, "Filter",
            h("input", { type: "text", "data-cn-filter": "", placeholder: `type to narrow ${list.length} concepts…`, "aria-label": "Filter concepts" })),
          chapters.length
            ? h("select", { class: "field", "data-cn-chapter": "", "aria-label": "Chapter" },
              h("option", { value: "" }, "All chapters"),
              ...chapters.map((ch, i) => h("option", { value: key(ch) }, `${fm(ch).chapter ?? i + 1} · ${titleOf(ch)}`)))
            : null,
          h("label", { class: "check" }, h("input", { type: "checkbox", "data-cn-notyet": "" }), "Not opened yet")),
        azList(slug, list, { extra: (f) => ({ "data-chapter": (chapterKeys.get(key(f)) ?? []).join(" ") }) }))
    }

    // Glossary: all courses, 4 columns, filter only
    const list = s.courses.flatMap((c) => s.concepts(c.name))
    return h("div", { class: "cn-az", "data-cn-az": "" },
      h("div", { class: "controls" },
        h("label", { class: "field", style: "flex: 1 1 280px; max-width: 480px" }, "Filter",
          h("input", { type: "text", "data-cn-filter": "", placeholder: `type to narrow ${list.length} terms…`, "aria-label": "Filter terms" }))),
      azList(slug, list, { c4: true }))
  }

  GlossaryBody.afterDOMLoaded = azFilterScript
  return GlossaryBody
}
