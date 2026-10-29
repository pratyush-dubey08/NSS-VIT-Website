'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Briefcase, GraduationCap, ExternalLink, Globe, Sparkles, Building2, User } from 'lucide-react';
import { IAlumnus } from '@/data/alumni';
import indiaMapData from '@/data/indiaMapData.json';

interface AlumniMapProps {
  alumni: IAlumnus[];
}

interface PinLocation {
  id: string;
  name: string;
  state: string;
  // Precise pixel coordinates inside 612 x 696 viewBox of the real India map
  x: number;
  y: number;
  color: string;
  badgeBg: string;
  names: string[];
  keyHighlight: string;
  isOverseas?: boolean;
}

const PIN_LOCATIONS: PinLocation[] = [
  {
    id: 'noida',
    name: 'Noida / Delhi-NCR',
    state: 'Uttar Pradesh & Delhi NCR',
    x: 195,
    y: 212,
    color: '#EF4444', // Red
    badgeBg: 'bg-red-500',
    names: ['Rishabh Kabra', 'Shreya Gupta'],
    keyHighlight: 'Novome Technologies • SD Biosensors • FIREAI'
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    x: 196,
    y: 565,
    color: '#3B82F6', // Blue
    badgeBg: 'bg-blue-600',
    names: ['Nitank Dasondi', 'Ayush Saxena', 'Omanshi Kaushal', 'Ayush Raj', 'Mukesh Kumar Ghosh'],
    keyHighlight: 'Airbus • Novome Technologies • MSRUAS'
  },
  {
    id: 'pune',
    name: 'Pune & Mumbai',
    state: 'Maharashtra',
    x: 142,
    y: 435,
    color: '#10B981', // Emerald
    badgeBg: 'bg-emerald-600',
    names: ['Tanishk Agarwal'],
    keyHighlight: 'LTIMINDTREE (SDE)'
  },
  {
    id: 'bhopal',
    name: 'Bhopal (Alma Mater Base)',
    state: 'Madhya Pradesh',
    x: 212,
    y: 335,
    color: '#F59E0B', // Amber
    badgeBg: 'bg-amber-500',
    names: ['Sudarshan Chandravanshi', 'Ambika Sharma'],
    keyHighlight: 'VIT Bhopal University & Higher Research'
  },
  {
    id: 'dubai',
    name: 'Dubai, UAE (Overseas)',
    state: 'International Hub',
    x: 65,
    y: 110,
    color: '#8B5CF6', // Purple
    badgeBg: 'bg-purple-600',
    names: ['Harshit Parwal'],
    keyHighlight: 'University of Birmingham Dubai (Master\'s)',
    isOverseas: true
  }
];

