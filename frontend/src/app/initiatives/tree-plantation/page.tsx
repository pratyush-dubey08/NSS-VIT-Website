'use client';

import { motion } from 'framer-motion';
import { Newspaper, Trees, Calendar, Users, MapPin, Award } from 'lucide-react';

export default function TreePlantationPage() {
  const plantationGallery = [
    {
      url: "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790377/nss_vit_website/ke8hwjewhh35reol1qbv.jpg",
      title: "Volunteers and Dignitaries at Mega Plantation Drive"
    },
    {
      url: "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790381/nss_vit_website/bar2sk4mguwxzroe1exp.jpg",
      title: "Mass Student Participation in Sehore District"
    },
    {
      url: "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790383/nss_vit_website/vm7wh3c4bpu3ylp9cmx3.jpg",
      title: "Sapling Handover & Hon'ble Dignitaries"
    },
    {
      url: "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790385/nss_vit_website/ofvu3md9bg1xkm5m8jqc.jpg",
      title: "Flag-Off Rally and Student Volunteer Contingent"
    }
  ];

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-24 bg-white selection:bg-nss-blue selection:text-white font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Showcase Banner Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 relative"
        >
          {/* Curated Gallery Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-50 p-2.5">
            <div className="md:col-span-2 relative h-72 sm:h-96 rounded-2xl overflow-hidden group">
              <img 
                src={plantationGallery[0].url} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={plantationGallery[0].title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-5">
                <span className="text-white text-sm sm:text-base font-bold drop-shadow-md">
                  {plantationGallery[0].title}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 h-72 sm:h-96">
              <div className="relative h-full rounded-2xl overflow-hidden group">
                <img 
                  src={plantationGallery[1].url} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={plantationGallery[1].title} 
                />
              </div>
              <div className="relative h-full rounded-2xl overflow-hidden group">
                <img 
                  src={plantationGallery[2].url} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={plantationGallery[2].title} 
                />
              </div>
            </div>
          </div>
          
          {/* Single-Line Clean Heading Pill - No Emojis, No Multiline Wrap */}
          <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-white px-6 sm:px-10 py-3 sm:py-3.5 rounded-full shadow-xl border border-slate-200 flex items-center justify-center max-w-[95%]">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight text-center whitespace-nowrap uppercase">
              Tree Plantation Drive
            </h1>
          </div>
        </motion.div>

        {/* Impact Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-10 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">10,000+</div>
            <div className="text-xs sm:text-sm font-semibold text-emerald-800 mt-0.5">Trees in Single Day (Sehore)</div>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
            <div className="text-2xl sm:text-3xl font-black text-nss-blue">5,000+</div>
            <div className="text-xs sm:text-sm font-semibold text-blue-900 mt-0.5">Campus Native Trees</div>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
            <div className="text-2xl sm:text-3xl font-black text-indigo-700">1,000+</div>
            <div className="text-xs sm:text-sm font-semibold text-indigo-900 mt-0.5">Active Student Volunteers</div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start max-w-4xl mx-auto">
            <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
               <div className="w-full bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                  <img src="/images/gallery/events_2025/image30.png" className="w-full h-auto object-cover" alt="News Clipping 1" />
               </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
               <div className="w-full bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                  <img src="/images/gallery/events_2025/image1.png" className="w-full h-auto object-cover" alt="News Clipping 2" />
               </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
