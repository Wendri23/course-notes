// Helpers shared by the course-context components (copied into each course-notes plugin).

export const DEFAULT_ACCENT = "#0f766e"

export const baseName = (f) => {
  const p = f?.relativePath ?? f?.filePath ?? f?.slug ?? ""
  return p.split("/").pop().replace(/\.md$/, "")
}

export const fm = (f) => f?.frontmatter ?? {}

export function pathToRoot(slug) {
  const up = slug.split("/").filter((x) => x !== "").slice(0, -1).map(() => "..").join("/")
  return up.length === 0 ? "." : up
}

export function simplifySlug(slug) {
  let s = slug
  if (s === "index") return ""
  if (s.endsWith("/index")) s = s.slice(0, -"/index".length)
  return s
}

export function href(current, target) {
  const t = simplifySlug(target)
  const root = pathToRoot(current)
  return t === "" ? root + "/" : root + "/" + t
}

/** Course index pages (frontmatter type: course), keyed by course name. */
export function courseMap(allFiles) {
  const map = new Map()
  for (const f of allFiles) {
    const m = fm(f)
    if (m.type === "course" && m.course) {
      map.set(String(m.course), {
        name: String(m.course),
        title: m.title ?? String(m.course),
        color: typeof m.color === "string" && m.color ? m.color : DEFAULT_ACCENT,
        description: m.description ?? "",
        slug: f.slug,
      })
    }
  }
  return map
}
