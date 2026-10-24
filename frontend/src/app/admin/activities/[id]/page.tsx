'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, Save, Edit, Trash2, 
  Users, FileText, Upload, Download, Plus, Search, UserX, UserPlus, 
  AlertCircle, CheckCircle2, Briefcase, ShieldCheck, ToggleLeft, ToggleRight,
  FileSpreadsheet, Image as ImageIcon, ExternalLink, RefreshCw, Eye, Lock, Unlock
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import FormBuilder, { IFormField, FieldType } from '@/components/admin/FormBuilder';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageActivityPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [activity, setActivity] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 4 Tabs: volunteers | managers | form_builder | responses
  const [activeTab, setActiveTab] = useState<'volunteers' | 'managers' | 'form_builder' | 'responses'>('volunteers');
  const [volunteerSearchQuery, setVolunteerSearchQuery] = useState('');
  const [responseSearchQuery, setResponseSearchQuery] = useState('');
  
  // Event Managers states
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [managerSearchQuery, setManagerSearchQuery] = useState('');
  const [isUpdatingManagers, setIsUpdatingManagers] = useState(false);

  // Form Builder & Settings states
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [isFormLockedForManagers, setIsFormLockedForManagers] = useState(false);
  const [isUpdatingLock, setIsUpdatingLock] = useState(false);
  const [formBannerUrl, setFormBannerUrl] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('Thank you for filling out the form! Our team will contact you shortly.');
  const [isSavingFormSettings, setIsSavingFormSettings] = useState(false);
  const [registrationMode, setRegistrationMode] = useState<'CUSTOM' | 'GOOGLE_FORM'>(
    activity.registrationMode || (activity.googleFormUrl ? 'GOOGLE_FORM' : 'CUSTOM')
  );
  const [googleFormUrl, setGoogleFormUrl] = useState<string>(activity.googleFormUrl || '');
  const [isSavingGoogleForm, setIsSavingGoogleForm] = useState(false);

  const handleSaveGoogleFormUrl = async () => {
    setIsSavingGoogleForm(true);
    try {
      await api.put(`/activities/${id}`, {
        registrationMode: 'GOOGLE_FORM',
        googleFormUrl,
        isRegistrationOpen: true
      });
      setActivity((prev: any) => prev ? { ...prev, registrationMode: 'GOOGLE_FORM', googleFormUrl, isRegistrationOpen: true } : null);
      setIsRegistrationOpen(true);
      alert('✓ Google Form registration link saved successfully! Students will see "Click Here to Register Now".');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save Google Form link');
    } finally {
      setIsSavingGoogleForm(false);
    }
  };
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // Attendance & Cert states
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
    } catch (err) {
      console.error('Error fetching volunteers:', err);
    }
  };

  const fetchData = async () => {
    if (!id) return;
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

  // Event Manager Handlers
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
      const { data } = await api.put('/activities/' + id, { eventManagers: updatedIds });

      const newManagerObj = allVolunteers.find(v => v._id === volunteerId);
      setActivity({
        ...activity,
        eventManagers: data.eventManagers || [...currentManagers, newManagerObj || volunteerId]
      });
      alert('Event Manager appointed successfully! They now have organizer access.');
      setShowManagerModal(false);
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
      await api.put('/activities/' + id, { eventManagers: updatedIds });

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

  // Form Builder & Settings Handlers
  const handleToggleLockForManagers = async () => {
    const nextState = !isFormLockedForManagers;
    setIsUpdatingLock(true);
    try {
      await api.put('/activities/' + id, { isFormLockedForManagers: nextState });
      setIsFormLockedForManagers(nextState);
      setActivity((prev: any) => ({ ...prev, isFormLockedForManagers: nextState }));
      alert(
        nextState 
          ? 'Form editing has been locked for Event Managers. Managers now have view-only access.' 
          : 'Form editing unlocked. Event Managers can now edit and save questions.'
      );
    } catch (error) {
      console.error('Error toggling manager lock:', error);
      alert('Failed to update form lock status');
    } finally {
      setIsUpdatingLock(false);
    }
  };

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
      const openState = true;
      setIsRegistrationOpen(true);

      const payload = {
        formSchema: newSchema,
        formBannerUrl: formBannerUrl || '/images/default-event-banner.png',
        isRegistrationOpen: openState,
        confirmationMessage
      };
      const { data } = await api.put('/activities/' + id, payload);

      try {
        await api.put('/forms/schema/' + id, {
          activityId: id,
          fields: newSchema,
          isActive: openState
        });
      } catch (errSchema) {
        console.warn('FormSchema sync note:', errSchema);
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

  // One-Click Excel / CSV Export
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

  // Volunteer & Attendance Handlers
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
    } catch (err: any) {
      console.error('Error adding volunteers:', err);
      alert(err.response?.data?.message || 'Failed to add volunteers');
    } finally {
      setIsAddingVolunteer(false);
    }
  };

  const parseBulkAdd = () => {
    if (!bulkAddInput.trim() || allVolunteers.length === 0) return { matched: [], alreadyAdded: [], notFound: [] };

    const tokens = bulkAddInput.split(/[\n,;\t]+/).map(t => t.trim()).filter(t => t.length > 0);
    const matchedMap = new Map<string, any>();
    const alreadyAddedMap = new Map<string, any>();
    const notFound: string[] = [];

    tokens.forEach(token => {
      const cleanToken = token.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const found = allVolunteers.find(v => {
        const vReg = (v.registrationNumber || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const vName = (v.name || '').toLowerCase();
        return (cleanToken.length >= 6 && vReg.includes(cleanToken)) || vReg === cleanToken || vName.includes(token.toLowerCase());
      });

      if (found) {
        const isAlreadyInEvent = (registrations.filter(r => r.registrationType === 'VOLUNTEER' || (!r.responses || r.responses.length === 0))).some(r => r.userId?._id === found._id || r.userId === found._id);
        if (isAlreadyInEvent) {
          alreadyAddedMap.set(found._id, found);
        } else {
          matchedMap.set(found._id, found);
        }
      } else {
        if (!notFound.includes(token)) notFound.push(token);
      }
    });

    return { matched: Array.from(matchedMap.values()), alreadyAdded: Array.from(alreadyAddedMap.values()), notFound };
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
      const { data } = await api.post('/forms/registrations/manual', { activityId: id, userIds });
      setRegistrations([...registrations, ...data.registrations]);
      alert('Successfully added ' + (data.registrations?.length || matched.length) + ' volunteers to this event!');
      setShowBulkAddModal(false);
      setBulkAddInput('');
    } catch (err: any) {
      console.error('Error bulk adding:', err);
      alert(err.response?.data?.message || 'Failed to add volunteers in bulk');
    } finally {
      setIsBulkAdding(false);
    }
  };

  const parseBulkAbsent = () => {
    const volRegs = registrations.filter(r => r.registrationType === 'VOLUNTEER' || (!r.responses || r.responses.length === 0));
    if (!bulkAbsentInput.trim() || volRegs.length === 0) return { absentMatches: [], otherRegistrations: [] };
    const tokens = bulkAbsentInput.split(/[\n,;\t]+/).map(t => t.trim()).filter(t => t.length > 0);
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
      alert('No matching registered volunteers found for absent list.');
      return;
    }

    setIsBulkMarkingAbsent(true);
    try {
      const updates: Array<{ registrationId: string; attendanceStatus: string }> = [];
      absentMatches.forEach(r => updates.push({ registrationId: r._id, attendanceStatus: 'BUNKED' }));
      if (markOthersPresent) {
        otherRegistrations.forEach(r => updates.push({ registrationId: r._id, attendanceStatus: 'ATTENDED' }));
      }

      await api.put('/forms/registrations/attendance/batch', { updates });
      const updatesMap = new Map(updates.map(u => [u.registrationId, u.attendanceStatus]));
      setRegistrations(registrations.map(r => ({
        ...r,
        attendanceStatus: updatesMap.get(r._id) || r.attendanceStatus
      })));
      setAttendanceUpdates({});
      alert('Attendance updated! Marked ' + absentMatches.length + ' as Absent' + (markOthersPresent ? (' and ' + otherRegistrations.length + ' as Present.') : '.'));
      setShowBulkAbsentModal(false);
      setBulkAbsentInput('');
    } catch (err) {
      console.error('Error applying bulk absent:', err);
      alert('Failed to apply bulk absent attendance');
    } finally {
      setIsBulkMarkingAbsent(false);
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
    } catch (err) {
      console.error('Error saving attendance:', err);
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
      const { data } = await api.put('/forms/registrations/' + registrationId + '/certificate', { certificateUrl: fileUrl });
      setRegistrations(registrations.map(r => r._id === registrationId ? data : r));
      alert('Certificate assigned successfully!');
    } catch (err) {
      console.error('Error uploading certificate:', err);
      alert('Failed to upload certificate');
    } finally {
      setCertificateUploadingFor(null);
    }
  };

  const handleRemoveVolunteer = async (registrationId: string) => {
    if (!window.confirm('Remove this response / volunteer record?')) return;
    try {
      await api.delete('/forms/registrations/' + registrationId);
      setRegistrations(registrations.filter(r => r._id !== registrationId));
      alert('Record removed successfully!');
    } catch (err) {
      console.error('Error removing record:', err);
      alert('Failed to remove record');
    }
  };

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
      <div className="flex justify-center gap-3 mt-6">
        <Link href="/admin/activities" className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm">
          Back to Activities
        </Link>
        <button onClick={fetchData} className="px-5 py-2.5 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors text-sm cursor-pointer">
          Retry
        </button>
      </div>
    </div>
  );

  // Separate Duty Volunteers (for attendance) and Public Form Participants
  const volunteerRegistrations = registrations.filter(r => 
    r.registrationType === 'VOLUNTEER' || (!r.responses || r.responses.length === 0)
  );

  const participantResponses = registrations.filter(r => 
    r.registrationType === 'PARTICIPANT' || (r.responses && r.responses.length > 0)
  );

  // Filters
  const filteredRegistrations = volunteerRegistrations.filter((reg) => {
    const q = volunteerSearchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (reg.userId?.name || reg.fullName || '').toLowerCase();
    const regNo = (reg.userId?.registrationNumber || reg.registrationNumber || '').toLowerCase();
    const email = (reg.userId?.email || reg.email || '').toLowerCase();
    return name.includes(q) || regNo.includes(q) || email.includes(q);
  });

  const filteredResponses = participantResponses.filter((reg) => {
    const q = responseSearchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (reg.userId?.name || reg.fullName || '').toLowerCase();
    const regNo = (reg.userId?.registrationNumber || reg.registrationNumber || '').toLowerCase();
    const email = (reg.userId?.email || reg.email || '').toLowerCase();
    const answerValues = (reg.responses || []).map((r: any) => String(r.value || '').toLowerCase()).join(' ');
    return name.includes(q) || regNo.includes(q) || email.includes(q) || answerValues.includes(q);
  });

  const currentManagerIds = new Set((activity.eventManagers || []).map((m: any) => (m._id || m).toString()));
  const potentialManagers = allVolunteers.filter(v => {
    if (currentManagerIds.has(v._id)) return false;
    const q = managerSearchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (v.name || '').toLowerCase();
    const regNo = (v.registrationNumber || '').toLowerCase();
    const email = (v.email || '').toLowerCase();
    return name.includes(q) || regNo.includes(q) || email.includes(q);
  });

  const filteredUnregisteredVolunteers = allVolunteers
    .filter(v => 
      v.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(v => {
      const vId = (v._id || v.id || '').toString();
      return !volunteerRegistrations.some(r => {
        const rUserId = (r.userId?._id || r.userId?.id || r.userId || '').toString();
        return rUserId === vId;
      });
    });

  const { matched: bulkMatched, alreadyAdded: bulkAlreadyAdded, notFound: bulkNotFound } = parseBulkAdd();
  const { absentMatches: bulkAbsentMatches, otherRegistrations: bulkOtherRegistrations } = parseBulkAbsent();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/activities" className="p-2.5 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">{activity.title}</h1>
            <p className="text-xs text-gray-500 font-medium">Manage event portal, form builder, event managers, and responses</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={'/activities/' + id}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <ExternalLink size={14} /> View Public Portal
          </a>
          <Link
            href={'/admin/activities/' + id + '/edit'}
            className="px-4 py-2 bg-nss-blue hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <Edit size={14} /> Edit Activity
          </Link>
        </div>
      </div>

      {/* Activity Details Overview Card */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">Date</p>
            <p className="font-bold text-gray-900 text-sm">{new Date(activity.date).toLocaleDateString()}</p>
          </div>
          {activity.time ? (
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">Timing</p>
              <p className="font-bold text-gray-900 text-sm truncate">{activity.time}</p>
            </div>
          ) : null}
          <div>
            <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">Venue</p>
            <p className="font-bold text-gray-900 text-sm truncate">{activity.venue || 'Campus'}</p>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">Allocated NSS Hours</p>
            <p className="font-bold text-gray-900 text-sm">{activity.hoursAllocated || activity.workingHours || 0} Hours</p>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">Registration Status</p>
            <span className={'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ' + (isRegistrationOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700')}>
              {isRegistrationOpen ? 'Active / Open' : 'Closed / Off'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Tabs (Fixed Dollar Display Bug!) */}
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('volunteers')}
          className={'px-4 py-3 font-bold text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 shrink-0 cursor-pointer ' + (
            activeTab === 'volunteers' ? 'border-nss-blue text-nss-blue' : 'border-transparent text-gray-500 hover:text-gray-800'
          )}
        >
          <Users size={17} /> Registered Volunteers
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 font-bold">
            ({volunteerRegistrations.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('managers')}
          className={'px-4 py-3 font-bold text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 shrink-0 cursor-pointer ' + (
            activeTab === 'managers' ? 'border-nss-blue text-nss-blue' : 'border-transparent text-gray-500 hover:text-gray-800'
          )}
        >
          <Briefcase size={17} /> Event Managers (Organizer Access)
          <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-nss-blue font-bold">
            ({activity.eventManagers?.length || 0})
          </span>
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
        
        {/* TAB 1: VOLUNTEERS & ATTENDANCE */}
        {activeTab === 'volunteers' && (
          <motion.div key="volunteers" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 overflow-hidden">
              {/* Action Toolbar */}
              <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-50/50">
                <div>
                  <h2 className="text-base font-black text-gray-900">Volunteer Attendance ({filteredRegistrations.length})</h2>
                  <p className="text-xs text-gray-500">Record volunteer attendance and assign certificates</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  <div className="relative flex-1 sm:w-60">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      type="text"
                      placeholder="Search volunteer..."
                      value={volunteerSearchQuery}
                      onChange={(e) => setVolunteerSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-nss-blue transition-all"
                    />
                  </div>

                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} /> Add Volunteer
                  </button>

                  <button
                    onClick={() => setShowBulkAddModal(true)}
                    className="px-3 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus size={14} /> Bulk Add
                  </button>

                  <button
                    onClick={() => setShowBulkAbsentModal(true)}
                    className="px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserX size={14} /> Bulk Mark Absent
                  </button>

                  <button
                    disabled={isSavingAttendance || Object.keys(attendanceUpdates).length === 0}
                    onClick={handleBatchAttendanceSave}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-xs cursor-pointer"
                  >
                    <Save size={14} /> {isSavingAttendance ? 'Saving...' : 'Save Attendance'}
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
                      <th className="p-4">Attendance</th>
                      <th className="p-4">Certificate</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-gray-400 font-medium text-xs">
                          {volunteerSearchQuery ? 'No volunteers found matching your search.' : 'No volunteers registered yet. Click + Add Volunteer or Bulk Add above.'}
                        </td>
                      </tr>
                    ) : filteredRegistrations.map((reg) => {
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
                                  name={'att_' + reg._id}
                                  value="ATTENDED"
                                  checked={isPresent}
                                  onChange={() => handleAttendanceChange(reg._id, 'ATTENDED')}
                                  className="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                                />
                                <span className={isPresent ? 'text-emerald-700 font-bold' : 'text-gray-600'}>Present</span>
                              </label>
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name={'att_' + reg._id}
                                  value="BUNKED"
                                  checked={isAbsent}
                                  onChange={() => handleAttendanceChange(reg._id, 'BUNKED')}
                                  className="w-3.5 h-3.5 text-rose-600 focus:ring-rose-600 cursor-pointer"
                                />
                                <span className={isAbsent ? 'text-rose-700 font-bold' : 'text-gray-600'}>Absent</span>
                              </label>
                            </div>
                          </td>

                          <td className="p-4">
                            {reg.certificateUrl ? (
                              <a 
                                href={reg.certificateUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-[11px] font-bold hover:underline"
                              >
                                View PDF
                              </a>
                            ) : (
                              <div className="relative inline-block">
                                <input 
                                  type="file" 
                                  id={'cert_' + reg._id}
                                  accept="application/pdf"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleCertificateUpload(reg._id, e.target.files[0]);
                                    }
                                  }}
                                />
                                <label 
                                  htmlFor={'cert_' + reg._id}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                                >
                                  <Upload size={11} /> {certificateUploadingFor === reg._id ? 'Uploading...' : 'Assign PDF'}
                                </label>
                              </div>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <button 
                              onClick={() => handleRemoveVolunteer(reg._id)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Remove"
                            >
                              <Trash2 size={15} />
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

        {/* TAB 2: EVENT MANAGERS (ORGANIZER ACCESS) */}
        {activeTab === 'managers' && (
          <motion.div key="managers" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-5">
                <div>
                  <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-nss-blue" />
                    Appointed Event Managers ({activity.eventManagers?.length || 0})
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Event Managers are granted organizer access to view registrations, mark volunteer attendance, and assign certificates from their volunteer portal.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowManagerModal(true)}
                  className="px-4 py-2.5 bg-nss-blue hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <Plus size={15} /> Appoint Event Manager
                </button>
              </div>

              {/* Current Managers Grid */}
              {(!activity.eventManagers || activity.eventManagers.length === 0) ? (
                <div className="text-center py-12 bg-gray-50/70 border border-dashed border-gray-200 rounded-2xl">
                  <Briefcase size={36} className="mx-auto text-gray-300 mb-2" />
                  <h4 className="font-bold text-gray-700 text-sm">No Event Managers Assigned</h4>
                  <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4">
                    Appoint coordinators or lead volunteers to give them organizer permissions for this activity.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowManagerModal(true)}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-800 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    + Add First Manager
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activity.eventManagers.map((manager: any) => {
                    const mId = (manager._id || manager).toString();
                    const name = manager.name || 'Volunteer Manager';
                    const regNo = manager.registrationNumber || '-';
                    const email = manager.email || '-';
                    const dept = manager.department || manager.batch || 'NSS Volunteer';

                    return (
                      <div key={mId} className="bg-slate-50/60 rounded-2xl border border-gray-200 p-4 flex flex-col justify-between hover:border-gray-300 transition-all">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 text-nss-blue font-black flex items-center justify-center text-sm shrink-0">
                            {name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm truncate">{name}</h4>
                            <p className="text-[11px] font-mono text-gray-500">{regNo}</p>
                            <p className="text-[11px] text-gray-400 truncate">{email}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200/60 text-xs">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            <CheckCircle size={11} /> Organizer Access
                          </span>

                          <button
                            type="button"
                            disabled={isUpdatingManagers}
                            onClick={() => handleRemoveManager(mId)}
                            className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs"
                          >
                            Revoke Access
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 3: REGISTRATION PORTAL & FORM BUILDER */}
        {activeTab === 'form_builder' && (
          <motion.div key="form_builder" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            
            {/* 1. Registration Status & Banner Settings Card */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-6 space-y-6">
              
              {/* Event Manager Form Lock / Permission Switch */}
              <div className={'p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ' + (
                isFormLockedForManagers 
                  ? 'bg-amber-50/70 border-amber-200' 
                  : 'bg-slate-50/70 border-gray-200'
              )}>
                <div className="flex items-start gap-3">
                  <div className={'p-2.5 rounded-xl shrink-0 mt-0.5 ' + (
                    isFormLockedForManagers ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-700'
                  )}>
                    {isFormLockedForManagers ? <Lock size={20} /> : <Unlock size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-gray-900">Event Manager Form Edit Access</h4>
                      <span className={'px-2 py-0.5 rounded-full text-[10px] font-bold ' + (
                        isFormLockedForManagers ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      )}>
                        {isFormLockedForManagers ? 'Locked (View-Only)' : 'Unlocked (Managers Can Edit)'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {isFormLockedForManagers
                        ? 'Event Managers can only view and preview the registration form in their portal. Form editing and schema saving are locked.'
                        : 'Event Managers are permitted to edit questions, upload banners, and save form schema in their portal.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isUpdatingLock}
                  onClick={handleToggleLockForManagers}
                  className={'px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0 disabled:opacity-50 ' + (
                    isFormLockedForManagers
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-white hover:bg-gray-50 border border-gray-300 text-gray-800'
                  )}
                >
                  {isFormLockedForManagers ? (
                    <>
                      <Unlock size={14} /> Unlock Form for Managers
                    </>
                  ) : (
                    <>
                      <Lock size={14} /> Lock Form (Manager View-Only)
                    </>
                  )}
                </button>
              </div>

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
                  onClick={handleToggleRegistration}
                  className={'px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ' + (
                    isRegistrationOpen 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  )}
                >
                  {isRegistrationOpen ? '✓ Registrations OPEN (Accepting Responses)' : '✕ Registrations CLOSED (Turn On)'}
                </button>
              </div>

              {/* Event Banner Management */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-black text-gray-900 flex items-center gap-2">
                      <ImageIcon size={16} className="text-nss-blue" /> Event Banner
                    </h4>
                    <p className="text-xs text-gray-500">
                      Upload a custom banner for the registration form or use the official default VIT Bhopal & NSS Unit banner. (Event card poster is set in Edit Details).
                    </p>
                  </div>

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
                </div>

                {/* Banner Live Preview Container (Proportional, no bad cropping!) */}
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
                  onChange={(e) => setConfirmationMessage(e.target.value)}
                  placeholder="Thank you for filling out the form! Our team will contact you shortly."
                  className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:border-nss-blue transition-all"
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
                    onClick={async () => {
                      setRegistrationMode('CUSTOM');
                      try {
                        await api.put(`/activities/${id}`, { registrationMode: 'CUSTOM' });
                        setActivity((prev: any) => prev ? { ...prev, registrationMode: 'CUSTOM' } : null);
                      } catch (e) {}
                    }}
                    className={'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ' + (
                      registrationMode === 'CUSTOM'
                        ? 'bg-white text-nss-blue shadow-xs font-black'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    🛠️ Built-in Form Builder
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setRegistrationMode('GOOGLE_FORM');
                      try {
                        await api.put(`/activities/${id}`, { registrationMode: 'GOOGLE_FORM' });
                        setActivity((prev: any) => prev ? { ...prev, registrationMode: 'GOOGLE_FORM' } : null);
                      } catch (e) {}
                    }}
                    className={'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ' + (
                      registrationMode === 'GOOGLE_FORM'
                        ? 'bg-white text-nss-blue shadow-xs font-black'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    🔗 Google Form Link
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
                      value={googleFormUrl}
                      onChange={(e) => setGoogleFormUrl(e.target.value)}
                      placeholder="https://forms.gle/... or https://docs.google.com/forms/d/e/.../viewform"
                      className="flex-1 p-3 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-nss-blue shadow-2xs"
                    />
                    <button
                      type="button"
                      disabled={isSavingGoogleForm || !googleFormUrl.trim()}
                      onClick={handleSaveGoogleFormUrl}
                      className="px-6 py-3 bg-nss-blue hover:bg-blue-900 text-white font-bold text-xs rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      {isSavingGoogleForm ? 'Saving...' : 'Save Google Form Link'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Embedded FormBuilder (Only if Built-in Form is active or as secondary) */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-6">
              <FormBuilder
                initialFields={activity.formSchema || []}
                onSave={handleSaveFormSchema}
                isSaving={isSavingFormSettings}
              />
            </div>
          </motion.div>
        )}

        {/* TAB 4: FORM RESPONSES */}
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

                  {/* One-Click Excel / CSV Download Button */}
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
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
                              onClick={() => handleRemoveVolunteer(reg._id)}
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

      {/* MODAL 1: Appoint Event Manager Modal */}
      {showManagerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/60">
              <div>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-nss-blue" /> Appoint Event Manager
                </h3>
                <p className="text-xs text-gray-500">Select a volunteer to grant organizer access for this event.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowManagerModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  placeholder="Search volunteer by name, reg number, or email..."
                  value={managerSearchQuery}
                  onChange={(e) => setManagerSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-nss-blue"
                />
              </div>
            </div>

            <div className="p-3 overflow-y-auto flex-1 space-y-1 max-h-80">
              {potentialManagers.length === 0 ? (
                <p className="text-center py-8 text-xs text-gray-400">
                  {managerSearchQuery ? 'No matching volunteers found.' : 'All available volunteers are already managers.'}
                </p>
              ) : potentialManagers.map(vol => (
                <div
                  key={vol._id}
                  className="p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 flex items-center justify-between transition-colors"
                >
                  <div>
                    <h5 className="font-bold text-gray-900 text-xs">{vol.name}</h5>
                    <p className="text-[11px] font-mono text-gray-500">{vol.registrationNumber} • {vol.department || vol.batch || 'Volunteer'}</p>
                  </div>
                  <button
                    type="button"
                    disabled={isUpdatingManagers}
                    onClick={() => handleAssignManager(vol._id)}
                    className="px-3 py-1.5 bg-nss-blue hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Appoint
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/60 flex justify-end">
              <button
                type="button"
                onClick={() => setShowManagerModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Single Add Volunteer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/60">
              <h3 className="text-base font-black text-gray-900">Add Volunteer to Activity</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-4 border-b border-gray-100">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  placeholder="Search name, reg number, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-nss-blue"
                />
              </div>

              {filteredUnregisteredVolunteers.length > 0 && (
                <label className="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded-lg text-xs font-bold text-gray-700">
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
                    className="w-3.5 h-3.5 text-nss-blue rounded"
                  />
                  <span>Select All Filtered ({filteredUnregisteredVolunteers.length})</span>
                </label>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-72">
              {filteredUnregisteredVolunteers.map(volunteer => (
                <label key={volunteer._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer text-xs">
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
                    className="w-3.5 h-3.5 text-nss-blue rounded"
                  />
                  <div>
                    <p className="font-bold text-gray-900">{volunteer.name}</p>
                    <p className="text-[11px] text-gray-500 font-mono">{volunteer.registrationNumber}</p>
                  </div>
                </label>
              ))}

              {filteredUnregisteredVolunteers.length === 0 && (
                <div className="p-8 text-center text-xs text-gray-400">
                  {searchQuery ? 'No volunteers match your search.' : 'All volunteers are already added.'}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/60 flex justify-end">
              <button
                disabled={isAddingVolunteer || selectedVolunteers.length === 0}
                onClick={handleAddSelectedVolunteers}
                className="px-5 py-2 bg-nss-blue text-white font-bold rounded-xl text-xs hover:bg-blue-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isAddingVolunteer ? 'Adding...' : ('Add Selected (' + selectedVolunteers.length + ')')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Bulk Add Volunteers */}
      {showBulkAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/60">
              <div>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <UserPlus className="text-indigo-600" size={18} /> Bulk Add Volunteers
                </h3>
                <p className="text-xs text-gray-500">Paste registration numbers or names from a sheet or CSV.</p>
              </div>
              <button onClick={() => setShowBulkAddModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="p-5 space-y-3 flex-1 overflow-y-auto">
              <textarea
                rows={5}
                value={bulkAddInput}
                onChange={(e) => setBulkAddInput(e.target.value)}
                placeholder={'Paste registration numbers, e.g.:\n24BCY10001\n24BCY10002'}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs focus:bg-white focus:outline-none focus:border-indigo-600 transition-all resize-y"
              ></textarea>

              {bulkAddInput.trim() && (
                <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 text-xs space-y-1">
                  <p className="font-bold text-indigo-700">{bulkMatched.length} Ready to Add</p>
                  {bulkAlreadyAdded.length > 0 && <p className="text-amber-600">{bulkAlreadyAdded.length} Already in Event</p>}
                  {bulkNotFound.length > 0 && <p className="text-rose-600">{bulkNotFound.length} Unrecognized: {bulkNotFound.slice(0, 4).join(', ')}</p>}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/60 flex justify-end gap-2">
              <button
                onClick={() => setShowBulkAddModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isBulkAdding || bulkMatched.length === 0}
                onClick={handleExecuteBulkAdd}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isBulkAdding ? 'Adding...' : ('Add ' + bulkMatched.length + ' Volunteers')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Bulk Mark Absent */}
      {showBulkAbsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/60">
              <div>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <UserX className="text-rose-600" size={18} /> Bulk Mark Absent
                </h3>
                <p className="text-xs text-gray-500">Paste absent list — their attendance will be set to Absent.</p>
              </div>
              <button onClick={() => setShowBulkAbsentModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="p-5 space-y-3 flex-1 overflow-y-auto">
              <textarea
                rows={5}
                value={bulkAbsentInput}
                onChange={(e) => setBulkAbsentInput(e.target.value)}
                placeholder={'Paste absent registration numbers, e.g.:\n24BCY10001\n24BCY10002'}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs focus:bg-white focus:outline-none focus:border-rose-600 transition-all resize-y"
              ></textarea>

              <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={markOthersPresent}
                  onChange={(e) => setMarkOthersPresent(e.target.checked)}
                  className="w-3.5 h-3.5 text-emerald-600 rounded"
                />
                <span>Mark all other registered volunteers as Present</span>
              </label>

              {bulkAbsentInput.trim() && (
                <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs space-y-1">
                  <p className="font-bold text-rose-700">{bulkAbsentMatches.length} will be marked ABSENT</p>
                  {markOthersPresent && <p className="text-emerald-700">{bulkOtherRegistrations.length} will be marked PRESENT</p>}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/60 flex justify-end gap-2">
              <button
                onClick={() => setShowBulkAbsentModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isBulkMarkingAbsent || bulkAbsentMatches.length === 0}
                onClick={handleExecuteBulkAbsent}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isBulkMarkingAbsent ? 'Applying...' : ('Apply (' + bulkAbsentMatches.length + ' Absent)')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
