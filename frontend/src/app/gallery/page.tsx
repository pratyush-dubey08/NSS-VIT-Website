'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { getImageUrl } from '@/lib/utils';

const categories = [
  {
    id: 'camps',
    title: 'Special Camps',
    image: '/images/gallery/events_2025/image1.png'
  },
  {
    id: 'plantation',
    title: 'Plantation & Environment',
    image: '/images/gallery/events_2025/image2.png'
  },
  {
    id: 'blood',
    title: 'Blood Donation Drives',
    image: '/images/gallery/events_2025/image28.png'
  },
  {
    id: 'awareness',
    title: 'Awareness Campaigns',
    image: '/images/gallery/events_2025/image29.png'
  },
  {
    id: 'youth',
    title: 'Youth Development',
    image: '/images/gallery/events_2025/image30.png'
  },
  {
    id: 'cultural',
    title: 'Cultural Events',
    image: '/images/gallery/events_2025/image31.png'
  }
];

function GalleryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [folders, setFolders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categoryParam);

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

  // Sync state with URL parameter (crucial for Back button retention)
  useEffect(() => {
    setSelectedCategoryId(categoryParam);
  }, [categoryParam]);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    router.push(`/gallery?category=${categoryId}`, { scroll: false });
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
    router.push('/gallery', { scroll: false });
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const filteredFolders = folders.filter(f => f.categoryId === selectedCategoryId);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[320px] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="/images/gallery/events_2025/image1.png" 
            alt="Hero Background" 
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover opacity-20" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-md">
              Media Gallery
            </h1>
            <p className="text-gray-300 text-base md:text-xl font-medium max-w-2xl mx-auto">
              Capturing moments of dedication, service, and youth leadership across all our social initiatives.
            </p>
          </motion.div>
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
                {categories.map((category, index) => {
                  const albumCount = folders.filter(f => f.categoryId === category.id).length;
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      onClick={() => handleSelectCategory(category.id)}
                      className="group relative h-48 md:h-64 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-slate-900"
                    >
                      {/* Background Image with lazy loading and error fallback */}
                      <img 
                        src={category.image} 
                        alt={category.title} 
                        loading="lazy"
                        decoding="async"
                        onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image1.png'; }}
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
                      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                        <div className="relative">
                          <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md relative z-10 mb-2">
                            {category.title}
                          </h3>
                          <div className="flex items-center gap-2 text-white/90 font-medium text-sm md:text-base">
                            <FolderOpen size={18} />
                            <span>{albumCount} {albumCount === 1 ? 'Album' : 'Albums'}</span>
                          </div>
                        </div>
                        <div className="absolute bottom-8 right-12 w-24 h-4 bg-yellow-400 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 z-10 hidden md:block shadow-lg"></div>
                        <div className="absolute bottom-8 right-8 w-16 h-3 bg-yellow-400 z-10 md:hidden shadow-lg"></div>
                      </div>
                    </motion.div>
                  );
                })}
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
                {/* Detail Header & Breadcrumb */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <button 
                      onClick={handleBackToCategories}
                      className="flex items-center gap-2 text-gray-600 hover:text-nss-blue font-semibold mb-3 transition-colors group text-sm md:text-base bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 w-fit"
                    >
                      <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
                      Back to All Categories
                    </button>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-2">{selectedCategory?.title}</h2>
                    <p className="text-gray-500 text-sm mt-1">Browse albums under {selectedCategory?.title}</p>
                  </div>
                  
                  <div className="h-1 w-24 bg-yellow-400 rounded-full md:hidden"></div>
                </div>

                {/* Grid of Albums */}
                {filteredFolders.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <AnimatePresence>
                      {filteredFolders.map((folder, index) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3, delay: index * 0.04 }}
                          key={folder._id}
                          className="relative rounded-3xl overflow-hidden cursor-pointer group bg-gray-100 shadow-md hover:shadow-2xl transition-all aspect-square md:aspect-[4/3]"
                          onClick={() => router.push(`/gallery/${folder._id}`)}
                        >
                          <img 
                            src={getImageUrl(folder.coverImage, { width: 600 })} 
                            alt={folder.title} 
                            loading="lazy"
                            decoding="async"
                            onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image1.png'; }}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transform scale-90 group-hover:scale-100 transition-transform">
                              <ImageIcon size={26} />
                            </div>
                          </div>
                          
                          <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end z-10">
                            <h4 className="text-white font-bold text-lg md:text-xl leading-tight drop-shadow-md pr-4">{folder.title}</h4>
                            <div className="flex items-center gap-2 mt-2">
                              {folder.eventDate && (
                                <>
                                  <span className="text-white/80 text-xs md:text-sm font-medium">
                                    {new Date(folder.eventDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                                  </span>
                                  <span className="text-white/50">•</span>
                                </>
                              )}
                              <p className="text-white/80 text-xs md:text-sm font-medium">{folder.images?.length || 0} Photos</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <FolderOpen size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-700">No albums found</h3>
                    <p className="text-gray-500 mt-1">Albums coming soon to this category!</p>
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

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-nss-blue" size={40} /></div>}>
      <GalleryContent />
    </Suspense>
  );
}
