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
import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserData } from '../../../contexts/UserDataContext';
import { formatCurrency } from '../../../utils/currency';
import { showToast } from '../../../utils/toast';
import { calculateTax } from '../services/TaxCalculatorService';

type PaymentMethod = 'PIX' | 'CARD' | 'BOLETO';

interface CalculatedTaxes {
  taxaIntermediacao: string;
  totalTaxas: string;
  valorLiquido?: number; // Opcional, para cálculos futuros
}

export default function TaxCalculatorScreen() {
  const router = useRouter();
  const { company } = useUserData(); // Usar o novo hook

  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [installments, setInstallments] = useState(1);
  
  const [result, setResult] = useState<CalculatedTaxes | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleCalculate = async () => {
    const numericAmount = parseFloat(amount.replace(',', '.')) * 100;
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showToast('Por favor, insira um valor válido.', 'error');
      return;
    }
    
    if (!company?.id) {
        showToast('ID da empresa não encontrado. Não é possível calcular.', 'error');
        return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await calculateTax({
        company_id: company.id,
        valor: numericAmount,
        payment_method: paymentMethod,
        parcelas: paymentMethod === 'CARD' ? installments : 1,
      });

      if (response.success) {
        setResult(response.data);
      } else {
        throw new Error(response.error || 'Erro ao calcular taxas.');
      }
      
    } catch (e: any) {
      setError(e.message);
      showToast(e.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = () => (
    <View style={styles.resultsCard}>
      <View style={styles.resultRow}>
        <Text style={styles.resultLabel}>Valor da Venda</Text>
        <Text style={styles.resultValue}>{formatCurrency(parseFloat(amount.replace(',', '.')))}</Text>
      </View>
      <View style={styles.resultDivider} />
      <View style={styles.resultRow}>
        <Text style={styles.resultLabel}>Taxas Totais</Text>
        <Text style={[styles.resultValue, styles.taxValue]}>{formatCurrency(parseFloat(result.totalTaxas))}</Text>
      </View>
      <View style={styles.resultDivider} />
      <View style={styles.resultRow}>
        <Text style={[styles.resultLabel, styles.finalLabel]}>Você Recebe</Text>
        <Text style={[styles.resultValue, styles.finalValue]}>
          {formatCurrency(parseFloat(amount.replace(',', '.')) - parseFloat(result.totalTaxas))}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calculadora de Taxas</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.amountContainer}>
          <Text style={styles.sectionTitle}>Valor da Venda</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>R$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0,00"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.typeSelectorContainer}>
            <Text style={styles.sectionTitle}>Método de Pagamento</Text>
            <View style={styles.paymentMethodContainer}>
                {['PIX', 'CARD', 'BOLETO'].map((method) => (
                    <TouchableOpacity 
                        key={method}
                        style={[styles.typeOption, paymentMethod === method && styles.typeOptionSelected]}
                        onPress={() => setPaymentMethod(method as PaymentMethod)}
                    >
                        <Text style={[styles.typeTitle, paymentMethod === method && styles.typeTitleSelected]}>{method}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>

        {paymentMethod === 'CARD' && (
            <View style={styles.installmentsContainer}>
                <Text style={styles.sectionTitle}>Parcelas</Text>
                {/* Adicionar um seletor de parcelas aqui */}
            </View>
        )}

        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate} disabled={isLoading}>
            {isLoading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.calculateButtonText}>Calcular Taxas</Text>
            )}
        </TouchableOpacity>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {result && renderResult()}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0052cc',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  amountContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
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
  typeSelectorContainer: {
    padding: 16,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  typeOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeOptionSelected: {
    backgroundColor: '#0052cc',
    borderColor: '#0052cc',
  },
  typeTitle: {
    fontWeight: '600',
    color: '#333',
  },
  typeTitleSelected: {
    color: '#fff',
  },
  installmentsContainer: {
    padding: 16,
  },
  calculateButton: {
    backgroundColor: '#0052cc',
    borderRadius: 12,
    paddingVertical: 16,
    margin: 16,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  resultsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
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
});
