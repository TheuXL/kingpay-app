import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Divider, Text, TextInput } from 'react-native-paper';

import { useTicketStore } from '@/store/ticketStore';
import { TicketStatus } from '@/types/ticket';

export default function TicketDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ticketId = id || '';

  const [newMessage, setNewMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    selectedTicket, 
    ticketMessages, 
    loading, 
    error, 
    fetchTicket, 
    fetchMessages, 
    markAsRead, 
    sendMessage, 
    updateStatus 
  } = useTicketStore();

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      // Fetch ticket details
      await fetchTicket(ticketId);
      
      // Fetch ticket messages
      await fetchMessages(ticketId);
      
      // Mark messages as read
      await markAsRead(ticketId);
    } catch (err) {
      console.error('Error in ticket details:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTicketDetails();
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      Alert.alert('Erro', 'Por favor, digite uma mensagem.');
      return;
    }

    const success = await sendMessage({
      ticket_id: ticketId,
      message: newMessage.trim()
    });

    if (success) {
      setNewMessage('');
    } else {
      Alert.alert('Erro', error || 'Não foi possível enviar a mensagem. Tente novamente.');
    }
  };

  const handleUpdateStatus = async (status: TicketStatus) => {
    const success = await updateStatus({
      ticket_id: ticketId,
      status
    });

    if (success) {
      Alert.alert('Sucesso', `Status atualizado para ${getStatusLabel(status)}`);
    } else {
      Alert.alert('Erro', error || 'Não foi possível atualizar o status do ticket.');
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'in_progress': return 'Em Andamento';
      case 'resolved': return 'Resolvido';
      case 'closed': return 'Fechado';
      default: return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'open': return styles.statusOpen;
      case 'in_progress': return styles.statusInProgress;
      case 'resolved': return styles.statusResolved;
      case 'closed': return styles.statusClosed;
      default: return {};
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando detalhes do ticket...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: selectedTicket ? `Ticket: ${selectedTicket.subject}` : 'Detalhes do Ticket',
          headerShown: true,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {selectedTicket ? (
          <>
            <Card style={styles.ticketCard}>
              <Card.Content>
                <Text variant="titleLarge">{selectedTicket.subject}</Text>
                <View style={styles.metaContainer}>
                  <Text variant="bodySmall" style={styles.metaText}>
                    Criado em: {new Date(selectedTicket.created_at).toLocaleString()}
                  </Text>
                  <View style={styles.statusContainer}>
                    <Text
                      style={[
                        styles.statusBadge,
                        getStatusStyle(selectedTicket.status),
                      ]}
                    >
                      {getStatusLabel(selectedTicket.status)}
                    </Text>
                  </View>
                </View>
                <Divider style={styles.divider} />
                <Text variant="bodyMedium">{selectedTicket.message}</Text>
                
                {selectedTicket.attachment_url && (
                  <Text variant="bodySmall" style={styles.attachmentLink}>
                    Anexo: {selectedTicket.attachment_url}
                  </Text>
                )}
              </Card.Content>
            </Card>

            <Card style={styles.actionsCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>Atualizar Status</Text>
                <View style={styles.statusButtonsContainer}>
                  <Button 
                    mode="outlined" 
                    onPress={() => handleUpdateStatus('open')}
                    style={[styles.statusButton, selectedTicket.status === 'open' && styles.activeStatusButton]}
                    labelStyle={selectedTicket.status === 'open' ? styles.activeStatusLabel : {}}
                  >
                    Aberto
                  </Button>
                  <Button 
                    mode="outlined" 
                    onPress={() => handleUpdateStatus('in_progress')}
                    style={[styles.statusButton, selectedTicket.status === 'in_progress' && styles.activeStatusButton]}
                    labelStyle={selectedTicket.status === 'in_progress' ? styles.activeStatusLabel : {}}
                  >
                    Em Andamento
                  </Button>
                  <Button 
                    mode="outlined" 
                    onPress={() => handleUpdateStatus('resolved')}
                    style={[styles.statusButton, selectedTicket.status === 'resolved' && styles.activeStatusButton]}
                    labelStyle={selectedTicket.status === 'resolved' ? styles.activeStatusLabel : {}}
                  >
                    Resolvido
                  </Button>
                  <Button 
                    mode="outlined" 
                    onPress={() => handleUpdateStatus('closed')}
                    style={[styles.statusButton, selectedTicket.status === 'closed' && styles.activeStatusButton]}
                    labelStyle={selectedTicket.status === 'closed' ? styles.activeStatusLabel : {}}
                  >
                    Fechado
                  </Button>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.messagesCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>Mensagens</Text>
                
                {ticketMessages.length > 0 ? (
                  ticketMessages.map((msg, index) => (
                    <View key={msg.id || index} style={styles.messageItem}>
                      <View style={styles.messageHeader}>
                        <Text variant="bodySmall" style={styles.messageAuthor}>
                          {msg.is_from_support ? 'Suporte' : 'Você'}
                        </Text>
                        <Text variant="bodySmall" style={styles.messageDate}>
                          {new Date(msg.created_at).toLocaleString()}
                        </Text>
                      </View>
                      <Text variant="bodyMedium" style={styles.messageContent}>
                        {msg.message}
                      </Text>
                      {msg.attachment_url && (
                        <Text variant="bodySmall" style={styles.attachmentLink}>
                          Anexo: {msg.attachment_url}
                        </Text>
                      )}
                      {index < ticketMessages.length - 1 && <Divider style={styles.messageDivider} />}
                    </View>
                  ))
                ) : (
                  <Text style={styles.noMessages}>Nenhuma mensagem encontrada.</Text>
                )}
              </Card.Content>
            </Card>

            <Card style={styles.replyCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>Responder</Text>
                <TextInput
                  mode="outlined"
                  value={newMessage}
                  onChangeText={setNewMessage}
                  placeholder="Digite sua mensagem..."
                  multiline
                  numberOfLines={3}
                  style={styles.replyInput}
                />
                <Button
                  mode="contained"
                  onPress={handleSendMessage}
                  loading={loading}
                  disabled={loading || !newMessage.trim()}
                  style={styles.sendButton}
                >
                  Enviar Mensagem
                </Button>
              </Card.Content>
            </Card>
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error || 'Não foi possível carregar os detalhes do ticket.'}
            </Text>
            <Button mode="contained" onPress={handleRefresh}>
              Tentar Novamente
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  ticketCard: {
    margin: 16,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  metaText: {
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusOpen: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
  },
  statusInProgress: {
    backgroundColor: '#fff8e1',
    color: '#ff8f00',
  },
  statusResolved: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  statusClosed: {
    backgroundColor: '#f5f5f5',
    color: '#616161',
  },
  divider: {
    marginVertical: 12,
  },
  attachmentLink: {
    color: '#1976d2',
    marginTop: 8,
  },
  actionsCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusButton: {
    marginBottom: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  activeStatusButton: {
    backgroundColor: '#e3f2fd',
  },
  activeStatusLabel: {
    color: '#1976d2',
  },
  messagesCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  messageItem: {
    marginBottom: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  messageAuthor: {
    fontWeight: 'bold',
  },
  messageDate: {
    color: '#666',
  },
  messageContent: {
    marginBottom: 4,
  },
  messageDivider: {
    marginTop: 8,
    marginBottom: 8,
  },
  noMessages: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  replyCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  replyInput: {
    marginBottom: 12,
  },
  sendButton: {
    alignSelf: 'flex-end',
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 16,
    textAlign: 'center',
  },
}); 