'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
 LayoutDashboard, 
 CalendarCheck, 
 Award, 
 User, 
 LogOut, 
 Menu,
 X,
 FileText
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 const { user, logout } = useAuthStore();
 const [sidebarOpen, setSidebarOpen] = useState(false);

 const navItems = [
 { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
 { name: 'My Activities', path: '/dashboard/activities', icon: CalendarCheck },
 { name: 'Resources', path: '/dashboard/resources', icon: FileText },
 { name: 'Profile', path: '/dashboard/profile', icon: User },
 ];

 return (
 <div className="min-h-screen bg-gray-50 flex">
 
 {/* Mobile Sidebar Overlay */}
 {sidebarOpen && (
 <div 
 className="fixed inset-0 bg-black/50 z-40 lg:hidden"
 onClick={() => setSidebarOpen(false)}
 />
 )}

 {/* Sidebar */}
 <aside className={`
 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 
 transform transition-transform duration-300 ease-in-out
 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
 flex flex-col
 `}>
 <div className="p-6 flex items-center justify-between">
 <Link href="/"className="flex items-center gap-3">
 <img src="/images/nss-logo.png"alt="NSS Logo"className="w-8 h-8 object-contain rounded-full bg-white p-0.5 shadow-sm"/>
 <span className="font-bold text-gray-900">Volunteer Portal</span>
 </Link>
 <button className="lg:hidden text-gray-500"onClick={() => setSidebarOpen(false)}>
 <X size={20} />
 </button>
 </div>

 <nav className="flex-1 px-4 space-y-2 mt-4">
 {navItems.map((item) => {
 const isActive = pathname === item.path;
 return (
 <Link key={item.name} href={item.path} onClick={() => setSidebarOpen(false)}>
 <div className={`
 flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
 ${isActive 
 ? 'bg-nss-blue text-white shadow-md' 
 : 'text-gray-600 hover:bg-gray-50 :bg-gray-700'
 }
 `}>
 <item.icon size={18} />
 <span className="font-medium text-sm">{item.name}</span>
 </div>
 </Link>
 );
 })}
 </nav>

 <div className="p-4 border-t border-gray-100">
 <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl mb-4">
 <div className="w-10 h-10 rounded-full bg-nss-red text-white flex items-center justify-center font-bold shrink-0">
 {user?.name?.charAt(0) || 'U'}
 </div>
 <div className="overflow-hidden">
 <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
 <p className="text-xs text-gray-500 truncate">{user?.registrationNumber}</p>
 </div>
 </div>
 <button 
 onClick={() => {
 logout();
 window.location.href = '/login';
 }}
 className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 :bg-red-900/20 rounded-xl transition-colors"
 >
 <LogOut size={18} />
 <span className="font-medium text-sm">Logout</span>
 </button>
 </div>
 </aside>

 {/* Main Content */}
 <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
 {/* Mobile Header */}
 <header className="lg:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-30">
 <Link href="/"className="flex items-center gap-2">
 <img src="/images/nss-logo.png"alt="NSS Logo"className="w-8 h-8 object-contain rounded-full bg-white p-0.5 shadow-sm"/>
 </Link>
 <button onClick={() => setSidebarOpen(true)} className="text-gray-600 p-2 bg-gray-50 rounded-lg">
 <Menu size={20} />
 </button>
 </header>

 <div className="flex-1 p-6 lg:p-8">
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.3 }}
 >
 {children}
 </motion.div>
 </div>
 </main>

 </div>
 );
}
