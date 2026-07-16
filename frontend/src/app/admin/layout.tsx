'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
 LayoutDashboard, 
 CalendarDays, 
 Users,
 Settings,
 LogOut, 
 Menu,
 X,
 FileSpreadsheet
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 const router = useRouter();
 const { user, logout } = useAuthStore();
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

 // Note: Add logic to redirect if not admin
 // useEffect(() => {
 // if (!isAuthorized(['SUPER_ADMIN', 'PROGRAM_OFFICER', 'EVENT_MANAGER'])) {
 // router.push('/dashboard');
 // }
 // }, []);

 const navItems = [
 { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
 { name: 'Manage Activities', path: '/admin/activities', icon: CalendarDays },
 { name: 'Volunteers', path: '/admin/volunteers', icon: Users },
 { name: 'Resources', path: '/admin/resources', icon: FileSpreadsheet },
 { name: 'Settings', path: '/admin/settings', icon: Settings },
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
 fixed lg:static inset-y-0 left-0 z-50 bg-gray-900 text-white border-r border-gray-800
 transform transition-all duration-300 ease-in-out
 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
 ${sidebarCollapsed ? 'w-20' : 'w-64'}
 flex flex-col
 `}>
        <div className={`flex items-center p-6 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!sidebarCollapsed && (
            <Link href="/"className="flex items-center gap-3">
              <img src="/images/nss-logo.png"alt="NSS Logo"className="w-8 h-8 object-contain rounded-full bg-white p-0.5"/>
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-sm leading-tight text-white whitespace-nowrap">NSS Unit</span>
                <span className="font-medium text-[10px] text-gray-400 whitespace-nowrap">VIT Bhopal University</span>
              </div>
            </Link>
          )}
          <button className="hidden lg:block text-gray-400 hover:text-white" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <Menu size={20} />
          </button>
          <button className="lg:hidden text-gray-400"onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className={`flex-1 space-y-2 mt-4 ${sidebarCollapsed ? 'px-3' : 'px-4'}`}>
          {navItems.map((item) => {
            const isActive = item.path === '/admin' ? pathname === '/admin' : pathname.startsWith(item.path);
            return (
              <Link key={item.name} href={item.path} onClick={() => setSidebarOpen(false)}>
                <div className={`
                  flex items-center gap-3 py-3 rounded-xl transition-colors
                  ${sidebarCollapsed ? 'justify-center px-0' : 'px-4'}
                  ${isActive 
                    ? 'bg-white/10 text-white shadow-md' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }
                `}>
                  <item.icon size={18} />
                  {!sidebarCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 border-t border-gray-800 ${sidebarCollapsed ? 'flex flex-col items-center px-2' : ''}`}>
          <div className={`flex items-center gap-3 py-3 bg-gray-800 rounded-xl mb-4 ${sidebarCollapsed ? 'justify-center w-full px-0' : 'px-4'}`}>
            <div className="w-10 h-10 rounded-full bg-nss-blue text-white flex items-center justify-center font-bold shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.role?.replace('_', ' ')}</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            className={`flex items-center gap-3 py-3 text-red-400 hover:bg-red-900/30 rounded-xl transition-colors ${sidebarCollapsed ? 'justify-center w-full px-0' : 'w-full px-4'}`}
          >
            <LogOut size={18} />
            {!sidebarCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
 </aside>

 {/* Main Content */}
 <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
 {/* Mobile Header */}
 <header className="lg:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-30">
 <Link href="/admin"className="flex items-center gap-3">
 <img src="/images/nss-logo.png"alt="NSS Logo"className="w-8 h-8 object-contain rounded-full bg-white p-0.5 shadow-sm"/>
 <span className="font-bold text-gray-900">Admin Portal</span>
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
