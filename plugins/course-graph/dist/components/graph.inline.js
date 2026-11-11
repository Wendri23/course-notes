// Course graph: d3-force + SVG. Filled = opened (or course/chapter), hollow = not yet, accent = current page.
// Data comes from contentIndex.json (fetchData), extended by course-context (entry.courseNotes).
;(() => {
  const D3_URL = "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm"
  let d3p
  const loadD3 = () => (d3p ??= import(D3_URL))

  const simplify = (s) => {
    if (!s) return ""
    s = s.replace(/\/index$/, "").replace(/\/$/, "")
    return s === "index" ? "" : s
  }
  const RADIUS = { course: 11, chapter: 7, concept: 4 }
  const LINK_TYPES = new Set(["course", "chapter", "concept"])

  async function buildData() {
    const index = await fetchData
    const nodes = new Map()
    const courses = new Set()
    for (const [slug, e] of Object.entries(index)) {
      const cn = e.courseNotes
      if (!cn || !LINK_TYPES.has(cn.type)) continue
      const id = simplify(slug)
      nodes.set(id, { id, slug, title: e.title, type: cn.type, course: cn.course ?? "", r: RADIUS[cn.type] })
      if (cn.type === "course" && cn.course) courses.add(cn.course)
    }
    const links = []
    const seen = new Set()
    for (const [slug, e] of Object.entries(index)) {
      const s = simplify(slug)
      if (!nodes.has(s)) continue
      for (const raw of e.links ?? []) {
        const t = simplify(raw)
        if (t === s || !nodes.has(t)) continue
        const key = s < t ? s + "|" + t : t + "|" + s
        if (seen.has(key)) continue
        seen.add(key)
        links.push({ source: s, target: t })
      }
    }
    return { nodes, links, courses }
  }

  const openedSet = () => {
    try {
      return new Set(JSON.parse(localStorage.getItem("cn-opened") ?? "[]"))
    } catch {
      return new Set()
    }
  }

  function navigate(root, n) {
    const url = new URL(root + "/" + n.id, window.location.href)
    if (window.spaNavigate) window.spaNavigate(url)
    else window.location.assign(url)
  }

  /** Renders a force graph into `el`; returns a cleanup function. */
  async function render(el, { data, nodeIds, current, root, global, onNavigate }) {
    const d3 = await loadD3()
    el.replaceChildren()
    const width = el.clientWidth || 300
    const height = el.clientHeight || 250

    const opened = openedSet()
    const nodes = [...nodeIds].map((id) => ({ ...data.nodes.get(id) }))
    const byId = new Map(nodes.map((n) => [n.id, n]))
    const links = data.links.filter((l) => byId.has(l.source) && byId.has(l.target)).map((l) => ({ ...l }))
    const degree = new Map()
    for (const l of links) {
      degree.set(l.source, (degree.get(l.source) ?? 0) + 1)
      degree.set(l.target, (degree.get(l.target) ?? 0) + 1)
    }
    const neighbours = new Map(nodes.map((n) => [n.id, new Set([n.id])]))
    for (const l of links) {
      neighbours.get(l.source).add(l.target)
      neighbours.get(l.target).add(l.source)
    }

    const svg = d3.select(el).append("svg").attr("class", "cg-svg").attr("viewBox", [-width / 2, -height / 2, width, height])
    const g = svg.append("g")
    const link = g.append("g").selectAll("line").data(links).join("line").attr("class", "cg-link")
    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", (d) => {
        const labelled = d.type !== "concept" || d.id === current || (!global && nodes.length < 14)
        return "cg-node t-" + d.type + (d.id === current ? " current" : "") + (opened.has(d.id) ? " opened" : "") + (labelled ? "" : " label-hover")
      })
    node
      .append("circle")
      .attr("r", (d) => d.r + (d.type === "concept" ? Math.min(3, Math.sqrt(degree.get(d.id) ?? 0) * 0.6) : 0))
    node
      .append("text")
      .attr("dy", (d) => -(d.r + 5))
      .attr("text-anchor", "middle")
      .text((d) => d.title)

    const sim = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance((l) => (l.source.type === "concept" && l.target.type === "concept" ? (global ? 70 : 40) : global ? 110 : 60)).strength(global ? 0.25 : 0.5))
      .force("charge", d3.forceManyBody().strength(global ? -260 : -140))
      .force("collide", d3.forceCollide().radius((d) => d.r + (global ? 8 : 4)))
      .force("x", d3.forceX().strength(global ? 0.03 : 0.08))
      .force("y", d3.forceY().strength(global ? 0.03 : 0.08))
      .alphaDecay(global ? 0.035 : 0.0228)
    if (current && byId.has(current)) {
      const c = byId.get(current)
      c.fx = 0
      c.fy = 0
    }
    sim.on("tick", () => {
      link.attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y).attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y)
      node.attr("transform", (d) => `translate(${d.x},${d.y})`)
    })

    // hover: highlight neighbours
    node
      .on("mouseenter", (_e, d) => {
        const nb = neighbours.get(d.id)
        svg.classed("dim", true)
        node.classed("hot", (n) => nb.has(n.id)).classed("show", (n) => n.id === d.id || (global && nb.has(n.id) && nb.size < 25))
        link.classed("hot", (l) => l.source.id === d.id || l.target.id === d.id)
      })
      .on("mouseleave", () => {
        svg.classed("dim", false)
        node.classed("hot", false).classed("show", false)
        link.classed("hot", false)
      })
      .on("click", (_e, d) => {
        onNavigate?.()
        navigate(root, d)
      })

    // drag
    node.call(
      d3
        .drag()
        .on("start", (e, d) => {
          if (!e.active) sim.alphaTarget(0.25).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on("drag", (e, d) => {
          d.fx = e.x
          d.fy = e.y
        })
        .on("end", (e, d) => {
          if (!e.active) sim.alphaTarget(0)
          if (d.id !== current) {
            d.fx = null
            d.fy = null
          }
        }),
    )

    // zoom
    const zoom = d3
      .zoom()
      .scaleExtent([0.25, 5])
      .on("zoom", (e) => {
        g.attr("transform", e.transform)
        svg.classed("zoomed", e.transform.k > 1.6)
      })
    svg.call(zoom)
    const fit = () => {
      const b = g.node().getBBox()
      if (!b.width) return
      const k = Math.min(2, 0.9 / Math.max(b.width / width, b.height / height))
      svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity.scale(k).translate(-(b.x + b.width / 2), -(b.y + b.height / 2)))
    }
    if (global) sim.on("end.fit", fit)

    return {
      stats: { nodes: nodes.length, links: links.length },
      fit,
      zoomBy(f) {
        svg.transition().duration(250).call(zoom.scaleBy, f)
      },
      filter(course) {
        node.classed("off", (d) => course && d.course !== course)
        link.classed("off", (l) => course && (l.source.course !== course || l.target.course !== course))
      },
      cleanup() {
        sim.stop()
        el.replaceChildren()
      },
    }
  }

  function localIds(data, current) {
    const ids = new Set()
    if (!current || !data.nodes.has(current)) {
      // home & non-course pages: the course / chapter skeleton
      for (const n of data.nodes.values()) if (n.type !== "concept") ids.add(n.id)
      return ids
    }
    ids.add(current)
    const cur = data.nodes.get(current)
    if (cur.type === "course") {
      // course at the centre → its chapters
      for (const n of data.nodes.values()) if (n.type === "chapter" && n.course === cur.course) ids.add(n.id)
      return ids
    }
    for (const l of data.links) {
      if (l.source === current) ids.add(l.target)
      if (l.target === current) ids.add(l.source)
    }
    return ids
  }

  document.addEventListener("nav", async () => {
    const box = document.querySelector(".course-graph")
    if (!box) return
    const local = box.querySelector(".cg-local")
    const modal = box.querySelector(".cg-modal")
    const root = box.dataset.root || "."
    const current = simplify(document.body.dataset.slug ?? "")

    let data
    try {
      data = await buildData()
    } catch (err) {
      console.error("[course-graph]", err)
      return
    }

    let localGraph
    try {
      localGraph = await render(local, { data, nodeIds: localIds(data, current), current, root, global: false })
    } catch (err) {
      local.textContent = "Graph could not load."
      console.error("[course-graph]", err)
    }

    let globalGraph
    // The sidebar is its own stacking context, so the modal is moved to <body> while open
    // (otherwise the left sidebar paints over it).
    const close = () => {
      modal.hidden = true
      globalGraph?.cleanup()
      globalGraph = undefined
      if (modal.parentElement !== box) box.append(modal)
      document.documentElement.style.overflow = ""
    }
    const open = async () => {
      document.body.append(modal)
      document.documentElement.style.overflow = "hidden"
      modal.hidden = false
      globalGraph = await render(modal.querySelector(".cg-global"), {
        data,
        nodeIds: new Set(data.nodes.keys()),
        current,
        root,
        global: true,
        onNavigate: close,
      })
      const st = modal.querySelector(".cg-stats")
      if (st && globalGraph) st.textContent = `${globalGraph.stats.nodes} notes · ${globalGraph.stats.links} links`
    }
    const onBackdrop = (e) => {
      if (e.target === modal) close()
    }
    const onKey = (e) => {
      if (e.key === "Escape" && !modal.hidden) close()
    }
    const expand = box.querySelector(".cg-expand")
    expand.addEventListener("click", open)
    modal.addEventListener("click", onBackdrop)
    document.addEventListener("keydown", onKey)
    window.addCleanup?.(() => {
      expand.removeEventListener("click", open)
      modal.removeEventListener("click", onBackdrop)
      document.removeEventListener("keydown", onKey)
      localGraph?.cleanup()
      close()
    })
  })
})()
