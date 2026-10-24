'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, ArrowLeft, Image as ImageIcon, Loader2, Sparkles, ArrowRight, Layers, Camera } from 'lucide-react';
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
    badge: 'Annual Outreaches',
    description: 'Immersive 7-day community service, village development, rural surveys, and youth empowerment camps.',
    accent: 'blue',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-700',
    borderHover: 'hover:border-blue-400',
    glowColor: 'rgba(37, 99, 235, 0.08)'
  },
  {
    id: 'plantation',
    title: 'Plantation & Environment',
    badge: 'Eco Conservation',
    description: 'Mega tree plantation drives, seed-ball making, bird feeder installations, and cleanliness marches.',
    accent: 'emerald',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-700',
    borderHover: 'hover:border-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.08)'
  },
  {
    id: 'blood',
    title: 'Blood Donation Drives',
    badge: 'Life Savers',
    description: 'Mega voluntary blood donation camps, donor motivation rallies, and emergency donor support network.',
    accent: 'rose',
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-700',
    borderHover: 'hover:border-rose-400',
    glowColor: 'rgba(244, 63, 94, 0.08)'
  },
  {
    id: 'awareness',
    title: 'Awareness Campaigns',
    badge: 'Social Advocacy',
    description: 'Nukkad Nataks on voting rights, free eye & dental checkups, cloth donation, and women empowerment.',
    accent: 'amber',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-700',
    borderHover: 'hover:border-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.08)'
  },
  {
    id: 'youth',
    title: 'Youth Development',
    badge: 'Future Leaders',
    description: 'Viksit Bharat National Youth Parliament, parliamentary debates, leadership summits, and orientations.',
    accent: 'indigo',
    accentBg: 'bg-indigo-50',
    accentText: 'text-indigo-700',
    borderHover: 'hover:border-indigo-400',
    glowColor: 'rgba(99, 102, 241, 0.08)'
  },
  {
    id: 'cultural',
    title: 'Cultural Events',
    badge: 'Heritage & Spirit',
    description: 'VIBGYOR celebrations, Nirvana bhajan clubbing, festive gatherings, and cultural unity showcases.',
    accent: 'purple',
    accentBg: 'bg-purple-50',
    accentText: 'text-purple-700',
    borderHover: 'hover:border-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.08)'
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
      // If fewer than 5 uploaded, fill remaining slots with default curated photos
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

  // Total photos count across all albums
  const totalPhotosCount = useMemo(() => {
    return folders.reduce((sum, f) => sum + (f.images?.length || 0), 0);
  }, [folders]);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const filteredFolders = folders.filter(f => f.categoryId === selectedCategoryId);

  return (
    <div className="min-h-screen bg-slate-50/60 pt-20 pb-24">
      
      {/* Light Theme Hero Section */}
      <section className="relative w-full bg-gradient-to-b from-blue-50/80 via-white to-slate-50/60 pt-16 pb-14 px-4 border-b border-gray-100 overflow-hidden">
        {/* Subtle decorative radial glow accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-100/40 via-indigo-50/40 to-amber-50/30 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -left-12 top-1/2 w-64 h-64 bg-yellow-100/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -right-12 bottom-0 w-64 h-64 bg-blue-100/30 rounded-full blur-2xl pointer-events-none" />

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

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-8">
              <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-nss-blue flex items-center justify-center font-bold text-sm">
                  {categories.length}
                </div>
                <div className="text-left">
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Categories</p>
                  <p className="text-sm font-bold text-gray-900">All Initiatives</p>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                  {folders.length || 43}
                </div>
                <div className="text-left">
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Albums</p>
                  <p className="text-sm font-bold text-gray-900">Event Archives</p>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  {totalPhotosCount > 0 ? totalPhotosCount : '210+'}
                </div>
                <div className="text-left">
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Photos</p>
                  <p className="text-sm font-bold text-gray-900">Moments Captured</p>
                </div>
              </div>
            </div>
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
              /* Categories Menu View with Dynamic 4-5 Photos Angled Collage */
              <motion.div
                key="categories-menu"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-8 max-w-5xl mx-auto"
              >
                {categories.map((category, index) => {
                  const catFolders = folders.filter(f => f.categoryId === category.id);
                  const albumCount = catFolders.length;
                  const photoCount = catFolders.reduce((sum, f) => sum + (f.images?.length || 0), 0);
                  const collagePhotos = getCategoryPhotos(category.id);

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07 }}
                      onClick={() => handleSelectCategory(category.id)}
                      className={`group relative bg-white rounded-3xl border border-gray-200/80 shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer flex flex-col lg:flex-row items-stretch ${category.borderHover}`}
                    >
                      {/* Left: Category Content */}
                      <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-between z-10 bg-white/95">
                        <div>
                          {/* Badge */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${category.accentBg} ${category.accentText}`}>
                              {category.badge}
                            </span>
                            <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                              <FolderOpen size={13} /> {albumCount} {albumCount === 1 ? 'Album' : 'Albums'}
                            </span>
                          </div>

                          {/* Category Title */}
                          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight group-hover:text-nss-blue transition-colors">
                            {category.title}
                          </h2>

                          {/* Description */}
                          <p className="text-gray-600 text-sm sm:text-base mt-2.5 leading-relaxed font-normal">
                            {category.description}
                          </p>
                        </div>

                        {/* Footer Info & Action */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                            <ImageIcon size={14} className="text-gray-400" />
                            <span>{photoCount > 0 ? `${photoCount} Photos` : 'Explore Archive'}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm font-bold text-nss-blue group-hover:translate-x-1.5 transition-transform duration-300">
                            <span>View Albums</span>
                            <ArrowRight size={18} />
                          </div>
                        </div>
                      </div>

                      {/* Right: 4-5 Photos Angled Collage */}
                      <div className="relative w-full lg:w-3/5 h-64 sm:h-72 lg:h-auto min-h-[260px] overflow-hidden flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-100/80 via-gray-50 to-blue-50/40 border-t lg:border-t-0 lg:border-l border-gray-100">
                        {/* Soft decorative background circles */}
                        <div className="absolute -right-8 -bottom-8 w-56 h-56 bg-blue-100/50 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute left-8 top-0 w-44 h-44 bg-yellow-100/40 rounded-full blur-xl pointer-events-none" />

                        {/* Overlapping Angled Photos Stack */}
                        <div className="relative flex items-center justify-center w-full max-w-lg h-full py-2 scale-[0.88] sm:scale-95 lg:scale-100 origin-center">
                          {/* Photo 1 (far left, tilted -8deg) */}
                          {collagePhotos[0] && (
                            <div className="absolute left-[3%] sm:left-[5%] w-24 sm:w-28 md:w-32 aspect-[3/4] rounded-2xl overflow-hidden border-4 border-white shadow-lg transform -rotate-8 -translate-y-2 group-hover:-rotate-12 group-hover:-translate-x-3 transition-all duration-500 bg-gray-200">
                              <img 
                                src={getImageUrl(collagePhotos[0], { width: 400 })} 
                                alt={`${category.title} 1`} 
                                loading="lazy"
                                decoding="async"
                                onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image1.png'; }}
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          )}

                          {/* Photo 2 (mid left, tilted -3deg) */}
                          {collagePhotos[1] && (
                            <div className="absolute left-[20%] sm:left-[23%] w-24 sm:w-28 md:w-32 aspect-[3/4] rounded-2xl overflow-hidden border-4 border-white shadow-xl transform -rotate-3 translate-y-3 group-hover:-rotate-5 group-hover:-translate-y-1 transition-all duration-500 bg-gray-200">
                              <img 
                                src={getImageUrl(collagePhotos[1], { width: 400 })} 
                                alt={`${category.title} 2`} 
                                loading="lazy"
                                decoding="async"
                                onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image2.png'; }}
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          )}

                          {/* Photo 3 (center hero, elevated z-10) */}
                          {collagePhotos[2] && (
                            <div className="relative z-10 w-28 sm:w-32 md:w-36 aspect-[3/4] rounded-2xl overflow-hidden border-4 border-white shadow-2xl transform rotate-1 group-hover:scale-105 group-hover:rotate-0 transition-all duration-500 bg-gray-200">
                              <img 
                                src={getImageUrl(collagePhotos[2], { width: 500 })} 
                                alt={`${category.title} 3`} 
                                loading="lazy"
                                decoding="async"
                                onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image28.png'; }}
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          )}

                          {/* Photo 4 (mid right, tilted +5deg) */}
                          {collagePhotos[3] && (
                            <div className="absolute right-[20%] sm:right-[23%] w-24 sm:w-28 md:w-32 aspect-[3/4] rounded-2xl overflow-hidden border-4 border-white shadow-xl transform rotate-5 translate-y-2 group-hover:rotate-8 group-hover:translate-x-2 transition-all duration-500 bg-gray-200">
                              <img 
                                src={getImageUrl(collagePhotos[3], { width: 400 })} 
                                alt={`${category.title} 4`} 
                                loading="lazy"
                                decoding="async"
                                onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image29.png'; }}
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          )}

                          {/* Photo 5 (far right, tilted +9deg) */}
                          {collagePhotos[4] && (
                            <div className="absolute right-[3%] sm:right-[5%] w-24 sm:w-28 md:w-32 aspect-[3/4] rounded-2xl overflow-hidden border-4 border-white shadow-lg transform rotate-9 -translate-y-2 group-hover:rotate-14 group-hover:translate-x-4 transition-all duration-500 bg-gray-200">
                              <img 
                                src={getImageUrl(collagePhotos[4], { width: 400 })} 
                                alt={`${category.title} 5`} 
                                loading="lazy"
                                decoding="async"
                                onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image30.png'; }}
                                className="w-full h-full object-cover" 
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
                    <p className="text-gray-500 text-sm mt-1">{selectedCategory?.description}</p>
                  </div>
                  
                  <div className="h-1 w-24 bg-yellow-400 rounded-full md:hidden"></div>
                </div>

                {/* Grid of Albums with Instant Link Prefetch */}
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
                            </Link>
                          </motion.div>
                        );
                      })}
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
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center bg-slate-50"><Loader2 className="animate-spin text-nss-blue" size={40} /></div>}>
      <GalleryContent />
    </Suspense>
  );
}
