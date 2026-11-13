/* ===== แก้ลิงก์และข้อมูลตรงนี้ที่เดียว ===== */
window.SITE = {
  repo: "https://github.com/OIL333/thai-mods",
  // ต่อเกม: added = วันที่เปิดให้โหลดครั้งแรก (เกมที่ใหม่ที่สุดได้ป้าย "ใหม่" 30 วัน), lines = จำนวนข้อความที่แปล (รวมเป็นตัวเลขหน้าแรก),
  // gameVer = เวอร์ชันเกมที่ใช้ทดสอบ (เว้นว่างถ้าไม่รู้), size/date = ค่าสำรอง (หน้าเว็บอ่านค่าจริงจาก GitHub release)
  mods: {
    yohanuma: {
      version: "1.0.3-beta", tag: "yohanuma-v1.0.3-beta", file: "Yohanuma-ThaiMod-v1.0.3-beta.zip",
      name: "Yohane the Parhelion - NUMAZU in the MIRAGE -",
      added: "2026-11-10", lines: 6182, gameVer: "ver.1.0.18", size: 34397082, date: "2026-11-12",
      store: "https://store.steampowered.com/app/2459750/",
    },
    train45: {
      version: "1.0.2", tag: "train45-v1.0.2", file: "Train45-ThaiMod-v1.0.2.zip",
      name: "Train45",
      added: "2026-11-10", lines: 7462, gameVer: "v1.0.6.4", size: 380175, date: "2026-11-12",
      store: "https://store.steampowered.com/app/3711590/",
    },
    nijichizu: {
      version: "1.0.1-beta", tag: "nijichizu-v1.0.1-beta", file: "Nijichizu-ThaiMod-v1.0.1-beta.zip",
      name: "Love Live! Nijigasaki High School Idol Club TOKIMEKI Roadmap to the Future",
      added: "2026-11-12", lines: 14880, gameVer: "1.0.1", size: 46448733, date: "2026-11-12",
      store: "https://store.steampowered.com/app/3213690/",
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
