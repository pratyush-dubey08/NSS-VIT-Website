'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Briefcase, GraduationCap, ExternalLink, Building2, Sparkles, Globe, Compass, ArrowRight } from 'lucide-react';
import { IAlumnus } from '@/data/alumni';

interface AlumniMapProps {
  alumni: IAlumnus[];
}

interface HubInfo {
  id: string;
  name: string;
  state: string;
  count: number;
  // Position as percentage on India map SVG container (X: 0 to 100%, Y: 0 to 100%)
  x: number;
  y: number;
  highlightColor: string;
  accentGradient: string;
  description: string;
}

const HUBS: HubInfo[] = [
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka (Tech & Aerospace Hub)',
    count: 4,
    x: 43,
    y: 74,
    highlightColor: '#2563EB',
    accentGradient: 'from-blue-600 to-indigo-600',
    description: 'Silicon Valley of India — Airbus & Novome Technologies Engineering Centers'
  },
  {
    id: 'noida',
    name: 'Noida / Delhi-NCR',
    state: 'Uttar Pradesh & Delhi NCR',
    count: 3,
    x: 41,
    y: 31,
    highlightColor: '#D32F2F',
    accentGradient: 'from-red-600 to-rose-600',
    description: 'National Capital Region — SD Biosensors, Novome HQ & FIREAI'
  },
  {
    id: 'pune',
    name: 'Pune & Mumbai',
    state: 'Maharashtra',
    count: 1,
    x: 32,
    y: 62,
    highlightColor: '#059669',
    accentGradient: 'from-emerald-600 to-teal-600',
    description: 'Western Tech Hub — LTIMindtree Global Solutions'
  },
  {
    id: 'bhopal',
    name: 'Bhopal / Central Hub',
    state: 'Madhya Pradesh',
    count: 2,
    x: 44,
    y: 49,
    highlightColor: '#D97706',
    accentGradient: 'from-amber-500 to-orange-600',
    description: 'Alma Mater Home Base — VIT Bhopal University & Research'
  },
  {
    id: 'dubai',
    name: 'Dubai (International)',
    state: 'United Arab Emirates',
    count: 1,
    x: 88,
    y: 22,
    highlightColor: '#8B5CF6',
    accentGradient: 'from-purple-600 to-indigo-600',
    description: 'Overseas Higher Studies — University of Birmingham Dubai'
  }
];

