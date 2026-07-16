'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Image as ImageIcon, ArrowLeft, FolderOpen } from 'lucide-react';

const categories = [
  { id: 'camps', title: 'Special Camps', image: '/images/gallery/events_2025/image1.png' },
  { id: 'plantation', title: 'Plantation & Environment', image: '/images/gallery/events_2025/image29.png' },
  { id: 'blood', title: 'Blood Donation Drives', image: '/images/gallery/events_2025/image28.png' },
  { id: 'awareness', title: 'Awareness Campaigns', image: '/images/gallery/events_2025/image33.png' },
  { id: 'youth', title: 'Youth Development', image: '/images/gallery/events_2025/image1.png' },
  { id: 'cultural', title: 'Cultural Events', image: '/images/gallery/events_2025/image30.png' }
];

const subCategories = [
  // Special Camps
  { id: 'c1', categoryId: 'camps', title: 'Annual Unit NSS Camp', cover: '/images/gallery/events_2025/image2.png' },
  { id: 'c2', categoryId: 'camps', title: 'NSS Unit Camp 2025', cover: '/images/gallery/events_2025/image31.png' },
  { id: 'c3', categoryId: 'camps', title: 'Annual NSS Camp 2026', cover: '/images/gallery/events_2025/image32.png' },
  { id: 'c4', categoryId: 'camps', title: 'State NSS Camp', cover: '/images/gallery/events_2025/image34.png' },
  { id: 'c5', categoryId: 'camps', title: 'State NSS Camp (2026)', cover: '/images/gallery/events_2025/image1.png' },
  { id: 'c6', categoryId: 'camps', title: 'National Integration Camp NSS', cover: '/images/gallery/events_2025/image2.png' },
  { id: 'c7', categoryId: 'camps', title: 'District Pre-RDC Camp', cover: '/images/gallery/events_2025/image28.png' },
  { id: 'c8', categoryId: 'camps', title: 'BU Level Pre-RDC Camp', cover: '/images/gallery/events_2025/image29.png' },
  { id: 'c9', categoryId: 'camps', title: 'District Pre-RDC Camp (2025)', cover: '/images/gallery/events_2025/image30.png' },
  { id: 'c10', categoryId: 'camps', title: 'BU Level Pre-RDC Camp (2025)', cover: '/images/gallery/events_2025/image33.png' },

  // Plantation & Environment
  { id: 'p1', categoryId: 'plantation', title: 'Plantation Drive', cover: '/images/gallery/events_2025/image29.png' },
  { id: 'p2', categoryId: 'plantation', title: 'NSS Mega Tree Plantation Drive', cover: '/images/gallery/events_2025/image32.png' },
  { id: 'p3', categoryId: 'plantation', title: 'Mega Tree Plantation Drive 2025', cover: '/images/gallery/events_2025/image1.png' },
  { id: 'p4', categoryId: 'plantation', title: 'Water and Food for Birds', cover: '/images/gallery/events_2025/image2.png' },
  { id: 'p5', categoryId: 'plantation', title: 'Water and Food for Birds 2025', cover: '/images/gallery/events_2025/image31.png' },
  { id: 'p6', categoryId: 'plantation', title: 'FIT India Rally', cover: '/images/gallery/events_2025/image28.png' },
  { id: 'p7', categoryId: 'plantation', title: 'Washroom Restoration', cover: '/images/gallery/events_2025/image30.png' },
  { id: 'p8', categoryId: 'plantation', title: 'Nukkad Natak (Plastic Free Campus)', cover: '/images/gallery/events_2025/image33.png' },

  // Blood Donation Drives
  { id: 'b1', categoryId: 'blood', title: 'Blood Donation Camp', cover: '/images/gallery/events_2025/image28.png' },
  { id: 'b2', categoryId: 'blood', title: 'Blood Donation Camp (Year 2)', cover: '/images/gallery/events_2025/image34.png' },
  { id: 'b3', categoryId: 'blood', title: 'Blood Donation Camp (Year 3)', cover: '/images/gallery/events_2025/image31.png' },
  { id: 'b4', categoryId: 'blood', title: 'Blood Donation', cover: '/images/gallery/events_2025/image32.png' },
  { id: 'b5', categoryId: 'blood', title: 'Blood Donation 2026', cover: '/images/gallery/events_2025/image1.png' },

  // Awareness Campaigns
  { id: 'a1', categoryId: 'awareness', title: 'Nukkad Natak', cover: '/images/gallery/events_2025/image33.png' },
  { id: 'a2', categoryId: 'awareness', title: 'Nukkad Natak – Women Empowerment', cover: '/images/gallery/events_2025/image30.png' },
  { id: 'a3', categoryId: 'awareness', title: 'National Youth Parliament', cover: '/images/gallery/events_2025/image1.png' },
  { id: 'a4', categoryId: 'awareness', title: 'National Youth Parliament 2025', cover: '/images/gallery/events_2025/image2.png' },
  { id: 'a5', categoryId: 'awareness', title: 'National Youth Parliament 2026', cover: '/images/gallery/events_2025/image28.png' },
  { id: 'a6', categoryId: 'awareness', title: 'Nodal District-Level Round of the Viksit Bharat Youth Parliament 2025', cover: '/images/gallery/events_2025/image29.png' },
  { id: 'a7', categoryId: 'awareness', title: 'Eye Check Up Camp', cover: '/images/gallery/events_2025/image34.png' },
  { id: 'a8', categoryId: 'awareness', title: 'Free Eye & Dental Checkup Camp', cover: '/images/gallery/events_2025/image31.png' },
  { id: 'a9', categoryId: 'awareness', title: 'Cloth Donation Drive', cover: '/images/gallery/events_2025/image32.png' },
  { id: 'a10', categoryId: 'awareness', title: 'Ambedkar Jayanti Celebration', cover: '/images/gallery/events_2025/image1.png' },

  // Youth Development
  { id: 'y1', categoryId: 'youth', title: 'Orientation Program 2024', cover: '/images/gallery/events_2025/image29.png' },
  { id: 'y2', categoryId: 'youth', title: 'Orientation Program 2025', cover: '/images/gallery/events_2025/image30.png' },
  { id: 'y3', categoryId: 'youth', title: 'MANIT Visit', cover: '/images/gallery/events_2025/image28.png' },
  { id: 'y4', categoryId: 'youth', title: 'Convocation Volunteering', cover: '/images/gallery/events_2025/image1.png' },
  { id: 'y5', categoryId: 'youth', title: '5th Annual Convocation', cover: '/images/gallery/events_2025/image33.png' },
  { id: 'y6', categoryId: 'youth', title: 'Event of Home Minister', cover: '/images/gallery/events_2025/image34.png' },
  { id: 'y7', categoryId: 'youth', title: 'B-Certificate Examination 2026', cover: '/images/gallery/events_2025/image2.png' },

  // Cultural Events
  { id: 'cu1', categoryId: 'cultural', title: 'Har Ghar Tiranga', cover: '/images/gallery/events_2025/image30.png' },
  { id: 'cu2', categoryId: 'cultural', title: 'Independence Day', cover: '/images/gallery/events_2025/image31.png' },
  { id: 'cu3', categoryId: 'cultural', title: 'Republic Day Parade', cover: '/images/gallery/events_2025/image32.png' },
  { id: 'cu4', categoryId: 'cultural', title: 'VIBGYOR', cover: '/images/gallery/events_2025/image28.png' },
  { id: 'cu5', categoryId: 'cultural', title: 'UNGLI PE TILAK', cover: '/images/gallery/events_2025/image34.png' },
  { id: 'cu6', categoryId: 'cultural', title: 'NSS Week', cover: '/images/gallery/events_2025/image29.png' },
  { id: 'cu7', categoryId: 'cultural', title: 'NSS Week (Swaccha Hi Seva)', cover: '/images/gallery/events_2025/image1.png' }
];

