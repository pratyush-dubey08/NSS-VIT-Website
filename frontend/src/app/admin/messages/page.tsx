'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare, Mail, Search, Trash2, CheckCircle2, Clock, 
  ExternalLink, RefreshCw, Filter, AlertCircle, Check, ArrowUpRight
} from 'lucide-react';
import api from '@/lib/axios';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNREAD' | 'READ' | 'RESOLVED'>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  useEffect(() => {
    fetchMessages();
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Contact Inquiries & Messages
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            View, reply, and manage direct messages submitted by students from the public Contact page.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start cursor-pointer shadow-2xs"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

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

              {/* Message Body */}
              <div className="p-4 bg-slate-50/60 rounded-xl text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-normal">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
