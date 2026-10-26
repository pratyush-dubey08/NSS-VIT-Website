'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getImageUrl, getActivityFallbackBanner } from '@/lib/utils';
import api from '@/lib/axios';

export default function UpcomingActivities() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await api.get('/activities');
        // Filter only open registration events
        const openEvents = data
          .filter((a: any) => a.isRegistrationOpen)
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3); // Show top 3
        setActivities(openEvents);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading || activities.length === 0) {
    return null; // Don't show the section if no open events
  }

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50/30 via-white to-slate-100/60 relative overflow-hidden border-t border-slate-200/60">
      {/* Soft Ambient Background Elements */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none -z-10 select-none">
        <img src="/images/nss-logo.png" alt="" className="w-[450px] h-[450px] object-contain" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12 max-w-7xl mx-auto">
          <div>
            <span className="text-xs font-black tracking-widest text-nss-red uppercase px-3.5 py-1 bg-red-50 rounded-full border border-red-200/80 inline-block mb-3 shadow-xs">
              Join Us
            </span>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-nss-blue via-blue-900 to-nss-red bg-clip-text text-transparent">
              Open for Registration
            </h3>
          </div>
          <Link href="/activities" className="hidden md:flex items-center gap-2 text-nss-blue font-extrabold hover:text-nss-red transition-colors group">
            View All Activities <ArrowRight size={20} className="transform group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {activities.map((activity, index) => (
            <motion.div
              key={activity._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-blue-950/15 transition-all duration-300 flex flex-col hover:-translate-y-2 border-t-4 border-t-nss-blue"
            >
              <div className="h-48 relative overflow-hidden bg-slate-100 flex items-center justify-center">
                {activity.bannerUrl ? (
                  <img 
                    src={getImageUrl((activity.bannerUrl && !activity.bannerUrl.includes('onrender.com/uploads/')) ? activity.bannerUrl : getActivityFallbackBanner(activity.title))} 
                    alt={activity.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = getActivityFallbackBanner(activity.title);
                    }}
                  />
                ) : (
                  <span className="text-gray-400 font-bold">No Image</span>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-black text-slate-900 leading-tight line-clamp-2 group-hover:text-nss-blue transition-colors">
                      {activity.title}
                    </h3>
                  </div>
                  
                  <div className="space-y-2.5 mb-6">
                    <div className="flex items-center text-xs font-semibold text-gray-600 gap-2.5">
                      <Calendar size={15} className="text-nss-blue shrink-0" />
                      <span>{new Date(activity.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center text-xs font-semibold text-gray-600 gap-2.5">
                      <MapPin size={15} className="text-nss-red shrink-0" />
                      <span className="truncate">{activity.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                    Registrations Open
                  </span>
                  
                  <Link 
                    href={`/activities/${activity._id}`} 
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-nss-blue to-blue-900 hover:from-blue-900 hover:to-nss-red text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-blue-950/20 hover:shadow-lg"
                  >
                    Register Now <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/activities" className="inline-flex items-center gap-2 text-nss-blue font-extrabold hover:text-nss-red transition-colors">
            View All Activities <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
