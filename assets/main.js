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
