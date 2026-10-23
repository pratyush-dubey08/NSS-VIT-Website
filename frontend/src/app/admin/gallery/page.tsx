'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Folder, Trash2, Edit, Image as ImageIcon, Loader2, ArrowRight } from 'lucide-react';
import api from '@/lib/axios';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';
import { compressImage } from '@/lib/imageCompressor';

// Use same categories as public gallery
const categories = [
  { id: 'camps', title: 'Special Camps' },
  { id: 'plantation', title: 'Plantation & Environment' },
  { id: 'blood', title: 'Blood Donation Drives' },
  { id: 'awareness', title: 'Awareness Campaigns' },
  { id: 'youth', title: 'Youth Development' },
  { id: 'cultural', title: 'Cultural Events' }
];

function AdminGalleryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [folders, setFolders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);

  // Form states
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('camps');
  const [eventDate, setEventDate] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const fetchFolders = async () => {
    try {
      const response = await api.get('/gallery');
      setFolders(response.data);
    } catch (error) {
      alert('Failed to fetch albums');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      router.push('/admin/gallery');
    } else {
      router.push(`/admin/gallery?category=${catId}`);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !categoryId || !coverImage || !eventDate) {
      alert('Please fill all fields and select a cover image');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('Compressing cover image...');
    try {
      // 1. Fast client-side compression of cover photo
      const compressedCover = await compressImage(coverImage, { maxWidth: 1920, quality: 0.85 });
      
      setStatusMessage('Uploading cover image...');
      const formData = new FormData();
      formData.append('file', compressedCover);
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = uploadRes.data.url || uploadRes.data.fileUrl;

      // 2. Create album folder in DB
      setStatusMessage('Creating album...');
      await api.post('/gallery', {
        title,
        categoryId,
        coverImage: imageUrl,
        eventDate
      });

      alert('Album created successfully!');
      setIsCreateModalOpen(false);
      resetForm();
      fetchFolders();
    } catch (error) {
      console.error(error);
      alert('Failed to create album');
    } finally {
      setIsSubmitting(false);
      setStatusMessage('');
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategoryId('camps');
    setEventDate('');
    setCoverImage(null);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this album? This will remove its database entry.')) return;
    
    try {
      await api.delete(`/gallery/${id}`);
      alert('Album deleted');
      fetchFolders();
    } catch (error) {
      alert('Failed to delete album');
    }
  };

  const filteredFolders = activeCategory === 'all' 
    ? folders 
    : folders.filter(f => f.categoryId === activeCategory);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-500">Manage albums and upload high-resolution photos seamlessly</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-nss-blue text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-900 transition-colors shadow-sm"
        >
          <Plus size={20} /> Create New Album
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-colors ${
            activeCategory === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          All Albums ({folders.length})
        </button>
        {categories.map(cat => {
          const count = folders.filter(f => f.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-colors ${
                activeCategory === cat.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Albums Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-nss-blue" size={40} /></div>
      ) : filteredFolders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFolders.map(folder => (
            <div 
              key={folder._id}
              onClick={() => router.push(`/admin/gallery/${folder._id}`)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img 
                  src={getImageUrl((folder.coverImage && !folder.coverImage.includes('onrender.com/uploads/')) ? folder.coverImage : (folder.images?.[0] || folder.coverImage), { width: 500 })} 
                  alt={folder.title} 
                  loading="lazy"
                  decoding="async"
                  onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image1.png'; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium">
                  {categories.find(c => c.id === folder.categoryId)?.title || folder.categoryId}
                </span>
                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <ImageIcon size={12} /> {folder.images?.length || 0}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-nss-blue transition-colors">
                    {folder.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {folder.eventDate ? new Date(folder.eventDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'No date'}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 text-xs text-gray-500">
                  <span className="flex items-center gap-1 text-nss-blue font-semibold group-hover:underline">
                    Manage Photos <ArrowRight size={14} />
                  </span>
                  <button 
                    onClick={(e) => handleDelete(folder._id, e)}
                    className="text-gray-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete Album"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Folder size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No albums in this category</h3>
          <p className="text-gray-500 text-sm mt-1">Click "Create New Album" to add one.</p>
        </div>
      )}

      {/* Create Album Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-900">Create New Album</h3>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Album Title</label>
                  <input 
                    type="text" 
                    required 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="e.g. Annual NSS Camp 2026"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nss-blue outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select 
                    value={categoryId} 
                    onChange={e => setCategoryId(e.target.value)} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nss-blue outline-none text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Event Date</label>
                  <input 
                    type="date" 
                    required 
                    value={eventDate} 
                    onChange={e => setEventDate(e.target.value)} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nss-blue outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image</label>
                  <input 
                    type="file" 
                    required 
                    accept="image/*" 
                    onChange={e => setCoverImage(e.target.files?.[0] || null)} 
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-nss-blue hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-400 mt-1">Auto-optimized upon upload.</p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button 
                    type="button" 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-nss-blue text-white rounded-xl font-semibold hover:bg-blue-900 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>{statusMessage || 'Saving...'}</span>
                      </>
                    ) : 'Create Album'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminGalleryPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin text-nss-blue" size={40} /></div>}>
      <AdminGalleryContent />
    </Suspense>
  );
}
