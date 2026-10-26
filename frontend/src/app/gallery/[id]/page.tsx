'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, X, Image as ImageIcon, ChevronRight, Home } from 'lucide-react';
import api from '@/lib/axios';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

const categoriesMap: Record<string, string> = {
  camps: 'Special Camps',
  plantation: 'Plantation & Environment',
  blood: 'Blood Donation Drives',
  awareness: 'Awareness Campaigns',
  youth: 'Youth Development',
  cultural: 'Cultural Events'
};

function AlbumPhotosContent() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams.get('from');
  
  // Instant 0ms render from pre-cached sessionStorage if opened from gallery
  const [folder, setFolder] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem(`cached_album_${id}`);
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return null;
  });
  
  // Only show full-screen loader if there is NO cached data at all
  const [isLoading, setIsLoading] = useState<boolean>(!folder);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    const fetchFolder = async () => {
      try {
        const response = await api.get(`/gallery/${id}`);
        setFolder(response.data);
        try {
          sessionStorage.setItem(`cached_album_${id}`, JSON.stringify(response.data));
        } catch (e) {}
      } catch (error) {
        if (!folder) {
          console.error('Failed to fetch album', error);
          router.push('/gallery');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchFolder();
  }, [id, router]);

  const handleBack = () => {
    if (fromParam) {
      router.push(fromParam);
      return;
    }
    if (folder?.categoryId) {
      router.push(`/gallery?category=${folder.categoryId}`);
    } else {
      router.push('/gallery');
    }
  };

  if (isLoading && !folder) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="animate-spin text-nss-blue" size={40} />
      </div>
    );
  }

  if (!folder) return null;

  const categoryTitle = categoriesMap[folder.categoryId] || folder.categoryId || 'Gallery';
  const heroCoverUrl = (folder.coverImage && !folder.coverImage.includes('onrender.com/uploads/'))
    ? folder.coverImage
    : (folder.images?.[0] || folder.coverImage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-red-50/20 pt-20 pb-20 relative overflow-hidden">
      {/* Soft Ambient Brand Glows & Texture */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[340px] w-full bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={getImageUrl(heroCoverUrl, { width: 1400 })} 
            alt={folder.title} 
            loading="eager"
            decoding="async"
            onError={(e: any) => {
              if (folder.images && folder.images.length > 0 && e.currentTarget.src !== getImageUrl(folder.images[0])) {
                e.currentTarget.src = getImageUrl(folder.images[0], { width: 1400 });
              } else {
                e.currentTarget.src = '/images/gallery/events_2025/image1.png';
              }
            }}
            className="w-full h-full object-cover opacity-40 blur-[1px]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-end container mx-auto px-4 pb-10 z-10 max-w-6xl">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs md:text-sm text-gray-300 mb-4 overflow-x-auto whitespace-nowrap py-1">
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <Home size={14} /> Home
            </Link>
            <ChevronRight size={14} className="text-gray-500 shrink-0" />
            <Link href="/gallery" className="hover:text-white transition-colors">
              Gallery
            </Link>
            <ChevronRight size={14} className="text-gray-500 shrink-0" />
            <Link 
              href={`/gallery?category=${folder.categoryId}`} 
              className="text-red-400 font-bold hover:underline"
            >
              {categoryTitle}
            </Link>
          </nav>

          {/* Explicit Back Button with Category Retention */}
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-white font-bold mb-4 w-fit transition-all group bg-white/15 hover:bg-nss-red backdrop-blur-md px-4 py-2 rounded-xl text-sm border border-white/20 shadow-md"
          >
            <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to {categoryTitle} Albums</span>
          </button>
          
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              
              {folder.eventDate && (
                <span className="text-white/80 text-sm font-semibold tracking-wide bg-black/40 px-3 py-0.5 rounded-full backdrop-blur-sm">
                  {new Date(folder.eventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md">
              {folder.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Photos Grid with fast edge-compressed loading & lazy hydration */}
      <section className="container mx-auto px-4 py-10 max-w-7xl">
        {folder.images && folder.images.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {folder.images.map((img: string, idx: number) => (
              <div
                key={idx}
                className="relative rounded-2xl overflow-hidden cursor-pointer group break-inside-avoid shadow-md hover:shadow-2xl transition-all duration-300 bg-slate-900 border-2 border-slate-200/90 hover:border-nss-blue"
                onClick={() => setSelectedPhoto(img)}
              >
                <img 
                  src={getImageUrl(img, { width: 800 })} 
                  alt={`${folder.title} - Photo ${idx + 1}`} 
                  loading="lazy"
                  decoding="async"
                  onError={(e: any) => {
                    // One retry attempt in case of temporary network glitch
                    if (!e.currentTarget.dataset.retried) {
                      e.currentTarget.dataset.retried = 'true';
                      setTimeout(() => {
                        e.currentTarget.src = getImageUrl(img);
                      }, 500);
                    } else {
                      e.currentTarget.src = '/images/gallery/events_2025/image1.png';
                    }
                  }}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                    <ImageIcon size={22} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200 shadow-md">
            <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700">No photos yet</h3>
            <p className="text-gray-500 mt-1">Photos will be uploaded to this album soon.</p>
          </div>
        )}
      </section>

      {/* Lightbox Modal (High-Resolution View) */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all z-10"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close photo preview"
            >
              <X size={24} />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-6xl h-[85vh] rounded-2xl overflow-hidden flex flex-col relative bg-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full h-full flex items-center justify-center relative">
                 <img 
                   src={getImageUrl(selectedPhoto)} 
                   alt="Fullscreen view" 
                   loading="eager"
                   decoding="async"
                   onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image1.png'; }}
                   className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                 />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function AlbumPhotosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center bg-gray-50"><Loader2 className="animate-spin text-nss-blue" size={40} /></div>}>
      <AlbumPhotosContent />
    </Suspense>
  );
}
