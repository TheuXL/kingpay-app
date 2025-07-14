import { Stack } from 'expo-router';
import React from 'react';

export default function WebhookLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="form" options={{ title: 'Gerenciar Webhook' }} />
    </Stack>
  );
} 