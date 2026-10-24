'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ImageIcon, Loader2, Camera, ArrowRight } from 'lucide-react';
import api from '@/lib/axios';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

// Curated default high-quality Cloudinary photos for each category (fallback & initial preview)
const defaultCategoryCollages: Record<string, string[]> = {
  camps: [
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792709660/nss_vit_website/qfbsotsgpnuh2dbecoya.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792709665/nss_vit_website/yj8uz0yohtwf5oq85wmp.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792709676/nss_vit_website/eeqek1zp4z6atwc022bv.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792709685/nss_vit_website/o1wdkrp1poe6z9uuxl7l.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792709698/nss_vit_website/fxa3szxen2tqzdz4n6n0.jpg"
  ],
  plantation: [
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790377/nss_vit_website/ke8hwjewhh35reol1qbv.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790380/nss_vit_website/ldxhofed2qko3xgkalrw.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790381/nss_vit_website/bar2sk4mguwxzroe1exp.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790383/nss_vit_website/vm7wh3c4bpu3ylp9cmx3.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792790385/nss_vit_website/ofvu3md9bg1xkm5m8jqc.jpg"
  ],
  blood: [
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792794532/nss_vit_website/fjvlh83zvtgjeiayirax.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792794533/nss_vit_website/pm6eue5t9coe59d7hce9.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792794532/nss_vit_website/xcnghddndbrvr05225lm.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792794535/nss_vit_website/npsnlvekn9hxvmuwqrgf.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792794535/nss_vit_website/tnnj3irieq9co4kuo73j.jpg"
  ],
  awareness: [
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792795580/nss_vit_website/opbucqx5beivc4k9pcxd.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792795580/nss_vit_website/wujfnuwh9mbuh6u7kr5g.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792795580/nss_vit_website/s4wrfehl0j0lu1tguiq8.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792795582/nss_vit_website/qnp5jzpwbj2o2shca73q.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792795584/nss_vit_website/uuiokp80ag8zfrpknxf1.jpg"
  ],
  youth: [
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792794963/nss_vit_website/duyqgmytyjpbjf36zabx.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792794963/nss_vit_website/oqbgqena30fn1loiwn4v.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792794963/nss_vit_website/xzh8bh25enhtecugu5sd.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792794965/nss_vit_website/cnewqd5accsbqxlmkhjg.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792794965/nss_vit_website/afdbif6kf6hpnht6uiei.jpg"
  ],
  cultural: [
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792800100/nss_vit_website/zb6dm7mssu9zl2vrilsg.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792800100/nss_vit_website/vq9aaeaoul9ywrjck3uw.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792800100/nss_vit_website/djtlyrwaylgya3ueblsz.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792800102/nss_vit_website/ouzfsxckmemdr62pochx.jpg",
    "https://res.cloudinary.com/lrsgx9ti/image/upload/v1792800102/nss_vit_website/hapaxanwyomvfgdz2fxu.jpg"
  ]
};

const categories = [
  { id: 'camps', title: 'Special Camps', borderHover: 'hover:border-blue-300' },
  { id: 'plantation', title: 'Plantation & Environment', borderHover: 'hover:border-emerald-300' },
  { id: 'blood', title: 'Blood Donation Drives', borderHover: 'hover:border-rose-300' },
  { id: 'awareness', title: 'Awareness Campaigns', borderHover: 'hover:border-amber-300' },
  { id: 'youth', title: 'Youth Development', borderHover: 'hover:border-indigo-300' },
  { id: 'cultural', title: 'Cultural Events', borderHover: 'hover:border-purple-300' }
];

function GalleryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [folders, setFolders] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('all_gallery_folders');
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(folders.length === 0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categoryParam);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await api.get('/gallery');
        setFolders(response.data);
        try {
          sessionStorage.setItem('all_gallery_folders', JSON.stringify(response.data));
          // Pre-cache individual albums for instant 0ms open
          for (const f of response.data) {
            sessionStorage.setItem(`cached_album_${f._id}`, JSON.stringify(f));
          }
        } catch (e) {}
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

  const handleOpenAlbum = (folder: any) => {
    try {
      sessionStorage.setItem(`cached_album_${folder._id}`, JSON.stringify(folder));
    } catch (e) {}
  };

  const getCoverSrc = (folder: any) => {
    if (folder.coverImage && !folder.coverImage.includes('onrender.com/uploads/')) {
      return folder.coverImage;
    }
    if (folder.images && folder.images.length > 0) {
      return folder.images[0];
    }
    return folder.coverImage || '/images/gallery/events_2025/image1.png';
  };

  // Extract 5 best photos for each category dynamically from uploaded albums
  const getCategoryPhotos = useMemo(() => {
    return (categoryId: string): string[] => {
      const dynamicPhotos: string[] = [];
      const catAlbums = folders.filter(f => f.categoryId === categoryId);
      for (const album of catAlbums) {
        if (album.images && Array.isArray(album.images)) {
          for (const img of album.images) {
            if (img && typeof img === 'string' && img.includes('cloudinary.com') && !dynamicPhotos.includes(img)) {
              dynamicPhotos.push(img);
            }
          }
        }
      }
      if (dynamicPhotos.length >= 5) {
        return dynamicPhotos.slice(0, 5);
      }
      const fallback = defaultCategoryCollages[categoryId] || [];
      const combined = [...dynamicPhotos];
      for (const fb of fallback) {
        if (combined.length < 5 && !combined.includes(fb)) {
          combined.push(fb);
        }
      }
      return combined.length > 0 ? combined : fallback;
    };
  }, [folders]);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const filteredFolders = folders.filter(f => f.categoryId === selectedCategoryId);

  return (
    <div className="min-h-screen bg-slate-50/60 pt-20 pb-24">
      
      {/* Light Theme Hero Section (Clean, without the 3 stat cards) */}
      <section className="relative w-full bg-gradient-to-b from-blue-50/70 via-white to-slate-50/50 pt-16 pb-12 px-4 border-b border-gray-100 overflow-hidden">
        {/* Subtle decorative radial glow accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-r from-blue-100/35 via-indigo-50/35 to-amber-50/25 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-200/70 shadow-sm text-nss-blue font-bold text-xs uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-nss-blue animate-pulse"></span>
              <Camera size={14} className="text-nss-blue" />
              <span>Official Media Archive</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
              Media <span className="bg-gradient-to-r from-nss-blue via-blue-700 to-indigo-800 bg-clip-text text-transparent">Gallery</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-base md:text-lg font-medium max-w-2xl mx-auto mt-3 leading-relaxed">
              Capturing moments of dedication, service, and youth leadership across all NSS social initiatives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container mx-auto px-4 py-10 max-w-6xl">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-nss-blue" size={40} /></div>
        ) : (
          <AnimatePresence mode="wait">
            {!selectedCategoryId ? (
              /* Categories Menu View with Clean Title Only and Full-Bleed 5-Photo Collage */
              <motion.div
                key="categories-menu"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6 max-w-5xl mx-auto"
              >
                {categories.map((category, index) => {
                  const collagePhotos = getCategoryPhotos(category.id);

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07 }}
                      onClick={() => handleSelectCategory(category.id)}
                      className={`group relative bg-white rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer flex flex-col md:flex-row items-center ${category.borderHover}`}
                    >
                      {/* Left: ONLY Category Title & Subtle Arrow */}
                      <div className="w-full md:w-2/5 p-8 sm:p-10 flex items-center justify-between z-10 bg-white">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight group-hover:text-nss-blue transition-colors">
                          {category.title}
                        </h2>
                        <ArrowRight size={22} className="text-gray-400 group-hover:text-nss-blue group-hover:translate-x-2 transition-all duration-300 shrink-0 ml-4 hidden md:block" />
                      </div>

                      {/* Right: 4-5 Photos Full-Bleed Angled Landscape Collage */}
                      <div className="relative w-full md:w-3/5 h-56 sm:h-64 md:h-68 overflow-hidden flex items-center justify-center p-4 bg-gradient-to-r from-slate-50 via-gray-50/80 to-blue-50/30 border-t md:border-t-0 md:border-l border-gray-100">
                        {/* Soft decorative background glows */}
                        <div className="absolute right-0 bottom-0 w-48 h-48 bg-blue-100/40 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute left-10 top-0 w-36 h-36 bg-yellow-100/30 rounded-full blur-xl pointer-events-none" />

                        {/* Overlapping Angled Photos Stack - Full Landscape Cards (aspect-[4/3]), Zero Empty Gray Spaces */}
                        <div className="relative flex items-center justify-center w-full max-w-lg h-full py-4 scale-[0.88] sm:scale-95 md:scale-100 origin-center">
                          {/* Photo 1 (far left, tilted -8deg) */}
                          {collagePhotos[0] && (
                            <div className="absolute left-[2%] sm:left-[4%] w-28 sm:w-36 md:w-40 aspect-[4/3] rounded-2xl overflow-hidden border-4 border-white shadow-md transform -rotate-8 -translate-y-2 group-hover:-rotate-12 group-hover:-translate-x-3 transition-all duration-500">
                              <img 
                                src={getImageUrl(collagePhotos[0], { width: 500 })} 
                                alt={`${category.title} 1`} 
                                loading="lazy"
                                decoding="async"
                                onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image1.png'; }}
                                className="absolute inset-0 w-full h-full object-cover" 
                              />
                            </div>
                          )}

                          {/* Photo 2 (mid left, tilted -3deg) */}
                          {collagePhotos[1] && (
                            <div className="absolute left-[18%] sm:left-[22%] w-28 sm:w-36 md:w-40 aspect-[4/3] rounded-2xl overflow-hidden border-4 border-white shadow-lg transform -rotate-3 translate-y-3 group-hover:-rotate-5 group-hover:-translate-y-1 transition-all duration-500">
                              <img 
                                src={getImageUrl(collagePhotos[1], { width: 500 })} 
                                alt={`${category.title} 2`} 
                                loading="lazy"
                                decoding="async"
                                onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image2.png'; }}
                                className="absolute inset-0 w-full h-full object-cover" 
                              />
                            </div>
                          )}

                          {/* Photo 3 (center hero, elevated z-10) */}
                          {collagePhotos[2] && (
                            <div className="relative z-10 w-32 sm:w-40 md:w-44 aspect-[4/3] rounded-2xl overflow-hidden border-4 border-white shadow-2xl transform rotate-1 group-hover:scale-105 group-hover:rotate-0 transition-all duration-500">
                              <img 
                                src={getImageUrl(collagePhotos[2], { width: 600 })} 
                                alt={`${category.title} 3`} 
                                loading="lazy"
                                decoding="async"
                                onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image28.png'; }}
                                className="absolute inset-0 w-full h-full object-cover" 
                              />
                            </div>
                          )}

                          {/* Photo 4 (mid right, tilted +5deg) */}
                          {collagePhotos[3] && (
                            <div className="absolute right-[18%] sm:right-[22%] w-28 sm:w-36 md:w-40 aspect-[4/3] rounded-2xl overflow-hidden border-4 border-white shadow-lg transform rotate-5 translate-y-2 group-hover:rotate-8 group-hover:translate-x-2 transition-all duration-500">
                              <img 
                                src={getImageUrl(collagePhotos[3], { width: 500 })} 
                                alt={`${category.title} 4`} 
                                loading="lazy"
                                decoding="async"
                                onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image29.png'; }}
                                className="absolute inset-0 w-full h-full object-cover" 
                              />
                            </div>
                          )}

                          {/* Photo 5 (far right, tilted +9deg) */}
                          {collagePhotos[4] && (
                            <div className="absolute right-[2%] sm:right-[4%] w-28 sm:w-36 md:w-40 aspect-[4/3] rounded-2xl overflow-hidden border-4 border-white shadow-md transform rotate-9 -translate-y-2 group-hover:rotate-14 group-hover:translate-x-4 transition-all duration-500">
                              <img 
                                src={getImageUrl(collagePhotos[4], { width: 500 })} 
                                alt={`${category.title} 5`} 
                                loading="lazy"
                                decoding="async"
                                onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image30.png'; }}
                                className="absolute inset-0 w-full h-full object-cover" 
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              /* Subcategories (Albums) Detail View */
              <motion.div
                key="category-detail"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {/* Detail Header & Breadcrumb */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <button 
                      onClick={handleBackToCategories}
                      className="flex items-center gap-2 text-gray-700 hover:text-nss-blue font-semibold mb-3 transition-colors group text-sm md:text-base bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200/80 w-fit"
                    >
                      <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
                      Back to All Categories
                    </button>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-2">{selectedCategory?.title}</h2>
                  </div>
                  
                  <div className="h-1 w-24 bg-yellow-400 rounded-full md:hidden"></div>
                </div>

                {/* Grid of Albums with Instant Link Prefetch (Photo counts hidden as requested) */}
                {filteredFolders.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <AnimatePresence>
                      {filteredFolders.map((folder, index) => {
                        const coverUrl = getCoverSrc(folder);
                        return (
                          <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: index * 0.04 }}
                            key={folder._id}
                          >
                            <Link
                              href={`/gallery/${folder._id}`}
                              prefetch={true}
                              onClick={() => handleOpenAlbum(folder)}
                              className="block relative rounded-3xl overflow-hidden cursor-pointer group bg-gray-200 shadow-md hover:shadow-2xl transition-all aspect-square md:aspect-[4/3] border border-gray-100"
                            >
                              <img 
                                src={getImageUrl(coverUrl, { width: 600 })} 
                                alt={folder.title} 
                                loading="lazy"
                                decoding="async"
                                onError={(e: any) => {
                                  if (folder.images && folder.images.length > 0 && e.currentTarget.src !== getImageUrl(folder.images[0])) {
                                    e.currentTarget.src = getImageUrl(folder.images[0], { width: 600 });
                                  } else {
                                    e.currentTarget.src = '/images/gallery/events_2025/image1.png';
                                  }
                                }}
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
                                {folder.eventDate && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-white/80 text-xs md:text-sm font-medium">
                                      {new Date(folder.eventDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
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
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center bg-slate-50"><Loader2 className="animate-spin text-nss-blue" size={40} /></div>}>
      <GalleryContent />
    </Suspense>
  );
}
