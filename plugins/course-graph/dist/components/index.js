import { h } from "preact"
import { readFileSync } from "node:fs"

const script = readFileSync(new URL("./graph.inline.js", import.meta.url), "utf8")
const css = readFileSync(new URL("./graph.css", import.meta.url), "utf8")

const pathToRoot = (slug) => {
  const up = slug.split("/").filter(Boolean).slice(0, -1).map(() => "..").join("/")
  return up || "."
}

export const CourseGraph = () => {
  const CourseGraph = ({ fileData, displayClass }) =>
    h("div", { class: ["course-graph", displayClass].filter(Boolean).join(" "), "data-root": pathToRoot(fileData.slug) },
      h("div", { class: "cg-head" },
        h("h3", null, "Graph view"),
        h("button", { class: "cg-expand", type: "button", "aria-label": "Open the full graph", title: "Open the full graph" },
          h("svg", { viewBox: "0 0 24 24", width: 16, height: 16, fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round" },
            h("path", { d: "M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" })))),
      h("div", { class: "cg-local cn-card" }),
      h("div", { class: "cg-modal", hidden: true, role: "dialog", "aria-label": "Course graph" },
        h("div", { class: "cg-panel" },
          h("div", { class: "cg-bar" },
            h("div", { class: "cg-chips" }),
            h("div", { class: "cg-legend" },
              h("span", null, h("i", { class: "lg-course" }), "course"),
              h("span", null, h("i", { class: "lg-chapter" }), "chapter"),
              h("span", null, h("i", { class: "lg-concept" }), "concept")),
            h("button", { class: "cg-close", type: "button", "aria-label": "Close" }, "×")),
          h("div", { class: "cg-global" }))))

  CourseGraph.afterDOMLoaded = script
  CourseGraph.css = css
  return CourseGraph
}
