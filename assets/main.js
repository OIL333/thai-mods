/* Shared page behaviour (index.html, donate.html, report.html). Links and data come from config.js. */
(function () {
  for (const [id, m] of Object.entries(SITE.mods)) {
    document.querySelectorAll(`[data-dl="${id}"]`).forEach(a => a.href = `${SITE.repo}/releases/download/${m.tag}/${m.file}`);
    document.querySelectorAll(`[data-ver="${id}"]`).forEach(b => b.textContent = "v" + m.version);
    document.querySelectorAll(`[data-store="${id}"]`).forEach(a => { if (m.store) a.href = m.store; else a.remove(); });
  }
  document.querySelectorAll('[data-link="issues"]').forEach(a => a.href = SITE.repo + "/issues");
  document.querySelectorAll("[data-open]").forEach(btn => btn.addEventListener("click", () => {
    const d = document.getElementById(btn.dataset.open);
    d.open = true;
    d.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }));

  const list = document.getElementById("payList");
  if (list) {
    for (const it of SITE.donate.items || []) {
      const li = document.createElement("li");
      const s = document.createElement("span"); s.textContent = it.label;
      const b = document.createElement("b"); b.textContent = it.value;
      li.append(s, b);
      if (it.copy) {
        const c = document.createElement("button"); c.className = "copy"; c.type = "button"; c.textContent = "คัดลอก";
        c.onclick = () => { navigator.clipboard?.writeText(it.value.replace(/[^0-9]/g, "")).then(() => { c.textContent = "คัดลอกแล้ว"; setTimeout(() => c.textContent = "คัดลอก", 1500); }); };
        b.append(c);
      }
      list.append(li);
    }
  }
  const koFiRow = document.getElementById("koFiRow");
  if (koFiRow && SITE.donate.koFi) { koFiRow.hidden = false; document.getElementById("koFiLink").href = SITE.donate.koFi; }
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
  }

  // ===== in-game screenshot gallery + lightbox =====
  const galleries = document.querySelectorAll("[data-gallery]");
  if (galleries.length) {
    const lb = document.createElement("div");
    lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.hidden = true;
    lb.innerHTML = '<button class="lb-btn lb-close" type="button" aria-label="ปิด">✕</button>' +
      '<button class="lb-btn lb-prev" type="button" aria-label="ภาพก่อนหน้า">‹</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lb-btn lb-next" type="button" aria-label="ภาพถัดไป">›</button>';
    document.body.append(lb);
    const img = lb.querySelector("img"), cap = lb.querySelector("figcaption");
    let list = [], idx = 0, lastFocus = null;
    const show = i => {
      idx = (i + list.length) % list.length;
      img.src = list[idx].src; img.alt = list[idx].caption || ""; cap.textContent = list[idx].caption || "";
      lb.querySelectorAll(".lb-prev, .lb-next").forEach(b => b.hidden = list.length < 2);
    };
    const open = (shots, i) => {
      list = shots; lastFocus = document.activeElement; show(i);
      lb.hidden = false; requestAnimationFrame(() => lb.classList.add("open"));
      document.body.style.overflow = "hidden"; lb.querySelector(".lb-close").focus();
    };
    const close = () => {
      lb.classList.remove("open"); document.body.style.overflow = "";
      setTimeout(() => { lb.hidden = true; }, 250); if (lastFocus) lastFocus.focus();
    };
    lb.addEventListener("click", e => { if (e.target === lb || e.target.closest(".lb-close")) close(); });
    lb.querySelector(".lb-prev").onclick = () => show(idx - 1);
    lb.querySelector(".lb-next").onclick = () => show(idx + 1);
    document.addEventListener("keydown", e => {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(idx - 1);
      else if (e.key === "ArrowRight") show(idx + 1);
    });
    galleries.forEach(box => {
      const shots = (SITE.mods[box.dataset.gallery] || {}).shots || [];
      if (!shots.length) { box.remove(); return; }
      const h = document.createElement("h4"); h.textContent = "📸 ภาพจากในเกม (กดเพื่อดูภาพใหญ่)";
      const row = document.createElement("div"); row.className = "row";
      shots.forEach((s, i) => {
        const b = document.createElement("button"); b.type = "button"; b.className = "thumb";
        b.setAttribute("aria-label", "ดูภาพใหญ่: " + (s.caption || ""));
        const t = document.createElement("img"); t.src = s.thumb || s.src; t.alt = s.caption || ""; t.loading = "lazy";
        const c = document.createElement("span"); c.textContent = s.caption || "";
        b.append(t, c); b.onclick = () => open(shots, i);
        row.append(b);
      });
      box.append(h, row);
    });
  }

  // ===== animation =====
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    const items = document.querySelectorAll("section h2, .ai-note, .mod, .faq details, .support, .form, .qr-card");
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
  if (btn) btn.onclick = () => {
    const cur = document.documentElement.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    const next = cur === "light" ? "dark" : "light";
    apply(next); try { localStorage.setItem("theme", next); } catch (e) {}
  };
})();
