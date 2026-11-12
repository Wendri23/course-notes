import { h } from "preact"
import { readFileSync } from "node:fs"
import {
  STATUS_LABEL, courseOf, dateOf, fm, fmtDate, href, key, kindOf, site, slugList, tagLabel, tagsOf, titleOf,
} from "../shared.js"

const openedScript = readFileSync(new URL("./opened.inline.js", import.meta.url), "utf8")

const sep = () => h("span", { class: "sep", "aria-hidden": "true" }, " › ")

/** Opened count among `files`, filled in by the client script. */
export const openedCount = (files) => h("span", { "data-cn-of": slugList(files) }, "0")

// ── Right rail toggle (state kept in this browser) ─────────────────────────
// html[data-cn-rail="closed"] hides the rail and centres the main column (custom.scss).
const RAIL_KEY = "cn-rail"
const railToggle = h("button", {
  class: "cn-rail-toggle", type: "button", "aria-controls": "cn-rail", "aria-expanded": "true",
  title: "Hide side panel", "aria-label": "Hide side panel",
},
  h("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 1.75, "aria-hidden": "true" },
    h("rect", { x: 3, y: 4, width: 18, height: 16 }),
    h("path", { d: "M15 4v16" })))

// runs in <head> before the page paints, so a closed rail never flashes open
const railInitScript = `
try { if (localStorage.getItem("${RAIL_KEY}") === "closed") document.documentElement.dataset.cnRail = "closed" } catch {}
`

const railToggleScript = `
document.addEventListener("nav", () => {
  const btn = document.querySelector(".cn-rail-toggle")
  if (!btn) return
  const root = document.documentElement
  const sync = () => {
    const closed = root.dataset.cnRail === "closed"
    const label = closed ? "Show side panel" : "Hide side panel"
    btn.setAttribute("aria-expanded", String(!closed))
    btn.setAttribute("aria-label", label)
    btn.title = label
  }
  const onClick = () => {
    const closed = root.dataset.cnRail !== "closed"
    if (closed) root.dataset.cnRail = "closed"
    else delete root.dataset.cnRail
    try { localStorage.setItem("${RAIL_KEY}", closed ? "closed" : "open") } catch {}
    sync()
  }
  sync()
  btn.addEventListener("click", onClick)
  window.addCleanup?.(() => btn.removeEventListener("click", onClick))
})
`

