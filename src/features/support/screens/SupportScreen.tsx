/**
 * 🎫 SUPORTE - SISTEMA DE TICKETS
 * ===============================
 * 
 * Tela principal de suporte com:
 * - Lista de tickets do usuário
 * - Criar novo ticket
 * - Visualizar conversas
 * - Status dos tickets
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../../../contexts/AppContext';
import { supportTicketService } from '../services/supportTicketService';
import { Ticket } from '../types';

export default function SupportScreen() {
  const router = useRouter();
      const { user } = useAppContext();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Carregando tickets...');
      const response = await supportTicketService.getTickets();
      // A resposta agora é o próprio array de tickets ou lança um erro.
      setTickets(response.data || []);
      console.log(`✅ ${response.data?.length || 0} tickets carregados`);
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar tickets');
      console.error('❌ Erro ao carregar tickets:', e);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTickets();
    setRefreshing(false);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#10B981';
      case 'in_progress':
        return '#F59E0B';
      case 'closed':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Aberto';
      case 'in_progress':
        return 'Em Andamento';
      case 'closed':
        return 'Fechado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCreateTicket = () => {
    router.push('/(app)/support/create');
  };

  const handleTicketPress = (ticket: Ticket) => {
    router.push(`/(app)/support/${ticket.id}`);
  };

  const renderTicket = ({ item }: { item: Ticket }) => (
    <TouchableOpacity 
      style={styles.ticketCard}
      onPress={() => handleTicketPress(item)}
    >
      <View style={styles.ticketHeader}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
        <Text style={styles.ticketId}>#{item.id.slice(-6)}</Text>
      </View>
      <View style={styles.ticketContent}>
        <Text style={styles.ticketSubject} numberOfLines={2}>
            {item.subject}
        </Text>
        <Text style={styles.ticketDate}>
            Aberto em: {format(new Date(item.created_at), 'dd/MM/yyyy', { locale: ptBR })}
        </Text>
      </View>
      <View style={styles.ticketFooter}>
        <Text style={styles.footerText}>Ver detalhes</Text>
        <Ionicons name="chevron-forward" size={16} color="#4CAF50" />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0052cc" />
          <Text style={styles.loadingText}>Carregando tickets...</Text>
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
        <Text style={styles.headerTitle}>Suporte</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateTicket}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {error ? (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={48} color="#EF4444" />
            <Text style={styles.errorTitle}>Erro ao carregar tickets</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadTickets}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : tickets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="headset" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Nenhum ticket encontrado</Text>
            <Text style={styles.emptyMessage}>
              Você ainda não criou nenhum ticket de suporte.
            </Text>
            <TouchableOpacity 
              style={styles.createFirstTicketButton}
              onPress={handleCreateTicket}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#fff" />
              <Text style={styles.createFirstTicketText}>Criar Primeiro Ticket</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={tickets}
            renderItem={renderTicket}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                tintColor="#0052cc"
              />
            }
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating Action Button */}
      {tickets.length > 0 && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={handleCreateTicket}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0052cc',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  createButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketInfo: {
    flex: 1,
    marginRight: 12,
  },
  ticketSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: 12,
    color: '#666',
  },
  ticketStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  unreadIndicator: {
    alignSelf: 'center',
  },
  ticketFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  lastMessageText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  createFirstTicketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0052cc',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstTicketText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0052cc',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ticketId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 10,
  },
  ticketContent: {
    marginBottom: 12,
  },
  footerText: {
    fontSize: 14,
    color: '#0052cc',
    fontWeight: '600',
  },
});
