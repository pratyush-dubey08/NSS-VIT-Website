'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle, CheckCircle2, FileEdit } from 'lucide-react';
import api from '@/lib/axios';

interface RequestCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: any;
}

export default function RequestCorrectionModal({
  isOpen,
  onClose,
  onSuccess,
  user
}: RequestCorrectionModalProps) {
  const [selectedField, setSelectedField] = useState('phoneNumber');
  const [requestedValue, setRequestedValue] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const fields = [
    { id: 'phoneNumber', label: 'Contact Number', current: user?.phoneNumber || 'Not provided' },
    { id: 'name', label: 'Full Name', current: user?.name || '' },
    { id: 'email', label: 'Email Address', current: user?.email || '' },
    { id: 'gender', label: 'Gender', current: user?.gender || 'Not specified' },
    { id: 'residenceType', label: 'Residential Status (Hosteller / Day Scholar)', current: user?.residenceType || 'Not specified' },
    { id: 'batch', label: 'Batch / Admission Year', current: user?.batch ? `Batch of ${user.batch}` : 'Not specified' },
    { id: 'registrationNumber', label: 'Registration Number', current: user?.registrationNumber || '' },
    { id: 'other', label: 'Other Record Detail', current: '—' },
  ];

  const currentFieldObj = fields.find(f => f.id === selectedField) || fields[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedValue.trim()) {
      setError('Please enter the correct value.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await api.post('/users/change-request', {
        field: currentFieldObj.label,
        currentValue: String(currentFieldObj.current),
        requestedValue: requestedValue.trim(),
        reason: reason.trim()
      });

      setSuccessMsg('Correction request submitted to Admin! NSS Admin will review and make the changes.');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit correction request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <FileEdit className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black">Request to Update Details</h2>
                <p className="text-xs text-blue-100">Submit detail correction request to NSS Admin</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-rose-200">
                <AlertCircle size={16} className="shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Field Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Select Field to Correct
              </label>
              <select
                value={selectedField}
                onChange={e => {
                  setSelectedField(e.target.value);
                  setRequestedValue('');
                }}
                className="w-full p-3 rounded-xl border border-gray-200 text-gray-900 font-bold text-sm bg-gray-50 focus:bg-white focus:border-nss-blue outline-none transition-all cursor-pointer"
              >
                {fields.map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* Current Value Preview */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between items-center">
              <span className="text-slate-500 font-medium">Current recorded value:</span>
              <span className="font-bold text-slate-900 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                {currentFieldObj.current}
              </span>
            </div>

            {/* Correct Value Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <span>Correct / New Value</span>
                <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text"
                required
                value={requestedValue}
                onChange={e => setRequestedValue(e.target.value)}
                placeholder={`Enter correct ${currentFieldObj.label.toLowerCase()}`}
                className="w-full p-3 rounded-xl border border-gray-200 text-gray-900 font-semibold text-sm focus:border-nss-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            {/* Remarks / Reason Input */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Reason / Remarks (Optional)
              </label>
              <textarea 
                rows={2}
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g. Typo in contact number during registration"
                className="w-full p-3 rounded-xl border border-gray-200 text-gray-900 text-xs focus:border-nss-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              />
            </div>

            {/* Admin Note */}
            <p className="text-[11px] text-gray-500 leading-relaxed bg-blue-50/70 p-3 rounded-xl border border-blue-100">
              ℹ️ Your request will be sent to the NSS Admin portal. Once verified, the admin will update your records.
            </p>

            <div className="pt-2 flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50 text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Submitting...' : <><Send size={15} /> Submit Request</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
