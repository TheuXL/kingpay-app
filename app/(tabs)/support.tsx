import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Badge, Card, IconButton, Text } from 'react-native-paper';

import { AppButton } from '@/components/common/AppButton';
import { AppTextInput } from '@/components/common/AppTextInput';
import { useTicketStore } from '@/store/ticketStore';

export default function SupportScreen() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    tickets, 
    unreadTickets, 
    loading, 
    error, 
    fetchTickets, 
    fetchUnreadMessages, 
    createTicket 
  } = useTicketStore();

  useEffect(() => {
    fetchTickets();
    fetchUnreadMessages();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([fetchTickets(), fetchUnreadMessages()])
      .finally(() => setRefreshing(false));
  };

  const handleCreateTicket = async () => {
    if (!subject || !message) {
      Alert.alert('Erro', 'Por favor, preencha o assunto e a mensagem.');
      return;
    }

    const ticketId = await createTicket({
      subject,
      message,
      attachment_url: attachmentUrl || undefined,
    });

    if (ticketId) {
      Alert.alert('Sucesso', 'Ticket criado com sucesso!');
      setSubject('');
      setMessage('');
      setAttachmentUrl('');
    } else {
      Alert.alert('Erro', error || 'Não foi possível criar o ticket. Tente novamente.');
    }
  };

  const navigateToTicketDetails = (ticketId: string) => {
    router.push({
      pathname: '/ticket-details',
      params: { id: ticketId }
    } as any);
  };

  const navigateToMetrics = () => {
    router.push('/ticket-metrics' as any);
  };

  const hasUnreadMessages = unreadTickets.length > 0;

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

          {loading && !refreshing ? (
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
                      {unreadTickets.some(t => t.id === ticket.id) && (
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