import { Stack } from 'expo-router';
import React from 'react';

export default function BaasLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'Detalhes do BaaS',
          headerBackTitle: 'Voltar'
        }} 
      />
    </Stack>
  );
} 