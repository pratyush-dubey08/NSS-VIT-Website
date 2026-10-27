'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { FileText, Music, Link as LinkIcon, Download, ExternalLink, Sparkles, Clock, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';

export default function VolunteerResources() {
  const { user } = useAuthStore();
  const [resources, setResources] = useState<any[]>([]);
  const [volunteerForms, setVolunteerForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resData, formsData] = await Promise.all([
          api.get('/resources').catch(() => ({ data: [] })),
          api.get('/volunteer-forms').catch(() => ({ data: [] }))
        ]);
        setResources(resData.data || []);
        setVolunteerForms(formsData.data || []);
      } catch (error) {
        console.error('Failed to load resources', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  const activeForms = volunteerForms.filter(f => f.isActive);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-10">
      <div className="border-b border-gray-100 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 bg-blue-50 text-nss-blue text-xs font-black rounded-md uppercase tracking-wider">
            NSS Portal
          </span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Resource Center & Volunteer Forms</h1>
        <p className="text-gray-500 text-sm md:text-base mt-1">
          Fill out required official volunteer questionnaires, access guidelines, and download administrative documentation.
        </p>
      </div>

      {/* SECTION 1: OFFICIAL VOLUNTEER FORMS */}
      {activeForms.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-nss-blue animate-pulse" />
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Sparkles size={20} className="text-nss-blue" />
              Official Volunteer Forms to Fill ({activeForms.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeForms.map((vf) => {
              const isExpired = vf.deadline && new Date(vf.deadline) < new Date();
              return (
                <div
                  key={vf._id}
                  className="bg-white p-6 rounded-3xl shadow-xs border border-blue-100/90 hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        style={{
                          color: vf.titleColor || '#111827',
                          fontWeight: vf.titleBold ? 'bold' : 'normal',
                          fontStyle: vf.titleItalic ? 'italic' : 'normal',
                          textDecoration: vf.titleUnderline ? 'underline' : 'none'
                        }}
                        className="text-lg leading-tight"
                      >
                        {vf.title}
                      </h3>

                      <span className={'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ' + (
                        isExpired
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-50 text-nss-blue'
                      )}>
                        {isExpired ? 'Deadline Passed' : 'Active Form'}
                      </span>
                    </div>

                    {vf.description && (
                      <p
                        style={{
                          color: vf.descriptionColor || '#4b5563',
                          fontWeight: vf.descriptionBold ? 'bold' : 'normal',
                          fontStyle: vf.descriptionItalic ? 'italic' : 'normal',
                          textDecoration: vf.descriptionUnderline ? 'underline' : 'none'
                        }}
                        className="text-xs sm:text-sm leading-relaxed"
                      >
                        {vf.description}
                      </p>
                    )}

                    {vf.deadline && (
                      <div className={'text-xs font-bold flex items-center gap-1.5 ' + (isExpired ? 'text-rose-600' : 'text-amber-700')}>
                        <Clock size={14} />
                        <span>Deadline: {new Date(vf.deadline).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <a
                      href={vf.googleFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-nss-blue to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer"
                    >
                      <span>Fill Form Now (Google Forms)</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 2: DOCUMENTS & FILES */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <FileText size={20} className="text-gray-700" />
          Guidelines & Documents
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-10 h-10 border-3 border-nss-blue border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="font-bold text-sm">Loading Resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-lg mx-auto">
            <div className="w-14 h-14 bg-blue-50 text-nss-blue rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Documents Uploaded Yet</h3>
            <p className="text-gray-500 text-xs">
              Check back later. When documents are published by the NSS office, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => {
              const fileLink = res.fileUrl?.startsWith('http') 
                ? res.fileUrl 
                : `${backendUrl}${res.fileUrl || ''}`;

              // Avoid Cloudinary 401 "deny or ACL failure" by previewing PDF as clean high-res document image
              const viewLink = (res.fileUrl && res.fileUrl.includes('cloudinary.com') && res.fileUrl.endsWith('.pdf'))
                ? res.fileUrl.replace(/\.pdf$/, '.jpg')
                : fileLink;

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
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                    <a 
                      href={viewLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-xs transition-colors border border-gray-200"
                    >
                      <ExternalLink size={14} />
                      View
                    </a>
                    <a 
                      href={fileLink} 
                      download={res.title || 'nss-resource.pdf'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-nss-blue hover:bg-blue-900 text-white rounded-xl font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
