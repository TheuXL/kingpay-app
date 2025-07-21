import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '../contexts/AppContext';

// Componente para gerenciar o estado de loading e navegação
const AppLayout = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Evita a execução enquanto os dados de autenticação estão carregando.
    if (isLoading) return;

    const inAppGroup = segments[0] === '(app)';

    // Se o usuário está autenticado mas não está no grupo de rotas do app,
    // redireciona para o dashboard.
    if (isAuthenticated && !inAppGroup) {
      router.replace('/dashboard');
    } 
    // Se o usuário não está autenticado mas ainda está no grupo de rotas do app,
    // redireciona para a tela de login.
    else if (!isAuthenticated && inAppGroup) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, segments]);


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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