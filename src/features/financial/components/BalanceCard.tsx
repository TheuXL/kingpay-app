import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowRight, Diamond } from 'lucide-react-native';

interface BalanceCardProps {
  type: 'pix' | 'card' | 'receber' | 'reserva';
  title: string;
  value: string;
  actionText?: string;
  description?: string;
}

const cardStyles = {
  pix: {
    backgroundColor: '#1A1AFF',
    icon: <Diamond color="#fff" />,
  },
  card: {
    backgroundColor: '#0A174E',
    icon: <Diamond color="#fff" />, // Ícone placeholder
  },
  receber: {
    backgroundColor: '#19C37D',
    icon: <Diamond color="#fff" />, // Ícone placeholder
  },
  reserva: {
    backgroundColor: '#FFFFFF',
    icon: <Diamond color="#1A1AFF" />, // Ícone placeholder
  },
};

const BalanceCard: React.FC<BalanceCardProps> = ({ type, title, value, actionText, description }) => {
  const stylesConfig = cardStyles[type];
  const isLight = type === 'reserva';
  const textColor = isLight ? '#222' : '#fff';
  const actionColor = isLight ? '#1A1AFF' : '#fff';

  return (
    <View style={[styles.card, { backgroundColor: stylesConfig.backgroundColor }]}>
      <View style={styles.header}>
        {stylesConfig.icon}
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      </View>
      <Text style={[styles.value, { color: textColor }]}>{value}</Text>
      {description && <Text style={[styles.description, { color: isLight ? '#555' : '#eee' }]}>{description}</Text>}
      {actionText && (
        <TouchableOpacity style={styles.actionButton}>
          <Text style={[styles.actionText, { color: actionColor }]}>{actionText}</Text>
          <ArrowRight color={actionColor} size={16} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 280,
    height: 150,
    borderRadius: 16,
    padding: 20,
    marginRight: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    marginTop: -10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginRight: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BalanceCard; 