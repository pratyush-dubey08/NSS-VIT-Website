'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Highlights', path: '/highlights' },
    { name: 'Activities', path: '/activities' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Alumni', path: '/alumni' },
    { name: 'Leadership', path: '/team' },
    { name: 'Contact', path: '/contact' },
  ];

  const isHome = pathname === '/';

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="fixed top-0 w-full z-50 pt-4 sm:pt-5 px-3 sm:px-6 pointer-events-none">
      <div className="container mx-auto max-w-7xl flex items-center justify-between gap-3">
        
        {/* Left Box: Logo & Unit Title Pill */}
        <Link 
          href="/" 
          className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/90 backdrop-blur-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
        >
          <div className="p-0.5 rounded-full bg-white shadow-xs">
            <img src="/images/nss-logo.png" alt="NSS Logo" className="w-8 h-8 object-contain rounded-full" />
          </div>
          <span className="font-black tracking-tight text-sm sm:text-base text-gray-900 whitespace-nowrap">
            NSS Unit<span className="hidden sm:inline font-semibold text-gray-500 text-xs ml-1.5">• VIT Bhopal</span>
          </span>
        </Link>

        {/* Center Box: Main Navigation Links Pill (Distinct floating container) */}
        <nav className="pointer-events-auto hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xl shadow-md border border-gray-100">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.name} 
                href={link.path}
                className={`px-3 py-1.5 text-xs xl:text-sm font-bold rounded-full transition-all duration-200 whitespace-nowrap ${
                  isActive 
                    ? 'text-white bg-nss-blue shadow-sm' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/70'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Box: Login / Dashboard Button in its Own Distinct Action Box */}
        <div className="pointer-events-auto flex items-center gap-2">
          <Link 
            href={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : "/login"}
            className="px-5 py-2 text-xs sm:text-sm font-black rounded-full transition-all duration-300 transform hover:scale-105 bg-gray-900 hover:bg-nss-blue text-white shadow-md hover:shadow-lg whitespace-nowrap"
          >
            {isAuthenticated ? 'Dashboard' : 'Login'}
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="lg:hidden p-2 rounded-full bg-white/90 backdrop-blur-xl border border-gray-100 text-gray-900 shadow-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -15, scale: 0.96 }}
          animate={{ opacity: 1, y: 10, scale: 1 }}
          className="container mx-auto max-w-7xl px-4 pointer-events-auto lg:hidden"
        >
          <div className="bg-white/95 backdrop-blur-2xl shadow-2xl border border-gray-100 p-4 rounded-3xl flex flex-col gap-1.5 mt-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`p-3 text-sm font-bold rounded-2xl transition-colors flex items-center justify-between ${
                  pathname === link.path ? 'bg-blue-50 text-nss-blue' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{link.name}</span>
                {pathname === link.path && <span className="w-2 h-2 rounded-full bg-nss-blue" />}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}
