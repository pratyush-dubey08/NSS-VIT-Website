'use client';

import { motion } from 'framer-motion';
import { Leaf, Newspaper } from 'lucide-react';

export default function TreePlantationPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#f4faec]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Collage Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 relative"
        >
          {/* Collage Simulation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 rounded-3xl overflow-hidden shadow-2xl bg-white p-2">
            <div className="col-span-2 row-span-2 relative h-64 md:h-96 rounded-2xl overflow-hidden">
              <img src="/images/gallery/events_2025/image29.png" className="w-full h-full object-cover" alt="Tree Plantation 1" />
            </div>
            <div className="relative h-32 md:h-48 rounded-2xl overflow-hidden">
              <img src="/images/gallery/events_2025/image31.png" className="w-full h-full object-cover" alt="Tree Plantation 2" />
            </div>
            <div className="relative h-32 md:h-48 rounded-2xl overflow-hidden">
              <img src="/images/gallery/events_2025/image32.png" className="w-full h-full object-cover" alt="Tree Plantation 3" />
            </div>
            <div className="relative h-32 md:h-48 rounded-2xl overflow-hidden">
              <img src="/images/gallery/events_2025/image33.png" className="w-full h-full object-cover" alt="Tree Plantation 4" />
            </div>
            <div className="relative h-32 md:h-48 rounded-2xl overflow-hidden">
              <img src="/images/gallery/events_2025/image34.png" className="w-full h-full object-cover" alt="Tree Plantation 5" />
            </div>
          </div>
          
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-10 py-4 rounded-full shadow-xl border border-green-100 flex items-center gap-4 w-[90%] md:w-auto justify-center">
            <Leaf className="text-green-600 hidden md:block" size={32} fill="currentColor" />
            <h1 className="text-2xl md:text-5xl font-black text-green-700 tracking-tight text-center uppercase">
              Tree Plantation Drive
            </h1>
            <Leaf className="text-green-600 hidden md:block" size={32} fill="currentColor" />
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-24 md:mt-20 prose prose-lg md:prose-xl max-w-none text-gray-800"
        >
          <h2 className="text-center font-bold text-gray-900 mb-10 font-serif">
            Mega Tree Plantation Drive 2024 - A Greener Tomorrow begins
          </h2>
          
          <p className="leading-relaxed font-serif text-justify">
            On August 9th, 2024, the NSS Unit of VIT Bhopal University took a bold step toward sustainability with the Mega Tree Plantation Drive. In a single day, 1,000 passionate volunteers came together to plant 15,000 trees, transforming an open space into a thriving green sanctuary.
          </p>
          
          <p className="leading-relaxed font-serif text-justify">
            The event was filled with enthusiasm, teamwork, and a shared commitment to protecting the environment. Under the expert guidance of Dr. Vinod Bhatt, Dr. Devbrat Gupta, and Dr. Shweta Singh, our volunteers worked tirelessly, digging, planting, and watering—each sapling representing a step toward a sustainable future.
          </p>
          
          <p className="leading-relaxed font-serif text-justify">
            The presence of our Vice Chancellor and esteemed dignitaries made the event even more inspiring, as their words reinforced the importance of small actions in creating a lasting impact. As rows of saplings found their new home, the air buzzed with energy—cheers, high-fives, and the resounding mantra: Go Green, NSS! Go Green, VIT! Go Green, Bharat!
          </p>

          <p className="leading-relaxed font-serif text-justify">
            The joy of the day was amplified when birds and butterflies arrived, as if nature itself embraced our efforts. This event was more than just a plantation drive—it was a celebration of unity, responsibility, and the power of collective action.
          </p>
        </motion.div>

        <hr className="my-16 border-t-2 border-green-200/50 w-3/4 mx-auto" />

        {/* Press Release Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 justify-center mb-10">
            <Newspaper className="text-gray-900" size={40} />
            <h3 className="text-4xl font-black text-gray-900 uppercase tracking-widest font-serif">
              Press Release
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
            {/* Press Release Placeholders */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
               <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                  <img src="/images/gallery/events_2025/image30.png" className="w-full h-auto object-cover opacity-80 mix-blend-luminosity grayscale" alt="News Clipping 1" />
               </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
               <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                  <img src="/images/gallery/events_2025/image1.png" className="w-full h-auto object-cover opacity-80 mix-blend-luminosity grayscale" alt="News Clipping 2" />
               </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
