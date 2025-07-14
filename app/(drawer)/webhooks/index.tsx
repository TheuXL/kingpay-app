import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import WebhookListItem from '../../../src/components/webhooks/WebhookListItem';
import { useAuth } from '../../../src/contexts/AuthContext';
import { useWebhookStore } from '../../../src/store/webhookStore';

const WebhooksScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { webhooks, loading, error, fetchWebhooks } = useWebhookStore();

  const loadWebhooks = useCallback(() => {
    if (user?.id) {
      fetchWebhooks(user.id);
    }
  }, [user, fetchWebhooks]);

  useEffect(() => {
    loadWebhooks();
  }, [loadWebhooks]);

  const handleEdit = (webhookId: string) => {
    router.push({ 
      pathname: '/webhooks/form' as any, 
      params: { id: webhookId } 
    });
  };

  const handleAdd = () => {
    router.push('/webhooks/form' as any);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Webhooks</ThemedText>
        <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
          <Ionicons name="add-circle" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.centered}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity onPress={loadWebhooks}>
            <ThemedText style={{ color: '#007AFF' }}>Tentar novamente</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {!error && (
        <FlatList
          data={webhooks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <WebhookListItem webhook={item} onEdit={() => handleEdit(item.id)} />}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.centered}>
                <ThemedText>Nenhum webhook encontrado.</ThemedText>
              </View>
            ) : null
          }
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadWebhooks} />}
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
  addButton: {
    padding: 4,
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

export default WebhooksScreen; 