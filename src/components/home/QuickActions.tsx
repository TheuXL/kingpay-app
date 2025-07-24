import { colors } from '@/theme/colors';
import { useRouter } from 'expo-router';
import { ArrowRightLeft, Link, Wallet2 } from 'lucide-react-native'; // Wallet2 tem um design mais próximo
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ActionButton = ({
  icon: Icon,
  label,
  route,
}: {
  icon: React.ElementType;
  label: string;
  route: string;
}) => {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.actionButton} onPress={() => router.push(route)}>
      <View style={styles.iconContainer}>
        <Icon color={colors.primary} size={28} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const QuickActions: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActionButton icon={Wallet2} label="Carteira" route="/carteira" />
      <ActionButton icon={ArrowRightLeft} label="Transações" route="/transactions" />
      <ActionButton icon={Link} label="Link de Pag." route="/payment-links" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start', // Alinha os itens no topo
    paddingHorizontal: 8,
  },
  actionButton: {
    alignItems: 'center',
    maxWidth: 90, // Para evitar que o texto quebre de forma estranha
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  actionLabel: {
    color: '#3F3F46',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default QuickActions; 