// Small render helpers shared by the course-notes plugins (preact `h`).
import { h } from "preact"
import { asList, fm, href, key, letterOf, titleOf } from "./shared.js"

/** ✓ / ○ mark; the client script sets it from browser storage. */
export const mark = () => h("i", { class: "mk", "aria-hidden": "true" }, "○")

/** Chip with an opened mark. */
export const noteChip = (slug, f, suffix) =>
  h("a", { class: "chip", href: href(slug, f.slug), "data-cn-slug": key(f) }, mark(), titleOf(f), suffix ?? null)

/**
 * A–Z multi-column list with letter headers and ✓/○ marks.
 * `extra(f)` may add data attributes used by filters.
 */
export function azList(slug, files, { c4 = false, extra } = {}) {
  const sorted = [...files].sort((a, b) => titleOf(a).localeCompare(titleOf(b), "en", { sensitivity: "base" }))
  // one block per letter so a header never ends up alone in a column
  const groups = new Map()
  for (const f of sorted) {
    const l = letterOf(titleOf(f))
    const terms = [titleOf(f), ...asList(fm(f).aliases)].join(" | ").toLowerCase()
    if (!groups.has(l)) groups.set(l, [])
    groups.get(l).push(
      h("a", { href: href(slug, f.slug), "data-cn-slug": key(f), "data-letter": l, "data-term": terms, ...(extra?.(f) ?? {}) },
        mark(), h("span", { class: "t" }, titleOf(f))),
    )
  }
  return h("div", { class: "cols" + (c4 ? " c4" : "") },
    ...[...groups.entries()].map(([l, links]) =>
      h("div", { class: "grp", "data-letter": l }, h("b", { class: "L" }, l), ...links)))
}

/** Client filter for A–Z lists: text field, optional chapter select, optional "not opened yet". */
export const azFilterScript = `
document.addEventListener("nav", () => {
  const root = document.querySelector("[data-cn-az]")
  if (!root) return
  const list = root.querySelector(".cols")
  const text = root.querySelector("[data-cn-filter]")
  const chapter = root.querySelector("[data-cn-chapter]")
  const notYet = root.querySelector("[data-cn-notyet]")
  const apply = () => {
    const q = (text?.value || "").trim().toLowerCase()
    const ch = chapter?.value || ""
    const only = !!notYet?.checked
    const shown = new Set()
    for (const a of list.querySelectorAll("a[data-cn-slug]")) {
      const ok = (!q || a.dataset.term.includes(q)) && (!ch || (a.dataset.chapter || "").split(" ").includes(ch)) && (!only || !a.classList.contains("is-opened"))
      a.hidden = !ok
      if (ok) shown.add(a.dataset.letter)
    }
    for (const g of list.querySelectorAll(".grp")) g.hidden = !shown.has(g.dataset.letter)
    // a short result list stays in one left column instead of being spread over the columns
    const rows = list.querySelectorAll("a[data-cn-slug]:not([hidden])").length + shown.size
    list.classList.toggle("cn-few", (q || ch || only) && rows <= 16)
  }
  const els = [text, chapter, notYet].filter(Boolean)
  for (const el of els) el.addEventListener("input", apply)
  for (const el of els) el.addEventListener("change", apply)
  window.addCleanup?.(() => {
    for (const el of els) el.removeEventListener("input", apply)
    for (const el of els) el.removeEventListener("change", apply)
  })
})
`
