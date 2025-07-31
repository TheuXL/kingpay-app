// src/features/home/components/QuickActions.tsx
import { useRouter } from 'expo-router';
import { AppWindow, ArrowRightLeft, Link as LinkIcon, Wallet } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QuickActions = () => {
    const router = useRouter();

    const actions = [
        {
          icon: Wallet,
          label: 'Carteira',
          onPress: () => router.push('/(app)/carteira'),
        },
        {
          icon: ArrowRightLeft,
          label: 'Transações',
          onPress: () => router.push('/(app)/transactions'),
        },
        {
          icon: LinkIcon,
          label: 'Link de\nPagamento',
          onPress: () => router.push('/(app)/links'),
        },
        {
            icon: AppWindow,
            label: 'Área Pix',
            onPress: () => router.push('/(app)/admin/pix-keys'), // Rota de exemplo
        },
      ];

  return (
    <View style={styles.container}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <TouchableOpacity
            key={index}
            style={styles.actionButton}
            onPress={action.onPress}
          >
            <View style={styles.iconContainer}>
              <Icon color="#1313F2" size={28} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingHorizontal: 10,
  },
  actionButton: {
    alignItems: 'center',
    gap: 12,
    flex: 1, // Para que ocupem espaço igualmente
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  actionLabel: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default QuickActions;
