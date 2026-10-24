'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staticVolunteers } from '@/data/volunteers';
import { Search, Users, GraduationCap, X, Sparkles, Filter } from 'lucide-react';
import api from '@/lib/axios';

interface Volunteer {
  name: string;
  registrationNumber: string;
  batch: string;
  phoneNumber?: string;
  gender?: string;
  residenceType?: string;
}

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('ALL');

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setLoading(true);
        // Fetch dynamic volunteers from backend with timestamp to avoid stale caching
        const response = await api.get('/users/public', {
          params: { _t: Date.now() }
        });
        const backendVolunteers: Volunteer[] = Array.isArray(response.data) ? response.data : [];

        // Merge with static volunteers
        const allVolunteers = [...backendVolunteers, ...staticVolunteers];

        // Remove duplicates by registration number and clean up batch
        const uniqueVolunteersMap = new Map<string, Volunteer>();

        allVolunteers.forEach(v => {
          if (!v || !v.registrationNumber) return;
          const regNo = v.registrationNumber.trim().toUpperCase();

          // Intelligent batch extraction
          let cleanBatch = v.batch ? String(v.batch).replace(/[^0-9]/g, '') : '';
          if (!cleanBatch || cleanBatch.length !== 4) {
            // Extract from regNo (e.g., 24BAI10589 -> 2024, 25BCE10150 -> 2025)
            const m = regNo.match(/^(\d{2})/);
            if (m) {
              cleanBatch = '20' + m[1];
            } else {
              cleanBatch = '2024';
            }
          }

          const anyV = v as any;
          uniqueVolunteersMap.set(regNo, {
            name: v.name?.trim() || 'Volunteer',
            registrationNumber: regNo,
            batch: cleanBatch,
            phoneNumber: anyV.phoneNumber,
            gender: anyV.gender,
            residenceType: anyV.residenceType
          });
        });

        const uniqueList = Array.from(uniqueVolunteersMap.values());

        // Sort: First by batch (descending), then by name (ascending)
        uniqueList.sort((a, b) => {
          const batchDiff = (parseInt(b.batch) || 0) - (parseInt(a.batch) || 0);
          if (batchDiff !== 0) return batchDiff;
          return a.name.localeCompare(b.name);
        });

        setVolunteers(uniqueList);
      } catch (err: any) {
        console.error('Error fetching dynamic volunteers:', err);
        // Fallback to static data if backend is unreachable
        const fallbackMap = new Map<string, Volunteer>();
        staticVolunteers.forEach(v => {
          fallbackMap.set(v.registrationNumber.toUpperCase(), {
            name: v.name,
            registrationNumber: v.registrationNumber.toUpperCase(),
            batch: v.batch || '2023'
          });
        });
        setVolunteers(Array.from(fallbackMap.values()));
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  // Filter volunteers by search query and selected batch
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter(v => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        v.name.toLowerCase().includes(q) || 
        v.registrationNumber.toLowerCase().includes(q) ||
        v.batch.includes(q);

      const matchesBatch = selectedBatch === 'ALL' || v.batch === selectedBatch;

      return matchesSearch && matchesBatch;
    });
  }, [volunteers, searchQuery, selectedBatch]);

  // Group filtered volunteers by batch
  const groupedVolunteers = useMemo(() => {
    return filteredVolunteers.reduce((acc, volunteer) => {
      if (!acc[volunteer.batch]) {
        acc[volunteer.batch] = [];
      }
      acc[volunteer.batch].push(volunteer);
      return acc;
    }, {} as Record<string, Volunteer[]>);
  }, [filteredVolunteers]);

  // Get all unique batches from entire list for tab buttons
  const allBatches = useMemo(() => {
    const set = new Set(volunteers.map(v => v.batch));
    return Array.from(set).sort((a, b) => (parseInt(b) || 0) - (parseInt(a) || 0));
  }, [volunteers]);

  // Sorted batches currently visible in the grouped results
  const visibleBatches = useMemo(() => {
    return Object.keys(groupedVolunteers).sort((a, b) => (parseInt(b) || 0) - (parseInt(a) || 0));
  }, [groupedVolunteers]);

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-nss-blue border border-blue-100 mb-4 shadow-2xs">
            <Users size={14} /> NSS Unit VIT Bhopal
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-nss-blue via-blue-600 to-indigo-600">Volunteers</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            The dedicated individuals who drive the NSS Unit forward, working tirelessly to serve society and community.
          </p>
        </motion.div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search volunteer by name or registration number (e.g. 24BAI10589)..."
                className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-nss-blue focus:ring-3 focus:ring-blue-100 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Total Count Badge */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-500">
                Showing <strong className="text-slate-900">{filteredVolunteers.length}</strong> of {volunteers.length} Volunteers
              </span>
            </div>
          </div>

          {/* Batch Tabs Filter */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter size={12} /> Batch:
            </span>

            <button
              onClick={() => setSelectedBatch('ALL')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBatch === 'ALL'
                  ? 'bg-nss-blue text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Batches ({volunteers.length})
            </button>

            {allBatches.map(batch => {
              const countInBatch = volunteers.filter(v => v.batch === batch).length;
              const isSelected = selectedBatch === batch;

              return (
                <button
                  key={batch}
                  onClick={() => setSelectedBatch(batch)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-nss-blue text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <GraduationCap size={13} />
                  <span>Batch of {batch}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-700'
                  }`}>
                    {countInBatch}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Volunteer List */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-10 h-10 border-3 border-nss-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-600">Loading NSS Unit volunteers...</p>
          </div>
        ) : visibleBatches.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto shadow-sm">
            <Users size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No volunteers found</h3>
            <p className="text-xs text-slate-500 mt-1">
              No volunteers matched your search query "{searchQuery}". Try searching by another name or registration number.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Clear Search Query
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {visibleBatches.map((batch) => (
              <div 
                key={batch} 
                className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-100"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-nss-blue flex items-center justify-center font-bold">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                        Batch of {batch}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">NSS Unit enrolled volunteers</p>
                    </div>
                  </div>

                  <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-nss-blue border border-blue-100">
                    {groupedVolunteers[batch].length} Volunteer{groupedVolunteers[batch].length === 1 ? '' : 's'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {groupedVolunteers[batch].map((volunteer, index) => (
                    <motion.div
                      key={volunteer.registrationNumber}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: (index % 12) * 0.03 }}
                      className="bg-slate-50/80 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 rounded-2xl p-4 flex items-start gap-3 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-nss-blue font-black text-sm shrink-0 shadow-2xs group-hover:bg-nss-blue group-hover:text-white transition-colors">
                        {volunteer.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-nss-blue transition-colors truncate" title={volunteer.name}>
                          {volunteer.name}
                        </h3>
                        <p className="text-xs font-mono font-bold text-slate-500 tracking-wider mt-0.5">
                          {volunteer.registrationNumber}
                        </p>

                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200/60 shadow-2xs">
                            Batch {volunteer.batch}
                          </span>
                          {volunteer.residenceType && (
                            <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                              volunteer.residenceType === 'Hosteller' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {volunteer.residenceType}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
