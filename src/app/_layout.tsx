import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '../contexts/AppContext';

// Componente para gerenciar o estado de loading e navegação
const AppLayout = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Evita a execução enquanto os dados de autenticação estão carregando.
    if (isLoading) {
      console.log('⏳ Aguardando carregamento da autenticação...');
      return;
    }

    const inAppGroup = segments[0] === '(app)';
    const inAuthGroup = segments[0] === '(auth)';

    console.log('🧭 Navegação:', {
      isAuthenticated,
      inAppGroup,
      inAuthGroup,
      currentSegment: segments[0]
    });

    // Se o usuário está autenticado mas não está no grupo de rotas do app,
    // redireciona para o dashboard.
    if (isAuthenticated && !inAppGroup) {
      console.log('✅ Usuário autenticado - redirecionando para app');
      router.replace('/(app)');
    } 
    // Se o usuário não está autenticado mas ainda está no grupo de rotas do app,
    // redireciona para a tela de login.
    else if (!isAuthenticated && inAppGroup) {
      console.log('❌ Usuário não autenticado - redirecionando para login');
      router.replace('/login');
    }
    // Se o usuário não está autenticado e não está no grupo de auth,
    // redireciona para login
    else if (!isAuthenticated && !inAuthGroup) {
      console.log('❌ Usuário não autenticado - redirecionando para login');
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, segments]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return null; // Ou um componente de loading
  }

  // O Stack é renderizado incondicionalmente. O useEffect cuida do redirecionamento.
  // Isso evita que a árvore de componentes seja desmontada e remontada.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StatusBar style="light" />
        <AppLayout />
      </AuthProvider>
    </GestureHandlerRootView>
  );
} 