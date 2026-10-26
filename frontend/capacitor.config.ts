import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vitbhopal.nss',
  appName: 'NSS VIT',
  webDir: 'app-shell',
  server: {
    url: 'https://nssunitvit.vercel.app',
    cleartext: true,
    androidScheme: 'https',
    allowNavigation: [
      'nssunitvit.vercel.app',
      'accounts.google.com',
      '*.google.com',
      '*.googleusercontent.com'
    ]
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    backgroundColor: '#0A192F',
    overrideUserAgent: 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
  }
};

export default config;
