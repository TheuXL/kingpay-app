/**
 * ⚙️ PAINEL ADMINISTRATIVO
 * ========================
 * 
 * Tela administrativa principal com:
 * - Dashboard administrativo
 * - Listagem de pendências
 * - Navegação para sub-painéis
 * - Estatísticas de aprovações
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../../../contexts/AppContext';
import { anticipationService } from '../../../features/anticipations/services/anticipationService';
import { Anticipation } from '../../../features/anticipations/types';
import { withdrawalService } from '../../../features/withdrawals/services/withdrawalService';
import { Withdrawal } from '../../../features/withdrawals/types';

interface AdminStats {
  pendingWithdrawals: number;
  pendingAnticipations: number;
  pendingPixKeys: number;
  totalWithdrawalsToday: number;
  totalAnticipationsToday: number;
  approvedToday: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAppContext();
  
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAdminStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📊 Carregando estatísticas administrativas...');

      const [withdrawals, anticipations] = await Promise.all([
        withdrawalService.getWithdrawals(),
        anticipationService.getAnticipations()
      ]);

      const pendingWithdrawals = (withdrawals || []).filter((w: Withdrawal) => w.status === 'pending').length;
      const pendingAnticipations = (anticipations || []).filter((a: Anticipation) => a.status === 'pending').length;
      
      // Calcular estatísticas do dia
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const totalWithdrawalsToday = (withdrawals || []).filter((w: Withdrawal) => 
        new Date(w.createdat) >= today
      ).length;
      
      const totalAnticipationsToday = (anticipations || []).filter((a: Anticipation) => 
        new Date(a.created_at) >= today
      ).length;

      const approvedToday = [
        ...(withdrawals || []).filter((w: Withdrawal) => 
          w.status === 'approved' && new Date(w.updatedat || w.createdat) >= today
        ),
        ...(anticipations || []).filter((a: Anticipation) => 
          a.status === 'approved' && new Date(a.updated_at || a.created_at) >= today
        )
      ].length;

      const adminStats: AdminStats = {
        pendingWithdrawals,
        pendingAnticipations,
        pendingPixKeys: 0, // TODO: Implementar quando endpoint estiver disponível
        totalWithdrawalsToday,
        totalAnticipationsToday,
        approvedToday
      };

      setStats(adminStats);
      console.log('✅ Estatísticas administrativas carregadas:', adminStats);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Erro ao carregar estatísticas administrativas:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAdminStats();
    setRefreshing(false);
  };

  useEffect(() => {
    loadAdminStats();
  }, []);

  if (loading && !stats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0052cc" />
          <Text style={styles.loadingText}>Carregando painel administrativo...</Text>
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
        <Text style={styles.headerTitle}>Painel Admin</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <MaterialCommunityIcons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#0052cc"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Warning Card */}
        <View style={styles.warningCard}>
          <MaterialCommunityIcons name="shield-account" size={24} color="#F59E0B" />
          <View style={styles.warningText}>
            <Text style={styles.warningTitle}>Área Restrita</Text>
            <Text style={styles.warningDescription}>
              Este é o painel administrativo. Apenas usuários autorizados podem acessar esta área.
            </Text>
          </View>
        </View>

        {/* Error State */}
        {error && (
          <View style={styles.errorCard}>
            <MaterialCommunityIcons name="alert-circle" size={24} color="#EF4444" />
            <View style={styles.errorText}>
              <Text style={styles.errorTitle}>Erro ao carregar dados</Text>
              <Text style={styles.errorDescription}>{error}</Text>
            </View>
          </View>
        )}

        {/* Estatísticas Principais */}
        <Text style={styles.sectionTitle}>📊 Estatísticas</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.pendingCard]}>
            <MaterialCommunityIcons name="clock-outline" size={32} color="#F59E0B" />
            <Text style={styles.statNumber}>
              {(stats?.pendingWithdrawals || 0) + (stats?.pendingAnticipations || 0)}
            </Text>
            <Text style={styles.statLabel}>Pendências Totais</Text>
          </View>

          <View style={[styles.statCard, styles.successCard]}>
            <MaterialCommunityIcons name="check-circle" size={32} color="#10B981" />
            <Text style={styles.statNumber}>{stats?.approvedToday || 0}</Text>
            <Text style={styles.statLabel}>Aprovadas Hoje</Text>
          </View>

          <View style={[styles.statCard, styles.infoCard]}>
            <MaterialCommunityIcons name="bank-transfer-out" size={32} color="#0052cc" />
            <Text style={styles.statNumber}>{stats?.totalWithdrawalsToday || 0}</Text>
            <Text style={styles.statLabel}>Saques Hoje</Text>
          </View>

          <View style={[styles.statCard, styles.infoCard]}>
            <MaterialCommunityIcons name="fast-forward" size={32} color="#0052cc" />
            <Text style={styles.statNumber}>{stats?.totalAnticipationsToday || 0}</Text>
            <Text style={styles.statLabel}>Antecipações Hoje</Text>
          </View>
        </View>

        {/* Pendências por Categoria */}
        <Text style={styles.sectionTitle}>⏳ Pendências por Categoria</Text>
        <View style={styles.pendingCardsContainer}>
          <TouchableOpacity
            style={[styles.pendingCard, styles.withdrawalsPending]}
            onPress={() => router.push('/(app)/admin/withdrawals')}
          >
            <View style={styles.pendingCardHeader}>
              <MaterialCommunityIcons name="bank-transfer-out" size={32} color="#EF4444" />
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>{stats?.pendingWithdrawals || 0}</Text>
              </View>
            </View>
            <Text style={styles.pendingCardTitle}>Saques Pendentes</Text>
            <Text style={styles.pendingCardDescription}>
              Solicitações de saque aguardando aprovação
            </Text>
            <View style={styles.pendingCardFooter}>
              <Text style={styles.pendingCardAction}>Gerenciar</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pendingCard, styles.anticipationsPending]}
            onPress={() => router.push('/(app)/admin/anticipations')}
          >
            <View style={styles.pendingCardHeader}>
              <MaterialCommunityIcons name="fast-forward" size={32} color="#F59E0B" />
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>{stats?.pendingAnticipations || 0}</Text>
              </View>
            </View>
            <Text style={styles.pendingCardTitle}>Antecipações Pendentes</Text>
            <Text style={styles.pendingCardDescription}>
              Solicitações de antecipação aguardando aprovação
            </Text>
            <View style={styles.pendingCardFooter}>
              <Text style={styles.pendingCardAction}>Gerenciar</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pendingCard, styles.pixKeysPending]}
            onPress={() => router.push('/(app)/admin/pix-keys')}
          >
            <View style={styles.pendingCardHeader}>
              <MaterialCommunityIcons name="key" size={32} color="#8B5CF6" />
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>{stats?.pendingPixKeys || 0}</Text>
              </View>
            </View>
            <Text style={styles.pendingCardTitle}>Chaves PIX Pendentes</Text>
            <Text style={styles.pendingCardDescription}>
              Chaves PIX aguardando validação e aprovação
            </Text>
            <View style={styles.pendingCardFooter}>
              <Text style={styles.pendingCardAction}>Gerenciar</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Ações Rápidas */}
        <Text style={styles.sectionTitle}>⚡ Ações Rápidas</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(app)/admin/users')}
          >
            <MaterialCommunityIcons name="account-group" size={32} color="#0052cc" />
            <Text style={styles.quickActionText}>Usuários</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(app)/admin/companies')}
          >
            <MaterialCommunityIcons name="domain" size={32} color="#0052cc" />
            <Text style={styles.quickActionText}>Empresas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(app)/admin/reports')}
          >
            <MaterialCommunityIcons name="chart-box" size={32} color="#0052cc" />
            <Text style={styles.quickActionText}>Relatórios</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(app)/admin/settings')}
          >
            <MaterialCommunityIcons name="cog" size={32} color="#0052cc" />
            <Text style={styles.quickActionText}>Configurações</Text>
          </TouchableOpacity>
        </View>

        {/* Informações do Sistema */}
        <View style={styles.systemInfoCard}>
          <Text style={styles.systemInfoTitle}>ℹ️ Informações do Sistema</Text>
          <View style={styles.systemInfoGrid}>
            <View style={styles.systemInfoItem}>
              <Text style={styles.systemInfoLabel}>Usuário Admin:</Text>
              <Text style={styles.systemInfoValue}>{user?.email || 'N/A'}</Text>
            </View>
            <View style={styles.systemInfoItem}>
              <Text style={styles.systemInfoLabel}>Última Atualização:</Text>
              <Text style={styles.systemInfoValue}>
                {new Date().toLocaleString('pt-BR')}
              </Text>
            </View>
            <View style={styles.systemInfoItem}>
              <Text style={styles.systemInfoLabel}>Versão:</Text>
              <Text style={styles.systemInfoValue}>1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeaa7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
    marginBottom: 4,
  },
  warningDescription: {
    fontSize: 14,
    color: '#F59E0B',
    lineHeight: 20,
  },
  errorCard: {
    flexDirection: 'row',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    marginLeft: 12,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 4,
  },
  errorDescription: {
    fontSize: 14,
    color: '#EF4444',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pendingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  successCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  infoCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#0052cc',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  pendingCardsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  withdrawalsPending: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  anticipationsPending: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  pixKeysPending: {
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  pendingCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pendingBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  pendingBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pendingCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  pendingCardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  pendingCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingCardAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0052cc',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  quickActionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  systemInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  systemInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  systemInfoGrid: {
    gap: 8,
  },
  systemInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  systemInfoLabel: {
    fontSize: 14,
    color: '#666',
  },
  systemInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
}); 