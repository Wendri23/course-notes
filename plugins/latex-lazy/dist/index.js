// Wraps @quartz-community/latex (KaTeX rendering at build time) but does not put the KaTeX
// stylesheet and copy-tex script on every page: a tiny client script adds them only when the
// current page actually contains math.
import { Latex } from "@quartz-community/latex"

const KATEX = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist"

const loader = `
document.addEventListener("nav", () => {
  if (!document.querySelector(".katex")) return
  if (!document.getElementById("katex-css")) {
    const l = document.createElement("link")
    l.id = "katex-css"
    l.rel = "stylesheet"
    l.href = "${KATEX}/katex.min.css"
    l.dataset.persist = "true"
    document.head.append(l)
  }
  if (!document.getElementById("katex-copy")) {
    const s = document.createElement("script")
    s.id = "katex-copy"
    s.src = "${KATEX}/contrib/copy-tex.min.js"
    s.dataset.persist = "true"
    document.head.append(s)
  }
})
`

export const plugin = (opts) => {
  const base = Latex({ renderEngine: "katex", ...opts })
  return {
    ...base,
    name: "LatexLazy",
    externalResources() {
      return { js: [{ script: loader, loadTime: "afterDOMReady", contentType: "inline" }] }
    },
  }
}
