'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';

export default function LoginPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const payload = isAdmin 
        ? { email, password, isAdminLogin: true }
        : { name, registrationNumber, isAdminLogin: false };

      const { data } = await api.post('/auth/login', payload);
      login(data.user, data.token);
      
      if (data.user.role === 'SUPER_ADMIN' || data.user.role === 'PROGRAM_OFFICER' || data.user.role === 'EVENT_MANAGER') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            {isAdmin ? 'Admin Portal' : 'Volunteer Portal'}
          </h2>
          <p className="text-gray-500">Sign in to access your dashboard</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
          <button
            type="button"
            onClick={() => { setIsAdmin(false); setError(''); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isAdmin ? 'bg-white shadow-sm text-nss-blue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Volunteer
          </button>
          <button
            type="button"
            onClick={() => { setIsAdmin(true); setError(''); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isAdmin ? 'bg-white shadow-sm text-nss-red' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Admin
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <AnimatePresence mode="wait">
            {!isAdmin ? (
              <motion.div 
                key="volunteer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-nss-blue focus:bg-white transition-all outline-none"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Registration Number</label>
                  <input
                    type="text"
                    required
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-nss-blue focus:bg-white transition-all outline-none uppercase"
                    placeholder="e.g. 21BCE10000"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="admin"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-nss-red focus:bg-white transition-all outline-none"
                    placeholder="admin@vitbhopal.ac.in"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-nss-red focus:bg-white transition-all outline-none"
                    placeholder="Enter password"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-70 mt-6 ${isAdmin ? 'bg-nss-red hover:bg-red-700' : 'bg-nss-blue hover:bg-blue-900'}`}
          >
            {loading ? 'Authenticating...' : (isAdmin ? 'Login as Admin' : 'Login as Volunteer')}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
