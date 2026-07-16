'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
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
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12 max-w-7xl mx-auto">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-nss-red uppercase mb-3">Join Us</h2>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              Open for Registration
            </h3>
          </div>
          <Link href="/activities" className="hidden md:flex items-center gap-2 text-nss-blue font-bold hover:text-blue-800 transition-colors group">
            View All Activities <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
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
              className="bg-gray-50 border border-gray-100 rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="h-48 relative overflow-hidden bg-gray-200 flex items-center justify-center">
                {activity.bannerUrl ? (
                  <img src={activity.bannerUrl} alt={activity.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <span className="text-gray-400 font-bold">No Image</span>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2">
                    {activity.title}
                  </h3>
                </div>
                
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center text-sm text-gray-500 gap-3">
                    <Calendar size={16} className="text-nss-blue" />
                    <span>{new Date(activity.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 gap-3">
                    <MapPin size={16} className="text-nss-red" />
                    <span className="truncate">{activity.venue}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Registrations Open
                  </span>
                  
                  <Link href={`/activities/${activity._id}`} className="text-nss-blue font-semibold text-sm hover:underline">
                    Register Now →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/activities" className="inline-flex items-center gap-2 text-nss-blue font-bold hover:text-blue-800 transition-colors">
            View All Activities <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
