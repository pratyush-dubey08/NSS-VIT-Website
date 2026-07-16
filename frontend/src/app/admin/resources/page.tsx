'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { FileText, Plus, Trash2, UploadCloud } from 'lucide-react';
import api from '@/lib/axios';

export default function AdminResources() {
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('document');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'PROGRAM_OFFICER')) {
      router.push('/dashboard');
      return;
    }
    fetchResources();
  }, [user, router]);

  const fetchResources = async () => {
    try {
      const { data } = await api.get('/resources');
      setResources(data);
    } catch (error) {
      alert('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return alert('Title and File are required');

    setIsUploading(true);
    try {
      // 1. Upload File
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileUrl = uploadRes.data.fileUrl;

      // 2. Create Resource
      await api.post('/resources', { title, category, fileUrl });
      alert('Resource uploaded successfully');
      
      setTitle('');
      setFile(null);
      fetchResources();
    } catch (error) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      await api.delete(`/resources/${id}`);
      alert('Resource deleted');
      fetchResources();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Manage Resources</h1>

      {/* Upload Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <UploadCloud className="text-nss-blue" />
          Upload New Resource
        </h2>
        
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title (e.g. NSS Diary 2024)</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nss-blue outline-none"
              placeholder="Resource title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nss-blue outline-none"
            >
              <option value="document">Document / PDF</option>
              <option value="audio">Audio / Song</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Select File</label>
            <input 
              type="file" 
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-nss-blue hover:file:bg-blue-100"
            />
          </div>

          <div className="md:col-span-2 flex justify-end mt-2">
            <button 
              type="submit" 
              disabled={isUploading}
              className="flex items-center gap-2 bg-nss-blue text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-900 transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : <><Plus size={18} /> Upload Resource</>}
            </button>
          </div>
        </form>
      </div>

      {/* Resource List */}
      <h2 className="text-xl font-bold mb-4">Uploaded Resources</h2>
      {loading ? (
        <p>Loading...</p>
      ) : resources.length === 0 ? (
        <p className="text-gray-500">No resources uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((res) => (
            <div key={res._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-nss-blue">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{res.title}</h3>
                  <p className="text-xs text-gray-500 uppercase font-semibold">{res.category}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <a 
                  href={res.fileUrl.startsWith('http') ? res.fileUrl : `http://localhost:5000${res.fileUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200"
                >
                  View
                </a>
                <button 
                  onClick={() => handleDelete(res._id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
