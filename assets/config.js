/* ===== แก้ลิงก์และข้อมูลตรงนี้ที่เดียว ===== */
window.SITE = {
  repo: "https://github.com/OIL333/thai-mods",
  mods: {
    yohanuma: {
      version: "1.0-beta", tag: "yohanuma-v1.0-beta", file: "Yohanuma-ThaiMod-v1.0-beta.zip",
      name: "Yohane the Parhelion - NUMAZU in the MIRAGE -",
      store: "https://store.steampowered.com/app/2459750/",
    },
    train45: {
      version: "1.0", tag: "train45-v1.0", file: "Train45-ThaiMod-v1.0.zip",
      name: "Train45",
      store: "https://store.steampowered.com/app/3711590/",
    },
  },
  donate: {
    qrImage: "",                       // ถ้ามีรูป QR ของธนาคาร ใส่ "assets/donate-qr.png" แล้วจะใช้รูปนั้นแทน QR ที่สร้างอัตโนมัติ
    promptpay: "0996547414",           // ใช้สร้าง QR พร้อมเพย์อัตโนมัติ (ถ้าไม่มีรูป qrImage)
    items: [
      { label: "ชื่อบัญชี", value: "กษิดิ์เดช ปทุมมาศ" },
      { label: "ธนาคารกสิกรไทย", value: "073-8-97547-2", copy: true },
      { label: "พร้อมเพย์", value: "099-654-7414", copy: true },
      { label: "ทรูมันนี่วอลเล็ท", value: "099-654-7414", copy: true },
    ],
    koFi: "",                          // เช่น "https://ko-fi.com/xxxx" (เว้นว่าง = ไม่แสดง)
  },
  report: {
    // กุญแจจาก web3forms.com (ฟรี) ให้คนแจ้งปัญหาได้โดยไม่ต้องมีบัญชีอะไร รายงานจะส่งเข้าอีเมลของคุณ
    // เว้นว่าง = ปุ่ม "ส่งเลย" จะเปิดหน้า GitHub แทน
    web3formsKey: "",
  },
};
/* ======================================== */
