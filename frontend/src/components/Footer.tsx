'use client';

import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }
 return (
 <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
 <div className="container mx-auto px-4 md:px-8">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
 
 <div className="md:col-span-1">
 <Link href="/"className="flex items-center gap-3 mb-6">
 <img src="/images/nss-logo.png"alt="NSS Logo"className="w-10 h-10 object-contain rounded-full bg-white p-0.5 shadow-lg"/>
 <span className="font-bold text-lg md:text-xl text-gray-900">
 NSS Unit, VIT Bhopal University
 </span>
 </Link>
 <p className="text-sm text-gray-600 mb-6 leading-relaxed">
 Empowering youth through community service. Join us in our mission to develop personality through social impact.
 </p>
 </div>

 <div>
 <h4 className="font-bold text-lg mb-6">Quick Links</h4>
 <ul className="space-y-3">
 <li><Link href="/about"className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
 <li><Link href="/activities"className="text-gray-400 hover:text-white transition-colors">Activities & Events</Link></li>
 <li><Link href="/gallery"className="text-gray-400 hover:text-white transition-colors">Media Gallery</Link></li>
 <li><Link href="/team"className="text-gray-400 hover:text-white transition-colors">Our Team</Link></li>
 <li><Link href="/achievements"className="text-gray-400 hover:text-white transition-colors">Achievements</Link></li>
 </ul>
 </div>

 <div>
 <h4 className="font-bold text-lg mb-6">Resources</h4>
 <ul className="space-y-3">
 <li><Link href="/login"className="text-gray-400 hover:text-white transition-colors">Volunteer Portal</Link></li>
 <li><a href="#"className="text-gray-400 hover:text-white transition-colors">NSS Manual</a></li>
 <li><a href="#"className="text-gray-400 hover:text-white transition-colors">Certificate Verification</a></li>
 <li><a href="#"className="text-gray-400 hover:text-white transition-colors">Guidelines</a></li>
 <li><Link href="/contact"className="text-gray-400 hover:text-white transition-colors">Contact Support</Link></li>
 </ul>
 </div>

 <div>
 <h4 className="font-bold text-lg mb-6">Contact Us</h4>
 <ul className="space-y-4">
 <li className="flex items-start gap-3">
 <MapPin className="text-gray-400 shrink-0 mt-1"size={18} />
 <span className="text-gray-400 text-sm">
 VIT Bhopal University, Bhopal-Indore Highway, Kothrikalan, Sehore, Madhya Pradesh - 466114
 </span>
 </li>
 <li className="flex items-center gap-3">
 <Mail className="text-gray-400 shrink-0"size={18} />
 <a href="mailto:nss@vitbhopal.ac.in"className="text-gray-400 hover:text-white text-sm">
 nss@vitbhopal.ac.in
 </a>
 </li>
 </ul>
 </div>

 </div>
 
 <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
 <p>© {new Date().getFullYear()} NSS Unit, VIT Bhopal University. All rights reserved.</p>
 <p>Designed & Developed with ❤️ by Tech Team</p>
 </div>
 </div>
 </footer>
 );
}
