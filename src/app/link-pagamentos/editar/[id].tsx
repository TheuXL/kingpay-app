import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinkPagamentoForm } from '../../../components/LinkPagamentoForm';
import { useLinkPagamentosStore } from '../../../store/linkPagamentosStore';

export default function EditarLinkPagamentoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  
  const { 
    linkPagamentoAtual, 
    loading, 
    error, 
    fetchLinkPagamentoById 
  } = useLinkPagamentosStore();

  useEffect(() => {
    if (id) {
      fetchLinkPagamentoById(id);
    }
  }, [id]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          title: 'Editar Link de Pagamento',
          headerShown: true,
        }}
      />
      
      {loading && !linkPagamentoAtual ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Carregando dados do link...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <LinkPagamentoForm 
          linkPagamento={linkPagamentoAtual} 
          isEditing={true} 
          companyId="ba2e4c35-4df7-43d2-9c9a-d8e605f0caee"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
}); 