'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Upload, Trash2, Edit, Check, X, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';
import { compressImage, compressImagesBatch } from '@/lib/imageCompressor';

const categories = [
  { id: 'camps', title: 'Special Camps' },
  { id: 'plantation', title: 'Plantation & Environment' },
  { id: 'blood', title: 'Blood Donation Drives' },
  { id: 'awareness', title: 'Awareness Campaigns' },
  { id: 'youth', title: 'Youth Development' },
  { id: 'cultural', title: 'Cultural Events' }
];

export default function AlbumDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [folder, setFolder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editEventDate, setEditEventDate] = useState('');
  const [editCover, setEditCover] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Upload photos state & progress
  const [photosToUpload, setPhotosToUpload] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState<'idle' | 'compressing' | 'uploading' | 'saving' | 'done'>('idle');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    fetchFolder();
  }, [id]);

  const fetchFolder = async () => {
    try {
      const res = await api.get(`/gallery/${id}`);
      setFolder(res.data);
      setEditTitle(res.data.title);
      setEditCategoryId(res.data.categoryId);
      setEditEventDate(res.data.eventDate ? new Date(res.data.eventDate).toISOString().split('T')[0] : '');
    } catch (error) {
      alert('Failed to load album');
      router.push('/admin/gallery');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAlbum = async () => {
    setIsSaving(true);
    try {
      let coverImageUrl = folder.coverImage;
      
      if (editCover) {
        // Fast client-side compression before uploading cover photo
        const compressedCover = await compressImage(editCover, { maxWidth: 1920, quality: 0.85 });
        const formData = new FormData();
        formData.append('file', compressedCover);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        coverImageUrl = uploadRes.data.url || uploadRes.data.fileUrl;
      }

      await api.put(`/gallery/${id}`, {
        title: editTitle,
        categoryId: editCategoryId,
        coverImage: coverImageUrl,
        eventDate: editEventDate
      });

      alert('Album updated successfully!');
      setIsEditing(false);
      setEditCover(null);
      fetchFolder();
    } catch (error) {
      alert('Failed to update album');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadPhotos = async () => {
    if (!photosToUpload || photosToUpload.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    const totalFiles = photosToUpload.length;

    try {
      // Stage 1: Ultra-fast client-side compression
      setUploadStage('compressing');
      setStatusMessage(`Optimizing ${totalFiles} images for ultra-fast upload...`);

      const compressedFiles = await compressImagesBatch(photosToUpload, (current, total) => {
        const percent = Math.round((current / total) * 35); // 0 - 35% of total flow
        setUploadProgress(percent);
        setStatusMessage(`Optimized ${current} of ${total} images...`);
      });

      // Stage 2: Parallel Batch Upload (3 concurrent requests)
      setUploadStage('uploading');
      const uploadedUrls: string[] = [];
      const BATCH_SIZE = 3;
      let completedCount = 0;

      for (let i = 0; i < compressedFiles.length; i += BATCH_SIZE) {
        const chunk = compressedFiles.slice(i, i + BATCH_SIZE);
        
        const chunkResults = await Promise.all(
          chunk.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            const res = await api.post('/upload', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data.url || res.data.fileUrl;
          })
        );

        for (const url of chunkResults) {
          if (url) uploadedUrls.push(url);
        }

        completedCount += chunk.length;
        const uploadPercent = 35 + Math.round((completedCount / totalFiles) * 55); // 35% - 90%
        setUploadProgress(uploadPercent);
        setStatusMessage(`Uploaded ${completedCount} of ${totalFiles} images...`);
      }

      // Stage 3: Save to database album
      setUploadStage('saving');
      setUploadProgress(95);
      setStatusMessage('Saving album photos to database...');
      await api.post(`/gallery/${id}/images`, { images: uploadedUrls });

      setUploadStage('done');
      setUploadProgress(100);
      setStatusMessage(`Successfully uploaded ${uploadedUrls.length} photos!`);

      setTimeout(() => {
        setPhotosToUpload(null);
        setIsUploading(false);
        setUploadStage('idle');
        const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        fetchFolder();
      }, 1000);

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload photos. Please check your network and try again.');
      setIsUploading(false);
      setUploadStage('idle');
    }
  };

  const handleDeletePhoto = async (imageUrl: string, index: number) => {
    if (!confirm('Remove this photo from the album?')) return;
    
    try {
      await api.delete(`/gallery/${id}/images`, { data: { imageUrl, index } });
      alert('Photo removed');
      fetchFolder();
    } catch (error) {
      alert('Failed to remove photo');
    }
  };

  const handleClearAllPhotos = async () => {
    if (!confirm('Are you sure you want to remove ALL photos from this album?')) return;
    
    try {
      await api.delete(`/gallery/${id}/images`, { data: { removeAll: true } });
      alert('All photos removed');
      fetchFolder();
    } catch (error) {
      alert('Failed to clear photos');
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-nss-blue" size={40} /></div>;
  if (!folder) return null;

  const currentCategory = categories.find(c => c.id === folder.categoryId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header with smart Back link retaining category */}
      <div className="flex items-center gap-4">
        <Link 
          href={`/admin/gallery?category=${folder.categoryId || 'all'}`} 
          className="text-gray-600 hover:text-nss-blue transition-colors p-2 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center gap-2 text-sm font-semibold"
        >
          <ArrowLeft size={18} />
          <span>Back to {currentCategory?.title || 'Gallery'}</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Album</h1>
        </div>
      </div>

      {/* Album Details Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        {/* Cover Photo */}
        <div className="w-full md:w-1/3 relative bg-gray-100">
          <img 
            src={isEditing && editCover ? URL.createObjectURL(editCover) : getImageUrl((folder.coverImage && !folder.coverImage.includes('onrender.com/uploads/')) ? folder.coverImage : (folder.images?.[0] || folder.coverImage), { width: 600 })} 
            alt={folder.title} 
            loading="lazy"
            decoding="async"
            onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image1.png'; }}
            className="w-full h-full object-cover aspect-video md:aspect-square" 
          />
          {isEditing && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4">
              <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm shadow-lg hover:bg-gray-100 transition-colors text-center">
                Change Cover Photo
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => setEditCover(e.target.files?.[0] || null)} 
                />
              </label>
              {editCover && (
                <span className="text-white text-xs mt-2 truncate max-w-full">
                  Selected: {editCover.name}
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Details Form */}
        <div className="p-6 md:p-8 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-900">Album Details</h2>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)} 
                className="flex items-center gap-2 text-nss-blue font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors text-sm"
              >
                <Edit size={16} /> Edit Details
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { 
                    setIsEditing(false); 
                    setEditCover(null); 
                    setEditTitle(folder.title); 
                    setEditCategoryId(folder.categoryId); 
                    setEditEventDate(folder.eventDate ? new Date(folder.eventDate).toISOString().split('T')[0] : ''); 
                  }} 
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  title="Cancel"
                >
                  <X size={20} />
                </button>
                <button 
                  onClick={handleUpdateAlbum} 
                  disabled={isSaving} 
                  className="flex items-center gap-2 bg-nss-blue text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-blue-900 disabled:opacity-50 text-sm"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editTitle} 
                  onChange={e => setEditTitle(e.target.value)} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nss-blue outline-none" 
                />
              ) : (
                <p className="text-gray-900 font-medium text-lg">{folder.title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              {isEditing ? (
                <select 
                  value={editCategoryId} 
                  onChange={e => setEditCategoryId(e.target.value)} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nss-blue outline-none"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              ) : (
                <p className="text-gray-600 bg-gray-100 inline-block px-3 py-1 rounded-full text-sm font-medium">
                  {currentCategory?.title || folder.categoryId}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Event Date</label>
              {isEditing ? (
                <input 
                  type="date" 
                  value={editEventDate} 
                  onChange={e => setEditEventDate(e.target.value)} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nss-blue outline-none" 
                />
              ) : (
                <p className="text-gray-900 font-medium text-lg">
                  {folder.eventDate ? new Date(folder.eventDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Photos Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Photos ({folder.images.length})</h2>
            <p className="text-sm text-gray-500">
              Photos are auto-compressed on your device before upload for lightning-fast speeds.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {folder.images.length > 0 && (
              <button 
                onClick={handleClearAllPhotos} 
                className="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                title="Clear all photos from this album"
              >
                <Trash2 size={14} /> Clear All
              </button>
            )}
            
            <input 
              id="photo-upload"
              type="file" 
              multiple 
              accept="image/*" 
              disabled={isUploading}
              onChange={e => setPhotosToUpload(e.target.files)} 
              className="text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-nss-blue hover:file:bg-blue-100 cursor-pointer"
            />
            {photosToUpload && photosToUpload.length > 0 && (
              <button 
                onClick={handleUploadPhotos} 
                disabled={isUploading}
                className="bg-nss-blue text-white px-5 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-900 disabled:opacity-50 whitespace-nowrap shadow-sm text-sm"
              >
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} 
                Upload {photosToUpload.length} Photos
              </button>
            )}
          </div>
        </div>

        {/* Real-time Progress Bar */}
        {isUploading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl animate-in fade-in">
            <div className="flex justify-between items-center text-sm font-semibold text-blue-900 mb-2">
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-nss-blue" />
                {statusMessage}
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-blue-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-nss-blue h-full rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {folder.images.map((img: string, idx: number) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100 shadow-sm border border-gray-100">
              <img 
                src={getImageUrl(img, { width: 400 })} 
                alt="Gallery item" 
                loading="lazy"
                decoding="async"
                onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image1.png'; }}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => handleDeletePhoto(img, idx)}
                  className="bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 transition-colors transform scale-90 group-hover:scale-100 shadow-md"
                  title="Remove Photo"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {folder.images.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <Upload size={40} className="mx-auto mb-3 opacity-40 text-gray-400" />
              <p className="font-semibold text-gray-600">No photos in this album yet.</p>
              <p className="text-xs text-gray-400 mt-1">Select files above to upload multiple photos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
