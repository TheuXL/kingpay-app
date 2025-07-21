/**
 * 📈 CALCULADORA DE TAXAS
 * =======================
 * 
 * Tela para calcular taxas de:
 * - Transações PIX
 * - Cartão de crédito
 * - Cartão de débito  
 * - Saques
 * - Antecipações
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TransactionType = 'pix' | 'credit' | 'debit' | 'withdrawal' | 'anticipation';

interface TaxRate {
  type: TransactionType;
  name: string;
  icon: string;
  color: string;
  percentage: number;
  fixedFee: number;
  minFee: number;
  maxFee?: number;
}

export default function TaxCalculatorScreen() {
  const router = useRouter();

  // Mostrar tela de funcionalidade indisponível
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.unavailableContainer}>
        <MaterialCommunityIcons name="calculator-variant" size={80} color="#ccc" />
        <Text style={styles.unavailableTitle}>Calculadora de Taxas</Text>
        <Text style={styles.unavailableMessage}>
          Esta funcionalidade estará disponível quando os endpoints do backend estiverem operacionais.
        </Text>
        <Text style={styles.unavailableDetails}>
          📊 Endpoint necessário: POST /functions/v1/taxas
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color="#0052cc" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  unavailableContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  unavailableTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  unavailableMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  unavailableDetails: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  backButtonText: {
    fontSize: 16,
    color: '#0052cc',
    marginLeft: 8,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0052cc',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#e6f3ff',
    borderWidth: 1,
    borderColor: '#b3d9ff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0052cc',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: '#0052cc',
    lineHeight: 20,
  },
  typeSelectorContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeOptionSelected: {
    backgroundColor: '#f8f9fa',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  typeRate: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  amountContainer: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 12,
  },
  quickAmountContainer: {
    marginBottom: 16,
  },
  quickAmountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  quickAmountButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickAmountButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quickAmountText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  resultsContainer: {
    padding: 16,
  },
  resultsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  taxValue: {
    color: '#EF4444',
  },
  resultDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  finalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  finalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  effectiveRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  effectiveRateText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  detailsContainer: {
    padding: 16,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsList: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailItemLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailItemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