export default function GalleryPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const filteredSubCategories = selectedCategoryId 
    ? subCategories.filter(s => s.categoryId === selectedCategoryId)
    : [];

  return (
    <div className="min-h-screen pt-24 bg-gray-50 pb-20">
      
      {/* Header */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Media <span className="text-nss-red">Gallery</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-600 max-w-2xl mx-auto">
            A visual journey through our impactful initiatives and memorable moments.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-6xl">
        <AnimatePresence mode="wait">
          {!selectedCategoryId ? (
            /* Categories Menu View */
            <motion.div
              key="categories-menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6 max-w-5xl mx-auto"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group relative h-48 md:h-64 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  {/* Background Image */}
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Dark Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent"></div>
                  
                  {/* Geometric Overlay (Right Side) */}
                  <div className="absolute right-0 top-0 bottom-0 w-2/3 md:w-1/2 overflow-hidden pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute -right-20 -top-40 w-[30rem] h-[30rem] bg-white/10 backdrop-blur-sm rotate-45 transform origin-center"></div>
                    <div className="absolute right-10 -bottom-40 w-[20rem] h-[20rem] bg-white/20 backdrop-blur-md rotate-45 transform origin-center border border-white/30"></div>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="relative">
                      <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md relative z-10 mb-2">
                        {category.title}
                      </h3>
                      <div className="flex items-center gap-2 text-white/80 font-medium">
                        <FolderOpen size={18} />
                        <span>{subCategories.filter(s => s.categoryId === category.id).length} Albums</span>
                      </div>
                    </div>
                    {/* Yellow Accent Bar */}
                    <div className="absolute bottom-8 right-12 w-24 h-4 bg-yellow-400 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 z-10 hidden md:block shadow-lg"></div>
                    <div className="absolute bottom-8 right-8 w-16 h-3 bg-yellow-400 z-10 md:hidden shadow-lg"></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Subcategories (Albums) Detail View */
            <motion.div
              key="category-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Detail Header */}
              <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <button 
                    onClick={() => setSelectedCategoryId(null)}
                    className="flex items-center gap-2 text-gray-500 hover:text-nss-blue font-semibold mb-4 transition-colors group"
                  >
                    <ArrowLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" />
                    Back to Categories
                  </button>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900">{selectedCategory?.title}</h2>
                </div>
                
                <div className="h-1 w-24 bg-yellow-400 rounded-full md:hidden"></div>
              </div>

              {/* Grid of Albums */}
              {filteredSubCategories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {filteredSubCategories.map((sub, index) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        key={sub.id}
                        className="relative rounded-3xl overflow-hidden cursor-pointer group bg-gray-100 shadow-md hover:shadow-2xl transition-all aspect-square md:aspect-[4/3]"
                        onClick={() => setSelectedMedia({ type: 'photo', src: sub.cover, title: sub.title })}
                      >
                        <img src={sub.cover} alt={sub.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transform scale-90 group-hover:scale-100 transition-transform">
                            <ImageIcon size={28} />
                          </div>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between z-10">
                          <h4 className="text-white font-bold text-xl leading-tight drop-shadow-md pr-4">{sub.title}</h4>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <FolderOpen size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-700">No albums found</h3>
                  <p className="text-gray-500">Albums coming soon to this category!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Lightbox Modal for Albums */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-10"
              onClick={() => setSelectedMedia(null)}
            >
              <X size={24} />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-6xl h-[85vh] rounded-2xl overflow-hidden flex flex-col relative bg-transparent`}
            >
              <div className="w-full h-full flex items-center justify-center relative">
                 <img src={selectedMedia.src} alt={selectedMedia.title} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"/>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                 <h2 className="text-2xl font-bold text-white text-center">{selectedMedia.title}</h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
