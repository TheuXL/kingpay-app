import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils/formatters';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowUp, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SaldoCardProps {
  balance: number;
}

const SaldoCard: React.FC<SaldoCardProps> = ({ balance }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} activeOpacity={0.9}>
      <LinearGradient
        colors={['rgba(26, 26, 255, 0.85)', 'rgba(26, 26, 255, 1)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.label}>Saldo disponível</Text>
          <ChevronRight color='#FFF' size={24} style={styles.chevronIcon} />
        </View>

        <Text style={styles.value}>{formatCurrency(balance)}</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Antecipar</Text>
          <ArrowUp color={colors.primary} size={20} />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginVertical: 16,
  },
  gradient: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    minHeight: 180,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  label: {
    color: colors.white,
    fontSize: 16,
    opacity: 0.9,
  },
  chevronIcon: {
    opacity: 0.8,
  },
  value: {
    color: colors.white,
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 12,
    textAlign: 'left',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: colors.primary,
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 16,
  },
});

export default SaldoCard; 