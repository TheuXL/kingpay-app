import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Text } from 'react-native-paper';

import { useTicketStore } from '@/store/ticketStore';

export default function TicketMetricsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { ticketMetrics, loading, error, fetchMetrics } = useTicketStore();

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMetrics().finally(() => setRefreshing(false));
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
        {ticketMetrics ? (
          <>
            <Card style={styles.card}>
              <Card.Title title="Resumo de Tickets" />
              <Card.Content>
                <View style={styles.metricsRow}>
                  <View style={styles.metricItem}>
                    <Text variant="headlineMedium" style={styles.metricValue}>
                      {ticketMetrics.total_tickets || 0}
                    </Text>
                    <Text variant="bodySmall" style={styles.metricLabel}>
                      Total de Tickets
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text variant="headlineMedium" style={styles.metricValue}>
                      {ticketMetrics.open_tickets || 0}
                    </Text>
                    <Text variant="bodySmall" style={styles.metricLabel}>
                      Tickets Abertos
                    </Text>
                  </View>
                </View>

                <View style={styles.metricsRow}>
                  <View style={styles.metricItem}>
                    <Text variant="headlineMedium" style={styles.metricValue}>
                      {ticketMetrics.in_progress_tickets || 0}
                    </Text>
                    <Text variant="bodySmall" style={styles.metricLabel}>
                      Em Andamento
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text variant="headlineMedium" style={styles.metricValue}>
                      {ticketMetrics.closed_tickets || 0}
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
                      {ticketMetrics.avg_response_time ? `${ticketMetrics.avg_response_time}h` : 'N/A'}
                    </Text>
                    <Text variant="bodySmall" style={styles.metricLabel}>
                      Tempo Médio de Resposta
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text variant="headlineMedium" style={styles.metricValue}>
                      {ticketMetrics.avg_resolution_time ? `${ticketMetrics.avg_resolution_time}h` : 'N/A'}
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
                      {ticketMetrics.tickets_last_7_days || 0}
                    </Text>
                    <Text variant="bodySmall" style={styles.metricLabel}>
                      Tickets nos Últimos 7 Dias
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text variant="headlineMedium" style={styles.metricValue}>
                      {ticketMetrics.tickets_last_30_days || 0}
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
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error || 'Não foi possível carregar as métricas.'}
            </Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 24,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
}); 