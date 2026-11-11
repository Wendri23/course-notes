import { h } from "preact"

// ── helpers (same as course-context/dist/shared.js) ──
const fm = (f) => f?.frontmatter ?? {}
const baseName = (f) => (f?.relativePath ?? f?.filePath ?? f?.slug ?? "").split("/").pop().replace(/\.md$/, "")
const pathToRoot = (slug) => {
  const up = slug.split("/").filter(Boolean).slice(0, -1).map(() => "..").join("/")
  return up || "."
}
const simplify = (s) => (s === "index" ? "" : s.endsWith("/index") ? s.slice(0, -6) : s)
const href = (cur, target) => {
  const t = simplify(target)
  return t === "" ? pathToRoot(cur) + "/" : pathToRoot(cur) + "/" + t
}
const modified = (f) => {
  const d = f?.dates?.modified ?? f?.dates?.created
  return d ? new Date(d) : undefined
}
const fmtDate = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

function collect(allFiles) {
  const courses = []
  for (const f of allFiles) {
    const m = fm(f)
    if (m.type === "course" && m.course) {
      courses.push({
        name: String(m.course),
        title: m.title ?? String(m.course),
        color: m.color || "#0f766e",
        description: m.description ?? "",
        slug: f.slug,
        chapters: [],
        concepts: [],
        last: modified(f),
      })
    }
  }
  const byName = new Map(courses.map((c) => [c.name, c]))
  for (const f of allFiles) {
    const m = fm(f)
    const c = m.course != null ? byName.get(String(m.course)) : undefined
    if (!c) continue
    if (m.type === "chapter") c.chapters.push(f)
    if (m.type === "concept") c.concepts.push(f)
    const d = modified(f)
    if (d && (!c.last || d > c.last)) c.last = d
  }
  courses.sort((a, b) => a.title.localeCompare(b.title))
  return { courses, byName }
}

