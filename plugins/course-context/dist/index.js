// course-context: shared course data, the page frame, page head, rail blocks, footer
// and the "opened" client script. Also exposes course metadata in the content index.
export { PageHead, RailTop, BackLink, SiteFooter, CourseBadge } from "./components/index.js"

const asList = (v) => (Array.isArray(v) ? v.map(String) : typeof v === "string" && v ? [v] : [])

const textOf = (n) => (n.type === "text" ? n.value : (n.children ?? []).map(textOf).join(""))

/**
 * Tags the note's "**Links** : [[A]] [[B]]" paragraph with class "cn-links".
 * It stays in the tree (so its links still count for backlinks and the graph), is hidden by CSS,
 * and learning-path shows its links as "Related concepts" chips.
 */
const tagLinksLine = () => (tree) => {
  for (const node of tree.children ?? []) {
    if (node.type !== "element" || node.tagName !== "p") continue
    const first = (node.children ?? []).find((c) => !(c.type === "text" && !c.value.trim()))
    if (first?.type === "element" && first.tagName === "strong" && textOf(first).trim() === "Links") {
      const cls = node.properties.className ?? []
      node.properties.className = [...(Array.isArray(cls) ? cls : [cls]), "cn-links"]
    }
  }
}

export const plugin = () => ({
  name: "CourseContext",
  markdownPlugins: () => [],
  htmlPlugins: () => [tagLinksLine],
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
