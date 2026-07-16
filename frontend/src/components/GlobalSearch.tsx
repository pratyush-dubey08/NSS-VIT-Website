'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command, Activity, Image as ImageIcon, Award, User, Settings, LogIn, ChevronRight, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GlobalSearch() {
 const [isOpen, setIsOpen] = useState(false);
 const [query, setQuery] = useState('');
 const router = useRouter();

 // Search Index (Mocked for now, can be populated dynamically)
 const searchIndex = [
 { id: '1', title: 'Home', type: 'Page', href: '/', icon: BookOpen },
 { id: '2', title: 'Activities', type: 'Page', href: '/activities', icon: Activity },
 { id: '3', title: 'Gallery', type: 'Page', href: '/gallery', icon: ImageIcon },
 { id: '4', title: 'Achievements', type: 'Page', href: '/achievements', icon: Award },
 { id: '5', title: 'About Us', type: 'Page', href: '/about', icon: BookOpen },
 { id: '6', title: 'Login', type: 'Auth', href: '/login', icon: LogIn },
 { id: '7', title: 'Volunteer Dashboard', type: 'Dashboard', href: '/volunteer', icon: User },
 { id: '8', title: 'Admin Dashboard', type: 'Dashboard', href: '/admin', icon: Settings },
 { id: '9', title: 'Blood Donation Camp 2026', type: 'Event', href: '/activities/1', icon: Activity },
 { id: '10', title: 'VIBGYOR Cultural Fest', type: 'Event', href: '/activities/2', icon: Activity },
 { id: '11', title: 'Mega Tree Plantation Drive', type: 'Event', href: '/activities/3', icon: Activity },
 { id: '12', title: 'National Youth Parliament', type: 'Event', href: '/activities/5', icon: Activity },
 ];

 // Keyboard listener for Ctrl+K / Cmd+K
 useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
 e.preventDefault();
 setIsOpen(prev => !prev);
 }
 if (e.key === 'Escape' && isOpen) {
 setIsOpen(false);
 }
 };
 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, [isOpen]);

 const filteredResults = query 
 ? searchIndex.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) || item.type.toLowerCase().includes(query.toLowerCase()))
 : searchIndex.slice(0, 5); // Show top 5 default suggestions

 const handleSelect = (href: string) => {
 setIsOpen(false);
 setQuery('');
 router.push(href);
 };

 return (
 <>
 {/* Modal */}
 <AnimatePresence>
 {isOpen && (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
 onClick={() => setIsOpen(false)}
 >
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: -20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: -20 }}
 onClick={e => e.stopPropagation()}
 className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
 >
 {/* Input */}
 <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
 <Search size={24} className="text-gray-400"/>
 <input 
 type="text"
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 placeholder="Search activities, pages, or tools..."
 autoFocus
 className="flex-1 bg-transparent border-none outline-none text-xl text-gray-900 placeholder-gray-400"
 />
 <button 
 onClick={() => setIsOpen(false)}
 className="p-1.5 text-gray-400 hover:text-gray-900 :text-white hover:bg-gray-100 :bg-gray-800 rounded-lg transition-colors"
 >
 <X size={20} />
 </button>
 </div>

 {/* Results */}
 <div className="max-h-[60vh] overflow-y-auto p-2">
 {filteredResults.length === 0 ? (
 <div className="text-center py-12 text-gray-500">
 <Search size={48} className="mx-auto mb-4 opacity-20"/>
 <p>No results found for"{query}"</p>
 </div>
 ) : (
 <div className="space-y-1">
 {!query && <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Suggested</div>}
 {filteredResults.map((item) => (
 <button
 key={item.id}
 onClick={() => handleSelect(item.href)}
 className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 :bg-gray-800 rounded-xl transition-colors group text-left"
 >
 <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-white :bg-gray-700 flex items-center justify-center text-nss-blue shrink-0 transition-colors shadow-sm">
 <item.icon size={20} />
 </div>
 <div className="flex-1">
 <h4 className="font-bold text-gray-900 group-hover:text-nss-blue transition-colors">{item.title}</h4>
 <p className="text-xs text-gray-500">{item.type}</p>
 </div>
 <ChevronRight size={18} className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-nss-blue transition-all transform group-hover:translate-x-1"/>
 </button>
 ))}
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
 <span>Navigate with <kbd className="px-1.5 py-0.5 rounded border border-gray-300 bg-white font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 rounded border border-gray-300 bg-white font-mono">↓</kbd></span>
 <span>Press <kbd className="px-1.5 py-0.5 rounded border border-gray-300 bg-white font-mono">Esc</kbd> to close</span>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </>
 );
}
