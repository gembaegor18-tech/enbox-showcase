/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DEFAULT_CONTENT, COLOR_VARIATIONS, TECHNICAL_PHOTOS } from './data';
import { SiteContent } from './types';
import GeneratorRenderer from './components/GeneratorRenderer';
import CmsPanel from './components/CmsPanel';
import {
  Wrench,
  Settings,
  ShieldCheck,
  Cpu,
  RotateCcw,
  Zap,
  Info,
  Maximize2,
  ChevronDown,
  Phone,
  Mail,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Image as ImageIcon,
  BookOpen,
  Copy,
  Check,
} from 'lucide-react';

export default function App() {
  // CMS state loaded from localStorage or falling back to default Russian generator content
  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('genbox_cms_content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure generators exist
        if (parsed && parsed.generators && parsed.generators.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing localStorage content', e);
      }
    }
    return DEFAULT_CONTENT;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('genbox_is_admin') === 'true';
  });
  const [logoClicks, setLogoClicks] = useState<number>(0);

  // Configurator options state
  const [includeBox, setIncludeBox] = useState<boolean>(true);
  const [customPaint, setCustomPaint] = useState<boolean>(false);
  
  // Selected visualizer settings
  const [activeColorId, setActiveColorId] = useState<string>('green-wood');
  const [visualizerTab, setVisualizerTab] = useState<'photo' | 'vector' | 'inside'>('photo');
  const [selectedGeneratorId, setSelectedGeneratorId] = useState<string>('batbox-bga-8000e');
  
  const [selectedStrap, setSelectedStrap] = useState<string>('крышка на газовых упорах');
  const [spinningSpeed, setSpinningSpeed] = useState<number>(2); // 0 (stop) to 5 (fast)
  const [cmsOpen, setCmsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [customDialColor, setCustomDialColor] = useState<string>('#d97706');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const handleCopy = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  // Active color info
  const activeColor = COLOR_VARIATIONS.find(c => c.id === activeColorId) || COLOR_VARIATIONS[0];
  const currentGenerator = content.generators[0] || DEFAULT_CONTENT.generators[0];

  // Calculated Pricing
  // Base setup: Generator + Automatic control module is 99 000 rub
  const basePrice = 99000;
  // Protective Box adds 35 000 rub
  const boxCost = includeBox ? 35000 : 0;
  const totalPrice = basePrice + boxCost;

  // Build safe mailto link without inline URL percent sequences inside JSX expression
  const emailSubject = encodeURIComponent("Запрос на расчет bat box");
  const emailBody = encodeURIComponent(
    `Здравствуйте! Интересует комплект:\n-  Генератор 8.3 кВт + АВР (99 000 руб)\n- Защитный Бокс: ${includeBox ? 'Да (+35 000 руб)' : 'Нет'}\n- Покраска по договоренности: ${customPaint ? 'Да (обсудить цвет)' : 'Стандартный цвет'}\n\nСтоимость конечного комплекта: ${totalPrice.toLocaleString()} руб.`
  );
  const emailHref = `mailto:gemba.egor@yandex.ru?subject=${emailSubject}&body=${emailBody}`;

  // Admin query listener & auto-clearing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const adminParam = params.get('admin');
    if (adminParam === 'masterbox') {
      setIsAdmin(true);
      localStorage.setItem('genbox_is_admin', 'true');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (adminParam === 'logout') {
      setIsAdmin(false);
      localStorage.removeItem('genbox_is_admin');
      setCmsOpen(false);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);
    if (nextClicks >= 5) {
      setLogoClicks(0);
      const password = prompt('Введите пароль администратора для разблокировки CMS настроек (по умолчанию "masterbox"):');
      if (password === 'masterbox') {
        setIsAdmin(true);
        localStorage.setItem('genbox_is_admin', 'true');
        alert('Панель CMS разблокирована! Теперь кнопка отображается в шапке сайта.');
      } else if (password !== null) {
        alert('Неверный код доступа.');
      }
    }
  };

  // Sync color when color-variation changes
  useEffect(() => {
    setCustomDialColor(activeColor.accentColor);
  }, [activeColorId, activeColor]);

  // Track window scroll for glass navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUpdateContent = (newContent: SiteContent) => {
    setContent(newContent);
    localStorage.setItem('genbox_cms_content', JSON.stringify(newContent));
    
    // Quick success toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleResetContent = () => {
    if (window.confirm('Сбросить весь контент к значениям мануфактуры bat box?')) {
      localStorage.removeItem('genbox_cms_content');
      setContent(DEFAULT_CONTENT);
      setActiveColorId('wood-black');
      setIncludeBox(true);
      setCustomPaint(false);
      setVisualizerTab('photo');
    }
  };

  // Format price helper
  const formatPrice = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#fafcfc] text-zinc-800 font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
      
      {/* Dynamic Background Graphics */}
      <div className="absolute top-0 left-0 w-full h-[1000px] overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-amber-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-emerald-50 rounded-full blur-[100px] opacity-40" />
      </div>

      {/* FLOATING SUCCESS TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-white border border-emerald-200 text-emerald-700 px-5 py-2.5 rounded-full text-xs font-medium shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 size={15} className="text-emerald-500" />
            Контент успешно обновлен и сохранен локально!
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHT EMBELLISHED HEADER NAVIGATION */}
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md border-b border-zinc-200/50 py-3 shadow-sm' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Minimalist modern branding logo */}
            <div onClick={handleLogoClick} className="flex flex-col cursor-pointer select-none" title="BAT BOX">
              <span className="font-display font-black tracking-[0.22em] text-xl text-zinc-900 flex items-center gap-1 uppercase">
                BAT <span className="text-amber-600">BOX</span>
              </span>
            </div>
            
            <span className="hidden lg:inline px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-mono text-zinc-500 border border-zinc-200/60">
              Собственное сборочное производство
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center" title="Генераторная установка">
              <svg className="w-12 h-9 text-zinc-400/80 hover:text-amber-500 transition-all duration-300" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Enclosure body */}
                <rect x="4" y="8" width="40" height="24" rx="4" stroke="currentColor" strokeWidth="2" />
                {/* Top carrying handle */}
                <path d="M16 8V5C16 4.44772 16.4477 4 17 4H31C31.5523 4 32 4.44772 32 5V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {/* Cooling / ventilation grille lines */}
                <line x1="10" y1="14" x2="22" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="10" y1="18" x2="22" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="10" y1="22" x2="22" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="10" y1="26" x2="18" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                {/* Minimalist Control panel */}
                <rect x="28" y="13" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="31" cy="18" r="1.5" fill="currentColor" />
                <line x1="35" y1="16" x2="35" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Feet */}
                <line x1="10" y1="32" x2="14" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="34" y1="32" x2="38" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>


            {/* CMS Open Button */}
            {isAdmin && (
              <button
                id="cms-toggle-btn"
                onClick={() => setCmsOpen(!cmsOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 border border-amber-500/20 text-zinc-850 text-xs font-mono rounded-full cursor-pointer transition-all"
              >
                <Wrench size={13} className="text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
                <span>CMS Панель</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="relative flex min-h-screen pt-20">
        
        {/* LANDING BODY */}
        <div className={`flex-1 transition-all duration-500 ${cmsOpen ? 'lg:pr-[380px]' : ''}`}>
          
          {/* HERO GREETING PANEL */}
          <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Texts Description */}
            <div className="lg:col-span-7 space-y-6">
              
              <h1 className="text-4xl md:text-5xl lg:text-[54px] font-display font-medium tracking-tight text-zinc-900 leading-tight uppercase">
                Профессиональное<br />
                резервное энергоснабжение<br />
                <span className="font-black text-amber-600">BAT BOX</span>
              </h1>
              
              <p className="text-zinc-650 text-sm md:text-base leading-relaxed font-sans max-w-2xl">
                {content.hero.subtitle}
              </p>

              {/* USP Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-white rounded-xl border border-zinc-200/50 shadow-sm flex flex-col gap-1">
                  <span className="text-xl font-display font-bold text-amber-600">до -35°C</span>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wide">Зимний пуск</span>
                  <p className="text-[11px] text-zinc-400 mt-1">Оснащен обогревом картера и термостатом</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-zinc-200/50 shadow-sm flex flex-col gap-1">
                  <span className="text-xl font-display font-bold text-emerald-600">55 дБ</span>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wide">Шумозащита</span>
                  <p className="text-[11px] text-zinc-400 mt-1">Звук на уровне тихого спокойного разговора</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-zinc-200/50 shadow-sm flex flex-col gap-1">
                  <span className="text-xl font-display font-bold text-zinc-900">12 мс</span>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wide">Скорость АВР</span>
                  <p className="text-[11px] text-zinc-400 mt-1">Переход бесшовен для бытовой электроники</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <a
                  href="#calculator-section"
                  className="w-full sm:w-auto px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white text-[13px] uppercase font-bold tracking-wider rounded-lg shadow-lg shadow-amber-600/10 transition-all text-center font-mono"
                >
                  {content.hero.ctaText}
                </a>
              </div>
            </div>

            {/* Right Side: Hero collage preview of beautiful colors */}
            <div className="lg:col-span-5 relative flex lg:justify-end justify-center">
              <div className="relative w-full max-w-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-zinc-100 flex flex-col group">
                {/* Embedded Collage of boxes */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={TECHNICAL_PHOTOS.collage.image}
                    alt="Палитра bat box"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
                  <span className="absolute bottom-3 left-3 bg-white/95 text-zinc-900 px-2 py-0.5 rounded text-[8px] font-medium font-mono uppercase tracking-widest border border-zinc-200">
                    Пример установки
                  </span>
                </div>
                
                <div className="p-4 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-600 font-bold uppercase tracking-wider">Эстетика и Комфорт</span>
                  </div>
                  <h3 className="font-display font-black text-zinc-900 text-sm leading-tight uppercase">
                    Шумоизоляционный корпус под любой дизайн участка
                  </h3>
                </div>
              </div>
            </div>
          </section>

          {/* INTERACTIVE WORKSHOP SHOWROOM / CALCULATOR */}
          <section id="calculator-section" className="scroll-mt-24 py-16 bg-white border-y border-zinc-200/80 shadow-inner">
            <div className="max-w-7xl mx-auto px-6">
              
              {/* Header inside Showcase */}
              <div className="border-b border-zinc-200 pb-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <span className="text-[10px] font-mono text-amber-600 tracking-[0.2em] font-bold block mb-1 uppercase">
                    Интерактивный конфигуратор & ТТХ генератора
                  </span>
                  <h2 className="text-3xl font-display font-bold text-zinc-900 uppercase tracking-tight">
                    Конструктор комплектации bat <span className="text-amber-600">box</span>
                  </h2>
                </div>
              </div>

              {/* Showcase Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left column: Dynamic presets */}
                <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-display font-bold text-zinc-900 uppercase tracking-tight">
                      Выберите Комплектацию
                    </h3>
                    <p className="text-zinc-500 text-xs">
                      При клике на любую конфигурацию вас автоматически переместит к контактам отдела сбыта для мгновенной связи.
                    </p>

                    <div className="space-y-4">
                      {/* PRESET 1: Generator + Automatic control module */}
                      <div
                        onClick={() => {
                          setIncludeBox(false);
                          const el = document.getElementById('contact-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group h-full ${
                          !includeBox 
                            ? 'bg-amber-50/50 border-amber-500 shadow-lg scale-[1.01]' 
                            : 'bg-white hover:bg-zinc-50 border-zinc-200/80 shadow-sm'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-end">
                            <span className="text-[10px] font-mono text-zinc-400 group-hover:text-amber-600 transition-colors">
                              Выбрать →
                            </span>
                          </div>
                          <h4 className="text-base font-display font-black text-zinc-900 uppercase tracking-tight">
                            Генератор + автоматика
                          </h4>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-baseline justify-end">
                          <span className="text-2xl font-display font-black text-zinc-900 tracking-tight">
                            99 000 ₽
                          </span>
                        </div>
                      </div>

                      {/* PRESET 2: Everything in first + protect box */}
                      <div
                        onClick={() => {
                          setIncludeBox(true);
                          const el = document.getElementById('contact-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group h-full ${
                          includeBox 
                            ? 'bg-amber-50/55 border-amber-500 shadow-lg scale-[1.01]' 
                            : 'bg-white hover:bg-zinc-50 border-zinc-200/80 shadow-sm'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-end">
                            <span className="text-[10px] font-mono text-amber-500 group-hover:text-amber-600 transition-colors">
                              Выбрать →
                            </span>
                          </div>
                          <h4 className="text-base font-display font-black text-amber-700 uppercase tracking-tight">
                            Генератор + автоматика + защитный бокс
                          </h4>
                          
                          <div className="px-2.5 py-1 bg-amber-100/50 text-amber-800 rounded font-mono text-[9px] font-bold uppercase inline-block">
                            Покраска обсуждается по договоренности в стиль вашего дизайна
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-amber-200/50 flex items-baseline justify-end">
                          <span className="text-2xl font-display font-black text-amber-700 tracking-tight">
                            134 000 ₽
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational Controls for the SVG Viewer */}
                  {visualizerTab === 'vector' && (
                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-3.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-zinc-500 uppercase font-semibold">Симуляция генерации тока</span>
                        <span className="text-amber-650 font-bold">{spinningSpeed > 0 ? `${spinningSpeed * 1200} об/мин` : 'СТОП'}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        value={spinningSpeed}
                        onChange={(e) => setSpinningSpeed(parseInt(e.target.value))}
                        className="w-full h-1 bg-zinc-200 accent-amber-600 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-[9.5px] text-zinc-500 leading-normal text-center font-mono">
                        Изменяйте частоту вращения вентилятора и возбуждение медных обмоток катушек.
                      </p>
                    </div>
                  )}

                  {/* Price Summary and Order placement */}
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">Текущий выбор комплекта</span>
                        <span className="text-2xl font-display font-black text-amber-700 tracking-tight mt-0.5">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pt-1">
                      <a
                        href="#contact-section"
                        className="px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs uppercase font-bold tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 font-mono shadow-md"
                      >
                        <Phone size={13} />
                        Позвонить
                      </a>
                      <a
                        href="#contact-section"
                        className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-900 border border-zinc-800 text-white text-xs uppercase font-bold tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 font-mono"
                      >
                        <Mail size={13} />
                        Написать
                      </a>
                    </div>
                  </div>
                </div>

                {/* Center Column: Interactive Graphic stage (Photos vs SVG render specs) */}
                <div className="lg:col-span-5 flex flex-col space-y-4">
                  
                  {/* Visualizer Header Tabs */}
                  <div className="flex bg-zinc-100 p-1.5 rounded-xl border border-zinc-200">
                    <button
                      onClick={() => setVisualizerTab('photo')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 font-mono ${
                        visualizerTab === 'photo'
                          ? 'bg-white text-zinc-900 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-800 bg-transparent'
                      }`}
                    >
                      <ImageIcon size={13} />
                      Живое фото бокса
                    </button>
                    <button
                      onClick={() => setVisualizerTab('inside')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 font-mono ${
                        visualizerTab === 'inside'
                          ? 'bg-white text-zinc-900 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-800 bg-transparent'
                      }`}
                    >
                      <Layers size={13} />
                      Что внутри?
                    </button>
                  </div>

                  {/* Stage body wrapping images or engine schematics */}
                  <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-4 min-h-[320px] sm:min-h-[420px] flex flex-col items-center justify-center relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      {visualizerTab === 'photo' && (
                        <motion.div
                          key="live-photo-preview"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.3 }}
                          className="w-full flex flex-col items-center"
                        >
                          {/* Embedded paint preview frame */}
                          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg border-2 border-white bg-zinc-200">
                            <img
                              src={activeColor.image}
                              alt={activeColor.nameRu}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-zinc-200 px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest text-zinc-700 font-bold">
                              {activeColor.nameRu}
                            </div>
                          </div>

                          <div className="text-center mt-4 px-2 space-y-1">
                            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">Активное исполнение</span>
                            <h4 className="font-display font-medium text-zinc-900 text-sm">{activeColor.nameRu}</h4>
                            <p className="text-zinc-500 text-[11px] leading-relaxed max-w-sm mx-auto">
                              {activeColor.description}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {visualizerTab === 'inside' && (
                        <motion.div
                          key="inside-technical-photo"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.3 }}
                          className="w-full flex flex-col items-center"
                        >
                          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg border-2 border-white bg-zinc-100">
                            <img
                              src={TECHNICAL_PHOTOS.inside.image}
                              alt="Внутри бокса bat box"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-3 left-3 bg-white/95 text-zinc-800 px-2.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase border border-zinc-200">
                              Встроенный генератор
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Horizontal interactive Color Chooser with mini circles  */}
                  {visualizerTab === 'photo' && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-semibold block text-center">
                        Выберите текстуру фасада и защитного каркаса:
                      </span>
                      <div className="flex flex-wrap justify-center gap-2">
                        {COLOR_VARIATIONS.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setActiveColorId(c.id);
                              setVisualizerTab('photo');
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-[10px] font-medium transition-all flex items-center gap-1.5 ${
                              activeColorId === c.id
                                ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-sm'
                                : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-650'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full shadow-inner block" style={{ backgroundColor: c.accentColor }} />
                            <span>{c.nameRu}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Detailed original specs of BOXBOT BGA-8000E */}
                <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-xl font-display font-bold text-zinc-900 uppercase tracking-tight">
                      Характеристики установки
                    </h3>
                    
                    <div className="divide-y divide-zinc-100 bg-zinc-50 rounded-xl border border-zinc-205/60 p-4">
                      {[
                        { label: 'Макс. Мощность', val: '8.3 кВт (Полная мощность: 8.5 кВА, Выходной ток 36 А)' },
                        { label: 'Тип двигателя', val: '4-тактный бензиновый синхронный' },
                        { label: 'Емкостной бак', val: '25 литров (бензин АИ-92, работа до 8 часов на одной заправке)' },
                        { label: 'Расход топлива', val: '3.2 л/час' },
                        { label: 'Система пуска', val: 'Ручной, Электрический (Электростартер + автозапуск АВР)' },
                        { label: 'Кол-во розеток', val: '3 шт. (2 х 16А и 1 х 32А силовая)' },
                        { label: 'Авторегулировка напряжения', val: 'Модуль AVR (автоматическая стабилизация напряжения)' },
                        { label: 'Уровень звука', val: '85 дБ без бокса' },
                        { label: 'Системы безопасности', val: 'Датчик уровня масла с автоотключением, вольтметр, защита от перегрузок' },
                        { label: 'Класс защиты', val: 'IP23' },
                        { label: 'Кабельные трассы', val: 'Медные жилы в негорючей гофре НГ / Бронерукав' },
                      ].map((spec, i) => (
                        <div key={i} className="py-2 flex flex-col text-xs gap-0.5">
                          <span className="text-zinc-400 font-mono text-[9px] uppercase font-bold tracking-wide">
                            {spec.label}
                          </span>
                          <span className="text-zinc-850 font-sans font-medium text-xs leading-normal">
                            {spec.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </section>

          {/* REAL PHOTOS DETAILED BENTO GRID SECTION */}
          <section className="py-20 bg-zinc-50 border-t border-zinc-200/60 relative">
            <div className="max-w-7xl mx-auto px-6">
              
              <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
                <span className="px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full font-mono text-[10px] text-amber-800 uppercase tracking-widest font-semibold">
                  Фотографии объектов
                </span>
                <h2 className="text-3.5xl font-display font-black text-zinc-900 uppercase tracking-tight">
                  bat <span className="text-amber-600">box</span> на участках заказчиков
                </h2>
                <p className="text-zinc-500 text-sm">
                  Рассмотрите детали и качество сборки корпусов, выхлопных рукавов и электрощитовых узлов нашего производства.
                </p>
              </div>

              {/* Aesthetic 3-column grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Item 1: Open Lid (Vnutrennye osnashchennye) */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-md hover:border-zinc-300">
                  <div className="aspect-[4/3] overflow-hidden relative border-b border-zinc-100">
                    <img
                      src={TECHNICAL_PHOTOS.inside.image}
                      alt="Внутри открытого бокса"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div className="space-y-3">
                      <div>
                        <span className="px-2.5 py-0.5 bg-rose-50 border border-rose-200 text-rose-800 font-mono text-[9px] rounded uppercase font-bold tracking-wide">
                          Внутреннее убранство
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-zinc-900 text-base uppercase tracking-tight">
                        {TECHNICAL_PHOTOS.inside.title}
                      </h3>
                      <p className="text-zinc-500 text-xs leading-relaxed font-sans">
                        Увеличили площадь вентиляции, установили принудительный вентилятор для охлаждения блока.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Item 2: ATS Shield */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-md hover:border-zinc-300">
                  <div className="aspect-[4/3] overflow-hidden relative border-b border-zinc-100">
                    <img
                      src={TECHNICAL_PHOTOS.runsLed.image}
                      alt="Блок автоматики щита АВР"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div className="space-y-3">
                      <div>
                        <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 font-mono text-[9px] rounded uppercase font-bold tracking-wide">
                          Интеллектуальная плата
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-zinc-900 text-base uppercase tracking-tight">
                        {TECHNICAL_PHOTOS.runsLed.title}
                      </h3>
                      <p className="text-zinc-500 text-xs leading-relaxed font-sans">
                        Щит АВР крепится прямо на борт бокса в герметичный металлический ящик. Светодиодный экран 'RUN' показывает параметры частоты и текущий вольтаж, защищая домашнюю электросеть от перепадов фаз.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Item 3: Exhaust Outlet System */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-md hover:border-zinc-300">
                  <div className="aspect-[4/3] overflow-hidden relative border-b border-zinc-100">
                    <img
                      src={TECHNICAL_PHOTOS.exhaust.image}
                      alt="Система отвода выхлопных газов"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div className="space-y-3">
                      <div>
                        <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 font-mono text-[9px] rounded uppercase font-bold tracking-wide">
                          Термозащита выхлопа
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-zinc-900 text-base uppercase tracking-tight">
                        {TECHNICAL_PHOTOS.exhaust.title}
                      </h3>
                      <p className="text-zinc-500 text-xs leading-relaxed font-sans">
                        Металлорукав выведен сквозь деревянную панель через термоизолированную нержавеющую накладку. Исключает нагрев стенок и сохраняет герметичность выхлопного тракта.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* CHOSEN DIRECT CONTACTS ORDER SECTION */}
          <section id="contact-section" className="scroll-mt-24 bg-amber-50/40 border-t border-zinc-200 py-16">
            <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200/50 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold">
                Отдел розничного сбыта и монтажа
              </span>
              
              <h3 className="text-3xl md:text-4xl font-display font-medium text-zinc-900 uppercase tracking-tight">
                Индивидуальное согласование <span className="font-sans normal-case">&</span> Покупка
              </h3>
              
              <p className="text-zinc-500 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto">
                Каждый объект загородного жилья имеет свои электрические особенности. Свяжитесь напрямую с нашими руководителями производства для быстрого обсуждения параметров покраски бокса в стиль вашего дизайна и уличного монтажа.
              </p>

              {/* Direct Managers Profiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 max-w-2xl mx-auto">
                {/* Profile 1: Evgeny */}
                <div className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col items-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-display font-black text-lg">
                    ЕИ
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-zinc-900 text-sm">Евгений Игоревич</h4>
                  </div>
                  <div className="w-full flex gap-1.5">
                    <a
                      href="tel:+79817425415"
                      className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white text-[10.5px] font-mono font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Phone size={12} />
                      +7 (981) 742-54-15
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy("+79817425415", "phone")}
                      className="px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg transition-all flex items-center justify-center group"
                      title="Копировать номер телефона"
                    >
                      {copiedPhone ? (
                        <Check size={12} className="text-emerald-600 animate-bounce" />
                      ) : (
                        <Copy size={12} className="text-amber-700 group-hover:scale-110 transition-transform" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Profile 2: Egor */}
                <div className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col items-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-700 font-display font-black text-lg">
                    ЕА
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-zinc-900 text-sm">Егор Алексеевич</h4>
                  </div>
                  <div className="w-full flex gap-1.5">
                    <a
                      href="mailto:gemba.egor@yandex.ru"
                      className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-800 text-white text-[10.5px] font-mono font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Mail size={12} />
                      gemba.egor@yandex.ru
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy("gemba.egor@yandex.ru", "email")}
                      className="px-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-250 rounded-lg transition-all flex items-center justify-center group"
                      title="Копировать электронную почту"
                    >
                      {copiedEmail ? (
                        <Check size={12} className="text-emerald-600 animate-bounce" />
                      ) : (
                        <Copy size={12} className="text-zinc-650 group-hover:scale-110 transition-transform" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Reset to factory option for offline testing code in bottom */}
              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={handleResetContent}
                  className="px-4 py-2 bg-transparent hover:bg-zinc-100 border border-zinc-200 text-zinc-400 hover:text-zinc-650 text-[10px] uppercase font-mono tracking-wider rounded-lg transition-all"
                >
                  Сбросить правки к заводским
                </button>
              </div>
            </div>
          </section>

          {/* FOOTER AREA */}
          <footer className="bg-white border-t border-zinc-200 py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <span className="font-display font-black text-2xl tracking-[0.22em] text-zinc-900">
                  bat <span className="text-amber-600">box</span>
                </span>
                <span className="text-[9px] font-mono tracking-widest text-[#71717a] uppercase mt-1">
                  ПРОИЗВОДСТВО ВСЕПОГОДНЫХ СИСТЕМ РЕЗЕРВА И БОКСОВ ДЛЯ ГЕНЕРАТОРОВ
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <span className="text-[10px] font-mono text-zinc-400">
                  © 2026. bat box — Резервное энергоснабжение под ключ.
                </span>
                {isAdmin && (
                  <>
                    <span className="text-zinc-300">|</span>
                    <button
                      onClick={() => setCmsOpen(true)}
                      className="text-[10px] font-mono text-amber-600 hover:underline transition-colors"
                    >
                      CMS Панель
                    </button>
                    <span className="text-zinc-300">|</span>
                    <button
                      onClick={() => {
                        setIsAdmin(false);
                        localStorage.removeItem('genbox_is_admin');
                        setCmsOpen(false);
                      }}
                      className="text-[10px] font-mono text-red-500 hover:underline transition-colors font-semibold"
                    >
                      Выйти
                    </button>
                  </>
                )}
              </div>
            </div>
          </footer>

        </div>

        {/* CMS DRAWER SIDE PANEL COLLAPSIBLE */}
        <div
          className={`fixed top-0 right-0 h-screen w-full md:w-[380px] z-50 transform transition-transform duration-500 ease-in-out ${
            cmsOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {cmsOpen && (
            <CmsPanel
              content={content}
              onUpdateContent={handleUpdateContent}
              onResetContent={handleResetContent}
              onClose={() => setCmsOpen(false)}
            />
          )}
        </div>

      </div>
    </div>
  );
}
