import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0052cc', // Cor principal do app
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index" // Tela Home
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-variant" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard" // Tela de Dashboard
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="financial" // Tela da Carteira
        options={{
          title: 'Carteira',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="links" // Tela de Links de Pagamento
        options={{
          title: 'Links',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="link-variant" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings" // Tela de Configurações
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />

      {/* Telas que não são abas, mas fazem parte da navegação de tabs */}
      <Tabs.Screen name="transactions" options={{ href: null }} />
      <Tabs.Screen name="movements" options={{ href: null }} />

    </Tabs>
  );
} 