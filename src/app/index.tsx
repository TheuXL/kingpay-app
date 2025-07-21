/**
 * 🚀 APP PRINCIPAL - KINGPAY
 * =========================
 * 
 * Aplicativo principal com navegação integrada
 * seguindo o fluxograma e design apresentados
 */

import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AppContext';

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)/dashboard" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
} 