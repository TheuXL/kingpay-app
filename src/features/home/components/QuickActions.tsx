import { useRouter } from 'expo-router';
import { ArrowRightLeft, Landmark, Link, Wallet } from 'lucide-react-native';
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
          onPress: () => console.log('Link Pressionado'),
        },
        {
          icon: Landmark, // Ícone para Pix
          label: 'Área Pix',
          onPress: () => console.log('Pix Pressionado'),
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
              <Icon color="#1A1AFF" size={24} />
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
    justifyContent: 'space-between', // Para distribuir os 4 botões
    alignItems: 'center',
    marginVertical: 32,
    paddingHorizontal: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  actionLabel: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
});

export default QuickActions; 