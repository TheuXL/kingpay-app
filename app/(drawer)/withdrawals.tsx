import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { ScreenLayout } from '@/components/layout/ScreenLayout';

export default function WithdrawalsScreen() {
  return (
    <ScreenLayout>
      <Text variant="headlineMedium" style={styles.title}>
        Saques
      </Text>
      <View style={styles.container}>
        <Text>Conteúdo de Saques</Text>
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