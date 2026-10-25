'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare, Mail, Search, Trash2, CheckCircle2, Clock, 
  ExternalLink, RefreshCw, Filter, AlertCircle, Check, ArrowUpRight,
  CheckCircle, HelpCircle, User
} from 'lucide-react';
import api from '@/lib/axios';

export default function AdminMessagesPage() {
  const [activeMainTab, setActiveMainTab] = useState<'CONTACT' | 'ISSUES'>('CONTACT');
  
  // Contact Messages State
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNREAD' | 'READ' | 'RESOLVED'>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Attendance Issues State
  const [attendanceIssues, setAttendanceIssues] = useState<any[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [issueUpdatingId, setIssueUpdatingId] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/contact');
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceIssues = async () => {
    try {
      setLoadingIssues(true);
      const { data } = await api.get('/attendance-issues');
      setAttendanceIssues(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching attendance issues:', err);
    } finally {
      setLoadingIssues(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchAttendanceIssues();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'UNREAD' | 'READ' | 'RESOLVED') => {
    setUpdatingId(id);
    try {
      await api.put(`/contact/${id}`, { status: newStatus });
      setMessages(messages.map(m => m._id === id ? { ...m, status: newStatus } : m));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages(messages.filter(m => m._id !== id));
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Failed to delete message');
    }
  };

  const handleResolveIssue = async (issueId: string, autoMarkPresent: boolean = true) => {
    const remarks = prompt('Enter resolution remarks (optional):', 'Verified with event records and marked present.');
    if (remarks === null) return;
    setIssueUpdatingId(issueId);
    try {
      await api.put(`/attendance-issues/${issueId}`, {
        status: 'RESOLVED',
        adminRemarks: remarks,
        autoMarkPresent
      });
      setAttendanceIssues(prev => prev.map(item => item._id === issueId ? { ...item, status: 'RESOLVED', adminRemarks: remarks } : item));
      alert('Issue resolved and volunteer attendance marked present!');
    } catch (err) {
      console.error('Error resolving issue:', err);
      alert('Failed to resolve issue');
    } finally {
      setIssueUpdatingId(null);
    }
  };

  const handleRejectIssue = async (issueId: string) => {
    const remarks = prompt('Enter rejection reason for volunteer:', 'Records do not verify attendance for this event.');
    if (remarks === null) return;
    setIssueUpdatingId(issueId);
    try {
      await api.put(`/attendance-issues/${issueId}`, {
        status: 'REJECTED',
        adminRemarks: remarks
      });
      setAttendanceIssues(prev => prev.map(item => item._id === issueId ? { ...item, status: 'REJECTED', adminRemarks: remarks } : item));
      alert('Issue status set to Rejected.');
    } catch (err) {
      console.error('Error rejecting issue:', err);
      alert('Failed to reject issue');
    } finally {
      setIssueUpdatingId(null);
    }
  };

  const handleDeleteIssue = async (issueId: string) => {
    if (!confirm('Permanently delete this issue ticket?')) return;
    try {
      await api.delete(`/attendance-issues/${issueId}`);
      setAttendanceIssues(prev => prev.filter(i => i._id !== issueId));
    } catch (err) {
      console.error('Error deleting issue:', err);
      alert('Failed to delete issue');
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesFilter = statusFilter === 'ALL' || m.status === statusFilter;
    const matchesSearch = 
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter(m => m.status === 'UNREAD').length;
  const pendingIssuesCount = attendanceIssues.filter(i => i.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Messages & Volunteer Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage public website contact queries and volunteer attendance grievance requests.
          </p>
        </div>

        <button
          onClick={() => { fetchMessages(); fetchAttendanceIssues(); }}
          className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start cursor-pointer shadow-2xs"
        >
          <RefreshCw size={13} className={loading || loadingIssues ? 'animate-spin' : ''} /> Refresh All
        </button>
      </div>

      {/* Top Switcher: Contact Messages vs Attendance Grievances */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveMainTab('CONTACT')}
          className={'px-5 py-3 font-black text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 cursor-pointer ' + (
            activeMainTab === 'CONTACT' ? 'border-nss-blue text-nss-blue' : 'border-transparent text-gray-500 hover:text-gray-900'
          )}
        >
          <Mail size={16} /> Public Contact Inquiries ({messages.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('ISSUES')}
          className={'px-5 py-3 font-black text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 cursor-pointer ' + (
            activeMainTab === 'ISSUES' ? 'border-nss-blue text-nss-blue' : 'border-transparent text-gray-500 hover:text-gray-900'
          )}
        >
          <AlertCircle size={16} className="text-amber-600" />
          <span>Volunteer Attendance Issues</span>
          {pendingIssuesCount > 0 && (
            <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-black">
              {pendingIssuesCount} Pending
            </span>
          )}
        </button>
      </div>

      {/* SECTION 1: PUBLIC CONTACT MESSAGES */}
      {activeMainTab === 'CONTACT' ? (
        <div className="space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Received</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{messages.length}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs bg-amber-50/20">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending / Unread</p>
              <p className="text-2xl font-black text-amber-900 mt-1">{unreadCount}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-2xs bg-emerald-50/20">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Resolved</p>
              <p className="text-2xl font-black text-emerald-900 mt-1">
                {messages.filter(m => m.status === 'RESOLVED').length}
              </p>
            </div>
          </div>

          {/* Toolbar: Search & Filter Tabs */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search by name, email, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-nss-blue outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              {(['ALL', 'UNREAD', 'READ', 'RESOLVED'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={'px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ' + (
                    statusFilter === tab
                      ? 'bg-nss-blue text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {tab === 'ALL' ? 'All Messages' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Messages List */}
          {loading ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 text-gray-400 text-xs">
              Loading messages...
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-6 text-gray-500 space-y-2">
              <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <Mail size={22} />
              </div>
              <h3 className="font-bold text-gray-800 text-sm">No Messages Found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                {messages.length === 0 
                  ? 'When students submit the form on the Contact page, their queries will appear here.'
                  : 'No messages match your current filter criteria.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((msg) => (
                <div
                  key={msg._id}
                  className={'bg-white p-6 rounded-2xl border transition-all space-y-4 shadow-2xs ' + (
                    msg.status === 'UNREAD' 
                      ? 'border-amber-300 bg-amber-50/10' 
                      : msg.status === 'RESOLVED'
                        ? 'border-emerald-200'
                        : 'border-gray-200'
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-gray-900 text-base">{msg.subject}</h3>
                        <span className={'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ' + (
                          msg.status === 'UNREAD'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : msg.status === 'RESOLVED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                        )}>
                          {msg.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                        <span className="font-bold text-gray-800">{msg.name}</span>
                        <span>•</span>
                        <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`} className="text-nss-blue hover:underline flex items-center gap-1 font-medium">
                          <Mail size={12} /> {msg.email}
                        </a>
                        <span>•</span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Clock size={11} /> {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="px-3.5 py-1.5 bg-nss-blue hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        Reply <ArrowUpRight size={13} />
                      </a>

                      {msg.status !== 'RESOLVED' ? (
                        <button
                          type="button"
                          disabled={updatingId === msg._id}
                          onClick={() => handleUpdateStatus(msg._id, 'RESOLVED')}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Check size={13} /> Mark Resolved
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={updatingId === msg._id}
                          onClick={() => handleUpdateStatus(msg._id, 'READ')}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Reopen
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(msg._id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Message"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/60 rounded-xl text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-normal">
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* SECTION 2: VOLUNTEER ATTENDANCE ISSUES */
        <div className="space-y-6">
          {/* Issues Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Issues Reported</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{attendanceIssues.length}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs bg-amber-50/20">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Review</p>
              <p className="text-2xl font-black text-amber-900 mt-1">{pendingIssuesCount}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-2xs bg-emerald-50/20">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Resolved</p>
              <p className="text-2xl font-black text-emerald-900 mt-1">
                {attendanceIssues.filter(i => i.status === 'RESOLVED').length}
              </p>
            </div>
          </div>

          {/* Attendance Issues List */}
          {loadingIssues ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 text-gray-400 text-xs">
              Loading attendance issues...
            </div>
          ) : attendanceIssues.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-6 text-gray-500 space-y-2">
              <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={22} />
              </div>
              <h3 className="font-bold text-gray-800 text-sm">No Attendance Issues Reported</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                When volunteers report attendance discrepancies from their My Activities portal, they will appear here for verification.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {attendanceIssues.map((issue) => (
                <div
                  key={issue._id}
                  className={'bg-white p-6 rounded-2xl border transition-all space-y-4 shadow-2xs ' + (
                    issue.status === 'PENDING' ? 'border-amber-300 bg-amber-50/10' : issue.status === 'RESOLVED' ? 'border-emerald-200' : 'border-gray-200'
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-gray-900 text-base">{issue.activityId?.title || 'Activity'}</h3>
                        <span className={'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ' + (
                          issue.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          issue.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          'bg-rose-100 text-rose-800 border border-rose-200'
                        )}>
                          {issue.status}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-50 text-nss-blue rounded-md text-[10px] font-bold">
                          {issue.issueType?.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                        <span className="font-bold text-gray-800">{issue.volunteerName}</span>
                        <span>({issue.registrationNumber})</span>
                        {issue.batch && <span>• Batch {issue.batch}</span>}
                        <span>•</span>
                        <a href={`mailto:${issue.email}`} className="text-nss-blue hover:underline">
                          {issue.email}
                        </a>
                        <span>•</span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(issue.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {issue.status === 'PENDING' && (
                        <>
                          <button
                            type="button"
                            disabled={issueUpdatingId === issue._id}
                            onClick={() => handleResolveIssue(issue._id, true)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                            title="Verify and automatically mark Present for this event"
                          >
                            <CheckCircle size={13} /> Mark Present & Resolve
                          </button>
                          <button
                            type="button"
                            disabled={issueUpdatingId === issue._id}
                            onClick={() => handleRejectIssue(issue._id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteIssue(issue._id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Issue"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Description Body */}
                  <div className="p-4 bg-slate-50/70 rounded-xl text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1">Volunteer Statement:</p>
                    {issue.description}
                  </div>

                  {issue.adminRemarks && (
                    <div className="p-3 bg-blue-50/60 rounded-xl text-xs text-blue-900 border border-blue-100">
                      <span className="font-black">Admin Remarks:</span> {issue.adminRemarks}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
