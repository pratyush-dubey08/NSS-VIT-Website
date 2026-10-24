'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Upload, 
  UserPlus, 
  ArrowRight,
  GraduationCap,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface NewBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBulk: (batch: string) => void;
  onStartSingle: (batch: string) => void;
}

export default function NewBatchModal({
  isOpen,
  onClose,
  onStartBulk,
  onStartSingle
}: NewBatchModalProps) {
  const [batchYear, setBatchYear] = useState('2026');

  if (!isOpen) return null;

  const cleanBatch = batchYear.trim() || '2026';

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
                <GraduationCap className="text-white" size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black">Add New Batch</h2>
                <p className="text-xs text-blue-100">Setup and onboard new volunteer batch</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Batch Year Input */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Batch Year / Title
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  value={batchYear}
                  onChange={(e) => setBatchYear(e.target.value)}
                  placeholder="e.g. 2026"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold focus:bg-white focus:border-nss-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500" />
                Once volunteers are added, Batch {cleanBatch} summary card and table will automatically appear.
              </p>
            </div>

            {/* Quick Action Cards */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Choose Volunteer Onboarding Method
              </p>

              {/* Bulk Import Option */}
              <button
                type="button"
                onClick={() => onStartBulk(cleanBatch)}
                className="w-full p-4 rounded-2xl border-2 border-indigo-100 hover:border-indigo-600 bg-indigo-50/40 hover:bg-indigo-50 text-left transition-all duration-200 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                    <Upload size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      Bulk Import for Batch {cleanBatch}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">Recommended</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Upload CSV sheet or paste full list of {cleanBatch} volunteers at once
                    </p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Single Volunteer Option */}
              <button
                type="button"
                onClick={() => onStartSingle(cleanBatch)}
                className="w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-600 bg-gray-50/60 hover:bg-blue-50/40 text-left transition-all duration-200 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center shrink-0 group-hover:bg-nss-blue group-hover:scale-105 transition-all">
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      Add Single Volunteer to Batch {cleanBatch}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Enter volunteer details one by one manually
                    </p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-200/60 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
