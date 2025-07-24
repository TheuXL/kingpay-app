import { CreditCard, PiggyBank } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TransactionItemProps {
  type: 'Entrada' | 'Saída' | 'Transferência';
  title: string;
  subtitle: string;
  date: string;
  value: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ type, title, subtitle, date, value }) => {
  const isIncome = type === 'Entrada';
  const iconBgColor = isIncome ? '#EAFBE7' : '#F5F6FA';
  const iconColor = isIncome ? '#19C37D' : '#222';
  const valueColor = isIncome ? '#19C37D' : '#222';
  const Icon = isIncome ? PiggyBank : CreditCard;

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Icon color={iconColor} size={20} />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        <Text style={[styles.value, { color: valueColor }]}>
          {isIncome ? '+ ' : ''}{value}
        </Text>
      </View>

      <Text style={styles.date}>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: 'rgba(0,0,0,0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative', // Para posicionar a data
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
    gap: 2, // Espaçamento entre os textos
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  subtitle: {
    fontSize: 13,
    color: '#7A7A7A',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  date: {
    position: 'absolute',
    top: 16,
    right: 16,
    fontSize: 12,
    color: '#B0B0B0',
  },
});

export default TransactionItem; 