'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, X, Image as ImageIcon } from 'lucide-react';
import api from '@/lib/axios';

export default function AlbumPhotosPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [folder, setFolder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        const response = await api.get(`/gallery/${id}`);
        setFolder(response.data);
      } catch (error) {
        console.error('Failed to fetch album', error);
        router.push('/gallery');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFolder();
  }, [id, router]);

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-nss-blue" size={40} /></div>;
  }

  if (!folder) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] w-full bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img src={folder.coverImage} alt={folder.title} className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-end container mx-auto px-4 pb-12 z-10">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/70 hover:text-white font-medium mb-6 w-fit transition-colors group"
          >
            <ArrowLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" /> Back to Gallery
          </button>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
              {folder.images?.length || 0} Photos
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-md">
              {folder.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Photos Grid */}
      <section className="container mx-auto px-4 py-12 max-w-7xl">
        {folder.images && folder.images.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {folder.images.map((img: string, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 10) * 0.1 }}
                className="relative rounded-2xl overflow-hidden cursor-pointer group break-inside-avoid shadow-sm hover:shadow-xl transition-all"
                onClick={() => setSelectedPhoto(img)}
              >
                <img src={img} alt={`${folder.title} - Photo ${idx + 1}`} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700">No photos yet</h3>
            <p className="text-gray-500">Photos will be uploaded soon.</p>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-10"
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={24} />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-6xl h-[85vh] rounded-2xl overflow-hidden flex flex-col relative bg-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full h-full flex items-center justify-center relative">
                 <img src={selectedPhoto} alt="Fullscreen view" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"/>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
