'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Building, GraduationCap, Edit2, Shield, Calendar, Phone, Home, CheckCircle, XCircle, Users } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/axios';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    gender: user?.gender || 'Male',
    batch: user?.batch || '2024',
    residenceType: user?.residenceType || 'Hosteller'
  });

  if (!user) return null;

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { data } = await api.put(`/users/me/profile`, formData);
      setUser({
        ...data,
        id: data._id || data.id
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-nss-blue text-white rounded-xl transition-colors text-sm font-medium hover:bg-blue-800"
        >
          {isEditing ? <XCircle size={16} /> : <Edit2 size={16} />}
          {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        
        {/* Cover Photo Area */}
        <div className="h-40 bg-gradient-to-r from-nss-blue to-blue-500 w-full relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8 relative">
          {/* Avatar and Name Section */}
          <div className="relative -mt-16 mb-4 text-center sm:text-left">
            <div className="w-32 h-32 rounded-full bg-white p-1.5 shadow-lg inline-block relative z-10">
              <div className="w-full h-full rounded-full bg-nss-red flex items-center justify-center text-5xl font-bold text-white uppercase">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 mb-8 text-center sm:text-left">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">{user.name}</h2>
              <p className="text-nss-blue font-bold uppercase tracking-wider text-sm mt-1">{user.role.replace('_', ' ')}</p>
            </div>
            <div className="hidden sm:block">
              <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold flex items-center gap-2">
                <Shield size={16} /> Active Member
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            
            {/* Column 1 */}
            <div className="space-y-6">
              <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Personal Information</h3>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                  <User size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                  {isEditing ? (
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:border-nss-blue" />
                  ) : (
                    <p className="font-bold text-gray-900 text-lg">{user.name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                  <Mail size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address (Optional)</p>
                  {isEditing ? (
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:border-nss-blue" />
                  ) : (
                    <p className="font-bold text-gray-900 text-lg">{user.email || 'Not provided'}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                  <Phone size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                  {isEditing ? (
                    <input type="tel" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:border-nss-blue" />
                  ) : (
                    <p className="font-bold text-gray-900 text-lg">{user.phoneNumber || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                  <Users size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gender</p>
                  {isEditing ? (
                    <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:border-nss-blue">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="font-bold text-gray-900 text-lg">{user.gender || 'Not specified'}</p>
                  )}
                </div>
              </div>

            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Academic Information</h3>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                  <span className="font-bold">#</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Registration Number</p>
                  <p className="font-bold text-gray-900 text-lg">{user.registrationNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                  <GraduationCap size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Batch (Year of Admission)</p>
                  {isEditing ? (
                    <select value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:border-nss-blue">
                      {Array.from({ length: 6 }).map((_, i) => {
                        const year = (new Date().getFullYear() - 2 + i).toString();
                        return <option key={year} value={year}>{year}</option>;
                      })}
                    </select>
                  ) : (
                    <p className="font-bold text-gray-900 text-lg">{user.batch || 'Not specified'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                  <Home size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Residence Type</p>
                  {isEditing ? (
                    <select value={formData.residenceType} onChange={e => setFormData({...formData, residenceType: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:border-nss-blue">
                      <option value="Hosteller">Hosteller</option>
                      <option value="Day Scholar">Day Scholar</option>
                    </select>
                  ) : (
                    <p className="font-bold text-gray-900 text-lg">{user.residenceType || 'Not specified'}</p>
                  )}
                </div>
              </div>

            </div>
          </div>

          <AnimatePresence>
            {isEditing && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3"
              >
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-6 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  {isSaving ? 'Saving...' : <><CheckCircle size={18} /> Save Changes</>}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
