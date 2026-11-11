import { h } from "preact"
import { kindOf } from "../shared.js"

/**
 * Course-notes page frame (ui-handoff layout):
 *   head (breadcrumb, title, meta) full width
 *   main column (note as-is + sections) | sticky right rail
 *   footer
 * Home: title + intro beside the search, then the dashboard.
 */
export const CourseFrame = {
  name: "course",
  render({ componentData, beforeBody, pageBody, afterBody, right, footer }) {
    const kind = kindOf(componentData.fileData)
    const r = (C, i) => h(C, { ...componentData, key: i })
    const head = h("div", { class: "page-header" }, h("div", { class: "popover-hint" }, ...beforeBody.map(r)))
    const content = h(pageBody, componentData)
    const after = h("div", { class: "page-footer" }, ...afterBody.map(r))
    const rail = h("aside", { class: "cn-rail" }, ...right.map(r))

    let body
    if (kind === "home") {
      body = [h("div", { class: "cn-layout cn-home-top" }, h("div", { class: "cn-main" }, head, content), rail), after]
    } else {
      // Course: chapters first, then the course index note as-is
      const main = kind === "course" ? [after, content] : [content, after]
      body = [head, h("div", { class: "cn-layout" }, h("main", { class: "cn-main" }, ...main), rail)]
    }
    return h("div", { class: "cn-wrap", "data-kind": kind }, ...body, ...footer.map(r))
  },
}
