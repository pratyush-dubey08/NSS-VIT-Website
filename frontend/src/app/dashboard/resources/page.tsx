'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { FileText, Music, Link as LinkIcon, Download, ExternalLink, Sparkles } from 'lucide-react';
import api from '@/lib/axios';

export default function VolunteerResources() {
  const { user } = useAuthStore();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data } = await api.get('/resources');
        setResources(data || []);
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
      default: return <LinkIcon size={24} className="text-emerald-500" />;
    }
  };

  const backendUrl = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') 
    : 'https://nss-vit-website.onrender.com';

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="border-b border-gray-100 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 bg-blue-50 text-nss-blue text-xs font-black rounded-md uppercase tracking-wider">
            NSS Portal
          </span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Resource Center</h1>
        <p className="text-gray-500 text-sm md:text-base mt-1">
          Access official NSS guidelines, volunteer diaries, audio tracks, and administrative documentation.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="w-10 h-10 border-3 border-nss-blue border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="font-bold text-sm">Loading Resources...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-blue-50 text-nss-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Resources Uploaded Yet</h3>
          <p className="text-gray-500 text-sm">
            Check back later. When documents are published by the NSS office, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => {
            const fileLink = res.fileUrl?.startsWith('http') 
              ? res.fileUrl 
              : `${backendUrl}${res.fileUrl || ''}`;

            return (
              <div 
                key={res._id} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md hover:border-nss-blue/30 transition-all"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-gray-100">
                      {getIcon(res.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-gray-900 leading-tight mb-1 truncate">{res.title}</h3>
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-md">
                        {res.category || 'Document'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a 
                    href={fileLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-nss-blue text-gray-700 hover:text-white rounded-xl font-bold text-xs transition-colors shadow-2xs"
                  >
                    <Download size={15} />
                    View & Download Resource
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
