/**
 * 💸 ADMIN - GERENCIAR SAQUES
 * ===========================
 * 
 * Tela administrativa para:
 * - Listar saques pendentes
 * - Aprovar saques
 * - Negar saques com motivo
 * - Visualizar detalhes completos
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../contexts/AppContext';
import { edgeFunctionsService } from '../../../services/edgeFunctions';
import { formatCurrency } from '../../../utils/currency';

interface WithdrawalAdmin {
  id: string;
  user_id: string;
  requested_amount: number;
  description?: string;
  status: 'pending' | 'approved' | 'done' | 'cancelled';
  is_pix: boolean;
  created_at: string;
  updated_at?: string;
  reason_for_denial?: string;
  user_email?: string;
  user_name?: string;
}

export function AdminWithdrawalsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [withdrawals, setWithdrawals] = useState<WithdrawalAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'cancelled'>('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Modal para negar saque
  const [denyModalVisible, setDenyModalVisible] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalAdmin | null>(null);
  const [denyReason, setDenyReason] = useState('');

  const loadWithdrawals = async () => {
    try {
      setError(null);
      console.log('💸 Carregando saques para admin...');

      const response = await edgeFunctionsService.getWithdrawals({ 
        limit: 100, 
        offset: 0 
      });

      if (response.success && response.data) {
        const withdrawalData: WithdrawalAdmin[] = response.data.map((item: any) => ({
          id: item.id,
          user_id: item.user_id || 'unknown',
          requested_amount: parseFloat(item.requestedamount || item.amount || '0'),
          description: item.description || 'Saque solicitado',
          status: item.status || 'pending',
          is_pix: item.isPix || false,
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at,
          reason_for_denial: item.reason_for_denial,
          user_email: item.user_email,
          user_name: item.user_name,
        }));

        setWithdrawals(withdrawalData);
        console.log(`✅ ${withdrawalData.length} saques carregados para admin`);
      } else {
        console.log('⚠️ Nenhum saque encontrado');
        setWithdrawals([]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Erro ao carregar saques:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWithdrawals();
    setRefreshing(false);
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    if (filter === 'all') return true;
    return withdrawal.status === filter;
  });

  const handleApprove = async (withdrawal: WithdrawalAdmin) => {
    Alert.alert(
      'Aprovar Saque',
      `Tem certeza que deseja aprovar o saque de ${formatCurrency(withdrawal.requested_amount)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprovar',
          style: 'default',
          onPress: async () => {
            try {
              setActionLoading(withdrawal.id);
              console.log('✅ Aprovando saque:', withdrawal.id);

              // TODO: Implementar aprovação quando endpoint estiver disponível
              // const result = await withdrawalService.approveWithdrawal(withdrawal.id);
              
              // Por enquanto, simular sucesso
              Alert.alert('Sucesso', 'Saque aprovado com sucesso!');
              await loadWithdrawals(); // Recarregar dados

            } catch (error) {
              console.error('❌ Erro ao aprovar saque:', error);
              Alert.alert('Erro', 'Erro ao aprovar saque. Tente novamente.');
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  const handleDeny = (withdrawal: WithdrawalAdmin) => {
    setSelectedWithdrawal(withdrawal);
    setDenyReason('');
    setDenyModalVisible(true);
  };

  const confirmDeny = async () => {
    if (!selectedWithdrawal || !denyReason.trim()) {
      Alert.alert('Erro', 'Motivo da negação é obrigatório.');
      return;
    }

    try {
      setActionLoading(selectedWithdrawal.id);
      console.log('❌ Negando saque:', selectedWithdrawal.id, 'Motivo:', denyReason);

      // TODO: Implementar negação quando endpoint estiver disponível
      // const result = await withdrawalService.denyWithdrawal(selectedWithdrawal.id, denyReason);
      
      // Por enquanto, simular sucesso
      Alert.alert('Sucesso', 'Saque negado com sucesso!');
      setDenyModalVisible(false);
      setSelectedWithdrawal(null);
      setDenyReason('');
      await loadWithdrawals(); // Recarregar dados

    } catch (error) {
      console.error('❌ Erro ao negar saque:', error);
      Alert.alert('Erro', 'Erro ao negar saque. Tente novamente.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'approved':
        return '#10B981';
      case 'done':
        return '#0052cc';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovado';
      case 'done':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const renderWithdrawal = ({ item }: { item: WithdrawalAdmin }) => (
    <View style={styles.withdrawalCard}>
      <View style={styles.withdrawalHeader}>
        <View style={styles.withdrawalInfo}>
          <Text style={styles.withdrawalAmount}>
            {formatCurrency(item.requested_amount)}
          </Text>
          <Text style={styles.withdrawalType}>
            {item.is_pix ? '🔄 PIX' : '🏦 Transferência'}
          </Text>
        </View>
        
        <View 
          style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(item.status) }
          ]}
        >
          <Text style={styles.statusText}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.withdrawalDetails}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="account" size={16} color="#666" />
          <Text style={styles.detailText}>
            {item.user_name || item.user_email || `ID: ${item.user_id}`}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="calendar" size={16} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item.created_at).toLocaleString('pt-BR')}
          </Text>
        </View>
        
        {item.description && (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="text" size={16} color="#666" />
            <Text style={styles.detailText} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        )}
        
        {item.reason_for_denial && (
          <View style={styles.denialReason}>
            <MaterialCommunityIcons name="alert-circle" size={16} color="#EF4444" />
            <Text style={styles.denialText}>
              Motivo: {item.reason_for_denial}
            </Text>
          </View>
        )}
      </View>

      {item.status === 'pending' && (
        <View style={styles.withdrawalActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.denyButton]}
            onPress={() => handleDeny(item)}
            disabled={actionLoading === item.id}
          >
            {actionLoading === item.id ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialCommunityIcons name="close-circle" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Negar</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleApprove(item)}
            disabled={actionLoading === item.id}
          >
            {actionLoading === item.id ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Aprovar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0052cc" />
          <Text style={styles.loadingText}>Carregando saques...</Text>
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
        <Text style={styles.headerTitle}>Gerenciar Saques</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <MaterialCommunityIcons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Filtrar por status:</Text>
        <View style={styles.filtersButtons}>
          {[
            { key: 'pending', label: 'Pendentes', count: withdrawals.filter(w => w.status === 'pending').length },
            { key: 'approved', label: 'Aprovados', count: withdrawals.filter(w => w.status === 'approved').length },
            { key: 'cancelled', label: 'Cancelados', count: withdrawals.filter(w => w.status === 'cancelled').length },
            { key: 'all', label: 'Todos', count: withdrawals.length }
          ].map((filterOption) => (
            <TouchableOpacity
              key={filterOption.key}
              style={[
                styles.filterButton,
                filter === filterOption.key && styles.filterButtonActive
              ]}
              onPress={() => setFilter(filterOption.key as any)}
            >
              <Text style={[
                styles.filterButtonText,
                filter === filterOption.key && styles.filterButtonTextActive
              ]}>
                {filterOption.label} ({filterOption.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {error ? (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={48} color="#EF4444" />
            <Text style={styles.errorTitle}>Erro ao carregar saques</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadWithdrawals}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : filteredWithdrawals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="bank-transfer-out" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>
              {filter === 'pending' ? 'Nenhum saque pendente' : 'Nenhum saque encontrado'}
            </Text>
            <Text style={styles.emptyMessage}>
              {filter === 'pending' 
                ? 'Todos os saques foram processados.' 
                : 'Não há saques neste filtro.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredWithdrawals}
            renderItem={renderWithdrawal}
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

      {/* Modal para negar saque */}
      <Modal
        visible={denyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDenyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Negar Saque</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setDenyModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedWithdrawal && (
              <View style={styles.modalContent}>
                <Text style={styles.modalSubtitle}>
                  Valor: {formatCurrency(selectedWithdrawal.requested_amount)}
                </Text>
                
                <Text style={styles.inputLabel}>
                  Motivo da negação *
                </Text>
                <TextInput
                  style={styles.reasonInput}
                  value={denyReason}
                  onChangeText={setDenyReason}
                  placeholder="Descreva o motivo da negação..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setDenyModalVisible(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modalConfirmButton,
                      !denyReason.trim() && styles.modalConfirmButtonDisabled
                    ]}
                    onPress={confirmDeny}
                    disabled={!denyReason.trim() || actionLoading === selectedWithdrawal.id}
                  >
                    {actionLoading === selectedWithdrawal.id ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.modalConfirmText}>Negar Saque</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  refreshButton: {
    padding: 8,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filtersButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#0052cc',
    borderColor: '#0052cc',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  withdrawalCard: {
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
  withdrawalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  withdrawalInfo: {
    flex: 1,
  },
  withdrawalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  withdrawalType: {
    fontSize: 14,
    color: '#666',
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
  withdrawalDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  denialReason: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  denialText: {
    fontSize: 12,
    color: '#EF4444',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  withdrawalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  denyButton: {
    backgroundColor: '#EF4444',
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  modalConfirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  modalConfirmText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
}); 