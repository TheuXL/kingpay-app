import { ClienteDetailsScreen } from '@/src/screens/ClienteDetailsScreen';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function ClienteDetailsPage() {
  const params = useLocalSearchParams();
  const { clienteId } = params;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Detalhes do Cliente',
          headerShown: false,
        }}
      />
      <ClienteDetailsScreen />
    </>
  );
} 