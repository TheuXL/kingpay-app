import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';
import { Acquirer } from '../../types/acquirers';

interface AcquirerListItemProps {
  acquirer: Acquirer;
}

export const AcquirerListItem: React.FC<AcquirerListItemProps> = ({ acquirer }) => {
  const navigateToDetails = () => {
    // Usar o formato correto para navegação com Expo Router
    router.push({
      pathname: "/(drawer)/acquirers/[id]" as any,
      params: { id: acquirer.id }
    });
  };

  return (
    <Card style={styles.card} onPress={navigateToDetails}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium">{acquirer.name}</Text>
          <Chip 
            mode="flat" 
            style={[styles.statusChip, (acquirer.acquirers_pix || acquirer.acquirers_boleto || acquirer.acquirers_card) ? styles.active : styles.inactive]}
          >
            {(acquirer.acquirers_pix || acquirer.acquirers_boleto || acquirer.acquirers_card) ? 'Ativo' : 'Inativo'}
          </Chip>
        </View>
        
        {acquirer.description && (
          <Text variant="bodyMedium" style={styles.description}>
            {acquirer.description}
          </Text>
        )}
        
        <View style={styles.paymentMethods}>
          <Text variant="bodySmall" style={styles.paymentMethodsTitle}>
            Métodos de pagamento:
          </Text>
          <View style={styles.methodsContainer}>
            <Chip 
              mode="outlined" 
              style={[styles.methodChip, acquirer.acquirers_pix ? styles.methodActive : styles.methodInactive]}
            >
              PIX
            </Chip>
            <Chip 
              mode="outlined" 
              style={[styles.methodChip, acquirer.acquirers_boleto ? styles.methodActive : styles.methodInactive]}
            >
              Boleto
            </Chip>
            <Chip 
              mode="outlined" 
              style={[styles.methodChip, acquirer.acquirers_card ? styles.methodActive : styles.methodInactive]}
            >
              Cartão
            </Chip>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusChip: {
    height: 24,
  },
  active: {
    backgroundColor: '#E7F5E8',
  },
  inactive: {
    backgroundColor: '#FEEAEA',
  },
  description: {
    marginBottom: 12,
    color: '#666',
  },
  paymentMethods: {
    marginTop: 8,
  },
  paymentMethodsTitle: {
    marginBottom: 4,
    color: '#666',
  },
  methodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  methodChip: {
    height: 28,
  },
  methodActive: {
    borderColor: '#4CAF50',
  },
  methodInactive: {
    borderColor: '#BDBDBD',
    backgroundColor: '#F5F5F5',
  },
}); 