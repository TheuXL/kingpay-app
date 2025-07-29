import React from 'react';
import { View } from 'react-native';
import { AppText } from '@/components/shared/AppText';
import { Card } from '@/components/shared/Card';
import { WhitelabelFinancial } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';
import { colors } from '@/theme/colors';

interface FinancialSummaryCardProps {
  data: WhitelabelFinancial;
}

export function FinancialSummaryCard({ data }: FinancialSummaryCardProps) {
  return (
    <Card>
      <AppText size="lg" weight="bold" color="textPrimary">
        Resumo Financeiro
      </AppText>
      <View style={{ marginTop: 16, gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText color="textSecondary">Saldo Disponível</AppText>
          <AppText weight="bold" color="success">
            {formatCurrency(data.balance_available)}
          </AppText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText color="textSecondary">A Receber</AppText>
          <AppText weight="bold" color="textPrimary">
            {formatCurrency(data.balance_waiting_funds)}
          </AppText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText color="textSecondary">Reserva de Segurança</AppText>
          <AppText weight="bold" color="textPrimary">
            {formatCurrency(data.balance_retained)}
          </AppText>
        </View>
      </View>
    </Card>
  );
} 