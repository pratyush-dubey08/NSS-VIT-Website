'use client';

import Link from 'next/link';
import { Mail, MapPin, Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-b from-[#0A192F] via-[#081528] to-[#040C18] text-white pt-16 pb-8 border-t-4 border-nss-red relative overflow-hidden font-sans">
      {/* Soft Ambient Brand Glows & Watermark */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 flex items-center justify-end opacity-[0.03] pointer-events-none -z-10 select-none pr-10">
        <img src="/images/nss-logo.png" alt="" className="w-80 h-80 object-contain" />
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <img 
                src="/images/nss-logo.png" 
                alt="NSS Logo" 
                className="w-12 h-12 object-contain rounded-full bg-white p-1 shadow-lg ring-2 ring-red-500/50 group-hover:scale-105 transition-transform"
              />
              <span className="font-black text-lg md:text-xl text-white tracking-tight leading-tight">
                NSS Unit, VIT Bhopal University
              </span>
            </Link>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Empowering youth through community service. Join us in our mission to develop personality through selfless social impact.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-red-300">
              <span className="w-2 h-2 rounded-full bg-nss-red animate-pulse" />
              Motto: "Not Me, But You"
            </div>
          </div>

          <div>
            <h4 className="font-black text-base uppercase tracking-wider mb-6 text-white border-b-2 border-nss-red pb-1.5 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-slate-300 hover:text-red-400 hover:translate-x-1 transition-all inline-block text-sm font-medium">About Us</Link></li>
              <li><Link href="/activities" className="text-slate-300 hover:text-red-400 hover:translate-x-1 transition-all inline-block text-sm font-medium">Activities & Events</Link></li>
              <li><Link href="/gallery" className="text-slate-300 hover:text-red-400 hover:translate-x-1 transition-all inline-block text-sm font-medium">Media Gallery</Link></li>
              <li><Link href="/team" className="text-slate-300 hover:text-red-400 hover:translate-x-1 transition-all inline-block text-sm font-medium">Leadership</Link></li>
              <li><Link href="/highlights" className="text-slate-300 hover:text-red-400 hover:translate-x-1 transition-all inline-block text-sm font-medium">Unit Highlights</Link></li>
              <li><Link href="/achievements" className="text-slate-300 hover:text-red-400 hover:translate-x-1 transition-all inline-block text-sm font-medium">Awardees & Campers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-base uppercase tracking-wider mb-6 text-white border-b-2 border-nss-blue-light pb-1.5 inline-block">
              Resources
            </h4>
            <ul className="space-y-3">
              <li><Link href="/login" className="text-slate-300 hover:text-red-400 hover:translate-x-1 transition-all inline-block text-sm font-medium">Volunteer Portal</Link></li>
              <li><Link href="/contact" className="text-slate-300 hover:text-red-400 hover:translate-x-1 transition-all inline-block text-sm font-medium">Contact Support</Link></li>
              <li><Link href="/initiatives/tree-plantation" className="text-slate-300 hover:text-red-400 hover:translate-x-1 transition-all inline-block text-sm font-medium">Tree Plantation</Link></li>
              <li><Link href="/initiatives/blood-donation" className="text-slate-300 hover:text-red-400 hover:translate-x-1 transition-all inline-block text-sm font-medium">Blood Donation</Link></li>
              <li><Link href="/initiatives/annual-camp" className="text-slate-300 hover:text-red-400 hover:translate-x-1 transition-all inline-block text-sm font-medium">Annual Camp</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-base uppercase tracking-wider mb-6 text-white border-b-2 border-nss-red pb-1.5 inline-block">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-red-400 shrink-0 mt-1" size={18} />
                <span className="text-slate-300 text-sm leading-relaxed">
                  VIT Bhopal University, Bhopal-Indore Highway, Kothrikalan, Sehore, Madhya Pradesh - 466114
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-red-400 shrink-0" size={18} />
                <a href="mailto:nss@vitbhopal.ac.in" className="text-slate-300 hover:text-red-400 transition-colors text-sm font-medium">
                  nss@vitbhopal.ac.in
                </a>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-slate-800/80 text-center text-slate-400 text-xs sm:text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} NSS Unit, VIT Bhopal University. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed & Developed with <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> by Pratyush Dubey 23BAI10595
          </p>
        </div>
      </div>
    </footer>
  );
}
