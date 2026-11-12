/* Shared page behaviour (index.html, donate.html, report.html). Links and data come from config.js. */
(function () {
  for (const [id, m] of Object.entries(SITE.mods)) {
    document.querySelectorAll(`[data-dl="${id}"]`).forEach(a => a.href = `${SITE.repo}/releases/download/${m.tag}/${m.file}`);
    document.querySelectorAll(`[data-ver="${id}"]`).forEach(b => b.textContent = "v" + m.version);
    document.querySelectorAll(`[data-store="${id}"]`).forEach(a => { if (m.store) a.href = m.store; else a.remove(); });
  }
  // "ใหม่" badge on the most recently added game, for 30 days after its first release
  const newest = Object.entries(SITE.mods).filter(([, m]) => m.added).sort((a, b) => Date.parse(b[1].added) - Date.parse(a[1].added))[0];
  if (newest && Date.now() - Date.parse(newest[1].added) < 30 * 864e5)
    document.querySelectorAll(`[data-new="${newest[0]}"]`).forEach(b => b.hidden = false);

  // hero numbers come from the game list, so adding a game updates them
  const mods = Object.values(SITE.mods);
  document.querySelectorAll('[data-stat="games"]').forEach(b => { b.dataset.count = mods.length; b.textContent = mods.length; });
  const lines = Math.floor(mods.reduce((n, m) => n + (m.lines || 0), 0) / 1000) * 1000;
  document.querySelectorAll('[data-stat="lines"]').forEach(b => { b.dataset.count = lines; b.textContent = lines.toLocaleString("en-US") + "+"; });

  // under each download button: file size · update date · tested game version · what changed
  const fmtSize = b => (b >= 1e6 ? Math.round(b / 1e6) : (b / 1e6).toFixed(1)) + " MB";
  const fmtDate = d => new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
  function meta(id, size, date) {
    const m = SITE.mods[id];
    document.querySelectorAll(`[data-meta="${id}"]`).forEach(p => {
      p.textContent = "";
      const parts = [`ไฟล์ zip ${fmtSize(size)}`, `อัปเดต ${fmtDate(date)}`];
      if (m.gameVer) parts.push(`ทดสอบกับเกม ${m.gameVer}`);
      parts.forEach((t, i) => {
        if (i) { const s = document.createElement("span"); s.className = "sep"; s.textContent = "·"; p.append(s); }
        p.append(t);
      });
      const s = document.createElement("span"); s.className = "sep"; s.textContent = "·";
      const a = document.createElement("a");
      a.href = `${SITE.repo}/releases/tag/${m.tag}`; a.target = "_blank"; a.rel = "noopener";
      a.textContent = "ดูว่าแก้อะไรบ้าง ↗";
      p.append(s, a);
    });
  }
  for (const [id, m] of Object.entries(SITE.mods)) if (m.size) meta(id, m.size, m.date);
  // the live size/date of each release (config values stay if GitHub can't be reached)
  if (document.querySelector("[data-meta]") && window.fetch) {
    fetch(SITE.repo.replace("https://github.com/", "https://api.github.com/repos/") + "/releases?per_page=30")
      .then(r => r.ok ? r.json() : [])
      .then(rels => {
        for (const [id, m] of Object.entries(SITE.mods)) {
          const rel = rels.find(r => r.tag_name === m.tag);
          const asset = rel && rel.assets.find(a => a.name === m.file);
          if (asset) meta(id, asset.size, rel.published_at);
        }
      }).catch(() => {});
  }

  // QR cards (SITE.donate.qrImages): same-size square QR, colored title bar, account name under it
  document.querySelectorAll("[data-account]").forEach(e => e.textContent = SITE.donate.accountName || "");
  const qrGrid = document.getElementById("qrGrid");
  if (qrGrid) {
    for (const q of SITE.donate.qrImages || []) {
      const fig = document.createElement("figure"); fig.className = "qr-card";
      const head = document.createElement("div"); head.className = "qr-head"; head.style.background = q.color || "var(--accent)";
      head.innerHTML = "<b></b><small></small>";
      head.querySelector("b").textContent = q.label;
      head.querySelector("small").textContent = q.sub || "";
      const img = document.createElement("img"); img.src = q.src; img.alt = "QR " + q.label;
      img.width = 600; img.height = 600; img.loading = "lazy";
      const name = document.createElement("figcaption"); name.textContent = SITE.donate.accountName || "";
      fig.append(head, img, name);
      qrGrid.append(fig);
    }
    // bank account card, same size as the QR cards
    const bk = SITE.donate.bank;
    if (bk && bk.number) {
      const fig = document.createElement("figure"); fig.className = "qr-card bank-card";
      const head = document.createElement("div"); head.className = "qr-head"; head.style.background = bk.color || "var(--accent)";
      head.innerHTML = "<b></b><small></small>";
      head.querySelector("b").textContent = bk.label;
      head.querySelector("small").textContent = bk.sub || "";
      const body = document.createElement("div"); body.className = "bank-body";
      let icon;
      if (bk.logo) {
        icon = document.createElement("img"); icon.className = "bank-logo"; icon.src = bk.logo;
        icon.alt = bk.label; icon.width = 64; icon.height = 64;
      } else {
        icon = document.createElement("div"); icon.className = "bank-icon"; icon.textContent = "🏦";
      }
      const label = document.createElement("small"); label.textContent = "เลขบัญชี";
      const no = document.createElement("div"); no.className = "bank-no"; no.textContent = bk.number;
      const btn = document.createElement("button"); btn.type = "button"; btn.className = "bank-copy"; btn.textContent = "📋 คัดลอกเลขบัญชี";
      btn.onclick = () => {
        const digits = bk.number.replace(/\D/g, "");
        (navigator.clipboard ? navigator.clipboard.writeText(digits) : Promise.reject()).then(() => {
          btn.textContent = "✓ คัดลอกแล้ว"; setTimeout(() => { btn.textContent = "📋 คัดลอกเลขบัญชี"; }, 1600);
        }).catch(() => { btn.textContent = digits; });
      };
      body.append(icon, label, no, btn);
      const name = document.createElement("figcaption"); name.textContent = SITE.donate.accountName || "";
      fig.append(head, body, name);
      qrGrid.append(fig);
    }
  }

  // ===== animation =====
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // smooth open/close for every <details> (install guides + FAQ); the "วิธีติดตั้ง" buttons toggle their guide
  const isOpen = d => d.open && !d.classList.contains("closing");
  const syncButtons = (d, open) => {
    if (d.id) document.querySelectorAll(`[data-open="${d.id}"]`).forEach(b => b.setAttribute("aria-expanded", String(open)));
  };
  function setDetails(d, open, done) {
    syncButtons(d, open);
    if (calm || !d.animate) { d.open = open; d.classList.remove("closing"); if (done) done(); return; }
    const from = d.getBoundingClientRect().height;
    if (d._anim) d._anim.cancel();
    d.classList.remove("closing");
    d.open = open;
    const to = d.getBoundingClientRect().height;
    d.open = true;                                   // keep the content visible while it slides
    if (!open) d.classList.add("closing");
    d.style.overflow = "hidden";
    const opts = { duration: 340, easing: "cubic-bezier(.2,.7,.2,1)", fill: "forwards" };
    (d._fades || []).forEach(f => f.cancel());
    const a = d.animate({ height: [from + "px", to + "px"] }, opts);
    d._fades = [...d.querySelectorAll(":scope > :not(summary)")].map(el => el.animate(
      open ? { opacity: [0, 1], transform: ["translateY(-8px)", "none"] } : { opacity: [1, 0], transform: ["none", "translateY(-8px)"] },
      { ...opts, duration: open ? 380 : 220 }));
    d._anim = a;
    a.onfinish = () => {
      d._anim = null; d.style.overflow = "";
      if (!open) { d.open = false; d.classList.remove("closing"); }
      a.cancel(); d._fades.forEach(f => f.cancel()); d._fades = [];   // back to natural height / full opacity
      if (done) done();
    };
  }
  document.querySelectorAll("details > summary").forEach(s => s.addEventListener("click", e => {
    e.preventDefault();
    const d = s.parentElement;
    setDetails(d, !isOpen(d));
  }));
  document.querySelectorAll("[data-open]").forEach(btn => {
    const d = document.getElementById(btn.dataset.open);
    btn.setAttribute("aria-controls", d.id);
    btn.setAttribute("aria-expanded", String(d.open));
    btn.addEventListener("click", () => {
      const open = !isOpen(d);
      setDetails(d, open, open ? () => d.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "nearest" }) : null);
    });
  });

  // floating letters behind the hero (Thai, Japanese, Korean, Latin: "translation")
  const glyphBox = document.querySelector(".glyphs");
  if (glyphBox && !calm) {
    const chars = "กขคทนภษไ๑あカ文한글ATÉ".split("");
    const n = innerWidth < 640 ? 10 : 18;
    for (let i = 0; i < n; i++) {
      const g = document.createElement("span");
      g.className = "glyph";
      g.textContent = chars[Math.floor(Math.random() * chars.length)];
      const dur = 14 + Math.random() * 14;
      g.style.left = (Math.random() * 100) + "%";
      g.style.fontSize = (16 + Math.random() * 30) + "px";
      g.style.animationDuration = dur + "s";
      g.style.animationDelay = (-Math.random() * dur) + "s";
      g.style.setProperty("--o", (0.12 + Math.random() * 0.25).toFixed(2));
      g.style.setProperty("--r", (Math.random() * 60 - 30).toFixed(0) + "deg");
      if (Math.random() < 0.45) g.style.color = "var(--accent2)";
      glyphBox.append(g);
    }
  }

  // count-up numbers in the hero stats
  const counters = document.querySelectorAll("[data-count]");
  if (!calm) counters.forEach(el => {
    const end = +el.dataset.count, plus = el.dataset.plus ? "+" : "", t0 = performance.now() + 500, len = 1400;
    const fmt = v => v.toLocaleString("en-US") + plus;
    el.textContent = fmt(0);
    const step = now => {
      const t = Math.min(1, Math.max(0, (now - t0) / len));
      el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  // fade things in as they scroll into view
  if (!calm && "IntersectionObserver" in window) {
    const items = document.querySelectorAll("section h2, .mod, .faq details, .support, .form, .qr-card");
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el, i) => {
      el.classList.add("reveal");
      if (el.matches(".faq details, .qr-card")) el.style.transitionDelay = (i % 6) * 60 + "ms";
      io.observe(el);
    });
  }

  const btn = document.getElementById("themeBtn");
  const apply = t => { if (t) document.documentElement.setAttribute("data-theme", t); else document.documentElement.removeAttribute("data-theme"); };
  try { apply(localStorage.getItem("theme")); } catch (e) {}
  // theme switch: the whole page cross-fades to the new theme (View Transitions, timing in style.css);
  // browsers without it fade the colours instead; reduced motion switches instantly
  if (btn) btn.onclick = () => {
    const root = document.documentElement;
    const cur = root.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    const next = cur === "light" ? "dark" : "light";
    const swap = () => {
      apply(next); try { localStorage.setItem("theme", next); } catch (e) {}
      if (!calm) btn.querySelectorAll("svg").forEach(s => s.animate(
        { transform: ["rotate(-90deg) scale(.6)", "none"], opacity: [0, 1] }, { duration: 450, easing: "cubic-bezier(.4,0,.2,1)" }));
    };
    if (calm) return swap();
    if (!document.startViewTransition) {
      root.classList.add("theme-fade"); swap();
      return setTimeout(() => root.classList.remove("theme-fade"), 450);
    }
    document.startViewTransition(swap).ready.catch(() => {});
  };
})();
