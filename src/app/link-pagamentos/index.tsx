import { Stack } from 'expo-router';
import React from 'react';
import LinkPagamentosScreen from '../../screens/LinkPagamentosScreen';

export default function LinkPagamentosRoute() {
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