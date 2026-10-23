'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Award, Briefcase, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';

export default function VolunteerActivitiesPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'ATTENDED' | 'MANAGING'>('ATTENDED');
  const [attendedActivities, setAttendedActivities] = useState<any[]>([]);
  const [managingActivities, setManagingActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchActivities = async () => {
      try {
        setLoading(true);
        const [regRes, actRes] = await Promise.all([
          api.get('/forms/my-registrations'),
          api.get('/activities')
        ]);

        // Filter attended activities (marked Present / ATTENDED)
        const myRegs = regRes.data || [];
        const attended = myRegs.filter((reg: any) => 
          reg.attendanceStatus === 'ATTENDED' || reg.attendanceStatus === 'Present'
        );
        setAttendedActivities(attended);

        // Filter activities managed by this user
        const allActs = actRes.data || [];
        const managing = allActs.filter((act: any) => 
          act.eventManagers && act.eventManagers.some((m: any) => (m._id || m) === user._id)
        );
        setManagingActivities(managing);

        // If no attended events but has managing events, default to managing tab
        if (attended.length === 0 && managing.length > 0) {
          setActiveTab('MANAGING');
        }
      } catch (error) {
        console.error('Error fetching volunteer activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Activities</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            View activities you have attended and events you have been assigned to manage.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/60 shadow-inner">
          <button
            onClick={() => setActiveTab('ATTENDED')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'ATTENDED'
                ? 'bg-white text-nss-blue shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CheckCircle2 size={16} />
            Attended Events
            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
              activeTab === 'ATTENDED' ? 'bg-blue-50 text-nss-blue' : 'bg-gray-200 text-gray-600'
            }`}>
              {attendedActivities.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('MANAGING')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'MANAGING'
                ? 'bg-white text-nss-blue shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Briefcase size={16} />
            Events You Manage
            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
              activeTab === 'MANAGING' ? 'bg-blue-50 text-nss-blue' : 'bg-gray-200 text-gray-600'
            }`}>
              {managingActivities.length}
            </span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="w-10 h-10 border-3 border-nss-blue border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="font-bold text-sm">Loading your activities...</p>
        </div>
      ) : activeTab === 'ATTENDED' ? (
        /* Tab 1: Attended Activities */
        <div>
          {attendedActivities.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-blue-50 text-nss-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Attended Events Yet</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                When an admin marks you Present for an event, it will appear here along with your approved hours.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attendedActivities.map((reg) => {
                const act = reg.activityId || {};
                const hours = act.hoursAllocated || act.workingHours || 0;

                return (
                  <motion.div
                    key={reg._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                  >
                    {/* Optional Banner */}
                    {act.bannerUrl && (
                      <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                        <img 
                          src={act.bannerUrl} 
                          alt={act.title || 'Event'} 
                          className="w-full h-full object-cover"
                          onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-emerald-600/90 backdrop-blur-md text-white text-xs font-black rounded-full shadow-sm flex items-center gap-1">
                            <CheckCircle2 size={13} /> Present
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      {!act.bannerUrl && (
                        <div className="flex justify-between items-center mb-3">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-full flex items-center gap-1">
                            <CheckCircle2 size={13} /> Present
                          </span>
                          {hours > 0 && (
                            <span className="px-2.5 py-1 bg-blue-50 text-nss-blue text-xs font-black rounded-lg">
                              +{hours} Hours
                            </span>
                          )}
                        </div>
                      )}

                      <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-1">{act.title || 'NSS Activity'}</h3>
                      <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mb-4 leading-relaxed flex-1">
                        {act.description || 'NSS community engagement initiative.'}
                      </p>

                      <div className="space-y-2 pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-nss-blue shrink-0" />
                          <span>{act.date ? new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}</span>
                        </div>
                        {act.venue && (
                          <div className="flex items-center gap-2 truncate">
                            <MapPin size={14} className="text-rose-500 shrink-0" />
                            <span className="truncate">{act.venue}</span>
                          </div>
                        )}
                        {act.bannerUrl && hours > 0 && (
                          <div className="flex items-center gap-2 text-emerald-600 font-bold">
                            <Clock size={14} className="shrink-0" />
                            <span>+{hours} Hours Credited</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Tab 2: Events You Manage */
        <div>
          {managingActivities.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-blue-50 text-nss-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Managed Events Assigned</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                When you are appointed as an Event Manager for an NSS activity, you will be able to edit event details and mark volunteer attendance here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {managingActivities.map((act) => (
                <motion.div
                  key={act._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-center gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                        act.isRegistrationOpen 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {act.isRegistrationOpen ? 'Registration Open' : 'Closed'}
                      </span>
                      <span className="px-2.5 py-1 bg-blue-50 text-nss-blue text-xs font-black rounded-lg">
                        {act.hoursAllocated || act.workingHours || 0} Hours
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-1">{act.title}</h3>
                    <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mb-4 leading-relaxed flex-1">
                      {act.description || 'Manage volunteers, edit details, and mark event attendance.'}
                    </p>

                    <div className="space-y-2 py-3 border-y border-gray-100 text-xs text-gray-500 font-medium mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-nss-blue shrink-0" />
                        <span>{act.date ? new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}</span>
                      </div>
                      {act.venue && (
                        <div className="flex items-center gap-2 truncate">
                          <MapPin size={14} className="text-rose-500 shrink-0" />
                          <span className="truncate">{act.venue}</span>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/dashboard/activities/${act._id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-nss-blue text-white font-bold text-sm rounded-xl hover:bg-blue-800 transition-colors shadow-sm"
                    >
                      Manage & Mark Attendance <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
