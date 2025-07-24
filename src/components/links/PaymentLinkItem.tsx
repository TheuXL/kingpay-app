import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/theme/colors';
import { Link, ChevronRight, Copy } from 'lucide-react-native';

interface PaymentLinkItemProps {
  name: string;
  value: string;
  active: boolean;
  onPress: () => void;
  onCopy: () => void;
}

const PaymentLinkItem: React.FC<PaymentLinkItemProps> = ({ name, value, active, onPress, onCopy }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Link color={colors.primary} size={24} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <View style={[styles.badge, active ? styles.activeBadge : styles.inactiveBadge]}>
          <Text style={[styles.badgeText, active ? styles.activeBadgeText : styles.inactiveBadgeText]}>
            {active ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
        <TouchableOpacity style={styles.copyButton} onPress={onCopy}>
          <Copy size={16} color={colors.primary} />
          <Text style={styles.copyButtonText}>Copiar link</Text>
        </TouchableOpacity>
      </View>
      <ChevronRight color={colors.gray} size={24} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: '#E6F0FF',
    borderRadius: 50,
    padding: 12,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  value: {
    fontSize: 14,
    color: '#52525B',
  },
  actionsContainer: {
    alignItems: 'flex-end',
    gap: 8,
    marginRight: 12,
  },
  badge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  activeBadge: {
    backgroundColor: '#E6F9F0',
  },
  inactiveBadge: {
    backgroundColor: '#FDECEC',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeBadgeText: {
    color: '#00875F',
  },
  inactiveBadgeText: {
    color: '#F75A68',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F0FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  copyButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default PaymentLinkItem; 