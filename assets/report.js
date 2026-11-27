/* Report / suggestion form. With SITE.report.web3formsKey set, messages are emailed through web3forms.com
   (no account needed). Without a key, "ส่งเลย" opens a prefilled GitHub issue instead.
   ?game=train45 preselects a game, ?type=idea opens the suggestion tab. */
(function () {
  const $ = id => document.getElementById(id);
  const form = $("reportForm"), msg = $("msg"), sendBtn = $("sendBtn");
  const key = (SITE.report && SITE.report.web3formsKey) || "";
  let mode = "bug";

  const gameSel = $("game");
  for (const [id, m] of Object.entries(SITE.mods || {})) {
    if (!gameSel.querySelector(`option[value="${id}"]`)) {
      const opt = document.createElement("option");
      opt.value = id; opt.textContent = m.name || id;
      gameSel.append(opt);
    }
  }
  const params = new URLSearchParams(location.search);
  const q = params.get("game");
  if (q && SITE.mods[q]) gameSel.value = q;

  function setMode(m) {
    mode = m;
    form.querySelectorAll(".mode button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.mode === m)));
    form.querySelectorAll(".mode-fields").forEach(f => { f.hidden = f.dataset.for !== m; });
    show("");
  }
  form.querySelectorAll(".mode button").forEach(b => b.addEventListener("click", () => setMode(b.dataset.mode)));
  if (params.get("type") === "idea") setMode("idea");

  const radio = name => (form.querySelector(`input[name="${name}"]:checked`) || {}).value || "";
  const val = id => $(id).value.trim();
  const gameName = () => { const m = SITE.mods[$("game").value]; return m ? m.name : ""; };
  const gameVer = () => { const m = SITE.mods[$("game").value]; return m ? m.version : ""; };

  function report() {
    if (mode === "idea") {
      return {
        kind: "เสนอแนะ",
        title: `[เสนอแนะ] ${radio("topic")}${val("ideaGame") ? ": " + val("ideaGame") : ""}`.slice(0, 120),
        fields: [
          ["เรื่อง", radio("topic")],
          ["เกม", val("ideaGame") || "-"],
          ["รายละเอียด", val("idea")],
          ["ติดต่อกลับ", val("contact") || "-"],
        ],
      };
    }
    const short = { train45: "Train45", yohanuma: "Yohanuma", nijichizu: "Nijichizu",
                    aeruta: "Aeruta", vlover: "V-LOVER", ijwtbs: "IJWTBS", va11halla: "VA-11 Hall-A" }[$("game").value] || gameName();
    return {
      kind: "แจ้งปัญหา",
      title: `[${short}] ${radio("kind")}: ${val("where")}`.slice(0, 120),
      fields: [
        ["เกม", `${gameName()} (ม็อด v${gameVer()})`],
        ["ปัญหา", radio("kind")],
        ["ตรงไหน", val("where")],
        ["ข้อความที่เห็น", val("now") || "-"],
        ["ควรเป็น", val("should") || "-"],
        ["เพิ่มเติม", val("more") || "-"],
        ["ติดต่อกลับ", val("contact") || "-"],
      ],
    };
  }
  const asMarkdown = r => r.fields.filter(([k]) => k !== "ติดต่อกลับ").map(([k, v]) => `**${k}:** ${v}`).join("\n\n")
    + (mode === "bug" ? "\n\n_(แนบรูปได้โดยลากรูปมาวางในช่องนี้)_" : "");

  function check() {
    if (mode === "idea") {
      if (!radio("topic")) return { text: "เลือกก่อนว่าเป็นเรื่องอะไร", el: form.querySelector('input[name="topic"]') };
      if (!val("idea")) return { text: "เล่ารายละเอียดหน่อยนะ", el: $("idea") };
      return null;
    }
    if (!$("game").value) return { text: "เลือกเกมก่อนนะ", el: $("game") };
    if (!radio("kind")) return { text: "เลือกว่าเป็นปัญหาแบบไหนก่อนนะ", el: form.querySelector('input[name="kind"]') };
    if (!val("where")) return { text: "บอกหน่อยว่าเจอตรงไหนในเกม", el: $("where") };
    return null;
  }
  function show(text, err, fallbackUrl) {
    msg.textContent = text;
    msg.className = "msg" + (err ? " err" : "");
    if (fallbackUrl) {
      msg.append(" หรือ ");
      const a = document.createElement("a");
      a.href = fallbackUrl; a.target = "_blank"; a.rel = "noopener";
      a.textContent = "ส่งผ่าน GitHub ↗";
      msg.append(a);
    }
  }
  const githubUrl = r => `${SITE.repo}/issues/new?title=${encodeURIComponent(r.title)}&body=${encodeURIComponent(asMarkdown(r))}`;


  form.addEventListener("submit", async e => {
    e.preventDefault();
    const bad = check();
    if (bad) {
      show(bad.text, true);
      if (bad.el) { bad.el.focus(); bad.el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }
    const r = report();
    if (!key) {
      window.open(githubUrl(r), "_blank", "noopener");
      return show("เปิดหน้า GitHub ให้แล้ว กด Submit new issue เพื่อส่ง");
    }
    sendBtn.disabled = true; show("กำลังส่ง...");
    try {
      const body = { access_key: key, subject: `TripleT: ${r.title}`, from_name: `TripleT Translate - ${r.kind}`,
                     botcheck: $("botcheck").checked };
      for (const [k, v] of r.fields) body[k] = v;
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || res.status);
      const keepMode = mode;
      form.reset(); setMode(keepMode);
      show(keepMode === "idea" ? "ส่งแล้ว ขอบคุณสำหรับไอเดียนะ 💚" : "ส่งแล้ว ขอบคุณมาก ๆ ที่ช่วยแจ้งนะ 🙏");
    } catch (err) {
      show("ส่งไม่สำเร็จ ลองกดส่งอีกครั้งนะ", true, githubUrl(r));
    } finally {
      sendBtn.disabled = false;
    }
  });

})();
