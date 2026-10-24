'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Trees,
  Heart,
  School,
  Sparkles,
  Building2,
  Calendar,
  MapPin,
  UserCheck,
  Flag,
  BookmarkCheck,
  Trophy,
  Medal,
  Flame,
  ArrowRight,
  Globe2,
  Users,
  CheckCircle2,
  Compass,
  Theater,
  Droplets,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';
import { UNIT_MILESTONES, MilestoneDetail } from '@/data/unitMilestones';

export default function HighlightsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterTabs = [
    { id: 'all', label: 'All Highlights', count: UNIT_MILESTONES.length, icon: Sparkles },
    { id: 'environment', label: 'Green Mission & Environment', count: UNIT_MILESTONES.filter(m => m.category === 'environment').length, icon: Trees },
    { id: 'health', label: 'Healthcare & Life Saving', count: UNIT_MILESTONES.filter(m => m.category === 'health').length, icon: Heart },
    { id: 'rural', label: 'Rural Empowerment', count: UNIT_MILESTONES.filter(m => m.category === 'rural').length, icon: School },
    { id: 'awareness', label: 'Street Theatre & Awareness', count: UNIT_MILESTONES.filter(m => m.category === 'awareness').length, icon: Theater },
    { id: 'culture', label: 'Civic & Cultural', count: UNIT_MILESTONES.filter(m => m.category === 'culture').length, icon: Globe2 },
    { id: 'institutional', label: 'Institutional Leadership', count: UNIT_MILESTONES.filter(m => m.category === 'institutional').length, icon: Building2 },
  ];

  const filteredItems = UNIT_MILESTONES.filter(m => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.paragraphs.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'environment':
        return {
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          gradient: 'from-emerald-600 via-teal-600 to-emerald-700',
          statCard: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/20',
          borderAccent: 'group-hover:border-emerald-300',
          lightBg: 'bg-emerald-50/40',
          icon: <Trees size={16} className="text-emerald-600" />
        };
      case 'health':
        return {
          badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
          gradient: 'from-rose-600 via-red-600 to-pink-700',
          statCard: 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-rose-500/20',
          borderAccent: 'group-hover:border-rose-300',
          lightBg: 'bg-rose-50/40',
          icon: <Heart size={16} className="text-rose-600" />
        };
      case 'rural':
        return {
          badge: 'bg-amber-50 text-amber-800 border-amber-200/80',
          gradient: 'from-amber-600 via-orange-600 to-amber-700',
          statCard: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/20',
          borderAccent: 'group-hover:border-amber-300',
          lightBg: 'bg-amber-50/40',
          icon: <School size={16} className="text-amber-600" />
        };
      case 'awareness':
        return {
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
          gradient: 'from-indigo-600 via-blue-600 to-indigo-700',
          statCard: 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-indigo-500/20',
          borderAccent: 'group-hover:border-indigo-300',
          lightBg: 'bg-indigo-50/40',
          icon: <Theater size={16} className="text-indigo-600" />
        };
      case 'culture':
        return {
          badge: 'bg-purple-50 text-purple-700 border-purple-200/80',
          gradient: 'from-purple-600 via-fuchsia-600 to-indigo-700',
          statCard: 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-purple-500/20',
          borderAccent: 'group-hover:border-purple-300',
          lightBg: 'bg-purple-50/40',
          icon: <Globe2 size={16} className="text-purple-600" />
        };
      default:
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
          gradient: 'from-blue-600 via-indigo-600 to-blue-700',
          statCard: 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/20',
          borderAccent: 'group-hover:border-blue-300',
          lightBg: 'bg-blue-50/40',
          icon: <Building2 size={16} className="text-blue-600" />
        };
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-slate-50/60 pb-32 overflow-hidden selection:bg-nss-blue selection:text-white font-sans">
      
      {/* =========================================================================
          HERO SECTION
      ========================================================================= */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10 max-w-5xl">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-widest border border-blue-200/80 mb-6 shadow-sm"
          >
            <Flame size={14} className="text-blue-600 fill-blue-600" /> NSS Unit, VIT Bhopal University • Flagship Portfolio
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]"
          >
            Institutional Highlights & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500">
              Grassroots Social Impact
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal"
          >
            Discover the landmark milestones, record-breaking environmental drives, rural village adoptions, state dignitary protocol, and high-impact social awareness campaigns that define our unit’s commitment to <em>“Not Me, But You”</em>.
          </motion.p>

          {/* Quick Cross-Link to Awardees & Campers Page */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 flex flex-wrap justify-center items-center gap-3"
          >
            <Link
              href="/achievements"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 shadow-sm transition-all duration-200 hover:shadow"
            >
              <Medal size={16} className="text-blue-600" />
              View Individual Awardees & Campers (8 Honors)
              <ArrowRight size={14} className="text-slate-400" />
            </Link>
          </motion.div>

          {/* =========================================================================
              IMPACT NUMBERS MATRIX (Audience-Attractive Counter Ribbon)
          ========================================================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-12 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xl shadow-blue-900/5 text-left"
          >
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col justify-between">
              <span className="text-2xl sm:text-3xl font-black text-emerald-700">10,000</span>
              <span className="text-xs font-semibold text-slate-700 mt-1">Trees in 1 Day</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 flex flex-col justify-between">
              <span className="text-2xl sm:text-3xl font-black text-rose-700">1,500+</span>
              <span className="text-xs font-semibold text-slate-700 mt-1">Blood Units Donated</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col justify-between">
              <span className="text-2xl sm:text-3xl font-black text-amber-800">10</span>
              <span className="text-xs font-semibold text-slate-700 mt-1">Adopted Villages</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 flex flex-col justify-between">
              <span className="text-2xl sm:text-3xl font-black text-teal-700">5,000+</span>
              <span className="text-xs font-semibold text-slate-700 mt-1">Campus Trees</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between">
              <span className="text-2xl sm:text-3xl font-black text-indigo-700">200+</span>
              <span className="text-xs font-semibold text-slate-700 mt-1">Convocation Crew</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col justify-between">
              <span className="text-2xl sm:text-3xl font-black text-purple-700">2,600+</span>
              <span className="text-xs font-semibold text-slate-700 mt-1">Health Consultations</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE CATEGORY FILTER BAR
      ========================================================================= */}
      <div className="container mx-auto px-4 max-w-7xl mb-12 relative z-10">
        <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-teal-400' : 'text-slate-400'} />
                  <span>{tab.label}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-bold text-slate-500 px-3">
            Showing {filteredItems.length} of {UNIT_MILESTONES.length} Initiatives
          </div>

        </div>
      </div>

      {/* =========================================================================
          HIGHLIGHTS CARDS SHOWCASE
      ========================================================================= */}
      <div className="container mx-auto px-4 max-w-7xl space-y-16 relative z-10">
        {filteredItems.map((milestone, index) => {
          const theme = getCategoryStyles(milestone.category);

          return (
            <motion.article
              key={milestone.id}
              id={milestone.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className={`group bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl shadow-slate-900/5 border border-slate-200/90 ${theme.borderAccent} transition-all duration-300 relative overflow-hidden`}
            >
              {/* Subtle Corner Ambient Mesh */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-slate-50 rounded-bl-full -z-10 pointer-events-none group-hover:bg-blue-50/30 transition-colors"></div>

              {/* Top Row: Meta Badges + Large Stat Block */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${theme.badge}`}>
                      {theme.icon}
                      {milestone.categoryLabel}
                    </span>
                    
                    {milestone.badges.map((b, bIdx) => (
                      <span
                        key={bIdx}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                    {milestone.title}
                  </h2>

                  <p className="text-base sm:text-lg font-semibold text-blue-600">
                    {milestone.subtitle}
                  </p>
                </div>

                {/* Highlight Impact Stat Card */}
                <div className="shrink-0 flex items-center">
                  <div className={`p-4 sm:p-5 rounded-2xl ${theme.statCard} min-w-[170px] text-center shadow-lg transition-transform duration-300 group-hover:scale-105`}>
                    <span className="block text-2xl sm:text-4xl font-black tracking-tight">
                      {milestone.highlightStat.value}
                    </span>
                    <span className="block text-xs font-bold uppercase tracking-wider text-white/90 mt-1">
                      {milestone.highlightStat.label}
                    </span>
                  </div>
                </div>

              </div>

              {/* Date & Location Meta */}
              <div className="flex flex-wrap items-center gap-3 py-4 text-xs sm:text-sm text-slate-600 font-medium border-b border-slate-100">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
                  <Calendar size={15} className="text-blue-600" />
                  <span>{milestone.date}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
                  <MapPin size={15} className="text-blue-600" />
                  <span>{milestone.location}</span>
                </div>
              </div>

              {/* Dignitary Mentions if Available */}
              {milestone.dignitaries && milestone.dignitaries.length > 0 && (
                <div className="my-5 p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 shrink-0">
                    <UserCheck size={16} className="text-blue-600" />
                    Key Dignitaries & Mentors:
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {milestone.dignitaries.map((dig, dIdx) => (
                      <span key={dIdx} className="px-2.5 py-1 rounded-md bg-white text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs">
                        {dig}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Detailed Narrative Paragraphs */}
              <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed pt-5 text-justify">
                {milestone.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>
                    {p}
                  </p>
                ))}
              </div>

              {/* Structured Custom Highlights Grid (4 Pillars of Nukkad Natak, 7 Themes of VIBGYOR, 5 Convocation Wings, School Locations, etc.) */}
              {milestone.customHighlights && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                    <BookmarkCheck size={16} className="text-blue-600" />
                    {milestone.customHighlights.heading}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {milestone.customHighlights.items.map((item, itIdx) => (
                      <div
                        key={itIdx}
                        className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/20 transition-all duration-200"
                      >
                        <div className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
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

              {/* Motto Banner */}
              {milestone.motto && (
                <div className="mt-7 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-slate-50 border border-blue-200/60 flex items-center gap-4">
                  <Flag size={20} className="text-blue-600 shrink-0" />
                  <span className="font-bold text-blue-900 text-sm sm:text-base italic">
                    {milestone.motto}
                  </span>
                </div>
              )}

            </motion.article>
          );
        })}
      </div>

      {/* =========================================================================
          BOTTOM CALL TO ACTION (To Awardees & Campers)
      ========================================================================= */}
      <section className="container mx-auto px-4 max-w-5xl mt-24 text-center">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-2xl sm:text-4xl font-black mb-4">
            Celebrating Individual Excellence & National Honors
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-normal">
            Explore our state and national camp representatives, parliamentarians, and award-winning student volunteers.
          </p>

          <Link
            href="/achievements"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-600/30 transition-all duration-300 transform hover:scale-105"
          >
            <Medal size={18} />
            Explore Awardees & Campers Page
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
