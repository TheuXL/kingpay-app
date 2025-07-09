import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { ScreenLayout } from '@/components/layout/ScreenLayout';

export default function SystemSettingsScreen() {
  return (
    <ScreenLayout>
      <Text variant="headlineMedium" style={styles.title}>
        Configurações do Sistema
      </Text>
      <View style={styles.container}>
        <Text>Conteúdo de Configurações do Sistema</Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 