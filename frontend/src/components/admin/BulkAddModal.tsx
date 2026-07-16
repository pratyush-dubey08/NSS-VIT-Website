'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, AlertCircle, FileText } from 'lucide-react';
import api from '@/lib/axios';

interface BulkAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BulkAddModal({ isOpen, onClose, onSuccess }: BulkAddModalProps) {
  const [csvData, setCsvData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Parse CSV simply for this example: Name, Registration Number, Email, Batch, Gender, ResidenceType
      const rows = csvData.trim().split('\n').map(r => r.split(',').map(s => s.trim()));
      
      const volunteers = rows.map(row => {
        if (row.length < 3) throw new Error('Each row must have at least Name, Reg No, and Email separated by commas.');
        return {
          name: row[0],
          registrationNumber: row[1],
          email: row[2],
          batch: row[3] || '',
          gender: row[4] || '',
          residenceType: row[5] || '',
        };
      });

      await api.post('/users/bulk', { volunteers });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Failed to bulk add volunteers.');
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
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Upload className="text-nss-blue" /> Bulk Add Volunteers
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-blue-50 text-nss-blue p-4 rounded-xl text-sm mb-4 border border-blue-100 flex items-start gap-3">
              <FileText size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">CSV Format Required</p>
                <p>Paste your comma-separated values below. One volunteer per line.</p>
                <code className="block mt-2 bg-white px-2 py-1 rounded border border-blue-200 text-xs">
                  Name, RegNo, Email, Batch, Gender, ResidenceType
                </code>
                <p className="text-xs mt-1 text-blue-600">Example: John Doe, 21BCE10000, john@vitbhopal.ac.in, 2024, Male, Hosteller</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" /> {error}
              </div>
            )}
            
            <div>
              <textarea 
                required 
                rows={8}
                value={csvData}
                onChange={e => setCsvData(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-nss-blue font-mono text-sm resize-none"
                placeholder="John Doe, 21BCE10000, john@vitbhopal.ac.in, 2024, Male, Hosteller&#10;Jane Smith, 21BCE10001, jane@vitbhopal.ac.in, 2024, Female, Day Scholar"
              />
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
                disabled={loading || !csvData.trim()}
                className="flex-1 px-4 py-3 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : <><Upload size={18} /> Import Volunteers</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
