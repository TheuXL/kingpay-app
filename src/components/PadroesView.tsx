import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { usePadroesStore } from '../store/padroesStore';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface PadroesViewProps {
  onEdit?: () => void;
}

export const PadroesView: React.FC<PadroesViewProps> = ({ onEdit }) => {
  const { padroes, loading, error, fetchPadroes, clearError } = usePadroesStore();

  useEffect(() => {
    fetchPadroes();
  }, []);

  const handleRefresh = () => {
    clearError();
    fetchPadroes();
  };

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#d32f2f" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={handleRefresh}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading && !padroes) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Carregando padrões do sistema...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
      }
    >
      {padroes ? (
        <>
          <Card style={styles.card}>
            <Card.Title title="Métodos de Pagamento" />
            <Card.Content>
              {padroes.metodos_pagamento.map((metodo, index) => (
                <View key={metodo.id || index} style={styles.metodoItem}>
                  <View style={styles.metodoHeader}>
                    <Text style={styles.metodoNome}>{metodo.nome}</Text>
                    <View style={[
                      styles.statusBadge,
                      metodo.ativo ? styles.statusActive : styles.statusInactive
                    ]}>
                      <Text style={styles.statusText}>
                        {metodo.ativo ? 'Ativo' : 'Inativo'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.metodoDetails}>
                    <Text style={styles.metodoLabel}>Tipo:</Text>
                    <Text style={styles.metodoValue}>
                      {metodo.tipo === 'pix' ? 'PIX' : 
                       metodo.tipo === 'boleto' ? 'Boleto' : 'Cartão'}
                    </Text>
                  </View>
                  
                  {metodo.taxa_fixa !== undefined && (
                    <View style={styles.metodoDetails}>
                      <Text style={styles.metodoLabel}>Taxa Fixa:</Text>
                      <Text style={styles.metodoValue}>
                        {formatCurrency(metodo.taxa_fixa)}
                      </Text>
                    </View>
                  )}
                  
                  {metodo.taxa_percentual !== undefined && (
                    <View style={styles.metodoDetails}>
                      <Text style={styles.metodoLabel}>Taxa Percentual:</Text>
                      <Text style={styles.metodoValue}>
                        {formatPercent(metodo.taxa_percentual)}
                      </Text>
                    </View>
                  )}
                  
                  {index < padroes.metodos_pagamento.length - 1 && <Divider style={styles.divider} />}
                </View>
              ))}
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title title="Configurações de Antecipação" />
            <Card.Content>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Percentual de Reserva:</Text>
                <Text style={styles.configValue}>
                  {formatPercent(padroes.percentual_reserva_antecipacao)}
                </Text>
              </View>
              
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Dias para Antecipação:</Text>
                <Text style={styles.configValue}>
                  {padroes.dias_antecipacao} {padroes.dias_antecipacao === 1 ? 'dia' : 'dias'}
                </Text>
              </View>
              
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Taxa de Antecipação:</Text>
                <Text style={styles.configValue}>
                  {formatPercent(padroes.taxa_antecipacao)}
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title title="Configurações de Saque" />
            <Card.Content>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Taxa de Saque:</Text>
                <Text style={styles.configValue}>
                  {formatPercent(padroes.taxa_saque)}
                </Text>
              </View>
              
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Valor Mínimo para Saque:</Text>
                <Text style={styles.configValue}>
                  {formatCurrency(padroes.valor_minimo_saque)}
                </Text>
              </View>
              
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Dias para Liberação de Saque:</Text>
                <Text style={styles.configValue}>
                  {padroes.dias_liberacao_saque} {padroes.dias_liberacao_saque === 1 ? 'dia' : 'dias'}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {onEdit && (
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.editButtonText}>Editar Padrões</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Nenhum padrão encontrado.</Text>
          <TouchableOpacity style={styles.button} onPress={handleRefresh}>
            <Text style={styles.buttonText}>Atualizar</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    minHeight: 300,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginVertical: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  metodoItem: {
    marginBottom: 12,
  },
  metodoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metodoNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusActive: {
    backgroundColor: '#e6f7ed',
  },
  statusInactive: {
    backgroundColor: '#f5f5f5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  metodoDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metodoLabel: {
    fontSize: 14,
    color: '#666',
  },
  metodoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    marginVertical: 12,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  configLabel: {
    fontSize: 14,
    color: '#666',
  },
  configValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    borderRadius: 4,
    marginVertical: 16,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
}); 