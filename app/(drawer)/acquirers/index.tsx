import React, { useEffect } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { AcquirerListItem } from '@/components/acquirers/AcquirerListItem';
import { useAcquirersStore } from '@/store/acquirersStore';
import { Acquirer } from '@/types/acquirers';

export default function AcquirersScreen() {
  const { acquirers, isLoading, error, fetchAcquirers } = useAcquirersStore();

  useEffect(() => {
    fetchAcquirers();
  }, [fetchAcquirers]);

  const handleRefresh = () => {
    fetchAcquirers();
  };

  const renderItem = ({ item }: { item: Acquirer }) => (
    <AcquirerListItem acquirer={item} />
  );

  return (
    <ScreenLayout>
      <Text variant="headlineMedium" style={styles.title}>
        Adquirentes
      </Text>

      {isLoading && acquirers.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text variant="bodyLarge" style={styles.errorText}>
            {error}
          </Text>
          <Button mode="contained" onPress={handleRefresh} style={styles.retryButton}>
            Tentar Novamente
          </Button>
        </View>
      ) : acquirers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge">Nenhuma adquirente encontrada.</Text>
          <Button mode="contained" onPress={handleRefresh} style={styles.refreshButton}>
            Atualizar
          </Button>
        </View>
      ) : (
        <FlatList
          data={acquirers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={isLoading}
          onRefresh={handleRefresh}
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#B00020',
  },
  retryButton: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    marginTop: 16,
  },
}); 