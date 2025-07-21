/**
 * 🎫 VISUALIZAR TICKET - CHAT DE SUPORTE
 * ======================================
 * 
 * Tela para visualizar um ticket específico com:
 * - Detalhes do ticket
 * - Chat de mensagens
 * - Enviar nova mensagem
 * - Marcar mensagens como lidas
 * - Atualizar status
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../contexts/AppContext';
import {
    SupportTicket,
    TicketMessage,
    supportTicketService
} from '../services/supportTicketService';

export default function TicketDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para nova mensagem
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const loadTicketDetails = async () => {
    if (!id) return;

    try {
      setError(null);
      console.log('🔄 Carregando detalhes do ticket...');
      
      // Carregar ticket e mensagens simultaneamente
      const [ticketResult, messagesResult] = await Promise.allSettled([
        supportTicketService.getTicketById(id),
        supportTicketService.getTicketMessages(id, 1, 50),
      ]);

      if (ticketResult.status === 'fulfilled' && ticketResult.value) {
        setTicket(ticketResult.value || null);
      } else {
        setError('Erro ao carregar ticket');
      }

      if (messagesResult.status === 'fulfilled' && messagesResult.value.messages) {
        setMessages(messagesResult.value.messages || []);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Erro ao carregar ticket:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTicketDetails();
    setRefreshing(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !id) return;

    try {
      setSendingMessage(true);
      console.log('🔄 Enviando mensagem...');

      const result = await supportTicketService.sendMessage({
        ticketId: id,
        message: newMessage.trim(),
      });

      if (result) {
        console.log('✅ Mensagem enviada com sucesso');
        setNewMessage('');
        
        // Recarregar mensagens
        await loadTicketDetails();
      } else {
        Alert.alert('Erro', 'Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      Alert.alert('Erro', 'Erro inesperado ao enviar mensagem');
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    loadTicketDetails();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#10B981';
      case 'in_progress': return '#F59E0B';
      case 'closed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'in_progress': return 'Em Andamento';
      case 'closed': return 'Fechado';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };

  const renderMessage = ({ item }: { item: TicketMessage }) => {
    const isUserMessage = item.userId === user?.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isUserMessage ? styles.userMessage : styles.agentMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isUserMessage ? styles.userBubble : styles.agentBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUserMessage ? styles.userMessageText : styles.agentMessageText
          ]}>
            {item.message}
          </Text>
          
          {item.attachmentUrl && (
            <TouchableOpacity style={styles.attachmentButton}>
              <MaterialCommunityIcons name="attachment" size={16} color="#0052cc" />
              <Text style={styles.attachmentText}>Ver anexo</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={[
          styles.messageInfo,
          isUserMessage ? styles.userMessageInfo : styles.agentMessageInfo
        ]}>
          <Text style={styles.messageTime}>{formatDate(item.createdAt.toString())}</Text>
          {!isUserMessage && (
            <Text style={styles.senderName}>Suporte</Text>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0052cc" />
          <Text style={styles.loadingText}>Carregando conversa...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !ticket) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Erro ao carregar ticket</Text>
          <Text style={styles.errorMessage}>{error || 'Ticket não encontrado'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadTicketDetails}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Ticket #{ticket.id.slice(-8)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
            <Text style={styles.statusText}>{getStatusText(ticket.status)}</Text>
          </View>
        </View>
      </View>

      {/* Detalhes do Ticket */}
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketSubject}>{ticket.subject}</Text>
        <Text style={styles.ticketDate}>
          Criado em {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>

      {/* Lista de Mensagens */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#0052cc"
          />
        }
        showsVerticalScrollIndicator={false}
        inverted={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyMessages}>
            <MaterialCommunityIcons name="chat-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma mensagem ainda</Text>
            <Text style={styles.emptySubtext}>
              Comece a conversa enviando uma mensagem
            </Text>
          </View>
        )}
      />

      {/* Input de Nova Mensagem */}
      {ticket.status !== 'closed' && (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <View style={styles.inputRow}>
            <TextInput
              style={styles.messageInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Digite sua mensagem..."
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!newMessage.trim() || sendingMessage) && styles.sendButtonDisabled
              ]}
              onPress={handleSendMessage}
              disabled={!newMessage.trim() || sendingMessage}
            >
              {sendingMessage ? (
                <MaterialCommunityIcons name="loading" size={20} color="#fff" />
              ) : (
                <MaterialCommunityIcons name="send" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* Ticket Fechado */}
      {ticket.status === 'closed' && (
        <View style={styles.closedNotice}>
          <MaterialCommunityIcons name="lock" size={20} color="#666" />
          <Text style={styles.closedText}>Este ticket foi fechado</Text>
        </View>
      )}
    </SafeAreaView>
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
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0052cc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0052cc',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  ticketHeader: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  ticketSubject: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: 12,
    color: '#666',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  agentMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: '#0052cc',
    borderBottomRightRadius: 4,
  },
  agentBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  agentMessageText: {
    color: '#333',
  },
  messageInfo: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userMessageInfo: {
    justifyContent: 'flex-end',
  },
  agentMessageInfo: {
    justifyContent: 'flex-start',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
  },
  senderName: {
    fontSize: 12,
    color: '#0052cc',
    fontWeight: '600',
    marginRight: 8,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
  },
  attachmentText: {
    fontSize: 12,
    color: '#0052cc',
    marginLeft: 4,
    textDecorationLine: 'underline',
  },
  emptyMessages: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0052cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  closedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  closedText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});
