import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View, useColorScheme } from 'react-native';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { AppCard } from '../../components/common/AppCard';
import { ScreenLayout } from '../../components/layout/ScreenLayout';
import { useAuth } from '../../contexts/AuthContext';
import { customTheme } from '../../theme/theme';

// Types for stats
interface DashboardStats {
  totalTransactions: number;
  totalVolume: number;
  totalPaid: number;
  totalPending: number;
  totalRefused: number;
  totalRefunded: number;
}

// Mock data
const mockStats: DashboardStats = {
  totalTransactions: 2458,
  totalVolume: 354789.56,
  totalPaid: 1982,
  totalPending: 247,
  totalRefused: 156,
  totalRefunded: 73,
};

const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch this data from your API
      // const response = await dashboardService.getStats();
      // setStats(response.data);
      
      // Using mock data for now
      setTimeout(() => {
        setStats(mockStats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardStats();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <ScreenLayout>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.headerContainer}>
          <ThemedText type="title">Dashboard</ThemedText>
          <ThemedText type="body" style={styles.welcomeText}>
            Bem-vindo, {user?.name || 'Usuário'}!
          </ThemedText>
        </View>

        <View style={styles.statsContainer}>
          {/* Summary Cards */}
          <View style={styles.cardRow}>
            <AppCard style={styles.card}>
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
                  <Ionicons name="swap-horizontal" size={24} color={customTheme.colors.primary} />
                </View>
                <ThemedText type="caption">Total de Transações</ThemedText>
                <ThemedText type="title">
                  {loading ? '...' : stats?.totalTransactions.toLocaleString()}
                </ThemedText>
              </View>
            </AppCard>
            
            <AppCard style={styles.card}>
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
                  <Ionicons name="cash-outline" size={24} color={customTheme.colors.success} />
                </View>
                <ThemedText type="caption">Volume Total</ThemedText>
                <ThemedText type="title">
                  {loading ? '...' : formatCurrency(stats?.totalVolume || 0)}
                </ThemedText>
              </View>
            </AppCard>
          </View>

          <View style={styles.cardRow}>
            <AppCard style={styles.card}>
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 149, 0, 0.1)' }]}>
                  <Ionicons name="time-outline" size={24} color="#FF9500" />
                </View>
                <ThemedText type="caption">Pendentes</ThemedText>
                <ThemedText type="title">
                  {loading ? '...' : stats?.totalPending.toLocaleString()}
                </ThemedText>
              </View>
            </AppCard>
            
            <AppCard style={styles.card}>
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 59, 48, 0.1)' }]}>
                  <Ionicons name="close-circle-outline" size={24} color={customTheme.colors.danger} />
                </View>
                <ThemedText type="caption">Recusadas</ThemedText>
                <ThemedText type="title">
                  {loading ? '...' : stats?.totalRefused.toLocaleString()}
                </ThemedText>
              </View>
            </AppCard>
          </View>
        </View>

        <ThemedView variant="card" style={styles.chartContainer}>
          <ThemedText type="subtitle">Estatísticas</ThemedText>
          <ThemedText type="body">
            Esta é uma versão simplificada do dashboard. Em uma versão completa, aqui seria exibido um gráfico com as transações ao longo do tempo.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    paddingTop: 24,
  },
  welcomeText: {
    marginTop: 4,
  },
  statsContainer: {
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  chartContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
});

export default DashboardScreen; 