'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';
import { ArrowRight, Sparkles } from 'lucide-react';

// 15 Curated Authentic Field Photos Across All Events
const rawBgImages = [
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792969136/nss_vit_website/kj4tf366p1t6ji2zp8nm.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792969136/nss_vit_website/yxlhufykeahoj6rpkhfo.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792973350/nss_vit_website/b8mka7okpwddhvqmbnwg.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792973350/nss_vit_website/zetb4kqynx8chdgnr7uc.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790377/nss_vit_website/ke8hwjewhh35reol1qbv.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790380/nss_vit_website/ldxhofed2qko3xgkalrw.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790572/nss_vit_website/he0jq8bkt6cn65uovzd0.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790574/nss_vit_website/t8yekemxqbpvf6eveb1i.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790725/nss_vit_website/d2uu5kyfjloo7ghtkbdg.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790727/nss_vit_website/it90tykxcoi0kxr0gnbm.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792788462/nss_vit_website/cqchuriblrtjeqm8iozj.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792788477/nss_vit_website/hnkdz00mckdonlmwupe7.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792788339/nss_vit_website/quuefqdxoscyx9qm7jjr.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792788342/nss_vit_website/i5mxtuuqjhkjdaoosuyj.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792787248/nss_vit_website/cm8anmbugjjyg57sjht1.jpg"
];

// Pre-optimized with Cloudinary CDN transformations (f_auto, q_auto)
const bgImages = rawBgImages.map(url => getImageUrl(url, { width: 1600 }));

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bgImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 pt-20 pb-12 sm:py-24">
      {/* Background Image Carousel with Cinematic Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentImage}
            src={bgImages[currentImage]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover object-center brightness-95"
            alt="NSS Community Service Event"
          />
        </AnimatePresence>

        {/* Soft Contrast Gradient to ensure readability on mobile and desktop */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/40 to-slate-950/80 z-1 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 z-1 pointer-events-none" />
      </div>

      {/* Main Hero Card - Mobile Optimized & Glassmorphism */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-3xl lg:max-w-4xl bg-white/92 sm:bg-white/85 backdrop-blur-xl border border-white/60 p-6 sm:p-10 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center text-center"
        >
          {/* Logo with clean drop shadow */}
          <div className="mb-4 relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32">
            <img 
              src="/images/nss-logo.png" 
              alt="NSS Logo" 
              className="w-full h-full object-contain drop-shadow-md rounded-full" 
            />
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-2 leading-tight drop-shadow-2xs">
            NSS Unit, <span className="text-nss-blue">VIT Bhopal University</span>
          </h1>

          <h2 className="text-sm sm:text-lg md:text-xl font-bold text-nss-red mb-3 italic tracking-wide">
            "Not Me But You"
          </h2>

          <p className="max-w-2xl text-xs sm:text-sm md:text-base text-gray-700 mb-6 sm:mb-8 leading-relaxed font-medium px-2">
            Empowering youth through community service. Join us in our mission to develop personality through grassroots social impact and build a compassionate, self-reliant nation.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-2 sm:px-0">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-7 py-3 sm:py-3.5 bg-nss-blue text-white rounded-xl font-bold text-sm sm:text-base hover:bg-blue-900 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 text-center cursor-pointer"
            >
              Volunteer Login
            </Link>
            <Link 
              href="/activities" 
              className="w-full sm:w-auto px-7 py-3 sm:py-3.5 bg-white border border-gray-300 text-gray-900 rounded-xl font-bold text-sm sm:text-base hover:bg-gray-50 transition-all shadow-xs hover:shadow-md text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Activities</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Subtle Scroll Indicator (Desktop only for clean mobile viewport) */}
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
