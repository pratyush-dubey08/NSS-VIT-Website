'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staticVolunteers } from '@/data/volunteers';
import api from '@/lib/axios';

interface Volunteer {
  name: string;
  registrationNumber: string;
  batch: string;
}

export default function VolunteersPage() {
  const [dynamicVolunteers, setDynamicVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setLoading(true);
        // Fetch dynamic volunteers directly from backend
        const response = await api.get('/users/public', {
          params: { _t: Date.now() }
        });
        const backendData: any[] = Array.isArray(response.data) ? response.data : [];

        const uniqueMap = new Map<string, Volunteer>();

        backendData.forEach(v => {
          if (!v || !v.registrationNumber) return;
          const regNo = v.registrationNumber.trim().toUpperCase();

          let cleanBatch = v.batch ? String(v.batch).replace(/[^0-9]/g, '') : '';
          if (!cleanBatch || cleanBatch.length !== 4) {
            const m = regNo.match(/^(\d{2})/);
            cleanBatch = m ? '20' + m[1] : '2024';
          }

          uniqueMap.set(regNo, {
            name: v.name?.trim() || 'Volunteer',
            registrationNumber: regNo,
            batch: cleanBatch
          });
        });

        const list = Array.from(uniqueMap.values());
        list.sort((a, b) => a.name.localeCompare(b.name));
        setDynamicVolunteers(list);
      } catch (err: any) {
        console.error('Error fetching dynamic volunteers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  // Dynamically group all live volunteers from the database by batch
  const dynamicBatchMap = new Map<string, Volunteer[]>();
  dynamicVolunteers.forEach(v => {
    const b = (v.batch || '').trim();
    if (!b) return;
    if (!dynamicBatchMap.has(b)) dynamicBatchMap.set(b, []);
    dynamicBatchMap.get(b)!.push(v);
  });

  // Sort live database batches in descending order (e.g. 2026, 2025, 2024)
  const dynamicBatchYears = Array.from(dynamicBatchMap.keys()).sort((a, b) => {
    const numA = parseInt(a) || 0;
    const numB = parseInt(b) || 0;
    return numB - numA;
  });

  const dynamicSections = dynamicBatchYears.map(year => ({
    batch: year,
    list: (dynamicBatchMap.get(year) || []).sort((a, b) => a.name.localeCompare(b.name))
  }));

  // Static historical batches (display only: 2023, 2022, 2021)
  const staticYears = ['2023', '2022', '2021'];
  const staticSections = staticYears.map(year => ({
    batch: year,
    list: (staticVolunteers as Volunteer[])
      .filter(v => v.batch === year)
      .sort((a, b) => a.name.localeCompare(b.name))
  }));

  // Combine dynamic sections with static sections, keeping only non-empty
  const sections = [...dynamicSections, ...staticSections].filter(s => s.list.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-red-50/20 pt-32 pb-20 px-4 relative overflow-hidden">
      
      {/* Soft Blended Photography Watermark in Background */}
      <div className="fixed inset-0 pointer-events-none -z-30 opacity-[0.035] select-none overflow-hidden">
        <img src="/images/hero-nss-group.jpg" alt="" className="w-full h-full object-cover scale-105 filter blur-xs" />
      </div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight bg-gradient-to-r from-nss-blue via-blue-900 to-nss-red bg-clip-text text-transparent">
            Our Volunteers
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            The dedicated individuals who drive the NSS Unit forward, working tirelessly to serve the community.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nss-blue"></div>
          </div>
        ) : (
          <div className="space-y-16">
            {sections.map((section) => (
              <div key={section.batch} className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-lg border border-slate-200/90 border-t-4 border-t-nss-blue">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                    Batch of {section.batch}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {section.list.map((volunteer, index) => (
                    <motion.div
                      key={volunteer.registrationNumber}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
                      className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 flex flex-col hover:border-nss-blue hover:bg-white hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
                    >
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-nss-blue transition-colors">
                        {volunteer.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium tracking-wide mt-1">
                        {volunteer.registrationNumber}
                      </p>
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
