'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Upload, Trash2, Edit, Check, X } from 'lucide-react';
import api from '@/lib/axios';
import Link from 'next/link';

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

  // Upload photos state
  const [photosToUpload, setPhotosToUpload] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
        const formData = new FormData();
        formData.append('file', editCover);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        coverImageUrl = uploadRes.data.fileUrl;
      }

      await api.put(`/gallery/${id}`, {
        title: editTitle,
        categoryId: editCategoryId,
        coverImage: coverImageUrl,
        eventDate: editEventDate
      });

      alert('Album updated');
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
    try {
      const uploadedUrls: string[] = [];
      
      // Upload each file one by one
      for (let i = 0; i < photosToUpload.length; i++) {
        const file = photosToUpload[i];
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedUrls.push(res.data.fileUrl);
      }

      // Add urls to folder
      await api.post(`/gallery/${id}/images`, { images: uploadedUrls });
      
      alert(`${uploadedUrls.length} photos uploaded!`);
      setPhotosToUpload(null);
      // Reset file input
      const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      fetchFolder();
    } catch (error) {
      alert('Failed to upload photos');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (imageUrl: string) => {
    if (!confirm('Remove this photo from the album?')) return;
    
    try {
      await api.delete(`/gallery/${id}/images`, { data: { imageUrl } });
      alert('Photo removed');
      fetchFolder();
    } catch (error) {
      alert('Failed to remove photo');
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-nss-blue" size={40} /></div>;
  if (!folder) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/gallery" className="text-gray-500 hover:text-nss-blue transition-colors p-2 bg-white rounded-lg shadow-sm border border-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Album</h1>
        </div>
      </div>

      {/* Album Details Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        {/* Cover Photo */}
        <div className="w-full md:w-1/3 relative bg-gray-100">
          <img src={isEditing && editCover ? URL.createObjectURL(editCover) : folder.coverImage} alt={folder.title} className="w-full h-full object-cover aspect-video md:aspect-square" />
          {isEditing && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
              <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm shadow-lg hover:bg-gray-100 transition-colors">
                Change Cover
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setEditCover(e.target.files?.[0] || null)} />
              </label>
            </div>
          )}
        </div>
        
        {/* Details Form */}
        <div className="p-6 md:p-8 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-900">Album Details</h2>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-nss-blue font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                <Edit size={16} /> Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => { setIsEditing(false); setEditCover(null); setEditTitle(folder.title); setEditCategoryId(folder.categoryId); setEditEventDate(folder.eventDate ? new Date(folder.eventDate).toISOString().split('T')[0] : ''); }} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
                <button onClick={handleUpdateAlbum} disabled={isSaving} className="flex items-center gap-2 bg-nss-blue text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-blue-900 disabled:opacity-50">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              {isEditing ? (
                <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nss-blue outline-none" />
              ) : (
                <p className="text-gray-900 font-medium text-lg">{folder.title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              {isEditing ? (
                <select value={editCategoryId} onChange={e => setEditCategoryId(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nss-blue outline-none">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              ) : (
                <p className="text-gray-600 bg-gray-100 inline-block px-3 py-1 rounded-full text-sm font-medium">
                  {categories.find(c => c.id === folder.categoryId)?.title || folder.categoryId}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Event Date</label>
              {isEditing ? (
                <input type="date" value={editEventDate} onChange={e => setEditEventDate(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nss-blue outline-none" />
              ) : (
                <p className="text-gray-900 font-medium text-lg">{folder.eventDate ? new Date(folder.eventDate).toLocaleDateString() : 'N/A'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Photos Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Photos ({folder.images.length})</h2>
            <p className="text-sm text-gray-500">Upload multiple photos to this album.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input 
              id="photo-upload"
              type="file" 
              multiple 
              accept="image/*" 
              onChange={e => setPhotosToUpload(e.target.files)} 
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-nss-blue hover:file:bg-blue-100"
            />
            {photosToUpload && photosToUpload.length > 0 && (
              <button 
                onClick={handleUploadPhotos} 
                disabled={isUploading}
                className="bg-nss-blue text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-blue-900 disabled:opacity-50 whitespace-nowrap"
              >
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} 
                Upload {photosToUpload.length}
              </button>
            )}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {folder.images.map((img: string, idx: number) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100">
              <img src={img} alt="Gallery item" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => handleDeletePhoto(img)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors transform scale-90 group-hover:scale-100"
                  title="Remove Photo"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {folder.images.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
              <Upload size={40} className="mx-auto mb-3 opacity-50" />
              <p>No photos yet. Select files to upload.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
