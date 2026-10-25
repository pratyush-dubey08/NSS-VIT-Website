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
  AlertCircle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  RotateCw,
  FileCheck,
  MessageSquare
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

  // Expandable description briefs
  const [expandedEventIds, setExpandedEventIds] = useState<string[]>([]);

  // Attendance issue modal state
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedActivityForIssue, setSelectedActivityForIssue] = useState<string>('');
  const [issueType, setIssueType] = useState('MARKED_ABSENT_INSTEAD_OF_PRESENT');
  const [issueDescription, setIssueDescription] = useState('');
  const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);
  const [issueSuccessMessage, setIssueSuccessMessage] = useState('');
  
  // Volunteer's own raised issues
  const [myIssues, setMyIssues] = useState<any[]>([]);
  const [showMyIssuesDrawer, setShowMyIssuesDrawer] = useState(false);

  const toggleExpandEvent = (actId: string) => {
    setExpandedEventIds(prev => 
      prev.includes(actId) ? prev.filter(id => id !== actId) : [...prev, actId]
    );
  };

  const handleOpenRaiseIssueModal = (preselectedActId?: string) => {
    if (preselectedActId) {
      setSelectedActivityForIssue(preselectedActId);
    } else if (registeredActivities.length > 0) {
      const firstActId = registeredActivities[0]?.activityId?._id || registeredActivities[0]?.activityId;
      setSelectedActivityForIssue(firstActId || '');
    } else {
      setSelectedActivityForIssue('');
    }
    setIssueType('MARKED_ABSENT_INSTEAD_OF_PRESENT');
    setIssueDescription('');
    setIssueSuccessMessage('');
    setShowIssueModal(true);
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

      // Also fetch volunteer's previously raised attendance issues
      try {
        const issuesRes = await api.get('/attendance-issues/my');
        if (Array.isArray(issuesRes.data)) {
          setMyIssues(issuesRes.data);
        }
      } catch (issueErr) {
        console.warn('Could not load user attendance issues:', issueErr);
      }

    } catch (err: any) {
      console.error('Error fetching volunteer activities:', err);
      setError('Could not load your activities right now. The server might be waking up.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAttendanceIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivityForIssue || !issueDescription.trim()) {
      alert('Please select an activity and provide a description of the issue.');
      return;
    }
    setIsSubmittingIssue(true);
    try {
      const res = await api.post('/attendance-issues', {
        activityId: selectedActivityForIssue,
        issueType,
        description: issueDescription
      });
      setIssueSuccessMessage('Your attendance issue has been reported to the NSS Admin desk. It will be reviewed and verified.');
      setIssueDescription('');
      // Refresh my issues
      try {
        const issuesRes = await api.get('/attendance-issues/my');
        if (Array.isArray(issuesRes.data)) {
          setMyIssues(issuesRes.data);
        }
      } catch (e) {}
    } catch (err: any) {
      console.error('Error submitting issue:', err);
      alert(err.response?.data?.message || 'Failed to submit attendance issue');
    } finally {
      setIsSubmittingIssue(false);
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
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-sm cursor-pointer"
          >
            <RotateCw size={16} /> Retry
          </button>
        </div>
      ) : activeTab === 'MY_EVENTS' ? (
        /* Tab 1: My Enrolled Events */
        <div className="space-y-6">
          {/* Action & Filter Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    attendanceFilter === f.id
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    attendanceFilter === f.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Attendance Grievance Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
              {myIssues.length > 0 && (
                <button
                  onClick={() => setShowMyIssuesDrawer(!showMyIssuesDrawer)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-nss-blue hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-blue-200"
                >
                  <MessageSquare size={14} /> My Reported Issues ({myIssues.length})
                </button>
              )}

              <button
                onClick={() => handleOpenRaiseIssueModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs md:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <AlertCircle size={15} /> Raise Attendance Issue
              </button>
            </div>
          </div>

          {/* Volunteer's Reported Issues Accordion/Banner */}
          {showMyIssuesDrawer && myIssues.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-amber-600" /> Your Submitted Attendance Requests
                </h4>
                <button
                  onClick={() => setShowMyIssuesDrawer(false)}
                  className="text-xs text-amber-800 hover:text-amber-950 font-bold cursor-pointer"
                >
                  Close ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {myIssues.map((issue) => (
                  <div key={issue._id} className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-gray-900 truncate">
                        {issue.activityId?.title || 'Activity'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        issue.status === 'RESOLVED' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : issue.status === 'REJECTED' 
                          ? 'bg-rose-100 text-rose-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {issue.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{issue.description}</p>
                    {issue.adminRemarks && (
                      <p className="text-[10px] text-emerald-700 bg-emerald-50 p-1.5 rounded-lg font-medium">
                        Admin Note: {issue.adminRemarks}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

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
                  className="px-5 py-2 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 text-xs transition-colors cursor-pointer"
                >
                  View All Activities
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRegistrations.map((reg) => {
                const act = reg.activityId || {};
                const actId = act._id || reg._id;
                const hours = act.hoursAllocated || act.workingHours || 0;
                const isPresent = reg.attendanceStatus === 'ATTENDED' || reg.attendanceStatus === 'Present';
                const isAbsent = reg.attendanceStatus === 'BUNKED' || reg.attendanceStatus === 'Absent';
                const isPending = !reg.attendanceStatus || reg.attendanceStatus === 'PENDING';
                const isExpanded = expandedEventIds.includes(actId);

                return (
                  <motion.div
                    key={reg._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                  >
                    {/* Banner */}
                    {act.bannerUrl && (
                      <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                        <img 
                          src={act.bannerUrl} 
                          alt={act.title || 'Event'} 
                          className="w-full h-full object-cover"
                          onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
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
                      {/* Top info badge row */}
                      <div className="flex justify-between items-center gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          {!act.bannerUrl && (
                            isPresent ? (
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-full flex items-center gap-1">
                                <CheckCircle2 size={13} /> Present
                              </span>
                            ) : isAbsent ? (
                              <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-black rounded-full flex items-center gap-1">
                                <XCircle size={13} /> Absent
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-black rounded-full flex items-center gap-1">
                                Pending
                              </span>
                            )
                          )}
                          
                          {isPresent && hours > 0 && (
                            <span className="px-2 py-0.5 bg-blue-50 text-nss-blue text-xs font-black rounded-lg">
                              +{hours} Hrs
                            </span>
                          )}
                        </div>

                        {/* Quick Issue Button directly on card */}
                        <button
                          onClick={() => handleOpenRaiseIssueModal(act._id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors cursor-pointer"
                          title="Report attendance issue for this activity"
                        >
                          <HelpCircle size={12} className="text-amber-600" /> Issue?
                        </button>
                      </div>

                      <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-1">{act.title || 'NSS Activity'}</h3>
                      
                      {/* EXPANDABLE FULL EVENT BRIEF ON CLICK */}
                      <div 
                        onClick={() => toggleExpandEvent(actId)}
                        className="cursor-pointer group/brief mb-4 rounded-xl p-2 -mx-2 hover:bg-slate-50 transition-colors"
                        title="Click to read full event brief"
                      >
                        <p className={`text-gray-600 text-xs md:text-sm leading-relaxed transition-all ${
                          isExpanded ? 'whitespace-pre-line' : 'line-clamp-2'
                        }`}>
                          {act.description || 'NSS community engagement initiative.'}
                        </p>
                        {act.description && act.description.length > 70 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-nss-blue group-hover/brief:underline mt-1.5 select-none">
                            {isExpanded ? (
                              <>Show less <ChevronUp size={12} /></>
                            ) : (
                              <>Read full event brief <ChevronDown size={12} /></>
                            )}
                          </span>
                        )}
                      </div>

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
        <div className="space-y-6">
          {managingActivities.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-blue-50 text-nss-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Managed Events</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                You haven&apos;t been assigned as an Event Manager for any NSS activities yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {managingActivities.map((act) => {
                const actId = act._id;
                const isExpanded = expandedEventIds.includes(actId);

                return (
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
                      
                      {/* Expandable brief */}
                      <div 
                        onClick={() => toggleExpandEvent(actId)}
                        className="cursor-pointer group/brief mb-4 rounded-xl p-2 -mx-2 hover:bg-slate-50 transition-colors"
                        title="Click to read full event brief"
                      >
                        <p className={`text-gray-600 text-xs md:text-sm leading-relaxed transition-all ${
                          isExpanded ? 'whitespace-pre-line' : 'line-clamp-2'
                        }`}>
                          {act.description || 'Manage volunteers, edit details, and mark event attendance.'}
                        </p>
                        {act.description && act.description.length > 70 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-nss-blue group-hover/brief:underline mt-1.5 select-none">
                            {isExpanded ? (
                              <>Show less <ChevronUp size={12} /></>
                            ) : (
                              <>Read full event brief <ChevronDown size={12} /></>
                            )}
                          </span>
                        )}
                      </div>

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
                );
              })}
            </div>
          )}
        </div>
      )}
    
      {/* MODAL: Raise Attendance Issue with 2024 Batch Notice */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
              <div>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <AlertCircle className="text-amber-600" size={18} /> Report Attendance Issue
                </h3>
                <p className="text-xs text-gray-500">Submit an inquiry if your attendance was marked absent or left pending.</p>
              </div>
              <button 
                onClick={() => setShowIssueModal(false)} 
                className="text-gray-400 hover:text-gray-600 font-bold text-sm cursor-pointer p-1 rounded-lg hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Special 2024 Batch Disclaimer */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-2 shadow-2xs">
                <div className="flex items-center gap-1.5 text-amber-950 font-black text-xs md:text-sm">
                  <AlertCircle size={16} className="text-amber-600 shrink-0" />
                  <span>Important Notice Regarding 2024 Batch Attendance</span>
                </div>
                <p className="text-amber-900 leading-relaxed font-medium text-xs text-justify">
                  Agar aap 2024 batch ke volunteer hain aur orientation ke baad ke kuch events me aapka status &apos;Absent&apos; marked hai, toh yeh isiliye hai kyunki aapne NSS Unit late join kiya tha. 2024 batch me sabhi volunteers ki attendance Orientation Program se hi count hogi. Late join karne ke kaaran orientation ke baad ke initial events me aapka status absent show hoga.
                </p>
              </div>

              {issueSuccessMessage ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={22} />
                  </div>
                  <h4 className="text-sm font-black text-emerald-900">Request Submitted Successfully</h4>
                  <p className="text-xs text-emerald-700">{issueSuccessMessage}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowIssueModal(false);
                      setShowMyIssuesDrawer(true);
                    }}
                    className="mt-2 px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                  >
                    View My Requests
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
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-nss-blue cursor-pointer"
                    >
                      <option value="">-- Choose an enrolled event --</option>
                      {registeredActivities.map((reg) => {
                        const act = reg.activityId || {};
                        const status = reg.attendanceStatus === 'ATTENDED' ? 'Present' : reg.attendanceStatus === 'BUNKED' ? 'Absent' : 'Pending';
                        return (
                          <option key={reg._id} value={act._id}>
                            {act.title || 'Event'} (Status: {status})
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
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-nss-blue cursor-pointer"
                    >
                      <option value="MARKED_ABSENT_INSTEAD_OF_PRESENT">I was present but marked absent</option>
                      <option value="ATTENDANCE_NOT_MARKED">Attendance not marked / showing pending</option>
                      <option value="INCORRECT_HOURS">Incorrect NSS hours credited</option>
                      <option value="OTHER">Other discrepancy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Explain the Discrepancy</label>
                    <textarea
                      rows={4}
                      required
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      placeholder="Please specify your assigned duty, event manager name, or proof that you attended this activity..."
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
                      className="px-5 py-2 bg-gradient-to-r from-nss-blue to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
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
