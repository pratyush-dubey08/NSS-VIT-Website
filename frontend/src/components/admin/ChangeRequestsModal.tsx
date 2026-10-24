'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  FileEdit, 
  CheckCircle, 
  Clock, 
  Search, 
  RefreshCw, 
  ArrowRight, 
  Edit3, 
  AlertCircle,
  Phone,
  User,
  Filter
} from 'lucide-react';
import api from '@/lib/axios';

interface ChangeRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditVolunteer: (volunteer: any) => void;
}

export default function ChangeRequestsModal({
  isOpen,
  onClose,
  onEditVolunteer
}: ChangeRequestsModalProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'Pending' | 'Accepted'>('Pending');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users/change-requests');
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching change requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMarkAccepted = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Accepted' ? 'Pending' : 'Accepted';
    try {
      setUpdatingId(id);
      await api.put(`/users/change-requests/${id}/status`, { status: nextStatus });
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: nextStatus, reviewedAt: new Date() } : r));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update request status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const acceptedCount = requests.filter(r => r.status === 'Accepted').length;

  const filteredRequests = requests.filter(r => {
    if (filter === 'Pending') return r.status === 'Pending';
    if (filter === 'Accepted') return r.status === 'Accepted';
    return true;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <FileEdit className="text-white" size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black flex items-center gap-2">
                  Volunteer Change Requests
                  {pendingCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white text-orange-600 shadow-sm">
                      {pendingCount} Pending
                    </span>
                  )}
                </h2>
                <p className="text-xs text-amber-100">Review volunteer correction requests & mark accepted after updating</p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Subheader / Tabs */}
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('Pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filter === 'Pending'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilter('Accepted')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filter === 'Accepted'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Accepted ({acceptedCount})
              </button>
              <button
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filter === 'ALL'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                All Requests ({requests.length})
              </button>
            </div>

            <button
              onClick={fetchRequests}
              className="text-xs text-gray-500 hover:text-gray-900 font-bold flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-gray-200"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          {/* Requests Content List */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {loading ? (
              <div className="p-12 text-center text-gray-400 font-bold text-sm flex items-center justify-center gap-2">
                <RefreshCw size={18} className="animate-spin text-amber-500" />
                <span>Loading change requests...</span>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                <CheckCircle size={32} className="mx-auto text-emerald-500 mb-2" />
                <h3 className="font-bold text-gray-800 text-base">No {filter !== 'ALL' ? filter : ''} Requests Found</h3>
                <p className="text-xs text-gray-500 mt-1">All volunteer profile correction requests are up to date.</p>
              </div>
            ) : (
              filteredRequests.map(req => {
                const isUpdating = updatingId === req._id;
                const volunteerObj = req.user || {
                  _id: req.user?._id || req.user,
                  name: req.volunteerName,
                  registrationNumber: req.registrationNumber,
                  email: req.email,
                  phoneNumber: req.user?.phoneNumber || ''
                };

                return (
                  <div 
                    key={req._id}
                    className={`p-5 rounded-2xl border transition-all ${
                      req.status === 'Accepted'
                        ? 'bg-emerald-50/20 border-emerald-100'
                        : 'bg-white border-amber-200 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      
                      {/* Volunteer & Request Info */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-black text-gray-900 text-base">{req.volunteerName}</span>
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-mono font-bold text-xs">
                            {req.registrationNumber}
                          </span>
                          <span className="text-xs text-gray-400">
                            • Submitted on {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        {/* Correction Difference */}
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs flex flex-wrap items-center gap-2">
                          <span className="font-bold text-nss-blue uppercase tracking-wider text-[11px] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {req.field}
                          </span>
                          <span className="text-gray-400 line-through font-mono">
                            {req.currentValue || 'None'}
                          </span>
                          <ArrowRight size={13} className="text-gray-400 shrink-0" />
                          <span className="font-bold text-gray-900 font-mono bg-white px-2 py-0.5 rounded border border-gray-200">
                            {req.requestedValue}
                          </span>
                        </div>

                        {req.reason && (
                          <p className="text-xs text-gray-600 italic">
                            Reason: "{req.reason}"
                          </p>
                        )}
                      </div>

                      {/* Status & Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {/* Status Badge */}
                        {req.status === 'Accepted' ? (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-emerald-200">
                            <CheckCircle size={14} className="text-emerald-700" />
                            <span>Request Accepted</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-amber-200">
                            <Clock size={14} className="text-amber-700" />
                            <span>Pending Review</span>
                          </span>
                        )}

                        {/* Edit Volunteer in Admin */}
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onEditVolunteer(volunteerObj);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-nss-blue font-bold text-xs transition-colors flex items-center gap-1 border border-gray-200 cursor-pointer"
                          title="Open volunteer edit modal to apply this correction"
                        >
                          <Edit3 size={13} />
                          <span>Edit Volunteer</span>
                        </button>

                        {/* Mark Accepted Button */}
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleMarkAccepted(req._id, req.status)}
                          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 ${
                            req.status === 'Accepted'
                              ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          <CheckCircle size={14} />
                          <span>{req.status === 'Accepted' ? 'Mark Pending' : 'Request Accepted'}</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500 shrink-0">
            <span>ℹ️ Changes are made manually by Admin in the volunteer records. Mark "Request Accepted" once updated.</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gray-200 text-gray-800 font-bold hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
