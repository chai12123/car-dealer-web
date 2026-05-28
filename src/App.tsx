/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Car, CarStatus, ContactMessage } from './types';
import { SEEDED_CARS } from './data';
import AdminPanel from './components/AdminPanel';
import CarModal from './components/CarModal';
import ImageWithFallback from './components/ImageWithFallback';
import { 
  Car as CarIcon, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Search, 
  SlidersHorizontal, 
  ChevronRight, 
  ChevronLeft,
  Quote, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Coins, 
  RefreshCw, 
  FileCheck,
  Check, 
  Menu, 
  X,
  Facebook,
  Instagram,
  Youtube,
  Lock
} from 'lucide-react';

export default function App() {
  // Load or seed cars with migration
  const [cars, setCars] = useState<Car[]>(() => {
    const stored = localStorage.getItem('apex_cars');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Car[];
        // Look for seeded cars 1-6 using old unsplash URLs and migrate them
        let migrated = false;
        const updated = parsed.map(car => {
          const matchingSeed = SEEDED_CARS.find(s => s.id === car.id);
          if (matchingSeed) {
            // If it uses external links, update to local public images
            const usesExternal = car.images && car.images.length > 0 && car.images[0].startsWith('http');
            if (usesExternal) {
              migrated = true;
              return {
                ...car,
                images: [...matchingSeed.images]
              };
            }
          }
          return car;
        });

        if (migrated) {
          localStorage.setItem('apex_cars', JSON.stringify(updated));
          return updated;
        }
        return parsed;
      } catch (e) {
        // ignore
      }
    }
    // Seed initial cars if empty
    localStorage.setItem('apex_cars', JSON.stringify(SEEDED_CARS));
    return SEEDED_CARS;
  });

  // Prefers reduced motion & video error handling
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    try {
      mediaQuery.addEventListener('change', listener);
    } catch {
      // Deprecated fallback fallback for older browsers
      mediaQuery.addListener(listener);
    }
    return () => {
      try {
        mediaQuery.removeEventListener('change', listener);
      } catch {
        mediaQuery.removeListener(listener);
      }
    };
  }, []);

  // UI state
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [navbarScrolled, setNavbarScrolled] = useState<boolean>(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('newest');

  // Contact form pre-fill state
  const [contactForm, setContactForm] = useState<ContactMessage>({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [contactSuccessMsg, setContactSuccessMsg] = useState<string>('');

  // Count-up stats simulation
  const [statCars, setStatCars] = useState(0);
  const [statYears, setStatYears] = useState(0);
  const [statCheckpoints, setStatCheckpoints] = useState(0);
  const [statRating, setStatRating] = useState(0);

  // Active Testimonial Slider index
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // References
  const contactFormRef = useRef<HTMLDivElement>(null);
  const inventoryRef = useRef<HTMLDivElement>(null);
  const whyUsRef = useRef<HTMLDivElement>(null);
  
  // Animation states & refs
  const trustBarRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [trustBarInView, setTrustBarInView] = useState(false);
  const [timelineInView, setTimelineInView] = useState(false);

  // IntersectionObserver for elements in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            
            if (entry.target.id === 'trustbar_metrics') {
              setTrustBarInView(true);
            }
            if (entry.target.id === 'process_timeline') {
              setTimelineInView(true);
            }
            
            // Trigger animation reveal once
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Dynamic targets scanning
    const targets = document.querySelectorAll('#trustbar_metrics, #process_timeline, .reveal-container');
    targets.forEach((el) => observer.observe(el));

    return () => {
      targets.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Sync scroll detection for sticky navbar style changes
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavbarScrolled(true);
      } else {
        setNavbarScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen to #admin hash transitions
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      } else {
        setIsAdminOpen(false);
      }
    };

    // Initial check
    checkHash();

    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Simulated animated counts triggered on intersection
  useEffect(() => {
    if (!trustBarInView) return;

    const duration = 1200; // ms
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setStatCars(Math.min(150, Math.round((150 / steps) * step)));
      setStatYears(Math.min(15, Math.round((15 / steps) * step)));
      setStatCheckpoints(Math.min(200, Math.round((200 / steps) * step)));
      setStatRating(Number(Math.min(4.9, (4.9 / steps) * step).toFixed(1)));

      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [trustBarInView]);

  // Save updated cars list and synchronize with localStorage
  const handleCarsUpdated = (updatedCars: Car[]) => {
    localStorage.setItem('apex_cars', JSON.stringify(updatedCars));
    setCars(updatedCars);
  };

  // Close Admin and clear hash
  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    // Remove hash without scrolling page
    history.pushState("", document.title, window.location.pathname + window.location.search);
  };

  // Open Admin page
  const handleOpenAdmin = () => {
    window.location.hash = 'admin';
    setIsAdminOpen(true);
  };

  // Open detailing modal and auto prefill on inquiry trigger
  const handleInquireCar = (carModelName: string) => {
    setSelectedCar(null); // close modal
    setContactForm(prev => ({
      ...prev,
      carModel: carModelName,
      message: `สวัสดีครับ ผมมีความสนใจใคร่ขอสอบถามข้อมูลและนัดหมายทดลองขับรถยนต์พรีเมียมรุ่น ${carModelName} ครับ รบกวนติดต่อกลับด้วยนะครับ`
    }));
    
    // Smooth scroll down to contact section
    setTimeout(() => {
      contactFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // Trigger contacting form mock mechanism
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone || !contactForm.email) {
      alert('กรุณากรอกข้อมูลสำคัญ (ชื่อ, เบอร์โทรศัพท์, และอีเมล) ให้ครบถ้วนครับ!');
      return;
    }

    // Capture the lead dynamically into localStorage leads history database!
    const existingLeadsRaw = localStorage.getItem('apex_leads');
    let existingLeads: ContactMessage[] = [];
    if (existingLeadsRaw) {
      try {
        existingLeads = JSON.parse(existingLeadsRaw);
      } catch (err) {
        // ignore
      }
    }
    existingLeads.push(contactForm);
    localStorage.setItem('apex_leads', JSON.stringify(existingLeads));

    // Show beautiful success notification
    setContactSuccessMsg(`ขอบคุณคุณ ${contactForm.name} ครับ ทีมงานที่ปรึกษาการขาย APEX Auto Gallery ได้รับคำขอนัดหมายด้านรถยนต์เรียบร้อยแล้ว เราจะรีบโทรติดต่อกลับที่เบอร์ ${contactForm.phone} โดยเร็วที่สุดครับ`);
    
    // Clear after action
    setContactForm({
      name: '',
      phone: '',
      email: '',
      message: '',
      carModel: undefined
    });

    setTimeout(() => {
      setContactSuccessMsg('');
    }, 12000); // keep message visible for user confirmation before fading out
  };

  // Filter cars logic
  const getFilteredCars = () => {
    return cars.filter(car => {
      // 1. Text lookup
      const q = searchQuery.toLowerCase().trim();
      const textMatch = q === '' || (
        car.brand.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q) ||
        car.note.toLowerCase().includes(q)
      );

      // 2. Brand selector filter
      const brandMatch = selectedBrand === 'all' || car.brand.toLowerCase() === selectedBrand.toLowerCase();

      // 3. Price scope filter
      let priceMatch = true;
      if (selectedPriceRange !== 'all') {
        const price = car.price;
        if (selectedPriceRange === 'under15') {
          priceMatch = price < 1500000;
        } else if (selectedPriceRange === '15to20') {
          priceMatch = price >= 1500000 && price <= 2000000;
        } else if (selectedPriceRange === '20to25') {
          priceMatch = price >= 2000000 && price <= 2500000;
        } else if (selectedPriceRange === 'over25') {
          priceMatch = price > 2500000;
        }
      }

      return textMatch && brandMatch && priceMatch;
    }).sort((a, b) => {
      // Sorting criteria
      if (selectedSort === 'priceAsc') {
        return a.price - b.price;
      } else if (selectedSort === 'priceDesc') {
        return b.price - a.price;
      } else if (selectedSort === 'yearDesc') {
        return b.year - a.year;
      } else if (selectedSort === 'mileageAsc') {
        return a.mileage - b.mileage;
      }
      return b.price - a.price; // default: high price premium first
    });
  };

  const finalFilteredCars = getFilteredCars();

  // Extract unique brands for filter select options
  const uniqueBrands = Array.from(new Set(cars.map(c => c.brand)));

  // Testimonials database
  const TESTIMONIALS = [
    {
      text: "รถสภาพสวยสมบูรณ์แบบมาก ตรงปกทุกอย่าง ทีมงานและผู้เชี่ยวชาญให้คำแนะนำและตรวจสอบประวัติอย่างละเอียดประทับใจมากครับ ออกรถง่ายรวดเร็ว มีบริการหลังขายดีเยี่ยม!",
      name: "คุณเอกชัย",
      car: "BMW 530e M Sport"
    },
    {
      text: "ประทับใจมากค่ะ ตั้งแต่วินาทีแรกที่ก้าวเท้าเข้ามาที่แกลเลอรี เซลล์ขายรถอธิบายซื่อสัตย์ ให้ข้อมูลประวัติไม่มีปิดบัง ไม่กดดัน ปล่อยรถทดลองลูบไล้ได้เต็มที่ แนะนำเพื่อนๆ มาออกต่อแน่นอนค่ะ",
      name: "คุณเอ๋",
      car: "Mercedes-Benz E300 AMG"
    },
    {
      text: "คุณภาพของตัวรถสมบูรณ์แบบระดับ 5 ดาว สมยี่ห้อและราคาจริงๆ คันนี้ได้ประวัติศูนย์ครบถ้วนสมบูรณ์ มั่นใจอุ่นใจกับการรับประกันความคุ้มครอง คุ้มค่าที่สุดครับ",
      name: "คุณอภิสิทธิ์",
      car: "Porsche Macan S"
    }
  ];

  return (
    <div className="bg-carbon-black text-text-near-white min-h-screen relative flex flex-col font-sans selection:bg-racing-red selection:text-white">
      
      {/* 1. STICKY NAVBAR */}
      <header 
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          navbarScrolled 
            ? 'bg-carbon-black/95 shadow-md border-b border-white/5 py-4 backdrop-blur-md' 
            : 'bg-transparent py-6'
        }`}
        id="navbar_main"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Logo Brand Brand */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-display font-black text-2xl tracking-tighter text-white">
              APEX <span className="text-racing-red italic transition-colors group-hover:text-white">AUTO GALLERY</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <a href="#" className="text-sm font-medium text-white hover:text-racing-red transition-colors">หน้าหลัก</a>
            <a href="#inventory" className="text-sm font-medium text-text-grey hover:text-white transition-colors">รถทั้งหมด</a>
            <a href="#services" className="text-sm font-medium text-text-grey hover:text-white transition-colors">บริการของเรา</a>
            <a href="#whyus" className="text-sm font-medium text-text-grey hover:text-white transition-colors">เกี่ยวกับเรา</a>
            <a href="#testimonials" className="text-sm font-medium text-text-grey hover:text-white transition-colors">รีวิวจากลูกค้า</a>
            <a href="#contact" className="text-sm font-medium text-text-grey hover:text-white transition-colors">ติดต่อเรา</a>
          </nav>

          {/* Desktop Call to Action button */}
          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => {
                contactFormRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-racing-red text-white hover:bg-red-700 px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all hover:shadow-[0_0_15px_rgba(225,29,42,0.4)] cursor-pointer"
              id="cta_contact_top"
            >
              ติดต่อเราด่วน
            </button>
            <button 
              onClick={handleOpenAdmin}
              className="border border-white/10 hover:border-racing-red/40 hover:text-racing-red text-text-grey p-2.5 rounded-full transition-all cursor-pointer"
              title="เปิดแผงควบคุมแอดมิน"
              id="admin_shortcut_btn"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburguer Toggler */}
          <div className="flex lg:hidden items-center gap-3">
            <button 
              onClick={handleOpenAdmin}
              className="border border-white/10 p-2 rounded-full transition-all"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-1 hover:text-racing-red transition-colors focus:outline-none cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-card-dark border-b border-white/10 p-6 flex flex-col gap-4 animate-fade-in-down shadow-xl">
            <a 
              href="#" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-base font-semibold py-2 border-b border-white/5"
            >
              หน้าหลัก
            </a>
            <a 
              href="#inventory" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-base font-semibold py-2 border-b border-white/5"
            >
              รถทั้งหมด
            </a>
            <a 
              href="#services" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-base font-semibold py-2 border-b border-white/5"
            >
              บริการของเรา
            </a>
            <a 
              href="#whyus" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-base font-semibold py-2 border-b border-white/5"
            >
              เกี่ยวกับเรา
            </a>
            <a 
              href="#testimonials" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-base font-semibold py-2 border-b border-white/5"
            >
              รีวิวจากลูกค้า
            </a>
            <a 
              href="#contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-base font-semibold py-2 border-b border-white/5 text-racing-red"
            >
              ติดต่อเรา
            </a>

            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                contactFormRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-racing-red text-white py-3 rounded-xl font-bold text-center mt-2 cursor-pointer"
            >
              ติดต่อเรา
            </button>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-black" id="hero_section">
        {/* Sleek background video/image with fallback */}
        {!prefersReducedMotion && !videoError ? (
          <video
            src="/hero-video.mp4"
            poster="/car-bmw-530e.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onError={() => setVideoError(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen"
          />
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-screen ken-burns-bg" 
            style={{ backgroundImage: "url('/car-bmw-530e.jpg')" }} 
          />
        )}
        
        {/* Extra dark overlay to adjust contrast to ~55-65% dark (reduced opacity by 75% for custom bright background look) */}
        <div className="absolute inset-0 bg-black/15" />
        
        {/* Cinematic Red studio linear overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-carbon-black via-carbon-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon-black to-transparent" />
        {/* Subtle radial red spotlight background gradient simulation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-racing-red/8 opacity-[0.14] blur-[140px] pointer-events-none pulse-glow-anim" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-10">
          
          <div className="lg:col-span-8 space-y-6 pt-10">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-racing-red bg-racing-red/10 border border-racing-red/20 px-3 py-1 rounded hero-stagger hero-delay-1">
              EUROPEAN USED CARS
            </span>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display text-white tracking-tight leading-tight uppercase hero-stagger hero-delay-2 p-1">
              รถยุโรปมือสอง คัดพิเศษ <br />
              <span className="text-racing-red italic text-glow">คุณภาพระดับพรีเมียม</span>
            </h1>

            <p className="text-text-grey text-base md:text-lg max-w-xl leading-relaxed hero-stagger hero-delay-3">
              คัดสรรรถยุโรปมือสองเกรดพรีเมียมคลาสนำเข้าทุกคัน ผ่านขั้นตอนการตรวจสอบเชิงเทคนิคละเอียดถี่ถ้วนกว่า 200 จุดโดยผู้เชี่ยวชาญ คุ้มครองตรวจสอบได้ มั่นใจในคุณภาพ โปร่งใสทุกขั้นตอน บริการด้วยจรรยาบรรณและความจริงใจสูงสุด
            </p>

            <div className="flex flex-wrap gap-4 pt-4 hero-stagger hero-delay-4">
              <a 
                href="#inventory"
                className="bg-racing-red text-white btn-shine hover:bg-red-700 px-8 py-4 rounded-xl font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(225,29,42,0.4)] hover:shadow-[0_0_25px_rgba(225,29,42,0.6)] text-center transition-all cursor-pointer"
              >
                ดูรถทั้งหมดในสต็อก
              </a>
              <a 
                href="#whyus"
                className="border border-white/10 hover:border-white/35 text-white bg-white/5 hover:bg-white/10 btn-shine px-8 py-4 rounded-xl font-bold text-sm tracking-wide text-center transition-all cursor-pointer"
              >
                ทำไมต้องเลือกเรา
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block" />
        </div>
      </section>

      {/* 3. TRUST BAR (COUNT UP NUMBERS DISPLAY) */}
      <section ref={trustBarRef} className="bg-card-dark py-12 border-y border-white/5 relative z-10 shadow-lg" id="trustbar_metrics">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Stat Item 1 */}
            <div className="text-center group border-r border-white/5 last:border-0 px-4 py-8 relative">
              <div className="relative inline-block pb-3 mb-2">
                <p className="text-4xl md:text-5xl font-black text-racing-red font-display tracking-tight group-hover:scale-105 duration-300 inline-block pb-1">
                  {statCars}+
                </p>
                <div className={`h-[2px] bg-racing-red mx-auto transition-all duration-1000 ease-out ${
                  trustBarInView ? 'w-full' : 'w-0'
                }`} />
              </div>
              <p className="text-white text-base font-semibold mt-4 mb-2">รถยนต์พร้อมขายในแกลเลอรี</p>
              <p className="text-text-grey text-xs">หมุนเวียนแบรนด์ยอดฮิตระดับโลก</p>
            </div>

            {/* Stat Item 2 */}
            <div className="text-center group border-r border-white/5 last:border-0 px-4 py-8 relative">
              <div className="relative inline-block pb-3 mb-2">
                <p className="text-4xl md:text-5xl font-black text-racing-red font-display tracking-tight group-hover:scale-105 duration-300 inline-block pb-1">
                  {statYears}
                  <span className="text-2xl font-bold text-racing-red font-display"> ปี</span>
                </p>
                <div className={`h-[2px] bg-racing-red mx-auto transition-all duration-1000 ease-out ${
                  trustBarInView ? 'w-full' : 'w-0'
                }`} />
              </div>
              <p className="text-white text-base font-semibold mt-4 mb-2">ในวงการรถยนต์หรูนำเข้า</p>
              <p className="text-text-grey text-xs">ประวัติยาวนานพร้อมบริการด้วยดีลพรีเมียม</p>
            </div>

            {/* Stat Item 3 */}
            <div className="text-center group border-r border-white/5 last:border-0 px-4 py-8 relative">
              <div className="relative inline-block pb-3 mb-2">
                <p className="text-4xl md:text-5xl font-black text-racing-red font-display tracking-tight group-hover:scale-105 duration-300 inline-block pb-1">
                  {statCheckpoints}
                  <span className="text-2xl font-bold text-racing-red font-display font-medium"> จุด</span>
                </p>
                <div className={`h-[2px] bg-racing-red mx-auto transition-all duration-1000 ease-out ${
                  trustBarInView ? 'w-full' : 'w-0'
                }`} />
              </div>
              <p className="text-white text-base font-semibold mt-4 mb-2">รายการตรวจสอบคุณภาพคันต่อคัน</p>
              <p className="text-text-grey text-xs">การันตีปราศจากน้ำท่วมและไมล์กรอ</p>
            </div>

            {/* Stat Item 4 */}
            <div className="text-center group px-4 py-8 relative">
              <div className="relative inline-block pb-3 mb-2">
                <p className="text-4xl md:text-5xl font-black text-racing-red font-display tracking-tight group-hover:scale-105 duration-300 inline-block pb-1">
                  {statRating}★
                </p>
                <div className={`h-[2px] bg-racing-red mx-auto transition-all duration-1000 ease-out ${
                  trustBarInView ? 'w-full' : 'w-0'
                }`} />
              </div>
              <p className="text-white text-base font-semibold mt-4 mb-2">คะแนนรีวิวความพึงพอใจลูกค้า</p>
              <p className="text-text-grey text-xs">ยืนยันคุณภาพมาตรฐานแบรนด์อันดับ 1</p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. INVENTORY SYSTEM & CORE LISTING ENGINE */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8" id="inventory" ref={inventoryRef}>
        
        {/* Section Heading with wide sporty typography */}
        <div className="text-center mb-16 space-y-4 reveal-container">
          <span className="text-xs font-bold uppercase tracking-widest text-racing-red font-mono reveal-item">STOCK COLLECTION</span>
          <h2 className="text-3xl md:text-5xl font-black font-display uppercase text-white tracking-widest reveal-item">
            รถพร้อมขายทั้งหมดในระบบ <span className="text-racing-red">({finalFilteredCars.length})</span>
          </h2>
          <div className="h-1 bg-racing-red mx-auto text-glow divider-line reveal-item" />
          <p className="text-text-grey text-sm md:text-base max-w-lg mx-auto reveal-item">
            คัดเลือกเฉพาะสุดยอดของรถยนต์มือสองพรีเมียม สภาพเยี่ยม วิ่งน้อย ให้ท่านได้สัมผัสในราคาพิเศษสุด
          </p>
        </div>

        {/* Filter and Search Bar Section */}
        <div className="bg-card-dark rounded-2xl border border-white/5 p-6 mb-10 shadow-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search inputs */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-text-grey" />
              <input 
                type="text" 
                placeholder="ค้นหาจาก รุ่น, ยี่ห้อ, หรือคำสำคัญ..." 
                className="w-full bg-carbon-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-racing-red transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="inv_text_search"
              />
            </div>

            {/* Brand Dropdown */}
            <div>
              <select 
                className="w-full bg-carbon-black border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-racing-red transition-all"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                id="inv_brand_filter"
              >
                <option value="all">ยี่ห้อรถยนต์ทั้งหมด</option>
                {uniqueBrands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Price range scope */}
            <div>
              <select 
                className="w-full bg-carbon-black border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-racing-red transition-all"
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                id="inv_price_filter"
              >
                <option value="all">ทุกระดับช่วงราคา</option>
                <option value="under15">ราคาต่ำกว่า 1.5 ล้านบาท</option>
                <option value="15to20">ราคา 1.5 - 2.0 ล้านบาท</option>
                <option value="20to25">ราคา 2.0 - 2.5 ล้านบาท</option>
                <option value="over25">ราคามากกว่า 2.5 ล้านบาท</option>
              </select>
            </div>

            {/* Sort engine */}
            <div>
              <select 
                className="w-full bg-carbon-black border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-racing-red transition-all"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                id="inv_sort_filter"
              >
                <option value="newest">ราคาล่าสุด (ราคาสูง - ต่ำ)</option>
                <option value="priceAsc">ราคาต่ำสุด - สูงสุด</option>
                <option value="priceDesc">ราคาสูงสุด - ต่ำสุด</option>
                <option value="yearDesc">เรียงตามปีรถ (ใหม่สุด - เก่าสุด)</option>
                <option value="mileageAsc">เลขไมล์วิ่งน้อยที่สุดก่อน</option>
              </select>
            </div>

          </div>

          {/* Quick reset actions if filter applied */}
          {(searchQuery || selectedBrand !== 'all' || selectedPriceRange !== 'all') && (
            <div className="flex justify-between items-center text-xs text-text-grey pt-2 border-t border-white/5">
              <span>พบผลลัพธ์คัดสรรพรวม {finalFilteredCars.length} คัน</span>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBrand('all');
                  setSelectedPriceRange('all');
                  setSelectedSort('newest');
                }}
                className="text-racing-red hover:underline font-semibold cursor-pointer"
              >
                ล้างวงการฟิลเตอร์ทั้งหมด
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Responsive Car Grid (3 Col desktop / 1 mobile) */}
        {finalFilteredCars.length === 0 ? (
          <div className="bg-card-dark border border-white/5 rounded-2xl py-20 text-center text-text-grey space-y-4">
            <CarIcon className="w-12 h-12 mx-auto text-text-grey/40" />
            <p className="text-lg font-semibold">ขออภัยด้วยครับ ไม่พบรถยนต์ยุโรปในระดับราคาที่ท่านกำหนดในระนาบนี้</p>
            <p className="text-xs">กรุณาลดตัวกรอง ค้นหา หรือป้อนคำค้นหาคำสำคัญอื่นๆ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-container">
            {finalFilteredCars.map((car) => {
              // Get status badge colors
              let statusBadgeBg = '';
              let statusText = '';
              
              if (car.status === 'available') {
                statusBadgeBg = 'bg-emerald-500/90 text-white';
                statusText = 'พร้อมขาย';
              } else if (car.status === 'new') {
                statusBadgeBg = 'bg-sky-500/90 text-white';
                statusText = 'รถเข้าใหม่';
              } else if (car.status === 'reserved') {
                statusBadgeBg = 'bg-amber-500/90 text-white';
                statusText = 'จองแล้ว';
              } else if (car.status === 'sold') {
                statusBadgeBg = 'bg-zinc-700/90 text-white';
                statusText = 'ขายแล้ว';
              }

              return (
                <div 
                  key={car.id}
                  className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden group cursor-pointer flex flex-col reveal-item inventory-card"
                  onClick={() => setSelectedCar(car)}
                >
                  
                  {/* Photo with status badge overlay */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black shrink-0">
                    <ImageWithFallback 
                      src={car.images[0]} 
                      alt={`${car.brand} ${car.model} มือสอง / Premium Used ${car.brand} ${car.model}`}
                      fallbackAlt={`${car.brand} ${car.model} มือสอง / Premium Used ${car.brand} ${car.model}`}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating top status badge left */}
                    <span className={`absolute top-4 left-4 z-10 px-3.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${statusBadgeBg}`}>
                      {statusText}
                    </span>
                    
                    {/* subtle spotlight gradient in hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60" />
                  </div>

                  {/* Body Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[11px] text-text-grey font-mono block tracking-widest">{car.brand} FAMILY</span>
                      <h3 className="text-white text-lg font-bold group-hover:text-racing-red transition-colors line-clamp-1">
                        {car.model}
                      </h3>
                      
                      {/* year | mileage */}
                      <div className="flex items-center gap-3 text-xs text-text-grey font-mono">
                        <span>ปี {car.year}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <span>เลขไมล์: {car.mileage.toLocaleString()} กม.</span>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                      {/* Red highly contrasting price */}
                      <div>
                        <p className="text-[10px] text-text-grey">ราคาเงินสดพิเศษ</p>
                        <p className="text-xl font-bold font-display text-racing-red leading-tight">
                          {car.price.toLocaleString()} <span className="text-xs text-white">บาท</span>
                        </p>
                      </div>

                      {/* Detail overlay launcher */}
                      <span className="bg-white/5 border border-white/5 group-hover:bg-racing-red group-hover:text-white text-white text-xs px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1">
                        ดูรายละเอียด
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Clear/Reset See all Trigger */}
        {finalFilteredCars.length < cars.length && (
          <div className="text-center mt-12 bg-card-dark max-w-xs mx-auto py-3 rounded-xl border border-white/5">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBrand('all');
                setSelectedPriceRange('all');
              }}
              className="text-white hover:text-racing-red text-sm font-semibold transition-all transition-colors cursor-pointer"
            >
              แสดงรถที่ซ่อนอยู่ทั้งหมด ({cars.length} คัน)
            </button>
          </div>
        )}
      </section>

      {/* 5. WHY US — "ทำไมต้องเลือกเรา" */}
      <section className="py-24 bg-card-dark border-y border-white/5 relative glow-bg" id="whyus" ref={whyUsRef}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center mb-16 space-y-3 reveal-container">
            <span className="text-xs font-bold uppercase tracking-widest text-racing-red font-mono reveal-item">WHY APEX</span>
            <h2 className="text-3xl md:text-5xl font-black font-display uppercase text-white tracking-widest reveal-item">
              ทำไมต้องเลือกซื้อรถหรูกับเรา
            </h2>
            <div className="h-1 bg-racing-red mx-auto divider-line reveal-item" />
            <p className="text-text-grey text-sm md:text-base max-w-lg mx-auto reveal-item">
              เพราะเรายึดมั่นความปลอดภัยและความซื่อสัตย์มาเป็นอันดับที่หนึ่ง ลูกค้าทุกท่านจึงพึงพอใจตลอดชีพ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 reveal-container">
            
            {/* Card 1 */}
            <div className="bg-carbon-black rounded-2xl p-7 md:p-8 border border-white/5 relative group overflow-hidden reveal-item hover-glow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-racing-red/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:bg-racing-red/10 transition-colors" />
              <div className="inline-flex p-3 rounded-xl bg-racing-red/10 border border-racing-red/20 mb-5 relative">
                <Check className="w-6 h-6 text-racing-red" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">คัดสรรคุณภาพพรีเมียม</h3>
              <p className="text-text-grey text-xs leading-relaxed">
                คัดเลือกคุณภาพรถเกรดพรีเมียมระดับพอร์เช่ บีเอ็มดับบลิว ทุกคัน สมาชิกตรวจสอบเชิงวิศวกรรมการยนต์กว่า 200 จุดสมบูรณ์แบบ
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-carbon-black rounded-2xl p-7 md:p-8 border border-white/5 relative group overflow-hidden reveal-item hover-glow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-racing-red/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:bg-racing-red/10 transition-colors" />
              <div className="inline-flex p-3 rounded-xl bg-racing-red/10 border border-racing-red/20 mb-5 relative">
                <ShieldCheck className="w-6 h-6 text-racing-red" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">ตรวจสอบโปร่งใส</h3>
              <p className="text-text-grey text-xs leading-relaxed">
                ประวัติการดูแลศูนย์ตรงชัดเจน ไม่ฝันลมคราม ไม่เคยชนหนัก ไม่เคยจมน้ำ ไมล์แท้เท่านั้นสามารถรับประวัติกลับไปคานาโตะตรวจสอบเช็คได้ทันที
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-carbon-black rounded-2xl p-7 md:p-8 border border-white/5 relative group overflow-hidden reveal-item hover-glow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-racing-red/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:bg-racing-red/10 transition-colors" />
              <div className="inline-flex p-3 rounded-xl bg-racing-red/10 border border-racing-red/20 mb-5 relative">
                <Compass className="w-6 h-6 text-racing-red" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">ศูนย์บริการมาตรฐาน</h3>
              <p className="text-text-grey text-xs leading-relaxed">
                ดูแลคุณต่อเนื่องหลังการขายโดยทีมงานผู้เชี่ยวชาญเฉพาะแบรนด์ เครื่องมือและซอฟต์แวร์วิเคราะห์เทคโนโลยีทันสมัยที่สุดในไทย
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-carbon-black rounded-2xl p-7 md:p-8 border border-white/5 relative group overflow-hidden reveal-item hover-glow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-racing-red/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:bg-racing-red/10 transition-colors" />
              <div className="inline-flex p-3 rounded-xl bg-racing-red/10 border border-racing-red/20 mb-5 relative">
                <Sparkles className="w-6 h-6 text-racing-red" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">บริการด้วยความจริงใจ</h3>
              <p className="text-text-grey text-xs leading-relaxed">
                ให้คำปรึกษา แนะนำแบบผู้มีความรู้ก่อนการตัดสินใจซื้อขายจริง ซื่อสัตย์ มีระบบจรรยาบรรณพนักงาน โปร่งใส่ทุกตัวเลขทุกดีล
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. SERVICES — "บริการของเรา" */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8" id="services">
        <div className="text-center mb-16 space-y-3 reveal-container">
          <span className="text-xs font-bold uppercase tracking-widest text-racing-red font-mono reveal-item">OUR SERVICES</span>
          <h2 className="text-3xl md:text-5xl font-black font-display uppercase text-white tracking-widest reveal-item">
            บริการระดับพรีเมียมจากเรา
          </h2>
          <div className="h-1 bg-racing-red mx-auto divider-line reveal-item" />
          <p className="text-text-grey text-sm md:text-base max-w-lg mx-auto reveal-item">
            ครบเครื่องเรื่องธุรกรรมรถยนต์หรู สะดวกสบาย รวดเร็ว และเป็นส่วนตัว
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal-container">
          
          <div className="bg-card-dark rounded-xl p-7 md:p-8 border border-white/5 text-center flex flex-col items-center hover-glow duration-300 reveal-item">
            <div className="w-12 h-12 bg-racing-red/10 border border-racing-red/20 rounded-full flex items-center justify-center text-racing-red mb-4">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">จัดไฟแนนซ์ ดอกเบี้ยพิเศษ</h3>
            <p className="text-text-grey text-xs">ข้อเสนอดีที่สุดร่วมกับสถาบันการเงินชั้นนำของประเทศ อนุมัติรวดเร็วสูงสุดใน 24 ชั่วโมง</p>
          </div>

          <div className="bg-card-dark rounded-xl p-6 border border-white/5 text-center flex flex-col items-center hover-glow duration-300">
            <div className="w-12 h-12 bg-racing-red/10 border border-racing-red/20 rounded-full flex items-center justify-center text-racing-red mb-4">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">รับเทิร์นรถ ราคายุติธรรม</h3>
            <p className="text-text-grey text-xs">ให้มูลค่ารถยนต์คันเก่าของคุณสูงที่สุดเพื่อนำมาแลกเปลี่ยนสปอร์ตคันใหม่ ประเมินสภาพด่วนทันใจ</p>
          </div>

          <div className="bg-card-dark rounded-xl p-6 border border-white/5 text-center flex flex-col items-center hover-glow duration-300">
            <div className="w-12 h-12 bg-racing-red/10 border border-racing-red/20 rounded-full flex items-center justify-center text-racing-red mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">ฝากขายรถ ขายไว ได้ราคาดี</h3>
            <p className="text-text-grey text-xs">บริการโปรโมทระดับพรีเมียม ถ่ายภาพสตูแสงไฟ มีทีมงานล้างจัดแต่งสภาพพร้อมฐานข้อมูลลูกค้าพร้อมซื้อ</p>
          </div>

          <div className="bg-card-dark rounded-xl p-6 border border-white/5 text-center flex flex-col items-center hover-glow duration-300">
            <div className="w-12 h-12 bg-racing-red/10 border border-racing-red/20 rounded-full flex items-center justify-center text-racing-red mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">ประกันภัยรถยนต์ ชั้น 1 ทุกบริษัท</h3>
            <p className="text-text-grey text-xs">ความคุ้มครองดีลตรงที่ดีที่สุด ให้คุณขับขี่กลับบ้านได้แบบอุ่นใจไร้ระแวง ครอบคลุมฉุกเฉิน 24 ชม.</p>
          </div>

        </div>
      </section>

      {/* 7. PROCESS — "ขั้นตอนการออกรถ" */}
      <section ref={timelineRef} className="py-24 bg-card-dark border-y border-white/5 relative" id="process_timeline">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center mb-16 space-y-3 reveal-container">
            <span className="text-xs font-bold uppercase tracking-widest text-racing-red font-mono reveal-item">TIMELINE STEPS</span>
            <h2 className="text-3xl md:text-5xl font-black font-display uppercase text-white tracking-widest reveal-item">
              ขั้นตอนการเป็นเจ้าของรถหรูง่ายๆ
            </h2>
            <div className="h-1 bg-racing-red mx-auto divider-line reveal-item" />
            <p className="text-text-grey text-sm md:text-base max-w-lg mx-auto reveal-item">
              ขั้นตอนการออกรถรวดเร็วมั่นใจ ตรวจสอบเสร็จไวภายใน 4 ลำดับ
            </p>
          </div>

          {/* Timeline container */}
          <div className="relative">
            {/* Horizontal Line background guide */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800/80 -translate-y-1/2 hidden lg:block overflow-hidden rounded-full">
              <div 
                className={`h-full bg-racing-red transition-all duration-[1.5s] ease-out ${
                  timelineInView ? 'w-full' : 'w-0'
                }`} 
              />
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 ${
              timelineInView ? 'timeline-visible' : ''
            }`}>
              
              {/* Step 1 */}
              <div className="bg-carbon-black rounded-2xl p-7 md:p-8 border border-white/5 text-center relative group reveal-item">
                <div className="absolute top-3 left-4 text-xs font-bold font-mono text-text-grey/30 group-hover:text-racing-red/40 transition-colors">STEP 01</div>
                <div className="w-10 h-10 rounded-full bg-racing-red text-white flex items-center justify-center font-bold text-sm mx-auto mb-4 relative z-10 shadow-[0_0_12px_rgba(225,29,42,0.6)] font-display pop-node-anim node-delay-1">
                  1
                </div>
                <h3 className="text-white font-bold text-base mb-2">เลือกดูรถที่ต้องการ</h3>
                <p className="text-text-grey text-xs">เลือกรถสปอร์ตยุโรปพรีเมียมจากรายการ คุยโทรเพื่อสำรองจองนัดหมายเปิดสอบประวัติรถคันจริงได้ทันที</p>
              </div>

              {/* Step 2 */}
              <div className="bg-carbon-black rounded-2xl p-7 md:p-8 border border-white/5 text-center relative group reveal-item">
                <div className="absolute top-3 left-4 text-xs font-bold font-mono text-text-grey/30 group-hover:text-racing-red/40 transition-colors">STEP 02</div>
                <div className="w-10 h-10 rounded-full bg-racing-red text-white flex items-center justify-center font-bold text-sm mx-auto mb-4 relative z-10 shadow-[0_0_12px_rgba(225,29,42,0.6)] font-display pop-node-anim node-delay-2">
                  2
                </div>
                <h3 className="text-white font-bold text-base mb-2">ตรวจสอบรายละเอียด/เอกสาร</h3>
                <p className="text-text-grey text-xs">ทีมงานจะนำเสนอรายงานประวัติศูนย์ ข้อมูลทางสถิติ ประวัติเดิมไม่เคยพลิกคว่ำ และทดลองขับ</p>
              </div>

              {/* Step 3 */}
              <div className="bg-carbon-black rounded-2xl p-7 md:p-8 border border-white/5 text-center relative group reveal-item">
                <div className="absolute top-3 left-4 text-xs font-bold font-mono text-text-grey/30 group-hover:text-racing-red/40 transition-colors">STEP 03</div>
                <div className="w-10 h-10 rounded-full bg-racing-red text-white flex items-center justify-center font-bold text-sm mx-auto mb-4 relative z-10 shadow-[0_0_12px_rgba(225,29,42,0.6)] font-display pop-node-anim node-delay-3">
                  3
                </div>
                <h3 className="text-white font-bold text-base mb-2">จัดไฟแนนซ์รวดเร็ว</h3>
                <p className="text-text-grey text-xs">ยื่นดำเนินการจัดทำสัญญาเอกสารไฟแนนซ์ อนุมัติสิทธิรับข้อเสอนพิเศษร่วมประกันชั้น 1 ฟรี</p>
              </div>

              {/* Step 4 */}
              <div className="bg-carbon-black rounded-2xl p-7 md:p-8 border border-white/5 text-center relative group reveal-item">
                <div className="absolute top-3 left-4 text-xs font-bold font-mono text-text-grey/30 group-hover:text-racing-red/40 transition-colors">STEP 04</div>
                <div className="w-10 h-10 rounded-full bg-racing-red text-white flex items-center justify-center font-bold text-sm mx-auto mb-4 relative z-10 shadow-[0_0_12px_rgba(225,29,42,0.6)] font-display pop-node-anim node-delay-4">
                  4
                </div>
                <h3 className="text-white font-bold text-base mb-2">รับมอบกุญแจรถได้ทันที</h3>
                <p className="text-text-grey text-xs">ดูแลเตรียมทำความสะอาดขัดสีส่งมอบพร้อมพรม อุปกรณ์ และประวัติรับประกันบริการหลังขาย</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS — "รีวิวจากลูกค้าของเรา" */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8" id="testimonials">
        <div className="text-center mb-16 space-y-3 reveal-container">
          <span className="text-xs font-bold uppercase tracking-widest text-racing-red font-mono reveal-item">OUR CLIENTS REVIEWS</span>
          <h2 className="text-3xl md:text-5xl font-black font-display uppercase text-white tracking-widest font-display reveal-item">
            เสียงตอบรับจากลูกค้าผู้เป็นเจ้าของจริง
          </h2>
          <div className="h-1 bg-racing-red mx-auto divider-line reveal-item" />
        </div>

        {/* Testimonials Quote Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-container">
          {TESTIMONIALS.map((t, idx) => (
            <div 
              key={idx}
              className={`bg-card-dark rounded-2xl p-8 border hover:border-racing-red/20 transition-all duration-300 relative flex flex-col justify-between ${
                activeTestimonial === idx ? 'border-racing-red/40 ring-1 ring-racing-red/10' : 'border-white/5'
              }`}
              onMouseEnter={() => setActiveTestimonial(idx)}
            >
              <div>
                {/* Quotation iconography decoration red */}
                <span className="inline-block text-racing-red bg-racing-red/10 p-2.5 rounded-full mb-6">
                  <Quote className="w-5 h-5 fill-racing-red text-racing-red" />
                </span>

                <blockquote className="text-text-near-white italic text-xs md:text-sm leading-relaxed mb-6">
                  "{t.text}"
                </blockquote>
              </div>

              <div className="border-t border-white/5 pt-4">
                <p className="text-white font-bold text-sm">{t.name}</p>
                <p className="text-racing-red text-xs font-medium font-mono uppercase tracking-wider mt-0.5">{t.car}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Slider Dot Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveTestimonial(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                activeTestimonial === i ? 'bg-racing-red px-3' : 'bg-zinc-700 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 9. CONTACT — "ติดต่อเรา" */}
      <section className="py-24 bg-card-dark border-t border-white/5 relative" id="contact" ref={contactFormRef}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 reveal-container">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left: MESSAGE FORM WITH INQUIRY OPTIONAL CAR MODEL */}
            <div className="space-y-6 bg-carbon-black p-7 md:p-8 rounded-2xl border border-white/5 relative reveal-item hover-glow">
              
              <div className="space-y-1">
                <span className="text-xs text-racing-red uppercase font-mono tracking-widest font-bold">INQUIRY FORM</span>
                <h3 className="text-xl md:text-2xl font-bold font-display uppercase tracking-wide text-white">ส่งข้อความติดต่อกลับ / นัดหมายชมรถ</h3>
                <p className="text-text-grey text-xs">กรอกข้อมูลเพื่อทำการจองคิวนัดดูประวัติรถยนต์ที่คุณต้องการ ที่ปรึกษาการขายจะติดต่อคุยโทรตอบข้อเสนอโดยทันที</p>
              </div>

              {/* Form container */}
              <form onSubmit={handleContactSubmit} className="space-y-4">
                
                {/* Prefilled specific vehicle indicators */}
                {contactForm.carModel && (
                  <div className="bg-racing-red/10 border border-racing-red/20 text-racing-red text-xs font-semibold px-4 py-3 rounded-lg flex justify-between items-center">
                    <span>ต้องการนัดชมรถรุ่น: <strong>{contactForm.carModel}</strong></span>
                    <button 
                      type="button" 
                      onClick={() => setContactForm(prev => ({ ...prev, carModel: undefined, message: '' }))}
                      className="text-white hover:text-racing-red underline"
                    >
                      ล้างรุ่นรถ
                    </button>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-text-grey mb-1 font-semibold">ชื่อ - นามสกุล *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="เช่น คุณสมศักดิ์ สุขประเสริฐ" 
                    className="w-full bg-card-dark border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-racing-red transition-all"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                {/* Telephone + Email in grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-text-grey mb-1 font-semibold">เบอร์โทรศัพท์ (สำคัญในพิกัดติดต่อ) *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="เช่น 082-123-4567" 
                      className="w-full bg-card-dark border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-racing-red transition-all font-mono font-medium"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-text-grey mb-1 font-semibold font-semibold">ที่อยู่อีเมล (Email) *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="เช่น somsak@gmail.com" 
                      className="w-full bg-card-dark border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-racing-red transition-all"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Message notes area */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-text-grey mb-1 font-semibold">รายละเอียดเพิ่มเติม / ช่วงเวลาที่สะดวกคุยโทร</label>
                  <textarea 
                    rows={4}
                    placeholder="ป้อนรายละเอียด เช่น สะดวกรับสายหลังเวลา 17.00 น. หรือ ขอทราบยอดจัดไฟแนนซ์เพิ่มเติม..."
                    className="w-full bg-card-dark border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-racing-red transition-all resize-none"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-racing-red hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-center text-sm transition-all shadow-[0_0_12px_rgba(225,29,42,0.3)] hover:shadow-[0_0_20px_rgba(225,29,42,0.5)] cursor-pointer"
                  id="contact_form_submit_btn"
                >
                  ส่งข้อความนัดหมายนัดขับ
                </button>

              </form>

              {/* Dynamic Notification Message box for user confirmation feedback */}
              {contactSuccessMsg && (
                <div className="bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs leading-relaxed animate-fade-in-up flex gap-3">
                  <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 shrink-0 font-bold">✓</div>
                  <p>{contactSuccessMsg}</p>
                </div>
              )}

            </div>

            {/* Right: CONTACT CARD DATA */}
            <div className="space-y-8 flex flex-col justify-self-center lg:justify-self-start pr-4 pt-4">
              
              <div className="space-y-4">
                <span className="text-xs text-racing-red font-mono uppercase tracking-widest font-bold">APEX HEADQUARTERS</span>
                <h3 className="text-3xl md:text-4xl font-black font-display uppercase tracking-widest text-white">APEX AUTO GALLERY</h3>
                <p className="text-text-grey text-xs md:text-sm leading-relaxed max-w-md">
                  โชว์รูมและศูนย์รวมศิลปะยนตรกรรมหรูคัดสรรพิเศษอันดับ 1 ของกรุงเทพมหานคร ท้าทายให้เข้าร่วมรับคำแนะนำและเดินทางมาร่วมทดสอบความแรงจริงได้ทุกวันทำการ
                </p>
              </div>

              {/* Location contacts lists */}
              <div className="space-y-4 text-xs md:text-sm">
                
                {/* Physical address */}
                <div className="flex gap-4">
                  <span className="text-racing-red shrink-0"><MapPin className="w-5 h-5" /></span>
                  <div>
                    <span className="text-white font-bold block mb-1">ที่ตั้งแกลเลอรี</span>
                    <p className="text-text-grey text-xs md:text-sm">APEX Auto Gallery <br /> 8/8 ถนนกาญจนาภิเษก แขวงบางแคเหนือ เขตบางแค กรุงเทพฯ 10160</p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex gap-4">
                  <span className="text-racing-red shrink-0"><Phone className="w-5 h-5" /></span>
                  <div>
                    <span className="text-white font-bold block mb-1">เบอร์โทรศัพท์สายตรง</span>
                    <p className="text-text-grey text-xs md:text-sm font-mono">082-123-4567 (แผนกต้อนรับบริการ)</p>
                  </div>
                </div>

                {/* LINE info */}
                <div className="flex gap-4">
                  <span className="text-racing-red shrink-0"><Mail className="w-5 h-5" /></span>
                  <div>
                    <span className="text-white font-bold block mb-1">LINE & ช่องทางออนไลน์อื่น ๆ</span>
                    <p className="text-text-grey text-xs md:text-sm">LINE officialID: <strong>@apexautogallery</strong></p>
                  </div>
                </div>

                {/* Work Time */}
                <div className="flex gap-4">
                  <span className="text-racing-red shrink-0"><Clock className="w-5 h-5" /></span>
                  <div>
                    <span className="text-white font-bold block mb-1">เวลาทำการ (ไม่มีวันหยุด)</span>
                    <p className="text-text-grey text-xs md:text-sm">
                      จันทร์ - เสาร์: 09:00 - 18:00 น. <br />
                      อาทิตย์: 10:00 - 17:00 น.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 10. FOOTER SECTION */}
      <footer className="bg-black py-16 text-xs text-text-grey border-t border-white/5 relative z-10" id="footer_section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Tagline logo */}
            <div className="lg:col-span-4 space-y-4">
              <span className="font-display font-black text-2xl tracking-tighter text-white">
                APEX <span className="text-racing-red italic">AUTO GALLERY</span>
              </span>
              <p className="text-text-grey text-xs max-w-sm leading-relaxed">
                ตัวแทนจำหน่ายยวดยานยนตร์แบรนด์หรูและรถยุโรปคุณภาพมือสองคัดคุณภาพอันดับหนึ่ง คัดสรรคุณภาพ ผ่านการตรวจด้วยหัวใจ บริการเสมือนครอบครัว
              </p>
              
              {/* social buttons */}
              <div className="flex gap-3 pt-2">
                <a href="https://facebook.com" className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-racing-red hover:text-white transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-racing-red hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-racing-red hover:text-white transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Links Column 1: Menu */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider font-display border-b border-white/10 pb-1.5 inline-block">เมนูเว็บไซต์</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="hover:text-racing-red transition-colors">หน้าหลัก (Home)</a></li>
                <li><a href="#inventory" className="hover:text-racing-red transition-colors">รถทั้งหมดในคลัง</a></li>
                <li><a href="#services" className="hover:text-racing-red transition-colors">บริการของเรา</a></li>
                <li><a href="#whyus" className="hover:text-racing-red transition-colors">ทำไมต้องเลือกเรา</a></li>
                <li><a href="#testimonials" className="hover:text-racing-red transition-colors">รีวิวจากผู้ใช้จริง</a></li>
              </ul>
            </div>

            {/* Links Column 2: Our Services */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider font-display border-b border-white/10 pb-1.5 inline-block">บริการของเรา</h4>
              <ul className="space-y-2.5">
                <li><a href="#services" className="hover:text-racing-red transition-colors">จัดไฟแนนซ์ ดอกเบี้ยตํ่า</a></li>
                <li><a href="#services" className="hover:text-racing-red transition-colors">รับเทิร์นแลกเปลี่ยนรถด่วน</a></li>
                <li><a href="#services" className="hover:text-racing-red transition-colors">ฝากขายสตูถ่ายภาพพรีเมียม</a></li>
                <li><a href="#services" className="hover:text-racing-red transition-colors">ประเมินเช็คระบบความแรงรถ</a></li>
              </ul>
            </div>

            {/* Links Column 3: About company */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider font-display border-b border-white/10 pb-1.5 inline-block">เกี่ยวกับ APEX</h4>
              <ul className="space-y-2.5">
                <li><a href="#whyus" className="hover:text-racing-red transition-colors">วิสัยทัศน์และการประเมิน</a></li>
                <li><a href="#process_timeline" className="hover:text-racing-red transition-colors">เงื่อนไขการรับประกันและรับซื้อ</a></li>
                <li><a href="#contact" className="hover:text-racing-red transition-colors">ร่วมงานกับทีมปัญญาชน</a></li>
                <li><a href="#contact" className="hover:text-racing-red transition-colors">แบบแผนการคุ้มครองข้อมูล</a></li>
              </ul>
            </div>

            {/* Contact details */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider font-display border-b border-white/10 pb-1.5 inline-block">ข้อมูลสอบถาม</h4>
              <ul className="space-y-2 text-text-grey font-mono">
                <li>📞 082-123-4567</li>
                <li>💬 LINE: @apexautogallery</li>
                <li>✉️ info@apexautogallery.co.th</li>
                <li className="pt-2">
                  {/* Admin Entrance Trigger */}
                  <button 
                    onClick={handleOpenAdmin}
                    className="text-[10px] text-zinc-500 hover:text-white flex items-center gap-1 border border-zinc-800/60 px-2 py-1 rounded hover:border-white/15 transition-all text-left uppercase tracking-wider cursor-pointer"
                    id="admin_portal_trigger_footer"
                  >
                    <Lock className="w-3 h-3 text-racing-red" />
                    เจ้าหน้าที่หลังบ้าน / ADMIN
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-text-grey/55">
            <p>© 2024 APEX Auto Gallery. All Rights Reserved. สงวนลิขสิทธิ์ข้อมูลรถยนต์หรูคัดสรรคุณภาพดีที่สุด</p>
            
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer select-none">เงื่อนไขและการบริการคัดจำลอง</span>
              <span className="hover:text-white cursor-pointer select-none">ระบบประเมินความพึงพอใจ</span>
              <span className="text-racing-red cursor-pointer select-none" onClick={handleOpenAdmin}>Admin (PIN: 1234)</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ====== CAR DETAIL FULL MODAL COMPONENT ====== */}
      {selectedCar && (
        <CarModal 
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          onInquire={handleInquireCar}
        />
      )}

      {/* ====== ADMIN PANEL COMPONENT ====== */}
      {isAdminOpen && (
        <AdminPanel 
          cars={cars}
          onCarsUpdated={handleCarsUpdated}
          onClose={handleCloseAdmin}
        />
      )}

    </div>
  );
}
