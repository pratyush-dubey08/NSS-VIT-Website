'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Clock, Calendar, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';

export default function DashboardOverview() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [managedActivities, setManagedActivities] = useState<any[]>([]);
  const [registeredActivities, setRegisteredActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          // Fetch activities where user is event manager
          const { data: activitiesData } = await api.get('/activities');
          const managing = activitiesData.filter((a: any) => 
            a.eventManagers && a.eventManagers.some((m: any) => m._id === user._id || m === user._id)
          );
          setManagedActivities(managing);

          // Fetch user's registrations (activities attended)
          const { data: myRegistrations } = await api.get('/forms/my-registrations');
          setRegisteredActivities(myRegistrations);

        } catch (error) {
          console.error("Error fetching dashboard data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-nss-blue to-blue-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg mt-2">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome back, {user.name}!</h1>
          <p className="text-blue-100 max-w-xl text-lg">
            You are making a great impact. Check your upcoming activities and track your social service progress below.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 text-nss-blue rounded-full flex items-center justify-center shrink-0">
            <Clock size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Hours</p>
            <h3 className="text-4xl font-black text-gray-900">{user.accumulatedHours || 0} <span className="text-xl font-medium text-gray-500">hrs</span></h3>
          </div>
        </div>
      </div>

      {/* Events Managing Section */}
      {managedActivities.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
            <Briefcase className="text-nss-blue" size={20} /> Events You Are Managing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {managedActivities.map((activity) => (
              <div key={activity._id} className="border border-gray-100 rounded-xl p-4 hover:border-nss-blue/30 transition-colors">
                <h4 className="font-bold text-gray-900 truncate mb-1">{activity.title}</h4>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                  <span>{new Date(activity.date).toLocaleDateString()}</span>
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-bold">{activity.status || (activity.isRegistrationOpen ? 'Open' : 'Closed')}</span>
                </div>
                <Link href={`/dashboard/activities/${activity._id}`} className="block text-center w-full py-2 bg-blue-50 text-nss-blue font-bold text-sm rounded-lg hover:bg-blue-100 transition-colors">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Events Attended */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
          <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
            <Calendar className="text-nss-blue" size={20} /> My Events & Attendance
          </h3>
          
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 max-h-96">
            {loading ? (
              <p className="text-gray-500 text-sm">Loading...</p>
            ) : registeredActivities.length > 0 ? (
              registeredActivities.map((reg) => (
                <div key={reg._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <h4 className="font-bold text-gray-900 line-clamp-1">{reg.activityId?.title || 'Unknown Event'}</h4>
                    <p className="text-xs text-gray-500 mt-1">{reg.activityId?.date ? new Date(reg.activityId.date).toLocaleDateString() : 'No date'}</p>
                  </div>
                  <div className="shrink-0 ml-4">
                    {reg.attendanceStatus === 'Present' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        <CheckCircle size={14} /> Present
                      </span>
                    ) : reg.attendanceStatus === 'Absent' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                        <XCircle size={14} /> Absent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
                <Calendar className="text-gray-400 mb-2" size={32} />
                <p className="text-sm font-medium text-gray-500">You haven't registered for any events yet.</p>
                <Link href="/activities" className="mt-3 text-sm text-nss-blue font-bold hover:underline">
                  Browse Activities
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Certificates & Actions */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-lg mb-4">My Certificates</h3>
          
          <div className="space-y-3">
            {user.certificates && user.certificates.length > 0 ? (
              user.certificates.map((cert: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-yellow-50/50 rounded-xl border border-yellow-100">
                  <div>
                    <p className="text-xs font-bold text-yellow-600 uppercase mb-1">Certificate</p>
                    <h4 className="font-bold text-gray-900">{cert.title || 'NSS Event'}</h4>
                  </div>
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-bold text-sm rounded-lg transition-colors">
                    Download
                  </a>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl text-center">No certificates available yet. Keep participating in events!</p>
            )}
          </div>

          <h3 className="font-bold text-gray-900 text-lg mt-8 mb-4">Looking for activities?</h3>
          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-gray-600 mb-4">Browse our open activities and register to earn hours.</p>
            <Link href="/activities" className="bg-nss-blue text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-900 transition-colors w-full">
              Browse Activities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
