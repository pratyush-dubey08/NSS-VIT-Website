'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Save, Trash2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import FormBuilder, { IFormField } from '@/components/admin/FormBuilder';

export default function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const activityId = resolvedParams.id;

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    date: '',
    venue: '',
    status: 'Draft',
    hoursAllocated: 0,
    description: '',
    bannerUrl: '',
  });

  const [formSchema, setFormSchema] = useState<IFormField[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [managerSearchQuery, setManagerSearchQuery] = useState('');
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const [activityRes, usersRes] = await Promise.all([
          api.get(`/activities/${activityId}`),
          api.get('/users')
        ]);
        const data = activityRes.data;
        setVolunteers(usersRes.data);
        
        setFormData({
          title: data.title,
          category: data.category || 'General',
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
          venue: data.venue,
          status: data.isRegistrationOpen ? 'Open' : 'Closed',
          hoursAllocated: data.hoursAllocated || 0,
          description: data.description,
          bannerUrl: data.bannerUrl || '',
        });
        setSelectedManagers(data.eventManagers || []);
        setFormSchema(data.formSchema || []);
      } catch (err) {
        console.error('Error fetching activity:', err);
        setError('Failed to load activity details.');
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [activityId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBanner(true);
    const formDataData = new FormData();
    formDataData.append('file', file);

    try {
      const res = await api.post('/upload', formDataData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, bannerUrl: res.data.url }));
    } catch (err) {
      console.error('Error uploading banner:', err);
      alert('Failed to upload banner');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const filteredManagers = volunteers.filter(v => 
    v.name.toLowerCase().includes(managerSearchQuery.toLowerCase()) || 
    v.registrationNumber.toLowerCase().includes(managerSearchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    try {
      await api.delete(`/activities/${activityId}`);
      router.push('/admin/activities');
    } catch (err) {
      alert('Failed to delete activity.');
    }
  };

  const handleSave = async (schema: IFormField[] = formSchema) => {
    setFormSchema(schema);
    setIsSubmitting(true);
    setError('');
    
    try {
      await api.put(`/activities/${activityId}`, {
        ...formData,
        isRegistrationOpen: formData.status === 'Open',
        formSchema: schema,
        eventManagers: selectedManagers
      });
      alert('Activity updated successfully!');
      router.push('/admin/activities');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update activity.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 font-bold text-gray-500">Loading activity...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/activities" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Activity</h1>
            <p className="text-sm text-gray-500">
              {step === 1 ? 'Step 1: Edit Event Details' : 'Step 2: Edit Registration Form'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors text-sm"
          >
            <Trash2 size={16} /> Delete
          </button>

          {step === 2 && (
            <button 
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm"
            >
              Back to Details
            </button>
          )}
          {step === 1 && (
            <>
              <button 
                onClick={() => handleSave()}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
              >
                <Save size={18} /> Save Details
              </button>
              <button 
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-2.5 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors"
              >
                Edit Form <ArrowRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Event Title *</label>
                <input 
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-blue outline-none transition-shadow font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Date *</label>
                <input 
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-blue outline-none transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Venue *</label>
                <input 
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-blue outline-none transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Allocated Working Hours</label>
                <input 
                  type="number"
                  name="hoursAllocated"
                  value={formData.hoursAllocated}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-blue outline-none transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-blue outline-none transition-shadow"
                >
                  <option value="Draft">Draft (Hidden)</option>
                  <option value="Open">Open (Accepting Registrations)</option>
                  <option value="Closed">Closed (Post-Event)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-sm font-bold text-gray-700">Event Brief (Description) *</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-blue outline-none transition-shadow resize-y"
              ></textarea>
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-sm font-bold text-gray-700">Banner Image</label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <input 
                    type="file" 
                    id="banner-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerUpload}
                  />
                  <label 
                    htmlFor="banner-upload"
                    className={`inline-flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-xl cursor-pointer hover:bg-gray-100 transition-colors w-full justify-center ${isUploadingBanner ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <ImageIcon size={18} /> {isUploadingBanner ? 'Uploading...' : 'Upload Banner Image'}
                  </label>
                </div>
              </div>
              <p className="text-xs text-gray-500">Upload an image to be used as the banner on the main home page.</p>
              {formData.bannerUrl && (
                <div className="mt-2 h-32 w-64 rounded-xl border border-gray-200 overflow-hidden relative">
                  <img src={formData.bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" onError={(e: any) => e.target.style.display = 'none'} />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, bannerUrl: '' }))}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                    title="Remove Image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-sm font-bold text-gray-700">Event Managers ({selectedManagers.length} selected)</label>
              <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex flex-col h-64">
                <div className="p-3 border-b border-gray-200 bg-white">
                  <input 
                    type="text"
                    placeholder="Search volunteers by name or reg no..."
                    value={managerSearchQuery}
                    onChange={(e) => setManagerSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nss-blue/50 text-sm"
                  />
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {filteredManagers.map(v => (
                    <label key={v._id} className="flex items-center gap-3 p-3 hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-100 mb-1">
                      <input 
                        type="checkbox"
                        checked={selectedManagers.includes(v._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedManagers([...selectedManagers, v._id]);
                          } else {
                            setSelectedManagers(selectedManagers.filter(id => id !== v._id));
                          }
                        }}
                        className="w-4 h-4 text-nss-blue rounded focus:ring-nss-blue"
                      />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{v.name}</p>
                        <p className="text-xs text-gray-500">{v.registrationNumber}</p>
                      </div>
                    </label>
                  ))}
                  {filteredManagers.length === 0 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No volunteers match your search.
                    </div>
                  )}
                </div>
              </div>
            </div>
            
          </motion.div>
        ) : (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="mb-4 text-gray-600 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <span>Edit the registration form for <strong>{formData.title}</strong>. When you are done, click the save button in the sidebar.</span>
            </div>
            <FormBuilder initialFields={formSchema} onSave={handleSave} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
