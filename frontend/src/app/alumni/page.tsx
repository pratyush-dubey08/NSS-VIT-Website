'use client';

import { motion } from 'framer-motion';
import { alumniData } from '@/data/alumni';
import { ExternalLink, Briefcase, GraduationCap, Quote, Globe, Heart } from 'lucide-react';

export default function AlumniPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F5FD] via-[#F8FAFC] to-[#EEF4FE] text-gray-900 pt-32 pb-24 px-4 relative overflow-hidden font-sans selection:bg-nss-blue selection:text-white">
      
      {/* Soft Ambient Background Glows (Light Theme) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-blue-100/60 via-indigo-50/40 to-transparent pointer-events-none blur-3xl -z-10" />
      <div className="absolute top-48 -left-20 w-[450px] h-[450px] bg-blue-200/35 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-96 -right-20 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-1/3 w-[600px] h-[400px] bg-rose-100/25 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Subtle Dot Matrix Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-[0.08] pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header Section (Clean, Proud Legacy and Batch pills removed, equal gaps balanced) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight text-center mb-3">
            Where Are Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-nss-blue via-blue-600 to-indigo-600">Volunteers</span> Now?
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal max-w-2xl mx-auto">
            The spirit of <span className="text-nss-blue font-semibold italic">"Not Me But You"</span> stays with our volunteers forever. Discover how their NSS journey shaped their professional lives and where they are making an impact today.
          </p>
        </motion.div>

        {/* Alumni Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {alumniData.map((alumnus, index) => (
            <motion.div
              key={alumnus.name}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="bg-white/95 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-blue-100/80 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300 hover:-translate-y-2 transition-all duration-300 flex flex-col group relative"
            >
              {/* Top Banner / Card Header */}
              <div className="relative h-28 bg-gradient-to-r from-blue-100/70 via-indigo-50/80 to-blue-50/90 border-b border-blue-100/60 flex justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                
                {/* Circular Avatar */}
                <div className="absolute -bottom-14 w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 group-hover:scale-105 transition-all duration-300 z-10">
                  <img 
                    src={alumnus.photoUrl} 
                    alt={alumnus.name}
                    className="w-full h-full object-cover object-center scale-110 group-hover:scale-115 transition-transform duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alumnus.name)}&background=EFF6FF&color=1D4ED8&bold=true`;
                    }}
                  />
                </div>
              </div>

              {/* Card Content Area */}
              <div className="pt-16 pb-6 px-6 flex flex-col flex-grow">
                
                {/* Name & Details */}
                <div className="text-center mb-5">
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-1 group-hover:text-nss-blue transition-colors">
                    {alumnus.name}
                  </h3>
                  <div className="text-xs font-bold text-nss-blue uppercase tracking-widest mb-3">
                    Batch of {alumnus.batch}
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      alumnus.status === 'Placed' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}>
                      {alumnus.status === 'Placed' ? <Briefcase size={13} /> : <GraduationCap size={13} />}
                      {alumnus.status}
                    </span>
                  </div>

                  {/* Company & Designation */}
                  {(alumnus.company || alumnus.designation) && (
                    <div className="text-sm font-medium mt-1">
                      {alumnus.designation && <span className="block text-gray-900 font-bold">{alumnus.designation}</span>}
                      {alumnus.company && <span className="block text-gray-500 text-xs mt-0.5 font-medium">@ {alumnus.company}</span>}
                    </div>
                  )}
                </div>

                {/* Messages / Quotes */}
                <div className="flex-grow space-y-3.5 mt-2">
                  <div className="relative bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/70">
                    <Quote className="absolute top-3 left-3 text-blue-200/60 w-8 h-8 -z-0" />
                    <p className="text-gray-700 relative z-10 italic text-xs sm:text-sm leading-relaxed text-justify">
                      "{alumnus.message}"
                    </p>
                  </div>
                  
                  {alumnus.cherished && (
                    <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100/90">
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-nss-blue uppercase tracking-wider mb-1.5">
                        <Heart size={12} className="text-rose-500 fill-rose-500" />
                        Most Cherished Memory
                      </div>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed text-justify">
                        {alumnus.cherished}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Links (LinkedIn / Portfolio) */}
                {(alumnus.linkedin || alumnus.portfolio) && (
                  <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2.5">
                    {alumnus.linkedin && (
                      <a 
                        href={alumnus.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white border border-blue-200/80 hover:border-transparent text-xs font-bold transition-all duration-300 shadow-sm"
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
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-200/80 hover:border-transparent text-xs font-bold transition-all duration-300 shadow-sm"
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
        </div>

      </div>
    </div>
  );
}
