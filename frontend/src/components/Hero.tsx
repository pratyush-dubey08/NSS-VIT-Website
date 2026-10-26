'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Smartphone, Download } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 pt-28 pb-12 sm:py-24">
      {/* Official NSS Unit Grand Volunteer Group Photo Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/hero-nss-group.jpg"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90"
          alt="NSS Unit VIT Bhopal University Volunteers"
        />

        {/* Cinematic Dual Gradient Overlay for contrast and warmth */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/35 to-slate-950/80 z-1 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/20 to-slate-950/60 z-1 pointer-events-none" />
      </div>

      {/* Main Hero Card - Authentic Frosted Transparent Glass & Generous Mobile Padding */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-2xl lg:max-w-3xl bg-white/40 sm:bg-white/45 backdrop-blur-lg border border-white/45 p-6 sm:p-10 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center text-center"
        >
          {/* Logo with drop shadow */}
          <div className="mb-4 relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32">
            <img 
              src="/images/nss-logo.png" 
              alt="NSS Logo" 
              className="w-full h-full object-contain drop-shadow-xl rounded-full bg-white/20 p-1" 
            />
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-2 leading-tight drop-shadow-xs">
            NSS Unit, <span className="text-nss-blue">VIT Bhopal University</span>
          </h1>

          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-nss-red mb-3 italic tracking-wide drop-shadow-2xs">
            "Not Me But You"
          </h2>

          <p className="max-w-xl text-xs sm:text-sm md:text-base text-gray-800 mb-6 sm:mb-8 leading-relaxed font-semibold px-2">
            Empowering youth through community service. Join us in our mission to develop personality through grassroots social impact and make a difference.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-2 sm:px-0 flex-wrap">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-7 py-3 sm:py-3.5 bg-gradient-to-r from-nss-blue to-blue-900 text-white rounded-full font-extrabold text-sm sm:text-base hover:from-blue-900 hover:to-nss-red transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-center cursor-pointer"
            >
              Volunteer Login
            </Link>
            <Link 
              href="/activities" 
              className="w-full sm:w-auto px-7 py-3 sm:py-3.5 bg-white border-2 border-nss-red text-nss-red rounded-full font-extrabold text-sm sm:text-base hover:bg-red-50 transition-all shadow-md hover:shadow-lg text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Activities</span>
              <ArrowRight size={16} />
            </Link>
            <a 
              href="/downloads/nss-vit-bhopal.apk" 
              download="nss-vit-bhopal.apk"
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-full font-extrabold text-sm sm:text-base transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Smartphone size={18} className="group-hover:rotate-12 transition-transform" />
              <span>Download Official App (.apk)</span>
              <Download size={15} />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Subtle Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center text-white/70 pointer-events-none z-10"
      >
        <span className="text-[11px] mb-1 font-bold tracking-widest uppercase text-white/80">Scroll</span>
        <div className="w-[1.5px] h-8 bg-gradient-to-b from-white/70 to-transparent rounded-full" />
      </motion.div>
    </section>
  );
}
