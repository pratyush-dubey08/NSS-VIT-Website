'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, Clock, Save, Edit, Trash2, Users, FileText, Upload, Download, Plus, Search } from 'lucide-react';
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
  
  const [activeTab, setActiveTab] = useState<'volunteers' | 'registration'>('volunteers');
  const [isSavingForm, setIsSavingForm] = useState(false);
  
  const [certificateUploadingFor, setCertificateUploadingFor] = useState<string | null>(null);

  const [attendanceUpdates, setAttendanceUpdates] = useState<Record<string, string>>({});
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);

  // Add Volunteer Manually States
  const [showAddModal, setShowAddModal] = useState(false);
  const [allVolunteers, setAllVolunteers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingVolunteer, setIsAddingVolunteer] = useState(false);
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);

  const fetchVolunteers = async () => {
    try {
      const { data } = await api.get('/users');
      // Filter for volunteers if needed, assuming /users returns everyone or we can filter by role
      const volunteers = data.filter((u: any) => u.role === 'VOLUNTEER');
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
      // Create an array of updates
      const updates = Object.keys(attendanceUpdates).map(regId => ({
        registrationId: regId,
        attendanceStatus: attendanceUpdates[regId]
      }));
      
      const { data } = await api.put('/forms/registrations/attendance/batch', { updates });
      
      // Update local state with the returned data or just merge updates
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

  const updateRegistrationStatus = async (regId: string, status: string) => {
    try {
      const { data } = await api.put(`/forms/registrations/${regId}/status`, { status });
      setRegistrations(registrations.map(r => r._id === regId ? data : r));
    } catch (error) {
      console.error('Error updating registration status:', error);
      alert('Failed to update status');
    }
  };

  const handleSaveFormSchema = async (schema: IFormField[]) => {
    setIsSavingForm(true);
    try {
      await api.put(`/activities/${id}`, {
        ...activity,
        formSchema: schema
      });
      setActivity({ ...activity, formSchema: schema });
      alert('Form Schema updated successfully!');
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Failed to save form schema');
    } finally {
      setIsSavingForm(false);
    }
  };

  const handleUploadCertificate = async (userId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCertificateUploadingFor(userId);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload file
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const certificateUrl = uploadRes.data.url;

      // 2. Assign to user
      await api.put(`/users/${userId}`, {
        newCertificate: certificateUrl
      });
      alert('Certificate uploaded and assigned successfully!');
    } catch (error) {
      console.error('Error uploading certificate:', error);
      alert('Failed to upload certificate');
    } finally {
      setCertificateUploadingFor(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activityRes, regRes] = await Promise.all([
          api.get(`/activities/${id}`),
          api.get(`/forms/registrations/${id}`)
        ]);
        setActivity(activityRes.data);
        setRegistrations(regRes.data);
      } catch (error) {
        console.error('Error fetching activity details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-center font-bold text-gray-500">Loading details...</div>;
  if (!activity) return <div className="p-8 text-center font-bold text-red-500">Activity not found.</div>;

  const filteredUnregisteredVolunteers = allVolunteers
    .filter(v => 
      v.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(v => !registrations.some(r => r.userId?._id === v._id));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/activities" className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{activity.title}</h1>
          <p className="text-sm text-gray-500">Manage registrations and attendance</p>
        </div>
      </div>

      {/* Activity Details Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Date</p>
              <p className="font-medium text-gray-900">{new Date(activity.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Venue</p>
              <p className="font-medium text-gray-900">{activity.venue}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Hours</p>
              <p className="font-medium text-gray-900">{activity.hoursAllocated}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Registrations Open</p>
              <p className="font-medium text-gray-900">{activity.isRegistrationOpen ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/activities/${id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
            <Edit size={16} /> Edit Details
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('volunteers')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'volunteers' ? 'border-nss-blue text-nss-blue' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={18} /> Volunteers & Attendance
        </button>
        <button
          onClick={() => setActiveTab('registration')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
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
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-lg font-bold text-gray-900">Registered Volunteers ({registrations.length})</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      fetchVolunteers();
                      setShowAddModal(true);
                      setSelectedVolunteers([]);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-nss-blue/10 text-nss-blue font-bold rounded-xl hover:bg-nss-blue/20 transition-colors"
                  >
                    <Plus size={18} /> Add Volunteer
                  </button>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="bulk-cert-upload"
                      accept=".zip"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        try {
                          const formData = new FormData();
                          formData.append('zipFile', file);
                          alert('Uploading and processing zip file... This might take a few moments.');
                          
                          const res = await api.post('/upload/bulk-certificates', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                          });
                          
                          alert(`Bulk upload complete!\nSuccess: ${res.data.successCount}\nNot Found: ${res.data.notFoundCount}`);
                        } catch (error) {
                          console.error('Bulk upload failed', error);
                          alert('Failed to process bulk upload.');
                        }
                        e.target.value = '';
                      }}
                    />
                    <label 
                      htmlFor="bulk-cert-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-nss-blue font-bold rounded-xl cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                      <Upload size={18} /> Bulk Upload Certs (.zip)
                    </label>
                  </div>
                  <button 
                    onClick={handleBatchAttendanceSave}
                    disabled={isSavingAttendance || Object.keys(attendanceUpdates).length === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save size={18} /> {isSavingAttendance ? 'Saving...' : 'Save Attendance'}
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-500">
                      <th className="p-4">Volunteer</th>
                      <th className="p-4">Registration No.</th>
                      <th className="p-4">Attendance</th>
                      <th className="p-4">Certificate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-500">No volunteers registered yet.</td>
                      </tr>
                    ) : registrations.map((reg) => {
                      const currentStatus = attendanceUpdates[reg._id] || reg.attendanceStatus;
                      return (
                        <tr key={reg._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 font-medium text-gray-900">{reg.userId?.name || 'Unknown'}</td>
                          <td className="p-4 text-gray-600">{reg.userId?.registrationNumber || '-'}</td>
                          
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name={`attendance-${reg._id}`}
                                  value="ATTENDED"
                                  checked={currentStatus === 'ATTENDED'}
                                  onChange={() => handleAttendanceChange(reg._id, 'ATTENDED')}
                                  className="w-4 h-4 text-green-600 focus:ring-green-600"
                                />
                                <span className="text-sm font-medium text-gray-700">Present</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name={`attendance-${reg._id}`}
                                  value="BUNKED"
                                  checked={currentStatus === 'BUNKED'}
                                  onChange={() => handleAttendanceChange(reg._id, 'BUNKED')}
                                  className="w-4 h-4 text-red-600 focus:ring-red-600"
                                />
                                <span className="text-sm font-medium text-gray-700">Absent</span>
                              </label>
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <input 
                                  type="file" 
                                  id={`cert-${reg.userId?._id}`}
                                  accept=".pdf,image/*"
                                  className="hidden"
                                  onChange={(e) => handleUploadCertificate(reg.userId?._id, e)}
                                />
                                <label 
                                  htmlFor={`cert-${reg.userId?._id}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                                >
                                  {certificateUploadingFor === reg.userId?._id ? (
                                    'Uploading...'
                                  ) : (
                                    <>
                                      <Upload size={14} /> Assign PDF
                                    </>
                                  )}
                                </label>
                              </div>
                              <button 
                                onClick={() => handleRemoveVolunteer(reg._id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                                title="Remove volunteer from activity"
                              >
                                <Trash2 size={16} />
                              </button>
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
        ) : (
          <motion.div key="registration" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            
            {/* Form Responses Viewer */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
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

      {/* Add Volunteer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">Add Volunteer to Activity</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
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
              
              {/* Select All Checkbox */}
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
                    <p className="text-sm text-gray-500">{volunteer.registrationNumber} • {volunteer.email}</p>
                  </div>
                </label>
              ))}
              
              {allVolunteers.length > 0 && filteredUnregisteredVolunteers.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  {searchQuery ? 'No volunteers match your search.' : 'All available volunteers are already added.'}
                </div>
              )}
              {allVolunteers.length === 0 && (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-nss-blue border-t-transparent rounded-full animate-spin"></div>
                  Loading volunteers...
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button
                disabled={isAddingVolunteer || selectedVolunteers.length === 0}
                onClick={handleAddSelectedVolunteers}
                className="px-6 py-2 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50"
              >
                {isAddingVolunteer ? 'Adding...' : `Add Selected (${selectedVolunteers.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
