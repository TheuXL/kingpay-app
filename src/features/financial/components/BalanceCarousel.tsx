import { formatCurrency } from '@/utils/formatters';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import BalanceCard from './BalanceCard';

// A interface deve corresponder à estrutura de dados do hook
interface FinancialSummary {
  total_balances: {
    total_balance: number;
    total_balance_card: number;
    total_financial_reserve: number;
  };
  pending_withdrawals: {
    total_pending_withdrawals: number;
  };
}

interface BalanceCarouselProps {
    summary: FinancialSummary | null;
}

const BalanceCarousel = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <BalanceCard
        type="pix"
        title="Saldo disponível (Pix)"
        value={formatCurrency(0)}
        actionText="Solicitar saque"
      />
      <BalanceCard
        type="card"
        title="Saldo disponível (Cartão)"
        value={formatCurrency(0)}
        actionText="Solicitar saque"
      />
      <BalanceCard
        type="receber"
        title="A receber"
        value={formatCurrency(0)}
        actionText="Solicitar saque"
      />
      <BalanceCard
        type="reserva"
        title="Reserva Financeira"
        value={formatCurrency(0)}
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