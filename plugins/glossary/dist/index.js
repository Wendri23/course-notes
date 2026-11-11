import { GlossaryBody } from "./components/index.js"
export { GlossaryBody }

/**
 * Generated pages:
 *   /glossary                  every concept of every course, A–Z (no rail)
 *   /<course>/all-concepts     one per course: A–Z with filter, chapter select, "Not opened yet"
 */
export const plugin = (opts) => {
  const slug = opts?.slug ?? "glossary"
  const title = opts?.title ?? "Glossary"
  return {
    name: "GlossaryPage",
    priority: 5,
    match: () => false,
    generate: ({ content }) => {
      const pages = [
        {
          slug,
          title,
          data: { frontmatter: { title, description: "Every concept across all courses, A to Z." } },
        },
      ]
      for (const [, file] of content ?? []) {
        const m = file?.data?.frontmatter ?? {}
        const s = file?.data?.slug ?? ""
        if (m.type !== "course" || !m.course || !s.endsWith("index")) continue
        const course = String(m.course)
        pages.push({
          slug: s.replace(/index$/, "") + "all-concepts",
          title: "All concepts",
          data: {
            frontmatter: {
              title: "All concepts",
              cnCourse: course,
              description: `Every concept of the ${m.title ?? course} course, A to Z.`,
            },
          },
        })
      }
      return pages
    },
    layout: "glossary",
    frame: "course",
    body: () => GlossaryBody(),
  }
}
