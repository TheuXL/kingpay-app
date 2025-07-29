import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { AppText } from '@/components/shared/AppText';
import { Card } from '@/components/shared/Card';
import { formatCurrency } from '@/utils/formatters';

// Usando genéricos para tornar o componente reutilizável
interface TopListCardProps<T> {
  title: string;
  data: T[];
  nameKey: keyof T;
  valueKey: keyof T;
  style?: StyleProp<ViewStyle>;
}

export function TopListCard<T>({
  title,
  data,
  nameKey,
  valueKey,
  style,
}: TopListCardProps<T>) {
  return (
    <Card style={style}>
      <AppText size="lg" weight="bold" color="textPrimary" style={{ marginBottom: 16 }}>
        {title}
      </AppText>
      <View style={{ gap: 12 }}>
        {data && data.length > 0 ? (
          data.slice(0, 5).map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <AppText color="textSecondary" style={{ flex: 1 }} numberOfLines={1}>
                {String(item[nameKey])}
              </AppText>
              <AppText weight="semibold" color="textPrimary">
                {formatCurrency(Number(item[valueKey]))}
              </AppText>
            </View>
          ))
        ) : (
          <AppText color="textSecondary">Nenhum dado para exibir.</AppText>
        )}
      </View>
    </Card>
  );
} 