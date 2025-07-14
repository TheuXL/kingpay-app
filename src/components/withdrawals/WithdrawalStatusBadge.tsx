import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { WithdrawalStatus } from '../../types';

interface WithdrawalStatusBadgeProps {
  status: WithdrawalStatus;
}

export const WithdrawalStatusBadge: React.FC<WithdrawalStatusBadgeProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return '#FFA000'; // Amber
      case 'approved':
        return '#2196F3'; // Blue
      case 'done':
      case 'done_manual':
        return '#4CAF50'; // Green
      case 'cancel':
      case 'cancelled':
      case 'failed':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Grey
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovado';
      case 'done':
        return 'Concluído';
      case 'done_manual':
        return 'Pago Manual';
      case 'cancel':
      case 'cancelled':
        return 'Cancelado';
      case 'failed':
        return 'Falhou';
      default:
        return status;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: `${getStatusColor()}20` }]}>
      <View style={[styles.dot, { backgroundColor: getStatusColor() }]} />
      <Text style={[styles.text, { color: getStatusColor() }]}>
        {getStatusText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 