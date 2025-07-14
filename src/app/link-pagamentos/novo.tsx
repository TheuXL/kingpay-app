import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinkPagamentoForm } from '../../components/LinkPagamentoForm';

export default function NovoLinkPagamentoScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          title: 'Novo Link de Pagamento',
          headerShown: true,
        }}
      />
      <LinkPagamentoForm companyId="ba2e4c35-4df7-43d2-9c9a-d8e605f0caee" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 