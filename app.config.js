import 'dotenv/config';

export default {
  expo: {
    name: "KingPay",
    slug: "kingpay-app",
    scheme: "kingpay-app",
    version: "1.0.0",
    orientation: "portrait",
    // icon: "./assets/icon.png", // Placeholder para o ícone
    userInterfaceStyle: "light",
    splash: {
      // image: "./assets/splash.png", // Placeholder para a splash screen
      resizeMode: "contain",
      backgroundColor: "#0052cc"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.kingpay.app",
      buildNumber: "1" // Adicionado build number para iOS
    },
    android: {
      adaptiveIcon: {
        // foregroundImage: "./assets/adaptive-icon.png", // Placeholder para o ícone adaptativo
        backgroundColor: "#0052cc"
      },
      package: "com.kingpay.app",
      versionCode: 1, // Adicionado version code para Android
      permissions: [
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.DETECT_SCREEN_CAPTURE"
      ]
    },
    web: {
      bundler: "metro"
    },
    plugins: [
      [
        "expo-router",
        {
          origin: false
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "3235b4c7-d538-45d3-842b-232012c81775"
      },
      // Configuração do Supabase
      SUPABASE_URL: process.env.SUPABASE_URL || 'https://slsikrvjbpblioyinsxu.supabase.co',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsc2lrcnZqYnBibGlveWluc3h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNjgwNjksImV4cCI6MjA2Mzg0NDA2OX0.WqkSEVq2FgPXupHKbXcm04H3CJ2VHj7M8a7EUELw7OQ',
      
      // Configuração do app
      APP_NAME: process.env.APP_NAME || 'KINGPAY',
      APP_DESCRIPTION: process.env.APP_DESCRIPTION || 'Gerencie suas finanças com facilidade',
      NODE_ENV: process.env.NODE_ENV || 'development',
    }
  }
}; 