export default function AlumniMap({ alumni }: AlumniMapProps) {
  const [activeHubId, setActiveHubId] = useState<string>('all');

  const filteredAlumni = activeHubId === 'all' 
    ? alumni 
    : alumni.filter(a => a.mapHub === activeHubId);

  const activeHubInfo = HUBS.find(h => h.id === activeHubId);

  return (
    <section className="mb-20">
      <div className="bg-gradient-to-br from-[#0A192F] via-[#102446] to-[#0D1F3C] text-white rounded-[2.5rem] p-6 sm:p-10 lg:p-12 border border-blue-800/40 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Brand Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.8px,transparent_0.8px)] [background-size:28px_28px] opacity-[0.06] pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-wider mb-3">
            <Compass size={14} className="text-blue-400 animate-spin-slow" />
            <span>Interactive Alumni Footprint</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
            Where Are NSS Volunteers <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300">Making An Impact?</span>
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
            From India&apos;s leading technology clusters to premier global research hubs, explore the cities where our alumni carry forward the spirit of <span className="text-red-300 font-bold italic">&quot;Not Me But You&quot;</span>. Click any city to view the volunteers based there.
          </p>
        </div>

        {/* Filter Chips Bar */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 sm:gap-2.5 mb-8">
          <button
            onClick={() => setActiveHubId('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeHubId === 'all'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 ring-2 ring-red-400/50'
                : 'bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10'
            }`}
          >
            <Sparkles size={14} />
            <span>All Locations ({alumni.length})</span>
          </button>

          {HUBS.map((hub) => (
            <button
              key={hub.id}
              onClick={() => setActiveHubId(hub.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                activeHubId === hub.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/50'
                  : 'bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hub.highlightColor }} />
              <span>{hub.name}</span>
              <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-black">
                {hub.count}
              </span>
            </button>
          ))}
        </div>

        {/* Main Grid: Interactive Map (Left/Center) + Active Hub Details (Right) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Map Visual Container (lg:col-span-6) */}
          <div className="lg:col-span-6 bg-slate-900/70 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-inner">
            
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-red-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Geographic Presence Map
                </span>
              </div>
              <span className="text-[11px] text-gray-400">
                Click pins to filter
              </span>
            </div>

            {/* India Vector Map Container with Absolute Positioned Markers */}
            <div className="relative w-full aspect-[4/5] max-w-[480px] mx-auto select-none">
              
              {/* Stylized Vector SVG of India Map Contours */}
              <svg 
                viewBox="0 0 600 700" 
                className="w-full h-full filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Subtle Map Mesh Gradient */}
                  <linearGradient id="indiaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#0F274E" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#0B192C" stopOpacity="0.5" />
                  </linearGradient>

                  <linearGradient id="contourGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#F87171" stopOpacity="0.5" />
                  </linearGradient>

                  <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Topographic Background Grids */}
                <path d="M 0 100 L 600 100 M 0 200 L 600 200 M 0 300 L 600 300 M 0 400 L 600 400 M 0 500 L 600 500 M 0 600 L 600 600" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1" strokeDasharray="3,3" />
                <path d="M 100 0 L 100 700 M 200 0 L 200 700 M 300 0 L 300 700 M 400 0 L 400 700 M 500 0 L 500 700" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1" strokeDasharray="3,3" />

                {/* Stylized Accurate Poly-Path Representation of Indian Subcontinent Coastline & Landmass */}
                <path
                  d="
                    M 255 45
                    C 275 35, 295 40, 310 58
                    C 325 75, 335 105, 315 130
                    C 300 150, 330 160, 370 170
                    C 410 180, 455 185, 490 190
                    C 525 195, 545 220, 520 240
                    C 490 255, 470 270, 480 290
                    C 490 310, 460 325, 440 315
                    C 420 305, 395 320, 385 340
                    C 375 360, 415 390, 420 420
                    C 425 450, 385 500, 360 540
                    C 340 575, 325 610, 305 645
                    C 295 660, 285 660, 275 640
                    C 255 600, 235 565, 220 530
                    C 200 485, 185 450, 200 420
                    C 215 390, 185 365, 160 350
                    C 130 330, 95 350, 90 380
                    C 85 410, 125 415, 150 405
                    C 165 400, 180 430, 190 470
                    C 175 440, 150 420, 120 410
                    C 90 400, 75 350, 105 320
                    C 135 290, 160 260, 150 220
                    C 140 180, 180 160, 210 145
                    C 230 135, 245 95, 255 45
                    Z
                  "
                  fill="url(#indiaGrad)"
                  stroke="url(#contourGrad)"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />

                {/* Connection lines from central India (VIT Bhopal Alma Mater) radiating to other hubs */}
                <line x1="264" y1="343" x2="246" y2="217" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4,4" strokeOpacity="0.6" className="animate-pulse" />
                <line x1="264" y1="343" x2="258" y2="518" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4,4" strokeOpacity="0.6" className="animate-pulse" />
                <line x1="264" y1="343" x2="192" y2="434" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4,4" strokeOpacity="0.6" className="animate-pulse" />
                <line x1="264" y1="343" x2="528" y2="154" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="4,4" strokeOpacity="0.6" className="animate-pulse" />

                {/* Alma Mater Central Core Wave */}
                <circle cx="264" cy="343" r="22" fill="url(#hubGlow)" className="animate-ping" style={{ animationDuration: '3s' }} />
                <circle cx="264" cy="343" r="7" fill="#F59E0B" stroke="#ffffff" strokeWidth="2" />
                <text x="278" y="347" fill="#FDE68A" fontSize="12" fontWeight="bold">Bhopal (Alma Mater)</text>
              </svg>

              {/* DOM Markers for each Hub with Rich Tooltips and Radar Pings */}
              {HUBS.map((hub) => {
                const isSelected = activeHubId === hub.id;
                return (
                  <div
                    key={hub.id}
                    onClick={() => setActiveHubId(hub.id)}
                    style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                  >
                    {/* Glowing Pulse Rings */}
                    <span 
                      className="absolute -inset-2 rounded-full animate-ping opacity-75 pointer-events-none"
                      style={{ backgroundColor: hub.highlightColor, animationDuration: isSelected ? '1.5s' : '3s' }}
                    />
                    
                    {/* Pin Circle */}
                    <div 
                      className={`relative flex items-center justify-center rounded-full text-white font-black shadow-xl transition-all duration-300 ${
                        isSelected 
                          ? 'w-10 h-10 ring-4 ring-white scale-125 z-30' 
                          : 'w-7 h-7 sm:w-8 sm:h-8 hover:scale-115 ring-2 ring-white/60'
                      }`}
                      style={{ backgroundColor: hub.highlightColor }}
                    >
                      <span className="text-[11px] sm:text-xs">{hub.count}</span>
                    </div>

                    {/* City Label Badge */}
                    <div 
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2.5 py-1 rounded-md text-[11px] font-black whitespace-nowrap shadow-xl transition-all duration-200 pointer-events-none ${
                        isSelected 
                          ? 'bg-white text-slate-900 ring-2 ring-blue-500 scale-105' 
                          : 'bg-slate-900/90 text-gray-200 border border-white/20 group-hover:scale-105'
                      }`}
                    >
                      {hub.name.split(' ')[0]}
                    </div>
                  </div>
                );
              })}

              {/* International Hub Floating Inset Card (Dubai) */}
              <div 
                onClick={() => setActiveHubId('dubai')}
                className={`absolute top-2 right-2 p-2.5 sm:p-3 rounded-2xl border backdrop-blur-md cursor-pointer transition-all duration-200 ${
                  activeHubId === 'dubai'
                    ? 'bg-purple-900/90 border-purple-400 ring-2 ring-purple-400 shadow-xl'
                    : 'bg-slate-800/80 border-purple-500/30 hover:border-purple-400/70 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 text-purple-300 text-[10px] font-black uppercase">
                  <Globe size={12} className="text-purple-400" />
                  <span>Global Hub</span>
                </div>
                <div className="text-xs sm:text-sm font-black text-white">Dubai, UAE</div>
                <div className="text-[10px] text-gray-300">Univ. of Birmingham</div>
              </div>
            </div>

            {/* Bottom Quick Hub Legend */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Tech & Aerospace (Airbus, Novome)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Global Higher Studies</span>
              </div>
            </div>
          </div>

          {/* Active Hub Alumni Spotlight Panel (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Header of Active Hub */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-0.5">
                  {activeHubInfo ? activeHubInfo.state : 'Pan-India & International'}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>{activeHubInfo ? activeHubInfo.name : 'All Active Locations'}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    {filteredAlumni.length} {filteredAlumni.length === 1 ? 'Volunteer' : 'Volunteers'}
                  </span>
                </h3>
                {activeHubInfo && (
                  <p className="text-xs text-gray-300 mt-1">
                    {activeHubInfo.description}
                  </p>
                )}
              </div>

              {activeHubId !== 'all' && (
                <button
                  onClick={() => setActiveHubId('all')}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  View All
                </button>
              )}
            </div>

            {/* Alumni Cards Stack for Selected Hub */}
            <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-blue-600/40 scrollbar-track-transparent">
              <AnimatePresence mode="popLayout">
                {filteredAlumni.map((alumnus) => (
                  <motion.div
                    key={alumnus.name}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white/95 text-slate-900 rounded-2xl p-4 sm:p-5 border border-blue-200/60 shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    {/* Alumnus Identity */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-blue-900/20 shrink-0 shadow-md">
                        <img 
                          src={alumnus.photoUrl} 
                          alt={alumnus.name}
                          className="w-full h-full object-cover object-[center_top]"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alumnus.name)}&background=EFF6FF&color=1D4ED8&bold=true`;
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-base sm:text-lg font-black text-gray-900 truncate group-hover:text-nss-blue transition-colors">
                            {alumnus.name}
                          </h4>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 shrink-0">
                            Batch &apos;{alumnus.batch.slice(-2)}
                          </span>
                        </div>

                        {/* Company / Designation */}
                        <div className="text-xs font-bold text-gray-700 flex items-center gap-1.5 truncate">
                          {alumnus.status === 'Placed' ? (
                            <Building2 size={13} className="text-blue-600 shrink-0" />
                          ) : (
                            <GraduationCap size={13} className="text-purple-600 shrink-0" />
                          )}
                          <span className="truncate">{alumnus.company || 'Higher Studies'}</span>
                        </div>

                        {alumnus.designation && (
                          <div className="text-[11px] text-gray-500 truncate mt-0.5">
                            {alumnus.designation}
                          </div>
                        )}

                        <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 mt-1">
                          <MapPin size={11} className="text-red-500 shrink-0" />
                          <span>{alumnus.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action / LinkedIn Link */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                      {alumnus.linkedin ? (
                        <a
                          href={alumnus.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shadow-2xs"
                        >
                          <span>Connect</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-[11px] font-bold text-gray-400 italic">
                          Alumni Member
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Quick Impact Metrics Banner */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-xl sm:text-2xl font-black text-blue-400">11+</div>
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Spotlights</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-xl sm:text-2xl font-black text-rose-400">5</div>
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Hubs</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-xl sm:text-2xl font-black text-amber-400">100%</div>
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Excellence</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
