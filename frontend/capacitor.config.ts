import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vitbhopal.nss',
  appName: 'NSS VIT Bhopal',
  webDir: 'app-shell',
  server: {
    url: 'https://nss-vit-website.onrender.com',
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
