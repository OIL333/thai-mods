/* ===== แก้ลิงก์และข้อมูลตรงนี้ที่เดียว ===== */
window.SITE = {
  repo: "https://github.com/OIL333/thai-mods",
  // ต่อเกม: added = วันที่เปิดให้โหลดครั้งแรก, lines = จำนวนข้อความที่แปล (รวมเป็นตัวเลขหน้าแรก),
  // gameVer = เวอร์ชันเกมที่ใช้ทดสอบ ใส่แค่ตัวเลข เช่น "1.0.18" (หน้าเว็บเติม v ให้; เว้นว่างถ้าไม่รู้), size/date = ค่าสำรอง (หน้าเว็บอ่านค่าจริงจาก GitHub release)
  // notice = ข้อความเตือนบนการ์ดเกม เช่น เกมอัปเดตแล้วม็อดยังใช้ไม่ได้ (เว้นว่าง "" = ไม่แสดง) ตั้งง่าย ๆ ด้วย python -I release/game_check.py แจ้ง <เกม> …
  mods: {
    yohanuma: {
      version: "1.0.7", tag: "yohanuma-v1.0.7", file: "Yohanuma-ThaiMod-v1.0.7.zip",
      name: "Yohane the Parhelion - NUMAZU in the MIRAGE -",
      added: "2026-11-10", lines: 6182, gameVer: "1.0.18", size: 34531189, date: "2026-11-22",
      store: "https://store.steampowered.com/app/2459750/",
      notice: "",
    },
    train45: {
      version: "1.0.5", tag: "train45-v1.0.5", file: "Train45-ThaiMod-v1.0.5.zip",
      name: "Train45",
      added: "2026-11-10", lines: 7462, gameVer: "1.0.6.4", size: 550039, date: "2026-11-18",
      store: "https://store.steampowered.com/app/3711590/",
      notice: "",
    },
    nijichizu: {
      version: "1.0.2", tag: "nijichizu-v1.0.2", file: "Nijichizu-ThaiMod-v1.0.2.zip",
      name: "Love Live! Nijigasaki High School Idol Club TOKIMEKI Roadmap to the Future",
      added: "2026-11-12", lines: 14880, gameVer: "1.0.1", size: 46464784, date: "2026-11-16",
      store: "https://store.steampowered.com/app/3213690/",
      notice: "",
    },
    aeruta: {
      version: "1.0.0", tag: "aeruta-v1.0.0", file: "Aeruta-ThaiMod-v1.0.0.zip",
      name: "Aeruta",
      added: "2026-11-16", lines: 8565, gameVer: "1.2.2", size: 35010794, date: "2026-11-16",
      store: "https://store.steampowered.com/app/2286780/",
      notice: "",
    },
    vlover: {
      version: "1.0.1", tag: "vlover-v1.0.1", file: "VLover-ThaiMod-v1.0.1.zip",
      name: "V-LOVER!",
      added: "2026-11-17", lines: 8164, gameVer: "0.1.09", size: 38517184, date: "2026-11-23",
      store: "https://store.steampowered.com/app/3044740/",
      notice: "",
    },
    ijwtbs: {
      version: "1.0.0", tag: "ijwtbs-v1.0.0", file: "IJWTBS-ThaiMod-v1.0.0.zip",
      name: "I Just Want to be Single!! - Season One",
      added: "2026-11-26", lines: 3880, gameVer: "1.1.0", size: 1393496, date: "2026-11-26",
      store: "https://store.steampowered.com/app/1703610/",
      notice: "",
    },
    va11halla: {
      version: "1.0.0", tag: "va11halla-v1.0.0", file: "VA11HallA-ThaiMod-v1.0.0.zip",
      name: "VA-11 Hall-A: Cyberpunk Bartender Action",
      added: "2026-11-27", lines: 18150, gameVer: "1.2.3.0", size: 842422, date: "2026-11-27",
      store: "https://store.steampowered.com/app/447530/",
      notice: "",
    },
  },
  donate: {
    accountName: "กษิดิ์เดช ปทุมมาศ",
    // การ์ดบัญชีธนาคาร (โอนผ่านเลขบัญชี) ขนาดเท่าการ์ด QR
    bank: { label: "ธนาคารกสิกรไทย", sub: "โอนผ่านเลขบัญชี", number: "073-8-97547-2", color: "#00a650", logo: "assets/kbank-logo.png" },
    // รูป QR จากแอปจริง ครอปเป็นสี่เหลี่ยมจัตุรัส (เปลี่ยนรูปได้ที่โฟลเดอร์ assets)
    qrImages: [
      { src: "assets/qr-promptpay.png", label: "พร้อมเพย์", sub: "สแกนได้ทุกแอปธนาคาร", color: "#113f67" },
      { src: "assets/qr-truemoney.png", label: "ทรูมันนี่วอลเล็ท", sub: "สแกนด้วยแอปทรูมันนี่", color: "#f47a20" },
    ],
  },
  report: {
    // กุญแจจาก web3forms.com (ฟรี) ให้คนแจ้งปัญหาได้โดยไม่ต้องมีบัญชีอะไร รายงานจะส่งเข้าอีเมลของคุณ
    // เว้นว่าง = ปุ่ม "ส่งเลย" จะเปิดหน้า GitHub แทน
    web3formsKey: "3f2820b6-9967-4550-82e5-1add34815801",
  },
};
/* ======================================== */
