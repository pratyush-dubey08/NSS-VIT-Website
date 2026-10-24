'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, MapPin, ArrowRight, Sparkles, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import { getImageUrl } from '@/lib/utils';

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Tab filter: 'open' (Open for Registration) or 'all' (All Activities)
  const [activeTab, setActiveTab] = useState<'open' | 'all'>('open');

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/activities');
      setActivities(Array.isArray(data) ? data : (data?.activities || []));
    } catch (err: any) {
      console.error('Error fetching activities:', err);
      setError('Could not connect to the activities server. The server might be waking up.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const openActivitiesCount = useMemo(() => {
    return activities.filter(a => a.isRegistrationOpen).length;
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return activities
      .filter(a => {
        const matchesSearch = 
          a.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (a.description && a.description.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesTab = activeTab === 'all' || (activeTab === 'open' && a.isRegistrationOpen);

        return matchesSearch && matchesTab;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activities, searchQuery, activeTab]);

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-[#FAFAFA] pb-20 font-sans">
      
      {/* Header Section */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100 pt-6 pb-6 md:pt-8 md:pb-8">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-red-50/30 to-transparent -z-10 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-nss-blue font-bold text-xs uppercase tracking-wider mb-5">
              <Sparkles size={14} /> Community Initiatives & Registrations
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight text-center mb-3">
              NSS <span className="text-transparent bg-clip-text bg-gradient-to-r from-nss-blue to-nss-red">Activities</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto mt-2 leading-relaxed font-normal text-center">
              Participate and register for upcoming NSS community initiatives, and explore the complete record of social service activities conducted by our unit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs & Search Controls */}
      <section className="sticky top-16 sm:top-20 z-40 bg-[#FAFAFA]/95 backdrop-blur-md border-b border-gray-200/50 py-3 mb-6 shadow-xs">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            
            {/* Dual Tabs: Open for Registration vs All Activities */}
            <div className="flex items-center gap-2 p-1 bg-gray-200/60 rounded-2xl w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('open')}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'open'
                    ? 'bg-white text-gray-900 shadow-sm scale-[1.01]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span>Open for Registration</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                  activeTab === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {openActivitiesCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'all'
                    ? 'bg-white text-gray-900 shadow-sm scale-[1.01]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>All Activities</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                  activeTab === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {activities.length}
                </span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search activities..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-nss-blue/20 focus:border-nss-blue shadow-xs"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <div className="container mx-auto px-4 max-w-6xl">
        {loading ? (
          <div className="text-center py-24 text-gray-500 font-bold">
            Loading activities...
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-medium">
            {error}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-nss-blue flex items-center justify-center mx-auto mb-4 font-black">
              NSS
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2">No Activities Found</h3>
            <p className="text-sm text-gray-500">
              {activeTab === 'open' 
                ? 'There are currently no events open for public registration. Switch to "All Activities" to see our past initiatives.'
                : 'No activities match your search criteria.'}
            </p>
            {activeTab === 'open' && (
              <button
                onClick={() => setActiveTab('all')}
                className="mt-5 px-5 py-2 rounded-xl bg-nss-blue text-white text-xs font-bold hover:bg-blue-800 transition-colors"
              >
                View All Activities
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence>
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Activity Image Banner */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img 
                      src={getImageUrl(activity.bannerUrl || activity.banner || activity.image || activity.coverImage || (activity.photos && activity.photos[0]) || '/images/gallery/events_2025/image1.png')} 
                      alt={activity.title}
                      onError={(e: any) => { e.currentTarget.src = '/images/gallery/events_2025/image1.png'; }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Registration Status Pill */}
                    <div className="absolute top-3 left-3">
                      {activity.isRegistrationOpen ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          Registration Open
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-900/80 text-white backdrop-blur-md">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Activity Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Date & Location */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-medium mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={13} className="text-nss-blue" />
                          <span>{activity.date ? new Date(activity.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA'}</span>
                        </div>
                        {(activity.venue || activity.location) && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin size={13} className="text-nss-red shrink-0" />
                              <span className="truncate max-w-[140px]">{activity.venue || activity.location}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-nss-blue transition-colors line-clamp-2">
                        {activity.title}
                      </h3>

                      {/* Justified Description snippet */}
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-justify line-clamp-3 mb-4">
                        {activity.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <Link 
                        href={`/activities/${activity._id}`}
                        className={`inline-flex items-center gap-2 text-xs font-bold transition-all px-4 py-2 rounded-xl ${
                          activity.isRegistrationOpen 
                            ? 'bg-nss-blue text-white hover:bg-blue-800 shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span>{activity.isRegistrationOpen ? 'Register Now' : 'View Event Details'}</span>
                        <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
}
