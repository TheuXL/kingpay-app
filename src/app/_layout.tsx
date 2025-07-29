import { AppProvider, useAppContext } from '@/contexts/AppContext';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Adicione suas fontes aqui se tiver
    // 'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router usa Error Boundaries para capturar erros na fase de renderização.
  // Você pode querer usar um componente de erro personalizado aqui.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      <AppProvider>
        <RootLayoutNav />
      </AppProvider>
  );
}

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAppContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Aguarda o fim do carregamento

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (isAuthenticated && inAuthGroup) {
      // Se autenticado mas ainda na área de auth, redireciona para o app
      router.replace('/(app)');
    } else if (!isAuthenticated && !inAuthGroup) {
       // Se não estiver autenticado e não estiver na área de auth, redireciona para o login
       router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return null; // ou um componente de loading global
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(app)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
} 