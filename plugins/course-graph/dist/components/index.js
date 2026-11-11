import { h } from "preact"
import { readFileSync } from "node:fs"
import { kindOf, pathToRoot } from "../../../course-context/dist/shared.js"

const script = readFileSync(new URL("./graph.inline.js", import.meta.url), "utf8")
const css = readFileSync(new URL("./graph.css", import.meta.url), "utf8")

const LABEL = { course: "Course graph", chapter: "Chapter graph", concept: "Local graph" }

const icon = (d) =>
  h("svg", { viewBox: "0 0 24 24", width: 14, height: 14, fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "aria-hidden": "true" },
    h("path", { d }))

export const CourseGraph = () => {
  const CourseGraph = ({ fileData, displayClass }) => {
    const kind = kindOf(fileData)
    const label = LABEL[kind]
    if (!label) return null
    return h("div", { class: ["course-graph", displayClass].filter(Boolean).join(" "), "data-root": pathToRoot(fileData.slug), "data-kind": kind },
      h("span", { class: "lbl" }, label),
      h("div", { class: "gwrap" },
        h("div", { class: "cg-local graph", role: "img", "aria-label": `${label}: ● opened · ○ not yet` }),
        h("button", { class: "gx cg-expand", type: "button", "aria-label": "Open the full graph", title: "Expand" },
          icon("M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"))),
      h("div", { class: "cg-modal", hidden: true, role: "dialog", "aria-label": "Full graph" },
        h("div", { class: "cg-panel gpop" },
          h("div", { class: "cg-stage" },
            h("div", { class: "cg-global" }),
            h("header", { class: "cg-head" },
              h("strong", null, "Graph"),
              h("span", { class: "cg-stats" }, "")),
            h("ul", { class: "cg-legend", "aria-label": "Legend" },
              h("li", null, h("i", { class: "cg-dot on" }), "Opened"),
              h("li", null, h("i", { class: "cg-dot" }), "Not yet"),
              h("li", null, h("i", { class: "cg-dot cur" }), "This page")),
            h("p", { class: "cg-hint" }, "Scroll to zoom · drag to pan · click a node to open")))))
  }

  CourseGraph.afterDOMLoaded = script
  CourseGraph.css = css
  return CourseGraph
}
