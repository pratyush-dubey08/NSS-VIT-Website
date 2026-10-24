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
    <header className="fixed top-0 w-full z-50 pt-3 sm:pt-4 px-3 sm:px-6 pointer-events-none font-sans">
      <div className="container mx-auto max-w-7xl flex items-center justify-between gap-3">
        
        {/* Main Unified Navbar Pill: Logo + NSS Unit Brand + Nav Links (All in One Box) */}
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
          
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-2 pl-1 pr-2 shrink-0">
            <div className="p-0.5 rounded-full bg-white shadow-xs">
              <img src="/images/nss-logo.png" alt="NSS Logo" className="w-8 h-8 object-contain rounded-full" />
            </div>
            <span className="font-black tracking-tight text-sm text-gray-900 whitespace-nowrap hidden sm:inline">
              NSS Unit<span className="font-semibold text-gray-500 text-xs ml-1">• VIT Bhopal</span>
            </span>
          </Link>

          {/* Vertical Divider */}
          <div className="h-5 w-px bg-gray-200 hidden lg:block mx-1 shrink-0" />

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  href={link.path}
                  className={`px-2.5 xl:px-3 py-1 text-xs xl:text-sm font-bold rounded-full transition-all duration-200 whitespace-nowrap ${
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
        </div>

        {/* Standalone Dashboard / Login Pill on Right */}
        <div className="pointer-events-auto flex items-center gap-2">
          <Link 
            href={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : "/login"}
            className="px-5 py-2 text-xs sm:text-sm font-black rounded-full transition-all duration-300 transform hover:scale-105 bg-gray-900 hover:bg-nss-blue text-white shadow-md hover:shadow-lg whitespace-nowrap"
          >
            {isAuthenticated ? 'Dashboard' : 'Login'}
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="lg:hidden p-2 rounded-full bg-white/95 backdrop-blur-xl border border-gray-100 text-gray-900 shadow-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
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
