// Builds on the Mermaid popup of obsidian-flavored-markdown (expand button, drag to pan, Esc):
// adds click-anywhere to open, mouse-wheel zoom, double-click to reset, and a roomier viewer.
export const DiagramViewer = () => {
  const DiagramViewer = () => null

  DiagramViewer.afterDOMLoaded = `
document.addEventListener("nav", () => {
  for (const pre of document.querySelectorAll("article pre:has(> code.mermaid)")) {
    if (pre.dataset.dvReady) continue
    pre.dataset.dvReady = "1"
    pre.setAttribute("title", "Click to open fullscreen")
    const open = (e) => {
      if (e.target.closest("button, a, #mermaid-container")) return
      if (window.getSelection()?.toString()) return
      pre.querySelector(".expand-button")?.click()
    }
    pre.addEventListener("click", open)
    window.addCleanup?.(() => { pre.removeEventListener("click", open); delete pre.dataset.dvReady })
  }
})

if (!window.__dvWheel) {
  window.__dvWheel = true
  const controls = (space) => [...space.querySelectorAll(".mermaid-control-button")]
  document.addEventListener("wheel", (e) => {
    const space = e.target.closest?.("#mermaid-container.active #mermaid-space")
    if (!space) return
    e.preventDefault()
    const label = e.deltaY < 0 ? "+" : "-"
    const steps = Math.min(3, Math.max(1, Math.round(Math.abs(e.deltaY) / 80)))
    const btn = controls(space).find((b) => b.textContent === label)
    for (let i = 0; i < steps; i++) btn?.click()
  }, { passive: false })
  document.addEventListener("dblclick", (e) => {
    const space = e.target.closest?.("#mermaid-container.active #mermaid-space")
    if (!space) return
    controls(space).find((b) => b.textContent === "Reset")?.click()
  })
}
`

  DiagramViewer.css = `
article pre:has(> code.mermaid) { position: relative; cursor: zoom-in; transition: box-shadow .18s; }
article pre:has(> code.mermaid):hover { box-shadow: var(--shadow-hover); }
article pre:has(> code.mermaid)::after {
  content: "Click to expand"; position: absolute; left: 50%; bottom: .45rem; transform: translateX(-50%);
  font: 600 .7rem var(--bodyFont); letter-spacing: .04em; color: var(--gray); opacity: 0; transition: opacity .18s; pointer-events: none;
}
article pre:has(> code.mermaid):hover::after { opacity: 1; }
article pre:has(> code.mermaid) > .expand-button { opacity: .55; }
#mermaid-container { cursor: zoom-out; background: rgb(10 12 16 / .55); }
#mermaid-container > #mermaid-space {
  width: min(94vw, 1400px); height: 88vh; border-radius: 18px; border: 1px solid var(--lightgray);
  background:
    radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--gray) 35%, transparent) 1px, transparent 0) 0 0 / 22px 22px,
    var(--light);
  box-shadow: 0 30px 80px rgb(0 0 0 / .35);
}
#mermaid-container .mermaid-controls {
  position: absolute; right: 1rem; bottom: 1rem; display: flex; gap: .3rem; padding: .3rem;
  border-radius: 12px; background: var(--card); border: 1px solid var(--lightgray); box-shadow: var(--shadow);
}
#mermaid-container .mermaid-control-button {
  min-width: 2.2rem; height: 2.2rem; padding: 0 .6rem; border-radius: 9px; border: none; cursor: pointer;
  font: 600 .9rem var(--bodyFont); color: var(--dark); background: transparent;
}
#mermaid-container .mermaid-control-button:hover { background: var(--accent-soft); color: var(--accent); }
`
  return DiagramViewer
}
