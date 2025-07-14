import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Divider, Text, useTheme } from 'react-native-paper';
import { InfosAdicionais } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface InfosAdicionaisCardProps {
  data: InfosAdicionais | null;
  isLoading: boolean;
}

export const InfosAdicionaisCard: React.FC<InfosAdicionaisCardProps> = ({
  data,
  isLoading,
}) => {
  const theme = useTheme();

  // Função para determinar a cor do status da fatura
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pago':
        return '#00C853';
      case 'pendente':
        return '#FF9800';
      case 'atrasado':
        return '#F44336';
      default:
        return theme.colors.primary;
    }
  };

  // Função para formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <Card style={styles.card}>
      <Card.Title title="Informações Adicionais" />
      <Card.Content>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingItem} />
            <View style={styles.loadingItem} />
            <View style={styles.loadingItem} />
            <View style={styles.loadingItem} />
          </View>
        ) : data ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fatura Atual</Text>
              <View style={styles.faturaContainer}>
                <View style={styles.faturaInfo}>
                  <Text style={styles.faturaValor}>
                    {formatCurrency(data.fatura_atual.valor)}
                  </Text>
                  <Text style={styles.faturaData}>
                    Vencimento: {formatDate(data.fatura_atual.data_vencimento)}
                  </Text>
                </View>
                <View style={[
                  styles.statusContainer,
                  { backgroundColor: getStatusColor(data.fatura_atual.status) + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(data.fatura_atual.status) }
                  ]}>
                    {data.fatura_atual.status}
                  </Text>
                </View>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Clientes</Text>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name="account-group"
                      size={24}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View>
                    <Text style={styles.infoLabel}>Total de Clientes</Text>
                    <Text style={styles.infoValue}>{data.total_clientes}</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name="account-plus"
                      size={24}
                      color="#00C853"
                    />
                  </View>
                  <View>
                    <Text style={styles.infoLabel}>Novos Clientes</Text>
                    <Text style={styles.infoValue}>{data.novos_clientes}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.retentionContainer}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name="account-check"
                    size={24}
                    color="#FF9800"
                  />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Taxa de Retenção</Text>
                  <Text style={styles.infoValue}>{(data.taxa_retencao * 100).toFixed(1)}%</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.emptyText}>Nenhuma informação adicional disponível</Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  faturaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faturaInfo: {
    flex: 1,
  },
  faturaValor: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  faturaData: {
    fontSize: 12,
    opacity: 0.7,
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  divider: {
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  retentionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    padding: 16,
    opacity: 0.7,
  },
  loadingContainer: {
    padding: 16,
  },
  loadingItem: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 16,
  },
}); 