'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
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

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 pt-3.5 sm:pt-4 px-3 sm:px-6 pointer-events-none font-sans flex justify-center">
      {/* Centered Modern Floating Island Dock */}
      <div className="pointer-events-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-900/5 border border-slate-200/90 transition-all duration-300 w-full max-w-6xl">
        
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 shadow-xs flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
            <img src="/images/nss-logo.png" alt="NSS Logo" className="w-8 h-8 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 text-sm tracking-tight leading-tight flex items-center gap-1.5">
              NSS Unit
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-50 text-nss-blue rounded-md border border-blue-100/80 hidden sm:inline-block">VIT Bhopal</span>
            </span>
            <span className="text-[11px] font-medium text-slate-400 leading-tight hidden sm:block">Not Me But You</span>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-1.5 flex-1 px-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.name} 
                href={link.path}
                className={`px-2.5 xl:px-3 py-2 text-xs xl:text-[13px] font-bold rounded-xl transition-all duration-200 whitespace-nowrap ${
                  isActive 
                    ? 'text-white bg-slate-900 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Action Button & Mobile Toggle with ample margin */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link 
            href={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : "/login"}
            className="px-4 sm:px-5 py-2 text-xs sm:text-[13px] font-extrabold rounded-xl transition-all duration-300 transform hover:scale-105 bg-nss-blue hover:bg-blue-700 text-white shadow-xs hover:shadow-md whitespace-nowrap flex items-center gap-1.5"
          >
            <span>{isAuthenticated ? 'Dashboard' : 'Login'}</span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button 
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 10, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            className="container mx-auto max-w-md px-4 pointer-events-auto lg:hidden absolute top-full left-0 right-0 mt-1"
          >
            <div className="bg-white/95 backdrop-blur-2xl shadow-2xl border border-slate-200 p-4 rounded-2xl flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`p-3 text-sm font-bold rounded-xl transition-colors flex items-center justify-between ${
                    pathname === link.path ? 'bg-blue-50 text-nss-blue' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.name}</span>
                  {pathname === link.path && <span className="w-2 h-2 rounded-full bg-nss-blue" />}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
