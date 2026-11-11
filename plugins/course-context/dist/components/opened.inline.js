// "Opened" state, kept in this browser only (localStorage).
// A chapter or concept counts as opened once it has been visited. States: ✓ opened / ○ not yet.
;(() => {
  const OPENED = "cn-opened"
  const HISTORY = "cn-history"
  const read = (k, d) => {
    try {
      return JSON.parse(localStorage.getItem(k) ?? "null") ?? d
    } catch {
      return d
    }
  }
  const write = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v))
    } catch {}
  }
  const strip = (s) => (s ?? "").replace(/\/index$/, "").replace(/^index$/, "")

  document.addEventListener("nav", () => {
    const slug = strip(document.body.dataset.slug)
    const opened = new Set(read(OPENED, []))

    // 1. record this page (chapters and concepts only)
    const track = document.querySelector("[data-cn-track]")
    if (track && slug) {
      opened.add(slug)
      write(OPENED, [...opened])
      const hist = read(HISTORY, []).filter((x) => x && x.slug !== slug)
      hist.unshift({ slug, title: track.dataset.cnTrack })
      write(HISTORY, hist.slice(0, 12))
    }

    // 2. ✓ / ○ marks
    for (const el of document.querySelectorAll("[data-cn-slug]")) {
      const o = opened.has(el.dataset.cnSlug)
      el.classList.toggle("is-opened", o)
      const mk = el.querySelector(".mk")
      if (mk) mk.textContent = o ? "✓" : "○"
    }

    // 3. counts, percentages and bars
    for (const el of document.querySelectorAll("[data-cn-of]")) {
      const list = el.dataset.cnOf.split(" ").filter(Boolean)
      const n = list.filter((s) => opened.has(s)).length
      const pct = list.length ? Math.round((n / list.length) * 100) : 0
      if (el.classList.contains("bar")) {
        const i = el.querySelector("i")
        if (i) i.style.width = pct + "%"
        el.setAttribute("role", "img")
        el.setAttribute("aria-label", `${n} of ${list.length} opened`)
      } else el.textContent = el.dataset.cnFmt === "pct" ? pct + "%" : String(n)
    }

    // 4. Continue: first note not opened yet, in course order
    for (const el of document.querySelectorAll("[data-cn-continue]")) {
      let items = []
      try {
        items = JSON.parse(el.dataset.cnContinue)
      } catch {}
      const next = items.find(([s]) => !opened.has(s))
      if (next) {
        el.setAttribute("href", next[2])
        el.textContent = `Continue: ${next[1]} →`
        el.hidden = false
      } else el.hidden = true
    }

    // 5. "Pick up where you left off" (Home)
    const pick = document.querySelector("[data-cn-history]")
    if (pick) {
      const box = pick.querySelector(".chips")
      const root = pick.dataset.root || "."
      const hist = read(HISTORY, []).filter((x) => x && x.slug && x.title).slice(0, 3)
      box.replaceChildren(
        ...hist.map((x, i) => {
          const a = document.createElement("a")
          a.className = "chip"
          a.href = root + "/" + x.slug
          if (i === 0) {
            const dot = document.createElement("i")
            dot.className = "dot"
            dot.setAttribute("aria-label", "last opened")
            a.append(dot)
          }
          a.append(x.title)
          return a
        }),
      )
      pick.hidden = hist.length === 0
    }

    // 6. "+ N" topic chips
    const onMore = (e) => {
      const btn = e.target.closest(".cn-more-btn")
      if (!btn) return
      const box = btn.closest(".cn-more")
      for (const c of box.querySelectorAll("[hidden]")) c.hidden = false
      btn.remove()
    }
    document.addEventListener("click", onMore)
    window.addCleanup?.(() => document.removeEventListener("click", onMore))

    // 6b. Right rail: sticky but never its own scroll box. When taller than the screen it scrolls
    // with the page and sticks once its bottom is in view.
    const rail = document.querySelector(".cn-layout > .cn-rail")
    if (rail) {
      const fit = () => {
        const top = Math.min(24, window.innerHeight - rail.offsetHeight - 24)
        rail.style.setProperty("--rail-top", top + "px")
      }
      fit()
      const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(fit) : null
      ro?.observe(rail)
      window.addEventListener("resize", fit)
      window.addCleanup?.(() => {
        ro?.disconnect()
        window.removeEventListener("resize", fit)
      })
    }

    // 7. ✓ / ○ after links to chapters and concepts inside the note (a style, not a block)
    if (typeof fetchData !== "undefined") {
      fetchData.then((index) => {
        for (const a of document.querySelectorAll("article a.internal[data-slug]")) {
          if (a.classList.contains("tag-link")) continue
          const s = strip(a.dataset.slug)
          const e = index[a.dataset.slug] ?? index[s] ?? index[s + "/index"]
          const t = e?.courseNotes?.type
          if (t !== "concept" && t !== "chapter") continue
          a.classList.add("cn-lk")
          a.classList.toggle("cn-lk-o", opened.has(s))
        }
      })
    }
  })
})()
