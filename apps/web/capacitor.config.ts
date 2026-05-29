import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.typeforge.app',
  appName: 'TypeForge',
  webDir: 'dist/web/browser',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#0d0d0f',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0d0d0f',
    },
  },
};

export default config;
