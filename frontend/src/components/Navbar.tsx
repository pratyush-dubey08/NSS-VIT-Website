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
    { name: 'Activities', path: '/activities' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Leadership', path: '/team' },
    { name: 'Contact', path: '/contact' },
  ];

  const isHome = pathname === '/';
  const isTransparent = isHome && !scrolled;

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="fixed top-0 w-full z-50 pt-6 px-4 pointer-events-none">
      <div className="container mx-auto max-w-7xl">
        <div className={`pointer-events-auto rounded-full transition-all duration-500 flex justify-between items-center px-4 py-2.5 ${
          scrolled || !isHome 
            ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-gray-200/50 border border-gray-100/50' 
            : 'bg-white/40 backdrop-blur-md shadow-lg border border-white/50'
        }`}>
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className={`p-1 rounded-full transition-all duration-500 ${scrolled || !isHome ? 'bg-gray-50' : 'bg-white/60'}`}>
              <img src="/images/nss-logo.png" alt="NSS Logo" className="w-9 h-9 object-contain rounded-full" />
            </div>
            <span className="font-black tracking-tight text-lg hidden lg:block transition-colors duration-500 text-gray-900 drop-shadow-sm">
              NSS Unit, VIT Bhopal University
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className={`hidden md:flex items-center gap-1 p-1 rounded-full border transition-all duration-500 ${
            scrolled || !isHome ? 'bg-gray-50/50 border-gray-100/50' : 'bg-white/30 border-white/40'
          }`}>
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  href={link.path}
                  className={`relative px-4 py-1.5 text-sm font-bold rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'text-white bg-nss-blue shadow-md' 
                      : 'text-gray-800 hover:text-gray-900 hover:bg-white/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action / Auth */}
          <div className="flex items-center gap-3">
            <Link 
              href={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : "/login"}
              className="px-5 py-2 text-sm font-bold rounded-full transition-all duration-300 transform hover:scale-105 bg-gray-900 text-white shadow-lg hover:bg-nss-blue"
            >
              {isAuthenticated ? 'Dashboard' : 'Login'}
            </Link>

            {/* Mobile Nav Toggle */}
            <button 
              className={`md:hidden p-2 rounded-full transition-all ${
                scrolled || !isHome ? 'bg-gray-100 text-gray-900' : 'bg-white/20 text-white'
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 10, scale: 1 }}
            className="absolute top-full left-4 right-4 bg-white/95 backdrop-blur-xl shadow-2xl border border-gray-100 p-4 rounded-3xl md:hidden flex flex-col gap-2 pointer-events-auto origin-top"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`p-4 text-base font-bold rounded-2xl transition-colors ${
                  pathname === link.path ? 'bg-blue-50 text-nss-blue' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </header>
  );
}
