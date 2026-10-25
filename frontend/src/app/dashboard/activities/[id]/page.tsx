'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Save, Trash2, Users, Search, XCircle, Edit, 
  UserX, UserCheck, CheckCircle2, AlertCircle, Clock, Calendar, MapPin, 
  Upload, Image as ImageIcon, FileText, FileSpreadsheet, 
  ToggleLeft, ToggleRight, RefreshCw, ExternalLink, Download, Plus, Lock, Unlock
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import FormBuilder, { IFormField } from '@/components/admin/FormBuilder';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageActivityPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [activity, setActivity] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Tab: volunteers | form_builder | responses
  const [activeTab, setActiveTab] = useState<'volunteers' | 'form_builder' | 'responses'>('volunteers');
  
  // Search States
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [responseSearchQuery, setResponseSearchQuery] = useState('');
  
  // Attendance States
  const [attendanceUpdates, setAttendanceUpdates] = useState<Record<string, string>>({});
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);

  // Form Builder & Settings States
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [isFormLockedForManagers, setIsFormLockedForManagers] = useState(false);
  const [formBannerUrl, setFormBannerUrl] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('Thank you for filling out the form! Our team will contact you shortly.');
  const [isSavingFormSettings, setIsSavingFormSettings] = useState(false);
  const [registrationMode, setRegistrationMode] = useState<'CUSTOM' | 'GOOGLE_FORM'>('CUSTOM');
  const [googleFormUrl, setGoogleFormUrl] = useState<string>('');
  const [isSavingGoogleForm, setIsSavingGoogleForm] = useState(false);

  const handleSaveGoogleFormUrl = async () => {
    if (isFormLockedForManagers) return;
    setIsSavingGoogleForm(true);
    try {
      await api.put(`/activities/${id}`, {
        registrationMode: 'GOOGLE_FORM',
        googleFormUrl,
        isRegistrationOpen: true
      });
      setActivity((prev: any) => prev ? { ...prev, registrationMode: 'GOOGLE_FORM', googleFormUrl, isRegistrationOpen: true } : null);
      setIsRegistrationOpen(true);
      alert('Google Form registration link saved successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save Google Form link');
    } finally {
      setIsSavingGoogleForm(false);
    }
  };
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // Edit Event Details States (Modal)
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
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

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch activity details
      const actRes = await api.get('/activities/' + id);
      const actData = actRes.data;
      setActivity(actData);
      setIsRegistrationOpen(actData.isRegistrationOpen !== false);
      setIsFormLockedForManagers(actData.isFormLockedForManagers === true);
      setFormBannerUrl(actData.formBannerUrl || '/images/default-event-banner.png');
      setConfirmationMessage(actData.confirmationMessage || 'Thank you for filling out the form! Our team will contact you shortly.');
      setRegistrationMode(actData.registrationMode || (actData.googleFormUrl ? 'GOOGLE_FORM' : 'CUSTOM'));
      setGoogleFormUrl(actData.googleFormUrl || '');

      setEditFormData({
        title: actData.title || '',
        date: actData.date ? new Date(actData.date).toISOString().split('T')[0] : '',
        venue: actData.venue || '',
        hoursAllocated: actData.hoursAllocated || actData.workingHours || 0,
        description: actData.description || '',
        isRegistrationOpen: actData.isRegistrationOpen !== false,
        bannerUrl: actData.bannerUrl || ''
      });

      // 2. Fetch registrations
      try {
        const regRes = await api.get('/forms/registrations/' + id);
        setRegistrations(Array.isArray(regRes.data) ? regRes.data : []);
      } catch (e1) {
        try {
          const fallbackRes = await api.get('/forms/activity/' + id + '/registrations');
          setRegistrations(Array.isArray(fallbackRes.data) ? fallbackRes.data : []);
        } catch (e2) {
          console.warn('Could not fetch registrations:', e2);
          setRegistrations([]);
        }
      }
    } catch (err: any) {
      console.error('Error fetching activity details:', err);
      setError('Activity could not be loaded. Please verify your connection or manager permissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchActivityData();
  }, [id]);

  // Attendance Handlers
    const handleMarkAllPresent = () => {
    const targets = volunteerSearch.trim() ? filteredVolunteers : volunteerRegistrations;
    if (targets.length === 0) {
      alert('No registered volunteers found to mark as present.');
      return;
    }
    const nextUpdates: Record<string, string> = { ...attendanceUpdates };
    targets.forEach(reg => {
      nextUpdates[reg._id] = 'ATTENDED';
    });
    setAttendanceUpdates(nextUpdates);
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

  // Bulk Absent Logic
  const parseBulkAbsent = () => {
    const volRegs = registrations.filter(r => r.registrationType === 'VOLUNTEER' || (!r.responses || r.responses.length === 0));
    if (!bulkAbsentInput.trim() || volRegs.length === 0) return { absentMatches: [], otherRegistrations: [] };

    const tokens = bulkAbsentInput
      .split(/[\n,;\t]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const absentMatchIds = new Set<string>();

    tokens.forEach(token => {
      const cleanToken = token.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      volRegs.forEach(r => {
        const regNo = (r.userId?.registrationNumber || r.registrationNumber || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const name = (r.userId?.name || r.fullName || '').toLowerCase();
        if ((cleanToken.length >= 6 && regNo.includes(cleanToken)) || regNo === cleanToken || name.includes(token.toLowerCase())) {
          absentMatchIds.add(r._id);
        }
      });
    });

    const absentMatches = volRegs.filter(r => absentMatchIds.has(r._id));
    const otherRegistrations = volRegs.filter(r => !absentMatchIds.has(r._id));

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

      absentMatches.forEach(r => {
        updates.push({ registrationId: r._id, attendanceStatus: 'BUNKED' });
      });

      if (markOthersPresent) {
        otherRegistrations.forEach(r => {
          updates.push({ registrationId: r._id, attendanceStatus: 'ATTENDED' });
        });
      }

      await api.put('/forms/registrations/attendance/batch', { updates });

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

  // Form Builder & Settings Handlers
  const handleToggleRegistration = async () => {
    const nextState = !isRegistrationOpen;
    setIsRegistrationOpen(nextState);
    try {
      await api.put('/activities/' + id, { isRegistrationOpen: nextState });
      setActivity((prev: any) => ({ ...prev, isRegistrationOpen: nextState }));
    } catch (error) {
      console.error('Error toggling registration:', error);
      setIsRegistrationOpen(!nextState);
      alert('Failed to update registration status');
    }
  };

  const handleBannerUpload = async (file: File) => {
    setIsUploadingBanner(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const uploadedUrl = res.data.url;
      setFormBannerUrl(uploadedUrl);
      await api.put('/activities/' + id, { formBannerUrl: uploadedUrl });
      setActivity((prev: any) => ({ ...prev, formBannerUrl: uploadedUrl }));
      alert('Custom registration form banner uploaded and saved!');
    } catch (error) {
      console.error('Banner upload failed:', error);
      alert('Failed to upload banner image. Please try again.');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleResetToDefaultBanner = async () => {
    const defaultUrl = '/images/default-event-banner.png';
    setFormBannerUrl(defaultUrl);
    try {
      await api.put('/activities/' + id, { formBannerUrl: defaultUrl });
      setActivity((prev: any) => ({ ...prev, formBannerUrl: defaultUrl }));
      alert('Registration form banner reset to official default NSS & VIT Bhopal banner.');
    } catch (error) {
      console.error('Error resetting banner:', error);
    }
  };

  const handleSaveFormSchema = async (newSchema: IFormField[]) => {
    setIsSavingFormSettings(true);
    try {
      // Auto open registrations when saving form schema
      const openState = true;
      setIsRegistrationOpen(true);

      const payload = {
        formSchema: newSchema,
        formBannerUrl: formBannerUrl || '/images/default-event-banner.png',
        isRegistrationOpen: openState,
        confirmationMessage
      };
      const { data } = await api.put('/activities/' + id, payload);
      
      // Also sync to formSchema endpoint
      try {
        await api.put('/forms/schema/' + id, {
          activityId: id,
          fields: newSchema,
          isActive: openState
        });
      } catch (errSchema) {
        console.warn('FormSchema collection sync note:', errSchema);
      }

      setActivity({ ...data, isRegistrationOpen: true });
      alert('Registration form saved and published live! Registrations are now open.');
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Failed to save form schema');
    } finally {
      setIsSavingFormSettings(false);
    }
  };

  // Export Responses to CSV / Excel
  const handleExportCSV = () => {
    if (participantResponses.length === 0) {
      alert('No participant responses found to export.');
      return;
    }

    const dynamicFields = (activity?.formSchema || []).filter((f: any) => f.type !== 'IMAGE');
    const headers = [
      '#',
      'Submission Date & Time',
      ...(dynamicFields.length > 0 
        ? dynamicFields.map((f: any) => f.label || f.id)
        : ['Student Name', 'Official VIT Email', 'Registration Number'])
    ];

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return '"' + str + '"';
    };

    const rows = participantResponses.map((reg, index) => {
      const date = reg.createdAt ? new Date(reg.createdAt).toLocaleString('en-IN') : '-';

      if (dynamicFields.length > 0) {
        const dynamicVals = dynamicFields.map((f: any) => {
          const resp = reg.responses?.find((r: any) => r.fieldId === f.id);
          let v = resp?.value;
          if ((v === undefined || v === null || v === '') && f.label) {
            const lbl = f.label.toLowerCase();
            if (lbl.includes('email')) v = reg.email || reg.userId?.email;
            else if (lbl.includes('name')) v = reg.fullName || reg.userId?.name;
            else if (lbl.includes('reg') && lbl.includes('no')) v = reg.registrationNumber || reg.userId?.registrationNumber;
            else if (lbl.includes('phone') || lbl.includes('contact') || lbl.includes('whatsapp')) v = reg.phoneNumber || reg.userId?.phoneNumber;
          }
          if (v === null || v === undefined) return '';
          if (typeof v === 'boolean') return v ? 'Yes' : 'No';
          if (Array.isArray(v)) return v.join(', ');
          return String(v);
        });

        return [
          index + 1,
          escapeCSV(date),
          ...dynamicVals.map(escapeCSV)
        ].join(',');
      } else {
        return [
          index + 1,
          escapeCSV(date),
          escapeCSV(reg.userId?.name || reg.fullName || '-'),
          escapeCSV(reg.userId?.email || reg.email || '-'),
          escapeCSV(reg.userId?.registrationNumber || reg.registrationNumber || '-')
        ].join(',');
      }
    });

    const csvContent = '\uFEFF' + [headers.map(escapeCSV).join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = (activity?.title || 'Event').replace(/[^a-zA-Z0-9_-]/g, '_') + '_Responses.csv';
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete Response Handler
  const handleDeleteResponse = async (regId: string) => {
    if (!window.confirm('Are you sure you want to delete this response record? This action cannot be undone.')) return;
    try {
      await api.delete('/forms/registrations/' + regId);
      setRegistrations(prev => prev.filter(r => r._id !== regId));
      alert('Registration response deleted successfully.');
    } catch (err) {
      console.error('Error deleting registration:', err);
      alert('Failed to delete registration response');
    }
  };

  // Edit Event Details (Modal) Handlers
  const handleSaveEventDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingDetails(true);
    try {
      const { data } = await api.put('/activities/' + id, editFormData);
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

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPoster(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileUrl = res.data.url || res.data.fileUrl;
      setEditFormData(prev => ({ ...prev, bannerUrl: fileUrl }));
    } catch (err) {
      console.error('Error uploading poster:', err);
      alert('Failed to upload poster image');
    } finally {
      setIsUploadingPoster(false);
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

  if (error || !activity) {
    return (
      <div className="p-8 text-center text-red-500 font-bold bg-white rounded-2xl border border-gray-100 shadow-xs">
        {error || 'Activity not found.'}
      </div>
    );
  }

  // Separate Duty Volunteers (for attendance) and Public Form Participants
  const volunteerRegistrations = registrations.filter(r => 
    r.registrationType === 'VOLUNTEER' || (!r.responses || r.responses.length === 0)
  );

  const participantResponses = registrations.filter(r => 
    r.registrationType === 'PARTICIPANT' || (r.responses && r.responses.length > 0)
  );

  // Filtered lists
  const filteredVolunteers = volunteerRegistrations.filter(r => {
    const q = volunteerSearch.toLowerCase();
    const name = (r.userId?.name || r.fullName || '').toLowerCase();
    const regNo = (r.userId?.registrationNumber || r.registrationNumber || '').toLowerCase();
    return name.includes(q) || regNo.includes(q);
  });

  const filteredResponses = participantResponses.filter(r => {
    const q = responseSearchQuery.toLowerCase();
    const name = (r.userId?.name || r.fullName || '').toLowerCase();
    const regNo = (r.userId?.registrationNumber || r.registrationNumber || '').toLowerCase();
    const email = (r.userId?.email || r.email || '').toLowerCase();
    const answerValues = (r.responses || []).map((x: any) => String(x.value || '').toLowerCase()).join(' ');
    return name.includes(q) || regNo.includes(q) || email.includes(q) || answerValues.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/activities" 
            className="p-2.5 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-50 text-nss-blue text-[11px] font-black rounded-md uppercase tracking-wider">
                Event Manager Control
              </span>
              <span className={'px-2 py-0.5 rounded-full text-[10px] font-bold ' + (isRegistrationOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700')}>
                {isRegistrationOpen ? '● Registrations Open' : '○ Closed'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-0.5">{activity.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={'/activities/' + id}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
          >
            <ExternalLink size={13} /> View Live Form
          </a>
          <button
            onClick={() => setShowEditDetailsModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            <Edit size={14} /> Edit Event Details
          </button>
        </div>
      </div>

      {/* Activity Overview Summary Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-200/80">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Date</p>
            <p className="font-bold text-gray-900 text-xs sm:text-sm">{activity.date ? new Date(activity.date).toLocaleDateString() : 'N/A'}</p>
          </div>
          {activity.time ? (
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Timing</p>
              <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">{activity.time}</p>
            </div>
          ) : null}
          <div>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Venue</p>
            <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">{activity.venue || 'Campus'}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Allocated NSS Hours</p>
            <p className="font-bold text-gray-900 text-xs sm:text-sm">{activity.hoursAllocated || activity.workingHours || 0} Hours</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Registration Status</p>
            <span className={'inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ' + (
              isRegistrationOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
            )}>
              {isRegistrationOpen ? 'Active / Open' : 'Closed'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('volunteers')}
          className={'px-4 py-3 font-bold text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 shrink-0 cursor-pointer ' + (
            activeTab === 'volunteers' ? 'border-nss-blue text-nss-blue' : 'border-transparent text-gray-500 hover:text-gray-800'
          )}
        >
          <Users size={17} /> Registered Volunteers ({volunteerRegistrations.length})
        </button>

        <button
          onClick={() => setActiveTab('form_builder')}
          className={'px-4 py-3 font-bold text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 shrink-0 cursor-pointer ' + (
            activeTab === 'form_builder' ? 'border-nss-blue text-nss-blue' : 'border-transparent text-gray-500 hover:text-gray-800'
          )}
        >
          <FileText size={17} /> Registration Portal & Form Builder
        </button>

        <button
          onClick={() => setActiveTab('responses')}
          className={'px-4 py-3 font-bold text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 shrink-0 cursor-pointer ' + (
            activeTab === 'responses' ? 'border-nss-blue text-nss-blue' : 'border-transparent text-gray-500 hover:text-gray-800'
          )}
        >
          <FileSpreadsheet size={17} /> Form Responses
          <span className="px-2 py-0.5 rounded-full text-xs bg-purple-50 text-purple-700 font-bold">
            ({participantResponses.length})
          </span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: REGISTERED VOLUNTEERS & ATTENDANCE */}
        {activeTab === 'volunteers' && (
          <motion.div key="volunteers" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 overflow-hidden">
              {/* Table Toolbar */}
              <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
                <div>
                  <h2 className="text-base font-black text-gray-900">Volunteer Attendance ({filteredVolunteers.length})</h2>
                  <p className="text-xs text-gray-500">Record volunteer attendance (Present/Absent). Mark changes and save below.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <div className="relative flex-1 sm:w-60">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      type="text"
                      placeholder="Search volunteer..."
                      value={volunteerSearch}
                      onChange={(e) => setVolunteerSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-nss-blue transition-all"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleMarkAllPresent}
                    className="px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck size={14} /> Mark All Present
                  </button>

                  <button
                    onClick={() => {
                      setShowBulkAbsentModal(true);
                      setBulkAbsentInput('');
                    }}
                    className="px-3.5 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserX size={14} /> Bulk Mark Absent
                  </button>

                  <button
                    disabled={isSavingAttendance || Object.keys(attendanceUpdates).length === 0}
                    onClick={handleBatchAttendanceSave}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-xs cursor-pointer"
                  >
                    <Save size={14} /> {isSavingAttendance ? 'Saving...' : Object.keys(attendanceUpdates).length > 0 ? `Save Attendance (${Object.keys(attendanceUpdates).length})` : 'Save Attendance'}
                  </button>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="p-4">Volunteer</th>
                      <th className="p-4">Registration No.</th>
                      <th className="p-4">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredVolunteers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-12 text-center text-gray-400 font-medium text-xs">
                          {volunteerSearch ? 'No volunteers match your search.' : 'No volunteers registered for this activity yet.'}
                        </td>
                      </tr>
                    ) : filteredVolunteers.map((reg) => {
                      const currentStatus = attendanceUpdates[reg._id] || reg.attendanceStatus;
                      const isPresent = currentStatus === 'ATTENDED' || currentStatus === 'Present';
                      const isAbsent = currentStatus === 'BUNKED' || currentStatus === 'Absent';

                      return (
                        <tr key={reg._id} className="hover:bg-slate-50/60 transition-colors text-xs">
                          <td className="p-4 font-bold text-gray-900">{reg.userId?.name || reg.fullName || 'Unknown'}</td>
                          <td className="p-4 text-gray-600 font-mono">{reg.userId?.registrationNumber || reg.registrationNumber || '-'}</td>
                          
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="radio"
                                  name={'attendance_' + reg._id}
                                  value="ATTENDED"
                                  checked={isPresent}
                                  onChange={() => handleAttendanceChange(reg._id, 'ATTENDED')}
                                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className={'font-bold text-xs ' + (isPresent ? 'text-emerald-700' : 'text-gray-500')}>
                                  Present
                                </span>
                              </label>

                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="radio"
                                  name={'attendance_' + reg._id}
                                  value="BUNKED"
                                  checked={isAbsent}
                                  onChange={() => handleAttendanceChange(reg._id, 'BUNKED')}
                                  className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                                />
                                <span className={'font-bold text-xs ' + (isAbsent ? 'text-rose-700' : 'text-gray-500')}>
                                  Absent
                                </span>
                              </label>

                              {attendanceUpdates[reg._id] && (
                                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-bold">
                                  Unsaved
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: REGISTRATION PORTAL & FORM BUILDER */}
        {activeTab === 'form_builder' && (
          <motion.div key="form_builder" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            
            {/* View-Only Banner if Locked by Admin */}
            {isFormLockedForManagers && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 shadow-xs">
                <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl shrink-0">
                  <Lock size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-amber-950">Form Editing Locked by Admin (View-Only Mode)</h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    The Admin has enabled <strong>View-Only</strong> mode for Event Managers. You can inspect all questions, test the form preview, and download responses, but form edits cannot be saved.
                  </p>
                </div>
              </div>
            )}

            {/* 1. Registration Status & Banner Settings Card */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-6 space-y-6">
              
              {/* Registration Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                    {isRegistrationOpen ? (
                      <ToggleRight size={22} className="text-emerald-600" />
                    ) : (
                      <ToggleLeft size={22} className="text-gray-400" />
                    )}
                    Registration Status (Form Publish ON / OFF)
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Toggle whether students can access and submit the registration form for this activity.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isFormLockedForManagers}
                  onClick={handleToggleRegistration}
                  className={'px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs ' + (
                    isFormLockedForManagers
                      ? 'bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed'
                      : isRegistrationOpen 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer' 
                        : 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'
                  )}
                >
                  {isFormLockedForManagers ? (
                    <>
                      <Lock size={13} /> {isRegistrationOpen ? 'Registrations OPEN (Locked by Admin)' : 'Registrations CLOSED (Locked by Admin)'}
                    </>
                  ) : (
                    isRegistrationOpen ? '✓ Registrations OPEN (Accepting Responses)' : '✕ Registrations CLOSED (Turn On)'
                  )}
                </button>
              </div>

              {/* Event Banner Management */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-black text-gray-900 flex items-center gap-2">
                      <ImageIcon size={16} className="text-nss-blue" /> Registration Form Header Banner
                    </h4>
                    <p className="text-xs text-gray-500">
                      Upload a custom banner for the registration form or use the official default VIT Bhopal & NSS Unit banner.
                    </p>
                  </div>

                  {isFormLockedForManagers ? (
                    <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                      <Lock size={12} /> Banner settings locked by Admin
                    </span>
                  ) : (
                  <div className="flex items-center gap-2">
                    <label className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl cursor-pointer transition-colors inline-flex items-center gap-1.5">
                      <Upload size={13} /> {isUploadingBanner ? 'Uploading...' : 'Upload Custom Banner'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleBannerUpload(e.target.files[0]);
                          }
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleResetToDefaultBanner}
                      className="px-3.5 py-1.5 bg-blue-50 text-nss-blue hover:bg-blue-100 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw size={13} /> Reset to Official Default
                    </button>
                  </div>
                  )}
                </div>

                {/* Banner Live Preview Container */}
                <div className="w-full bg-slate-50 border border-gray-200 rounded-2xl p-3 flex flex-col items-center justify-center">
                  <div className="w-full max-w-3xl max-h-[220px] rounded-xl overflow-hidden bg-white shadow-xs border border-gray-100 flex items-center justify-center p-2">
                    <img
                      src={formBannerUrl || '/images/default-event-banner.png'}
                      alt="Banner Preview"
                      className="w-full max-h-[190px] object-contain rounded-lg"
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {formBannerUrl && formBannerUrl !== '/images/default-event-banner.png' 
                      ? 'Custom Registration Form Banner Active' 
                      : 'Official VIT Bhopal & NSS Unit Default Banner Active'}
                  </div>
                </div>
              </div>

              {/* Confirmation / Thank You Message Input */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Custom Confirmation / Thank You Message:
                </label>
                <textarea
                  rows={2}
                  value={confirmationMessage}
                  disabled={isFormLockedForManagers}
                  onChange={(e) => setConfirmationMessage(e.target.value)}
                  placeholder="Thank you for filling out the form! Our team will contact you shortly."
                  className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:border-nss-blue transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  This message is displayed to the student upon successful form submission along with links to NSS official handles.
                </p>
              </div>
            </div>

            {/* 2. Registration Method Switcher */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <FileText size={17} className="text-nss-blue" /> Registration Form Mode
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Choose whether to design custom questions with the Form Builder or provide a direct Google Form link.
                  </p>
                </div>

                <div className="flex items-center bg-gray-100 p-1 rounded-xl shrink-0">
                  <button
                    type="button"
                    disabled={isFormLockedForManagers}
                    onClick={async () => {
                      setRegistrationMode('CUSTOM');
                      try {
                        await api.put(`/activities/${id}`, { registrationMode: 'CUSTOM' });
                        setActivity((prev: any) => prev ? { ...prev, registrationMode: 'CUSTOM' } : null);
                      } catch (e) {}
                    }}
                    className={'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ' + (
                      isFormLockedForManagers ? 'opacity-50 cursor-not-allowed ' : 'cursor-pointer '
                    ) + (
                      registrationMode === 'CUSTOM'
                        ? 'bg-white text-nss-blue shadow-xs font-black'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    Built-in Form Builder
                  </button>
                  <button
                    type="button"
                    disabled={isFormLockedForManagers}
                    onClick={async () => {
                      setRegistrationMode('GOOGLE_FORM');
                      try {
                        await api.put(`/activities/${id}`, { registrationMode: 'GOOGLE_FORM' });
                        setActivity((prev: any) => prev ? { ...prev, registrationMode: 'GOOGLE_FORM' } : null);
                      } catch (e) {}
                    }}
                    className={'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ' + (
                      isFormLockedForManagers ? 'opacity-50 cursor-not-allowed ' : 'cursor-pointer '
                    ) + (
                      registrationMode === 'GOOGLE_FORM'
                        ? 'bg-white text-nss-blue shadow-xs font-black'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    Google Form Link
                  </button>
                </div>
              </div>

              {registrationMode === 'GOOGLE_FORM' && (
                <div className="p-5 bg-blue-50/60 border border-blue-200/80 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-blue-950 uppercase tracking-wider">Google Form Registration Setup</h4>
                      <p className="text-xs text-blue-800 mt-0.5">
                        Students visiting this activity page will see a prominent <strong>"Click Here to Register Now"</strong> button that opens your Google Form.
                      </p>
                    </div>
                    {googleFormUrl && (
                      <a
                        href={googleFormUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-nss-blue hover:underline inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-blue-200 shadow-2xs"
                      >
                        Preview Form <ExternalLink size={13} />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="url"
                      disabled={isFormLockedForManagers}
                      value={googleFormUrl}
                      onChange={(e) => setGoogleFormUrl(e.target.value)}
                      placeholder="https://forms.gle/... or https://docs.google.com/forms/d/e/.../viewform"
                      className="flex-1 p-3 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-nss-blue shadow-2xs disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      disabled={isFormLockedForManagers || isSavingGoogleForm || !googleFormUrl.trim()}
                      onClick={handleSaveGoogleFormUrl}
                      className="px-6 py-3 bg-nss-blue hover:bg-blue-900 text-white font-bold text-xs rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      {isSavingGoogleForm ? 'Saving...' : 'Save Google Form Link'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Embedded FormBuilder (Only shown when Built-in Form mode is active) */}
            {registrationMode === 'CUSTOM' && (
              <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-6">
                <FormBuilder
                  initialFields={activity.formSchema || []}
                  onSave={handleSaveFormSchema}
                  isSaving={isSavingFormSettings}
                  readOnly={isFormLockedForManagers}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: FORM RESPONSES */}
        {activeTab === 'responses' && (
          <motion.div key="responses" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 overflow-hidden">
              
              {/* Responses Toolbar */}
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                <div>
                  <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                    <FileSpreadsheet size={18} className="text-nss-blue" />
                    Form Responses ({filteredResponses.length})
                  </h2>
                  <p className="text-xs text-gray-500">
                    Real-time responses submitted by students via the public registration form
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      type="text"
                      placeholder="Search responses..."
                      value={responseSearchQuery}
                      onChange={(e) => setResponseSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-nss-blue transition-all"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Download size={14} /> Download Responses (Excel)
                  </button>
                </div>
              </div>

              {/* Responses Table - Strictly displays Form Question Options */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="p-4 pl-5 w-12">#</th>
                      <th className="p-4 whitespace-nowrap">Submitted At</th>
                      {(activity.formSchema || []).filter((f: any) => f.type !== 'IMAGE').length > 0 ? (
                        (activity.formSchema || []).filter((f: any) => f.type !== 'IMAGE').map((field: any) => (
                          <th key={field.id} className="p-4 whitespace-nowrap">{field.label || 'Question'}</th>
                        ))
                      ) : (
                        <>
                          <th className="p-4 whitespace-nowrap">Student Name</th>
                          <th className="p-4 whitespace-nowrap">Official Email</th>
                          <th className="p-4 whitespace-nowrap">Reg Number</th>
                        </>
                      )}
                      <th className="p-4 text-right pr-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredResponses.length === 0 ? (
                      <tr>
                        <td colSpan={((activity.formSchema || []).filter((f: any) => f.type !== 'IMAGE').length || 3) + 3} className="p-12 text-center text-gray-400 font-medium text-xs">
                          {responseSearchQuery ? 'No responses match your search.' : 'No responses submitted yet. Share the event registration link with students!'}
                        </td>
                      </tr>
                    ) : filteredResponses.map((reg, index) => {
                      const formQuestions = (activity.formSchema || []).filter((f: any) => f.type !== 'IMAGE');
                      return (
                        <tr key={reg._id} className="hover:bg-slate-50/60 transition-colors text-xs">
                          <td className="p-4 pl-5 font-mono text-gray-400">{index + 1}</td>
                          <td className="p-4 text-gray-500 whitespace-nowrap font-mono text-[11px]">
                            {reg.createdAt ? new Date(reg.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                          </td>

                          {formQuestions.length > 0 ? (
                            formQuestions.map((field: any) => {
                              const resp = reg.responses?.find((r: any) => r.fieldId === field.id);
                              let val = resp?.value;
                              if ((val === undefined || val === null || val === '') && field.label) {
                                const lbl = field.label.toLowerCase();
                                if (lbl.includes('email')) val = reg.email || reg.userId?.email;
                                else if (lbl.includes('name')) val = reg.fullName || reg.userId?.name;
                                else if (lbl.includes('reg') && lbl.includes('no')) val = reg.registrationNumber || reg.userId?.registrationNumber;
                                else if (lbl.includes('phone') || lbl.includes('contact') || lbl.includes('whatsapp')) val = reg.phoneNumber || reg.userId?.phoneNumber;
                              }
                              const isFile = field.type === 'FILE_UPLOAD';

                              if (val === undefined || val === null || val === '') {
                                return <td key={field.id} className="p-4 text-gray-400 font-mono">-</td>;
                              }

                              if (isFile) {
                                return (
                                  <td key={field.id} className="p-4 text-gray-700 max-w-xs truncate">
                                    <a
                                      href={val}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-nss-blue hover:underline inline-flex items-center gap-1 font-bold"
                                    >
                                      <Download size={12} /> View File
                                    </a>
                                  </td>
                                );
                              }

                              const displayVal = typeof val === 'boolean' ? (val ? 'Yes' : 'No') : Array.isArray(val) ? val.join(', ') : String(val);

                              return (
                                <td key={field.id} className="p-4 text-gray-800 font-medium max-w-xs truncate" title={displayVal}>
                                  {displayVal}
                                </td>
                              );
                            })
                          ) : (
                            <>
                              <td className="p-4 font-bold text-gray-900">{reg.userId?.name || reg.fullName || '-'}</td>
                              <td className="p-4 font-mono text-blue-600">{reg.userId?.email || reg.email || '-'}</td>
                              <td className="p-4 font-mono text-gray-600">{reg.userId?.registrationNumber || reg.registrationNumber || '-'}</td>
                            </>
                          )}

                          <td className="p-4 text-right pr-5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleDeleteResponse(reg._id)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Response"
                            >
                              <Trash2 size={14} />
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
        )}
      </AnimatePresence>

      {/* MODAL 1: Bulk Mark Absent */}
      {showBulkAbsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2.5 text-rose-600">
                <UserX size={20} />
                <h3 className="font-black text-gray-900 text-lg">Bulk Mark Absent</h3>
              </div>
              <button 
                onClick={() => setShowBulkAbsentModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-500">
                Paste registration numbers or volunteer names who were <strong>absent</strong> (separated by commas, spaces, or new lines).
              </p>

              <textarea
                rows={5}
                placeholder="24BCY10379, 24BCY10380, etc."
                value={bulkAbsentInput}
                onChange={(e) => setBulkAbsentInput(e.target.value)}
                className="w-full p-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 font-mono"
              />

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={markOthersPresent}
                  onChange={(e) => setMarkOthersPresent(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-gray-700">
                  Mark all other registered volunteers as <span className="text-emerald-600">Present</span>
                </span>
              </label>

              {bulkAbsentInput.trim() && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-gray-700">
                    Preview: {parseBulkAbsent().absentMatches.length} volunteers matched as Absent.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBulkAbsentModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isBulkMarkingAbsent || !bulkAbsentInput.trim()}
                onClick={handleExecuteBulkAbsent}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <UserX size={14} /> {isBulkMarkingAbsent ? 'Applying...' : 'Confirm Bulk Absent'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Event Details */}
      {showEditDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2.5 text-gray-900">
                <Edit size={20} className="text-nss-blue" />
                <h3 className="font-black text-gray-900 text-lg">Edit Event Details</h3>
              </div>
              <button 
                onClick={() => setShowEditDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEventDetails} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-nss-blue outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-nss-blue outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Allocated NSS Hours</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editFormData.hoursAllocated}
                    onChange={(e) => setEditFormData({ ...editFormData, hoursAllocated: Number(e.target.value) })}
                    className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-nss-blue outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Venue</label>
                <input
                  type="text"
                  required
                  value={editFormData.venue}
                  onChange={(e) => setEditFormData({ ...editFormData, venue: e.target.value })}
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-nss-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Event Poster / Card Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editFormData.bannerUrl}
                    onChange={(e) => setEditFormData({ ...editFormData, bannerUrl: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-nss-blue outline-none"
                  />
                  <label className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl cursor-pointer transition-colors inline-flex items-center gap-1.5 shrink-0">
                    <Upload size={14} /> {isUploadingPoster ? 'Uploading...' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePosterUpload}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-nss-blue outline-none"
                />
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-2 -mx-6 -mb-6 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditDetailsModal(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingDetails}
                  className="px-5 py-2 bg-nss-blue hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isSavingDetails ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
