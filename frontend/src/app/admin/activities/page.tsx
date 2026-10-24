'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, MoreVertical, Edit, Users, CalendarDays, MapPin } from 'lucide-react';
import api from '@/lib/axios';

export default function AdminActivities() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/activities');
      setActivities(Array.isArray(data) ? data : (data?.activities || []));
    } catch (err: any) {
      console.error('Error fetching activities:', err);
      setError('Could not connect to the backend server. The server might be waking up.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter(a => {
    const statusFilter = filter === 'All' 
      ? true 
      : filter === 'Open' 
      ? a.isRegistrationOpen 
      : !a.isRegistrationOpen;
    const searchFilter = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return statusFilter && searchFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Manage Activities</h1>
          <p className="text-sm text-gray-500">Create, edit, and manage all NSS events and drives.</p>
        </div>
        {/* We would typically have an 'Add Activity' modal or page. For now just a button */}
        <Link href="/admin/activities/new" className="flex items-center gap-2 px-5 py-2.5 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors">
          <Plus size={18} /> New Activity
        </Link>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-blue outline-none transition-shadow text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter size={18} className="text-gray-400 shrink-0" />
          {['All', 'Open', 'Closed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === status 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <div className="w-10 h-10 border-3 border-nss-blue border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="font-bold text-gray-700 text-sm">Loading Activities...</p>
          <p className="text-xs text-gray-400 mt-1">Connecting to server, please hold on</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 p-8 max-w-lg mx-auto shadow-sm">
          <p className="font-bold text-gray-900 text-lg mb-2">Failed to Load Activities</p>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">{error}</p>
          <button 
            onClick={fetchActivities}
            className="px-6 py-2.5 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-sm text-sm"
          >
            Retry Loading
          </button>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 text-gray-500 font-medium">
          No activities found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map(activity => (
            <div key={activity._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col relative group">
              
              <div className="mb-4 pr-8">
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-3 ${
                  activity.isRegistrationOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {activity.isRegistrationOpen ? 'Registrations Open' : 'Closed'}
                </span>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">{activity.title}</h3>
              </div>

              <div className="space-y-2 mb-6 flex-1">
                <div className="flex items-center text-sm text-gray-500 gap-2">
                  <CalendarDays size={14} className="text-nss-blue" />
                  {new Date(activity.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500 gap-2">
                  <MapPin size={14} className="text-nss-red" />
                  <span className="truncate">{activity.venue}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-2">
                <Link 
                  href={`/admin/activities/${activity._id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-nss-blue rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
                >
                  <Users size={16} />
                  Manage Activity
                </Link>
                {/* Normally we'd have a separate edit page, or a modal. */}
                <Link 
                  href={`/admin/activities/${activity._id}/edit`}
                  className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                >
                  <Edit size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
