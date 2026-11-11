// course-context: shared course data, the page frame, page head, rail blocks, footer
// and the "opened" client script. Also exposes course metadata in the content index.
export { PageHead, RailTop, BackLink, SiteFooter, CourseBadge } from "./components/index.js"

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
      },
    }
  },
})
