// src/components/anticipations/AnticipationStatusBadge.tsx
import { customTheme } from '@/theme/theme';
import { AnticipationStatus } from '@/types/anticipations';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AnticipationStatusBadgeProps {
  status: AnticipationStatus;
}

const statusStyles = {
  pending: {
    backgroundColor: '#FFC107', // yellow
    color: '#000000', // black
  },
  approved: {
    backgroundColor: customTheme.colors.success,
    color: '#FFFFFF', // white
  },
  refused: {
    backgroundColor: customTheme.colors.danger,
    color: '#FFFFFF', // white
  },
};

const statusTexts = {
  pending: 'Pendente',
  approved: 'Aprovada',
  refused: 'Recusada',
};

export const AnticipationStatusBadge: React.FC<AnticipationStatusBadgeProps> = ({ status }) => {
  const style = statusStyles[status] || {};
  const text = statusTexts[status] || 'Desconhecido';

  return (
    <View style={[styles.badge, { backgroundColor: style.backgroundColor }]}>
      <Text style={[styles.text, { color: style.color }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
}); 