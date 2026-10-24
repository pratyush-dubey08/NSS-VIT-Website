'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Edit2, 
  Shield, 
  Phone, 
  Home, 
  CheckCircle, 
  XCircle, 
  Users,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    gender: user?.gender || 'Male',
    batch: user?.batch || '2024',
    residenceType: user?.residenceType || 'Hosteller'
  });

  // Always fetch latest volunteer profile from backend on mount
  useEffect(() => {
    const fetchFreshProfile = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/users/me/profile');
        if (data) {
          setUser({
            ...data,
            id: data._id || data.id
          });
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            gender: data.gender || 'Male',
            batch: data.batch || '2024',
            residenceType: data.residenceType || 'Hosteller'
          });
        }
      } catch (error) {
        console.error('Error loading fresh profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreshProfile();
  }, []);

  if (!user && !loading) return null;

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const { data } = await api.put('/users/me/profile', formData);
      setUser({
        ...data,
        id: data._id || data.id
      });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Volunteer Profile</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your personal credentials, contact info, and NSS unit records</p>
        </div>

        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-50 text-nss-blue hover:bg-blue-100 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <Edit2 size={16} /> Edit Profile
          </button>
        ) : (
          <button 
            onClick={() => {
              setIsEditing(false);
              setFormData({
                name: user?.name || '',
                email: user?.email || '',
                phoneNumber: user?.phoneNumber || '',
                gender: user?.gender || 'Male',
                batch: user?.batch || '2024',
                residenceType: user?.residenceType || 'Hosteller'
              });
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <XCircle size={16} /> Cancel
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-sm font-bold flex items-center gap-2.5 shadow-xs">
          <CheckCircle size={18} className="text-emerald-600 shrink-0" />
          <span>Profile updated successfully! All details have been synced with the database.</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs z-10 flex flex-col items-center justify-center gap-2 text-nss-blue font-bold text-sm">
            <RefreshCw size={24} className="animate-spin" />
            <span>Syncing latest profile records...</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-gray-100">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-nss-blue to-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-md shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'V'}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-black text-gray-900">{user?.name || 'Volunteer'}</h2>
            <div className="flex flex-wrap items-center gap-2.5 mt-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg">
                {user?.registrationNumber || 'N/A'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                <Shield size={13} /> Active Volunteer
              </span>
              {user?.role && user.role !== 'VOLUNTEER' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-nss-blue rounded-full text-xs font-bold">
                  {user.role}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          
          {/* Column 1: Personal Info */}
          <div className="space-y-6">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider border-b border-gray-100 pb-2">
              Personal Information
            </h3>
            
            {/* Full Name */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-nss-blue shrink-0">
                <User size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-nss-blue text-sm font-semibold" 
                  />
                ) : (
                  <p className="font-bold text-gray-900 text-base">{user?.name}</p>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-nss-blue shrink-0">
                <Mail size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-nss-blue text-sm font-semibold" 
                  />
                ) : (
                  <p className="font-semibold text-gray-900 text-sm break-all">{user?.email || 'Not provided'}</p>
                )}
              </div>
            </div>
            
            {/* Phone / Contact Number */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Phone size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  Contact Number
                </p>
                {isEditing ? (
                  <input 
                    type="tel" 
                    value={formData.phoneNumber} 
                    onChange={e => setFormData({...formData, phoneNumber: e.target.value})} 
                    placeholder="Enter 10-digit mobile number"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-nss-blue text-sm font-mono font-bold" 
                  />
                ) : (
                  <p className="font-mono font-bold text-gray-900 text-base">
                    {user?.phoneNumber ? (
                      <span className="text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-100">
                        {user.phoneNumber}
                      </span>
                    ) : (
                      <span className="text-gray-400 font-normal italic">Not provided</span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                <Users size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gender</p>
                {isEditing ? (
                  <select 
                    value={formData.gender} 
                    onChange={e => setFormData({...formData, gender: e.target.value})} 
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-nss-blue text-sm font-semibold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="font-bold text-gray-900 text-sm">
                    {user?.gender ? (
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {user.gender}
                      </span>
                    ) : (
                      <span className="text-gray-400 font-normal italic">Not specified</span>
                    )}
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Column 2: Academic Info */}
          <div className="space-y-6">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider border-b border-gray-100 pb-2">
              Academic & Campus Status
            </h3>
            
            {/* Registration Number */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 font-black text-sm shrink-0">
                #
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Registration Number</p>
                <p className="font-mono font-bold text-gray-900 text-base">{user?.registrationNumber}</p>
              </div>
            </div>

            {/* Batch */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-nss-blue shrink-0">
                <GraduationCap size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Batch / Admission Year</p>
                {isEditing ? (
                  <select 
                    value={formData.batch} 
                    onChange={e => setFormData({...formData, batch: e.target.value})} 
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-nss-blue text-sm font-semibold"
                  >
                    {['2025', '2024', '2023', '2022', '2021', '2020'].map(year => (
                      <option key={year} value={year}>Batch of {year}</option>
                    ))}
                  </select>
                ) : (
                  <p className="font-bold text-gray-900 text-sm">
                    {user?.batch ? `Batch of ${user.batch}` : 'Active Volunteer'}
                  </p>
                )}
              </div>
            </div>

            {/* Residence Type */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                <Home size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Residential Status</p>
                {isEditing ? (
                  <select 
                    value={formData.residenceType} 
                    onChange={e => setFormData({...formData, residenceType: e.target.value})} 
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-nss-blue text-sm font-semibold"
                  >
                    <option value="Hosteller">Hosteller</option>
                    <option value="Day Scholar">Day Scholar</option>
                  </select>
                ) : (
                  <p className="font-bold text-gray-900 text-sm">
                    {user?.residenceType ? (
                      <span className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-xs ${
                        user.residenceType === 'Hosteller' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {user.residenceType}
                      </span>
                    ) : (
                      <span className="text-gray-400 font-normal italic">Not specified</span>
                    )}
                  </p>
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
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {isSaving ? 'Saving...' : <><CheckCircle size={18} /> Save Changes</>}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
