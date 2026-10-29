'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';


import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, HeartHandshake, ShieldCheck, Hospital, Users, ZoomIn, X, FolderOpen, ArrowRight } from 'lucide-react';

export default function BloodDonationPage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedPressImage, setSelectedPressImage] = useState<string | null>(null);

  const pressReleases = [
    '/images/press_blood_donation/IMG-20260827-WA0029.webp',
    '/images/press_blood_donation/IMG-20260827-WA0033.webp',
    '/images/press_blood_donation/Screenshot 2026-10-26 015428.png',
    '/images/press_blood_donation/Screenshot 2026-10-26 015435.png',
  ];

  const heroBloodPhotos = [
  "https://res.cloudinary.com//image/upload/f_auto,q_auto/v1792794532/nss_vit_website/fjvlh83zvtgjeiayirax.jpg",
  "https://res.cloudinary.com//image/upload/f_auto,q_auto/v1792794533/nss_vit_website/pm6eue5t9coe59d7hce9.jpg",
  "https://res.cloudinary.com//image/upload/f_auto,q_auto/v1792794532/nss_vit_website/xcnghddndbrvr05225lm.jpg",
  "https://res.cloudinary.com//image/upload/f_auto,q_auto/v1792794535/nss_vit_website/npsnlvekn9hxvmuwqrgf.jpg",
  "https://res.cloudinary.com//image/upload/f_auto,q_auto/v1792794535/nss_vit_website/tnnj3irieq9co4kuo73j.jpg",
  "https://res.cloudinary.com//image/upload/f_auto,q_auto/v1792794535/nss_vit_website/sezc1psatzyttyd1orfw.jpg",
  "https://res.cloudinary.com//image/upload/f_auto,q_auto/v1792794537/nss_vit_website/zrf1hp7f3lk0arnjoqvv.jpg",
  "https://res.cloudinary.com//image/upload/f_auto,q_auto/v1792794537/nss_vit_website/ioh5arutkuzhd4wddlsj.jpg",
  "https://res.cloudinary.com//image/upload/f_auto,q_auto/v1792794632/nss_vit_website/xd8f7pzade4bm5ivrc6h.jpg",
  "https://res.cloudinary.com//image/upload/f_auto,q_auto/v1792794632/nss_vit_website/nuv7ebwj3pgfwiwmdohu.jpg",
  "https://res.cloudinary.com//image/upload/f_auto,q_auto/v1792794632/nss_vit_website/hqqkzopvbofkslfh1npv.jpg",
  "https://res.cloudinary.com//image/upload/f_auto,q_auto/v1792794635/nss_vit_website/oafcmgihbnyh2r6whuit.jpg",
  "https://res.cloudinary.com//image/upload/f_auto,q_auto/v1792794635/nss_vit_website/cgm6vg8owwopfkcfabaf.jpg",
  "https://res.cloudinary.com//image/upload/f_auto,q_auto/v1792794635/nss_vit_website/iimcncjsnhsk3tfd6tme.jpg",
  "https://res.cloudinary.com//image/upload/f_auto,q_auto/v1792794638/nss_vit_website/tuimfaltsczuvzdvfl93.jpg",
  "https://res.cloudinary.com//image/upload/f_auto,q_auto/v1792794638/nss_vit_website/uffqfxbx3hpjbzourhae.jpg"
];

  // Auto transition hero photos every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroBloodPhotos.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-24 bg-gradient-to-b from-slate-50 via-blue-50/20 to-red-50/20 selection:bg-nss-blue selection:text-white font-sans relative overflow-hidden">
      {/* Soft Blended Photography Watermark in Background */}
      <div className="fixed inset-0 pointer-events-none -z-30 opacity-[0.035] select-none overflow-hidden">
        <img src="/images/hero-nss-group.webp" alt="" className="w-full h-full object-cover scale-105 filter blur-xs" />
      </div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Showcase Banner Area - Animated Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl shadow-2xl bg-slate-900 border border-gray-100 mb-14"
        >
          {/* Direct See more Link to Blood Donation Album on Top-Right */}
          <Link
            href="/gallery?category=blood"
            className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-lg transition-all hover:scale-105 cursor-pointer"
            title="Explore Blood Donation Albums in Gallery"
          >
            <FolderOpen size={14} className="text-red-400" />
            <span>See more...</span>
            <ArrowRight size={13} />
          </Link>

          {/* Inner Image Grid with Smooth Live Transition */}
          <div className="rounded-3xl overflow-hidden bg-slate-950">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2">
              {[0, 1, 2, 3].map((slot) => {
                const photoIdx = (slideIndex * 4 + slot) % heroBloodPhotos.length;
                const photoSrc = heroBloodPhotos[photoIdx];

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
                          alt="Blood Donation Photography" 
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
            <h1 className="text-base sm:text-2xl md:text-3xl font-black text-red-700 tracking-tight text-center uppercase whitespace-nowrap">
              Blood Donation Camp
            </h1>
          </div>
        </motion.div>

        {/* Impact Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-10 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center">
            <div className="text-2xl sm:text-3xl font-black text-rose-700">2,000+</div>
            <div className="text-xs sm:text-sm font-semibold text-rose-800 mt-0.5">Blood Units Donated</div>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
            <div className="text-2xl sm:text-3xl font-black text-nss-blue">100%</div>
            <div className="text-xs sm:text-sm font-semibold text-blue-900 mt-0.5">Sterile Clinical Safety</div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">3 Major</div>
            <div className="text-xs sm:text-sm font-semibold text-emerald-900 mt-0.5">Govt & Tertiary Hospitals</div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
            <div className="text-2xl sm:text-3xl font-black text-amber-700">24/7</div>
            <div className="text-xs sm:text-sm font-semibold text-amber-900 mt-0.5">Emergency Donor Helpline</div>
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
              Giving the Gift of Life: Community Health & Emergency Solidarity
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
              How our annual voluntary blood donation drives save critical lives across regional healthcare centers and emergency wards.
            </p>
          </div>

          <p className="text-base sm:text-lg">
            Blood donation is the highest form of humanitarian service — an anonymous, selfless act that directly bridges the critical divide between life and death for accident trauma victims, cancer patients, thalassemia warriors, and emergency surgical cases. The NSS Unit of VIT Bhopal University organizes large-scale, voluntary Blood Donation Camps annually, instilling a deep sense of social responsibility and civic empathy across our student and faculty fraternity.
          </p>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Hospital className="text-rose-600" size={26} />
              Premier Healthcare Partnerships: AIIMS, Hamidia & Chirayu Hospitals
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700">
              Each camp is organized in stringent technical and medical collaboration with government and tertiary hospital blood banks, including <strong>AIIMS Bhopal, Hamidia Hospital, and Chirayu Medical College & Hospital</strong>. Highly skilled medical officers and licensed phlebotomists supervise all phases of the collection process. Every donor undergoes thorough pre-donation medical evaluation, including hemoglobin screening, blood pressure checks, vitals assessment, and medical history verification to ensure complete donor safety and wellbeing.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="text-nss-blue" size={26} />
              2,000+ Units Mobilized & Rapid Regional Emergency Directory
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700">
              Through consistent, large-scale annual drives, the NSS Unit has successfully mobilized <strong>over 2,000 units of life-saving blood</strong> to date. In addition to mass collection drives, the unit maintains a structured, verified <strong>Voluntary Blood Donor Directory</strong> categorized by blood groups (including rare Rh-negative types). This directory enables our volunteers to respond rapidly to SOS emergency distress calls from hospitals across Bhopal, Sehore, and nearby rural districts.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <HeartHandshake className="text-emerald-600" size={26} />
              Donor Care, Health Literacy & Busting Myths
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700">
              Beyond blood collection, our volunteer teams run intensive pre-camp educational awareness drives across hostels and academic blocks to dispel common myths surrounding blood donation. First-time donors are guided with care, provided with nutritious recovery refreshments (fruit juices, fresh fruits, glucose), and felicitated with official government donor certificates and donor badges.
            </p>
          </div>

          <p className="text-base sm:text-lg font-medium text-slate-800 text-center pt-4">
            Anchored in our guiding philosophy: <span className="font-black text-rose-700">“Donate Blood. Share Hope. Save Lives — Every Drop Counts, Every Donor Matters.”</span>
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
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {pressReleases.map((imgSrc, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedPressImage(imgSrc)}
                className="bg-white p-2.5 rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-red-600/50 transition-all cursor-pointer group flex items-center justify-center aspect-[3/4] overflow-hidden"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={imgSrc} 
                    alt="Blood Donation Press Release" 
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
