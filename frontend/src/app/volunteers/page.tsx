'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';

interface Volunteer {
  name: string;
  registrationNumber: string;
  batch: string;
}

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setLoading(true);
        // Fetch dynamic volunteers from backend with timestamp to prevent caching
        const response = await api.get('/users/public', {
          params: { _t: Date.now() }
        });
        const backendVolunteers: any[] = Array.isArray(response.data) ? response.data : [];

        // Deduplicate and ensure clean batch
        const uniqueVolunteersMap = new Map<string, Volunteer>();

        backendVolunteers.forEach(v => {
          if (!v || !v.registrationNumber) return;
          const regNo = v.registrationNumber.trim().toUpperCase();

          let cleanBatch = v.batch ? String(v.batch).replace(/[^0-9]/g, '') : '';
          if (!cleanBatch || cleanBatch.length !== 4) {
            const m = regNo.match(/^(\d{2})/);
            cleanBatch = m ? '20' + m[1] : '2024';
          }

          uniqueVolunteersMap.set(regNo, {
            name: v.name?.trim() || 'Volunteer',
            registrationNumber: regNo,
            batch: cleanBatch
          });
        });

        const uniqueVolunteers = Array.from(uniqueVolunteersMap.values());

        // Sort: First by batch (descending e.g. 2025, 2024), then by name (ascending)
        uniqueVolunteers.sort((a, b) => {
          const batchDiff = (parseInt(b.batch) || 0) - (parseInt(a.batch) || 0);
          if (batchDiff !== 0) return batchDiff;
          return a.name.localeCompare(b.name);
        });

        setVolunteers(uniqueVolunteers);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching volunteers:', err);
        setError('Failed to load volunteers.');
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  // Group by batch
  const groupedVolunteers = volunteers.reduce((acc, volunteer) => {
    if (!acc[volunteer.batch]) {
      acc[volunteer.batch] = [];
    }
    acc[volunteer.batch].push(volunteer);
    return acc;
  }, {} as Record<string, Volunteer[]>);

  // Get sorted batches (e.g. 2025, 2024...)
  const batches = Object.keys(groupedVolunteers).sort((a, b) => (parseInt(b) || 0) - (parseInt(a) || 0));

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-nss-blue to-blue-600">Volunteers</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            The dedicated individuals who drive the NSS Unit forward, working tirelessly to serve the community.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nss-blue"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-bold p-8 bg-red-50 rounded-2xl border border-red-100 max-w-lg mx-auto">
            {error}
          </div>
        ) : (
          <div className="space-y-16">
            {batches.map((batch) => (
              <div key={batch} className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                    Batch of {batch}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {groupedVolunteers[batch].map((volunteer, index) => (
                    <motion.div
                      key={volunteer.registrationNumber}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
                      className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md transition-all duration-300 group"
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
