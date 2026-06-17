/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GeneratorModel } from '../types';
import { Eye, ShieldAlert, Zap, Cpu } from 'lucide-react';

interface GeneratorRendererProps {
  generator: GeneratorModel;
  selectedStrap: string; // Used as Door Style: "standard", "heavy-duty", "vented"
  isBackView: boolean;   // true = internal mechanics (cross-section), false = external enclosure
  spinningSpeed: number; // 0 (stopped) to 5 (fast)
  customDialColor?: string; // used as box paint color override
}

export default function GeneratorRenderer({
  generator,
  selectedStrap,
  isBackView,
  spinningSpeed,
  customDialColor,
}: GeneratorRendererProps) {
  const [voltage, setVoltage] = useState(230);
  const [frequency, setFrequency] = useState(50.0);
  const [pulse, setPulse] = useState(false);

  // Real-time stat fluctuation to look highly technical and alive (cyber-physics)
  useEffect(() => {
    if (spinningSpeed === 0) {
      setVoltage(0);
      setFrequency(0.0);
      return;
    }

    const interval = setInterval(() => {
      // Small fluctuation around standard 230V and 50Hz when running
      setVoltage(Math.floor(228 + Math.random() * 4));
      setFrequency(parseFloat((49.8 + Math.random() * 0.4).toFixed(2)));
      setPulse((p) => !p);
    }, 800);

    return () => clearInterval(interval);
  }, [spinningSpeed]);

  const boxColor = customDialColor || generator.accentColor;

  return (
    <div id="generator-stage" className="relative flex flex-col items-center justify-center p-3">
      <div className="relative w-[340px] h-[380px] flex items-center justify-center">
        
        {/* Soft atmospheric backlight glowing dynamically behind */}
        <div
          className="absolute w-[240px] h-[240px] rounded-full blur-[60px] opacity-40 transition-all duration-1000 -z-10 pointer-events-none"
          style={{
            backgroundColor: spinningSpeed > 0 ? boxColor : '#1e293b',
          }}
        />

        <svg
          viewBox="0 0 320 380"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Box paint gradient base */}
            <linearGradient id="box-paint" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={boxColor} />
              <stop offset="60%" stopColor={boxColor} />
              <stop offset="100%" stopColor="#0a0a0d" />
            </linearGradient>

            {/* Brushed steel metallic texture for air vents & latch locks */}
            <linearGradient id="metal-sheen" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Soundproof foam internal texture with honeycomb pattern */}
            <pattern id="soundproof-foam" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 10 0 L 5 8 Z" fill="#1c1d22" stroke="#2a2b33" strokeWidth="0.5" />
            </pattern>

            {/* Glowing neon current arrows */}
            <linearGradient id="energy-glow" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
            
            <radialGradient id="engine-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>

            <linearGradient id="brass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="40%" stopColor="#d97706" />
              <stop offset="70%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            <linearGradient id="glass-reflection" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="31%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* HEAVY FOUNDATION / ANTI-VIBRATION RUBBER FLOOR FOOTINGS */}
          <g id="generator-foundation">
            {/* Rubber shock absorbers */}
            <rect x="50" y="320" width="40" height="16" rx="3" fill="#090a0f" />
            <rect x="230" y="320" width="40" height="16" rx="3" fill="#090a0f" />
            {/* Steel under-skid platform */}
            <rect x="35" y="312" width="250" height="10" rx="2" fill="#1e293b" stroke="#000" strokeWidth="1" />
          </g>

          {/* MAIN STAGE ANIMATED SWAP (EXTERNAL COVER VS INSIDE CALIBER DIAGRAM) */}
          <AnimatePresence mode="wait">
            {!isBackView ? (
              /* OUTSIDE VIEW: PREMIUM STEEL ALL-WEATHER SHELTER BOX */
              <motion.g
                key="box-exterior"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="cursor-pointer"
              >
                {/* Heavy-duty primary metal containment box body */}
                <rect
                  x="40"
                  y="60"
                  width="240"
                  height="254"
                  rx="10"
                  fill="url(#box-paint)"
                  stroke="#121318"
                  strokeWidth="2.5"
                />

                {/* Left & Right stainless hinges */}
                <rect x="37" y="100" width="6" height="30" rx="2" fill="url(#metal-sheen)" />
                <rect x="37" y="220" width="6" height="30" rx="2" fill="url(#metal-sheen)" />

                {/* Intake Air Louvers (Вентиляционная решетка) */}
                <g id="box-ventilation-grills">
                  {/* Outer rim */}
                  <rect x="65" y="110" width="55" height="150" rx="4" fill="#0d0e12" stroke="#24252e" strokeWidth="1" />
                  {/* Slats */}
                  {[122, 138, 154, 170, 186, 202, 218, 234, 250].map((y, i) => (
                    <motion.rect
                      key={i}
                      x="70"
                      y={y}
                      width="45"
                      height="5"
                      rx="1"
                      fill="#1e293b"
                      animate={spinningSpeed > 0 ? {
                        opacity: [0.9, 0.4, 0.9]
                      } : {}}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        delay: i * 0.15
                      }}
                    />
                  ))}
                  {/* Animated air currents drawing in (airflow visual specs) */}
                  {spinningSpeed > 0 && (
                    <g id="intake-lines">
                      <motion.line
                        x1="45" y1="140" x2="65" y2="140"
                        stroke="#01dedd" strokeWidth="1.5" strokeDasharray="3 3"
                        animate={{ x2: [45, 65], opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      />
                      <motion.line
                        x1="35" y1="180" x2="65" y2="180"
                        stroke="#01dedd" strokeWidth="1.5" strokeDasharray="3 3"
                        animate={{ x2: [35, 65], opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      />
                      <motion.line
                        x1="45" y1="220" x2="65" y2="220"
                        stroke="#01dedd" strokeWidth="1.5" strokeDasharray="3 3"
                        animate={{ x2: [45, 65], opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      />
                    </g>
                  )}
                </g>

                {/* Recessed Heavy-Duty Dual Door Handles & Lock Cylinders */}
                <rect x="155" y="160" width="18" height="45" rx="2" fill="#0d0e12" />
                <rect x="159" y="165" width="10" height="25" rx="1" fill="url(#metal-sheen)" />
                <circle cx="164" cy="200" r="2.5" fill="#111" /> {/* Keyhole */}

                {/* DIGITAL MONITORING LCD DISPLAY (Live telemetrics) */}
                <g id="monitoring-screen">
                  {/* Bezel */}
                  <rect x="150" y="80" width="112" height="52" rx="4" fill="#181920" stroke="#333" strokeWidth="1.5" />
                  {/* Screen LCD glass background */}
                  <rect x="154" y="84" width="104" height="44" rx="2" fill={spinningSpeed > 0 ? '#021e1a' : '#111215'} />
                  
                  {spinningSpeed > 0 ? (
                    <g id="screen-glowing-values">
                      {/* Grid design paper */}
                      <line x1="154" y1="106" x2="258" y2="106" stroke="#043d35" strokeWidth="0.5" strokeDasharray="2 2" />
                      <line x1="206" y1="84" x2="206" y2="128" stroke="#043d35" strokeWidth="0.5" strokeDasharray="2 2" />
                      
                      {/* STATS */}
                      <text x="160" y="99" fill="#10B981" fontFamily='"JetBrains Mono", monospace' fontSize="11" fontWeight="bold">
                        {voltage} V
                      </text>
                      <text x="160" y="112" fill="#10B981" fontFamily='"JetBrains Mono", monospace' fontSize="9">
                        {frequency} Hz
                      </text>
                      <text x="160" y="124" fill="#10B981" fontFamily='"JetBrains Mono", monospace' fontSize="8">
                        СЕТЬ: АКТИВ
                      </text>
                      
                      {/* Animated sinus wave mini oscilloscope graph */}
                      <path
                        d={`M 214,106 Q 220,${pulse ? 94 : 118} 226,106 T 238,106 T 250,106`}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="1.2"
                      />
                    </g>
                  ) : (
                    <g opacity="0.4">
                      <text x="170" y="110" fill="#94a3b8" fontFamily='"JetBrains Mono", monospace' fontSize="9">
                        СИСТЕМЫ: OFF
                      </text>
                    </g>
                  )}
                </g>

                {/* Premium Branding Badge ("ГЕН-БОКС") */}
                <g transform="translate(190, 240)">
                  <rect x="-30" y="-12" width="60" height="24" rx="1" fill="#111216" stroke={boxColor} strokeWidth="1" />
                  <text x="0" y="4" textAnchor="middle" fill="#fff" fontFamily='"Space Grotesk", sans-serif' fontWeight="900" fontSize="8" letterSpacing="1">
                    GEN-BOX
                  </text>
                </g>

                {/* Hot Exhaust Outlet pipe on top-right (Animated gas plumes) */}
                <path d="M 235,60 L 235,46 L 247,46 L 247,60 Z" fill="url(#metal-sheen)" />
                {spinningSpeed > 0 && (
                  <g id="exhaust-smoke">
                    <motion.circle
                      cx="241" cy="38" r="4" fill="#a1a1aa" opacity="0.4"
                      animate={{ y: [-10, -35], x: [0, 10], scale: [1, 2.5], opacity: [0.6, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    />
                    <motion.circle
                      cx="241" cy="38" r="5" fill="#a1a1aa" opacity="0.3"
                      animate={{ y: [-5, -25], x: [0, -6], scale: [1, 2], opacity: [0.5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.9, delay: 0.4 }}
                    />
                  </g>
                )}
              </motion.g>
            ) : (
              /* INTERNAL CROSS-SECTION: GENERATING MACHINE AND CONTROLLER ENGINE */
              <motion.g
                key="box-interior-cross"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
              >
                {/* Internal container outline (The shell we look through) */}
                <rect
                  x="40"
                  y="60"
                  width="240"
                  height="254"
                  rx="10"
                  fill="url(#soundproof-foam)"
                  stroke={boxColor}
                  strokeWidth="2.5"
                  opacity="0.95"
                />

                {/* Outer Sound insulation padding sheet visualization on walls */}
                <rect x="42" y="62" width="236" height="15" fill="#ffbc00" opacity="0.25" strokeDasharray="2 2" />
                <rect x="42" y="62" width="15" height="250" fill="#ffbc00" opacity="0.25" strokeDasharray="2 2" />
                <rect x="263" y="62" width="15" height="250" fill="#ffbc00" opacity="0.25" strokeDasharray="2 2" />

                {/* COMBUSTION ENGINE BLOCK (Core system engine) */}
                <g id="engine-block" transform="translate(56, 170)">
                  {/* Crankcase cylinder base */}
                  <rect x="25" y="40" width="80" height="70" rx="4" fill="url(#engine-grad)" stroke="#111" strokeWidth="1.5" />
                  {/* Cylinder head valve cover */}
                  <rect x="35" y="22" width="60" height="18" rx="2" fill="#475569" stroke="#111" />
                  {/* High tension distributor wires */}
                  <path d="M 65,22 Q 55,5 90,8" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                  <path d="M 65,22 Q 45,5 90,15" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                  
                  {/* Heavy-duty steel radiator system (cooling block) */}
                  <rect x="10" y="25" width="15" height="85" fill="#1e293b" stroke="#000" />
                  {/* Alternator belt and flywheel spinning in real-time */}
                  <motion.g
                    id="engine-pulley"
                    animate={spinningSpeed > 0 ? {
                      rotate: 360
                    } : {}}
                    transition={{
                      repeat: Infinity,
                      duration: spinningSpeed > 0 ? 1.5 / spinningSpeed : 999999,
                      ease: "linear"
                    }}
                    style={{ originX: '110px', originY: '75px' }}
                  >
                    <circle cx="110" cy="75" r="16" fill="#1e293b" stroke="#000" strokeWidth="2" />
                    <line x1="94" y1="75" x2="126" y2="75" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="110" y1="59" x2="110" y2="91" stroke="#94a3b8" strokeWidth="1.5" />
                    <circle cx="110" cy="75" r="5" fill="url(#metal-sheen)" />
                  </motion.g>
                </g>

                {/* COOLING FAN ASSEMBLY ON RADIATOR (Dynamic Spinning) */}
                <g id="radiator-fan" transform="translate(66, 195)">
                  {/* Fan shroud rim */}
                  <circle cx="10" cy="10" r="28" fill="none" stroke="#5d6b7e" strokeWidth="1.5" opacity="0.5" />
                  
                  <motion.g
                    id="fan-blades"
                    animate={spinningSpeed > 0 ? {
                      rotate: -360
                    } : {}}
                    transition={{
                      repeat: Infinity,
                      duration: spinningSpeed > 0 ? 0.8 / spinningSpeed : 999999,
                      ease: "linear"
                    }}
                    style={{ originX: '10px', originY: '10px' }}
                  >
                    {/* 4 propeller blades */}
                    <path d="M 10,10 L 10,-12 C 14,-10 14,0 10,10 Z" fill="#ef4444" />
                    <path d="M 10,10 L 10,32 C 6,30 6,20 10,10 Z" fill="#ef4444" />
                    <path d="M 10,10 L -12,10 C -10,14 0,14 10,10 Z" fill="#ef4444" />
                    <path d="M 10,10 L 32,10 C 30,6 20,6 10,10 Z" fill="#ef4444" />
                    
                    <circle cx="10" cy="10" r="5" fill="#e2e8f0" stroke="#111" />
                  </motion.g>
                </g>

                {/* ELECTROMAGNETIC ALTERNATOR GENERATOR (Where electricity is generated) */}
                <g id="alternator-housing" transform="translate(160, 205)">
                  {/* Cooper winding slots casing */}
                  <rect x="0" y="5" width="75" height="70" rx="3" fill="#111216" stroke="#475569" strokeWidth="1.5" />
                  
                  {/* Glowing copper wiring coils coils representing actual electrical field */}
                  <g opacity={spinningSpeed > 0 ? 0.9 : 0.4}>
                    <rect x="5" y="15" width="16" height="50" fill="url(#brass-grad)" rx="1" />
                    <rect x="25" y="15" width="16" height="50" fill="url(#brass-grad)" rx="1" />
                    <rect x="45" y="15" width="16" height="50" fill="url(#brass-grad)" rx="1" />
                    {/* Golden sparkles and wires mapping */}
                    <line x1="10" y1="15" x2="10" y2="65" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 3" />
                    <line x1="30" y1="15" x2="30" y2="65" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 3" />
                    <line x1="50" y1="15" x2="50" y2="65" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 3" />
                  </g>
                  
                  {/* Spark terminal output box on top of Alternator */}
                  <rect x="20" y="-10" width="30" height="15" rx="1" fill="#334155" stroke="#111" />
                  <circle cx="35" cy="-2" r="3" fill="#01dedd" className="animate-ping" style={{ animationDuration: '2s' }} />
                </g>

                {/* SYSTEM ATS PANEL SHIELD (Шкаф АВР - Автоматический ввод резерва) */}
                <g id="internal-ats-shield">
                  {/* Sealed control cabinet on wall */}
                  <rect x="175" y="85" width="70" height="85" rx="3" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                  <rect x="179" y="89" width="62" height="77" fill="#1e293b" />
                  
                  {/* Internal digital relay modules, contactors and circuit breakers */}
                  <rect x="185" y="98" width="16" height="20" fill="#111317" />
                  <rect x="189" y="102" width="8" height="12" fill="#10b981" /> {/* digital display */}
                  
                  {/* Contactor units */}
                  <rect x="208" y="98" width="12" height="15" fill="#ef4444" />
                  <rect x="224" y="98" width="12" height="15" fill="#f59e0b" />
                  
                  {/* Wiring outputs going down to engine & alternator and connector rail */}
                  <path d="M 210,135 L 210,185" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="2 2" />
                  <path d="M 220,135 L 220,205" fill="none" stroke="#e11d48" strokeWidth="2" />
                  <path d="M 230,135 L 230,225" fill="none" stroke="#3b82f6" strokeWidth="2" />
                </g>

                {/* GLOWING RAYS OF ELECTRICITY (When running generator is active) */}
                {spinningSpeed > 0 && (
                  <g id="electricity-sparkles-conduits">
                    <line x1="220" y1="205" x2="250" y2="240" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="5 5" className="animate-pulse" />
                    
                    {/* Radial waves expanding from alternator center */}
                    <circle cx="200" cy="240" r="30" fill="none" stroke="#ef4444" strokeWidth="0.8" opacity="0.3" className="animate-ping" style={{ animationDuration: '3s' }} />
                    <circle cx="200" cy="240" r="45" fill="none" stroke="#eab308" strokeWidth="0.8" opacity="0.2" className="animate-ping" style={{ animationDuration: '5s' }} />
                  </g>
                )}

                {/* Ruby shock cushion dots for aesthetics */}
                <circle cx="106" cy="308" r="4.5" fill="#e11d48" stroke="#111" />
                <circle cx="216" cy="308" r="4.5" fill="#e11d48" stroke="#111" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* GLASS REFLECTIONS GLOSS SURFACE (Adds professional product depth) */}
          <rect
            x="48"
            y="68"
            width="224"
            height="238"
            rx="6"
            fill="url(#glass-reflection)"
            className="pointer-events-none"
          />
        </svg>
      </div>

      {/* Real-time generator status labels */}
      <div className="flex items-center gap-4 mt-1 font-mono text-xs">
        <span className="flex items-center gap-1 text-zinc-400">
          <Eye size={13} />
          {isBackView ? 'Акустический разрез' : 'Внешний кожух'}
        </span>
        <span className="text-zinc-650">|</span>
        <span className="flex items-center gap-1 text-zinc-400">
          <Cpu size={13} className={spinningSpeed > 0 ? 'text-emerald-500 animate-spin' : ''} style={{ animationDuration: '6s' }} />
          {spinningSpeed > 0 ? `Обороты двигателя: ${spinningSpeed * 1200} об/мин` : 'Стоп-сегмент'}
        </span>
      </div>
    </div>
  );
}
