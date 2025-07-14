import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUtmFyStore } from '../stores/utmfyStore';
import { UtmFyTracker } from '../types/utmfy';

interface UtmFyTrackerListProps {
  onSelectTracker?: (tracker: UtmFyTracker) => void;
  onAddTracker?: () => void;
  isAdmin?: boolean;
}

export const UtmFyTrackerList: React.FC<UtmFyTrackerListProps> = ({
  onSelectTracker,
  onAddTracker,
  isAdmin = false
}) => {
  const { trackers, loading, error, fetchTrackers, selectTracker, resetError } = useUtmFyStore();

  useEffect(() => {
    fetchTrackers();
    
    return () => {
      resetError();
    };
  }, []);

  const handleSelectTracker = (tracker: UtmFyTracker) => {
    selectTracker(tracker.id || null);
    if (onSelectTracker) {
      onSelectTracker(tracker);
    }
  };

  const renderItem = ({ item }: { item: UtmFyTracker }) => (
    <TouchableOpacity
      style={styles.trackerItem}
      onPress={() => handleSelectTracker(item)}
    >
      <View style={styles.trackerInfo}>
        <Text style={styles.trackerName}>{item.name}</Text>
        <Text style={styles.trackerPlatform}>{item.platform}</Text>
      </View>
      <View style={styles.trackerDetails}>
        <Text style={styles.trackerPixelId}>ID: {item.pixel_id}</Text>
        <Text style={styles.trackerApiKey} numberOfLines={1} ellipsizeMode="middle">
          API Key: {item.api_key}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Carregando rastreadores UTM...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Erro ao carregar rastreadores UTM</Text>
        <Text style={styles.errorDescription}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTrackers}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rastreadores UTM</Text>
        {isAdmin && onAddTracker && (
          <TouchableOpacity style={styles.addButton} onPress={onAddTracker}>
            <Text style={styles.addButtonText}>+ Adicionar</Text>
          </TouchableOpacity>
        )}
      </View>

      {trackers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum rastreador UTM encontrado</Text>
          {isAdmin && onAddTracker && (
            <TouchableOpacity style={styles.addEmptyButton} onPress={onAddTracker}>
              <Text style={styles.addEmptyButtonText}>Adicionar rastreador</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={trackers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id || Math.random().toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  trackerItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007BFF',
  },
  trackerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  trackerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  trackerPlatform: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#e1e1e1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trackerDetails: {
    marginTop: 4,
  },
  trackerPixelId: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  trackerApiKey: {
    fontSize: 14,
    color: '#555',
    opacity: 0.8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 18,
    color: '#ff3b30',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  addEmptyButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addEmptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 