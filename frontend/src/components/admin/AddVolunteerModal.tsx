'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';

interface AddVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddVolunteerModal({ isOpen, onClose, onSuccess }: AddVolunteerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    email: '',
    batch: '',
    gender: '',
    residenceType: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/users', formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add volunteer.');
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
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="text-nss-blue" /> Add Volunteer
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
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
                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-nss-blue"
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Registration Number</label>
              <input 
                required 
                type="text"
                value={formData.registrationNumber}
                onChange={e => setFormData({...formData, registrationNumber: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-nss-blue uppercase"
                placeholder="e.g. 21BCE10000"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input 
                required 
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-nss-blue"
                placeholder="e.g. john@vitbhopal.ac.in"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Batch</label>
                <input 
                  type="text"
                  value={formData.batch}
                  onChange={e => setFormData({...formData, batch: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-nss-blue"
                  placeholder="e.g. 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Gender</label>
                <select
                  value={formData.gender || ''}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-nss-blue"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Residence Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="residenceType" 
                    value="Hosteller"
                    checked={formData.residenceType === 'Hosteller'}
                    onChange={e => setFormData({...formData, residenceType: e.target.value})}
                    className="w-4 h-4 text-nss-blue focus:ring-nss-blue"
                  />
                  <span>Hosteller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="residenceType" 
                    value="Day Scholar"
                    checked={formData.residenceType === 'Day Scholar'}
                    onChange={e => setFormData({...formData, residenceType: e.target.value})}
                    className="w-4 h-4 text-nss-blue focus:ring-nss-blue"
                  />
                  <span>Day Scholar</span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 px-4 py-3 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Volunteer'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
