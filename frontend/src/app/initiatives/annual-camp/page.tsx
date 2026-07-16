'use client';

import { motion } from 'framer-motion';
import { Tent, Newspaper } from 'lucide-react';

export default function AnnualCampPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#f4f7fe]">
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
              <img src="/images/gallery/events_2025/image1.png" className="w-full h-full object-cover" alt="Annual Camp 1" />
            </div>
            <div className="relative h-32 md:h-48 rounded-2xl overflow-hidden">
              <img src="/images/gallery/events_2025/image2.png" className="w-full h-full object-cover" alt="Annual Camp 2" />
            </div>
            <div className="relative h-32 md:h-48 rounded-2xl overflow-hidden">
              <img src="/images/gallery/events_2025/image28.png" className="w-full h-full object-cover" alt="Annual Camp 3" />
            </div>
            <div className="relative h-32 md:h-48 rounded-2xl overflow-hidden">
              <img src="/images/gallery/events_2025/image29.png" className="w-full h-full object-cover" alt="Annual Camp 4" />
            </div>
            <div className="relative h-32 md:h-48 rounded-2xl overflow-hidden">
              <img src="/images/gallery/events_2025/image30.png" className="w-full h-full object-cover" alt="Annual Camp 5" />
            </div>
          </div>
          
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-6 md:px-10 py-3 md:py-4 rounded-full shadow-xl border border-orange-100 flex items-center gap-4 w-[90%] md:w-auto justify-center max-w-full overflow-hidden">
            <Tent className="text-orange-500 hidden md:block flex-shrink-0" size={32} fill="currentColor" />
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-orange-600 tracking-tight text-center uppercase whitespace-nowrap">
              Annual NSS Camp
            </h1>
            <Tent className="text-orange-500 hidden md:block flex-shrink-0" size={32} fill="currentColor" />
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-24 md:mt-20 prose prose-lg md:prose-xl max-w-none text-gray-800"
        >
          <p className="leading-relaxed font-serif text-justify mt-10">
            The Annual NSS Unit Camp, organized by the NSS Unit of VIT Bhopal University, held every year in the month of January and February at Higher Secondary School, Tehsil Astha, District Sehore. The week-long residential camp aimed to install a spirit of community service, social responsibility, and leadership among student volunteers. Participants engaged in a variety of impactful activities including Prabhat Feri (morning awareness rallies), Shramdaan (community labour for village development), a medical camp offering basic healthcare services, Nukkad Natak (street plays) focused on social awareness, and fun, educational games for children.
          </p>
          
          <p className="leading-relaxed font-serif text-justify">
            The camp witnessed the gracious presence of esteemed dignitaries such as Dr. Anant Kumar Saxena (NSS Program Coordinator), Mr. Rahul Singh Parihar (NSS Program Officer and ETI of Barkatullah University), and senior leadership from VIT Bhopal including Vice Chancellor Dr. Senthil Kumar Arumugam, Pro Vice Chancellor Dr. T.B. Sridharan, and Registrar Mr. K.K. Nair. Their presence and encouragement served as great motivation for all the volunteers. The successful execution of the camp was made possible through the unwavering guidance and support of NSS Program Officers Dr. Vinod Bhatt, Dr. Dev Brat Gupta, Dr. Shweta Singh, and Dr. Pooja Verma. The camp not only empowered the volunteers with life-changing experiences but also strengthened the bond between academia and rural communities through service and outreach.
          </p>
        </motion.div>

        <hr className="my-16 border-t-2 border-orange-200/50 w-3/4 mx-auto" />

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
              Press Releases
            </h3>
          </div>
          
          <div className="space-y-16">
            
            {/* 2026 Camp */}
            <div>
              <h4 className="text-2xl font-bold text-orange-600 mb-6 font-serif border-b-2 border-orange-200 inline-block pb-2 px-4">
                Annual NSS Camp 2026
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
                   <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                      <img src="/images/gallery/events_2025/image31.png" className="w-full h-auto object-cover opacity-80 mix-blend-luminosity grayscale" alt="2026 News Clipping 1" />
                   </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
                   <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                      <img src="/images/gallery/events_2025/image32.png" className="w-full h-auto object-cover opacity-80 mix-blend-luminosity grayscale" alt="2026 News Clipping 2" />
                   </div>
                </div>
              </div>
            </div>

            {/* 2025 Camp */}
            <div>
              <h4 className="text-2xl font-bold text-orange-600 mb-6 font-serif border-b-2 border-orange-200 inline-block pb-2 px-4">
                Annual NSS Camp 2025
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
                   <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                      <img src="/images/gallery/events_2025/image1.png" className="w-full h-auto object-cover opacity-80 mix-blend-luminosity grayscale" alt="2025 News Clipping 1" />
                   </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
                   <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                      <img src="/images/gallery/events_2025/image2.png" className="w-full h-auto object-cover opacity-80 mix-blend-luminosity grayscale" alt="2025 News Clipping 2" />
                   </div>
                </div>
              </div>
            </div>

            {/* 2024 Camp */}
            <div>
              <h4 className="text-2xl font-bold text-orange-600 mb-6 font-serif border-b-2 border-orange-200 inline-block pb-2 px-4">
                Annual NSS Camp 2024
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
                   <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                      <img src="/images/gallery/events_2025/image28.png" className="w-full h-auto object-cover opacity-80 mix-blend-luminosity grayscale" alt="2024 News Clipping 1" />
                   </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
                   <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                      <img src="/images/gallery/events_2025/image29.png" className="w-full h-auto object-cover opacity-80 mix-blend-luminosity grayscale" alt="2024 News Clipping 2" />
                   </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