export const CourseDashboard = () => {
  const CourseDashboard = ({ fileData, allFiles }) => {
    if (fileData.slug !== "index") return null
    const slug = fileData.slug
    const { courses, byName } = collect(allFiles)

    const notes = allFiles.filter((f) => ["concept", "chapter"].includes(fm(f).type))
    const reviewed = notes.filter((f) => fm(f).status === "reviewed").length

    const cards = courses.map((c) => {
      const items = [...c.chapters, ...c.concepts]
      const done = items.filter((f) => fm(f).status === "reviewed").length
      const pct = items.length ? Math.round((done / items.length) * 100) : 0
      return h(
        "a",
        { class: "cd-course cn-card", href: href(slug, c.slug), style: `--c:${c.color}`, "data-no-popover": "true" },
        h("div", { class: "cd-course-top" },
          h("span", { class: "cd-course-mark" }, c.title.slice(0, 2)),
          h("div", null,
            h("h3", null, c.title),
            c.description ? h("p", { class: "cd-desc" }, c.description) : null)),
        h("div", { class: "cd-stats" },
          h("span", null, h("b", null, c.chapters.length), " chapters"),
          h("span", null, h("b", null, c.concepts.length), " concepts")),
        h("div", { class: "cd-progress", title: `${done} of ${items.length} notes reviewed` },
          h("div", { class: "cd-bar" }, h("span", { style: `width:${pct}%` })),
          h("span", { class: "cd-pct" }, `${pct}% reviewed`)),
        c.last ? h("p", { class: "cd-last" }, "Updated ", fmtDate(c.last)) : null,
      )
    })

    const recent = notes
      .filter((f) => modified(f))
      .sort((a, b) => modified(b) - modified(a))
      .slice(0, 6)

    const topicCount = new Map()
    for (const f of notes) {
      for (const t of fm(f).tags ?? []) {
        if (typeof t === "string" && t.startsWith("topic/")) topicCount.set(t, (topicCount.get(t) ?? 0) + 1)
      }
    }
    const topics = [...topicCount.entries()].sort((a, b) => b[1] - a[1])
    const max = Math.max(1, ...topics.map((t) => t[1]))

    return h("section", { class: "course-dashboard" },
      h("div", { class: "cd-hero" },
        h("div", { class: "cd-kpi" }, h("b", null, courses.length), h("span", null, courses.length === 1 ? "course" : "courses")),
        h("div", { class: "cd-kpi" }, h("b", null, notes.filter((f) => fm(f).type === "chapter").length), h("span", null, "chapters")),
        h("div", { class: "cd-kpi" }, h("b", null, notes.filter((f) => fm(f).type === "concept").length), h("span", null, "concepts")),
        h("div", { class: "cd-kpi" }, h("b", null, notes.length ? Math.round((reviewed / notes.length) * 100) + "%" : "0%"), h("span", null, "reviewed"))),

      h("div", { class: "cd-continue cn-card", hidden: true, "data-root": pathToRoot(slug) },
        h("span", { class: "cd-continue-label" }, "Continue where you left off"),
        h("a", { class: "cd-continue-link internal" }, "")),

      h("h2", { class: "cd-h" }, "Courses"),
      h("div", { class: "cd-grid" }, ...cards),

      h("div", { class: "cd-cols" },
        h("div", null,
          h("h2", { class: "cd-h" }, "Recently updated"),
          h("ul", { class: "cd-recent" },
            ...recent.map((f) => {
              const c = byName.get(String(fm(f).course))
              return h("li", { style: `--c:${c?.color ?? "var(--accent)"}` },
                h("a", { class: "internal", href: href(slug, f.slug) }, fm(f).title ?? baseName(f)),
                h("span", { class: "cd-recent-meta" },
                  h("span", { class: "cd-dot" }), c?.title ?? "", " · ", fmtDate(modified(f))))
            }))),
        h("div", null,
          h("h2", { class: "cd-h" }, "Topics"),
          h("div", { class: "cd-topics" },
            ...topics.map(([t, n]) =>
              h("a", {
                class: "cd-topic internal",
                href: href(slug, "tags/" + t),
                style: `--w:${0.85 + (n / max) * 0.35}rem`,
              }, t.replace(/^topic\//, ""), h("small", null, n)))),
          h("a", { class: "cd-glossary cn-card internal", href: href(slug, "glossary") },
            h("b", null, "A–Z"), h("span", null, "Open the glossary")))),
    )
  }

  CourseDashboard.afterDOMLoaded = `
const KEY = "cn-last-visited"
document.addEventListener("nav", (e) => {
  const slug = e.detail?.url ?? ""
  const box = document.querySelector(".cd-continue")
  if (box) {
    try {
      const last = JSON.parse(localStorage.getItem(KEY) || "null")
      if (last && last.slug && last.slug !== "index") {
        const a = box.querySelector(".cd-continue-link")
        a.textContent = last.title
        a.setAttribute("href", box.dataset.root + "/" + last.slug)
        box.hidden = false
      }
    } catch {}
    return
  }
  const title = document.querySelector(".article-title")?.textContent?.trim()
  const type = document.querySelector(".course-ctx")?.dataset.type
  if (title && slug && slug !== "index" && !slug.startsWith("tags/")) {
    try { localStorage.setItem(KEY, JSON.stringify({ slug: slug.replace(/\\/index$/, ""), title, type })) } catch {}
  }
})
`

  CourseDashboard.css = `
.course-dashboard { margin-top: 1.5rem; }
.course-dashboard .cd-h { border: none; margin: 2rem 0 .8rem; font-size: 1.3rem; }
.course-dashboard .cd-h::before { display: none; }
.cd-hero { display: grid; grid-template-columns: repeat(4, 1fr); gap: .75rem; }
.cd-kpi { padding: .9rem 1rem; border-radius: var(--radius); background: var(--accent-soft); border: 1px solid var(--accent-line); }
.cd-kpi b { display: block; font-family: var(--headerFont); font-size: 1.9rem; line-height: 1.1; color: var(--accent); }
.cd-kpi span { font-size: .8rem; color: var(--darkgray); text-transform: uppercase; letter-spacing: .06em; }
.cd-continue { display: flex; align-items: center; gap: .8rem; margin-top: 1rem; padding: .8rem 1rem; }
.cd-continue[hidden] { display: none; }
.cd-continue-label { font-size: .8rem; text-transform: uppercase; letter-spacing: .06em; color: var(--gray); }
.cd-continue-link { font-weight: 600; }
.cd-continue-link::after { content: " →"; }
.cd-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
.cd-course { position: relative; display: flex; flex-direction: column; gap: .8rem; padding: 1.1rem 1.2rem 1rem;
  color: inherit !important; text-decoration: none !important; overflow: hidden; transition: transform .18s, box-shadow .18s; }
.cd-course::before { content: ""; position: absolute; inset: 0 0 auto 0; height: 4px; background: var(--c); }
.cd-course:hover { transform: translateY(-3px); box-shadow: var(--shadow-hover); }
.cd-course-top { display: flex; gap: .8rem; align-items: flex-start; }
.cd-course-mark { flex: none; display: grid; place-items: center; width: 2.6rem; height: 2.6rem; border-radius: 12px;
  font-family: var(--headerFont); font-weight: 700; color: #fff; background: var(--c); }
.cd-course h3 { margin: 0; font-size: 1.25rem; }
.cd-desc { margin: .2rem 0 0; font-size: .85rem; line-height: 1.4; color: var(--gray) !important; }
.cd-stats { display: flex; gap: 1rem; font-size: .85rem; color: var(--darkgray); }
.cd-stats b { color: var(--dark); font-size: 1rem; }
.cd-progress { display: flex; align-items: center; gap: .6rem; }
.cd-bar { flex: 1; height: 8px; border-radius: 99px; background: var(--lightgray); overflow: hidden; }
.cd-bar span { display: block; height: 100%; min-width: 4px; border-radius: inherit; background: var(--c); }
.cd-pct { font-size: .75rem; color: var(--gray); white-space: nowrap; }
.cd-last { margin: 0; font-size: .75rem; color: var(--gray) !important; }
.cd-cols { display: grid; grid-template-columns: 1.3fr 1fr; gap: 2rem; }
.cd-recent { list-style: none; padding: 0; margin: 0; }
.cd-recent li { display: flex; flex-direction: column; padding: .55rem 0; border-bottom: 1px solid var(--lightgray); }
.cd-recent li:last-child { border-bottom: none; }
.cd-recent-meta { display: flex; align-items: center; gap: .35rem; font-size: .78rem; color: var(--gray); }
.cd-dot { width: .5rem; height: .5rem; border-radius: 50%; background: var(--c); }
.cd-topics { display: flex; flex-wrap: wrap; gap: .45rem; }
.course-dashboard a.cd-topic { display: inline-flex; align-items: baseline; gap: .35rem; padding: .25rem .7rem; border-radius: 999px;
  font-size: var(--w); text-decoration: none; background: var(--accent-soft); border: 1px solid var(--accent-line); }
.cd-topic small { font-size: .7rem; color: var(--gray); }
.course-dashboard a.cd-glossary { display: flex; align-items: center; gap: .8rem; margin-top: 1.2rem; padding: .8rem 1rem;
  text-decoration: none; color: var(--dark); transition: box-shadow .18s; }
.cd-glossary:hover { box-shadow: var(--shadow-hover); }
.cd-glossary b { font-family: var(--headerFont); font-size: 1.3rem; color: var(--accent); }
@media (max-width: 800px) {
  .cd-hero { grid-template-columns: repeat(2, 1fr); }
  .cd-cols { grid-template-columns: 1fr; gap: 0; }
}
`
  return CourseDashboard
}
