import { Stack } from 'expo-router';
import React from 'react';
import LinkPagamentosScreen from '../../src/screens/LinkPagamentosScreen';

export default function LinkPagamentosTab() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Links de Pagamento',
          headerShown: true,
        }}
      />
      <LinkPagamentosScreen />
    </>
  );
} 