// ── Page head: real-parent breadcrumb, title, meta ─────────────────────────
export const PageHead = () => {
  const PageHead = ({ fileData, allFiles }) => {
    const slug = fileData.slug
    const kind = kindOf(fileData)
    const s = site(allFiles)
    const m = fm(fileData)
    const course = courseOf(fileData, allFiles)
    const home = h("a", { href: href(slug, "index") }, "Course notes")
    const link = (f, label) => h("a", { href: href(slug, f.slug) }, label ?? titleOf(f))

    let crumb = null
    let title = titleOf(fileData)
    let meta = null
    let track = null

    if (kind === "home") {
      return h("div", { class: "cn-head" }, h("h1", { class: "h1 article-title" }, title))
    }

    if (kind === "course") {
      crumb = [home, sep(), h("span", null, title)]
      const name = String(m.course ?? "")
      const chapters = s.chapters(name)
      const all = s.concepts(name)
      // course order: chapter by chapter, concepts in the order the chapter links them
      const ordered = []
      const seen = new Set()
      for (const ch of chapters) for (const c of s.conceptsOf(ch)) if (!seen.has(key(c))) { seen.add(key(c)); ordered.push(c) }
      for (const c of all) if (!seen.has(key(c))) ordered.push(c)
      const allHref = href(slug, slug.replace(/index$/, "") + "all-concepts")
      meta = [
        m.description ? h("p", { class: "cn-intro" }, m.description) : null,
        h("div", { class: "cn-stats" },
          h("div", { class: "meta cn-stats-line" },
            h("span", null, h("strong", null, chapters.length), " chapters"),
            h("a", { href: allHref }, h("strong", null, all.length), " concepts"),
            h("span", null, h("strong", { "data-cn-of": slugList(all), "data-cn-fmt": "pct" }, "0%"), " opened")),
          h("div", { class: "bar cn-stats-bar", "data-cn-of": slugList(all) }, h("i")),
          h("a", {
            class: "btn", hidden: true, href: allHref,
            "data-cn-continue": JSON.stringify(ordered.map((c) => [key(c), titleOf(c), href(slug, c.slug)])),
          }, "Continue")),
      ]
    } else if (kind === "chapter" || kind === "concept") {
      const parts = [home]
      if (course) parts.push(sep(), link(course.file, course.title))
      const ch = kind === "concept" ? s.chapterOf(fileData) : null
      if (ch) parts.push(sep(), link(ch))
      if (kind === "chapter") parts.push(sep(), h("span", null, title))
      crumb = parts
      const bits = []
      if (m.status) bits.push(STATUS_LABEL[m.status] ?? m.status)
      const created = dateOf(fileData, "created")
      const modified = fileData.dates?.modified ? new Date(fileData.dates.modified) : undefined
      if (created) bits.push("created " + fmtDate(created))
      if (modified) bits.push("updated " + fmtDate(modified))
      if (bits.length) meta = h("div", { class: "meta" }, h("span", null, bits.join(" · ")))
      track = title
    } else if (kind === "concepts") {
      const list = course ? s.concepts(course.name) : []
      crumb = [home, sep(), course ? link(course.file, course.title) : null, sep(), h("span", null, "Concepts")]
      title = "All concepts"
      meta = h("div", { class: "meta" },
        h("span", null, `${list.length} concepts in ${course?.title ?? ""} · `, openedCount(list), " opened"))
    } else if (kind === "glossary") {
      const list = s.courses.flatMap((c) => s.concepts(c.name))
      crumb = [home, sep(), h("span", null, "Glossary")]
      meta = h("div", { class: "meta" },
        h("span", null,
          `${list.length} concepts across ${s.courses.length} ${s.courses.length === 1 ? "course" : "courses"} · `,
          openedCount(list), " opened"))
    } else if (kind === "tags" || (kind === "topic" && !s.tagged(slug.slice("tags/".length).replace(/\/?index$/, "")).length)) {
      // topics index (/tags) or a tag namespace such as /tags/topic
      const prefix = kind === "tags" ? "" : slug.slice("tags/".length).replace(/\/?index$/, "")
      const subs = s.subtopics(prefix)
      const list = s.courses.flatMap((c) => s.concepts(c.name)).filter((f) => subs.some(([t]) => tagsOf(f).includes(t)))
      crumb = [home, sep(), h("span", null, "Topics")]
      title = "Topics"
      meta = h("div", { class: "meta" },
        h("span", null, `${subs.length} topics · ${list.length} concepts · `, openedCount(list), " opened"))
    } else if (kind === "topic") {
      const tag = slug.slice("tags/".length).replace(/\/?index$/, "")
      const list = s.tagged(tag)
      crumb = [home, sep(), h("a", { href: href(slug, "tags/index") }, "Topics"), sep(), h("span", null, tagLabel(tag))]
      title = "#" + tagLabel(tag)
      meta = h("div", { class: "meta" },
        h("span", null, `${list.length} concepts tagged ${tagLabel(tag)} · `, openedCount(list), " opened"))
    } else {
      // folder pages, tags index, 404 …: folders as breadcrumb
      const parts = [home]
      const segs = slug.replace(/\/index$/, "").split("/").filter(Boolean)
      for (let i = 0; i < segs.length - 1; i++) {
        const target = segs.slice(0, i + 1).join("/") + "/index"
        const f = s.bySlug.get(segs.slice(0, i + 1).join("/"))
        parts.push(sep(), h("a", { href: href(slug, target) }, f ? titleOf(f) : segs[i]))
      }
      if (segs.length) parts.push(sep(), h("span", null, kind === "tags" ? "Topics" : title))
      if (kind === "tags") title = "Topics"
      crumb = parts
    }

    const hasRail = ["course", "chapter", "concept", "concepts"].includes(kind)
    return h("div", { class: "cn-head", "data-cn-track": track ?? undefined },
      crumb ? h("nav", { class: "crumb", "aria-label": "Breadcrumb" }, ...crumb.filter(Boolean)) : null,
      hasRail ? railToggle : null,
      h("h1", { class: "h1 article-title" }, title),
      meta)
  }
  PageHead.beforeDOMLoaded = railInitScript
  PageHead.afterDOMLoaded = openedScript + railToggleScript
  return PageHead
}

// ── Rail blocks above the TOC (progress, topics, glossary, recently updated) ──
const topicChips = (slug, topics, max) => {
  const shown = topics.slice(0, max)
  const rest = topics.length - shown.length
  return h("div", { class: "chips cn-more", "data-max": max },
    ...topics.map(([t], i) =>
      h("a", { class: "chip", href: href(slug, "tags/" + t), hidden: i >= max ? true : undefined }, tagLabel(t))),
    rest > 0 ? h("button", { class: "chip muted cn-more-btn", type: "button", "aria-label": `Show ${rest} more topics` }, `+ ${rest}`) : null)
}

