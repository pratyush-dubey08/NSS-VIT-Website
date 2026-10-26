'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1010502569127-uh45dgnuvlbi8188uthp6t55uac19tcf.apps.googleusercontent.com';

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const payload = { email, password, isAdminLogin: true };
      const { data } = await api.post('/auth/login', payload);
      login(data.user, data.token);
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/google', { token: credentialResponse.credential });
      login(data.user, data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google Login failed. Are you a registered volunteer?');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Login was unsuccessful. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-blue-50/20 to-red-50/20 px-4 pt-20 relative overflow-hidden">
      
      {/* Soft Blended Photography Watermark in Background */}
      <div className="fixed inset-0 pointer-events-none -z-30 opacity-[0.035] select-none overflow-hidden">
        <img src="/images/hero-nss-group.jpg" alt="" className="w-full h-full object-cover scale-105 filter blur-xs" />
      </div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden p-8 border border-slate-200/90 border-t-4 border-t-nss-blue relative z-10"
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

          <AnimatePresence mode="wait">
            {!isAdmin ? (
              <motion.div 
                key="volunteer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 flex flex-col items-center py-4"
              >
                <div className="text-center text-sm text-gray-500 mb-2">
                  Please use your official college email (<span className="font-semibold text-nss-blue">@vitbhopal.ac.in</span>) to sign in.
                </div>
                
                {loading ? (
                  <div className="w-full text-center py-4 text-nss-blue font-bold animate-pulse">Authenticating with Google...</div>
                ) : (
                  <div className="w-full flex justify-center py-2">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap={false}
                      theme="filled_blue"
                      shape="pill"
                      size="large"
                      text="signin_with"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-400 text-center">
                  Once signed in, you stay logged in permanently on this device.
                </p>
              </motion.div>
            ) : (
              <motion.form 
                key="admin"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleAdminLogin}
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
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-70 mt-6 bg-nss-red hover:bg-red-700"
                >
                  {loading ? 'Authenticating...' : 'Login as Admin'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
}
