import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BaasListItem from '../../../src/components/baas/BaasListItem';
import { useBaasStore } from '../../../src/store/baasStore';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const BaasScreen = () => {
  const { baasList, loading, error, fetchAllBaas } = useBaasStore();

  const loadBaasList = useCallback(() => {
    fetchAllBaas();
  }, [fetchAllBaas]);

  useFocusEffect(
    useCallback(() => {
      loadBaasList();
    }, [loadBaasList])
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Banking as a Service (BaaS)</ThemedText>
      </View>

      {error && (
        <View style={styles.centered}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity onPress={loadBaasList}>
            <ThemedText style={{ color: '#007AFF' }}>Tentar novamente</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {!error && (
        <FlatList
          data={baasList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BaasListItem baas={item} />}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.centered}>
                <ThemedText>Nenhum provedor BaaS encontrado.</ThemedText>
              </View>
            ) : null
          }
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadBaasList} />}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 10,
  },
  listContent: {
    flexGrow: 1,
  },
});

export default BaasScreen; 