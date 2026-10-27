'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppBackButtonHandler() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cleanup: (() => void) | null = null;

    // Dynamically import @capacitor/app so SSR never throws
    import('@capacitor/app')
      .then(({ App }) => {
        const listenerPromise = App.addListener('backButton', () => {
          const currentPath = window.location.pathname;

          // If on an inner page (not home '/')
          if (currentPath !== '/' && currentPath !== '') {
            // Check if there is browser history to go back to
            if (window.history.length > 1) {
              window.history.back();
            } else {
              router.push('/');
            }
          } else {
            // If at the root home page, minimize/exit app cleanly
            App.exitApp();
          }
        });

        cleanup = () => {
          listenerPromise.then(l => l.remove()).catch(() => {});
        };
      })
      .catch(() => {
        // Normal web browser - no-op
      });

    return () => {
      if (cleanup) cleanup();
    };
  }, [router]);

  return null;
}
