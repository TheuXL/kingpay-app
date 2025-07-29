import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, ArrowUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SaldoCardProps {
  balance: number;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const SaldoCard: React.FC<SaldoCardProps> = ({ balance }) => {
  return (
    <View style={styles.cardShadow}>
      <LinearGradient
        colors={['#2D3748', '#1A1AFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Saldo disponível</Text>
          <TouchableOpacity>
            <ArrowRight size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.balance}>{formatCurrency(balance)}</Text>

        <TouchableOpacity style={styles.anticipateButton}>
          <ArrowUp size={16} color="#1A1AFF" />
          <Text style={styles.anticipateButtonText}>Antecipar</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 24, // Espaçamento da seção
  },
  container: {
    borderRadius: 16,
    padding: 24,
    overflow: 'hidden', // Garante que o gradiente respeite o border-radius
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  balance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  anticipateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start', // Para não ocupar a largura toda
    // Sombra interna leve
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  anticipateButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1AFF',
    marginLeft: 8,
  },
});

export default SaldoCard; 