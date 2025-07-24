import { colors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PeriodSelectorProps {
  onDateChange: (startDate: Date, endDate: Date) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ onDateChange }) => {
  // Lógica para selecionar datas será adicionada aqui futuramente
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Últimos 30 dias</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
});

export default PeriodSelector; 