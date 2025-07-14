import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

export default function AcquirersRedirect() {
  useEffect(() => {
    // Redirect to the new acquirers index screen
    router.replace({
      pathname: '/(drawer)/acquirers' as any
    });
  }, []);

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Redirecionando...</Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 16,
  },
}); 