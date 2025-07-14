import React from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useWebhookStore } from '../../store/webhookStore';
import { Webhook } from '../../types/webhook';

interface WebhookListItemProps {
  webhook: Webhook;
  onEdit: () => void;
}

const WebhookListItem: React.FC<WebhookListItemProps> = ({ webhook, onEdit }) => {
  const { removeWebhook, loading } = useWebhookStore();

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o webhook para "${webhook.url}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => removeWebhook(webhook.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onEdit} style={styles.infoContainer}>
        <Text style={styles.url} numberOfLines={1}>{webhook.url}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: webhook.active ? '#4cd964' : '#ff3b30' }]} />
          <Text style={styles.statusText}>{webhook.active ? 'Ativo' : 'Inativo'}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.actionsContainer}>
        <Button title="Editar" onPress={onEdit} />
        <View style={styles.buttonSpacer} />
        <Button title="Excluir" onPress={handleDelete} color="#ff3b30" disabled={loading} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginRight: 16,
  },
  url: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#555',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonSpacer: {
    width: 8,
  }
});

export default WebhookListItem; 