export const RailTop = () => {
  const RailTop = ({ fileData, allFiles }) => {
    const kind = kindOf(fileData)
    const slug = fileData.slug
    const s = site(allFiles)
    const course = courseOf(fileData, allFiles)
    const blocks = []

    if (kind === "chapter") {
      const list = s.conceptsOf(fileData)
      if (list.length) {
        blocks.push(h("div", null,
          h("span", { class: "lbl" }, "Progress"),
          h("div", { class: "cn-progress-line" },
            h("strong", null, openedCount(list), ` / ${list.length}`), " ", h("span", { class: "muted" }, "concepts opened")),
          h("div", { class: "bar", "data-cn-of": slugList(list) }, h("i"))))
      }
    }

    if ((kind === "course" || kind === "concepts") && course) {
      const notes = [...s.chapters(course.name), ...s.concepts(course.name)]
      const topics = s.topics(s.concepts(course.name))
      if (topics.length) blocks.push(h("div", null, h("span", { class: "lbl" }, "Topics"), topicChips(slug, topics, 4)))
      if (kind === "course") {
        blocks.push(h("div", null,
          h("span", { class: "lbl" }, "Glossary"),
          h("div", { class: "rows" },
            h("a", { class: "row", href: href(slug, "glossary") }, h("strong", null, "Glossary A–Z"), h("small", null, "→")))))
      }
      const recent = s.recent(notes, 3)
      if (recent.length) {
        blocks.push(h("div", null,
          h("span", { class: "lbl" }, "Recently updated"),
          h("div", { class: "links" }, ...recent.map((f) => h("a", { href: href(slug, f.slug) }, titleOf(f))))))
      }
    }

    if (!blocks.length) return null
    return h("div", { class: "cn-rail-top" }, ...blocks)
  }
  return RailTop
}

// ── Back link to the real parent (bottom of the rail) ──
export const BackLink = () => {
  const BackLink = ({ fileData, allFiles }) => {
    const kind = kindOf(fileData)
    const slug = fileData.slug
    const s = site(allFiles)
    const course = courseOf(fileData, allFiles)
    let target, label
    if (kind === "course") [target, label] = ["index", "Back to all courses"]
    else if (kind === "chapter" && course) [target, label] = [course.file.slug, `Back to the ${course.title} course`]
    else if (kind === "concept") {
      const ch = s.chapterOf(fileData)
      if (ch) [target, label] = [ch.slug, `Back to the ${titleOf(ch)} chapter`]
      else if (course) [target, label] = [course.file.slug, `Back to the ${course.title} course`]
    } else if (kind === "concepts" && course) [target, label] = [course.file.slug, "Back to the course"]
    if (!target) return null
    return h("div", { class: "cn-back" }, h("a", { class: "back", href: href(slug, target) }, "← " + label))
  }
  BackLink.cnSlot = "end" // the course frame puts it at the end of the main column
  return BackLink
}

// ── Footer: credit + light/dark switch ──
const sun = h("svg", { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "aria-hidden": "true" },
  h("circle", { cx: 12, cy: 12, r: 4 }),
  h("path", { d: "M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" }))
const moon = h("svg", { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "aria-hidden": "true" },
  h("path", { d: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" }))

export const SiteFooter = () => {
  const SiteFooter = () =>
    h("footer", { class: "foot" },
      h("span", null, "Course notes · built with ", h("a", { href: "https://quartz.jzhao.xyz/" }, "Quartz")),
      h("label", { class: "tgl", title: "Light / dark" },
        sun, h("input", { type: "checkbox", "aria-label": "Dark mode" }), h("span", { class: "tr" }, h("i")), moon))

  SiteFooter.afterDOMLoaded = `
document.addEventListener("nav", () => {
  const input = document.querySelector(".foot .tgl input")
  if (!input) return
  const root = document.documentElement
  input.checked = root.getAttribute("saved-theme") === "dark"
  const onChange = () => {
    const theme = input.checked ? "dark" : "light"
    root.setAttribute("saved-theme", theme)
    try { localStorage.setItem("theme", theme) } catch {}
    document.body?.classList.remove("theme-dark", "theme-light")
    document.body?.classList.add("theme-" + theme)
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }))
  }
  const onTheme = (e) => { input.checked = e.detail?.theme === "dark" }
  input.addEventListener("change", onChange)
  document.addEventListener("themechange", onTheme)
  window.addCleanup?.(() => {
    input.removeEventListener("change", onChange)
    document.removeEventListener("themechange", onTheme)
  })
})
`
  return SiteFooter
}

// Kept so an old layout entry does not break the build.
export const CourseBadge = () => {
  const CourseBadge = () => null
  return CourseBadge
}

export { key }
