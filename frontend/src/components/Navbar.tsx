'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronRight, Info, Compass, Target, HeartHandshake, ShieldCheck, UserCheck, Smartphone, Download } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const aboutDropdownLinks = [
  { name: 'Who Are We?', path: '/about#who-we-are', desc: 'About NSS Unit VIT Bhopal' },
  { name: 'The Essence of NSS', path: '/about#essence', desc: 'Motto, Symbol & Heritage' },
  { name: 'Mission & Vision', path: '/about#mission-vision', desc: 'Purpose & Future Direction' },
  { name: 'What We Do?', path: '/about#what-we-do', desc: 'Key Initiatives & Community Drives' },
  { name: 'Guiding Values', path: '/about#core-values', desc: 'Foundational NSS Principles' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { isAuthenticated, user } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setAboutDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setAboutDropdownOpen(false);
    }, 200);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    // About is handled as a dropdown
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
    <header className="fixed top-0 left-0 right-0 w-full z-50 pt-3 sm:pt-4 px-3 sm:px-6 pointer-events-none font-sans flex justify-center">
      <div className="pointer-events-auto flex items-center justify-between gap-2 xl:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-900/5 border border-slate-200/90 transition-all duration-300 w-full max-w-7xl box-border">
        
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center gap-2.5 xl:gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs ring-1 ring-red-500/30 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
            <img src="/images/nss-logo.png" alt="NSS Logo" className="w-8 h-8 object-contain" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-black text-slate-900 text-lg sm:text-xl xl:text-2xl tracking-tight leading-none">
              NSS Unit
            </span>
            <span className="text-[11px] sm:text-xs xl:text-[13px] font-bold text-slate-500 tracking-wide leading-none mt-1">
              VIT Bhopal University
            </span>
          </div>
        </Link>

        {/* Center: Nav Links with About Dropdown */}
        <nav className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1.5 flex-1 min-w-0 px-1 xl:px-2">
          {/* Home Link */}
          <Link 
            href="/"
            className={`px-2.5 xl:px-3.5 py-1.5 text-[13px] xl:text-[14px] font-bold rounded-xl transition-all duration-200 whitespace-nowrap ${
              pathname === '/' 
                ? 'text-white bg-gradient-to-r from-nss-blue to-blue-900 shadow-sm' 
                : 'text-slate-700 hover:text-nss-blue hover:bg-blue-50/60'
            }`}
          >
            Home
          </Link>

          {/* About Dropdown */}
          <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href="/about"
              className={`px-2.5 xl:px-3.5 py-1.5 text-[13px] xl:text-[14px] font-bold rounded-xl transition-all duration-200 whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                pathname === '/about' || aboutDropdownOpen
                  ? 'text-white bg-gradient-to-r from-nss-blue to-blue-900 shadow-sm' 
                  : 'text-slate-700 hover:text-nss-blue hover:bg-blue-50/60'
              }`}
            >
              <span>About</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
            </Link>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {aboutDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2.5 z-50"
                >
                  <div className="space-y-1">
                    {aboutDropdownLinks.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        onClick={() => setAboutDropdownOpen(false)}
                        className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors block group"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black text-gray-900 group-hover:text-nss-blue transition-colors">
                            {item.name}
                          </p>
                          <ChevronRight size={12} className="text-gray-400 group-hover:text-nss-blue group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                          {item.desc}
                        </p>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Remaining Nav Links */}
          {navLinks.slice(1).map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.name} 
                href={link.path}
                className={`px-2.5 xl:px-3.5 py-1.5 text-[13px] xl:text-[14px] font-bold rounded-xl transition-all duration-200 whitespace-nowrap ${
                  isActive 
                    ? 'text-white bg-gradient-to-r from-nss-blue to-blue-900 shadow-sm' 
                    : 'text-slate-700 hover:text-nss-blue hover:bg-blue-50/60'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Dashboard / Login Button */}
        <div className="flex items-center gap-2 xl:gap-2.5 shrink-0 pr-0.5">
          <Link 
            href={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : "/login"}
            className="px-4 xl:px-5 py-2 text-xs xl:text-sm font-extrabold rounded-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-nss-blue to-blue-900 hover:from-blue-900 hover:to-nss-red text-white shadow-md shadow-blue-950/20 hover:shadow-lg whitespace-nowrap flex items-center gap-1.5"
          >
            <span>{isAuthenticated ? 'Dashboard' : 'Login'}</span>
          </Link>

          {/* Mobile Hamburger */}
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
            className="container mx-auto max-w-md px-4 pointer-events-auto lg:hidden absolute top-full left-0 right-0 mt-2"
          >
            <div className="bg-white/95 backdrop-blur-2xl shadow-2xl border border-slate-200 p-4 rounded-2xl flex flex-col gap-1.5 max-h-[80vh] overflow-y-auto">
              <Link 
                href="/"
                onClick={() => setIsOpen(false)}
                className={`p-3 text-sm font-bold rounded-xl transition-colors ${pathname === '/' ? 'bg-blue-50 text-nss-blue' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                Home
              </Link>

              {/* Mobile About Accordion */}
              <div>
                <button
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  className="w-full p-3 text-sm font-bold rounded-xl transition-colors flex items-center justify-between text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <span>About Us</span>
                  <ChevronDown size={16} className={`transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileAboutOpen && (
                  <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50/80 rounded-xl mt-1">
                    {aboutDropdownLinks.map(sub => (
                      <Link
                        key={sub.name}
                        href={sub.path}
                        onClick={() => { setIsOpen(false); setMobileAboutOpen(false); }}
                        className="block p-2 text-xs font-bold text-gray-700 hover:text-nss-blue rounded-lg"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

                            {/* Mobile App Download Button */}
              <a
                href="/downloads/nss-vit-bhopal.apk" download="nss-vit-bhopal.apk" target="_blank" rel="noopener noreferrer">
                <div className="flex items-center gap-2">
                  <Smartphone size={16} />
                  <span>Download NSS Unit App (.apk)</span>
                </div>
                <Download size={15} />
              </a>

              {navLinks.slice(1).map((link) => (
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
