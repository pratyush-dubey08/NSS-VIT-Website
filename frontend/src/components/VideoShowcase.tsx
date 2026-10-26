'use client';

import { motion } from 'framer-motion';
import { Play, ExternalLink, Sparkles, Video, Film } from 'lucide-react';
import Link from 'next/link';

export default function VideoShowcase() {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-[#0A192F] text-white relative overflow-hidden font-sans border-t-4 border-nss-red">
      {/* Soft Ambient Brand Glows & Watermark */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-10 pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Camp Documentaries & <span className="bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">Aftermovies</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Experience the energy, dedication, and life-changing moments of our 7-day rural immersion camps and cultural showcases.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white text-white hover:text-slate-950 font-bold text-xs sm:text-sm rounded-xl border border-white/20 hover:border-white transition-all shadow-md group shrink-0 w-fit"
          >
            <span>Explore Full Gallery</span>
            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Featured Video: Annual NSS Unit Camp 2025 Aftermovie (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-white/5 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-white/15 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="font-black text-sm uppercase tracking-wider text-red-400">Featured Documentary</span>
              </div>
              <a
                href="https://youtu.be/lm92vc0_fGY?si=7ll7mNQ1o6b1lr4U"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
              >
                Open on YouTube <ExternalLink size={12} />
              </a>
            </div>

            {/* Embedded Responsive YouTube Iframe */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
              <iframe
                src="https://www.youtube.com/embed/lm92vc0_fGY"
                title="Annual NSS Unit Camp 2025 Official Aftermovie"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Annual NSS Unit Camp 2025 — Official Aftermovie
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                7 Days of grassroots transformation, cleanliness drives, medical camps, and community immersion at Gram Jafarabad, Sehore.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Link
                  href="/initiatives/annual-camp"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-nss-blue to-blue-800 hover:from-blue-700 hover:to-nss-red text-white text-xs font-bold rounded-xl transition-all shadow-md"
                >
                  <Video size={13} /> Read 7-Day Camp Diary
                </Link>
                <Link
                  href="/gallery/6a666e30050b5c6502e8421e"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all border border-white/15"
                >
                  View 2025 Album Photos
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Secondary Videos (5 cols): VIBGYOR 2025 & Camp 2026 Official Aftermovie */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* VIBGYOR 2025 Cultural Showcase */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-white/15 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-xs uppercase tracking-wider text-amber-400">Official Aftermovie</span>
                <a
                  href="https://youtu.be/ULmNP9Lj3aw?si=qGoWMlqOrZISS2Zn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
                >
                  YouTube <ExternalLink size={12} />
                </a>
              </div>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg ring-1 ring-white/10">
                <iframe
                  src="https://www.youtube.com/embed/ULmNP9Lj3aw"
                  title="VIBGYOR 2025 Official Aftermovie"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-black text-white leading-tight">
                  VIBGYOR 2025 — Official Aftermovie
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Our inaugural flagship cultural celebration uniting music, dance, and cultural unity across seven Indian states.
                </p>
              </div>
            </motion.div>

            {/* Camp 2026 Official Aftermovie Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-rose-950/60 via-purple-950/40 to-slate-900/60 backdrop-blur-xl rounded-3xl p-5 border border-rose-500/30 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold border border-rose-500/30">
                  <Sparkles size={12} /> Official Camp Aftermovie
                </span>
                <span className="text-xs text-slate-400">ANC 2026</span>
              </div>

              <a
                href="https://www.instagram.com/reel/DXHLJhlDxNJ/"
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative rounded-2xl overflow-hidden aspect-[16/7] bg-slate-900 border border-white/10 shadow-lg cursor-pointer"
              >
                <img
                  src="https://res.cloudinary.com/lrsgx9ti/image/upload/v1792709886/nss_vit_website/fqqcfgdawuyvznsulndo.png"
                  alt="Camp 2026 Official Aftermovie"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play size={24} className="fill-current ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-3 right-3 text-white">
                  <p className="text-xs font-black truncate">Annual NSS Unit Camp 2026 — Official Aftermovie</p>
                  <p className="text-[10px] text-slate-300">Tap to watch on Instagram @nssvitbhopal</p>
                </div>
              </a>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-300 font-medium">Borkheda Village 7-Day Journey</span>
                <a
                  href="https://www.instagram.com/reel/DXHLJhlDxNJ/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all shrink-0"
                >
                  Watch Official Aftermovie <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
