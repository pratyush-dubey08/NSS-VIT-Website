'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

const categories = [
  { id: 'camps', title: 'Special Camps', image: '/images/gallery/events_2025/image1.png' },
  { id: 'plantation', title: 'Plantation & Environment', image: '/images/gallery/events_2025/image29.png' },
  { id: 'blood', title: 'Blood Donation Drives', image: '/images/gallery/events_2025/image28.png' },
  { id: 'awareness', title: 'Awareness Campaigns', image: '/images/gallery/events_2025/image33.png' },
  { id: 'youth', title: 'Youth Development', image: '/images/gallery/events_2025/image1.png' },
  { id: 'cultural', title: 'Cultural Events', image: '/images/gallery/events_2025/image30.png' }
];

export default function GalleryPage() {
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  const [folders, setFolders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await api.get('/gallery');
        setFolders(response.data);
      } catch (error) {
        console.error('Failed to fetch gallery folders', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFolders();
  }, []);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const filteredFolders = selectedCategoryId 
    ? folders.filter(f => f.categoryId === selectedCategoryId)
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
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-nss-blue" size={40} /></div>
        ) : (
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
                    
                    {/* Geometric Overlay */}
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
                          <span>{folders.filter(f => f.categoryId === category.id).length} Albums</span>
                        </div>
                      </div>
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
                {filteredFolders.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                      {filteredFolders.map((folder, index) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          key={folder._id}
                          className="relative rounded-3xl overflow-hidden cursor-pointer group bg-gray-100 shadow-md hover:shadow-2xl transition-all aspect-square md:aspect-[4/3]"
                          onClick={() => router.push(`/gallery/${folder._id}`)}
                        >
                          <img src={folder.coverImage} alt={folder.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transform scale-90 group-hover:scale-100 transition-transform">
                              <ImageIcon size={28} />
                            </div>
                          </div>
                          
                          <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end z-10">
                            <h4 className="text-white font-bold text-xl leading-tight drop-shadow-md pr-4">{folder.title}</h4>
                            <p className="text-white/80 text-sm mt-1">{folder.images?.length || 0} Photos</p>
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
        )}
      </section>
    </div>
  );
}
