import { ticketService } from '@/services/ticketService';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Text } from 'react-native-paper';

interface TicketMetrics {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  closed_tickets: number;
  avg_response_time?: number;
  avg_resolution_time?: number;
  tickets_last_7_days: number;
  tickets_last_30_days: number;
}

export default function TicketMetricsScreen() {
  const [metrics, setMetrics] = useState<TicketMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await ticketService.getMetrics();
      if (response.success && response.data) {
        setMetrics(response.data);
      } else {
        console.error('Error fetching metrics:', response.error);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMetrics();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando métricas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Métricas de Suporte',
          headerShown: true,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {metrics ? (
          <>
            <Card style={styles.card}>
              <Card.Title title="Resumo de Tickets" />
              <Card.Content>
                <View style={styles.metricsRow}>
                  <View style={styles.metricItem}>
                    <Text variant="headlineMedium" style={styles.metricValue}>
                      {metrics.total_tickets || 0}
                    </Text>
                    <Text variant="bodySmall" style={styles.metricLabel}>
                      Total de Tickets
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text variant="headlineMedium" style={styles.metricValue}>
                      {metrics.open_tickets || 0}
                    </Text>
                    <Text variant="bodySmall" style={styles.metricLabel}>
                      Tickets Abertos
                    </Text>
                  </View>
                </View>

                <View style={styles.metricsRow}>
                  <View style={styles.metricItem}>
                    <Text variant="headlineMedium" style={styles.metricValue}>
                      {metrics.in_progress_tickets || 0}
                    </Text>
                    <Text variant="bodySmall" style={styles.metricLabel}>
                      Em Andamento
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text variant="headlineMedium" style={styles.metricValue}>
                      {metrics.closed_tickets || 0}
                    </Text>
                    <Text variant="bodySmall" style={styles.metricLabel}>
                      Tickets Fechados
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Title title="Tempo de Resposta" />
              <Card.Content>
                <View style={styles.metricsRow}>
                  <View style={styles.metricItem}>
                    <Text variant="headlineMedium" style={styles.metricValue}>
                      {metrics.avg_response_time ? `${metrics.avg_response_time}h` : 'N/A'}
                    </Text>
                    <Text variant="bodySmall" style={styles.metricLabel}>
                      Tempo Médio de Resposta
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text variant="headlineMedium" style={styles.metricValue}>
                      {metrics.avg_resolution_time ? `${metrics.avg_resolution_time}h` : 'N/A'}
                    </Text>
                    <Text variant="bodySmall" style={styles.metricLabel}>
                      Tempo Médio de Resolução
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Title title="Atividade Recente" />
              <Card.Content>
                <View style={styles.metricsRow}>
                  <View style={styles.metricItem}>
                    <Text variant="headlineMedium" style={styles.metricValue}>
                      {metrics.tickets_last_7_days || 0}
                    </Text>
                    <Text variant="bodySmall" style={styles.metricLabel}>
                      Tickets nos Últimos 7 Dias
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text variant="headlineMedium" style={styles.metricValue}>
                      {metrics.tickets_last_30_days || 0}
                    </Text>
                    <Text variant="bodySmall" style={styles.metricLabel}>
                      Tickets nos Últimos 30 Dias
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </>
        ) : (
          <Text style={styles.noData}>Nenhuma métrica disponível.</Text>
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
  card: {
    margin: 16,
    marginBottom: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  metricValue: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    textAlign: 'center',
    color: '#666',
  },
  noData: {
    textAlign: 'center',
    margin: 24,
    fontSize: 16,
    color: '#666',
  },
}); 