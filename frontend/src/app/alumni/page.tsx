'use client';

import { motion } from 'framer-motion';
import { alumniData } from '@/data/alumni';
import { ExternalLink, Briefcase, GraduationCap, Quote } from 'lucide-react';

export default function AlumniPage() {
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
            Where Are Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-nss-blue to-blue-600">Volunteers</span> Now?
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            The spirit of "Not Me But You" stays with our volunteers forever. Discover how their NSS journey shaped their professional lives and where they are making an impact today.
          </p>
        </motion.div>

        {/* Alumni Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {alumniData.map((alumnus, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Top Banner / Photo Section */}
              <div className="relative h-32 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-center pt-8">
                <div className="absolute -bottom-12 w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white z-10">
                  <img 
                    src={alumnus.photoUrl} 
                    alt={alumnus.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="pt-16 pb-8 px-6 flex flex-col flex-grow">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{alumnus.name}</h3>
                  <div className="text-sm font-medium text-nss-blue mb-3">Batch of {alumnus.batch}</div>
                  
                  {/* Status Badge */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      alumnus.status === 'Placed' ? 'bg-green-50 text-green-700' : 'bg-purple-50 text-purple-700'
                    }`}>
                      {alumnus.status === 'Placed' ? <Briefcase size={14} /> : <GraduationCap size={14} />}
                      {alumnus.status}
                    </span>
                  </div>

                  {/* Company & Designation */}
                  {(alumnus.company || alumnus.designation) && (
                    <div className="text-sm text-gray-700 font-medium">
                      {alumnus.designation && <span className="block text-gray-900">{alumnus.designation}</span>}
                      {alumnus.company && <span className="block text-gray-500">@ {alumnus.company}</span>}
                    </div>
                  )}
                </div>

                {/* Bites / Messages */}
                <div className="flex-grow space-y-4 text-sm mt-4">
                  <div className="relative bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <Quote className="absolute top-3 left-3 text-blue-200/50 w-8 h-8 -z-0" />
                    <p className="text-gray-600 relative z-10 italic leading-relaxed line-clamp-5 hover:line-clamp-none transition-all">
                      "{alumnus.message}"
                    </p>
                  </div>
                  
                  {alumnus.cherished && (
                    <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50">
                      <h4 className="text-xs font-bold text-nss-blue uppercase tracking-wider mb-2">Most Cherished Memory</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {alumnus.cherished}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                {alumnus.linkedin && (
                  <div className="mt-8 pt-4 border-t border-gray-100 flex justify-center">
                    <a 
                      href={alumnus.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#0A66C2] transition-colors"
                    >
                      <ExternalLink size={16} />
                      View LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
