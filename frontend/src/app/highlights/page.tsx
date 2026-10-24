'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  Flag,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown
} from 'lucide-react';
import { UNIT_MILESTONES } from '@/data/unitMilestones';

export default function HighlightsPage() {
  const [expandedIds, setExpandedIds] = useState<string[]>(['mega-tree-plantation-2024']);

  const toggleCard = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleExpandAll = () => {
    if (expandedIds.length === UNIT_MILESTONES.length) {
      setExpandedIds([]);
    } else {
      setExpandedIds(UNIT_MILESTONES.map(m => m.id));
    }
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 bg-slate-50/70 pb-24 overflow-hidden selection:bg-nss-blue selection:text-white font-sans">
      
      {/* Hero Section with Compact Spacing */}
      <section className="relative pt-6 pb-6 sm:pt-8 sm:pb-8 overflow-hidden text-center max-w-4xl mx-auto px-4">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-3 tracking-tight leading-[1.15]"
        >
          Unit Highlights & <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-nss-blue to-indigo-600">
            Flagship Initiatives
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Discover our landmark community drives, rural projects, and institutional leadership. Click on any card below to explore its full story.
        </motion.p>

        {/* Expand / Collapse All Toggle */}
        <div className="mt-5 flex justify-center">
          <button
            onClick={handleExpandAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs transition-all hover:shadow"
          >
            <ChevronsUpDown size={14} className="text-blue-600" />
            {expandedIds.length === UNIT_MILESTONES.length ? 'Collapse All Cards' : 'Expand All Cards'}
          </button>
        </div>
      </section>

      {/* Interactive Cards Showcase (Tightened Spacing & Cleaned Headers) */}
      <div className="container mx-auto px-4 max-w-5xl space-y-4 pt-2 relative z-10">
        {UNIT_MILESTONES.map((milestone, idx) => {
          const isExpanded = expandedIds.includes(milestone.id);

          return (
            <motion.div
              key={milestone.id}
              id={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: 0.02 * idx }}
              className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden ${
                isExpanded 
                  ? 'border-blue-300 shadow-xl shadow-blue-900/5 ring-1 ring-blue-100' 
                  : 'border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-200'
              }`}
            >
              {/* Clickable Card Header (Clean: No Date, No Venue, No Category Pill) */}
              <div
                onClick={() => toggleCard(milestone.id)}
                className="p-5 sm:p-7 cursor-pointer select-none transition-colors hover:bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6"
              >
                <div className="space-y-2 flex-1">
                  
                  {/* Index + 1-2 Clean Key Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                    {milestone.badges.slice(0, 2).map((b, bIdx) => (
                      <span key={bIdx} className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                      {milestone.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-blue-600 mt-1">
                      {milestone.subtitle}
                    </p>
                  </div>

                </div>

                {/* Right Side: Impact Stat & Toggle Button */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="px-4 py-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs text-center min-w-[130px]">
                    <span className="block text-xl sm:text-2xl font-black tracking-tight leading-none">
                      {milestone.highlightStat.value}
                    </span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-white/90 mt-1">
                      {milestone.highlightStat.label}
                    </span>
                  </div>

                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    isExpanded 
                      ? 'bg-blue-600 text-white border-blue-600 rotate-180' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600'
                  }`}>
                    <ChevronDown size={18} />
                  </div>
                </div>

              </div>

              {/* Expandable Accordion Body */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-8 pb-7 pt-3 border-t border-slate-100 space-y-5">
                      
                      {/* Dignitaries if available */}
                      {milestone.dignitaries && milestone.dignitaries.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center gap-2.5 text-xs">
                          <div className="inline-flex items-center gap-1.5 font-black uppercase tracking-wider text-slate-700 shrink-0">
                            <UserCheck size={14} className="text-blue-600" />
                            Key Dignitaries & Mentors:
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {milestone.dignitaries.map((dig, dIdx) => (
                              <span key={dIdx} className="px-2.5 py-0.5 rounded-md bg-white text-slate-800 font-bold border border-slate-200 text-xs shadow-2xs">
                                {dig}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Full Narrative Text */}
                      <div className="space-y-3.5 text-slate-700 text-sm sm:text-base leading-relaxed text-justify">
                        {milestone.paragraphs.map((p, pIdx) => (
                          <p key={pIdx}>
                            {p}
                          </p>
                        ))}
                      </div>

                      {/* Custom Feature Grid (4 Themes of Nukkad Natak, 7 Themes of VIBGYOR, 5 Convocation Wings, Villages, etc.) */}
                      {milestone.customHighlights && (
                        <div className="pt-3 border-t border-slate-100">
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-1.5">
                            <BookmarkCheck size={14} className="text-blue-600" />
                            {milestone.customHighlights.heading}
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            {milestone.customHighlights.items.map((item, itIdx) => (
                              <div
                                key={itIdx}
                                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/20 transition-colors"
                              >
                                <div className="font-bold text-slate-900 text-xs sm:text-sm mb-1">
                                  {item.title}
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Official Motto Banner */}
                      {milestone.motto && (
                        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 border border-blue-200/60 flex items-center gap-3">
                          <Flag size={16} className="text-blue-600 shrink-0" />
                          <span className="font-bold text-blue-900 text-xs sm:text-sm italic">
                            {milestone.motto}
                          </span>
                        </div>
                      )}

                      {/* Close button */}
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCard(milestone.id);
                          }}
                          className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                        >
                          <ChevronUp size={13} /> Collapse Details
                        </button>
                      </div>

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
