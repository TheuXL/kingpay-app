import { useRouter } from 'expo-router';
import { AppWindow, ArrowRightLeft, Link, Wallet } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QuickActions = () => {
    const router = useRouter();

    const actions = [
        {
          icon: Wallet,
          label: 'Carteira',
          onPress: () => router.push('/carteira'),
        },
        {
          icon: ArrowRightLeft,
          label: 'Transações',
          onPress: () => router.push('/transactions'),
        },
        {
          icon: Link,
          label: 'Link de Pagamento',
          onPress: () => router.push('/links'),
        },
        {
          icon: AppWindow,
          label: 'Área Pix',
          onPress: () => router.push('/pix-keys'),
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
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  actionButton: {
    alignItems: 'center',
    maxWidth: 80, 
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
