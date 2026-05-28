/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Car, CarStatus, ContactMessage } from '../types';
import { 
  LayoutDashboard, 
  Car as CarIcon, 
  Plus, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Search, 
  Edit, 
  Trash2, 
  X,
  Lock,
  CheckCircle,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

interface AdminPanelProps {
  cars: Car[];
  onCarsUpdated: (updatedCars: Car[]) => void;
  onClose: () => void;
}

export default function AdminPanel({ cars, onCarsUpdated, onClose }: AdminPanelProps) {
  const [pin, setPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('apex_admin_logged') === 'true';
  });
  const [activeTab, setActiveTab] = useState<string>('cars');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [leads, setLeads] = useState<ContactMessage[]>([]);
  
  // Form State
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editCarId, setEditCarId] = useState<string | null>(null);
  
  const [formBrand, setFormBrand] = useState('BMW');
  const [formModel, setFormModel] = useState('');
  const [formYear, setFormYear] = useState(2022);
  const [formEngine, setFormEngine] = useState('');
  const [formMileage, setFormMileage] = useState(10000);
  const [formPrice, setFormPrice] = useState(1000000);
  const [formColorExterior, setFormColorExterior] = useState('');
  const [formColorInterior, setFormColorInterior] = useState('');
  const [formGearbox, setFormGearbox] = useState('อัตโนมัติ');
  const [formPlate, setFormPlate] = useState('');
  const [formDrivetrain, setFormDrivetrain] = useState('ขับหลัง (RWD)');
  const [formStatus, setFormStatus] = useState<CarStatus>('available');
  const [formNote, setFormNote] = useState('');
  const [formImages, setFormImages] = useState<string[]>([
    '', '', '', '', ''
  ]);

  // Load leads
  useEffect(() => {
    const storedLeads = localStorage.getItem('apex_leads');
    if (storedLeads) {
      try {
        setLeads(JSON.parse(storedLeads));
      } catch (e) {
        // ignore
      }
    }
  }, [isUnlocked, activeTab]);

  // Keypad press handler
  const handleKeypadPress = (val: string) => {
    setPinError('');
    if (pin.length < 4) {
      const nextPin = pin + val;
      setPin(nextPin);
      
      // Auto submit if it reaches 4 digits
      if (nextPin === '1234') {
        setTimeout(() => {
          setIsUnlocked(true);
          sessionStorage.setItem('apex_admin_logged', 'true');
          setPin('');
        }, 150);
      } else if (nextPin.length === 4) {
        setTimeout(() => {
          setPinError('PIN ไม่ถูกต้อง');
          setPin('');
        }, 150);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setPinError('');
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('apex_admin_logged');
    onClose();
  };

  // Switch to adding a new car
  const handleStartAddCar = () => {
    setIsEditing(false);
    setEditCarId(null);
    setFormBrand('BMW');
    setFormModel('');
    setFormYear(2022);
    setFormEngine('');
    setFormMileage(15000);
    setFormPrice(150000);
    setFormColorExterior('');
    setFormColorInterior('');
    setFormGearbox('อัตโนมัติ');
    setFormPlate('');
    setFormDrivetrain('ขับหลัง (RWD)');
    setFormStatus('available');
    setFormNote('');
    setFormImages(['', '', '', '', '']);
    
    setActiveTab('add_car');
  };

  // Start Editing Car
  const handleStartEditCar = (car: Car) => {
    setIsEditing(true);
    setEditCarId(car.id);
    
    setFormBrand(car.brand);
    setFormModel(car.model);
    setFormYear(car.year);
    setFormEngine(car.engine);
    setFormMileage(car.mileage);
    setFormPrice(car.price);
    setFormColorExterior(car.colorExterior);
    setFormColorInterior(car.colorInterior);
    setFormGearbox(car.gearbox);
    setFormPlate(car.plate);
    setFormDrivetrain(car.drivetrain);
    setFormStatus(car.status);
    setFormNote(car.note);
    
    // Fill up to 5 image inputs, matching array size
    const paddedImages = [...car.images];
    while (paddedImages.length < 5) {
      paddedImages.push('');
    }
    setFormImages(paddedImages);
    
    setActiveTab('add_car');
  };

  // Delete Car
  const handleDeleteCar = (id: string, modelName: string) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ที่จะลบรถยนต์ "${modelName}" คันนี้ออกจากระบบ?`)) {
      const updated = cars.filter(c => c.id !== id);
      onCarsUpdated(updated);
    }
  };

  // Save Car
  const handleSaveCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formModel.trim()) {
      alert('กรุณากรอกรุ่นรถ');
      return;
    }

    // Filter out blank images, keep at least one placeholder if all empty
    let filteredImages = formImages.map(img => img.trim()).filter(img => img !== '');
    if (filteredImages.length === 0) {
      filteredImages = ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200'];
    }

    const carData: Car = {
      id: isEditing && editCarId ? editCarId : Date.now().toString(),
      brand: formBrand,
      model: formModel,
      year: Number(formYear),
      mileage: Number(formMileage),
      price: Number(formPrice),
      gearbox: formGearbox,
      engine: formEngine,
      colorExterior: formColorExterior,
      colorInterior: formColorInterior,
      drivetrain: formDrivetrain,
      plate: formPlate,
      status: formStatus,
      images: filteredImages,
      note: formNote
    };

    let updatedList: Car[] = [];
    if (isEditing && editCarId) {
      updatedList = cars.map(c => c.id === editCarId ? carData : c);
    } else {
      updatedList = [...cars, carData];
    }

    onCarsUpdated(updatedList);
    alert('บันทึกข้อมูลรถยนต์เรียบร้อยแล้ว');
    setActiveTab('cars');
  };

  const handleImageChange = (index: number, val: string) => {
    const updated = [...formImages];
    updated[index] = val;
    setFormImages(updated);
  };

  const filteredCars = cars.filter(car => {
    const q = searchQuery.toLowerCase();
    return (
      car.brand.toLowerCase().includes(q) ||
      car.model.toLowerCase().includes(q) ||
      car.plate.toLowerCase().includes(q) ||
      car.note.toLowerCase().includes(q)
    );
  });

  // Calculate high-level stats for mock admin dashboard
  const totalCars = cars.length;
  const availableCount = cars.filter(c => c.status === 'available' || c.status === 'new').length;
  const reservedCount = cars.filter(c => c.status === 'reserved').length;
  const soldCount = cars.filter(c => c.status === 'sold').length;
  const totalValue = cars.reduce((acc, c) => acc + c.price, 0);

  // Status utility
  const getStatusBadge = (status: CarStatus) => {
    switch (status) {
      case 'available':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-xs">พร้อมขาย</span>;
      case 'new':
        return <span className="bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full text-xs">รถเข้าใหม่</span>;
      case 'reserved':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full text-xs">จองแล้ว</span>;
      case 'sold':
        return <span className="bg-zinc-700/50 text-zinc-400 border border-zinc-600/30 px-2 py-0.5 rounded-full text-xs">ขายแล้ว</span>;
    }
  };

  // PIN LOCK SCREEN VIEW
  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 bg-carbon-black/98 z-50 flex flex-col items-center justify-center p-4">
        {/* Close Button top corner */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-text-grey hover:text-white bg-card-dark p-2.5 rounded-full border border-white/5 transition-colors cursor-pointer"
          id="close_admin_login_btn"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full max-w-sm bg-card-dark rounded-2xl border border-white/5 p-8 shadow-2xl relative glow-bg" id="pin_card_wrapper">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-racing-red/10 border border-racing-red/20 mb-4 animate-pulse">
              <Lock className="w-6 h-6 text-racing-red" />
            </div>
            <h2 className="text-2xl font-bold font-display uppercase tracking-wider text-white">APEX ADMIN</h2>
            <p className="text-text-grey text-sm mt-1">กรุณาใส่รหัส PIN เพื่อเข้าสู่ระบบระบบจัดการหลังบ้าน</p>
          </div>

          {/* PIN Indicators */}
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((val) => (
              <div 
                key={val}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                  pin.length > val 
                    ? 'bg-racing-red border-racing-red scale-110 shadow-[0_0_10px_rgba(225,29,42,0.8)]' 
                    : 'border-white/20'
                }`}
              />
            ))}
          </div>

          {/* PIN Error Message */}
          {pinError && (
            <div className="text-center text-racing-red font-medium text-sm mb-6 animate-bounce">
              {pinError}
            </div>
          )}

          {/* Keyboard Numeric Pad */}
          <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                onClick={() => handleKeypadPress(num)}
                className="w-16 h-16 rounded-full border border-white/5 bg-carbon-black/55 text-xl font-bold hover:bg-racing-red hover:text-white hover:border-racing-red active:scale-95 transition-all text-white flex items-center justify-center cursor-pointer font-display"
                id={`btn_pin_${num}`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleBackspace}
              className="w-16 h-16 rounded-full border border-white/5 bg-zinc-900/40 text-text-grey hover:bg-zinc-800 hover:text-white active:scale-95 transition-all flex items-center justify-center cursor-pointer text-sm"
              id="btn_pin_back"
            >
              แก้ไข
            </button>
            <button
              onClick={() => handleKeypadPress('0')}
              className="w-16 h-16 rounded-full border border-white/5 bg-carbon-black/55 text-xl font-bold hover:bg-racing-red hover:text-white hover:border-racing-red active:scale-95 transition-all text-white flex items-center justify-center cursor-pointer font-display"
              id="btn_pin_0"
            >
              0
            </button>
            <button
              onClick={() => setPin('')}
              className="w-16 h-16 rounded-full border border-white/5 bg-zinc-900/40 text-text-grey hover:bg-zinc-800 hover:text-white active:scale-95 transition-all flex items-center justify-center cursor-pointer text-xs"
              id="btn_pin_clear"
            >
              ล้าง
            </button>
          </div>
          
          <div className="text-center mt-6 text-xs text-text-grey/60 font-mono">
            * คำแนะนำสำหรับการทำสอบ: PIN: 1234
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN ADMIN BACK-OFFICE LAYOUT
  return (
    <div className="fixed inset-0 bg-carbon-black z-50 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-card-dark border-b md:border-b-0 md:border-r border-white/5 flex flex-col shrink-0" id="admin_sidebar">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-carbon-black/40">
          <div>
            <div className="text-racing-red font-bold font-display text-xl tracking-wider uppercase">APEX ADMIN</div>
            <p className="text-[10px] text-text-grey uppercase font-mono tracking-widest mt-0.5">Back-Office Engine</p>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden text-text-grey hover:text-white p-1 rounded hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-4 flex-1 space-y-1 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-racing-red text-white'
                : 'text-text-grey hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            แผงควบคุมหลัก
          </button>

          <button 
            onClick={() => setActiveTab('cars')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'cars' || activeTab === 'add_car'
                ? 'bg-racing-red/20 text-white border-l-2 border-racing-red'
                : 'text-text-grey hover:text-white hover:bg-white/5'
            }`}
          >
            <CarIcon className="w-4 h-4" />
            จัดการรถทั้งหมด ({totalCars})
          </button>

          <button 
            onClick={handleStartAddCar}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'add_car_btn_tab' ? 'bg-racing-red/20 text-white' : 'text-text-grey hover:text-white hover:bg-white/5'
            }`}
          >
            <Plus className="w-4 h-4" />
            เพิ่มรถคันใหม่
          </button>

          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-racing-red text-white'
                : 'text-text-grey hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              ลูกค้าและผู้สนใจ
            </span>
            {leads.length > 0 && (
              <span className="bg-racing-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {leads.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-racing-red text-white'
                : 'text-text-grey hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            รายงานสถิติยอดขาย
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-racing-red text-white'
                : 'text-text-grey hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            ตั้งค่าระบบ
          </button>
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <div className="text-xs text-text-grey/60 px-4 py-1">
            ลงชื่อเข้าใช้ในฐานะ แอดมิน
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
            id="admin_logout_btn"
          >
            <LogOut className="w-4 h-4" />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Panel Area */}
      <main className="flex-1 bg-carbon-black p-4 md:p-8 overflow-y-auto flex flex-col">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-6">
          <div>
            <span className="text-xs text-racing-red font-mono uppercase tracking-widest">APEX Management Console</span>
            <h1 className="text-2xl font-bold text-white mt-1">
              {activeTab === 'dashboard' && 'แผงควบคุมหลัก (Dashboard)'}
              {activeTab === 'cars' && 'รายการรถยนต์ในสต็อก'}
              {activeTab === 'add_car' && (isEditing ? 'แก้ไขข้อมูลรถยนต์' : 'เพิ่มรถยนต์นำเข้าพรีเมียมตัวใหม่')}
              {activeTab === 'leads' && 'ลูกค้าและคำขอติดต่อกลับ'}
              {activeTab === 'stats' && 'รายงานการวิเคราะห์และสถิติ'}
              {activeTab === 'settings' && 'การตั้งค่าระบบศูนย์บริการ'}
            </h1>
          </div>

          <div className="flex gap-2">
            {activeTab === 'cars' && (
              <button 
                onClick={handleStartAddCar}
                className="bg-racing-red text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-red-700 hover:shadow-[0_0_10px_rgba(225,29,42,0.4)] transition-all cursor-pointer"
                id="add_car_top_btn"
              >
                <Plus className="w-4 h-4" />
                เพิ่มรถพรีเมียม
              </button>
            )}
            
            <button 
              onClick={onClose}
              className="border border-white/10 hover:border-white/25 text-white bg-card-dark px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer"
              id="back_to_site_btn"
            >
              หน้าร้านค้า
            </button>
          </div>
        </div>

        {/* 1. TAB: DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card-dark p-5 rounded-xl border border-white/5">
                <p className="text-text-grey text-xs">จำนวนรถทั้งหมดในสต็อก</p>
                <p className="text-3xl font-bold text-white font-display mt-2">{totalCars} คัน</p>
                <div className="mt-2 text-[10px] text-text-grey/60">รวมทุกสถานะ (พร้อมขาย, จอง, ส่งมอบ)</div>
              </div>
              <div className="bg-card-dark p-5 rounded-xl border border-white/5">
                <p className="text-text-grey text-xs">รถยนต์พร้อมให้บริการ/ใหม่</p>
                <p className="text-3xl font-bold text-emerald-400 font-display mt-2">{availableCount} คัน</p>
                <div className="mt-2 text-[10px] text-emerald-400/80">Active เผยแพร่หน้าร้านทันที</div>
              </div>
              <div className="bg-card-dark p-5 rounded-xl border border-white/5">
                <p className="text-text-grey text-xs">รายการจองล่าสุด</p>
                <p className="text-3xl font-bold text-amber-400 font-display mt-2">{reservedCount} คัน</p>
                <div className="mt-2 text-[10px] text-amber-400/80">รอโอนอนุมัติและจัดไฟแนนซ์</div>
              </div>
              <div className="bg-card-dark p-5 rounded-xl border border-white/5">
                <p className="text-text-grey text-xs">ยอดประมาณการราคารวมสต็อก</p>
                <p className="text-2xl font-bold text-racing-red font-display mt-2">{totalValue.toLocaleString()} บาท</p>
                <div className="mt-2 text-[10px] text-racing-red/80">มูลค่าพอร์ตสปอร์ตไฮเอนด์</div>
              </div>
            </div>

            {/* Quick action grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card-dark p-6 rounded-xl border border-white/5 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  การจัดการสต็อกด่วน
                </h3>
                <p className="text-text-grey text-sm">คุณสามารถเพิ่ม แก้ไข ข้อมูลจำเพาะรถยนต์ ภาพถ่าย หรือการตั้งราคาของรถทุกคันได้อย่างทันท่วงที สินค้าจะทำการอัพเดทไปยังฝั่งผู้เข้าชมเว็บทันที</p>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => setActiveTab('cars')} 
                    className="bg-zinc-800 text-white hover:bg-zinc-700 px-4 py-2 rounded text-xs font-medium transition-all cursor-pointer"
                  >
                    ดูรถทั้งหมด
                  </button>
                  <button 
                    onClick={handleStartAddCar}
                    className="bg-racing-red/20 text-racing-red hover:bg-racing-red/30 px-4 py-2 rounded text-xs font-medium border border-racing-red/30 transition-all cursor-pointer"
                  >
                    เพิ่มรถใหม่
                  </button>
                </div>
              </div>

              <div className="bg-card-dark p-6 rounded-xl border border-white/5 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-400" />
                  ลูกค้าเป้าหมายที่มีการตอบรับ (Leads)
                </h3>
                <p className="text-text-grey text-sm">
                  ปัจจุบันมีผู้สนใจกรอกข้อมูลผ่านหน้าติดต่อเราบนเว็บไซต์จำนวน <span className="text-white font-bold">{leads.length} รายการ</span> เจ้าหน้าที่จัดจำหน่ายควรเร่งทำการติดต่อกลับ
                </p>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => setActiveTab('leads')} 
                    className="bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 px-4 py-2 rounded text-xs font-medium transition-all cursor-pointer"
                  >
                    ตรวจสอบคำขอของลูกค้า
                  </button>
                </div>
              </div>
            </div>
            
            {/* Quick view of list */}
            <div className="bg-card-dark rounded-xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-carbon-black/30 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">รถยนต์พรีเมียมเข้าล่าสุด</h3>
                <button 
                  onClick={() => setActiveTab('cars')}
                  className="text-racing-red text-xs hover:underline flex items-center gap-1 cursor-pointer"
                >
                  จัดการรถทั้งหมด
                </button>
              </div>
              <div className="divide-y divide-white/5">
                {cars.slice(-3).reverse().map(car => (
                  <div key={car.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={car.images[0] || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=80"}
                        alt={car.model}
                        className="w-16 h-10 object-cover rounded bg-zinc-900 border border-white/5"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-white font-medium text-sm">{car.model}</h4>
                        <p className="text-xs text-text-grey">ปี {car.year} | {car.mileage.toLocaleString()} กม. | {car.gearbox}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-racing-red font-bold text-sm">{car.price.toLocaleString()} บาท</p>
                        <p className="text-[10px] text-text-grey">{car.plate}</p>
                      </div>
                      {getStatusBadge(car.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. TAB: CARS TABLE LIST */}
        {activeTab === 'cars' && (
          <div className="bg-card-dark rounded-xl border border-white/5 flex-1 flex flex-col overflow-hidden shadow-xl" id="table_inventory_panel">
            {/* Table Control Header */}
            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 bg-carbon-black/30">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-grey" />
                <input
                  type="text"
                  placeholder="ค้นหารถยนต์ (แบรนด์, รุ่น, ทะเบียน)..."
                  className="pl-9 pr-4 py-2 w-full text-sm bg-carbon-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-racing-red transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  id="admin_car_search_input"
                />
              </div>

              <div className="text-xs text-text-grey flex items-center gap-2">
                แสดงผล {filteredCars.length} จากทั้งหมด {cars.length} คันในระบบ
              </div>
            </div>

            {/* Table wrapper */}
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left text-sm text-text-grey">
                <thead className="text-xs uppercase bg-carbon-black/55 text-white font-display tracking-wider border-b border-white/5">
                  <tr>
                    <th scope="col" className="px-6 py-4">รูปภาพ</th>
                    <th scope="col" className="px-6 py-4">ยี่ห้อ / รุ่นรถยนต์</th>
                    <th scope="col" className="px-6 py-4 text-center">ปีจด</th>
                    <th scope="col" className="px-6 py-4 text-right">เลขไมล์ (กม.)</th>
                    <th scope="col" className="px-6 py-4 text-right">ราคาจำหน่าย</th>
                    <th scope="col" className="px-6 py-4 text-center">สถานะรถ</th>
                    <th scope="col" className="px-6 py-4 text-center">จัดการข้อมูล</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCars.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-text-grey bg-carbon-black/10">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FolderOpen className="w-10 h-10 text-text-grey/40" />
                          <p>ไม่พบรายละเอียดยนต์ที่คุณค้นหา</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCars.map((car) => (
                      <tr key={car.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img 
                            src={car.images[0] || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=120"}
                            alt={car.model}
                            className="w-16 h-10 object-cover rounded bg-zinc-900 border border-white/5"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                          <div>
                            <div className="font-bold">{car.model}</div>
                            <div className="text-xs text-text-grey font-mono mt-0.5">{car.plate || "ไม่ระบุป้าย"}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">{car.year}</td>
                        <td className="px-6 py-4 text-right whitespace-nowrap font-mono">{car.mileage.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right whitespace-nowrap font-bold text-racing-red font-mono">
                          {car.price.toLocaleString()} บาท
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          {getStatusBadge(car.status)}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleStartEditCar(car)}
                              className="text-sky-400 hover:text-sky-300 p-1 bg-sky-500/10 hover:bg-sky-500/20 rounded transition-all cursor-pointer"
                              title="แก้ไขข้อมูล"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCar(car.id, car.model)}
                              className="text-rose-400 hover:text-rose-300 p-1 bg-rose-500/10 hover:bg-rose-500/20 rounded transition-all cursor-pointer"
                              title="ลบรถคันนี้"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. TAB: ADD / EDIT FORM */}
        {activeTab === 'add_car' && (
          <div className="bg-card-dark rounded-xl border border-white/5 p-6 shadow-xl" id="admin_form_wrapper">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-3">
              {isEditing ? `แก้ไขข้อมูล: ${formModel}` : 'กรอกรายละเอียดรถยนต์ยุโรปมือสองพรีเมียมนำเข้า'}
            </h3>

            <form onSubmit={handleSaveCar} className="space-y-6">
              {/* Field Groups: Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-grey mb-2">ยี่ห้อ (Brand)</label>
                  <select 
                    className="w-full bg-carbon-black border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-racing-red transition-all"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                  >
                    <option value="BMW">BMW</option>
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="Audi">Audi</option>
                    <option value="Porsche">Porsche</option>
                    <option value="Volvo">Volvo</option>
                    <option value="Aston Martin">Aston Martin</option>
                    <option value="Ferrari">Ferrari</option>
                    <option value="Mini">Mini</option>
                    <option value="Lexus">Lexus</option>
                    <option value="อื่นๆ">อื่นๆ (Others)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-grey mb-2">รุ่นรถยนต์ (Model *เช่น BMW 530e M Sport)</label>
                  <input
                    type="text"
                    required
                    placeholder="ใส่ชื่อรุ่นรถยนต์ เช่น E300 AMG"
                    className="w-full bg-carbon-black border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-racing-red transition-all"
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-grey mb-2">ปีจดทะเบียน (Year)</label>
                  <input
                    type="number"
                    min="1990"
                    max="2030"
                    required
                    className="w-full bg-carbon-black border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-racing-red transition-all"
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-grey mb-2">เครื่องยนต์ (Engine Specs)</label>
                  <input
                    type="text"
                    placeholder="เช่น เบนซิน 2.0L TwinPower Turbo"
                    className="w-full bg-carbon-black border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-racing-red transition-all"
                    value={formEngine}
                    onChange={(e) => setFormEngine(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-grey mb-2">เลขไมล์วิ่ง (Milage กม. *ใส่เฉพาะตัวเลข)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full bg-carbon-black border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-racing-red transition-all font-mono"
                    value={formMileage}
                    onChange={(e) => setFormMileage(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-grey mb-2">ราคาจัดจำหน่าย (บาท *เฉพาะตัวเลข)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full bg-carbon-black border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-racing-red transition-all font-mono font-bold text-racing-red"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-grey mb-2">สีภายนอกรถ (Exterior Color)</label>
                  <input
                    type="text"
                    placeholder="เช่น สีดำ, Polar White"
                    className="w-full bg-carbon-black border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-racing-red transition-all"
                    value={formColorExterior}
                    onChange={(e) => setFormColorExterior(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-grey mb-2">สีภายในรถ (Interior Color)</label>
                  <input
                    type="text"
                    placeholder="เช่น หนังดำ Nappa"
                    className="w-full bg-carbon-black border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-racing-red transition-all"
                    value={formColorInterior}
                    onChange={(e) => setFormColorInterior(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-grey mb-2">ระบบเกียร์ (Transmission)</label>
                  <select 
                    className="w-full bg-carbon-black border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-racing-red transition-all"
                    value={formGearbox}
                    onChange={(e) => setFormGearbox(e.target.value)}
                  >
                    <option value="อัตโนมัติ">อัตโนมัติ (Automatic)</option>
                    <option value="ธรรมดา">ธรรมดา (Manual)</option>
                    <option value="Dual-Clutch PDK">Dual-Clutch PDK / S-tronic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-grey mb-2">ระบบขับเคลื่อน (Drivetrain)</label>
                  <select 
                    className="w-full bg-carbon-black border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-racing-red transition-all"
                    value={formDrivetrain}
                    onChange={(e) => setFormDrivetrain(e.target.value)}
                  >
                    <option value="ขับหลัง (RWD)">ขับหลัง (RWD)</option>
                    <option value="ขับสี่ (AWD)">ขับสี่ (AWD)</option>
                    <option value="ขับหน้า (FWD)">ขับหน้า (FWD)</option>
                  </select>
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-grey mb-2">เลขป้ายทะเบียนรถ (License Plate)</label>
                  <input
                    type="text"
                    placeholder="เช่น 3กข 8848 กรุงเทพฯ"
                    className="w-full bg-carbon-black border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-racing-red transition-all"
                    value={formPlate}
                    onChange={(e) => setFormPlate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-grey mb-2">สถานะการตอบรับ (Status)</label>
                  <select 
                    className="w-full bg-carbon-black border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-racing-red transition-all"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as CarStatus)}
                  >
                    <option value="available">พร้อมขาย (Available)</option>
                    <option value="new">รถเข้าใหม่ (New Arrival)</option>
                    <option value="reserved">จองแล้ว (Reserved)</option>
                    <option value="sold">ขายแล้ว (Sold)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-grey mb-2">โปรโมตด่วน (Note)</label>
                  <input
                    type="text"
                    placeholder="เช่น รถประวัติสวย เจ้าของมือเดียว เช็คศูนย์ตลอด"
                    className="w-full bg-carbon-black border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-racing-red transition-all"
                    value={formNote}
                    onChange={(e) => setFormNote(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 5: Car Images (Up to 5) */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2">รูปภาพรถ (URL ลิงก์รูปภาพ Unsplash หรือภายนอก - แนะนำสูงสุด 5 ภาพ)</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formImages.map((imgUrl, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-xs text-text-grey font-mono w-16">รูปภาพ {idx + 1}:</span>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 bg-carbon-black border border-white/10 rounded-lg py-2 px-3 text-[12px] text-white focus:outline-none focus:border-racing-red transition-all"
                        value={imgUrl}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                      />
                      {imgUrl.trim() !== '' && (
                        <img 
                          src={imgUrl} 
                          alt="preview" 
                          className="w-10 h-7 object-cover rounded bg-zinc-900"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=80';
                          }}
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Rows */}
              <div className="flex justify-end gap-3 border-t border-white/5 pt-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('cars')}
                  className="bg-zinc-800 text-white hover:bg-zinc-700 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="bg-racing-red text-white hover:bg-red-700 px-8 py-2.5 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(225,29,42,0.3)] hover:shadow-[0_0_20px_rgba(225,29,42,0.5)] transition-all cursor-pointer"
                >
                  {isEditing ? 'อัปเดตข้อมูลรถยนต์' : 'บันทึกข้อมูลรถยนต์ใหม่'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4. TAB: CONTACT LEADS */}
        {activeTab === 'leads' && (
          <div className="bg-card-dark rounded-xl border border-white/5 p-6 shadow-xl space-y-4">
            <p className="text-sm text-text-grey">ด้านล่างคือรายการข้อความนัดสำรองคิวและนัดชมรถของลูกค้าผ่านแบบฟอร์มหน้าเว็บ ข้อมูลนี้จะรีเฟรชเมื่อเปิดหน้านี้ใหม่</p>
            
            {leads.length === 0 ? (
              <div className="bg-carbon-black/20 text-center py-16 border rounded-xl border-dashed border-white/10 text-text-grey">
                <FolderOpen className="w-10 h-10 mx-auto text-text-grey/40 mb-3" />
                <p>ยังไม่มีคำส่งข้อความ หรือ นัดชมรถส่งเข้ามาในขณะนี้</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.slice().reverse().map((lead, idx) => (
                  <div key={idx} className="bg-carbon-black p-5 border border-white/5 rounded-xl hover:border-racing-red/20 transition-all">
                    <div className="flex justify-between items-start gap-4 mb-3 border-b border-white/5 pb-2">
                      <div>
                        <h4 className="text-white font-bold text-base">{lead.name}</h4>
                        <p className="text-xs text-text-grey font-mono mt-0.5">เบอร์ติดต่อกลับ: <span className="text-white font-semibold">{lead.phone}</span> | อีเมล: {lead.email}</p>
                      </div>
                      
                      {lead.carModel && (
                        <div className="bg-racing-red/10 text-racing-red border border-racing-red/20 text-xs px-3 py-1 rounded font-semibold font-display">
                          นัดชมรถรุ่น: {lead.carModel}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-text-near-white italic whitespace-pre-wrap">
                      "{lead.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end pt-3">
              <button
                onClick={() => {
                  if (window.confirm('คุณต้องการรีเซ็ตคำขอติดต่อกลับทั้งหมดหรือไม่?')) {
                    localStorage.removeItem('apex_leads');
                    setLeads([]);
                  }
                }}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                ล้างรายการ leads ทั้งหมด
              </button>
            </div>
          </div>
        )}

        {/* 5. TAB: REPORTS STATS */}
        {activeTab === 'stats' && (
          <div className="bg-card-dark rounded-xl border border-white/5 p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white">รายงานยอดสต็อกและสถิติภาพรวม</h3>
            <p className="text-sm text-text-grey">สรุปตัวเลขแบบจำลองของแกลเลอรี APEX Auto Gallery</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-carbon-black p-4 rounded-xl border border-white/5 text-center">
                <span className="text-xs text-text-grey">คันที่มีสถานะ พร้อมขาย</span>
                <p className="text-3xl font-bold text-emerald-400 mt-2">{cars.filter(c => c.status === 'available').length}</p>
              </div>
              <div className="bg-carbon-black p-4 rounded-xl border border-white/5 text-center">
                <span className="text-xs text-text-grey">คันที่มีสถานะ จองแล้ว</span>
                <p className="text-3xl font-bold text-amber-400 mt-2">{cars.filter(c => c.status === 'reserved').length}</p>
              </div>
              <div className="bg-carbon-black p-4 rounded-xl border border-white/5 text-center">
                <span className="text-xs text-text-grey">คันที่มีสถานะ รถเข้าใหม่</span>
                <p className="text-3xl font-bold text-sky-400 mt-2">{cars.filter(c => c.status === 'new').length}</p>
              </div>
              <div className="bg-carbon-black p-4 rounded-xl border border-white/5 text-center">
                <span className="text-xs text-text-grey">คันที่มีสถานะ ขายแล้ว</span>
                <p className="text-3xl font-bold text-zinc-400 mt-2">{cars.filter(c => c.status === 'sold').length}</p>
              </div>
            </div>

            <div className="bg-carbon-black p-6 rounded-xl border border-white/5 space-y-3">
              <h4 className="text-base font-bold text-white">อัตราการจอง/ขายในสต็อก (Mock analytics)</h4>
              <p className="text-sm text-text-grey">
                อิงจากระบบ LocalStorage สต็อกรวมของร้านคิดเป็นรถพร้อมขาย/รถเข้าใหม่ประมาณ 
                <span className="text-white font-bold ml-1">
                  {Math.round(((availableCount) / (totalCars || 1)) * 100)}%
                </span> ของสต็อกทั้งหมด
              </p>
              <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${((cars.filter(c => c.status === 'available' || c.status === 'new').length) / (totalCars || 1)) * 100}%` }}
                />
              </div>
              <div className="flex gap-4 justify-center text-xs mt-2">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-400 inline-block"/> รถพร้อมบริการ/ใหม่ ({availableCount} คัน)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-zinc-600 inline-block"/> สถานะอื่น ๆ ({totalCars - availableCount} คัน)</span>
              </div>
            </div>
          </div>
        )}

        {/* 6. TAB: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-card-dark rounded-xl border border-white/5 p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white">การตั้งค่าความปลอดภัยและข้อมูลเจ้าหน้าที่</h3>
            <p className="text-sm text-text-grey">ตั้งค่ารหัสผ่านและค่าเริ่มต้นความเสถียรของ MVP</p>
            
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-text-grey">รหัสเข้าใช้งาน Admin PIN (ข้อมูลระบบ)</label>
                <input 
                  type="text" 
                  disabled 
                  value="1234 (ค่าเริ่มต้น MVP - แก้ไขไม่ได้ในเวอร์ชันนี้)"
                  className="w-full bg-carbon-black border border-white/10 rounded-lg p-3 text-sm text-zinc-500 cursor-not-allowed"
                />
              </div>
              
              <div className="p-4 bg-racing-red/10 border border-racing-red/20 text-xs rounded-xl flex gap-2.5 text-racing-red">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <div>
                  <h4 className="font-bold">ข้อมูลเตือนระบบ MVP</h4>
                  <p className="mt-0.5 text-text-grey leading-relaxed">นี่คือเวอร์ชันตัวอย่างสำหรับการสาธิต (MVP Display เท่านั้น) ข้อมูลรถยนต์จะถูกเก็บไว้ในตัวค้นหาเบราว์เซอร์ (localStorage) ของเครื่องท่านโดยตรง หากทำความสะอาดประวัติเบราว์เซอร์ข้อมูลรถยนต์ที่เพิ่มในปุ่ม + Add Car จะตอบกลับค่าตั้งต้น 6 คันซี้ดประปุก</p>
                </div>
              </div>
              
              {/* Reset to Seed Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('คุณแน่ใจว่าต้องการล้างข้อมูลล่าสุด และรีนิวด้วยตัวอย่างเริ่มต้น 6 คันเดิมปักหมุดหรือไม่?')) {
                      localStorage.removeItem('apex_cars');
                      // reload page to trigger default seed
                      window.location.reload();
                    }
                  }}
                  className="bg-zinc-800 text-white hover:bg-zinc-700 px-4 py-2 rounded text-xs transition-colors"
                >
                  ล้างข้อมูลและโหลดชุดเริ่มต้นยึดใหม่ (Seed Reload)
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
