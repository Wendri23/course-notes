// Helpers shared by the course-notes plugins (imported by the others via "course-context/shared").
// Everything here reads generic data only: frontmatter, file paths, links, dates, tags.

export const fm = (f) => f?.frontmatter ?? {}

export const baseName = (f) => {
  const p = f?.relativePath ?? f?.filePath ?? f?.slug ?? ""
  return p.split("/").pop().replace(/\.md$/, "")
}

export const titleOf = (f) => fm(f).title ?? baseName(f)

export function pathToRoot(slug) {
  const up = slug.split("/").filter((x) => x !== "").slice(0, -1).map(() => "..").join("/")
  return up.length === 0 ? "." : up
}

export function simplifySlug(slug) {
  let s = slug ?? ""
  if (s === "index") return ""
  if (s.endsWith("/index")) s = s.slice(0, -"/index".length)
  return s
}

/** Relative href from the current page to a target slug. */
export function href(current, target) {
  const t = simplifySlug(target)
  const root = pathToRoot(current)
  return t === "" ? root + "/" : root + "/" + t
}

/** Slug key used for the "opened" state (same as document.body.dataset.slug minus /index). */
export const key = (f) => simplifySlug(f?.slug ?? "")

export const linkTarget = (v) =>
  typeof v === "string" ? v.replace(/^\[\[|\]\]$/g, "").split("|")[0].split("#")[0].trim() : ""

export const asList = (v) => (Array.isArray(v) ? v.map(String) : typeof v === "string" && v ? [v] : [])

export const tagsOf = (f) => asList(fm(f).tags).map((t) => t.replace(/^#/, ""))

/** "topic/protocol" → "protocol" */
export const tagLabel = (t) => t.split("/").pop()

export const dateOf = (f, which) => {
  const d = f?.dates?.[which] ?? (which === "modified" ? f?.dates?.created : undefined)
  return d ? new Date(d) : undefined
}

export function fmtDate(d) {
  if (!d) return ""
  const opts = { month: "short", day: "numeric", timeZone: "UTC" }
  if (d.getUTCFullYear() !== new Date().getUTCFullYear()) opts.year = "numeric"
  return d.toLocaleDateString("en-US", opts)
}

export const STATUS_LABEL = { draft: "Draft", "to-review": "To review", reviewed: "Reviewed" }

export const letterOf = (term) => {
  const c = term.normalize("NFD").replace(/[̀-ͯ]/g, "").charAt(0).toUpperCase()
  return c >= "A" && c <= "Z" ? c : "#"
}

export const byTitle = (a, b) => titleOf(a).localeCompare(titleOf(b), "en", { sensitivity: "base" })

/** What kind of page this is; drives the frame and which rail blocks show. */
export function kindOf(fileData) {
  const s = fileData?.slug ?? ""
  const m = fm(fileData)
  if (s === "index") return "home"
  if (s === "glossary") return "glossary"
  if (m.cnCourse && s.endsWith("/all-concepts")) return "concepts"
  if (s === "tags/index" || s === "tags") return "tags"
  if (s.startsWith("tags/")) return "topic"
  if (m.type === "course" || m.type === "chapter" || m.type === "concept") return m.type
  return "other"
}

const cache = new WeakMap()

/** Course / chapter / concept structure of the whole vault, computed once per build. */
export function site(allFiles) {
  if (cache.has(allFiles)) return cache.get(allFiles)

  const bySlug = new Map()
  const byName = new Map()
  for (const f of allFiles) {
    bySlug.set(key(f), f)
    byName.set(baseName(f).toLowerCase(), f)
  }

  const courses = []
  for (const f of allFiles) {
    const m = fm(f)
    if (m.type === "course" && m.course) {
      courses.push({ name: String(m.course), title: m.title ?? String(m.course), description: m.description ?? "", file: f })
    }
  }
  courses.sort((a, b) => a.title.localeCompare(b.title))
  const courseByName = new Map(courses.map((c) => [c.name, c]))

  const ofType = (t, course) =>
    allFiles.filter((f) => fm(f).type === t && (course == null || String(fm(f).course) === course))

  const chapterCache = new Map()
  /** Chapters of a course, in the existing `chapter:` order. */
  const chapters = (course) => {
    if (!chapterCache.has(course)) {
      chapterCache.set(
        course,
        ofType("chapter", course).sort(
          (a, b) => (Number(fm(a).chapter) || 999) - (Number(fm(b).chapter) || 999) || byTitle(a, b),
        ),
      )
    }
    return chapterCache.get(course)
  }

  const concepts = (course) => ofType("concept", course).sort(byTitle)

  /** Concept's parent chapter = its `source:` frontmatter. */
  const chapterOf = (f) => {
    const src = linkTarget(fm(f).source)
    if (!src) return undefined
    const c = byName.get(src.split("/").pop().toLowerCase())
    return c && fm(c).type === "chapter" ? c : undefined
  }

  const conceptCache = new Map()
  /** Concepts of a chapter = concept links in the chapter note (in link order), plus concepts whose source is this chapter. */
  const conceptsOf = (ch) => {
    const k = key(ch)
    if (conceptCache.has(k)) return conceptCache.get(k)
    const out = []
    const seen = new Set()
    const add = (f) => {
      if (f && fm(f).type === "concept" && !seen.has(key(f))) {
        seen.add(key(f))
        out.push(f)
      }
    }
    for (const l of ch.links ?? []) add(bySlug.get(simplifySlug(l)))
    for (const f of ofType("concept", fm(ch).course != null ? String(fm(ch).course) : undefined)) {
      if (chapterOf(f) === ch) add(f)
    }
    conceptCache.set(k, out)
    return out
  }

  /** Notes carrying a tag (single source for every tag count). */
  const tagged = (tag, type = "concept") =>
    allFiles.filter((f) => (!type || fm(f).type === type) && tagsOf(f).includes(tag)).sort(byTitle)

  /** Tags of the given notes, most used first: [tag, count][] */
  const topics = (files) => {
    const n = new Map()
    for (const f of files) for (const t of tagsOf(f)) n.set(t, (n.get(t) ?? 0) + 1)
    return [...n.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }

  /** Topics under a tag namespace ("" = all), most used first: [tag, concepts][] */
  const subtopics = (prefix = "") =>
    topics(allFiles.filter((f) => fm(f).type === "concept")).filter(([t]) => !prefix || t.startsWith(prefix + "/"))

  const recent = (files, n) =>
    files
      .filter((f) => dateOf(f, "modified"))
      .sort((a, b) => dateOf(b, "modified") - dateOf(a, "modified") || byTitle(a, b))
      .slice(0, n)

  const s = { bySlug, byName, courses, courseByName, chapters, concepts, conceptsOf, chapterOf, tagged, topics, subtopics, recent }
  cache.set(allFiles, s)
  return s
}

/** Course object of a page (by `course:` frontmatter or the generated page's cnCourse). */
export function courseOf(fileData, allFiles) {
  const m = fm(fileData)
  const name = m.cnCourse ?? m.course
  return name != null ? site(allFiles).courseByName.get(String(name)) : undefined
}

/** Space-separated slugs, used by the client script to count opened notes. */
export const slugList = (files) => files.map(key).join(" ")
