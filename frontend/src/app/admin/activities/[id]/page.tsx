'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, Save, Edit, Trash2, 
  Users, FileText, Upload, Download, Plus, Search, UserX, UserPlus, 
  UploadCloud, AlertCircle, CheckCircle2, Briefcase, ShieldCheck 
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import FormBuilder, { IFormField } from '@/components/admin/FormBuilder';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageActivityPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [activity, setActivity] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'volunteers' | 'managers' | 'registration'>('volunteers');
  const [volunteerSearchQuery, setVolunteerSearchQuery] = useState('');
  const [managerSearchQuery, setManagerSearchQuery] = useState('');
  const [isUpdatingManagers, setIsUpdatingManagers] = useState(false);

  const handleAssignManager = async (volunteerId: string) => {
    setIsUpdatingManagers(true);
    try {
      const currentManagers = activity.eventManagers || [];
      const currentIds = currentManagers.map((m: any) => (m._id || m).toString());
      if (currentIds.includes(volunteerId)) {
        alert('This volunteer is already an Event Manager.');
        return;
      }
      const updatedIds = [...currentIds, volunteerId];
      await api.put(`/activities/${id}`, { eventManagers: updatedIds });

      const newManagerObj = allVolunteers.find(v => v._id === volunteerId);
      setActivity({
        ...activity,
        eventManagers: [...currentManagers, newManagerObj || volunteerId]
      });
      alert('Event Manager appointed successfully! They can now manage this activity from their Volunteer Portal under "Events You Manage".');
      setManagerSearchQuery('');
    } catch (error) {
      console.error('Error appointing manager:', error);
      alert('Failed to appoint event manager');
    } finally {
      setIsUpdatingManagers(false);
    }
  };

  const handleRemoveManager = async (managerId: string) => {
    if (!window.confirm('Remove Event Manager permissions from this volunteer?')) return;
    setIsUpdatingManagers(true);
    try {
      const currentManagers = activity.eventManagers || [];
      const updatedManagers = currentManagers.filter((m: any) => (m._id || m).toString() !== managerId);
      const updatedIds = updatedManagers.map((m: any) => (m._id || m).toString());
      await api.put(`/activities/${id}`, { eventManagers: updatedIds });

      setActivity({
        ...activity,
        eventManagers: updatedManagers
      });
      alert('Event Manager permissions removed.');
    } catch (error) {
      console.error('Error removing manager:', error);
      alert('Failed to remove event manager');
    } finally {
      setIsUpdatingManagers(false);
    }
  };
  const [isSavingForm, setIsSavingForm] = useState(false);
  
  const [certificateUploadingFor, setCertificateUploadingFor] = useState<string | null>(null);
  const [attendanceUpdates, setAttendanceUpdates] = useState<Record<string, string>>({});
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);

  // Single Add Volunteer Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [allVolunteers, setAllVolunteers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingVolunteer, setIsAddingVolunteer] = useState(false);
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);

  // Bulk Add Volunteers Modal States
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [bulkAddInput, setBulkAddInput] = useState('');
  const [isBulkAdding, setIsBulkAdding] = useState(false);

  // Bulk Mark Absent Modal States
  const [showBulkAbsentModal, setShowBulkAbsentModal] = useState(false);
  const [bulkAbsentInput, setBulkAbsentInput] = useState('');
  const [markOthersPresent, setMarkOthersPresent] = useState(true);
  const [isBulkMarkingAbsent, setIsBulkMarkingAbsent] = useState(false);

  const fetchVolunteers = async () => {
    try {
      const { data } = await api.get('/users');
      const volunteers = data.filter((u: any) => u.role === 'VOLUNTEER' || !u.role || u.role === 'EVENT_MANAGER');
      setAllVolunteers(volunteers);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    }
  };

  const handleAddSelectedVolunteers = async () => {
    if (selectedVolunteers.length === 0) return;
    setIsAddingVolunteer(true);
    try {
      const { data } = await api.post('/forms/registrations/manual', {
        activityId: id,
        userIds: selectedVolunteers
      });
      setRegistrations([...registrations, ...data.registrations]);
      alert('Volunteers added successfully!');
      setShowAddModal(false);
      setSelectedVolunteers([]);
    } catch (error: any) {
      console.error('Error adding volunteers:', error);
      alert(error.response?.data?.message || 'Failed to add volunteers');
    } finally {
      setIsAddingVolunteer(false);
    }
  };

  // Bulk Add Parsing & Submission
  const parseBulkAdd = () => {
    if (!bulkAddInput.trim() || allVolunteers.length === 0) return { matched: [], alreadyAdded: [], notFound: [] };

    // Extract potential registration numbers (case-insensitive) or names
    const tokens = bulkAddInput
      .split(/[\n,;\t]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const matchedMap = new Map<string, any>();
    const alreadyAddedMap = new Map<string, any>();
    const notFound: string[] = [];

    tokens.forEach(token => {
      // Clean token and search
      const cleanToken = token.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      
      // Try to find volunteer by registration number or name
      const found = allVolunteers.find(v => {
        const vReg = (v.registrationNumber || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const vName = (v.name || '').toLowerCase();
        return (cleanToken.length >= 6 && vReg.includes(cleanToken)) || 
               vReg === cleanToken || 
               vName.includes(token.toLowerCase());
      });

      if (found) {
        const isAlreadyInEvent = registrations.some(r => r.userId?._id === found._id || r.userId === found._id);
        if (isAlreadyInEvent) {
          alreadyAddedMap.set(found._id, found);
        } else {
          matchedMap.set(found._id, found);
        }
      } else {
        if (!notFound.includes(token)) notFound.push(token);
      }
    });

    return {
      matched: Array.from(matchedMap.values()),
      alreadyAdded: Array.from(alreadyAddedMap.values()),
      notFound
    };
  };

  const handleExecuteBulkAdd = async () => {
    const { matched } = parseBulkAdd();
    if (matched.length === 0) {
      alert('No new matching volunteers found to add.');
      return;
    }

    setIsBulkAdding(true);
    try {
      const userIds = matched.map(m => m._id);
      const { data } = await api.post('/forms/registrations/manual', {
        activityId: id,
        userIds
      });
      setRegistrations([...registrations, ...data.registrations]);
      alert(`Successfully added ${data.registrations?.length || matched.length} volunteers to this event!`);
      setShowBulkAddModal(false);
      setBulkAddInput('');
    } catch (error: any) {
      console.error('Error bulk adding volunteers:', error);
      alert(error.response?.data?.message || 'Failed to add volunteers in bulk');
    } finally {
      setIsBulkAdding(false);
    }
  };

  // Bulk Absent Parsing & Submission
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

  const handleRemoveVolunteer = async (registrationId: string) => {
    if (!window.confirm('Are you sure you want to remove this volunteer from the activity?')) return;
    
    try {
      await api.delete(`/forms/registrations/${registrationId}`);
      setRegistrations(registrations.filter(r => r._id !== registrationId));
      alert('Volunteer removed successfully!');
    } catch (error) {
      console.error('Error removing volunteer:', error);
      alert('Failed to remove volunteer');
    }
  };

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

  const handleCertificateUpload = async (registrationId: string, file: File) => {
    setCertificateUploadingFor(registrationId);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const fileUrl = uploadRes.data.url || uploadRes.data.fileUrl;
      const { data } = await api.put(`/forms/registrations/${registrationId}/certificate`, { certificateUrl: fileUrl });
      
      setRegistrations(registrations.map(r => r._id === registrationId ? data : r));
      alert('Certificate assigned successfully!');
    } catch (error) {
      console.error('Error uploading certificate:', error);
      alert('Failed to upload certificate');
    } finally {
      setCertificateUploadingFor(null);
    }
  };

  const handleBulkZipUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('zipFile', file);
    try {
      const res = await api.post('/upload/bulk-certificates', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(`Bulk upload processed: ${res.data.successCount} certificates mapped.`);
      window.location.reload();
    } catch (error) {
      console.error('Error processing zip:', error);
      alert('Failed to process bulk certificates');
    }
  };

  const handleSaveFormSchema = async (newSchema: IFormField[]) => {
    setIsSavingForm(true);
    try {
      const { data } = await api.put(`/activities/${id}`, { formSchema: newSchema });
      setActivity(data);
      alert('Registration form updated successfully!');
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Failed to save form');
    } finally {
      setIsSavingForm(false);
    }
  };

  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch activity details first
      const actRes = await api.get(`/activities/${id}`);
      setActivity(actRes.data);

      // 2. Fetch registrations (with fallback)
      try {
        const regRes = await api.get(`/forms/registrations/${id}`);
        setRegistrations(Array.isArray(regRes.data) ? regRes.data : []);
      } catch (e1) {
        try {
          const fallbackRes = await api.get(`/forms/activity/${id}/registrations`);
          setRegistrations(Array.isArray(fallbackRes.data) ? fallbackRes.data : []);
        } catch (e2) {
          console.warn('Could not fetch registrations:', e2);
          setRegistrations([]);
        }
      }

      fetchVolunteers();
    } catch (err: any) {
      console.error('Error fetching activity details:', err);
      setError('Activity could not be loaded. Please verify your connection or try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-28 text-gray-400">
      <div className="w-10 h-10 border-3 border-nss-blue border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="font-bold text-gray-700 text-sm">Loading activity details...</p>
    </div>
  );

  if (error || !activity) return (
    <div className="text-center py-20 bg-white rounded-3xl border border-rose-100 p-8 max-w-lg mx-auto shadow-sm my-10">
      <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle size={32} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{error || 'Activity Not Found'}</h3>
      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
        The activity details could not be retrieved from the server.
      </p>
      <div className="flex justify-center gap-3">
        <Link href="/admin/activities" className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm">
          Back to Activities
        </Link>
        <button onClick={fetchData} className="px-5 py-2.5 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors text-sm">
          Retry
        </button>
      </div>
    </div>
  );

  const filteredUnregisteredVolunteers = allVolunteers
    .filter(v => 
      v.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(v => {
      const vId = (v._id || v.id || '').toString();
      return !registrations.some(r => {
        const rUserId = (r.userId?._id || r.userId?.id || r.userId || '').toString();
        return rUserId === vId;
      });
    });

  const { matched: bulkMatched, alreadyAdded: bulkAlreadyAdded, notFound: bulkNotFound } = parseBulkAdd();
  const { absentMatches: bulkAbsentMatches, otherRegistrations: bulkOtherRegistrations } = parseBulkAbsent();

  const filteredRegistrations = registrations.filter((reg) => {
    if (!reg.userId) return false;
    const q = volunteerSearchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (reg.userId?.name || '').toLowerCase();
    const regNo = (reg.userId?.registrationNumber || '').toLowerCase();
    const email = (reg.userId?.email || '').toLowerCase();
    return name.includes(q) || regNo.includes(q) || email.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/activities" className="p-2.5 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{activity.title}</h1>
          <p className="text-sm text-gray-500 font-medium">Manage registrations, attendance, and certificates</p>
        </div>
      </div>

      {/* Activity Details Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start justify-between">
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Date</p>
              <p className="font-semibold text-gray-900">{new Date(activity.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Venue</p>
              <p className="font-semibold text-gray-900 truncate">{activity.venue || 'Campus'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Allocated Hours</p>
              <p className="font-semibold text-gray-900">{activity.hoursAllocated || activity.workingHours || 0} Hours</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Registrations Open</p>
              <p className="font-semibold text-gray-900">{activity.isRegistrationOpen ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
        <div>
          <Link href={`/admin/activities/${id}/edit`} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-bold transition-colors">
            <Edit size={16} /> Edit Details
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('volunteers')}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'volunteers' ? 'border-nss-blue text-nss-blue' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={18} /> Volunteers & Attendance
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 font-bold">
            ${registrations.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('managers')}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'managers' ? 'border-nss-blue text-nss-blue' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Briefcase size={18} /> Event Managers (Organizer Access)
          <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-nss-blue font-bold">
            ${activity.eventManagers?.length || 0}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('registration')}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'registration' ? 'border-nss-blue text-nss-blue' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText size={18} /> Registration Portal
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'volunteers' ? (
          <motion.div key="volunteers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Action Toolbar */}
              <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-50/40">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:w-auto">
                  <div>
                    <h2 className="text-lg font-black text-gray-900">Registered Volunteers ({filteredRegistrations.length})</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Add volunteers and manage event attendance</p>
                  </div>

                  {/* Volunteer Search Box */}
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search by volunteer name or reg no..."
                      value={volunteerSearchQuery}
                      onChange={(e) => setVolunteerSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-nss-blue/20 focus:border-nss-blue font-medium placeholder:text-gray-400 shadow-2xs"
                    />
                    {volunteerSearchQuery && (
                      <button
                        onClick={() => setVolunteerSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold p-0.5"
                        title="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Single Add Volunteer */}
                  <button
                    onClick={() => {
                      fetchVolunteers();
                      setShowAddModal(true);
                      setSelectedVolunteers([]);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 text-nss-blue font-bold text-sm rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <Plus size={16} /> Add Volunteer
                  </button>

                  {/* Bulk Add Volunteers */}
                  <button
                    onClick={() => {
                      fetchVolunteers();
                      setShowBulkAddModal(true);
                      setBulkAddInput('');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    <UserPlus size={16} /> Bulk Add Volunteers
                  </button>

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

                  {/* Bulk Upload Certs */}
                  <div className="relative">
                    <input 
                      type="file" 
                      id="bulk-cert-upload"
                      accept=".zip"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleBulkZipUpload(e.target.files[0]);
                      }}
                    />
                    <label 
                      htmlFor="bulk-cert-upload"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 cursor-pointer transition-colors"
                    >
                      <UploadCloud size={16} /> Bulk Upload Certs (.zip)
                    </label>
                  </div>

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
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <th className="p-4">Volunteer</th>
                      <th className="p-4">Registration No.</th>
                      <th className="p-4">Attendance</th>
                      <th className="p-4">Certificate</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                          {volunteerSearchQuery ? (
                            <>No volunteers found matching "<strong className="text-gray-700">{volunteerSearchQuery}</strong>".</>
                          ) : (
                            <>No volunteers registered yet. Click <strong>+ Add Volunteer</strong> or <strong>Bulk Add Volunteers</strong> above.</>
                          )}
                        </td>
                      </tr>
                    ) : filteredRegistrations.map((reg) => {
                      const currentStatus = attendanceUpdates[reg._id] || reg.attendanceStatus;
                      const isPresent = currentStatus === 'ATTENDED' || currentStatus === 'Present';
                      const isAbsent = currentStatus === 'BUNKED' || currentStatus === 'Absent';

                      return (
                        <tr key={reg._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-4 font-bold text-gray-900">{reg.userId?.name || 'Unknown'}</td>
                          <td className="p-4 text-gray-600 font-mono text-sm">{reg.userId?.registrationNumber || '-'}</td>
                          
                          <td className="p-4">
                            <div className="flex items-center gap-4">
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

                          <td className="p-4">
                            {reg.certificateUrl ? (
                              <a 
                                href={reg.certificateUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold hover:underline"
                              >
                                View PDF
                              </a>
                            ) : (
                              <div className="relative inline-block">
                                <input 
                                  type="file" 
                                  id={`cert-${reg._id}`}
                                  accept="application/pdf"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleCertificateUpload(reg._id, e.target.files[0]);
                                    }
                                  }}
                                />
                                <label 
                                  htmlFor={`cert-${reg._id}`}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                                >
                                  <Upload size={12} /> {certificateUploadingFor === reg._id ? 'Uploading...' : 'Assign PDF'}
                                </label>
                              </div>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <button 
                              onClick={() => handleRemoveVolunteer(reg._id)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-flex"
                              title="Remove volunteer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="registration" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            {/* Form Responses Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Form Responses ({registrations.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-500">
                      <th className="p-4">Volunteer</th>
                      {activity.formSchema?.map((field: any) => (
                        <th key={field.id} className="p-4 whitespace-nowrap">{field.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.length === 0 ? (
                      <tr>
                        <td colSpan={(activity.formSchema?.length || 0) + 1} className="p-8 text-center text-gray-500">No responses yet.</td>
                      </tr>
                    ) : registrations.map((reg) => (
                      <tr key={reg._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-bold text-gray-900">{reg.userId?.name || 'Unknown'}</td>
                        {activity.formSchema?.map((field: any) => {
                          const resp = reg.responses?.find((r: any) => r.fieldId === field.id);
                          const isFile = field.type === 'FILE_UPLOAD';
                          return (
                            <td key={field.id} className="p-4 text-sm text-gray-600 max-w-xs truncate">
                              {resp ? (
                                isFile ? (
                                  <a href={resp.value} target="_blank" rel="noopener noreferrer" className="text-nss-blue flex items-center gap-1 hover:underline">
                                    <Download size={14} /> View File
                                  </a>
                                ) : Array.isArray(resp.value) ? (
                                  resp.value.join(', ')
                                ) : (
                                  resp.value.toString()
                                )
                              ) : (
                                '-'
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Form Builder */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Edit Registration Form</h2>
                <p className="text-sm text-gray-500">Modify the fields presented to users when they register.</p>
              </div>
              <div className="p-6">
                <FormBuilder initialFields={activity.formSchema || []} onSave={handleSaveFormSchema} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Single Add Volunteer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">Add Volunteer to Activity</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 border-b border-gray-100">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, reg number, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nss-blue/50 focus:border-nss-blue transition-all"
                />
              </div>
              
              {filteredUnregisteredVolunteers.length > 0 && (
                <label className="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded-lg">
                  <input 
                    type="checkbox"
                    checked={selectedVolunteers.length === filteredUnregisteredVolunteers.length && filteredUnregisteredVolunteers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVolunteers(filteredUnregisteredVolunteers.map(v => v._id));
                      } else {
                        setSelectedVolunteers([]);
                      }
                    }}
                    className="w-4 h-4 text-nss-blue rounded focus:ring-nss-blue"
                  />
                  <span className="text-sm font-bold text-gray-700">Select All Filtered ({filteredUnregisteredVolunteers.length})</span>
                </label>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {filteredUnregisteredVolunteers.map(volunteer => (
                <label key={volunteer._id} className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors border-b border-transparent hover:border-gray-100 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={selectedVolunteers.includes(volunteer._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVolunteers([...selectedVolunteers, volunteer._id]);
                      } else {
                        setSelectedVolunteers(selectedVolunteers.filter(id => id !== volunteer._id));
                      }
                    }}
                    className="w-4 h-4 text-nss-blue rounded focus:ring-nss-blue"
                  />
                  <div>
                    <p className="font-bold text-gray-900">{volunteer.name}</p>
                    <p className="text-sm text-gray-500 font-mono">{volunteer.registrationNumber}</p>
                  </div>
                </label>
              ))}
              
              {allVolunteers.length > 0 && filteredUnregisteredVolunteers.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  {searchQuery ? 'No volunteers match your search.' : 'All available volunteers are already added.'}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button
                disabled={isAddingVolunteer || selectedVolunteers.length === 0}
                onClick={handleAddSelectedVolunteers}
                className="px-6 py-2.5 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50"
              >
                {isAddingVolunteer ? 'Adding...' : `Add Selected (${selectedVolunteers.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Bulk Add Volunteers Modal */}
      {showBulkAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <UserPlus className="text-indigo-600" size={22} /> Bulk Add Volunteers
                </h3>
                <p className="text-xs text-gray-500 mt-1">Paste names or registration numbers (from Excel, CSV, or list)</p>
              </div>
              <button onClick={() => setShowBulkAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700">Paste List of Registration Numbers or Names:</label>
                <div className="relative">
                  <input
                    type="file"
                    id="bulk-add-csv-file"
                    accept=".csv,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setBulkAddInput(ev.target?.result as string || '');
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                  <label htmlFor="bulk-add-csv-file" className="text-xs font-bold text-nss-blue hover:underline cursor-pointer flex items-center gap-1">
                    <Upload size={12} /> Upload .CSV / .TXT
                  </label>
                </div>
              </div>

              <textarea
                rows={5}
                value={bulkAddInput}
                onChange={(e) => setBulkAddInput(e.target.value)}
                placeholder="Paste here, e.g.:&#10;21MSI10017&#10;22BCE11641&#10;22BHI10175"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-y"
              ></textarea>

              {/* Parsing Status & Preview */}
              {bulkAddInput.trim() && (
                <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                    <span className="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={13} /> {bulkMatched.length} Found Ready to Add
                    </span>
                    {bulkAlreadyAdded.length > 0 && (
                      <span className="text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                        {bulkAlreadyAdded.length} Already in Event
                      </span>
                    )}
                    {bulkNotFound.length > 0 && (
                      <span className="text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                        {bulkNotFound.length} Unrecognized
                      </span>
                    )}
                  </div>

                  {bulkMatched.length > 0 && (
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1 border-t border-gray-200/60 pt-2">
                      {bulkMatched.map(v => (
                        <div key={v._id} className="text-xs flex justify-between items-center py-1 border-b border-gray-100">
                          <span className="font-bold text-gray-800">{v.name}</span>
                          <span className="font-mono text-gray-500">{v.registrationNumber}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {bulkNotFound.length > 0 && (
                    <p className="text-[11px] text-gray-500">
                      Not found in volunteer database: {bulkNotFound.slice(0, 5).join(', ')}{bulkNotFound.length > 5 ? '...' : ''}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button
                onClick={() => setShowBulkAddModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isBulkAdding || bulkMatched.length === 0}
                onClick={handleExecuteBulkAdd}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-50 shadow-sm"
              >
                {isBulkAdding ? 'Adding...' : `Add ${bulkMatched.length} Volunteers`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Bulk Mark Absent Modal */}
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
                    id="bulk-absent-csv-file"
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
                  <label htmlFor="bulk-absent-csv-file" className="text-xs font-bold text-rose-600 hover:underline cursor-pointer flex items-center gap-1">
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
