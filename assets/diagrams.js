/* ============================================================
   MAESTRO — hand-drawn (Excalidraw-style) diagrams via rough.js
   ============================================================ */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const COL = {
    blue: "#1971c2", red: "#e03131", green: "#2f9e44", teal: "#0c8599",
    violet: "#9c36b5", orange: "#f08c00", grape: "#7048e8", yellow: "#f6b73c",
    ink: "#1e1e1e", accent: "#ff6a2b", slate: "#495057"
  };
  const FONT = "'Kalam', cursive";

  /* ---------- tiny scene helpers ---------- */
  function scene(host, w, h) {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    host.appendChild(svg);
    return { svg, rc: rough.svg(svg), w, h };
  }
  function add(s, node) { s.svg.appendChild(node); return node; }
  function rect(s, x, y, w, h, o = {}) {
    return add(s, s.rc.rectangle(x, y, w, h, Object.assign(
      { roughness: 1.1, bowing: 1, stroke: COL.ink, strokeWidth: 1.6 }, o)));
  }
  function line(s, x1, y1, x2, y2, o = {}) {
    return add(s, s.rc.line(x1, y1, x2, y2, Object.assign(
      { roughness: 1.1, strokeWidth: 1.5, stroke: COL.ink }, o)));
  }
  function path(s, d, o = {}) {
    return add(s, s.rc.path(d, Object.assign(
      { roughness: 1, strokeWidth: 2.2, fill: "none" }, o)));
  }
  function dot(s, x, y, r, o = {}) {
    return add(s, s.rc.circle(x, y, r * 2, Object.assign(
      { roughness: .8, fill: COL.ink, fillStyle: "solid", stroke: COL.ink }, o)));
  }
  function txt(s, x, y, str, o = {}) {
    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", x); t.setAttribute("y", y);
    t.setAttribute("font-family", o.family || FONT);
    t.setAttribute("font-size", o.size || 16);
    t.setAttribute("fill", o.col || COL.ink);
    t.setAttribute("text-anchor", o.anchor || "start");
    t.setAttribute("font-weight", o.weight || 400);
    if (o.spacing) t.setAttribute("letter-spacing", o.spacing);
    t.textContent = str;
    return add(s, t);
  }
  /* word-wrap to a max width in characters, returns lines drawn */
  function wrap(s, x, y, str, max, o = {}) {
    const words = str.split(" "); const lines = []; let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length > max) { lines.push(cur.trim()); cur = w; }
      else cur += " " + w;
    }
    if (cur.trim()) lines.push(cur.trim());
    const lh = o.lh || (o.size || 16) * 1.25;
    lines.forEach((ln, i) => txt(s, x, y + i * lh, ln, o));
    return lines.length;
  }
  /* a labelled rounded "card" drawn with rough rect + centered text */
  function chip(s, x, y, w, h, label, color, o = {}) {
    rect(s, x, y, w, h, { fill: o.fill || hex(color, .12), fillStyle: "solid", stroke: color, strokeWidth: 2 });
    const lines = label.split("\n");
    const cy = y + h / 2 - (lines.length - 1) * 9 + 6;
    lines.forEach((ln, i) => txt(s, x + w / 2, cy + i * 20, ln,
      { size: o.size || 16, anchor: "middle", col: o.col || COL.ink, weight: 700 }));
  }
  function hex(c, a) {
    const n = c.replace("#", ""); const r = parseInt(n.slice(0, 2), 16),
      g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  /* ============================================================
     FIGURE: limitations of legacy frameworks (radial fan)
     ============================================================ */
  function figLimitations(host) {
    const s = scene(host, 820, 430);
    rect(s, 24, 150, 300, 130, { fill: hex(COL.accent, .1), fillStyle: "solid", stroke: COL.accent, strokeWidth: 2.4 });
    txt(s, 174, 200, "Legacy threat", { size: 22, anchor: "middle", weight: 700 });
    txt(s, 174, 228, "modeling assumes…", { size: 22, anchor: "middle", weight: 700 });
    txt(s, 174, 258, "(and agents break it)", { size: 15, anchor: "middle", col: COL.slate });

    const items = [
      ["Non-determinism", COL.blue, "same input → different action"],
      ["Autonomy", COL.green, "acts without a human in the loop"],
      ["Fixed trust boundary", COL.orange, "boundaries shift at runtime"],
      ["Static identity", COL.violet, "identity & access are dynamic"],
      ["Single-agent scope", COL.red, "multi-agent comms & workflows"],
    ];
    const x0 = 470, w = 330, h = 56, gap = 22;
    const totalH = items.length * h + (items.length - 1) * gap;
    let y = (430 - totalH) / 2;
    items.forEach(([t, c, sub]) => {
      const cy = y + h / 2;
      path(s, `M 324 215 C 410 215, 410 ${cy}, ${x0} ${cy}`, { stroke: c, strokeWidth: 2.4 });
      dot(s, x0, cy, 4, { fill: c, stroke: c });
      rect(s, x0 + 8, y, w, h, { fill: hex(c, .1), fillStyle: "solid", stroke: c, strokeWidth: 2 });
      txt(s, x0 + 22, y + 25, t, { size: 18, weight: 700, col: c });
      txt(s, x0 + 22, y + 45, sub, { size: 13.5, col: COL.slate });
      y += h + gap;
    });
  }

  /* ============================================================
     FIGURE: MAESTRO 7-layer mind map
     ============================================================ */
  function figMindmap(host, dark) {
    const s = scene(host, 940, 520);
    const tcol = dark ? "#e7eaf0" : COL.ink;
    const subcol = dark ? "#aab1bf" : COL.slate;
    // center node
    rect(s, 30, 200, 290, 120, { fill: hex(COL.accent, dark ? .16 : .1), fillStyle: "solid", stroke: COL.accent, strokeWidth: 2.6 });
    txt(s, 175, 248, "MAESTRO", { size: 30, anchor: "middle", weight: 700, col: COL.accent });
    txt(s, 175, 278, "Threat Modeling", { size: 17, anchor: "middle", col: tcol, weight: 700 });
    txt(s, 175, 300, "for Agentic AI", { size: 17, anchor: "middle", col: tcol, weight: 700 });

    const layers = [
      ["1", "Foundation Models", COL.violet],
      ["2", "Data Operations", COL.blue],
      ["3", "Agent Frameworks", COL.teal],
      ["4", "Deployment Infrastructure", COL.orange],
      ["5", "Evaluation & Observability", COL.yellow],
      ["6", "Security & Compliance", COL.red],
      ["7", "Agent Ecosystem", COL.grape],
    ];
    const x0 = 470, w = 420, h = 50, gap = 14;
    const totalH = layers.length * h + (layers.length - 1) * gap;
    let y = (520 - totalH) / 2;
    layers.forEach(([n, t, c]) => {
      const cy = y + h / 2;
      path(s, `M 320 260 C 410 260, 400 ${cy}, ${x0} ${cy}`, { stroke: c, strokeWidth: 2.6 });
      rect(s, x0 + 6, y, w, h, { fill: hex(c, dark ? .22 : .12), fillStyle: "solid", stroke: c, strokeWidth: 2.2 });
      add(s, s.rc.circle(x0 + 34, cy, 34, { fill: c, fillStyle: "solid", stroke: c, roughness: .7 }));
      txt(s, x0 + 34, cy + 6, n, { size: 19, anchor: "middle", weight: 700, col: "#fff" });
      txt(s, x0 + 64, cy + 6, t, { size: 19, weight: 700, col: tcol });
      y += h + gap;
    });
  }

  /* ============================================================
     FIGURE: Step-1 layer-mapping table (MAESTRO ↔ MCP)
     ============================================================ */
  function figMapping(host) {
    const rows = [
      ["1. Foundation Models", "External LLMs — used by, but not part of, MCP", COL.violet],
      ["2. Data Operations (RAG)", "Servers provide data access (often for RAG)", COL.blue],
      ["3. Agent Frameworks", "MCP is the framework — Host, Client, Protocol", COL.teal],
      ["4. Deployment Infrastructure", "MCP Servers and their runtime environment", COL.orange],
      ["5. Evaluation & Observability", "Implementation-specific logging & monitoring", COL.yellow],
      ["6. Security & Compliance", "Controlled access & permissions by design", COL.red],
      ["7. Agent Ecosystem", "Connects agents to tools, data & other agents", COL.grape],
    ];
    const W = 940, padX = 20, c1 = 300, rh = 56, top = 64;
    const H = top + rows.length * rh + 24;
    const s = scene(host, W, H);
    txt(s, padX, 30, "MAESTRO Layer", { size: 18, weight: 700, col: COL.ink });
    txt(s, padX + c1 + 14, 30, "Anthropic MCP mapping", { size: 18, weight: 700, col: COL.accent });
    line(s, padX, 44, W - padX, 44, { strokeWidth: 2 });

    rows.forEach((r, i) => {
      const y = top + i * rh;
      // left coloured cell
      rect(s, padX, y, c1, rh - 8, { fill: hex(r[2], .12), fillStyle: "solid", stroke: r[2], strokeWidth: 1.8 });
      wrap(s, padX + 14, y + 24, r[0], 26, { size: 16, weight: 700, col: r[2], lh: 19 });
      // right cell
      rect(s, padX + c1 + 14, y, W - padX * 2 - c1 - 14, rh - 8, { fill: "#ffffff", fillStyle: "solid", stroke: "#c9c4b8", strokeWidth: 1.3 });
      wrap(s, padX + c1 + 30, y + 23, r[1], 52, { size: 15, col: COL.slate, lh: 18 });
    });
  }

  /* ============================================================
     FIGURE: Step-2 agentic factors (5 cards)
     ============================================================ */
  function figFactors(host) {
    const cards = [
      ["⚄", "Non-Determinism", COL.blue],
      ["🤖", "Autonomy", COL.green],
      ["⛓", "No Trust\nBoundary", COL.orange],
      ["🪪", "Dynamic Identity\n& Access", COL.violet],
      ["🕸", "Multi-Agent\nComplexity", COL.red],
    ];
    const W = 940, n = cards.length, gap = 20, padX = 14;
    const cw = (W - padX * 2 - gap * (n - 1)) / n, ch = 170, top = 30;
    const s = scene(host, W, top + ch + 20);
    cards.forEach(([ic, label, c], i) => {
      const x = padX + i * (cw + gap);
      rect(s, x, top, cw, ch, { fill: hex(c, .1), fillStyle: "solid", stroke: c, strokeWidth: 2.2 });
      add(s, s.rc.circle(x + cw / 2, top + 52, 56, { fill: hex(c, .9), fillStyle: "solid", stroke: c, roughness: .7 }));
      txt(s, x + cw / 2, top + 60, ic, { size: 30, anchor: "middle" });
      const lines = label.split("\n");
      lines.forEach((ln, j) =>
        txt(s, x + cw / 2, top + 110 + j * 22, ln, { size: 16.5, anchor: "middle", weight: 700, col: c }));
    });
  }

  /* ============================================================
     TOOL MOCKUPS (hand-drawn browser windows)
     ============================================================ */
  function browser(s, title) {
    rect(s, 6, 6, s.w - 12, s.h - 12, { fill: "#ffffff", fillStyle: "solid", stroke: COL.ink, strokeWidth: 1.8 });
    line(s, 6, 40, s.w - 6, 40, { strokeWidth: 1.4 });
    ["#e03131", "#f6b73c", "#2f9e44"].forEach((c, i) =>
      add(s, s.rc.circle(26 + i * 18, 23, 11, { fill: c, fillStyle: "solid", stroke: c, roughness: .6 })));
    rect(s, 84, 13, s.w - 110, 20, { fill: "#f4f1ea", fillStyle: "solid", stroke: "#cfcabe", strokeWidth: 1 });
    txt(s, 96, 28, title, { size: 12.5, col: COL.slate, family: "'Inter',sans-serif" });
  }

  function figToolInput(host) {
    const s = scene(host, 380, 320); browser(s, "maestro-sentinel.com");
    txt(s, 24, 70, "Describe Your Architecture", { size: 18, weight: 700 });
    txt(s, 24, 95, "System name", { size: 12.5, col: COL.slate, family: "'Inter',sans-serif" });
    rect(s, 24, 102, 332, 26, { fill: "#fff", fillStyle: "solid", stroke: "#c9c4b8" });
    txt(s, 34, 119, "AutoTrade Pro — AI Trading Platform", { size: 12.5, col: "#333", family: "'Inter',sans-serif" });
    txt(s, 24, 150, "Architecture description", { size: 12.5, col: COL.slate, family: "'Inter',sans-serif" });
    rect(s, 24, 157, 332, 92, { fill: "#fff", fillStyle: "solid", stroke: "#c9c4b8" });
    [0, 1, 2, 3].forEach(i => line(s, 36, 176 + i * 18, i === 3 ? 250 : 344, 176 + i * 18, { stroke: "#d8d3c7", strokeWidth: 3 }));
    rect(s, 24, 266, 332, 34, { fill: hex(COL.accent, .95), fillStyle: "solid", stroke: COL.accent, strokeWidth: 2 });
    txt(s, 190, 288, "✦ Start MAESTRO Analysis", { size: 14, anchor: "middle", weight: 700, col: "#fff" });
  }

  function figToolLibrary(host) {
    const s = scene(host, 380, 320); browser(s, "Threat Intelligence Library");
    txt(s, 24, 66, "Threat Intelligence Library", { size: 16, weight: 700 });
    const stats = [["880", "Critical", COL.red], ["1501", "High", COL.orange],
    ["827", "Medium", COL.yellow], ["1", "Low", COL.blue]];
    const sw = 78, sx = 24;
    stats.forEach(([n, l, c], i) => {
      const x = sx + i * (sw + 8);
      rect(s, x, 82, sw, 56, { fill: hex(c, .1), fillStyle: "solid", stroke: c, strokeWidth: 1.8 });
      txt(s, x + sw / 2, 110, n, { size: 20, anchor: "middle", weight: 700, col: c });
      txt(s, x + sw / 2, 128, l, { size: 11, anchor: "middle", col: COL.slate, family: "'Inter',sans-serif" });
    });
    rect(s, 24, 152, 332, 22, { fill: "#fff", fillStyle: "solid", stroke: "#c9c4b8" });
    txt(s, 34, 167, "🔍  Search threats…", { size: 12, col: "#999", family: "'Inter',sans-serif" });
    rect(s, 24, 184, 332, 110, { fill: "#fdfbf6", fillStyle: "solid", stroke: "#ddd8cc" });
    ["Evaluation & Observability", "HIGH", "AIVSS Core-3", "MITRE-3"].forEach((t, i) => {
      const bx = 36 + (i ? [0, 150, 188, 270][i] : 0);
      const cc = [COL.teal, COL.red, COL.violet, COL.blue][i];
      rect(s, bx, 196, [110, 34, 78, 60][i], 16, { fill: hex(cc, .14), fillStyle: "solid", stroke: cc, strokeWidth: 1 });
      txt(s, bx + 6, 208, t, { size: 9, col: cc, family: "'Inter',sans-serif", weight: 700 });
    });
    txt(s, 36, 234, "Unauthorized Market Data Access", { size: 14, weight: 700 });
    wrap(s, 36, 252, "An attacker reaches the Market Data Agent and exfiltrates sensitive trading patterns over Kafka.", 60,
      { size: 11, col: COL.slate, family: "'Inter',sans-serif", lh: 15 });
  }

  function figToolDetail(host) {
    const s = scene(host, 380, 320); browser(s, "Threat Detail");
    txt(s, 24, 66, "Unauthorized Market Data Access", { size: 14, weight: 700 });
    const maps = [["OWASP AIVSS Core-3", COL.violet], ["MITRE ATLAS-3", COL.red], ["OWASP Agentic ASI03", COL.blue]];
    let y = 84;
    maps.forEach(([t, c]) => {
      rect(s, 24, y, 332, 30, { fill: hex(c, .08), fillStyle: "solid", stroke: c, strokeWidth: 1.5 });
      txt(s, 36, y + 19, t, { size: 12.5, weight: 700, col: c, family: "'Inter',sans-serif" });
      y += 38;
    });
    txt(s, 24, y + 14, "Mitigation strategies", { size: 14, weight: 700, col: COL.green });
    y += 28;
    ["End-to-end encryption for Kafka messages",
      "Strict access control on the Market Data Agent",
      "Rotate API keys & secrets in AWS Secrets Manager"].forEach(t => {
        add(s, s.rc.circle(32, y - 4, 7, { fill: COL.green, fillStyle: "solid", stroke: COL.green, roughness: .6 }));
        wrap(s, 44, y, t, 52, { size: 12, col: COL.slate, family: "'Inter',sans-serif", lh: 14 });
        y += 26;
      });
  }

  /* ---------- dispatch ---------- */
  const FIGS = {
    limitations: figLimitations, mindmap: figMindmap, mapping: figMapping,
    factors: figFactors, "tool-input": figToolInput,
    "tool-library": figToolLibrary, "tool-detail": figToolDetail,
  };

  function render() {
    document.querySelectorAll("[data-fig]").forEach(host => {
      if (host.dataset.done) return; host.dataset.done = "1";
      const dark = !!host.closest(".section--dark");
      try { FIGS[host.dataset.fig](host, dark); } catch (e) { console.error(host.dataset.fig, e); }
    });
  }

  /* reveal-on-scroll */
  function reveal() {
    const els = document.querySelectorAll(".draw,.card,.about__list li,.mock");
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: .15 });
    els.forEach(e => io.observe(e));
  }

  if (document.readyState !== "loading") { render(); reveal(); }
  else document.addEventListener("DOMContentLoaded", () => { render(); reveal(); });
})();
