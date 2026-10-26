'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';


import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Trees, Calendar, Users, MapPin, Award, ZoomIn, X, FolderOpen, ArrowRight } from 'lucide-react';

export default function TreePlantationPage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedPressImage, setSelectedPressImage] = useState<string | null>(null);

  const pressReleases = [
    '/images/press_plantation/IMG-20260827-WA0031.jpg',
    '/images/press_plantation/IMG-20260827-WA0032.jpg',
    '/images/press_plantation/IMG-20260827-WA0034.jpg',
  ];

  const heroPlantationPhotos = [
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790377/nss_vit_website/ke8hwjewhh35reol1qbv.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790380/nss_vit_website/ldxhofed2qko3xgkalrw.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790381/nss_vit_website/bar2sk4mguwxzroe1exp.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790383/nss_vit_website/vm7wh3c4bpu3ylp9cmx3.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790385/nss_vit_website/ofvu3md9bg1xkm5m8jqc.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790396/nss_vit_website/nagkh4v72p64tirloif5.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790572/nss_vit_website/he0jq8bkt6cn65uovzd0.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790574/nss_vit_website/t8yekemxqbpvf6eveb1i.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790576/nss_vit_website/wbuvvmrfxmyegq0fzlx1.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790579/nss_vit_website/u0ylvdzscfxj3fuv6sfi.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790582/nss_vit_website/bpy3z614oyij8luiwbhd.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790584/nss_vit_website/ztr1xv8vdzyonr5bky89.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790587/nss_vit_website/jzrmswwonq0sxv5iwqdv.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790589/nss_vit_website/cw7wzhupeshfc73bg2sp.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790591/nss_vit_website/ynbhosec87evkvct56zz.jpg",
  "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790593/nss_vit_website/jb3jvbrtpo9eg9numuud.jpg"
];

  // Auto transition hero photos every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroPlantationPhotos.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-24 bg-white selection:bg-nss-blue selection:text-white font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Showcase Banner Area - Animated Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl shadow-2xl bg-slate-900 border border-gray-100 mb-14"
        >
          {/* Direct See more Link to Plantation Album on Top-Right */}
          <Link
            href="/gallery?category=plantation"
            className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-lg transition-all hover:scale-105 cursor-pointer"
            title="Explore Tree Plantation Albums in Gallery"
          >
            <FolderOpen size={14} className="text-emerald-400" />
            <span>See more...</span>
            <ArrowRight size={13} />
          </Link>

          {/* Inner Image Grid with Smooth Live Transition */}
          <div className="rounded-3xl overflow-hidden bg-slate-950">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2">
              {[0, 1, 2, 3].map((slot) => {
                const photoIdx = (slideIndex * 4 + slot) % heroPlantationPhotos.length;
                const photoSrc = heroPlantationPhotos[photoIdx];

                return (
                  <div key={slot} className="relative aspect-[4/3] sm:aspect-[16/10] md:h-52 rounded-2xl overflow-hidden bg-slate-900 group">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={photoSrc}
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        className="absolute inset-0 w-full h-full"
                      >
                        <img 
                          src={photoSrc} 
                          alt="Tree Plantation Photography" 
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Title Pill Badge */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white px-6 sm:px-10 md:px-14 py-2.5 sm:py-3.5 rounded-full shadow-2xl border border-gray-200/90 flex items-center justify-center max-w-[92%]">
            <h1 className="text-base sm:text-2xl md:text-3xl font-black text-emerald-800 tracking-tight text-center uppercase whitespace-nowrap">
              Tree Plantation Drive
            </h1>
          </div>
        </motion.div>

        {/* Impact Highlights Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 my-10 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">10,000+</div>
            <div className="text-xs sm:text-sm font-semibold text-emerald-800 mt-0.5">Trees in Single Day (Sehore)</div>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
            <div className="text-2xl sm:text-3xl font-black text-nss-blue">5,000+</div>
            <div className="text-xs sm:text-sm font-semibold text-blue-900 mt-0.5">Campus Native Trees</div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
            <div className="text-2xl sm:text-3xl font-black text-amber-700">Every Year</div>
            <div className="text-xs sm:text-sm font-semibold text-amber-900 mt-0.5">Annual Monsoon Drives</div>
          </div>
        </div>

        {/* Refreshed Comprehensive Core Content */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8 text-slate-700 leading-relaxed text-justify"
        >
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight">
              Pioneering Ecological Stewardship: From Campus to Communities
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
              How the NSS Unit of VIT Bhopal University champions mass reforestation, urban biodiversity, and year-round green sustenance.
            </p>
          </div>

          <p className="text-base sm:text-lg">
            At the NSS Unit of VIT Bhopal University, environmental conservation is not just an occasional gesture; it is an enduring, institutional commitment woven into our daily volunteer spirit. Driven by the philosophy that a healthier planet begins with proactive local stewardship, our unit organizes impactful tree plantation campaigns every single year, bringing together thousands of passionate student volunteers, faculty mentors, and local villagers.
          </p>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Trees className="text-emerald-600" size={26} />
              The Landmark 10,000-Tree Single-Day Drive in Sehore
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700">
              One of the most historic milestones in our unit’s history was the <strong>Mega Tree Plantation Drive</strong>, where over <strong>1,000 NSS volunteers planted 10,000 saplings in a single day</strong> across designated rural belts of Sehore district. Officially recognized as the largest single-day green drive in the region, this monumental operation was coordinated in synchronized batches under the guidance of Program Officer Dr. Vinod Bhatt and distinguished faculty mentors. Volunteers engaged in site preparation, trench digging, careful sapling placement, and protective fencing to ensure high post-plantation survival rates.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="text-nss-blue" size={26} />
              5,000+ Native Trees & Campus Biodiversity
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700">
              Inside the sprawling campus grounds of VIT Bhopal, NSS has spearheaded multiple afforestation drives, successfully planting and sustaining <strong>over 5,000 indigenous and shade-giving trees</strong> including Neem, Peepal, Banyan, Jamun, Shisham, and Gulmohar. These native species were chosen specifically to restore groundwater tables, enrich local soil fertility, and build thriving micro-habitats for local avian species and beneficial pollinators.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="text-indigo-600" size={26} />
              Annual Monsoon Campaigns & The "Adopt-a-Sapling" Culture
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700">
              Our core tenet is that <em>"Planting a sapling is only day one — nurturing it into a mature tree is our true responsibility."</em> Every year with the onset of the monsoon season, the NSS Unit launches fresh plantation drives across adopted villages, rural schools, and peripheral public spaces. Through our volunteer <strong>Tree-Warden Batches</strong>, students take ownership of designated plantation zones, conducting periodic watering schedules, organic compost enrichment, pruning, and health monitoring throughout the academic year.
            </p>
          </div>

          <p className="text-base sm:text-lg font-medium text-slate-800 text-center pt-4">
            Under the empowering rallying call: <span className="font-black text-emerald-700">“Go Green, NSS! Go Green, VIT! Go Green, Bharat!”</span>, our volunteers continue to lead from the front, turning barren landscapes into lush green sanctuaries for generations to come.
          </p>
        </motion.article>

        <hr className="my-14 border-t border-slate-200" />

        {/* Press Release Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2.5 justify-center mb-8">
            <Newspaper className="text-slate-800" size={28} />
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-wider">
              Press Release & Media Coverage
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {pressReleases.map((imgSrc, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedPressImage(imgSrc)}
                className="bg-white p-2.5 rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-emerald-600/50 transition-all cursor-pointer group flex items-center justify-center aspect-[3/4] overflow-hidden"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={imgSrc} 
                    alt="Plantation Drive Press Release" 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-slate-900/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <span className="p-2 rounded-full bg-white/95 text-slate-900 shadow-sm"><ZoomIn size={18} /></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Full Screen Lightbox Modal */}
          <AnimatePresence>
            {selectedPressImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
                onClick={() => setSelectedPressImage(null)}
              >
                <button 
                  onClick={() => setSelectedPressImage(null)}
                  className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <X size={24} />
                </button>
                <img
                  src={selectedPressImage}
                  alt="Enlarged Press Release"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}
