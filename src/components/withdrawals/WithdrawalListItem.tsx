import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Withdrawal } from '../../types';
import { WithdrawalStatusBadge } from './WithdrawalStatusBadge';

interface WithdrawalListItemProps {
  withdrawal: Withdrawal;
  onPress: (withdrawal: Withdrawal) => void;
}

export const WithdrawalListItem: React.FC<WithdrawalListItemProps> = ({
  withdrawal,
  onPress,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <TouchableOpacity onPress={() => onPress(withdrawal)}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.id} numberOfLines={1}>
              {withdrawal.id}
            </Text>
            <WithdrawalStatusBadge status={withdrawal.status} />
          </View>
          
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Valor:</Text>
              <Text style={styles.value}>{formatCurrency(withdrawal.amount)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.label}>Solicitado:</Text>
              <Text style={styles.value}>{formatCurrency(withdrawal.requested_amount)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.label}>Taxa:</Text>
              <Text style={styles.value}>{formatCurrency(withdrawal.fee_amount)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.label}>Data:</Text>
              <Text style={styles.value}>{formatDate(withdrawal.created_at)}</Text>
            </View>
            
            {withdrawal.pix_key && (
              <View style={styles.detailRow}>
                <Text style={styles.label}>Chave PIX:</Text>
                <Text style={styles.value} numberOfLines={1}>
                  {withdrawal.pix_key.key} ({withdrawal.pix_key.key_type})
                </Text>
              </View>
            )}
            
            {withdrawal.description && (
              <View style={styles.description}>
                <Text style={styles.label}>Descrição:</Text>
                <Text style={styles.descriptionText}>{withdrawal.description}</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 16,
  },
  content: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  id: {
    fontSize: 12,
    opacity: 0.6,
    flex: 1,
    marginRight: 8,
  },
  details: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
  },
  description: {
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
}); 