import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Badge, Card, IconButton, Text } from 'react-native-paper';

import { AppButton } from '@/components/common/AppButton';
import { AppTextInput } from '@/components/common/AppTextInput';
import { ticketService } from '@/services/ticketService';

export default function SupportScreen() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    fetchTickets();
    checkUnreadMessages();
  }, []);

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const response = await ticketService.getTickets();
      if (response.success) {
        setTickets(response.data || []);
      } else {
        console.error('Error fetching tickets:', response.error);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoadingTickets(false);
      setRefreshing(false);
    }
  };

  const checkUnreadMessages = async () => {
    try {
      const response = await ticketService.checkUnreadMessages();
      if (response.success) {
        setHasUnreadMessages(response.data?.has_unread || false);
      }
    } catch (error) {
      console.error('Error checking unread messages:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTickets();
    checkUnreadMessages();
  };

  const handleCreateTicket = async () => {
    if (!subject || !message) {
      Alert.alert('Erro', 'Por favor, preencha o assunto e a mensagem.');
      return;
    }

    setLoading(true);
    try {
      const response = await ticketService.createTicket({
        subject,
        message,
        attachment_url: attachmentUrl || undefined,
      });

      if (response.success) {
        Alert.alert('Sucesso', 'Ticket criado com sucesso!');
        setSubject('');
        setMessage('');
        setAttachmentUrl('');
        fetchTickets(); // Atualizar a lista de tickets
      } else {
        Alert.alert('Erro', 'Não foi possível criar o ticket. Tente novamente.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao criar o ticket.');
      console.error('Create ticket error:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToTicketDetails = (ticketId: string) => {
    // @ts-ignore - Ignorar erro de tipagem aqui
    router.navigate('ticket-details', { id: ticketId });
  };

  const navigateToMetrics = () => {
    // @ts-ignore - Ignorar erro de tipagem aqui
    router.navigate('ticket-metrics');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Suporte',
          headerShown: true,
          headerRight: () => (
            hasUnreadMessages ? (
              <Badge style={styles.unreadBadge}>!</Badge>
            ) : null
          ),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Card style={styles.card}>
          <Card.Title title="Novo Ticket de Suporte" />
          <Card.Content>
            <AppTextInput
              label="Assunto"
              value={subject}
              onChangeText={setSubject}
              placeholder="Digite o assunto do ticket"
            />
            <AppTextInput
              label="Mensagem"
              value={message}
              onChangeText={setMessage}
              placeholder="Descreva seu problema ou solicitação"
              multiline
              numberOfLines={4}
              style={styles.messageInput}
            />
            <AppTextInput
              label="URL do Anexo (opcional)"
              value={attachmentUrl}
              onChangeText={setAttachmentUrl}
              placeholder="https://exemplo.com/imagem.jpg"
            />
            <AppButton
              mode="contained"
              onPress={handleCreateTicket}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
            >
              Enviar Ticket
            </AppButton>
          </Card.Content>
        </Card>

        <View style={styles.ticketsSection}>
          <View style={styles.ticketsHeader}>
            <Text variant="titleLarge" style={styles.ticketsTitle}>
              Seus Tickets
            </Text>
            <IconButton
              icon="chart-bar"
              mode="contained"
              onPress={navigateToMetrics}
              iconColor="#fff"
              containerColor="#2196F3"
              size={20}
            />
          </View>

          {loadingTickets && !refreshing ? (
            <ActivityIndicator style={styles.loader} />
          ) : tickets.length > 0 ? (
            tickets.map((ticket, index) => (
              <TouchableOpacity 
                key={ticket.id || index} 
                onPress={() => navigateToTicketDetails(ticket.id)}
                activeOpacity={0.7}
              >
                <Card style={styles.ticketCard}>
                  <Card.Content>
                    <View style={styles.ticketHeader}>
                      <Text variant="titleMedium">{ticket.subject}</Text>
                      {ticket.has_unread_messages && (
                        <Badge style={styles.unreadBadge}>Novo</Badge>
                      )}
                    </View>
                    <Text variant="bodyMedium" style={styles.ticketMessage} numberOfLines={2}>
                      {ticket.message}
                    </Text>
                    <Text variant="bodySmall" style={styles.ticketDate}>
                      {new Date(ticket.created_at).toLocaleString()}
                    </Text>
                    <View style={styles.statusContainer}>
                      <Text
                        style={[
                          styles.statusBadge,
                          ticket.status === 'open'
                            ? styles.statusOpen
                            : ticket.status === 'in_progress'
                            ? styles.statusInProgress
                            : styles.statusClosed,
                        ]}
                      >
                        {ticket.status === 'open'
                          ? 'Aberto'
                          : ticket.status === 'in_progress'
                          ? 'Em Andamento'
                          : 'Fechado'}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noTickets}>Você ainda não possui tickets.</Text>
          )}
        </View>
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
  card: {
    margin: 16,
    elevation: 4,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 16,
  },
  ticketsSection: {
    padding: 16,
  },
  ticketsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ticketsTitle: {
    flex: 1,
  },
  ticketCard: {
    marginBottom: 12,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketMessage: {
    marginTop: 8,
    marginBottom: 8,
  },
  ticketDate: {
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
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
  loader: {
    marginTop: 20,
  },
  noTickets: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#f44336',
  },
}); 