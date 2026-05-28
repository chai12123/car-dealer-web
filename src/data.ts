import { Car } from './types';

export const SEEDED_CARS: Car[] = [
  {
    id: "1",
    brand: "BMW",
    model: "BMW 530e M Sport",
    year: 2021,
    mileage: 45000,
    price: 1790000,
    gearbox: "อัตโนมัติ",
    engine: "2.0L TwinPower Turbo + Electric",
    colorExterior: "Black Sapphire",
    colorInterior: "Black Leather",
    drivetrain: "ขับหลัง (RWD)",
    plate: "3กข 8848 กรุงเทพฯ",
    status: "available",
    images: [
      "/car-bmw-530e.jpg",
      "/car-bmw-530e.jpg",
      "/car-bmw-530e.jpg",
      "/car-bmw-530e.jpg",
      "/car-bmw-530e.jpg"
    ],
    note: "รถมือเดียวออกศูนย์ BMW Thailand ประกันศูนย์เหลือถึงปลายปี เช็คศูนย์ตามระยะตลอด สภาพสมบูรณ์พร้อมใช้งาน โดดเด่นด้วยชุดแต่ง M Sport รอบคัน"
  },
  {
    id: "2",
    brand: "Mercedes-Benz",
    model: "Mercedes-Benz E300 AMG Dynamic",
    year: 2020,
    mileage: 38000,
    price: 1690000,
    gearbox: "อัตโนมัติ",
    engine: "เบนซิน 2.0L Plug-in Hybrid",
    colorExterior: "สีขาว Polar White",
    colorInterior: "หนังดำ Nappa Black",
    drivetrain: "ขับหลัง (RWD)",
    plate: "กจ 990 กรุงเทพฯ",
    status: "available",
    images: [
      "/car-benz-e300.jpg",
      "/car-benz-e300.jpg",
      "/car-benz-e300.jpg",
      "/car-benz-e300.jpg"
    ],
    note: "รถประวัติสวย วิ่งเพียง 38,000 กม. เท่านั้น ออกศูนย์เบนซ์มิลเลนเนียม ชุดแต่ง AMG แท้จากโรงงาน หลังคาพาโนรามิคซันรูฟ ล้อ AMG ขอบ 19 นิ้ว ไม่มีอุบัติเหตุชนหนัก"
  },
  {
    id: "3",
    brand: "Audi",
    model: "Audi A6 45 TFSI quattro S-Line",
    year: 2019,
    mileage: 62000,
    price: 1390000,
    gearbox: "อัตโนมัติ 7-speed S tronic",
    engine: "เบนซิน Mild Hybrid 2.0L TFSI",
    colorExterior: "สีดำ Mythos Black",
    colorInterior: "หนังดำ S-Line Sport",
    drivetrain: "ขับสี่ (quattro AWD)",
    plate: "9กช 4545 กรุงเทพฯ",
    status: "reserved",
    images: [
      "/car-audi-a6.jpg",
      "/car-audi-a6.jpg",
      "/car-audi-a6.jpg",
      "/car-audi-a6.jpg"
    ],
    note: "สถานะ: จองแล้ว! รถสปอร์ตซีดานตัวแรง ขับเคลื่อน 4 ล้อ quattro มั่นใจได้ในความปลอดภัย สภาพตัวถังเดิมสนิท ไม่เคยทำสี เช็คศูนย์ตลอด อุปกรณ์ครบครัน"
  },
  {
    id: "4",
    brand: "Porsche",
    model: "Porsche Macan S",
    year: 2018,
    mileage: 55000,
    price: 2590000,
    gearbox: "อัตโนมัติ PDK 7-Speed",
    engine: "เบนซิน 3.0L V6 Turbo",
    colorExterior: "สีขาว Carrera White",
    colorInterior: "หนังแท้ Bordeaux Red/Black",
    drivetrain: "ขับขับสี่ (AWD)",
    plate: "ษษ 44 กรุงเทพฯ",
    status: "available",
    images: [
      "/car-porsche-macan.jpg",
      "/car-porsche-macan.jpg",
      "/car-porsche-macan.jpg",
      "/car-porsche-macan.jpg"
    ],
    note: "Porsche Macan S ยอดสปอร์ต SUV เครื่องยนต์ 3.0 ลิตร V6 แรงกำลังดี สภาพประทับใจสุดๆ เบาะแดง-ดำทอมือ สปอร์ตโครโน ไฟหน้า PDLS+ การันตีสีเดิมทุกจุด"
  },
  {
    id: "5",
    brand: "Volvo",
    model: "Volvo XC60 D4 R-Design AWD",
    year: 2020,
    mileage: 41000,
    price: 1590000,
    gearbox: "อัตโนมัติ 8-speed Geartronic",
    engine: "ดีเซล 2.0L Twin Turbo",
    colorExterior: "สีดำ Onyx Black Metallic",
    colorInterior: "หนังดำ Charcoal R-Design",
    drivetrain: "ขับสี่ (AWD)",
    plate: "8กฒ 1234 กรุงเทพฯ",
    status: "available",
    images: [
      "/car-volvo-xc60.jpg",
      "/car-volvo-xc60.jpg",
      "/car-volvo-xc60.jpg",
      "/car-volvo-xc60.jpg"
    ],
    note: "ตัวท็อปดีเซล R-Design อัตราเร่งดีและประหยัดน้ำมันเป็นเลิศ พร้อมชุดความปลอดภัยอัจฉริยะล้นคัน รถสวยจัดมือเดียวเช็คศูนย์วอลโว่ทั่วประเทศได้ประวัติครบถ้วน"
  },
  {
    id: "6",
    brand: "BMW",
    model: "BMW X3 xDrive30e M Sport",
    year: 2022,
    mileage: 22000,
    price: 2790000,
    gearbox: "อัตโนมัติ",
    engine: "2.0L TwinPower Turbo + Electric Motor",
    colorExterior: "สีดำ Carbon Black Metallic",
    colorInterior: "หนังดำ Vernasca Black",
    drivetrain: "ขับสี่ (xDrive AWD)",
    plate: "3กฮ 5678 กรุงเทพฯ",
    status: "new",
    images: [
      "/car-bmw-x3.jpg",
      "/car-bmw-x3.jpg",
      "/car-bmw-x3.jpg"
    ],
    note: "รถเข้าใหม่ปี 2022 วิ่งน้อยไมล์แท้ระยับใจเพียง 22,000 กม. เท่านั้น มาพร้อมการรับประกัน BSI ยาวเหยียด สภาพใกล้เคียงป้ายแดงสุดๆ ประหยัดไปกว่าล้านบาท"
  }
];
