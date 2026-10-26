import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vitbhopal.nss',
  appName: 'NSS VIT',
  webDir: 'app-shell',
  server: {
    url: 'https://nssunitvit.vercel.app',
    cleartext: true,
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    backgroundColor: '#0A192F'
  }
};

export default config;
