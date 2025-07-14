import { Stack } from 'expo-router';
import React from 'react';
import LinkPagamentoDetailsScreen from '../../screens/LinkPagamentoDetailsScreen';

export default function LinkPagamentoDetailsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Detalhes do Link',
          headerShown: true,
        }}
      />
      <LinkPagamentoDetailsScreen />
    </>
  );
} 