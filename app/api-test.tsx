import { Stack } from 'expo-router';
import React from 'react';
import ApiTest from '../src/screens/tests/ApiTest';

export default function ApiTestScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Teste de API',
        }}
      />
      <ApiTest />
    </>
  );
} 