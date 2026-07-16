'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Save, Key } from 'lucide-react';
import api from '@/lib/axios';

export default function AdminSettings() {
  const { user } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }
    
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      setMessage({ text: 'Password updated successfully', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({ text: error.response?.data?.message || 'Failed to update password', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your admin account preferences.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-nss-red/10 text-nss-red flex items-center justify-center">
              <Key size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
              <p className="text-sm text-gray-500">Ensure your account is using a long, random password to stay secure.</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {message.text && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${
              message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-red focus:bg-white transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-red focus:bg-white transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-nss-red focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-70"
              >
                <Save size={18} />
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
