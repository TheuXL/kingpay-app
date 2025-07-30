import { Stack } from 'expo-router';
import React from 'react';

export default function TransactionsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }}
      />
      {/* Futuras telas de detalhes ou criação podem ser adicionadas aqui */}
      {/* Ex: <Stack.Screen name="[id]" options={{ title: 'Detalhes da Transação' }} /> */}
    </Stack>
  );
} 