import { h } from "preact"
import { courseMap, fm, href } from "../shared.js"

const TYPE_LABEL = { concept: "Concept", chapter: "Chapter", course: "Course" }
const STATUS_LABEL = { draft: "Draft", "to-review": "To review", reviewed: "Reviewed" }

export const CourseBadge = () => {
  const CourseBadge = ({ fileData, allFiles }) => {
    const m = fm(fileData)
    const courses = courseMap(allFiles)
    const course = m.course ? courses.get(String(m.course)) : undefined
    // The <style> sets the page accent; SPA navigation swaps it with the page body.
    const style = h("style", null, `:root{--course-accent:${course?.color ?? "var(--default-accent)"}}`)
    if (!course || m.type === "course") return h("div", { class: "course-ctx course-ctx-empty" }, style)

    const slug = fileData.slug
    const bits = [
      h("a", { class: "course-pill internal", href: href(slug, course.slug), "data-no-popover": "true" },
        h("span", { class: "course-dot" }), course.title),
    ]
    if (m.type === "chapter" && m.chapter != null) {
      bits.push(h("span", { class: "meta-pill" }, `Chapter ${m.chapter}`))
    } else if (TYPE_LABEL[m.type]) {
      bits.push(h("span", { class: "meta-pill" }, TYPE_LABEL[m.type]))
    }
    if (m.status) {
      bits.push(h("span", { class: `status-pill status-${m.status}` }, STATUS_LABEL[m.status] ?? m.status))
    }
    return h("div", { class: "course-ctx", "data-course": course.name, "data-type": m.type ?? "" }, style, ...bits)
  }

  CourseBadge.css = `
.course-ctx { display: flex; flex-wrap: wrap; gap: .4rem; align-items: center; margin: .25rem 0 .5rem; }
.course-ctx-empty { display: none; }
.course-ctx .course-pill {
  display: inline-flex; align-items: center; gap: .4rem; padding: .15rem .65rem .15rem .5rem;
  border-radius: 999px; font-size: .8rem; font-weight: 600; text-decoration: none;
  color: var(--accent); background: var(--accent-soft); border: 1px solid var(--accent-line);
}
.course-ctx .course-dot { width: .55rem; height: .55rem; border-radius: 50%; background: var(--accent); }
.course-ctx .meta-pill, .course-ctx .status-pill {
  font-size: .75rem; padding: .15rem .55rem; border-radius: 999px;
  color: var(--darkgray); background: var(--lightgray);
}
.course-ctx .status-reviewed { color: #166534; background: #dcfce7; }
.course-ctx .status-to-review { color: #92400e; background: #fef3c7; }
:root[saved-theme="dark"] .course-ctx .status-reviewed { color: #86efac; background: #14532d88; }
:root[saved-theme="dark"] .course-ctx .status-to-review { color: #fcd34d; background: #78350f88; }
`
  return CourseBadge
}
