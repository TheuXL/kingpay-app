import React from 'react';
import { View } from 'react-native';
import { AppText } from '@/components/shared/AppText';
import { Card } from '@/components/shared/Card';
import { DashboardData } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';

interface SalesSummaryCardProps {
  data: DashboardData;
}

export function SalesSummaryCard({ data }: SalesSummaryCardProps) {
  return (
    <Card>
      <AppText size="lg" weight="bold" color="textPrimary" style={{ marginBottom: 16 }}>
        Resumo de Vendas
      </AppText>
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText color="textSecondary">Vendas Aprovadas</AppText>
          <AppText weight="semibold" color="success">
            {formatCurrency(data.sum_paid)}
          </AppText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText color="textSecondary">Vendas Pendentes</AppText>
          <AppText weight="semibold" color="warning">
            {formatCurrency(data.sum_pending)}
          </AppText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText color="textSecondary">Reembolsos</AppText>
          <AppText weight="semibold" color="danger">
            {formatCurrency(data.sum_refunded)}
          </AppText>
        </View>
      </View>
    </Card>
  );
} 