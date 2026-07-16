'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Award, ExternalLink, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CertificatesPage() {
 const { user } = useAuthStore();
 
 // The Admin uploads all certificates to a Google Drive folder and provides the link.
 const certificateDriveLink ="https://drive.google.com/drive/folders/placeholder-link"; 

 return (
 <div className="space-y-6 max-w-4xl mx-auto">
 <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
 <div className="relative z-10">
 <div className="w-16 h-16 bg-yellow-500/20 text-yellow-500 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-yellow-500/30">
 <Award size={32} />
 </div>
 <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Certificates</h1>
 <p className="text-gray-300 max-w-xl text-lg leading-relaxed">
 All participation and achievement certificates are securely uploaded to our official drive. You can find and download your certificates using the portal link below.
 </p>
 
 <div className="mt-8">
 <a 
 href={certificateDriveLink}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-3 px-8 py-4 bg-nss-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1"
 >
 <ExternalLink size={20} />
 Open Certificate Portal
 </a>
 </div>
 </div>
 
 {/* Decorative Graphic */}
 <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
 <Award size={400} />
 </div>
 </div>

 {/* Direct Certificates */}
 {user?.certificates && user.certificates.length > 0 && (
  <div className="mt-8">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Directly Assigned Certificates</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {user.certificates.map((certUrl, idx) => (
        <a 
          key={idx} 
          href={certUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-nss-blue transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-nss-blue rounded-lg flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
            <span className="font-semibold text-gray-800">Certificate #{idx + 1}</span>
          </div>
          <div className="text-gray-400 group-hover:text-nss-blue transition-colors">
            <Download size={20} />
          </div>
        </a>
      ))}
    </div>
  </div>
 )}

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-gray-100">
 <h3 className="font-bold text-gray-900 mb-2">How to find your certificate?</h3>
 <ul className="space-y-3 text-sm text-gray-600 mt-4">
 <li className="flex gap-3">
 <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs shrink-0 text-gray-900">1</span>
 Click the 'Open Certificate Portal' button above.
 </li>
 <li className="flex gap-3">
 <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs shrink-0 text-gray-900">2</span>
 Navigate to the folder of the specific activity/event.
 </li>
 <li className="flex gap-3">
 <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs shrink-0 text-gray-900">3</span>
 Search for your Registration Number ({user?.registrationNumber || 'e.g. 21BCE10101'}) or your Full Name.
 </li>
 <li className="flex gap-3">
 <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs shrink-0 text-gray-900">4</span>
 Download your PDF certificate.
 </li>
 </ul>
 </motion.div>

 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
 <h3 className="font-bold text-nss-blue mb-2">Notice</h3>
 <p className="text-sm text-gray-700 leading-relaxed mb-4">
 Certificates are usually uploaded within 7-10 working days after the successful completion of an activity and verification of attendance.
 </p>
 <p className="text-sm text-gray-700 leading-relaxed">
 If you cannot find your certificate after 14 days, please contact your respective Student Coordinator or Program Officer.
 </p>
 </motion.div>
 </div>
 </div>
 );
}
