'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AppBackButtonHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Natural Left-Edge Swipe Back (works on all mobile screens inside installed app)
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 1 && startX < 50) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = endX - startX;
        const diffY = Math.abs(endY - startY);

        // Swipe right from left edge (>65px)
        if (diffX > 65 && diffX > diffY * 1.4) {
          if (window.location.pathname !== '/' && window.location.pathname !== '') {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              router.push('/');
            }
          }
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // 2. Android physical / hardware Back key interception (Keycode 4 / GoBack / Escape)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'GoBack' ||
        e.key === 'Back' ||
        e.key === 'BrowserBack' ||
        e.key === 'Escape' ||
        e.keyCode === 4 ||
        e.keyCode === 27
      ) {
        if (window.location.pathname !== '/' && window.location.pathname !== '') {
          e.preventDefault();
          e.stopPropagation();
          if (window.history.length > 1) {
            window.history.back();
          } else {
            router.push('/');
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });

    // 3. Cordova & Capacitor native document backbutton bridge event
    const handleBackButtonEvent = (e: any) => {
      if (window.location.pathname !== '/' && window.location.pathname !== '') {
        if (e && typeof e.preventDefault === 'function') {
          e.preventDefault();
        }
        if (window.history.length > 1) {
          window.history.back();
        } else {
          router.push('/');
        }
      }
    };
    document.addEventListener('backbutton', handleBackButtonEvent, false);
    document.addEventListener('ionBackButton', handleBackButtonEvent, false);

    // 4. Capacitor native plugin listener (if available)
    let cleanupCapacitor: (() => void) | null = null;
    import('@capacitor/app')
      .then(({ App }) => {
        const p = App.addListener('backButton', () => {
          if (window.location.pathname !== '/' && window.location.pathname !== '') {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              router.push('/');
            }
          } else {
            App.exitApp();
          }
        });
        cleanupCapacitor = () => {
          p.then(l => l.remove()).catch(() => {});
        };
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('backbutton', handleBackButtonEvent);
      document.removeEventListener('ionBackButton', handleBackButtonEvent);
      if (cleanupCapacitor) cleanupCapacitor();
    };
  }, [router, pathname]);

  return null;
}
