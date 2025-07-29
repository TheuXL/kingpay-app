import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency } from '@/utils/formatters';
import { colors } from '@/theme/colors';

interface ListItemProps {
  name: string;
  value: number;
}
const ListItem = ({ name, value }: ListItemProps) => (
  <View style={styles.listItem}>
    <Text style={styles.itemName}>{name}</Text>
    <Text style={styles.itemValue}>{formatCurrency(value)}</Text>
  </View>
);

interface TopListCardProps<T extends object> {
    title: string;
    subtitle?: string;
    data: T[];
    nameKey: keyof T;
    valueKey: keyof T;
}
export function TopListCard<T extends object>({ title, subtitle, data, nameKey, valueKey }: TopListCardProps<T>) {
  if (!data || data.length === 0) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {data.slice(0, 5).map((item, index) => {
          const name = String(item[nameKey]);
          const value = Number(item[valueKey]);
          
          if (isNaN(value)) {
              return null;
          }

          return <ListItem key={index} name={name} value={value} />
      })}
    </View>
  );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        color: colors.textSecondary,
        fontStyle: 'italic',
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    itemName: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    itemValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
});

export default TopListCard; 