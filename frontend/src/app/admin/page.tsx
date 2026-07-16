'use client';

import { useEffect, useState } from 'react';
import { Users, CalendarDays, CheckCircle, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';

export default function AdminDashboardOverview() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    totalEvents: 0,
    openEvents: 0,
  });

  useEffect(() => {
    // Quick fetch for basic stats
    const fetchStats = async () => {
      try {
        const [usersRes, activitiesRes] = await Promise.all([
          api.get('/users'),
          api.get('/activities')
        ]);
        
        setStats({
          totalVolunteers: usersRes.data.length,
          totalEvents: activitiesRes.data.length,
          openEvents: activitiesRes.data.filter((a: any) => a.isRegistrationOpen).length,
        });
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gray-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
          <p className="text-gray-400 max-w-xl">
            You are logged in to the Admin Portal. Here is an overview of the current system status.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-nss-blue opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-50 text-nss-blue rounded-full flex items-center justify-center shrink-0">
            <Users />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Volunteers</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalVolunteers}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <CalendarDays />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Events</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalEvents}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Open Events</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.openEvents}</h3>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
          <ShieldAlert size={20} className="text-nss-red" /> Quick Actions
        </h3>
        <p className="text-sm text-gray-500 mb-6">Use the sidebar to navigate to specific management pages. As an admin, you can manage activities, oversee volunteers, and configure settings.</p>
        
        <div className="flex flex-wrap gap-4">
          <a href="/admin/activities" className="px-5 py-2.5 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors">
            Manage Activities
          </a>
          <a href="/admin/volunteers" className="px-5 py-2.5 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors">
            Manage Volunteers
          </a>
        </div>
      </div>
    </div>
  );
}
