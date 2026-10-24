'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Star,
  Trophy,
  Target,
  MapPin,
  Calendar,
  Users,
  Flag,
  Shield,
  Medal,
  BookOpen,
  Trees,
  Droplet,
  Heart,
  Sparkles,
  School,
  Building2,
  CheckCircle2,
  Flame,
  Globe2,
  UserCheck,
  ChevronRight,
  BookmarkCheck,
  Layers
} from 'lucide-react';
import { UNIT_MILESTONES, MilestoneDetail } from '@/data/unitMilestones';

const CamperCard = ({ name, regNo, role, image, delay = 0, color = "blue" }: any) => {
  const colorMap: Record<string, string> = {
    blue: "from-blue-500/10 to-nss-blue/10 border-blue-100 text-nss-blue",
    purple: "from-purple-500/10 to-indigo-500/10 border-purple-100 text-purple-600",
    emerald: "from-emerald-500/10 to-teal-500/10 border-emerald-100 text-emerald-600",
    amber: "from-amber-500/10 to-orange-500/10 border-amber-100 text-amber-600",
    rose: "from-rose-500/10 to-pink-500/10 border-rose-100 text-rose-600",
  };
  
  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      className="group relative"
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${selectedColor.split(' ')[0]} ${selectedColor.split(' ')[1]} rounded-3xl transform group-hover:scale-[1.02] transition-transform duration-500`}></div>
      <div className={`relative bg-white/70 backdrop-blur-xl border ${selectedColor.split(' ')[2]} p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center overflow-hidden h-full`}>
        <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden mb-5 relative bg-gray-100 flex items-center justify-center z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover object-top" 
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff&size=256&bold=true`;
              }}
            />
          ) : (
            <Users size={40} className="text-gray-300" />
          )}
        </div>

        <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
          {name}
        </h4>
        
        {regNo && (
          <span className="text-xs font-mono font-semibold text-gray-500 mt-1 mb-2 bg-gray-100 px-3 py-1 rounded-full">
            {regNo}
          </span>
        )}

        {role && (
          <span className={`text-xs font-bold uppercase tracking-wider mt-2 px-3.5 py-1.5 rounded-xl border bg-white/50 ${selectedColor.split(' ')[3]}`}>
            {role}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default function AwardeesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'milestones' | 'campers'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filterOptions = [
    { id: 'all', label: 'All Initiatives', count: UNIT_MILESTONES.length },
    { id: 'environment', label: '🌱 Environmental Action', count: UNIT_MILESTONES.filter(m => m.category === 'environment').length },
    { id: 'health', label: '❤️ Healthcare & Blood', count: UNIT_MILESTONES.filter(m => m.category === 'health').length },
    { id: 'rural', label: '🏘️ Rural Adoption', count: UNIT_MILESTONES.filter(m => m.category === 'rural').length },
    { id: 'awareness', label: '🎭 Social Awareness & Street Plays', count: UNIT_MILESTONES.filter(m => m.category === 'awareness').length },
    { id: 'culture', label: '🇮🇳 Civic & Cultural', count: UNIT_MILESTONES.filter(m => m.category === 'culture').length },
    { id: 'institutional', label: '🏛️ Institutional Protocol', count: UNIT_MILESTONES.filter(m => m.category === 'institutional').length },
  ];

  const filteredMilestones = categoryFilter === 'all'
    ? UNIT_MILESTONES
    : UNIT_MILESTONES.filter(m => m.category === categoryFilter);

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'environment':
        return {
          pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          statBg: 'from-emerald-500 to-teal-600',
          accent: 'border-emerald-500/30 bg-emerald-50/50',
          icon: <Trees size={18} className="text-emerald-600" />
        };
      case 'health':
        return {
          pill: 'bg-rose-50 text-rose-700 border-rose-200',
          statBg: 'from-rose-500 to-red-600',
          accent: 'border-rose-500/30 bg-rose-50/50',
          icon: <Heart size={18} className="text-rose-600" />
        };
      case 'rural':
        return {
          pill: 'bg-amber-50 text-amber-800 border-amber-200',
          statBg: 'from-amber-500 to-orange-600',
          accent: 'border-amber-500/30 bg-amber-50/50',
          icon: <School size={18} className="text-amber-600" />
        };
      case 'awareness':
        return {
          pill: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          statBg: 'from-indigo-600 to-blue-600',
          accent: 'border-indigo-500/30 bg-indigo-50/50',
          icon: <Sparkles size={18} className="text-indigo-600" />
        };
      case 'culture':
        return {
          pill: 'bg-purple-50 text-purple-700 border-purple-200',
          statBg: 'from-purple-600 to-indigo-600',
          accent: 'border-purple-500/30 bg-purple-50/50',
          icon: <Globe2 size={18} className="text-purple-600" />
        };
      default:
        return {
          pill: 'bg-blue-50 text-blue-700 border-blue-200',
          statBg: 'from-blue-600 to-indigo-600',
          accent: 'border-blue-500/30 bg-blue-50/50',
          icon: <Building2 size={18} className="text-blue-600" />
        };
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-slate-50/70 pb-32 overflow-hidden selection:bg-nss-blue selection:text-white font-sans">
      
      {/* Hero Section */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-widest border border-blue-200/80 mb-5 shadow-sm"
          >
            <Trophy size={14} className="text-blue-600" /> VIT Bhopal NSS Achievements & Impact Portfolio
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]"
          >
            Milestones, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-nss-blue to-indigo-600">Impact</span> & Honors
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal"
          >
            From landmark environmental drives planting 10,000 trees in a single day and rural village adoptions, to state dignitary protocol and prestigious National Integration Camp selections — celebrating our unit's collective impact and individual brilliance.
          </motion.p>

          {/* Quick Impact Numbers Ribbon */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-12 bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xl shadow-blue-900/5 text-left"
          >
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">10,000</span>
              <span className="text-xs font-semibold text-slate-600 mt-1">Trees in 1 Day</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-2xl sm:text-3xl font-black text-rose-600">1,500+</span>
              <span className="text-xs font-semibold text-slate-600 mt-1">Blood Units Collected</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-2xl sm:text-3xl font-black text-amber-600">10</span>
              <span className="text-xs font-semibold text-slate-600 mt-1">Adopted Villages</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-2xl sm:text-3xl font-black text-blue-600">5,000+</span>
              <span className="text-xs font-semibold text-slate-600 mt-1">Campus Trees</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-2xl sm:text-3xl font-black text-indigo-600">200+</span>
              <span className="text-xs font-semibold text-slate-600 mt-1">Convocation Crew</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-2xl sm:text-3xl font-black text-purple-600">2,600+</span>
              <span className="text-xs font-semibold text-slate-600 mt-1">Health Consultations</span>
            </div>
          </motion.div>

          {/* Dual Navigation Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-10 p-1.5 bg-slate-200/60 rounded-2xl max-w-fit mx-auto border border-slate-300/50">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-md shadow-slate-300/50 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <Sparkles size={16} className={activeTab === 'all' ? 'text-blue-600' : ''} />
              Full Showcase
            </button>
            <button
              onClick={() => setActiveTab('milestones')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'milestones'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <Trophy size={16} />
              Unit Flagship Milestones ({UNIT_MILESTONES.length})
            </button>
            <button
              onClick={() => setActiveTab('campers')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'campers'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <Medal size={16} />
              Campers & Awardees (8 Honors)
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="container mx-auto px-4 max-w-7xl space-y-24 relative z-10">

        {/* =========================================================================
            SECTION 1: UNIT FLAGSHIP MILESTONES & SOCIAL IMPACT (15 Initiatives)
        ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'milestones') && (
          <div className="space-y-12">
            
            {/* Section Header with Category Sub-Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-blue-100/60 text-blue-800 text-xs font-black uppercase tracking-wider mb-2">
                  <Flame size={14} className="text-blue-600" /> Institutional Highlights
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                  Flagship Unit Initiatives & Social Impact
                </h2>
                <p className="text-slate-600 text-base md:text-lg mt-2 max-w-2xl">
                  Transformative social drives, district-wide interventions, and institutional stewardship executed by the NSS Unit of VIT Bhopal.
                </p>
              </div>

              {/* Sub-Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-2">
                {filterOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setCategoryFilter(opt.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
                      categoryFilter === opt.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {opt.label} ({opt.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Initiatives Cards Grid */}
            <div className="space-y-16">
              {filteredMilestones.map((milestone, idx) => {
                const theme = getCategoryTheme(milestone.category);

                return (
                  <motion.article
                    key={milestone.id}
                    id={milestone.id}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl shadow-slate-900/5 border border-slate-200/90 hover:border-slate-300 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Background Soft Accent */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-slate-50 rounded-bl-full -z-10 pointer-events-none"></div>

                    {/* Top Row: Meta Badges + Impact Highlight Stat */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                      
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${theme.pill}`}>
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

                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                          {milestone.title}
                        </h3>

                        <p className="text-base sm:text-lg font-semibold text-blue-600">
                          {milestone.subtitle}
                        </p>
                      </div>

                      {/* Stat Ribbon Badge */}
                      <div className="shrink-0 flex items-center">
                        <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${theme.statBg} text-white shadow-lg min-w-[170px] text-center`}>
                          <span className="block text-2xl sm:text-4xl font-black tracking-tight">
                            {milestone.highlightStat.value}
                          </span>
                          <span className="block text-xs font-bold uppercase tracking-wider text-white/90 mt-1">
                            {milestone.highlightStat.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Date, Location & Dignitaries Metadata */}
                    <div className="flex flex-wrap items-center gap-4 py-4 text-xs sm:text-sm text-slate-600 font-medium border-b border-slate-100">
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

                    {/* Narrative Description Paragraphs */}
                    <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed pt-5 text-justify">
                      {milestone.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>
                          {p}
                        </p>
                      ))}
                    </div>

                    {/* Custom Highlights Grid (e.g. 4 Themes of Nukkad Natak, 7 Themes of VIBGYOR, 5 Convocation Wings, Villages, etc.) */}
                    {milestone.customHighlights && (
                      <div className="mt-8 pt-6 border-t border-slate-100">
                        <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                          <BookmarkCheck size={16} className="text-blue-600" />
                          {milestone.customHighlights.heading}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {milestone.customHighlights.items.map((item, itIdx) => (
                            <div
                              key={itIdx}
                              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/20 transition-colors"
                            >
                              <div className="font-bold text-slate-900 text-sm mb-1.5">
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

                    {/* Motto Callout Banner */}
                    {milestone.motto && (
                      <div className="mt-7 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 border border-blue-200/60 flex items-center gap-4">
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

          </div>
        )}

        {/* =========================================================================
            SECTION 2: NATIONAL & STATE CAMPERS & INDIVIDUAL HONORS (8 Honors)
        ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'campers') && (
          <div className="space-y-16 pt-8">
            
            {/* Campers Section Header */}
            <div className="pb-6 border-b border-slate-200">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-indigo-100/60 text-indigo-800 text-xs font-black uppercase tracking-wider mb-2">
                <Medal size={14} className="text-indigo-600" /> State & National Achievers
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                National & State Campers & Individual Honors
              </h2>
              <p className="text-slate-600 text-base md:text-lg mt-2 max-w-2xl">
                Honoring our exceptional NSS volunteers and program officers selected for prestigious national camps, parliamentary debates, and state-level leadership.
              </p>
            </div>

            {/* 1. NIC */}
            <section className="relative">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="bg-white rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl shadow-blue-900/5 border border-slate-100 flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -z-10"></div>
                
                <div className="w-full lg:w-1/3 flex justify-center">
                   <div className="relative w-72 h-80">
                      <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-6 opacity-10 transition-transform duration-500 hover:rotate-12"></div>
                      <div className="absolute inset-0 bg-white p-2 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center">
                        <CamperCard 
                          name="Rishabh Kabra" 
                          regNo="21MSI10017" 
                          role="State Representative"
                          color="blue"
                          image="/images/achievements/rishabh-kabra.jpeg"
                        />
                      </div>
                   </div>
                </div>
                
                <div className="w-full lg:w-2/3 space-y-6 flex flex-col items-start text-left">
                  <div className="inline-flex w-fit mr-auto items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-black uppercase tracking-widest">
                    <Flag size={18} /> National Integration Camp (NIC)
                  </div>
                  <h3 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                    Representing VIT Bhopal & Madhya Pradesh
                  </h3>
                  <p className="text-slate-600 text-lg md:text-xl leading-relaxed text-justify">
                    Mr. Rishabh Kabra (21MSI10017) has been selected to be the representative of VIT Bhopal University and Madhya Pradesh for National Level NSS National Integration Camp (NIC). The camp took placed from 23rd to 29th October 2024 at C.C.S. Agricultural University, Hisar, Haryana under the Ministry of Youth Affairs and Sports, Government of India.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 w-full">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-start gap-4">
                      <MapPin className="text-blue-600 shrink-0 mt-1" size={24} />
                      <p className="text-slate-700 font-semibold">C.C.S. Agricultural University, Hisar, Haryana</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-start gap-4">
                      <Shield className="text-blue-600 shrink-0 mt-1" size={24} />
                      <p className="text-slate-700 font-semibold">Ministry of Youth Affairs and Sports, Govt. of India</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* 2. State Level Pachore */}
            <section className="relative">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="bg-slate-900 rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl shadow-emerald-900/20 border border-slate-800 flex flex-col lg:flex-row-reverse gap-12 items-center relative overflow-hidden text-white"
              >
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-900/40 to-transparent rounded-tr-full -z-10"></div>
                
                <div className="w-full lg:w-5/12 grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                    <CamperCard 
                      name="Rishabh Kabra" 
                      regNo="21MSI10017" 
                      color="emerald"
                      delay={0.1}
                      image="/images/achievements/rishabh-kabra.jpeg"
                    />
                    <CamperCard 
                      name="Khushi Desai" 
                      regNo="22BOE10027" 
                      color="emerald"
                      delay={0.2}
                      image="/images/achievements/khushi-desai.png"
                    />
                </div>
                
                <div className="w-full lg:w-7/12 space-y-6 flex flex-col items-start text-left">
                  <div className="inline-flex w-fit mr-auto items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-sm font-black uppercase tracking-widest border border-emerald-500/30">
                    <Award size={18} /> State Level Leadership Training Camp 2024
                  </div>
                  <h3 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight text-white">
                    Excellence in Public Awareness & Leadership
                  </h3>
                  <p className="text-slate-300 text-lg md:text-xl leading-relaxed text-justify">
                    Chosen for the State-Level Leadership Training Camp conducted by the Ministry of Higher Education, Govt. of Madhya Pradesh at Pachore. Their selection was made based on outstanding contributions to public awareness programs, such as <strong className="text-emerald-400">medical camps and street plays</strong>.
                  </p>
                  <div className="mt-8 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 italic text-slate-200 shadow-inner w-full">
                    "Their work was admired by Assistant Vice President Ms. Kadambari Vishwanathan, Program Officer Dr. Vinod Bhatt, Dr. Abha Gupta, and other officials. Their commitment reflects the essence of NSS leadership and service."
                  </div>
                </div>
              </motion.div>
            </section>

            {/* 3. State Level Chitrakoot */}
            <section className="relative">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="bg-slate-900 rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl shadow-rose-900/20 border border-slate-800 flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden text-white"
              >
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-rose-900/40 to-transparent rounded-bl-full -z-10"></div>
                
                <div className="w-full lg:w-7/12 space-y-6 flex flex-col items-start text-left">
                  <div className="inline-flex w-fit mr-auto items-center gap-2 px-4 py-2 bg-rose-500/20 text-rose-400 rounded-xl text-sm font-black uppercase tracking-widest border border-rose-500/30">
                    <Award size={18} /> State Level Leadership Training Camp 2026
                  </div>
                  <h3 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight text-white">
                    Excellence in Social Welfare & Leadership
                  </h3>
                  <p className="text-slate-300 text-lg md:text-xl leading-relaxed text-justify">
                    A proud moment as our dedicated volunteers and esteemed Program Officer represented VIT Bhopal University at the State-Level Leadership Training Camp, organized by the Ministry of Higher Education, Govt. of Madhya Pradesh at Chitrakoot.
                  </p>
                  <div className="mt-8 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 italic text-slate-200 shadow-inner w-full">
                    "Recognized for outstanding leadership, discipline, and active involvement in university and community outreach. Their efforts brought immense pride to the institution."
                  </div>
                </div>

                <div className="w-full lg:w-5/12 flex flex-col gap-6 relative z-10">
                  {/* Program Officer */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex items-center gap-5 shadow-lg">
                    <div className="w-20 h-20 rounded-full border-2 border-rose-400/50 p-1 flex-shrink-0">
                       <div className="w-full h-full bg-gray-100 rounded-full overflow-hidden flex items-center justify-center relative">
                         <img src="/images/achievements/vinod-bhatt.png" alt="Dr. Vinod Bhatt" className="w-full h-full object-cover object-top" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Vinod+Bhatt&background=E11D48&color=fff&size=256&bold=true"; }} />
                       </div>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-rose-300 text-xs font-black uppercase tracking-widest mb-1">
                         <Star size={12} className="fill-rose-400 text-rose-400" /> Program Officer
                      </div>
                      <h4 className="text-2xl font-black text-white">Dr. Vinod Bhatt</h4>
                    </div>
                  </div>

                  {/* Volunteers Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <CamperCard 
                      name="Pratyush Dubey" 
                      regNo="23BAI10595"
                      color="rose"
                      delay={0.1}
                      image="/images/achievements/pratyush-dubey.png"
                    />
                    <CamperCard 
                      name="Shivani Nikam" 
                      regNo="24BEY10074"
                      color="rose"
                      delay={0.2}
                      image="/images/achievements/shivani-nikam.png"
                    />
                  </div>
                </div>
              </motion.div>
            </section>

            {/* 4. National Youth Parliament */}
            <section className="relative">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="bg-indigo-900 rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl shadow-indigo-900/20 border border-indigo-800 flex flex-col lg:flex-row-reverse gap-12 items-center relative overflow-hidden text-white"
              >
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-500/20 to-transparent rounded-bl-full -z-10"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -z-10"></div>
                
                <div className="w-full lg:w-1/3 flex justify-center relative z-10">
                   <div className="relative w-72 h-80">
                      <div className="absolute inset-0 bg-yellow-400 rounded-3xl -rotate-6 opacity-20 transition-transform duration-500 hover:-rotate-12"></div>
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-md p-2 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center justify-center">
                        <CamperCard 
                          name="Nandini Pandey" 
                          role="State Representative"
                          color="amber"
                          image="/images/achievements/nandini-pandey.png"
                        />
                      </div>
                   </div>
                </div>
                
                <div className="w-full lg:w-2/3 space-y-6 flex flex-col items-start text-left">
                  <div className="inline-flex w-fit mr-auto items-center gap-2 px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-xl text-sm font-black uppercase tracking-widest border border-yellow-400/30">
                    <Trophy size={18} /> National Youth Parliament 2025
                  </div>
                  <h3 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight text-white">
                    Top 10 at Nodal Level: <span className="text-indigo-300">Viksit Bharat Youth Parliament</span>
                  </h3>
                  <p className="text-indigo-100 text-lg md:text-xl leading-relaxed text-justify">
                    The event witnessed a remarkable confluence of youthful energy and intellectual discourse across Bhopal, Sehore, and Vidisha districts on the transformative theme of <strong className="text-white">“One Nation, One Election.”</strong>
                  </p>
                  <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex items-start gap-5 shadow-inner w-full">
                    <Medal className="text-yellow-400 shrink-0 mt-1" size={32} />
                    <p className="text-white font-medium text-lg leading-relaxed text-justify">
                      Amidst fierce competition, Nandini Pandey's outstanding performance earned her the honour of representing the Nodal District (Bhopal) at the State Youth Parliament in the Madhya Pradesh Assembly.
                    </p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* 5. National Youth Parliament 2026 */}
            <section className="relative">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="bg-indigo-950 rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl shadow-indigo-900/20 border border-indigo-800 flex flex-col lg:flex-row-reverse gap-12 items-center relative overflow-hidden text-white"
              >
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 to-transparent rounded-br-full -z-10"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -z-10"></div>
                
                <div className="w-full lg:w-1/3 flex justify-center relative z-10">
                   <div className="relative w-72 h-80">
                      <div className="absolute inset-0 bg-yellow-400 rounded-3xl rotate-6 opacity-20 transition-transform duration-500 hover:rotate-12"></div>
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-md p-2 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center justify-center">
                        <CamperCard 
                          name="Nandini Pandey" 
                          role="Sehore Representative"
                          color="amber"
                          image="/images/achievements/nandini-pandey.png"
                        />
                      </div>
                   </div>
                </div>
                
                <div className="w-full lg:w-2/3 space-y-6 flex flex-col items-start text-left">
                  <div className="inline-flex w-fit mr-auto items-center gap-2 px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-xl text-sm font-black uppercase tracking-widest border border-yellow-400/30">
                    <Trophy size={18} /> National Youth Parliament 2026
                  </div>
                  <h3 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight text-white">
                    Representing <span className="text-indigo-300">Sehore District</span>
                  </h3>
                  <p className="text-indigo-100 text-lg md:text-xl leading-relaxed text-justify">
                    Continuing her outstanding journey in youth advocacy and democratic discourse, Nandini Pandey was once again selected for the prestigious National Youth Parliament.
                  </p>
                  <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex items-start gap-5 shadow-inner w-full">
                    <Medal className="text-yellow-400 shrink-0 mt-1" size={32} />
                    <p className="text-white font-medium text-lg leading-relaxed text-justify">
                      Building upon her previous success, she proudly represented the Sehore district in 2026, showcasing exemplary leadership and oratorical skills on a significant platform.
                    </p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* 6. My Bharat Budget Quest */}
            <section className="relative">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="bg-white rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl shadow-orange-900/5 border border-slate-100 flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden"
              >
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 -z-10"></div>
                
                <div className="w-full lg:w-1/3 flex justify-center">
                   <div className="relative w-72 h-80">
                      <div className="absolute inset-0 bg-orange-500 rounded-3xl rotate-6 opacity-10 transition-transform duration-500 hover:rotate-12"></div>
                      <div className="absolute inset-0 bg-white p-2 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center">
                        <CamperCard 
                          name="Maulik Dubey" 
                          role="Finalist"
                          color="amber"
                          image="/images/achievements/maulik-dubey.png"
                        />
                      </div>
                   </div>
                </div>
                
                <div className="w-full lg:w-2/3 space-y-6 flex flex-col items-start text-left">
                  <div className="inline-flex w-fit mr-auto items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-sm font-black uppercase tracking-widest border border-orange-100">
                    <BookOpen size={18} /> My Bharat Budget Quest 2026
                  </div>
                  <h3 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                    Selected for the <span className="text-orange-600">Final Round</span>
                  </h3>
                  <p className="text-slate-600 text-lg md:text-xl leading-relaxed text-justify">
                    Maulik Dubey has showcased exceptional analytical and financial acumen, earning a highly coveted spot in the final round of the prestigious My Bharat Budget Quest. His achievement is a matter of immense pride for the NSS Unit, VIT Bhopal University.
                  </p>
                  <div className="grid grid-cols-1 gap-4 pt-4 w-full">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-start gap-4">
                      <MapPin className="text-orange-500 shrink-0 mt-1" size={24} />
                      <div>
                        <p className="text-slate-700 font-semibold">Aaryabhat Sabhagar, LNCT College, Patel Nagar, Bhopal</p>
                        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2"><Calendar size={14}/> 11th - 13th April, 2026</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* 7. Pre-RDC District Level */}
            <section className="relative">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="bg-slate-900 rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl shadow-purple-900/20 border border-slate-800 flex flex-col lg:flex-row-reverse gap-12 items-center relative overflow-hidden text-white"
              >
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-900/40 to-transparent rounded-tr-full -z-10"></div>
                
                <div className="w-full lg:w-5/12 grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                    <CamperCard 
                      name="Maulik Dubey" 
                      regNo="24BAI10764" 
                      color="purple"
                      delay={0.1}
                      image="/images/achievements/maulik-dubey.png"
                    />
                    <CamperCard 
                      name="Soumya Mishra" 
                      regNo="24MIP10024" 
                      color="purple"
                      delay={0.2}
                      image="/images/achievements/soumya-mishra.png"
                    />
                </div>
                
                <div className="w-full lg:w-7/12 space-y-6 flex flex-col items-start text-left">
                  <div className="inline-flex w-fit mr-auto items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-xl text-sm font-black uppercase tracking-widest border border-purple-500/30">
                    <Award size={18} /> Pre-Republic Day Camp 2025
                  </div>
                  <h3 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight text-white">
                    District-Level <span className="text-purple-400">Selections</span>
                  </h3>
                  <p className="text-slate-300 text-lg md:text-xl leading-relaxed text-justify">
                    A remarkable achievement by <strong className="text-white">Maulik Dubey</strong> and <strong className="text-white">Soumya Mishra</strong>, who successfully cleared the preliminary rounds. They have been officially selected from the <strong className="text-purple-400">Sehore District</strong> to compete in the prestigious district-level trials for the Pre-Republic Day Camp (Pre-RDC) 2025.
                  </p>
                  <div className="mt-8 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 italic text-slate-200 shadow-inner w-full">
                    "Their dedication, discipline, and exemplary performance in community service have earned them this prestigious opportunity to proudly represent our university."
                  </div>
                </div>
              </motion.div>
            </section>

            {/* 8. Pre-RDC Zonal Level */}
            <section className="relative">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="bg-white rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl shadow-blue-900/5 border border-slate-100 flex flex-col gap-12 items-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -z-10"></div>
                
                <div className="w-full space-y-6 flex flex-col items-center text-center max-w-4xl mx-auto">
                  <div className="inline-flex w-fit mx-auto items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-black uppercase tracking-widest border border-blue-100">
                    <Award size={18} /> Pre-RDC Camp Zonal Level Selections
                  </div>
                  <h3 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight text-slate-900">
                    A Proud Moment for <span className="text-blue-600">VIT Bhopal University</span>
                  </h3>
                  <p className="text-slate-600 text-lg md:text-xl leading-relaxed text-justify">
                    Our exceptional volunteers — <strong className="text-slate-900 font-bold">Shagun Singh, Maulik Dubey, Kshitika Atri, Soumya Mishra, Pragati,</strong> and <strong className="text-slate-900 font-bold">Riya Singh</strong> — showcased outstanding leadership, discipline, and dedication at the <strong className="text-slate-900 font-bold">Pre-RDC Zonal Level Selections</strong>. Their phenomenal performance proudly represents VIT Bhopal University and reflects the true essence of NSS — <span className="italic text-blue-600 font-semibold">"Not Me But You"</span>.
                  </p>

                  <div className="flex flex-wrap justify-center items-center gap-2.5 pt-2">
                    {['Shagun Singh', 'Maulik Dubey', 'Kshitika Atri', 'Soumya Mishra', 'Pragati', 'Riya Singh'].map((name) => (
                      <span key={name} className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs sm:text-sm border border-blue-200/80 shadow-sm">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>

          </div>
        )}

      </div>
    </div>
  );
}
