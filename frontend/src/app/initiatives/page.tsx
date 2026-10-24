'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  UserCheck,
  Flag,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  Trees,
  Heart,
  School,
  Theater,
  Globe2,
  Building2,
  ChevronsUpDown
} from 'lucide-react';
import { UNIT_MILESTONES, MilestoneDetail } from '@/data/unitMilestones';

export default function HighlightsPage() {
  // Set of open card IDs
  const [expandedIds, setExpandedIds] = useState<string[]>(['mega-tree-plantation-2024']); // First item open by default

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

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'environment':
        return {
          pill: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          statBg: 'from-emerald-500 to-teal-600 text-white',
          borderAccent: 'hover:border-emerald-300',
          icon: <Trees size={16} className="text-emerald-600" />
        };
      case 'health':
        return {
          pill: 'bg-rose-50 text-rose-700 border-rose-200/80',
          statBg: 'from-rose-500 to-red-600 text-white',
          borderAccent: 'hover:border-rose-300',
          icon: <Heart size={16} className="text-rose-600" />
        };
      case 'rural':
        return {
          pill: 'bg-amber-50 text-amber-800 border-amber-200/80',
          statBg: 'from-amber-500 to-orange-600 text-white',
          borderAccent: 'hover:border-amber-300',
          icon: <School size={16} className="text-amber-600" />
        };
      case 'awareness':
        return {
          pill: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
          statBg: 'from-indigo-600 to-blue-600 text-white',
          borderAccent: 'hover:border-indigo-300',
          icon: <Theater size={16} className="text-indigo-600" />
        };
      case 'culture':
        return {
          pill: 'bg-purple-50 text-purple-700 border-purple-200/80',
          statBg: 'from-purple-600 to-indigo-600 text-white',
          borderAccent: 'hover:border-purple-300',
          icon: <Globe2 size={16} className="text-purple-600" />
        };
      default:
        return {
          pill: 'bg-blue-50 text-blue-700 border-blue-200/80',
          statBg: 'from-blue-600 to-indigo-600 text-white',
          borderAccent: 'hover:border-blue-300',
          icon: <Building2 size={16} className="text-blue-600" />
        };
    }
  };

  return (
    <div className="min-h-screen pt-28 bg-slate-50/70 pb-32 overflow-hidden selection:bg-nss-blue selection:text-white font-sans">
      
      {/* Hero Section */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]"
          >
            Unit Highlights & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-nss-blue to-indigo-600">
              Flagship Initiatives
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Discover our landmark community drives, rural development projects, environmental milestones, and university-wide leadership. Click on any initiative card below to explore its full story.
          </motion.p>

          {/* Expand / Collapse All Toggle */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleExpandAll}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold border border-slate-200/90 shadow-sm transition-all duration-200 hover:shadow"
            >
              <ChevronsUpDown size={16} className="text-blue-600" />
              {expandedIds.length === UNIT_MILESTONES.length ? 'Collapse All Cards' : 'Expand All Cards'}
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Cards Showcase */}
      <div className="container mx-auto px-4 max-w-5xl space-y-6 relative z-10">
        {UNIT_MILESTONES.map((milestone, idx) => {
          const isExpanded = expandedIds.includes(milestone.id);
          const theme = getCategoryStyles(milestone.category);

          return (
            <motion.div
              key={milestone.id}
              id={milestone.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.03 * idx }}
              className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                isExpanded 
                  ? 'border-blue-300 shadow-xl shadow-blue-900/5 ring-1 ring-blue-100' 
                  : `border-slate-200/90 shadow-sm hover:shadow-md ${theme.borderAccent}`
              }`}
            >
              {/* Clickable Card Header */}
              <div
                onClick={() => toggleCard(milestone.id)}
                className="p-6 sm:p-8 cursor-pointer select-none transition-colors hover:bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  
                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg text-xs font-bold border ${theme.pill}`}>
                      {theme.icon}
                      {milestone.categoryLabel}
                    </span>
                    {milestone.badges.slice(0, 2).map((b, bIdx) => (
                      <span key={bIdx} className="hidden sm:inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600">
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                      {milestone.title}
                    </h3>
                    <p className="text-sm sm:text-base font-semibold text-blue-600 mt-1">
                      {milestone.subtitle}
                    </p>
                  </div>

                  {/* Date & Location Pills */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar size={13} className="text-blue-600" />
                      <span>{milestone.date}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin size={13} className="text-blue-600" />
                      <span>{milestone.location}</span>
                    </div>
                  </div>

                </div>

                {/* Right Side: Impact Stat & Toggle Button */}
                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className={`px-4 py-2.5 rounded-2xl bg-gradient-to-br ${theme.statBg} shadow-sm text-center min-w-[130px]`}>
                    <span className="block text-xl sm:text-2xl font-black tracking-tight leading-none">
                      {milestone.highlightStat.value}
                    </span>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-white/90 mt-1">
                      {milestone.highlightStat.label}
                    </span>
                  </div>

                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    isExpanded 
                      ? 'bg-blue-600 text-white border-blue-600 rotate-180' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600'
                  }`}>
                    <ChevronDown size={20} />
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
                    <div className="px-6 sm:px-8 pb-8 pt-4 border-t border-slate-100 space-y-6">
                      
                      {/* Dignitaries if available */}
                      {milestone.dignitaries && milestone.dignitaries.length > 0 && (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
                          <div className="inline-flex items-center gap-1.5 font-black uppercase tracking-wider text-slate-700 shrink-0">
                            <UserCheck size={15} className="text-blue-600" />
                            Key Dignitaries & Mentors:
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {milestone.dignitaries.map((dig, dIdx) => (
                              <span key={dIdx} className="px-2.5 py-1 rounded-md bg-white text-slate-800 font-bold border border-slate-200 shadow-2xs">
                                {dig}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Full Narrative Text */}
                      <div className="space-y-4 text-slate-700 text-base leading-relaxed text-justify">
                        {milestone.paragraphs.map((p, pIdx) => (
                          <p key={pIdx}>
                            {p}
                          </p>
                        ))}
                      </div>

                      {/* Custom Feature Grid (e.g. 4 Themes of Nukkad Natak, 7 Themes of VIBGYOR, 5 Convocation Wings, Villages, etc.) */}
                      {milestone.customHighlights && (
                        <div className="pt-4 border-t border-slate-100">
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                            <BookmarkCheck size={15} className="text-blue-600" />
                            {milestone.customHighlights.heading}
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {milestone.customHighlights.items.map((item, itIdx) => (
                              <div
                                key={itIdx}
                                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/20 transition-colors"
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
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 border border-blue-200/60 flex items-center gap-3">
                          <Flag size={18} className="text-blue-600 shrink-0" />
                          <span className="font-bold text-blue-900 text-xs sm:text-sm italic">
                            {milestone.motto}
                          </span>
                        </div>
                      )}

                      {/* Close button at bottom of open card */}
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCard(milestone.id);
                          }}
                          className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                        >
                          <ChevronUp size={14} /> Collapse Details
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
