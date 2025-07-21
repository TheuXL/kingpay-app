import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0052cc',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitle: 'Voltar',
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          headerShown: false,
          title: 'Login'
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          title: 'Criar Conta',
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          title: 'Recuperar Senha',
          presentation: 'modal'
        }} 
      />
    </Stack>
  );
} 