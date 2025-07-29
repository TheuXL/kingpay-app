import { ArrowRight, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WalletData {
  total_balances?: {
    total_balance?: number;
    total_balance_card?: number;
    total_financial_reserve?: number;
  };
  pending_withdrawals?: {
    pending_withdrawals_count?: number;
    pending_withdrawals_amount?: number;
  };
  pending_anticipations?: {
    pending_anticipations_count?: number;
    pending_anticipations_amount?: number;
  };
}

interface SaldoCardProps {
  balance?: number; // Para compatibilidade com a interface antiga
  data?: WalletData; // Dados completos do endpoint
  isLoading?: boolean;
}

const formatCurrency = (value: number) => {
  return (value / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const SaldoCard: React.FC<SaldoCardProps> = ({ balance, data, isLoading = false }) => {
  
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.backgroundCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Saldo disponível</Text>
          </View>
          <Text style={styles.balance}>Carregando...</Text>
        </View>
      </View>
    );
  }

  // Usar dados do endpoint ou fallback para balance
  const totalBalance = data?.total_balances?.total_balance || balance || 0;
  const cardBalance = data?.total_balances?.total_balance_card || 0;
  const reserveBalance = data?.total_balances?.total_financial_reserve || 0;
  const pendingWithdrawals = data?.pending_withdrawals?.pending_withdrawals_amount || 0;
  const pendingAnticipations = data?.pending_anticipations?.pending_anticipations_amount || 0;

  return (
    <View style={styles.container}>
      <View style={styles.backgroundCard}>
        <View style={styles.header}>
          <Text style={styles.title}>Saldo disponível</Text>
          <TouchableOpacity style={styles.navigationButton}>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.balance}>{formatCurrency(totalBalance)}</Text>
        
        {/* Informações adicionais se dados completos estiverem disponíveis */}
        {data && (
          <View style={styles.additionalInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cartão:</Text>
              <Text style={styles.infoValue}>{formatCurrency(cardBalance)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Reserva:</Text>
              <Text style={styles.infoValue}>{formatCurrency(reserveBalance)}</Text>
            </View>
            {pendingWithdrawals > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Saques pendentes:</Text>
                <Text style={styles.infoValue}>{formatCurrency(pendingWithdrawals)}</Text>
              </View>
            )}
          </View>
        )}
      </View>
      
      <TouchableOpacity style={styles.anticipateButton}>
        <Text style={styles.anticipateButtonText}>Antecipar</Text>
        <ArrowRight size={16} color="#1A1AFF" style={{marginLeft: 8}} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    position: 'relative',
  },
  backgroundCard: {
    backgroundColor: '#1A1AFF', // Fundo azul vibrante
    borderRadius: 16, // Cantos bem arredondados
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)', // Branco com leve transparência
    fontWeight: '400',
  },
  navigationButton: {
    padding: 4,
  },
  balance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  additionalInfo: {
    marginTop: 8,
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  anticipateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    position: 'absolute',
    bottom: -12, // Sobreposto na parte inferior do card
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
  anticipateButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1AFF',
  },
});

export default SaldoCard; 