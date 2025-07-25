import { formatCurrency } from '@/utils/formatters';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { FinancialSummary } from '../hooks/useWalletData';
import BalanceCard from './BalanceCard';

interface BalanceCarouselProps {
    summary: FinancialSummary | null;
}

const BalanceCarousel: React.FC<BalanceCarouselProps> = ({ summary }) => {
  // Dados com fallback para 0 se o summary for nulo
  const pixBalance = summary?.balance || 0;
  const cardBalance = summary?.balance_card || 0;
  const receivableBalance = summary?.a_receber || 0;
  const reserveBalance = summary?.reserva || 0;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <BalanceCard
        type="pix"
        title="Saldo disponível (Pix)"
        value={formatCurrency(pixBalance)}
        actionText="Solicitar saque"
      />
      <BalanceCard
        type="card"
        title="Saldo disponível (Cartão)"
        value={formatCurrency(cardBalance)}
        actionText="Solicitar saque"
      />
      <BalanceCard
        type="receber"
        title="A receber"
        value={formatCurrency(receivableBalance)}
        actionText="Solicitar antecipação"
      />
      <BalanceCard
        type="reserva"
        title="Reserva Financeira"
        value={formatCurrency(reserveBalance)}
        description="Valor retido para garantir a segurança de suas transações."
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});

export default BalanceCarousel; 