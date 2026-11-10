/* Report form. With SITE.report.web3formsKey set, reports are sent by email through web3forms.com
   (no account needed for the reporter). Without a key, "ส่งเลย" opens a prefilled GitHub issue instead. */
(function () {
  const $ = id => document.getElementById(id);
  const form = $("reportForm"), msg = $("msg"), sendBtn = $("sendBtn");
  const key = (SITE.report && SITE.report.web3formsKey) || "";

  const q = new URLSearchParams(location.search).get("game");
  if (q && SITE.mods[q]) $("game").value = q;

  const kind = () => (form.querySelector('input[name="kind"]:checked') || {}).value || "";
  const val = id => $(id).value.trim();
  const gameName = () => { const m = SITE.mods[$("game").value]; return m ? m.name : ""; };
  const gameVer = () => { const m = SITE.mods[$("game").value]; return m ? m.version : ""; };

  function report() {
    const short = $("game").value === "yohanuma" ? "Yohanuma" : gameName();
    return {
      title: `[${short}] ${kind()}: ${val("where")}`.slice(0, 120),
      fields: [
        ["เกม", `${gameName()} (ม็อด v${gameVer()})`],
        ["ปัญหา", kind()],
        ["ตรงไหน", val("where")],
        ["ข้อความที่เห็น", val("now") || "-"],
        ["ควรเป็น", val("should") || "-"],
        ["เล่าเพิ่ม", val("more") || "-"],
        ["ติดต่อกลับ", val("contact") || "-"],
      ],
    };
  }
  const asText = r => r.title + "\n\n" + r.fields.map(([k, v]) => `${k}: ${v}`).join("\n");
  const asMarkdown = r => r.fields.filter(([k]) => k !== "ติดต่อกลับ").map(([k, v]) => `**${k}:** ${v}`).join("\n\n")
    + "\n\n_(แนบรูปได้โดยลากรูปมาวางในช่องนี้)_";

  function check() {
    if (!$("game").value) return "เลือกเกมก่อนนะ";
    if (!kind()) return "เลือกว่าเป็นปัญหาแบบไหนก่อนนะ";
    if (!val("where")) return "บอกหน่อยว่าเจอตรงไหนในเกม";
    return "";
  }
  function show(text, err) { msg.textContent = text; msg.className = "msg" + (err ? " err" : ""); }
  const githubUrl = r => `${SITE.repo}/issues/new?title=${encodeURIComponent(r.title)}&body=${encodeURIComponent(asMarkdown(r))}`;

  $("githubLink").addEventListener("click", e => {
    const bad = check();
    if (bad) { e.preventDefault(); return show(bad, true); }
    e.currentTarget.href = githubUrl(report());
  });
  if (!key) $("githubAlt").hidden = true;   // the main button already goes to GitHub

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const bad = check(); if (bad) return show(bad, true);
    const r = report();
    if (!key) {
      window.open(githubUrl(r), "_blank", "noopener");
      return show("เปิดหน้า GitHub ให้แล้ว กด Submit new issue เพื่อส่ง");
    }
    sendBtn.disabled = true; show("กำลังส่ง...");
    try {
      const body = { access_key: key, subject: "แจ้งปัญหาม็อด " + r.title, from_name: "TripleT Translate - แจ้งปัญหา",
                     botcheck: $("botcheck").checked };
      for (const [k, v] of r.fields) body[k] = v;
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || res.status);
      form.reset();
      show("ส่งแล้ว ขอบคุณมาก ๆ ที่ช่วยแจ้งนะ 🙏");
    } catch (err) {
      show("ส่งไม่สำเร็จ ลองใหม่อีกครั้ง หรือกด \"คัดลอกข้อความ\" แล้วส่งช่องทางอื่น", true);
    } finally {
      sendBtn.disabled = false;
    }
  });

  $("copyBtn").addEventListener("click", () => {
    const bad = check(); if (bad) return show(bad, true);
    const text = asText(report());
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
      .then(() => show("คัดลอกแล้ว เอาไปวางส่งในแชทหรือคอมเมนต์ได้เลย"))
      .catch(() => show("คัดลอกไม่ได้ ลองเลือกข้อความในช่องแล้วคัดลอกเองนะ", true));
  });
})();