export default function AlumniMap({ alumni }: AlumniMapProps) {
  const [selectedPinId, setSelectedPinId] = useState<string>('all');
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

  // Active pin or hovered pin
  const activePin = PIN_LOCATIONS.find(p => p.id === (hoveredPinId || (selectedPinId !== 'all' ? selectedPinId : null)));

  // Filtered alumni for active view
  const activeAlumni = selectedPinId === 'all'
    ? (hoveredPinId ? alumni.filter(a => a.mapHub === hoveredPinId) : alumni)
    : alumni.filter(a => a.mapHub === selectedPinId);

  // States where our alumni are based to highlight gently
  const highlightedStateIds = ['dl', 'up', 'ka', 'mh', 'mp'];

  return (
    <section className="mb-20">
      <div className="bg-gradient-to-b from-[#0B1528] via-[#0F1E38] to-[#0A1324] text-white rounded-[2.5rem] p-5 sm:p-8 lg:p-12 border border-blue-900/40 shadow-2xl relative overflow-hidden">
        
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
        
        {/* Header */}
        <div className="relative z-10 text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/25 text-blue-300 text-xs font-black uppercase tracking-wider mb-2.5">
            <MapPin size={13} className="text-red-400 animate-pulse" />
            <span>Pan-India Alumni Footprint</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
            Where Are Our Volunteers <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300">Located?</span>
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            Direct geographic pinpoint map showing the locations and organizations of our graduated NSS leaders. Tap any pin to see the volunteers based there.
          </p>
        </div>

        {/* Quick Filter Buttons */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedPinId('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              selectedPinId === 'all'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-400/50'
                : 'bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10'
            }`}
          >
            <Sparkles size={12} />
            <span>Show All ({alumni.length})</span>
          </button>

          {PIN_LOCATIONS.map((loc) => {
            const isSelected = selectedPinId === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => setSelectedPinId(isSelected ? 'all' : loc.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/50'
                    : 'bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: loc.color }} />
                <span>{loc.name.split(' ')[0]}</span>
                <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-black">
                  {loc.names.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Real India Map Canvas */}
        <div className="relative z-10 max-w-4xl mx-auto bg-slate-950/60 backdrop-blur-md rounded-3xl p-3 sm:p-6 border border-blue-500/20 shadow-2xl">
          
          <div className="relative w-full aspect-[612/696] max-w-[620px] mx-auto select-none">
            
            {/* The Authentic Complete India Map Vector SVG */}
            <svg
              viewBox="0 0 612 696"
              className="w-full h-full filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.6)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="normalStateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
                </linearGradient>

                <linearGradient id="activeStateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.6" />
                </linearGradient>

                <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Render all authentic states of India */}
              <g id="india-states">
                {indiaMapData.locations.map((loc) => {
                  const isAlumniState = highlightedStateIds.includes(loc.id);
                  return (
                    <path
                      key={loc.id}
                      d={loc.path}
                      fill={isAlumniState ? 'url(#activeStateGrad)' : 'url(#normalStateGrad)'}
                      stroke={isAlumniState ? '#60A5FA' : '#334155'}
                      strokeWidth={isAlumniState ? '1.2' : '0.6'}
                      strokeOpacity={isAlumniState ? 0.9 : 0.6}
                      className="transition-colors duration-300 hover:fill-blue-800/40"
                    >
                      <title>{loc.name}</title>
                    </path>
                  );
                })}
              </g>

              {/* Dashed Flight Arc from Gujarat coast to Overseas Dubai */}
              <path
                d="M 65 110 Q 90 260 135 320"
                fill="none"
                stroke="#A855F7"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                strokeOpacity="0.7"
                className="animate-pulse"
              />
              <text x="65" y="132" fill="#C084FC" fontSize="10" fontWeight="bold">Flight corridor to Dubai</text>

              {/* Connecting lines from Bhopal Alma Mater to Noida & Bengaluru */}
              <line x1="212" y1="335" x2="195" y2="212" stroke="#EF4444" strokeWidth="1.2" strokeDasharray="3,3" strokeOpacity="0.5" />
              <line x1="212" y1="335" x2="196" y2="565" stroke="#3B82F6" strokeWidth="1.2" strokeDasharray="3,3" strokeOpacity="0.5" />
              <line x1="212" y1="335" x2="142" y2="435" stroke="#10B981" strokeWidth="1.2" strokeDasharray="3,3" strokeOpacity="0.5" />
            </svg>

            {/* DIRECT PINPOINTS WITH VOLUNTEER NAMES ON THE MAP */}
            {PIN_LOCATIONS.map((loc) => {
              // Convert 612x696 coordinates to percentage
              const leftPercent = (loc.x / 612) * 100;
              const topPercent = (loc.y / 696) * 100;
              const isSelected = selectedPinId === loc.id;
              const isHovered = hoveredPinId === loc.id;
              const isActive = isSelected || isHovered;

              return (
                <div
                  key={loc.id}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  onMouseEnter={() => setHoveredPinId(loc.id)}
                  onMouseLeave={() => setHoveredPinId(null)}
                  onClick={() => setSelectedPinId(isSelected ? 'all' : loc.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group"
                >
                  {/* Radar Pulse Effect */}
                  <span
                    className="absolute -inset-2.5 rounded-full animate-ping opacity-60 pointer-events-none"
                    style={{ backgroundColor: loc.color }}
                  />

                  {/* Pin Circle Marker */}
                  <div
                    className={`relative flex items-center justify-center rounded-full text-white font-black shadow-2xl transition-all duration-300 ${
                      isActive
                        ? 'w-9 h-9 sm:w-11 sm:h-11 ring-4 ring-white scale-125 z-40'
                        : 'w-7 h-7 sm:w-8 sm:h-8 hover:scale-115 ring-2 ring-white/80'
                    }`}
                    style={{ backgroundColor: loc.color }}
                  >
                    {loc.isOverseas ? (
                      <Globe size={15} className="animate-spin-slow" />
                    ) : (
                      <MapPin size={15} className="fill-white" />
                    )}
                  </div>

                  {/* Pinpoint Label & Names Banner right next to the pin */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 mt-1 px-2.5 py-1 rounded-xl shadow-xl transition-all duration-200 pointer-events-none whitespace-nowrap z-30 flex flex-col items-center ${
                      isActive
                        ? 'bg-white text-slate-950 ring-2 ring-blue-500 scale-105'
                        : 'bg-slate-900/90 text-gray-200 border border-white/20 group-hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[11px] font-black">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: loc.color }} />
                      <span>{loc.name.split(' (')[0]}</span>
                      <span className="px-1 rounded bg-black/15 text-[10px] font-bold">
                        {loc.names.length}
                      </span>
                    </div>
                    {/* Volunteer Names Highlight Line */}
                    <div className={`text-[10px] font-bold ${isActive ? 'text-blue-900 font-black' : 'text-gray-300'}`}>
                      {loc.names.join(', ')}
                    </div>
                  </div>

                  {/* Instant Hover / Active Popup Card with Avatars & Company Details */}
                  {isActive && (
                    <div 
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 sm:w-72 bg-white text-slate-900 rounded-2xl p-3.5 shadow-2xl border-2 border-blue-500 z-50 pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between border-b pb-2 mb-2">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                            {loc.state}
                          </div>
                          <div className="text-sm font-black text-slate-900">
                            {loc.name}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">
                          {loc.names.length} {loc.names.length === 1 ? 'Volunteer' : 'Volunteers'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {alumni.filter(a => a.mapHub === loc.id).map(a => (
                          <div key={a.name} className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <img
                              src={a.photoUrl}
                              alt={a.name}
                              className="w-8 h-8 rounded-full object-cover object-[center_top] border border-blue-900/20 shrink-0"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=EFF6FF&color=1D4ED8&bold=true`;
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-black text-slate-900 truncate">{a.name}</div>
                              <div className="text-[10px] text-gray-600 truncate font-medium">
                                {a.company || a.designation || 'Alumni Member'}
                              </div>
                            </div>
                            {a.linkedin && (
                              <a
                                href={a.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="LinkedIn Profile"
                              >
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}

          </div>

          {/* Clean Legend at the bottom of the map */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-around gap-2 text-xs text-gray-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Noida / NCR (2)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Bengaluru (5)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Pune & Mumbai (1)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Bhopal / VIT Base (2)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Dubai, UAE (1)</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
