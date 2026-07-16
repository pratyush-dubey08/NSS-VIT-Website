'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { FileText, Music, Link as LinkIcon, Download } from 'lucide-react';
import api from '@/lib/axios';

export default function VolunteerResources() {
  const { user } = useAuthStore();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data } = await api.get('/resources');
        setResources(data);
      } catch (error) {
        console.error('Failed to load resources', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const getIcon = (category: string) => {
    switch (category) {
      case 'document': return <FileText size={24} className="text-nss-blue" />;
      case 'audio': return <Music size={24} className="text-purple-500" />;
      default: return <LinkIcon size={24} className="text-gray-500" />;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">NSS Resources</h1>
        <p className="text-gray-600">Access and download important documents, the NSS Diary, and NSS Songs.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-nss-blue rounded-full animate-spin mb-4"></div>
          <p className="font-bold">Loading Resources...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-gray-300" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Resources Available</h3>
          <p className="text-gray-500">Check back later for uploaded documents and media.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <div key={res._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  {getIcon(res.category)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1 group-hover:text-nss-blue transition-colors">{res.title}</h3>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-md">
                    {res.category}
                  </span>
                </div>
              </div>
              
              <div className="mt-auto">
                <a 
                  href={res.fileUrl.startsWith('http') ? res.fileUrl : `http://localhost:5000${res.fileUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-nss-blue text-gray-700 hover:text-white rounded-xl font-bold transition-colors"
                >
                  <Download size={18} />
                  View / Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
