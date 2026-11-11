// course-context: exposes course metadata to client-side features (graph, glossary, dashboard)
// through the content index, and provides the CourseBadge component.
export { CourseBadge } from "./components/index.js"

const asList = (v) => (Array.isArray(v) ? v.map(String) : typeof v === "string" && v ? [v] : [])

export const plugin = () => ({
  name: "CourseContext",
  markdownPlugins: () => [],
  extendContentIndex({ fileData }) {
    const m = fileData?.frontmatter ?? {}
    if (!m.course && !m.type) return undefined
    const source = typeof m.source === "string" ? m.source.replace(/^\[\[|\]\]$/g, "").split("|")[0] : undefined
    return {
      courseNotes: {
        course: m.course != null ? String(m.course) : undefined,
        type: m.type,
        status: m.status,
        chapter: m.chapter,
        source: source || undefined,
        aliases: asList(m.aliases),
        color: m.type === "course" ? m.color : undefined,
      },
    }
  },
})
