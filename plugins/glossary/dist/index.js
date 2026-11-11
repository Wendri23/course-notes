import { GlossaryBody } from "./components/index.js"
export { GlossaryBody }

export const plugin = (opts) => {
  const slug = opts?.slug ?? "glossary"
  const title = opts?.title ?? "Glossary"
  return {
    name: "GlossaryPage",
    priority: 5,
    match: () => false,
    generate: () => [
      {
        slug,
        title,
        data: { frontmatter: { title, description: "Every concept and alias across all courses, A to Z." } },
      },
    ],
    layout: "glossary",
    body: () => GlossaryBody(),
  }
}
