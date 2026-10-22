'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { alumniData } from '@/data/alumni';
import { ExternalLink, Briefcase, GraduationCap, Quote, Globe, Heart, Sparkles } from 'lucide-react';

export default function AlumniPage() {
  const [selectedBatch, setSelectedBatch] = useState<string>('All');

  const batches = ['All', '2021', '2022'];

  const filteredAlumni = selectedBatch === 'All' 
    ? alumniData 
    : alumniData.filter(a => a.batch === selectedBatch);

  return (
    <div className="min-h-screen bg-[#070C18] text-slate-100 pt-32 pb-24 px-4 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Ambient Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent pointer-events-none blur-3xl -z-10" />
      <div className="absolute top-48 -left-20 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-96 -right-20 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-1/3 w-[600px] h-[400px] bg-rose-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-black uppercase tracking-widest border border-blue-500/20 mb-5 shadow-sm">
            <Sparkles size={14} className="text-blue-400" /> Proud Legacy
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            Where Are Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">Volunteers</span> Now?
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            The spirit of <span className="text-blue-400 font-semibold italic">"Not Me But You"</span> stays with our volunteers forever. Discover how their NSS journey shaped their professional lives and where they are making an impact today.
          </p>

          {/* Batch Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {batches.map((batch) => (
              <button
                key={batch}
                onClick={() => setSelectedBatch(batch)}
                className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                  selectedBatch === batch
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {batch === 'All' ? 'All Volunteers' : `Batch of ${batch}`}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Alumni Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredAlumni.map((alumnus, index) => (
              <motion.div
                layout
                key={alumnus.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="bg-slate-900/70 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-slate-800/90 hover:border-blue-500/40 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col group relative"
              >
                {/* Top Banner / Card Header */}
                <div className="relative h-28 bg-gradient-to-r from-blue-900/40 via-indigo-900/20 to-slate-900/50 border-b border-slate-800/60 flex justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                  
                  {/* Circular Avatar */}
                  <div className="absolute -bottom-14 w-28 h-28 rounded-full border-4 border-[#070C18] shadow-2xl overflow-hidden bg-slate-800 ring-2 ring-blue-500/30 group-hover:ring-blue-400 group-hover:scale-105 transition-all duration-300 z-10">
                    <img 
                      src={alumnus.photoUrl} 
                      alt={alumnus.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alumnus.name)}&background=1E293B&color=94A3B8&bold=true`;
                      }}
                    />
                  </div>
                </div>

                {/* Card Content Area */}
                <div className="pt-16 pb-6 px-6 flex flex-col flex-grow">
                  
                  {/* Name & Details */}
                  <div className="text-center mb-5">
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-1 group-hover:text-blue-400 transition-colors">
                      {alumnus.name}
                    </h3>
                    <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
                      Batch of {alumnus.batch}
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        alumnus.status === 'Placed' 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                      }`}>
                        {alumnus.status === 'Placed' ? <Briefcase size={13} /> : <GraduationCap size={13} />}
                        {alumnus.status}
                      </span>
                    </div>

                    {/* Company & Designation */}
                    {(alumnus.company || alumnus.designation) && (
                      <div className="text-sm font-medium mt-1">
                        {alumnus.designation && <span className="block text-white font-semibold">{alumnus.designation}</span>}
                        {alumnus.company && <span className="block text-slate-400 text-xs mt-0.5 font-medium">@ {alumnus.company}</span>}
                      </div>
                    )}
                  </div>

                  {/* Messages / Quotes */}
                  <div className="flex-grow space-y-3.5 mt-2">
                    <div className="relative bg-slate-950/70 rounded-2xl p-4 sm:p-5 border border-slate-800/80 backdrop-blur-sm">
                      <Quote className="absolute top-3 left-3 text-blue-500/15 w-8 h-8 -z-0" />
                      <p className="text-slate-300 relative z-10 italic text-xs sm:text-sm leading-relaxed">
                        "{alumnus.message}"
                      </p>
                    </div>
                    
                    {alumnus.cherished && (
                      <div className="bg-blue-950/30 rounded-2xl p-4 border border-blue-900/40">
                        <div className="flex items-center gap-1.5 text-[11px] font-black text-blue-400 uppercase tracking-wider mb-1.5">
                          <Heart size={12} className="text-rose-400 fill-rose-400" />
                          Most Cherished Memory
                        </div>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                          {alumnus.cherished}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer Links (LinkedIn / Portfolio) */}
                  {(alumnus.linkedin || alumnus.portfolio) && (
                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-2.5">
                      {alumnus.linkedin && (
                        <a 
                          href={alumnus.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600/15 hover:bg-[#0A66C2] text-blue-300 hover:text-white border border-blue-500/30 hover:border-transparent text-xs font-bold transition-all duration-300 shadow-sm"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24m1.4 9.74V9.87H5.06v8.63h2.8z"/>
                          </svg>
                          LinkedIn
                          <ExternalLink size={12} className="opacity-70" />
                        </a>
                      )}
                      
                      {alumnus.portfolio && (
                        <a 
                          href={alumnus.portfolio} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/15 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 hover:border-transparent text-xs font-bold transition-all duration-300 shadow-sm"
                        >
                          <Globe size={13} />
                          Portfolio
                          <ExternalLink size={12} className="opacity-70" />
                        </a>
                      )}
                    </div>
                  )}

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
