'use client';

import { motion } from 'framer-motion';
import { Droplet, Newspaper } from 'lucide-react';
import Image from 'next/image';

export default function BloodDonationPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#fffafa]">
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
              <img src="/images/gallery/events_2025/image28.png" className="w-full h-full object-cover" alt="Blood Donation 1" />
            </div>
            <div className="relative h-32 md:h-48 rounded-2xl overflow-hidden">
              <img src="/images/gallery/events_2025/image31.png" className="w-full h-full object-cover" alt="Blood Donation 2" />
            </div>
            <div className="relative h-32 md:h-48 rounded-2xl overflow-hidden">
              <img src="/images/gallery/events_2025/image32.png" className="w-full h-full object-cover" alt="Blood Donation 3" />
            </div>
            <div className="relative h-32 md:h-48 rounded-2xl overflow-hidden">
              <img src="/images/gallery/events_2025/image33.png" className="w-full h-full object-cover" alt="Blood Donation 4" />
            </div>
            <div className="relative h-32 md:h-48 rounded-2xl overflow-hidden">
              <img src="/images/gallery/events_2025/image34.png" className="w-full h-full object-cover" alt="Blood Donation 5" />
            </div>
          </div>
          
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-10 py-4 rounded-full shadow-xl border border-red-100 flex items-center gap-4 w-[90%] md:w-auto justify-center">
            <Droplet className="text-red-600 hidden md:block" size={32} fill="currentColor" />
            <h1 className="text-2xl md:text-5xl font-black text-red-700 tracking-tight text-center uppercase">
              Blood Donation Camp
            </h1>
            <Droplet className="text-red-600 hidden md:block" size={32} fill="currentColor" />
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
            NSS at VIT Bhopal: Serving Society with Compassion
          </h2>
          
          <p className="leading-relaxed font-serif text-justify">
            The NSS Unit of VIT Bhopal University is dedicated to fostering a spirit of social responsibility and volunteerism among students. In collaboration with Hamidia Hospital, AIIMS Bhopal and Chirayu Hospital, NSS Unit successfully organized a Blood Donation Camp, collecting <strong>2000 units of blood</strong> till date to support medical emergencies.
          </p>
          
          <p className="leading-relaxed font-serif text-justify">
            The event was inaugurated by AVP Ms. Kadhambari Vishwanathan, with guidance from Program Officers Dr. Vinod Bhatt. The seamless execution of the camp was made possible by the dedicated coordination team, led by Rishabh Kabra and Sahil Chaudhary, along with enthusiastic volunteers.
          </p>
          
          <p className="leading-relaxed font-serif text-justify">
            Through such initiatives, NSS at VIT Bhopal continues to make a meaningful impact on society, encouraging students to contribute towards healthcare, education, and social welfare. The unit remains committed to organizing more such events, inspiring a culture of compassion, service, and responsibility among students.
          </p>
        </motion.div>

        <hr className="my-16 border-t-2 border-red-200/50 w-3/4 mx-auto" />

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
