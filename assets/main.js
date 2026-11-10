/* Shared page behaviour (index.html, report.html). Links and data come from config.js. */

/** PromptPay static QR payload (Thai QR Payment / EMVCo) for a 10-digit mobile number. */
function promptPayPayload(mobile) {
  const d = String(mobile).replace(/\D/g, "");
  const f = (tag, v) => tag + String(v.length).padStart(2, "0") + v;
  const merchant = f("00", "A000000677010111") + f("01", "0066" + d.slice(1));
  const p = f("00", "01") + f("01", "11") + f("29", merchant) + f("58", "TH") + f("53", "764") + "6304";
  let crc = 0xFFFF;                                  // CRC-16/CCITT-FALSE
  for (let i = 0; i < p.length; i++) {
    crc ^= p.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
  }
  return p + crc.toString(16).toUpperCase().padStart(4, "0");
}

(function () {
  for (const [id, m] of Object.entries(SITE.mods)) {
    document.querySelectorAll(`[data-dl="${id}"]`).forEach(a => a.href = `${SITE.repo}/releases/download/${m.tag}/${m.file}`);
    document.querySelectorAll(`[data-ver="${id}"]`).forEach(b => b.textContent = "v" + m.version);
  }
  document.querySelectorAll('[data-link="issues"]').forEach(a => a.href = SITE.repo + "/issues");
  document.querySelectorAll("[data-open]").forEach(btn => btn.addEventListener("click", () => {
    const d = document.getElementById(btn.dataset.open);
    d.open = true;
    d.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }));

  const list = document.getElementById("payList");
  if (list) {
    for (const it of SITE.donate.items) {
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
  // QR: use SITE.donate.qrImage if the file exists, otherwise build a standard PromptPay QR (EMVCo)
  // from SITE.donate.promptpay (mobile number) with qrcodejs.
  const qrBox = document.getElementById("qrBox");
  if (qrBox) {
    const qrImg = document.getElementById("qrImg");
    const generate = () => {
      qrImg.remove();
      if (!SITE.donate.promptpay || !window.QRCode) return;
      new QRCode(document.getElementById("qrGen"), {
        text: promptPayPayload(SITE.donate.promptpay), width: 240, height: 240,
        colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M,
      });
      qrBox.hidden = false;
    };
    if (SITE.donate.qrImage) {
      qrImg.onload = () => { qrBox.hidden = false; };
      qrImg.onerror = generate;
      qrImg.src = SITE.donate.qrImage;
    } else generate();
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
