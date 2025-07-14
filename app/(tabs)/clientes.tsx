import { ClientesScreen } from '@/src/screens/ClientesScreen';
import { Stack } from 'expo-router';
import React from 'react';

export default function ClientesPage() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Clientes',
          headerShown: false,
        }}
      />
      <ClientesScreen />
    </>
  );
} 