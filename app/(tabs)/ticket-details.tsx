import { ticketService } from '@/services/ticketService';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Divider, Text, TextInput } from 'react-native-paper';

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  attachment_url?: string;
}

export default function TicketDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ticketId = id || '';

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      // Fetch ticket details
      const ticketResponse = await ticketService.getTicket(ticketId);
      if (ticketResponse.success && ticketResponse.data) {
        setTicket(ticketResponse.data);
      } else {
        console.error('Error fetching ticket:', ticketResponse.error);
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do ticket.');
      }

      // Fetch ticket messages
      const messagesResponse = await ticketService.getMessages({
        ticket_id: ticketId,
        page: 1,
        per_page: 50
      });
      if (messagesResponse.success && messagesResponse.data) {
        setMessages(messagesResponse.data);
      } else {
        console.error('Error fetching messages:', messagesResponse.error);
      }

      // Mark messages as read
      await ticketService.markMessagesAsRead(ticketId);
      
    } catch (error) {
      console.error('Error in ticket details:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao carregar os dados do ticket.');
    } finally {
      setLoading(false);
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

    setSendingMessage(true);
    try {
      const response = await ticketService.sendMessage({
        ticket_id: ticketId,
        message: newMessage.trim()
      });

      if (response.success) {
        setNewMessage('');
        fetchTicketDetails(); // Refresh to show the new message
      } else {
        Alert.alert('Erro', 'Não foi possível enviar a mensagem. Tente novamente.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao enviar a mensagem.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleUpdateStatus = async (status: 'open' | 'in_progress' | 'closed') => {
    try {
      const response = await ticketService.updateStatus({
        ticket_id: ticketId,
        status
      });

      if (response.success) {
        // Update local ticket state to reflect the change
        setTicket((prev: Ticket | null) => prev ? { ...prev, status } : null);
        Alert.alert('Sucesso', `Status atualizado para ${getStatusLabel(status)}`);
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar o status do ticket.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar o status do ticket.');
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'in_progress': return 'Em Andamento';
      case 'closed': return 'Fechado';
      default: return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'open': return styles.statusOpen;
      case 'in_progress': return styles.statusInProgress;
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
          title: ticket ? `Ticket: ${ticket.subject}` : 'Detalhes do Ticket',
          headerShown: true,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {ticket ? (
          <>
            <Card style={styles.ticketCard}>
              <Card.Content>
                <Text variant="titleLarge">{ticket.subject}</Text>
                <View style={styles.metaContainer}>
                  <Text variant="bodySmall" style={styles.metaText}>
                    Criado em: {new Date(ticket.created_at).toLocaleString()}
                  </Text>
                  <View style={styles.statusContainer}>
                    <Text
                      style={[
                        styles.statusBadge,
                        getStatusStyle(ticket.status),
                      ]}
                    >
                      {getStatusLabel(ticket.status)}
                    </Text>
                  </View>
                </View>
                <Divider style={styles.divider} />
                <Text variant="bodyMedium">{ticket.message}</Text>
                
                {ticket.attachment_url && (
                  <Text variant="bodySmall" style={styles.attachmentLink}>
                    Anexo: {ticket.attachment_url}
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
                    style={[styles.statusButton, ticket.status === 'open' && styles.activeStatusButton]}
                    labelStyle={ticket.status === 'open' ? styles.activeStatusLabel : {}}
                  >
                    Aberto
                  </Button>
                  <Button 
                    mode="outlined" 
                    onPress={() => handleUpdateStatus('in_progress')}
                    style={[styles.statusButton, ticket.status === 'in_progress' && styles.activeStatusButton]}
                    labelStyle={ticket.status === 'in_progress' ? styles.activeStatusLabel : {}}
                  >
                    Em Andamento
                  </Button>
                  <Button 
                    mode="outlined" 
                    onPress={() => handleUpdateStatus('closed')}
                    style={[styles.statusButton, ticket.status === 'closed' && styles.activeStatusButton]}
                    labelStyle={ticket.status === 'closed' ? styles.activeStatusLabel : {}}
                  >
                    Fechado
                  </Button>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.messagesCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>Mensagens</Text>
                
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
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
                      {index < messages.length - 1 && <Divider style={styles.messageDivider} />}
                    </View>
                  ))
                ) : (
                  <Text style={styles.noMessages}>Nenhuma mensagem disponível.</Text>
                )}
              </Card.Content>
            </Card>

            <Card style={styles.replyCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>Responder</Text>
                <TextInput
                  mode="outlined"
                  label="Sua mensagem"
                  value={newMessage}
                  onChangeText={setNewMessage}
                  multiline
                  numberOfLines={4}
                  style={styles.replyInput}
                />
                <Button
                  mode="contained"
                  onPress={handleSendMessage}
                  loading={sendingMessage}
                  disabled={sendingMessage || !newMessage.trim()}
                  style={styles.sendButton}
                >
                  Enviar Mensagem
                </Button>
              </Card.Content>
            </Card>
          </>
        ) : (
          <Text style={styles.notFound}>Ticket não encontrado ou você não tem permissão para visualizá-lo.</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  ticketCard: {
    margin: 16,
    marginBottom: 8,
  },
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  messagesCard: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  replyCard: {
    margin: 16,
    marginTop: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  metaText: {
    color: '#666',
  },
  divider: {
    marginVertical: 8,
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
  statusClosed: {
    backgroundColor: '#e8f5e9',
    color: '#388e3c',
  },
  attachmentLink: {
    marginTop: 8,
    color: '#1976d2',
  },
  sectionTitle: {
    marginBottom: 12,
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
    marginVertical: 4,
  },
  messageDivider: {
    marginVertical: 12,
  },
  noMessages: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
  },
  replyInput: {
    marginBottom: 16,
  },
  sendButton: {
    marginTop: 8,
  },
  notFound: {
    textAlign: 'center',
    margin: 24,
    fontSize: 16,
    color: '#666',
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statusButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  activeStatusButton: {
    backgroundColor: '#e3f2fd',
  },
  activeStatusLabel: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
}); 