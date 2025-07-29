import { UserDataProvider } from '@/contexts/UserDataContext';
import BottomTabBar from '@/navigation/BottomTabBar';
import { Tabs } from 'expo-router';
import React from 'react';

export default function AppLayout() {
  return (
    <UserDataProvider>
      <Tabs
        tabBar={() => <BottomTabBar />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen 
          name="index" 
          options={{ href: null }} // Rota principal, controlada pelo BottomTabBar
        />
        <Tabs.Screen 
          name="jornada" 
          options={{ href: null }} // Oculta da tab bar padrão
        />
        <Tabs.Screen 
          name="conta" 
          options={{ href: null }} // Oculta da tab bar padrão
        />
        
        {/* Telas que não estão na tab bar principal */}
        <Tabs.Screen name="dashboard" options={{ href: null }} />
        <Tabs.Screen name="carteira" />
        <Tabs.Screen name="links/index" options={{ href: null }} />
        {/* Adicionar outras rotas que não devem aparecer na tab bar */}
      </Tabs>
    </UserDataProvider>
  );
} 