'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import api from '@/lib/axios';

export default function LiveRegistrationBanner() {
  const [openEvent, setOpenEvent] = useState<any>(null);

  useEffect(() => {
    const fetchOpen = async () => {
      try {
        const { data } = await api.get('/activities');
        const open = (Array.isArray(data) ? data : []).find((a: any) => a.isRegistrationOpen);
        if (open) setOpenEvent(open);
      } catch (err) {
        // quiet fallback
      }
    };
    fetchOpen();
  }, []);

  // If no event is open for registration, show nothing!
  if (!openEvent) return null;

  return (
    <div className="bg-gradient-to-r from-[#0A192F] via-[#1E3A8A] to-[#D32F2F] text-white py-2.5 px-4 shadow-md border-b border-white/20 relative z-30">
      <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider border border-emerald-400/30 shrink-0">
            Registration Open
          </span>
          <span className="font-extrabold text-white truncate max-w-xs sm:max-w-md">
            {openEvent.title}
          </span>
          <span className="hidden md:inline text-blue-200/70 text-xs">
            • {new Date(openEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <Link
          href={'/activities/' + openEvent._id}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-slate-100 text-[#0A192F] font-black rounded-full text-xs transition-all shadow-md hover:scale-105 shrink-0 cursor-pointer"
        >
          Register Now <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
