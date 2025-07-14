import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinkPagamentosList } from '../components/LinkPagamentosList';

export default function LinkPagamentosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleCreateLink = () => {
    router.push("/link-pagamentos/novo" as any);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinkPagamentosList />
      
      <TouchableOpacity 
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
        onPress={handleCreateLink}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fab: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
}); 