'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Compass, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 flex items-center justify-center px-4 pt-24 pb-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full text-center bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-2xl"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-50 text-nss-blue flex items-center justify-center shadow-inner">
          <span className="text-3xl font-black">404</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3">
          Page Not Found
        </h1>

        <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
          The page you are looking for might have been moved, renamed, or does not exist. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-nss-blue text-white rounded-xl font-bold text-sm hover:bg-blue-900 transition-colors shadow-sm"
          >
            <Home size={16} />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/activities"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-sm transition-colors"
          >
            <Compass size={16} />
            <span>Explore Activities</span>
          </Link>
          <Link
            href="/gallery"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-sm transition-colors"
          >
            <ImageIcon size={16} />
            <span>Gallery</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
