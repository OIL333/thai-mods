/* Report form: builds a Thai bug report and opens a prefilled GitHub issue (or copies it). */
(function () {
  const GAMES = {
    yohanuma: "Yohane the Parhelion - NUMAZU in the MIRAGE -",
    train45: "Train45",
  };
  const $ = id => document.getElementById(id);
  const form = $("reportForm"), msg = $("msg"), preview = $("preview");

  // ?game=train45 preselects a game
  const qGame = new URLSearchParams(location.search).get("game");
  if (qGame && GAMES[qGame]) $("game").value = qGame;
  const fillVer = () => { const m = SITE.mods[$("game").value]; if (m && !$("ver").dataset.touched) $("ver").value = m.version; };
  fillVer();
  $("game").addEventListener("change", fillVer);
  $("ver").addEventListener("input", () => $("ver").dataset.touched = "1");

  if (SITE.report && SITE.report.contact) {
    const c = $("contactBtn"); c.hidden = false; c.href = SITE.report.contact; c.textContent = SITE.report.contactLabel || "ช่องทางอื่น";
  }

  const kind = () => (form.querySelector('input[name="kind"]:checked') || {}).value || "";
  const val = id => $(id).value.trim();

  function build() {
    const g = $("game").value;
    const title = `[${g ? GAMES[g].split(" - ")[0].replace("Yohane the Parhelion", "Yohanuma") : "?"}] ${kind() || "ปัญหา"}: ${val("where") || "-"}`;
    const lines = [
      `**เกม:** ${g ? GAMES[g] : "-"}`,
      `**เวอร์ชันม็อด:** ${val("ver") || "-"}`,
      `**ประเภท:** ${kind() || "-"}`,
      `**ตำแหน่งในเกม:** ${val("where") || "-"}`,
      "",
      "**ข้อความที่เห็นตอนนี้**",
      val("now") ? "```\n" + val("now") + "\n```" : "-",
      "",
      "**ควรเป็น**",
      val("should") || "-",
      "",
      "**รายละเอียดเพิ่มเติม**",
      val("more") || "-",
      "",
      "_(แนบภาพหน้าจอได้โดยลากรูปมาวางในช่องนี้)_",
    ];
    return { title: title.slice(0, 120), body: lines.join("\n") };
  }

  function check() {
    if (!$("game").value) return "เลือกเกมก่อนนะ";
    if (!kind()) return "เลือกประเภทปัญหาก่อนนะ";
    if (!val("where")) return "บอกตำแหน่งในเกมที่เจอปัญหาด้วยนะ";
    return "";
  }

  function show(text, err) { msg.textContent = text; msg.className = "msg" + (err ? " err" : ""); }

  form.addEventListener("input", () => { const r = build(); preview.textContent = r.title + "\n\n" + r.body; });
  form.addEventListener("change", () => { const r = build(); preview.textContent = r.title + "\n\n" + r.body; });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const bad = check(); if (bad) return show(bad, true);
    const r = build();
    const url = `${SITE.repo}/issues/new?title=${encodeURIComponent(r.title)}&body=${encodeURIComponent(r.body)}`;
    window.open(url, "_blank", "noopener");
    show("เปิดหน้า GitHub ให้แล้ว ตรวจข้อความแล้วกด Submit new issue ได้เลย ขอบคุณที่แจ้งนะ");
  });

  $("copyBtn").addEventListener("click", () => {
    const bad = check(); if (bad) return show(bad, true);
    const r = build();
    const text = r.title + "\n\n" + r.body.replace(/\*\*/g, "").replace(/```\n?/g, "").replace(/_\(.*\)_/, "");
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
      .then(() => show("คัดลอกรายงานแล้ว นำไปวางส่งในช่องทางที่สะดวกได้เลย"))
      .catch(() => { preview.textContent = text; show("คัดลอกอัตโนมัติไม่ได้ ให้คัดลอกจากช่องตัวอย่างรายงานแทน", true); });
  });
})();
