import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { ScreenLayout } from '@/components/layout/ScreenLayout';

export default function AnticipationsScreen() {
  return (
    <ScreenLayout>
      <Text variant="headlineMedium" style={styles.title}>
        Antecipações
      </Text>
      <View style={styles.container}>
        <Text>Conteúdo de Antecipações</Text>
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