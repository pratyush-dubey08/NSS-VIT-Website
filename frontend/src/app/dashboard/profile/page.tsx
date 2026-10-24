'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Shield, 
  Phone, 
  Home, 
  CheckCircle, 
  Clock, 
  Users,
  RefreshCw,
  FileEdit,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import RequestCorrectionModal from '@/components/dashboard/RequestCorrectionModal';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [changeRequests, setChangeRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Always fetch latest volunteer profile & their change requests from backend on mount
  const fetchFreshProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users/me/profile');
      if (data) {
        setUser({
          ...data,
          id: data._id || data.id
        });
      }
    } catch (error) {
      console.error('Error loading fresh profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      setLoadingRequests(true);
      const { data } = await api.get('/users/change-requests/me');
      setChangeRequests(data || []);
    } catch (error) {
      console.error('Error loading change requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchFreshProfile();
    fetchMyRequests();
  }, []);

  if (!user && !loading) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Request Correction Modal */}
      <RequestCorrectionModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={() => {
          fetchMyRequests();
          fetchFreshProfile();
        }}
        user={user}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Volunteer Profile</h1>
          <p className="text-xs text-gray-500 mt-0.5">View your verified volunteer credentials and NSS unit records</p>
        </div>

        {/* Request to Update Details Button */}
        <button 
          onClick={() => setIsRequestModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 text-xs transition-all transform hover:scale-[1.02] cursor-pointer"
        >
          <FileEdit size={16} />
          <span>Request to Update Details</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Top Decorative Banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-nss-blue via-indigo-600 to-blue-500" />

        {/* User Identity Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-gray-100">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-nss-blue to-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/20 shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'V'}
          </div>
          
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h2 className="text-xl md:text-2xl font-black text-gray-900">{user?.name}</h2>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-nss-blue font-bold text-xs rounded-lg border border-blue-100">
                <Shield size={13} />
                <span>NSS Registered Volunteer</span>
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 font-mono font-bold text-xs rounded-lg">
                {user?.registrationNumber}
              </span>
              {user?.batch && (
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-100">
                  Batch {user.batch}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Locked Fields Notice */}
        <div className="mt-6 mb-6 p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-center justify-between gap-3 text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-nss-blue shrink-0" />
            <span>Profile details are verified by NSS Unit Admin. If any information is incorrect, submit a request above.</span>
          </div>
          <button 
            onClick={() => setIsRequestModalOpen(true)}
            className="text-xs font-bold text-nss-blue hover:underline whitespace-nowrap cursor-pointer"
          >
            Request Change &rarr;
          </button>
        </div>

        {/* 2-Column Read-Only Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Column 1: Contact & Personal Info */}
          <div className="space-y-6">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider border-b border-gray-100 pb-2">
              Personal & Contact Information
            </h3>
            
            {/* Full Name */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-nss-blue shrink-0">
                <User size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                <p className="font-bold text-gray-900 text-sm">{user?.name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-nss-blue shrink-0">
                <Mail size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                <p className="font-semibold text-gray-900 text-sm break-all">{user?.email || 'Not provided'}</p>
              </div>
            </div>
            
            {/* Phone / Contact Number */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Phone size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Number</p>
                <p className="font-mono font-bold text-gray-900 text-base">
                  {user?.phoneNumber ? (
                    <span className="text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-100">
                      {user.phoneNumber}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-normal italic text-xs">Not provided</span>
                  )}
                </p>
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                <Users size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gender</p>
                <p className="font-bold text-gray-900 text-sm">
                  {user?.gender ? (
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                      {user.gender}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-normal italic text-xs">Not specified</span>
                  )}
                </p>
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
                <p className="font-bold text-gray-900 text-sm">
                  {user?.batch ? `Batch ${user.batch}` : 'Active Volunteer'}
                </p>
              </div>
            </div>

            {/* Residence Type */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                <Home size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Residential Status</p>
                <p className="font-bold text-gray-900 text-sm">
                  {user?.residenceType ? (
                    <span className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-xs ${
                      user.residenceType === 'Hosteller' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {user.residenceType}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-normal italic text-xs">Not specified</span>
                  )}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Submitted Correction Requests History */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-nss-blue" />
            <h3 className="font-black text-gray-900 text-base">Your Correction Requests</h3>
          </div>
          <button
            onClick={fetchMyRequests}
            className="text-xs text-gray-500 hover:text-nss-blue font-bold flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw size={12} className={loadingRequests ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {loadingRequests ? (
          <div className="p-8 text-center text-xs font-bold text-gray-400">Loading requests...</div>
        ) : changeRequests.length === 0 ? (
          <div className="p-6 text-center border-2 border-dashed border-gray-100 rounded-2xl">
            <p className="text-xs text-gray-400 font-medium">No correction requests submitted yet.</p>
            <p className="text-[11px] text-gray-400 mt-1">If any detail above is wrong, click "Request to Update Details" to notify NSS Admin.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {changeRequests.map((req) => (
              <div 
                key={req._id}
                className="p-4 rounded-2xl border border-gray-100 bg-gray-50/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-gray-900 text-sm">{req.field}</span>
                    <span className="text-xs text-gray-400">({new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})</span>
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-2">
                    <span className="line-through text-gray-400">{req.currentValue || 'None'}</span>
                    <ArrowRight size={12} className="text-gray-400" />
                    <span className="font-bold text-gray-900">{req.requestedValue}</span>
                  </div>
                  {req.reason && (
                    <p className="text-[11px] text-gray-500 italic">"{req.reason}"</p>
                  )}
                </div>

                <div className="shrink-0">
                  {req.status === 'Accepted' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
                      <CheckCircle size={14} className="text-emerald-600" />
                      <span>Request Accepted</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl border border-amber-200">
                      <Clock size={14} className="text-amber-600" />
                      <span>Under Review by Admin</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
