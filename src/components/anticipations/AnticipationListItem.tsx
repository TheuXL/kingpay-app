// src/components/anticipations/AnticipationListItem.tsx
import { customTheme } from '@/theme/theme';
import { Anticipation } from '@/types/anticipations';
import { formatCurrency, formatDate } from '@/utils/format';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AnticipationStatusBadge } from './AnticipationStatusBadge';

interface AnticipationListItemProps {
  item: Anticipation;
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
}

export const AnticipationListItem: React.FC<AnticipationListItemProps> = ({ item, onApprove, onDeny }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(item.created_at)}</Text>
        <AnticipationStatusBadge status={item.status} />
      </View>
      <View style={styles.content}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Valor Solicitado:</Text>
          <Text style={styles.amountValue}>{formatCurrency(item.amount)}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Taxa:</Text>
          <Text style={[styles.amountValue, styles.fee]}>{formatCurrency(item.fee_amount)}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Valor a Receber:</Text>
          <Text style={[styles.amountValue, styles.finalAmount]}>{formatCurrency(item.net_amount)}</Text>
        </View>
      </View>
      {item.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.button, styles.approveButton]} onPress={() => onApprove(item.id)}>
            <Text style={styles.buttonText}>Aprovar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.denyButton]} onPress={() => onDeny(item.id)}>
            <Text style={styles.buttonText}>Recusar</Text>
          </TouchableOpacity>
        </View>
      )}
      {item.status === 'refused' && item.refused_reason && (
        <View style={styles.reasonContainer}>
          <Text style={styles.reasonLabel}>Motivo da Recusa:</Text>
          <Text style={styles.reasonText}>{item.refused_reason}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: customTheme.colors.card.light,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    color: customTheme.colors.text.primary.light,
    fontSize: 14,
  },
  content: {
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  amountLabel: {
    color: customTheme.colors.text.primary.light,
    fontSize: 16,
  },
  amountValue: {
    color: customTheme.colors.text.primary.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
  fee: {
    color: customTheme.colors.danger,
  },
  finalAmount: {
    color: customTheme.colors.success,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: customTheme.colors.border.light,
    paddingTop: 12,
    marginTop: 4,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  approveButton: {
    backgroundColor: customTheme.colors.success,
  },
  denyButton: {
    backgroundColor: customTheme.colors.danger,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  reasonContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: customTheme.colors.border.light,
    paddingTop: 8,
  },
  reasonLabel: {
    color: customTheme.colors.text.primary.light,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reasonText: {
    color: customTheme.colors.text.primary.light,
  },
}); 