import React from 'react';
import { Stack } from 'expo-router';

export default function CompaniesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          headerShown: false,
          title: 'Nova Empresa',
        }}
      />
      <Stack.Screen
        name="taxes/[id]"
        options={{
          headerShown: false,
          title: 'Taxas da Empresa',
        }}
      />
    </Stack>
  );
} 