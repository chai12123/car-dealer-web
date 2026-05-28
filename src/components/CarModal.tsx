/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Car } from '../types';
import { X, ChevronLeft, ChevronRight, Gauge, Calendar, ShieldCheck, Mail, Phone, Info } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

interface CarModalProps {
  car: Car;
  onClose: () => void;
  onInquire: (carModel: string) => void;
}

export default function CarModal({ car, onClose, onInquire }: CarModalProps) {
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);

  const handleNextImage = () => {
    setActiveImgIndex((prev) => (prev + 1) % car.images.length);
  };

  const handlePrevImage = () => {
    setActiveImgIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-3 md:p-6 backdrop-blur-sm overflow-y-auto modal-backdrop-anim"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-5xl bg-[#1A1A1E] rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col lg:flex-row my-auto max-h-[96vh] md:max-h-[90vh] modal-container-anim"
        onClick={(e) => e.stopPropagation()}
        id="car_detail_modal_container"
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-grey hover:text-white bg-black/50 hover:bg-black/80 p-2 rounded-full border border-white/5 transition-all cursor-pointer z-20"
          id="close_car_modal_btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images View Panel */}
        <div className="w-full lg:w-3/5 bg-black flex flex-col justify-between p-4 relative min-h-[300px] md:min-h-[400px]">
          {/* Main big image view */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden group">
            <ImageWithFallback 
              src={car.images[activeImgIndex]} 
              alt={`${car.brand} ${car.model} มือสอง / Premium Used ${car.brand} ${car.model}`}
              fallbackAlt={`${car.brand} ${car.model} มือสอง / Premium Used ${car.brand} ${car.model}`}
              className="max-h-[350px] lg:max-h-[450px] w-full object-cover rounded-lg"
              referrerPolicy="no-referrer"
            />

            {/* Slider arrows */}
            {car.images.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-racing-red text-white p-1.5 md:p-2 rounded-full transition-all cursor-pointer border border-white/15"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-racing-red text-white p-1.5 md:p-2 rounded-full transition-all cursor-pointer border border-white/15"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image counter dot */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/75 px-3 py-1 rounded-full text-[11px] font-mono text-text-grey border border-white/10 z-10">
              {activeImgIndex + 1} / {car.images.length}
            </div>
          </div>

          {/* Micro-thumbnails list */}
          {car.images.length > 0 && (
            <div className="flex gap-2.5 overflow-x-auto py-2.5 mt-2 justify-center custom-scrollbar">
              {car.images.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImgIndex(i)}
                  className={`relative shrink-0 w-16 h-11 md:w-20 md:h-14 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImgIndex === i ? 'border-racing-red scale-105 shadow-[0_0_8px_rgba(225,29,42,0.4)]' : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <ImageWithFallback 
                    src={imgUrl} 
                    alt={`รูปประกอบ ${car.brand} ${car.model}`}
                    fallbackAlt={`รูปประกอบ ${car.brand} ${car.model}`}
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Specifications Details Panel */}
        <div className="w-full lg:w-2/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-none lg:max-h-[90vh] bg-card-dark">
          <div>
            {/* Header / Brand info */}
            <div className="flex justify-between items-start gap-2 mb-2">
              <span className="text-xs bg-racing-red/10 text-racing-red border border-racing-red/20 px-2.5 py-1 rounded font-bold uppercase tracking-wider font-mono">
                {car.brand}
              </span>
              <span className="text-[11px] text-text-grey font-mono bg-white/5 border border-white/5 px-2.5 py-1 rounded">
                ทะเบียน: {car.plate || 'สอบถามข้อมูลเพิ่มเติม'}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight pr-6 mt-1">{car.model}</h3>
            
            {/* Price section */}
            <div className="mt-3 pb-4 border-b border-white/5">
              <p className="text-xs text-text-grey">ราคาจัดจำหน่ายพรีเมียม</p>
              <p className="text-2xl md:text-3xl font-black text-racing-red font-display mt-0.5 tracking-tight">
                {car.price.toLocaleString()} <span className="text-base text-white font-medium">บาท</span>
              </p>
            </div>

            {/* Core parameters summary cards */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="bg-carbon-black p-2.5 rounded-lg border border-white/5 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-racing-red" />
                <div>
                  <p className="text-[10px] text-text-grey">ระยะทางวิ่งจริง</p>
                  <p className="text-xs font-bold text-white font-mono">{car.mileage.toLocaleString()} กม.</p>
                </div>
              </div>
              <div className="bg-carbon-black p-2.5 rounded-lg border border-white/5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-racing-red" />
                <div>
                  <p className="text-[10px] text-text-grey">ปีจดทะเบียนปี</p>
                  <p className="text-xs font-bold text-white font-mono">ค.ศ. {car.year}</p>
                </div>
              </div>
            </div>

            {/* Detailed specification lists */}
            <div className="space-y-2.5 text-sm" id="full_spec_list_wrapper">
              <p className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-1">ข้อมูลเชิงเทคนิค (Technical Specs)</p>
              
              <div className="grid grid-cols-2 gap-y-2 text-xs md:text-sm">
                <div className="flex flex-col">
                  <span className="text-text-grey text-[11px]">เครื่องยนต์ / กำลัง</span>
                  <span className="text-white font-semibold mt-0.5">{car.engine || "2.0L Direct Injection"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-text-grey text-[11px]">ระบบส่งกำลังหลัก (เกียร์)</span>
                  <span className="text-white font-semibold mt-0.5">{car.gearbox || "อัตโนมัติ"}</span>
                </div>
                <div className="flex flex-col mt-2">
                  <span className="text-text-grey text-[11px]">ระบบขับเคลื่อน</span>
                  <span className="text-white font-semibold mt-0.5">{car.drivetrain || "ขับหลัง (RWD)"}</span>
                </div>
                <div className="flex flex-col mt-2">
                  <span className="text-text-grey text-[11px]">สีภายนอก / ภายใน</span>
                  <span className="text-white font-semibold mt-0.5">{car.colorExterior} / {car.colorInterior}</span>
                </div>
              </div>
            </div>

            {/* Admin note details */}
            <div className="mt-5 p-4 bg-carbon-black/60 rounded-xl border border-white/5">
              <span className="text-xs text-racing-red font-bold flex items-center gap-1.5 mb-1">
                <Info className="w-3.5 h-3.5" />
                บันทึกสภาพรถยนต์และการประเมิน
              </span>
              <p className="text-xs md:text-sm text-text-grey/90 leading-relaxed italic">
                "{car.note || 'รถคุณภาพพรีเมียม สภาพสะกดตา ผ่านการตรวจสภาพกว่า 200 จุดเช็คระบบรอบคัน ไม่มีประวัติการจมน้ำหรือพลิกคว่ำแน่นอน สนใจติดต่อด่วน!'}"
              </p>
            </div>
          </div>

          {/* Action Call to Action button */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <button
              onClick={() => onInquire(car.model)}
              className="w-full bg-racing-red hover:bg-red-700 text-white py-3 md:py-3.5 px-4 rounded-xl font-bold text-center text-sm transition-all focus:outline-none flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(225,29,42,0.45)] cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              ติดต่อสอบถาม / นัดหมายทดลองขับรถพรีเมียมคันนี้
            </button>
            <p className="text-[10px] text-text-grey/60 text-center mt-2 font-mono">
              * ข้อมูลรถยนต์คันนี้จะได้รับการกรอกอ้างอิงลงในหน้าติดต่อกลับด้านล่างโดยอัตโนมัติ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
