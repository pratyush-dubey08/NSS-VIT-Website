'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Folder, Trash2, Edit, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

// Use same categories as public gallery
const categories = [
  { id: 'camps', title: 'Special Camps' },
  { id: 'plantation', title: 'Plantation & Environment' },
  { id: 'blood', title: 'Blood Donation Drives' },
  { id: 'awareness', title: 'Awareness Campaigns' },
  { id: 'youth', title: 'Youth Development' },
  { id: 'cultural', title: 'Cultural Events' }
];

export default function AdminGalleryPage() {
  const [folders, setFolders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('camps');
  const [eventDate, setEventDate] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFolders();
  }, []);

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

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !categoryId || !coverImage || !eventDate) {
      alert('Please fill all fields and select a cover image');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload image
      const formData = new FormData();
      formData.append('file', coverImage);
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = uploadRes.data.url || uploadRes.data.fileUrl;

      // 2. Create folder
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
      alert('Failed to create album');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategoryId('camps');
    setEventDate('');
    setCoverImage(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this album?')) return;
    
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-500">Manage albums and photos</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-nss-blue text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-900 transition-colors"
        >
          <Plus size={20} /> New Album
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
            activeCategory === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Albums
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              activeCategory === cat.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Folders Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-nss-blue" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFolders.map(folder => (
            <div key={folder._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
              <Link href={`/admin/gallery/${folder._id}`}>
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <img src={getImageUrl(folder.coverImage)} alt={folder.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Edit size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
                    <ImageIcon size={12} /> {folder.images?.length || 0}
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 line-clamp-1" title={folder.title}>{folder.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 font-medium">{new Date(folder.eventDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {categories.find(c => c.id === folder.categoryId)?.title || folder.categoryId}
                  </p>
                  <button onClick={() => handleDelete(folder._id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredFolders.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Folder size={48} className="mx-auto text-gray-300 mb-2" />
              <p>No albums found in this category.</p>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isSubmitting && setIsCreateModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Create New Album</h2>
              </div>
              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Album Title</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nss-blue focus:border-transparent outline-none" placeholder="e.g. Mega Blood Donation 2026" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nss-blue focus:border-transparent outline-none">
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Event Date</label>
                  <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nss-blue focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="space-y-1 text-center">
                      {coverImage ? (
                        <div className="text-sm text-gray-600 font-medium">Selected: {coverImage.name}</div>
                      ) : (
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-nss-blue hover:text-blue-900 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input type="file" className="sr-only" accept="image/*" onChange={e => setCoverImage(e.target.files?.[0] || null)} required />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} disabled={isSubmitting} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-nss-blue text-white rounded-xl hover:bg-blue-900 transition-colors font-medium flex justify-center items-center">
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Create Album'}
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
