'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, ArrowLeft, Image as ImageIcon, Loader2, ArrowRight } from 'lucide-react';
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
  { 
    id: 'camps', 
    title: 'Special Camps', 
    subtitle: 'Click to explore albums & photos from our 7-day rural camps and community outreaches.',
    themeColor: 'from-blue-600/30'
  },
  { 
    id: 'plantation', 
    title: 'Plantation & Environment', 
    subtitle: 'Explore albums covering tree plantation drives, bird feeder installations, and green initiatives.',
    themeColor: 'from-emerald-600/30'
  },
  { 
    id: 'blood', 
    title: 'Blood Donation Drives', 
    subtitle: 'View photo collections from mega voluntary blood donation camps and donor rallies.',
    themeColor: 'from-rose-600/30'
  },
  { 
    id: 'awareness', 
    title: 'Awareness Campaigns', 
    subtitle: 'Browse albums of street plays (Nukkad Natak), free health checkups, and social drives.',
    themeColor: 'from-amber-600/30'
  },
  { 
    id: 'youth', 
    title: 'Youth Development', 
    subtitle: 'Explore albums from the National Youth Parliament, debate rounds, and orientation programs.',
    themeColor: 'from-indigo-600/30'
  },
  { 
    id: 'cultural', 
    title: 'Cultural Events', 
    subtitle: 'View celebration photos from VIBGYOR, Nirvana Bhajan Clubbing, and cultural unity showcases.',
    themeColor: 'from-purple-600/30'
  }
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
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 pt-20 pb-24 relative overflow-hidden font-sans">
      
      {/* Soft Ambient Background Glows & Texture */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-blue-100/50 via-indigo-50/30 to-transparent pointer-events-none blur-3xl -z-10" />
      <div className="absolute top-48 -left-20 w-[400px] h-[400px] bg-blue-200/25 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-72 -right-20 w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.18] pointer-events-none -z-10" />

      {/* Hero Header Section */}
      <section className="relative w-full pt-14 pb-10 px-4 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            Media <span className="bg-gradient-to-r from-nss-blue via-blue-600 to-indigo-600 bg-clip-text text-transparent">Gallery</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-base md:text-lg font-medium max-w-2xl mx-auto mt-3 leading-relaxed">
            Capturing moments of dedication, service, and youth leadership across all NSS social initiatives.
          </p>

          {/* Quick Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-white/90 hover:bg-white text-gray-700 hover:text-nss-blue border border-gray-200/90 shadow-sm hover:shadow transition-all"
              >
                {cat.title}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Main Content Area */}
      <section className="container mx-auto px-4 py-6 max-w-6xl">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-nss-blue" size={40} /></div>
        ) : (
          <AnimatePresence mode="wait">
            {!selectedCategoryId ? (
              /* Categories Menu View: Full-Bleed Photos Background with Title & Actions Overlaid */
              <motion.div
                key="categories-menu"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-7 max-w-5xl mx-auto"
              >
                {categories.map((category, index) => {
                  const catFolders = folders.filter(f => f.categoryId === category.id);
                  const albumCount = catFolders.length;
                  const collagePhotos = getCategoryPhotos(category.id);

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                      onClick={() => handleSelectCategory(category.id)}
                      className="group relative h-64 sm:h-72 md:h-80 rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-700/20"
                    >
                      {/* Full-Bleed 4-5 Photos Mosaic Background */}
                      {/* Full-Bleed High-Res Cinematic Photo Background (Spanning 100% Width & Height) */}
                      <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-900">
                        <img 
                          src={getImageUrl(collagePhotos[0] || '/images/gallery/events_2025/image1.png', { width: 1400 })} 
                          alt={category.title} 
                          loading="lazy"
                          decoding="async"
                          onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image1.png'; }}
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" 
                        />
                      </div>

                      {/* Smooth Cinematic Vignette & Bottom Gradient (Full image visible with crisp text) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent transition-opacity duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/30" />
                      
                      {/* Accent glow on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${category.themeColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                      {/* Content Overlay */}
                      <div className="absolute inset-0 p-6 sm:p-8 md:p-10 flex flex-col justify-end z-10">
                        <div className="max-w-2xl">
                          {/* Category Title */}
                          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md group-hover:translate-x-1 transition-transform duration-300">
                            {category.title}
                          </h2>

                          {/* Informative Subtitle to let users know albums & photos are inside */}
                          <p className="text-white/85 text-sm sm:text-base mt-2 font-medium leading-relaxed drop-shadow-sm">
                            {category.subtitle}
                          </p>

                          {/* Action Button Badge */}
                          <div className="mt-4 flex items-center gap-3">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-bold group-hover:bg-yellow-400 group-hover:text-yellow-950 group-hover:border-yellow-400 transition-all duration-300 shadow-lg">
                              <FolderOpen size={16} />
                              <span>{albumCount} {albumCount === 1 ? 'Album' : 'Albums'} • View Photos</span>
                              <ArrowRight size={16} className="transform group-hover:translate-x-1.5 transition-transform" />
                            </span>
                          </div>
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
                    <p className="text-gray-500 text-sm mt-1">{selectedCategory?.subtitle}</p>
                  </div>
                  
                  <div className="h-1 w-24 bg-yellow-400 rounded-full md:hidden" />
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
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                              
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
