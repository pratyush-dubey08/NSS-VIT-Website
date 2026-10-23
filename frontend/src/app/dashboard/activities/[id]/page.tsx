'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Save, Trash2, Users, Search, XCircle, Edit, 
  UserX, CheckCircle2, AlertCircle, Clock, Calendar, MapPin, 
  Upload, Image as ImageIcon 
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageActivityPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [activity, setActivity] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [attendanceUpdates, setAttendanceUpdates] = useState<Record<string, string>>({});
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);

  // Edit Event Details States
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    date: '',
    venue: '',
    hoursAllocated: 0,
    description: '',
    isRegistrationOpen: true,
    bannerUrl: ''
  });

  // Bulk Mark Absent Modal States
  const [showBulkAbsentModal, setShowBulkAbsentModal] = useState(false);
  const [bulkAbsentInput, setBulkAbsentInput] = useState('');
  const [markOthersPresent, setMarkOthersPresent] = useState(true);
  const [isBulkMarkingAbsent, setIsBulkMarkingAbsent] = useState(false);

  // Table Search Filter
  const [volunteerSearch, setVolunteerSearch] = useState('');

  const fetchActivityData = async () => {
    try {
      const actRes = await api.get(`/activities/${id}`);
      setActivity(actRes.data);

      try {
        const regRes = await api.get(`/forms/registrations/${id}`);
        setRegistrations(Array.isArray(regRes.data) ? regRes.data : []);
      } catch (e1) {
        try {
          const fallbackRes = await api.get(`/forms/activity/${id}/registrations`);
          setRegistrations(Array.isArray(fallbackRes.data) ? fallbackRes.data : []);
        } catch (e2) {
          setRegistrations([]);
        }
      }

      setEditFormData({
        title: actRes.data.title || '',
        date: actRes.data.date ? new Date(actRes.data.date).toISOString().split('T')[0] : '',
        venue: actRes.data.venue || '',
        hoursAllocated: actRes.data.hoursAllocated || actRes.data.workingHours || 0,
        description: actRes.data.description || '',
        isRegistrationOpen: actRes.data.isRegistrationOpen ?? true,
        bannerUrl: actRes.data.bannerUrl || ''
      });
    } catch (error) {
      console.error('Error fetching activity details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchActivityData();
  }, [id]);

  const handleAttendanceChange = (regId: string, status: string) => {
    setAttendanceUpdates(prev => ({ ...prev, [regId]: status }));
  };

  const handleBatchAttendanceSave = async () => {
    if (Object.keys(attendanceUpdates).length === 0) {
      alert('No attendance changes to save.');
      return;
    }
    
    setIsSavingAttendance(true);
    try {
      const updates = Object.keys(attendanceUpdates).map(regId => ({
        registrationId: regId,
        attendanceStatus: attendanceUpdates[regId]
      }));
      
      await api.put('/forms/registrations/attendance/batch', { updates });
      
      setRegistrations(registrations.map(r => ({
        ...r,
        attendanceStatus: attendanceUpdates[r._id] || r.attendanceStatus
      })));
      setAttendanceUpdates({});
      alert('Attendance saved successfully!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance');
    } finally {
      setIsSavingAttendance(false);
    }
  };

  // Bulk Absent Logic
  const parseBulkAbsent = () => {
    if (!bulkAbsentInput.trim() || registrations.length === 0) return { absentMatches: [], otherRegistrations: [] };

    const tokens = bulkAbsentInput
      .split(/[\n,;\t]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const absentMatchIds = new Set<string>();

    tokens.forEach(token => {
      const cleanToken = token.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      registrations.forEach(r => {
        const regNo = (r.userId?.registrationNumber || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const name = (r.userId?.name || '').toLowerCase();
        if ((cleanToken.length >= 6 && regNo.includes(cleanToken)) || regNo === cleanToken || name.includes(token.toLowerCase())) {
          absentMatchIds.add(r._id);
        }
      });
    });

    const absentMatches = registrations.filter(r => absentMatchIds.has(r._id));
    const otherRegistrations = registrations.filter(r => !absentMatchIds.has(r._id));

    return { absentMatches, otherRegistrations };
  };

  const handleExecuteBulkAbsent = async () => {
    const { absentMatches, otherRegistrations } = parseBulkAbsent();
    if (absentMatches.length === 0) {
      alert('No matching registered volunteers found for the absent list.');
      return;
    }

    setIsBulkMarkingAbsent(true);
    try {
      const updates: Array<{ registrationId: string; attendanceStatus: string }> = [];

      // Mark matched as Absent (BUNKED)
      absentMatches.forEach(r => {
        updates.push({ registrationId: r._id, attendanceStatus: 'BUNKED' });
      });

      // If markOthersPresent is true, mark everyone else as Present (ATTENDED)
      if (markOthersPresent) {
        otherRegistrations.forEach(r => {
          updates.push({ registrationId: r._id, attendanceStatus: 'ATTENDED' });
        });
      }

      await api.put('/forms/registrations/attendance/batch', { updates });

      // Update local state
      const updatesMap = new Map(updates.map(u => [u.registrationId, u.attendanceStatus]));
      setRegistrations(registrations.map(r => ({
        ...r,
        attendanceStatus: updatesMap.get(r._id) || r.attendanceStatus
      })));
      setAttendanceUpdates({});

      alert(`Attendance updated! Marked ${absentMatches.length} as Absent${markOthersPresent ? ` and ${otherRegistrations.length} as Present.` : '.'}`);
      setShowBulkAbsentModal(false);
      setBulkAbsentInput('');
    } catch (error) {
      console.error('Error applying bulk absent attendance:', error);
      alert('Failed to apply bulk absent attendance');
    } finally {
      setIsBulkMarkingAbsent(false);
    }
  };

  // Edit Event Details Handler
  const handleSaveEventDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingDetails(true);
    try {
      const { data } = await api.put(`/activities/${id}`, editFormData);
      setActivity(data);
      alert('Event details updated successfully!');
      setShowEditDetailsModal(false);
    } catch (error: any) {
      console.error('Error updating activity details:', error);
      alert(error.response?.data?.message || 'Failed to update event details');
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBanner(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileUrl = res.data.url || res.data.fileUrl;
      setEditFormData(prev => ({ ...prev, bannerUrl: fileUrl }));
    } catch (err) {
      console.error('Error uploading banner:', err);
      alert('Failed to upload banner');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <div className="w-10 h-10 border-3 border-nss-blue border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="font-bold text-sm">Loading activity details...</p>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="p-8 text-center text-red-500 font-bold bg-white rounded-2xl border border-gray-100">
        Activity not found.
      </div>
    );
  }

  const filteredRegistrations = registrations.filter(r => {
    const q = volunteerSearch.toLowerCase();
    const name = (r.userId?.name || '').toLowerCase();
    const regNo = (r.userId?.registrationNumber || '').toLowerCase();
    return name.includes(q) || regNo.includes(q);
  });

  const { absentMatches: bulkAbsentMatches, otherRegistrations: bulkOtherRegistrations } = parseBulkAbsent();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-4 mb-4">
        <Link 
          href="/dashboard/activities" 
          className="p-2.5 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-50 text-nss-blue text-xs font-black rounded-md uppercase tracking-wider">
              Event Manager Control
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1">{activity.title}</h1>
        </div>
      </div>

      {/* Activity Overview & Edit Details Banner */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4 flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Date</p>
              <p className="font-bold text-gray-900">{activity.date ? new Date(activity.date).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Venue</p>
              <p className="font-bold text-gray-900 truncate">{activity.venue || 'Campus'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Hours Credited</p>
              <p className="font-bold text-gray-900">{activity.hoursAllocated || activity.workingHours || 0} Hours</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Registration</p>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                activity.isRegistrationOpen 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {activity.isRegistrationOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Event Details Button */}
        <div>
          <button
            onClick={() => setShowEditDetailsModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
          >
            <Edit size={16} /> Edit Event Details
          </button>
        </div>
      </div>

      {/* Volunteers & Attendance Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/40">
          <div>
            <h2 className="text-lg font-black text-gray-900">Registered Volunteers ({registrations.length})</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Volunteers are added via Admin Portal. Mark attendance (Present/Absent) below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search volunteer..."
                value={volunteerSearch}
                onChange={(e) => setVolunteerSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nss-blue/30 focus:border-nss-blue"
              />
            </div>

            {/* Bulk Mark Absent */}
            <button
              onClick={() => {
                setShowBulkAbsentModal(true);
                setBulkAbsentInput('');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-700 font-bold text-sm rounded-xl hover:bg-rose-100 transition-colors"
            >
              <UserX size={16} /> Bulk Mark Absent
            </button>

            {/* Save Attendance */}
            <button
              disabled={isSavingAttendance || Object.keys(attendanceUpdates).length === 0}
              onClick={handleBatchAttendanceSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-sm"
            >
              <Save size={16} /> {isSavingAttendance ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Volunteer</th>
                <th className="p-4">Registration No.</th>
                <th className="p-4">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-gray-400 font-medium">
                    {volunteerSearch ? 'No volunteers match your search.' : 'No volunteers registered for this activity yet.'}
                  </td>
                </tr>
              ) : filteredRegistrations.map((reg) => {
                const currentStatus = attendanceUpdates[reg._id] || reg.attendanceStatus;
                const isPresent = currentStatus === 'ATTENDED' || currentStatus === 'Present';
                const isAbsent = currentStatus === 'BUNKED' || currentStatus === 'Absent';

                return (
                  <tr key={reg._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-gray-900">{reg.userId?.name || 'Volunteer'}</td>
                    <td className="p-4 text-gray-600 font-mono text-sm">{reg.userId?.registrationNumber || '-'}</td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`attendance-${reg._id}`}
                            value="ATTENDED"
                            checked={isPresent}
                            onChange={() => handleAttendanceChange(reg._id, 'ATTENDED')}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                          />
                          <span className={`text-sm font-medium ${isPresent ? 'text-emerald-700 font-bold' : 'text-gray-600'}`}>Present</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`attendance-${reg._id}`}
                            value="BUNKED"
                            checked={isAbsent}
                            onChange={() => handleAttendanceChange(reg._id, 'BUNKED')}
                            className="w-4 h-4 text-rose-600 focus:ring-rose-600 cursor-pointer"
                          />
                          <span className={`text-sm font-medium ${isAbsent ? 'text-rose-700 font-bold' : 'text-gray-600'}`}>Absent</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Edit Event Details Modal */}
      {showEditDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <Edit className="text-nss-blue" size={20} /> Edit Event Details
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Update information for this specific event</p>
              </div>
              <button 
                onClick={() => setShowEditDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveEventDetails} className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Event Title *</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-blue outline-none text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Date *</label>
                  <input
                    type="date"
                    required
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-blue outline-none text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Venue *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.venue}
                    onChange={(e) => setEditFormData({ ...editFormData, venue: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-blue outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Working Hours *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editFormData.hoursAllocated}
                    onChange={(e) => setEditFormData({ ...editFormData, hoursAllocated: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-blue outline-none text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Registration Status</label>
                  <select
                    value={editFormData.isRegistrationOpen ? 'Open' : 'Closed'}
                    onChange={(e) => setEditFormData({ ...editFormData, isRegistrationOpen: e.target.value === 'Open' })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-blue outline-none text-sm font-medium"
                  >
                    <option value="Open">Open (Accepting Registrations)</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Event Description *</label>
                <textarea
                  rows={4}
                  required
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-blue outline-none text-sm resize-y"
                ></textarea>
              </div>

              {/* Banner Upload */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Banner Image</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="manager-banner-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerUpload}
                  />
                  <label
                    htmlFor="manager-banner-upload"
                    className={`inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer transition-colors ${
                      isUploadingBanner ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <ImageIcon size={14} /> {isUploadingBanner ? 'Uploading...' : 'Upload New Banner'}
                  </label>
                </div>
                {editFormData.bannerUrl && (
                  <div className="mt-2 h-24 w-44 rounded-xl border border-gray-200 overflow-hidden relative">
                    <img src={editFormData.bannerUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-100 flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditDetailsModal(false)}
                  className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingDetails}
                  className="px-6 py-2 bg-nss-blue hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-50 shadow-sm"
                >
                  {isSavingDetails ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Bulk Mark Absent Modal */}
      {showBulkAbsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <UserX className="text-rose-600" size={22} /> Bulk Mark Absent
                </h3>
                <p className="text-xs text-gray-500 mt-1">Paste absent volunteers list — their attendance will be set to Absent.</p>
              </div>
              <button onClick={() => setShowBulkAbsentModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700">Paste Registration Numbers or Names of Absent Volunteers:</label>
                <div className="relative">
                  <input
                    type="file"
                    id="volunteer-bulk-absent-csv"
                    accept=".csv,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setBulkAbsentInput(ev.target?.result as string || '');
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                  <label htmlFor="volunteer-bulk-absent-csv" className="text-xs font-bold text-rose-600 hover:underline cursor-pointer flex items-center gap-1">
                    <Upload size={12} /> Upload .CSV / .TXT
                  </label>
                </div>
              </div>

              <textarea
                rows={5}
                value={bulkAbsentInput}
                onChange={(e) => setBulkAbsentInput(e.target.value)}
                placeholder="Paste absent registration numbers, e.g.:&#10;24BCY10379&#10;21BCE10101"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all resize-y"
              ></textarea>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-gray-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={markOthersPresent}
                  onChange={(e) => setMarkOthersPresent(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-600 cursor-pointer"
                />
                <div>
                  <p className="text-sm font-bold text-gray-800">Mark all other registered volunteers as Present</p>
                  <p className="text-xs text-gray-500">Volunteers not in this absent list will automatically be set to Present.</p>
                </div>
              </label>

              {bulkAbsentInput.trim() && (
                <div className="bg-rose-50/50 border border-rose-200/60 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-rose-700 flex items-center gap-1">
                      <AlertCircle size={14} /> {bulkAbsentMatches.length} Registered Volunteers will be marked ABSENT
                    </span>
                    {markOthersPresent && (
                      <span className="text-emerald-700">
                        {bulkOtherRegistrations.length} will be marked PRESENT
                      </span>
                    )}
                  </div>

                  {bulkAbsentMatches.length > 0 && (
                    <div className="max-h-36 overflow-y-auto space-y-1 border-t border-rose-200/60 pt-2">
                      {bulkAbsentMatches.map(r => (
                        <div key={r._id} className="text-xs flex justify-between items-center text-rose-900 py-1">
                          <span className="font-bold">{r.userId?.name}</span>
                          <span className="font-mono">{r.userId?.registrationNumber}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button
                onClick={() => setShowBulkAbsentModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isBulkMarkingAbsent || bulkAbsentMatches.length === 0}
                onClick={handleExecuteBulkAbsent}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-50 shadow-sm"
              >
                {isBulkMarkingAbsent ? 'Applying...' : `Apply Attendance (${bulkAbsentMatches.length} Absent)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
