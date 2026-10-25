'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Award, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, HelpCircle, ChevronDown, ChevronUp, Send, 
  RotateCw,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';

type TabType = 'MY_EVENTS' | 'MANAGING';
type AttendanceFilterType = 'ALL' | 'ATTENDED' | 'PENDING' | 'BUNKED';

export default function VolunteerActivitiesPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('MY_EVENTS');
  const [attendanceFilter, setAttendanceFilter] = useState<AttendanceFilterType>('ALL');
  
  const [registeredActivities, setRegisteredActivities] = useState<any[]>([]);
  const [managingActivities, setManagingActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedEventIds, setExpandedEventIds] = useState<string[]>([]);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedActivityForIssue, setSelectedActivityForIssue] = useState<string>('');
  const [issueType, setIssueType] = useState('MARKED_ABSENT_INSTEAD_OF_PRESENT');
  const [issueDescription, setIssueDescription] = useState('');
  const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);
  const [issueSuccessMessage, setIssueSuccessMessage] = useState('');
  const [myIssues, setMyIssues] = useState<any[]>([]);

  const toggleExpandEvent = (actId: string) => {
    setExpandedEventIds(prev => 
      prev.includes(actId) ? prev.filter(id => id !== actId) : [...prev, actId]
    );
  };

  const handleOpenRaiseIssueModal = (preselectedActId?: string) => {
    setSelectedActivityForIssue(preselectedActId || (registeredActivities[0]?.activityId?._id || registeredActivities[0]?.activityId || ''));
    setIssueType('MARKED_ABSENT_INSTEAD_OF_PRESENT');
    setIssueDescription('');
    setIssueSuccessMessage('');
    setShowIssueModal(true);
  };

  const handleSubmitAttendanceIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivityForIssue || !issueDescription.trim()) {
      alert('Please select an activity and provide a description.');
      return;
    }
    setIsSubmittingIssue(true);
    try {
      await api.post('/attendance-issues', {
        activityId: selectedActivityForIssue,
        issueType,
        description: issueDescription
      });
      setIssueSuccessMessage('Your attendance issue has been reported to the NSS Admin desk. It will be reviewed and verified.');
      setIssueDescription('');
    } catch (err: any) {
      console.error('Error submitting issue:', err);
      alert(err.response?.data?.message || 'Failed to submit attendance issue');
    } finally {
      setIsSubmittingIssue(false);
    }
  };


  const fetchActivities = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);

      const [regRes, actRes] = await Promise.all([
        api.get('/forms/my-registrations'),
        api.get('/activities')
      ]);

      // All valid registrations
      const myRegs = (regRes.data || []).filter((r: any) => r.activityId != null);
      setRegisteredActivities(myRegs);

      // Filter activities managed by this user
      const currentUserId = (user._id || user.id || '').toString();
      const allActs = Array.isArray(actRes.data) ? actRes.data : (actRes.data?.activities || []);
      const managing = allActs.filter((act: any) => 
        act.eventManagers && act.eventManagers.some((m: any) => {
          const mId = (m._id || m.id || m)?.toString();
          return mId === currentUserId;
        })
      );
      setManagingActivities(managing);

      // If user came to page and has managing activities, keep MY_EVENTS as default
    } catch (err: any) {
      console.error('Error fetching volunteer activities:', err);
      setError('Could not load your activities right now. The server might be waking up.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="w-12 h-12 border-3 border-nss-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Authenticating your profile...</p>
      </div>
    );
  }

  // Filtered registrations based on attendance pill
  const filteredRegistrations = registeredActivities.filter((reg: any) => {
    const status = reg.attendanceStatus;
    if (attendanceFilter === 'ALL') return true;
    if (attendanceFilter === 'ATTENDED') return status === 'ATTENDED' || status === 'Present';
    if (attendanceFilter === 'BUNKED') return status === 'BUNKED' || status === 'Absent';
    if (attendanceFilter === 'PENDING') return !status || status === 'PENDING';
    return true;
  });

  const presentCount = registeredActivities.filter(r => r.attendanceStatus === 'ATTENDED' || r.attendanceStatus === 'Present').length;
  const pendingCount = registeredActivities.filter(r => !r.attendanceStatus || r.attendanceStatus === 'PENDING').length;
  const absentCount = registeredActivities.filter(r => r.attendanceStatus === 'BUNKED' || r.attendanceStatus === 'Absent').length;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Activities</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Track all activities you have enrolled in and events assigned to you for management.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/60 shadow-inner">
          <button
            onClick={() => setActiveTab('MY_EVENTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'MY_EVENTS'
                ? 'bg-white text-nss-blue shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar size={16} />
            My Enrolled Events
            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
              activeTab === 'MY_EVENTS' ? 'bg-blue-50 text-nss-blue' : 'bg-gray-200 text-gray-600'
            }`}>
              {registeredActivities.length}
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

      {/* Loading & Error States */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <div className="w-10 h-10 border-3 border-nss-blue border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="font-bold text-sm text-gray-700">Loading your activities...</p>
          <p className="text-xs text-gray-400 mt-1">Connecting to server, please hold on</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 shadow-sm p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to load activities</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            {error}
          </p>
          <button 
            onClick={fetchActivities}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-sm"
          >
            <RotateCw size={16} /> Retry
          </button>
        </div>
      ) : activeTab === 'MY_EVENTS' ? (
        /* Tab 1: My Enrolled Events */
        <div className="space-y-6">
          {/* Sub-filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'All Activities', count: registeredActivities.length },
              { id: 'ATTENDED', label: 'Present / Attended', count: presentCount },
              { id: 'PENDING', label: 'Pending Attendance', count: pendingCount },
              { id: 'BUNKED', label: 'Absent', count: absentCount }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setAttendanceFilter(f.id as AttendanceFilterType)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  attendanceFilter === f.id
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{f.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  attendanceFilter === f.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-blue-50 text-nss-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Activities Found</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {attendanceFilter === 'ALL'
                  ? 'You have not enrolled in any activities yet. Register for upcoming events from the public Activities page.'
                  : `No activities found under the ${attendanceFilter.toLowerCase()} filter.`}
              </p>
              {attendanceFilter !== 'ALL' && (
                <button
                  onClick={() => setAttendanceFilter('ALL')}
                  className="px-5 py-2 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 text-xs transition-colors"
                >
                  View All Activities
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRegistrations.map((reg) => {
                const act = reg.activityId || {};
                const hours = act.hoursAllocated || act.workingHours || 0;
                const isPresent = reg.attendanceStatus === 'ATTENDED' || reg.attendanceStatus === 'Present';
                const isAbsent = reg.attendanceStatus === 'BUNKED' || reg.attendanceStatus === 'Absent';
                const isPending = !reg.attendanceStatus || reg.attendanceStatus === 'PENDING';

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
                          {isPresent ? (
                            <span className="px-3 py-1 bg-emerald-600/90 backdrop-blur-md text-white text-xs font-black rounded-full shadow-sm flex items-center gap-1">
                              <CheckCircle2 size={13} /> Present
                            </span>
                          ) : isAbsent ? (
                            <span className="px-3 py-1 bg-rose-600/90 backdrop-blur-md text-white text-xs font-black rounded-full shadow-sm flex items-center gap-1">
                              <XCircle size={13} /> Absent
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white text-xs font-black rounded-full shadow-sm flex items-center gap-1">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      {!act.bannerUrl && (
                        <div className="flex justify-between items-center mb-3">
                          {isPresent ? (
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-full flex items-center gap-1">
                              <CheckCircle2 size={13} /> Present
                            </span>
                          ) : isAbsent ? (
                            <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-black rounded-full flex items-center gap-1">
                              <XCircle size={13} /> Absent
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-black rounded-full flex items-center gap-1">
                              Enrolled (Pending Attendance)
                            </span>
                          )}

                          {isPresent && hours > 0 && (
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
                        {isPresent && hours > 0 && (
                          <div className="flex items-center gap-2 text-emerald-600 font-bold">
                            <Clock size={14} className="shrink-0" />
                            <span>+{hours} Hours Credited</span>
                          </div>
                        )}
                        {isPending && (
                          <div className="flex items-center gap-2 text-blue-600 font-medium">
                            <Clock size={14} className="shrink-0" />
                            <span>Attendance will be marked by Event Manager / Admin</span>
                          </div>
                        )}
                        {isAbsent && (
                          <div className="flex items-center gap-2 text-rose-600 font-medium">
                            <XCircle size={14} className="shrink-0" />
                            <span>Marked Absent (0 Hours Credited)</span>
                          </div>
                        )}
                      </div>

                      {/* Certificate Download Button if present */}
                      {reg.certificateUrl && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <a
                            href={reg.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
                          >
                            <FileCheck size={14} /> Download Certificate
                          </a>
                        </div>
                      )}
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
    
      {/* MODAL: Raise Attendance Issue with 2024 Batch Notice */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/60">
              <div>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <AlertCircle className="text-amber-600" size={18} /> Report Attendance Issue
                </h3>
                <p className="text-xs text-gray-500">Submit an inquiry if your attendance was marked absent or left pending.</p>
              </div>
              <button onClick={() => setShowIssueModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-sm cursor-pointer p-1">✕</button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Special 2024 Batch Disclaimer */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-amber-950 font-black text-xs">
                  <AlertCircle size={15} className="text-amber-600 shrink-0" />
                  <span>Important Notice Regarding 2024 Batch Attendance</span>
                </div>
                <p className="text-amber-800 leading-relaxed font-medium text-[11px] sm:text-xs text-justify">
                  Agar aap 2024 batch ke volunteer hain aur orientation ke baad ke kuch events me aapka status &apos;Absent&apos; marked hai, toh yeh isiliye hai kyunki aapne NSS Unit late join kiya tha. 2024 batch me sabhi volunteers ki attendance Orientation Program se hi calculate ho rahi hai. Late join karne ke kaaran orientation ke baad ke initial events me aapka status absent show hoga.
                </p>
              </div>

              {issueSuccessMessage ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={22} />
                  </div>
                  <h4 className="text-sm font-black text-emerald-900">Request Submitted</h4>
                  <p className="text-xs text-emerald-700">{issueSuccessMessage}</p>
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    className="mt-2 px-4 py-1.5 bg-white border border-emerald-300 text-emerald-800 font-bold text-xs rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitAttendanceIssue} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Select Event / Activity</label>
                    <select
                      value={selectedActivityForIssue}
                      onChange={(e) => setSelectedActivityForIssue(e.target.value)}
                      required
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-nss-blue"
                    >
                      <option value="">-- Choose an enrolled event --</option>
                      {registeredActivities.map((reg) => {
                        const act = reg.activityId || {};
                        return (
                          <option key={reg._id} value={act._id}>
                            {act.title || 'Event'} ({reg.attendanceStatus || 'Pending'})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Issue Type</label>
                    <select
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-nss-blue"
                    >
                      <option value="MARKED_ABSENT_INSTEAD_OF_PRESENT">Marked Absent instead of Present</option>
                      <option value="ATTENDANCE_NOT_MARKED">Attendance Not Marked / Showing Pending</option>
                      <option value="INCORRECT_HOURS">Incorrect NSS Hours Credited</option>
                      <option value="OTHER">Other Discrepancy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Explain the Discrepancy</label>
                    <textarea
                      rows={4}
                      required
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      placeholder="Please specify your assigned duty, event manager name, or proof that you attended..."
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-nss-blue transition-all"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowIssueModal(false)}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingIssue}
                      className="px-5 py-2 bg-nss-blue hover:bg-blue-900 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <Send size={13} /> {isSubmittingIssue ? 'Submitting...' : 'Submit Issue'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
