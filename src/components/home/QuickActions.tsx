import { ArrowRightLeft, Link, Wallet } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const actions = [
  {
    icon: Wallet,
    label: 'Carteira',
    onPress: () => console.log('Carteira Pressionado'),
  },
  {
    icon: ArrowRightLeft,
    label: 'Transações',
    onPress: () => console.log('Transações Pressionado'),
  },
  {
    icon: Link,
    label: 'Link de Pag.',
    onPress: () => console.log('Link Pressionado'),
  },
];

const QuickActions = () => {
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
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 24,
  },
  actionButton: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32, // Circular
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    // Sombra
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