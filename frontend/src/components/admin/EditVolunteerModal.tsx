'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, AlertCircle, Calendar, Phone } from 'lucide-react';
import api from '@/lib/axios';

interface EditVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  volunteer: any;
  availableBatches?: string[];
}

export default function EditVolunteerModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  volunteer,
  availableBatches = ['2025', '2024'] 
}: EditVolunteerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    email: '',
    batch: '',
    gender: '',
    residenceType: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const batches = Array.from(new Set([
    ...availableBatches,
    ...(volunteer?.batch ? [volunteer.batch] : []),
    '2025',
    '2024'
  ])).filter(b => b && b.trim().length > 0)
    .sort((a, b) => (parseInt(b) || 0) - (parseInt(a) || 0));

  useEffect(() => {
    if (volunteer && isOpen) {
      setFormData({
        name: volunteer.name || '',
        registrationNumber: volunteer.registrationNumber || '',
        email: volunteer.email || '',
        batch: volunteer.batch || '',
        gender: volunteer.gender || '',
        residenceType: volunteer.residenceType || '',
        phoneNumber: volunteer.phoneNumber || ''
      });
      setError('');
    }
  }, [volunteer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.put(`/users/${volunteer._id}`, {
        ...formData,
        batch: formData.batch.trim() || undefined,
        phoneNumber: formData.phoneNumber.trim() || undefined
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update volunteer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Edit3 className="text-nss-blue" /> Edit Volunteer
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <input 
                required 
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-nss-blue text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Registration Number</label>
                <input 
                  required 
                  type="text"
                  value={formData.registrationNumber}
                  onChange={e => setFormData({...formData, registrationNumber: e.target.value.toUpperCase()})}
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-nss-blue uppercase text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar size={13} className="text-gray-400" /> Batch
                </label>
                <select
                  value={formData.batch}
                  onChange={e => setFormData(prev => ({ ...prev, batch: e.target.value }))}
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-nss-blue text-sm font-semibold bg-white cursor-pointer"
                >
                  <option value="">Select Batch</option>
                  {batches.map(b => (
                    <option key={b} value={b}>Batch {b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-nss-blue text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Phone size={13} className="text-gray-400" /> Contact No.
                </label>
                <input 
                  type="text"
                  value={formData.phoneNumber}
                  onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-nss-blue text-sm"
                  placeholder="e.g. 9876543210"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Gender</label>
                <select
                  value={formData.gender || ''}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-nss-blue text-sm cursor-pointer"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Residence Type</label>
                <div className="flex flex-col gap-2 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="radio" 
                      name="editResidenceType" 
                      value="Hosteller"
                      checked={formData.residenceType === 'Hosteller'}
                      onChange={e => setFormData({...formData, residenceType: e.target.value})}
                      className="w-4 h-4 text-nss-blue focus:ring-nss-blue"
                    />
                    <span>Hosteller</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="radio" 
                      name="editResidenceType" 
                      value="Day Scholar"
                      checked={formData.residenceType === 'Day Scholar'}
                      onChange={e => setFormData({...formData, residenceType: e.target.value})}
                      className="w-4 h-4 text-nss-blue focus:ring-nss-blue"
                    />
                    <span>Day Scholar</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 px-4 py-3 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50 text-sm shadow-md shadow-blue-500/20 cursor-pointer"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
