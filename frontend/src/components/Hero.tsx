'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/navigation';

const bgImages = [
 '/images/gallery/events_2025/image31.png',
 '/images/gallery/events_2025/image28.png',
 '/images/gallery/events_2025/image14.png',
 '/images/gallery/events_2025/image17.png',
 '/images/gallery/events_2025/image29.png',
];

export default function Hero() {
 const [currentImage, setCurrentImage] = useState(0);

 useEffect(() => {
 const timer = setInterval(() => {
 setCurrentImage((prev) => (prev + 1) % bgImages.length);
 }, 5000);
 return () => clearInterval(timer);
 }, []);

 return (
 <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
 {/* Background Image Slider */}
 <div className="absolute inset-0 z-0 bg-gray-100">
 <AnimatePresence mode="popLayout">
 <motion.img
 key={currentImage}
 src={bgImages[currentImage]}
 initial={{ opacity: 0, scale: 1.05 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 1.5, ease: 'easeInOut' }}
 className="absolute inset-0 w-full h-full object-cover"
 alt="NSS Group Event"
 />
 </AnimatePresence>
 </div>

 <div className="container mx-auto px-4 z-10 flex flex-col items-center pt-24 pb-12">
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8, ease:"easeOut"}}
 className="bg-white/40 backdrop-blur-lg border border-white/40 p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center max-w-5xl text-center"
 >
 <div className="mb-6 relative w-28 h-28 md:w-36 md:h-36">
 <img src="/images/nss-logo.png"alt="NSS Logo"className="w-full h-full object-contain drop-shadow-xl rounded-full"/>
 </div>

 <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-4 drop-shadow-sm">
 NSS Unit, <span className="text-nss-blue">VIT Bhopal University</span>
 </h1>

 <h2 className="text-xl md:text-2xl font-bold text-nss-red mb-8 italic drop-shadow-sm">
"Not Me But You"
 </h2>

 <p className="max-w-3xl text-lg md:text-xl lg:text-2xl text-gray-700 mb-10 leading-relaxed tracking-wide font-medium">
 Empowering youth through community service. Join us in our mission to develop personality through social impact and make a difference.
 </p>

 <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
 <a href="/login"className="px-8 py-4 bg-nss-blue text-white rounded-full font-bold text-lg hover:bg-blue-900 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-center">
 Volunteer Login
 </a>
 <a href="#activities"className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg text-center">
 Explore Activities
 </a>
 </div>
 </motion.div>
 </div>

 {/* Scroll Indicator */}
 <motion.div 
 animate={{ y: [0, 10, 0] }}
 transition={{ duration: 2, repeat: Infinity }}
 className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-500"
 >
 <span className="text-sm mb-2 font-medium tracking-widest uppercase text-gray-500">Scroll</span>
 <div className="w-[1px] h-12 bg-gradient-to-b from-gray-400 to-transparent"/>
 </motion.div>
 </section>
 );
}
