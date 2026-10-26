'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Sparkles,
  Trees,
  Heart,
  School,
  Theater,
  Globe2,
  Building2,
  Flag,
  UserCheck
} from 'lucide-react';
import { UNIT_MILESTONES, MilestoneDetail } from '@/data/unitMilestones';

export default function HighlightsPage() {
  // All cards start closed on page load as requested
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleCard = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'environment':
        return <Trees size={18} className="text-emerald-600" />;
      case 'health':
        return <Heart size={18} className="text-rose-600" />;
      case 'rural':
        return <School size={18} className="text-amber-600" />;
      case 'awareness':
        return <Theater size={18} className="text-indigo-600" />;
      case 'culture':
        return <Globe2 size={18} className="text-purple-600" />;
      default:
        return <Building2 size={18} className="text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 bg-gradient-to-b from-slate-50 via-blue-50/20 to-red-50/20 pb-24 overflow-hidden selection:bg-nss-blue selection:text-white font-sans relative">
      {/* Soft Blended Photography Watermark in Background */}
      <div className="fixed inset-0 pointer-events-none -z-30 opacity-[0.035] select-none overflow-hidden">
        <img src="/images/hero-nss-group.jpg" alt="" className="w-full h-full object-cover scale-105 filter blur-xs" />
      </div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      
      {/* Hero Section: Single-Line Heading, Clean & Compact */}
      <section className="relative pt-8 pb-4 sm:pt-12 sm:pb-6 text-center max-w-5xl mx-auto px-4">
        
        {/* Single Line Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight"
        >
          Unit Highlights & Flagship Initiatives
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto mt-2.5 leading-relaxed font-normal"
        >
          Discover our landmark community drives, rural development projects, and institutional leadership. Click any initiative below to explore its details.
        </motion.p>
      </section>

      {/* Cards List: Clean, Elegant, Uncongested Design */}
      <div className="container mx-auto px-4 max-w-4xl space-y-4 mt-8 sm:mt-12 relative z-10">
        {UNIT_MILESTONES.map((milestone) => {
          const isExpanded = expandedIds.includes(milestone.id);

          return (
            <motion.div
              key={milestone.id}
              id={milestone.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded 
                  ? 'border-blue-200 shadow-md ring-1 ring-blue-50' 
                  : 'border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {/* Clickable Card Header */}
              <div
                onClick={() => toggleCard(milestone.id)}
                className="p-4 sm:p-5 cursor-pointer select-none flex items-center justify-between gap-4 transition-colors hover:bg-slate-50/60"
              >
                {/* Left: Soft Icon Accent */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {getCategoryIcon(milestone.category)}
                </div>

                {/* Middle: Title, Subtitle & Key Metric Pill */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                      {milestone.title}
                    </h2>
                    
                    {/* Clean Subtle Highlight Tag */}
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60 whitespace-nowrap">
                      {milestone.highlightStat.value} {milestone.highlightStat.label}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 truncate">
                    {milestone.subtitle}
                  </p>
                </div>

                {/* Right: Subtle Chevron Indicator */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-200 ${
                  isExpanded 
                    ? 'bg-blue-50 border-blue-200 text-blue-600 rotate-180' 
                    : 'bg-slate-50 border-slate-200/70 text-slate-400'
                }`}>
                  <ChevronDown size={16} />
                </div>
              </div>

              {/* Expandable Body */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-4">
                      
                      {/* Mentors / Dignitaries Note if present */}
                      {milestone.dignitaries && milestone.dignitaries.length > 0 && (
                        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-wrap items-center gap-1.5">
                          <span className="font-bold text-slate-700 flex items-center gap-1">
                            <UserCheck size={13} className="text-blue-600" />
                            Key Guidance:
                          </span>
                          <span>{milestone.dignitaries.join(' • ')}</span>
                        </div>
                      )}

                      {/* Full Narrative Text */}
                      <div className="space-y-3 text-slate-600 text-sm leading-relaxed text-justify">
                        {milestone.paragraphs.map((p, pIdx) => (
                          <p key={pIdx}>
                            {p}
                          </p>
                        ))}
                      </div>

                      {/* Custom Feature Details (4 Themes of Nukkad Natak, 7 Themes of VIBGYOR, 5 Convocation Wings, Villages, etc.) */}
                      {milestone.customHighlights && (
                        <div className="pt-2">
                          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 mb-2.5">
                            {milestone.customHighlights.heading}
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {milestone.customHighlights.items.map((item, itIdx) => (
                              <div
                                key={itIdx}
                                className="p-3 rounded-xl bg-slate-50/70 border border-slate-100"
                              >
                                <div className="font-bold text-slate-900 text-sm mb-1">
                                  {item.title}
                                </div>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Motto Quote */}
                      {milestone.motto && (
                        <div className="text-xs text-blue-900/90 font-medium italic border-l-2 border-blue-500 pl-3 py-1">
                          {milestone.motto}
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
