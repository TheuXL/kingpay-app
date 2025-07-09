import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { ScreenLayout } from '@/components/layout/ScreenLayout';

export default function AdminSettingsScreen() {
  return (
    <ScreenLayout>
      <Text variant="headlineMedium" style={styles.title}>
        Configurações de Administrador
      </Text>
      <View style={styles.container}>
        <Text>Conteúdo de Configurações de Administrador</Text>
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