'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';

const getAcademicYear = (dateString: string) => {
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = d.getMonth() + 1; 
  if (month >= 4) {
    return `${year}-${(year + 1).toString().slice(2)}`;
  } else {
    return `${year - 1}-${year.toString().slice(2)}`;
  }
};

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('All');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await api.get('/activities');
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const academicYears = useMemo(() => {
    const years = new Set<string>();
    activities.forEach(a => {
      years.add(getAcademicYear(a.date));
    });
    // Sort descending
    return ['All', ...Array.from(years).sort((a, b) => b.localeCompare(a))];
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return activities
      .filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (a.description && a.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesYear = selectedYear === 'All' || getAcademicYear(a.date) === selectedYear;
        return matchesSearch && matchesYear;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activities, searchQuery, selectedYear]);

  return (
    <div className="min-h-screen pt-24 bg-[#FAFAFA] pb-20">
      
      {/* Premium Header */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100 pt-8 pb-10 md:pt-12 md:pb-16">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-red-50/30 to-transparent -z-10 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-nss-blue font-bold text-sm mb-6">
              <Sparkles size={16} /> Our Initiatives
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              Impactful <span className="text-transparent bg-clip-text bg-gradient-to-r from-nss-blue to-nss-red">Activities</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Explore our journey of social service. From mega plantation drives to rural empowerment, see how we are making a difference year by year.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Controls Area */}
      <section className="sticky top-20 z-40 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-gray-200/50 py-4 mb-12 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Year Filters */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar scroll-smooth">
              {academicYears.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                    selectedYear === year 
                      ? 'bg-gray-900 text-white shadow-md scale-105' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {year === 'All' ? 'All Sessions' : `Session ${year}`}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80 shrink-0 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-nss-blue transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search activities..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white focus:ring-2 focus:ring-nss-blue/20 focus:border-nss-blue outline-none transition-all shadow-sm"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="container mx-auto px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-nss-blue rounded-full animate-spin mb-4"></div>
            <p className="font-bold">Loading Activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 bg-white rounded-3xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-300" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Activities Found</h3>
            <p className="text-gray-500">We couldn't find any activities matching your filters.</p>
            <button onClick={() => {setSearchQuery(''); setSelectedYear('All')}} className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-full transition-colors">
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredActivities.map((activity, index) => (
                <motion.div
                  layout
                  key={activity._id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
                  className="bg-white rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col border border-gray-100"
                >
                  {/* Card Image Area */}
                  <div className="h-56 relative overflow-hidden bg-gray-100 flex items-center justify-center">
                    {activity.bannerUrl ? (
                      <img src={activity.bannerUrl} alt={activity.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-gray-50 flex items-center justify-center">
                        <Sparkles className="text-gray-300" size={40} />
                      </div>
                    )}
                    
                    {/* Session Badge */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black text-gray-900 shadow-sm border border-white/20">
                      {getAcademicYear(activity.date)}
                    </div>
                  </div>
                  
                  {/* Card Content Area */}
                  <div className="p-8 flex-1 flex flex-col relative bg-white">
                    <h3 className="text-2xl font-black text-gray-900 leading-tight mb-4 group-hover:text-nss-blue transition-colors">
                      {activity.title}
                    </h3>
                    
                    <div className="space-y-3 mb-8 flex-1">
                      <div className="flex items-center text-sm font-medium text-gray-500 gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-nss-blue">
                          <Calendar size={14} />
                        </div>
                        <span>{new Date(activity.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center text-sm font-medium text-gray-500 gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-nss-red">
                          <MapPin size={14} />
                        </div>
                        <span className="truncate">{activity.venue}</span>
                      </div>
                    </div>

                    {/* Footer Action Area */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide uppercase ${
                        activity.isRegistrationOpen ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {activity.isRegistrationOpen ? 'Registration Open' : 'Closed'}
                      </span>
                      
                      <Link href={`/activities/${activity._id}`} className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-nss-blue flex items-center justify-center text-gray-400 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1">
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}
