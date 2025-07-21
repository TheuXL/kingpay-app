/**
 * 🌐 COMPONENTE DE STATUS DE CONECTIVIDADE
 * =======================================
 * 
 * Mostra o status da conectividade com Edge Functions
 * e oferece opções de retry quando há problemas
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ConnectivityStatusProps {
  isConnected: boolean;
  isLoading: boolean;
  error?: string | null;
  onRetry: () => void;
  componentName?: string;
}

export const ConnectivityStatus: React.FC<ConnectivityStatusProps> = ({
  isConnected,
  isLoading,
  error,
  onRetry,
  componentName = 'dados'
}) => {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    await onRetry();
    setRetrying(false);
  };

  if (isConnected && !error) {
    return (
      <View style={styles.statusConnected}>
        <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
        <Text style={styles.statusTextConnected}>
          ✅ Conectado aos serviços
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.statusLoading}>
        <ActivityIndicator size="small" color="#F59E0B" />
        <Text style={styles.statusTextLoading}>
          🔄 Carregando {componentName}...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.statusDisconnected}>
      <View style={styles.errorHeader}>
        <MaterialCommunityIcons name="alert-circle" size={20} color="#EF4444" />
        <Text style={styles.statusTextDisconnected}>
          ❌ Serviços indisponíveis
        </Text>
      </View>
      
      <Text style={styles.errorMessage}>
        Os Edge Functions do Supabase estão temporariamente indisponíveis.
      </Text>
      
      {error && (
        <Text style={styles.errorDetails}>
          Erro: {error}
        </Text>
      )}
      
      <TouchableOpacity
        style={styles.retryButton}
        onPress={handleRetry}
        disabled={retrying}
      >
        {retrying ? (
          <ActivityIndicator size="small" color="#0052cc" />
        ) : (
          <MaterialCommunityIcons name="refresh" size={16} color="#0052cc" />
        )}
        <Text style={styles.retryButtonText}>
          {retrying ? 'Tentando...' : 'Tentar novamente'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.retryButton, styles.diagnosticButton]}
        onPress={() => {
          // Navegação para tela de diagnóstico
          // Nota: Implementar quando roteamento estiver configurado
          console.log('🔍 Navegar para tela de diagnóstico');
        }}
      >
        <MaterialCommunityIcons name="stethoscope" size={16} color="#6B7280" />
        <Text style={[styles.retryButtonText, styles.diagnosticButtonText]}>
          Executar diagnóstico
        </Text>
      </TouchableOpacity>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>📊 O que você pode fazer:</Text>
        <Text style={styles.infoItem}>• Verificar sua conexão com a internet</Text>
        <Text style={styles.infoItem}>• Aguardar alguns minutos e tentar novamente</Text>
        <Text style={styles.infoItem}>• Executar diagnóstico para mais detalhes</Text>
        <Text style={styles.infoItem}>• Contactar o suporte se o problema persistir</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statusConnected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98120',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  statusTextConnected: {
    marginLeft: 8,
    color: '#10B981',
    fontWeight: '500',
  },
  statusLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  statusTextLoading: {
    marginLeft: 8,
    color: '#F59E0B',
    fontWeight: '500',
  },
  statusDisconnected: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTextDisconnected: {
    marginLeft: 8,
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorMessage: {
    color: '#7F1D1D',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  errorDetails: {
    color: '#991B1B',
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: '#FEE2E2',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0052cc',
    marginBottom: 12,
  },
  retryButtonText: {
    marginLeft: 8,
    color: '#0052cc',
    fontWeight: '500',
  },
  diagnosticButton: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
    marginTop: 8,
  },
  diagnosticButtonText: {
    color: '#6B7280',
  },
  infoSection: {
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F1D1D',
    marginBottom: 8,
  },
  infoItem: {
    fontSize: 13,
    color: '#991B1B',
    marginBottom: 4,
    paddingLeft: 8,
  },
});

export default ConnectivityStatus; 