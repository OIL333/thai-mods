/* ===== แก้ลิงก์และข้อมูลตรงนี้ที่เดียว ===== */
window.SITE = {
  repo: "https://github.com/OIL333/thai-mods",
  mods: {
    yohanuma: {
      version: "1.0.1-beta", tag: "yohanuma-v1.0.1-beta", file: "Yohanuma-ThaiMod-v1.0.1-beta.zip",
      name: "Yohane the Parhelion - NUMAZU in the MIRAGE -",
      store: "https://store.steampowered.com/app/2459750/",
      // ภาพในเกม (ใส่ไฟล์ไว้ที่ assets/shots แล้วเพิ่มบรรทัดที่นี่)
      shots: [
        { src: "assets/shots/yohanuma-title.jpg", thumb: "assets/shots/yohanuma-title-thumb.jpg", caption: "หน้าแรก: ปุ่มเมนูเป็นภาษาไทย และเครดิตผู้แปลมุมขวาล่าง" },
      ],
    },
    train45: {
      version: "1.0.1", tag: "train45-v1.0.1", file: "Train45-ThaiMod-v1.0.1.zip",
      name: "Train45",
      store: "https://store.steampowered.com/app/3711590/",
      shots: [
        { src: "assets/shots/train45-title.jpg", thumb: "assets/shots/train45-title-thumb.jpg", caption: "หน้าแรก: เมนูเป็นภาษาไทยทั้งหมด" },
      ],
    },
  },
  donate: {
    accountName: "กษิดิ์เดช ปทุมมาศ",
    // รูป QR จากแอปจริง ครอปเป็นสี่เหลี่ยมจัตุรัส (เปลี่ยนรูปได้ที่โฟลเดอร์ assets)
    qrImages: [
      { src: "assets/qr-promptpay.png", label: "พร้อมเพย์", sub: "สแกนได้ทุกแอปธนาคาร", color: "#113f67" },
      { src: "assets/qr-truemoney.png", label: "ทรูมันนี่วอลเล็ท", sub: "สแกนด้วยแอปทรูมันนี่", color: "#f47a20" },
    ],
    koFi: "",                          // เช่น "https://ko-fi.com/xxxx" (เว้นว่าง = ไม่แสดง)
  },
  report: {
    // กุญแจจาก web3forms.com (ฟรี) ให้คนแจ้งปัญหาได้โดยไม่ต้องมีบัญชีอะไร รายงานจะส่งเข้าอีเมลของคุณ
    // เว้นว่าง = ปุ่ม "ส่งเลย" จะเปิดหน้า GitHub แทน
    web3formsKey: "3f2820b6-9967-4550-82e5-1add34815801",
  },
};
/* ======================================== */
