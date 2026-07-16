'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show global navbar/footer on admin or dashboard portal pages
  const isPortal = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard');

  return (
    <>
      {!isPortal && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!isPortal && <Footer />}
    </>
  );
}
