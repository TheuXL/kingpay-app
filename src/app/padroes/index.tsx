import { Stack } from 'expo-router';
import React from 'react';
import PadroesScreen from '../../screens/PadroesScreen';

export default function PadroesRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Padrões do Sistema',
          headerShown: true,
        }}
      />
      <PadroesScreen />
    </>
  );
} 