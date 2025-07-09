import { useAuth } from '@/contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
  const theme = useTheme();
  const { session, loading } = useAuth();

  if (loading) {
    return null; // ou um componente de loading
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.surface,
          },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="companies"
        options={{
          title: 'Empresas',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="domain" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="financial"
        options={{
          title: 'Financeiro',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cash-multiple" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Suporte',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="lifebuoy" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings-menu"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}
      />
      
      {/* Telas adicionais que não aparecem na barra de abas */}
      <Tabs.Screen
        name="ticket-details"
        options={{
          href: null, // Não é acessível diretamente pela URL
          tabBarButton: () => null, // Não mostra na barra de abas
        }}
      />
      <Tabs.Screen
        name="ticket-metrics"
        options={{
          href: null, // Não é acessível diretamente pela URL
          tabBarButton: () => null, // Não mostra na barra de abas
        }}
      />
    </Tabs>
  );
}
