import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Button, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { taxService } from '../services';
import { formatCurrency } from '../utils/formatters';

/**
 * Tela para calcular taxas de transações
 */
const TaxCalculator = () => {
  const navigation = useNavigation();
  
  // Estados para armazenar os valores do formulário
  const [companyId, setCompanyId] = useState('');
  const [valor, setValor] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [parcelas, setParcelas] = useState('1');
  
  // Estados para controlar o carregamento e os resultados
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Métodos de pagamento disponíveis
   */
  const paymentMethods = [
    { label: 'Cartão de Crédito', value: 'credit_card' },
    { label: 'Cartão de Débito', value: 'debit_card' },
    { label: 'PIX', value: 'pix' },
    { label: 'Boleto', value: 'boleto' }
  ];
  
  /**
   * Opções de parcelas
   */
  const parcelasOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  
  /**
   * Limpa o formulário e os resultados
   */
  const handleClear = () => {
    setCompanyId('');
    setValor('');
    setPaymentMethod('credit_card');
    setParcelas('1');
    setResult(null);
    setError(null);
  };
  
  /**
   * Calcula as taxas com base nos valores do formulário
   */
  const handleCalculate = async () => {
    try {
      // Limpar erros anteriores
      setError(null);
      setResult(null);
      setLoading(true);
      
      // Validar dados
      if (!companyId.trim()) {
        setError('ID da companhia é obrigatório');
        return;
      }
      
      const valorNumerico = parseFloat(valor.replace(/[^\d.,]/g, '').replace(',', '.'));
      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        setError('Valor deve ser maior que zero');
        return;
      }
      
      const parcelasNumericas = parseInt(parcelas, 10);
      if (isNaN(parcelasNumericas) || parcelasNumericas <= 0) {
        setError('Número de parcelas deve ser maior que zero');
        return;
      }
      
      // Chamar o serviço de taxas
      const response = await taxService.calculateTaxes(
        companyId,
        valorNumerico,
        paymentMethod,
        parcelasNumericas
      );
      
      // Verificar se a chamada foi bem-sucedida
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        // Se a função Edge falhou, usar a simulação
        console.log('Usando simulação para calcular taxas');
        const simulatedResult = taxService.simulateTaxCalculation(
          companyId,
          valorNumerico,
          paymentMethod,
          parcelasNumericas
        );
        setResult(simulatedResult);
      }
    } catch (error: any) {
      setError(error.message || 'Erro ao calcular taxas');
      console.error('Erro ao calcular taxas:', error);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Formata o valor para exibição em reais
   */
  const formatValue = (text: string) => {
    // Remove caracteres não numéricos
    const numericValue = text.replace(/[^\d]/g, '');
    
    // Converte para número e formata como moeda
    const formatted = formatCurrency(parseFloat(numericValue) / 100);
    
    // Atualiza o estado
    setValor(formatted);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Calculadora de Taxas</Text>
          </View>
          
          <Card style={styles.card}>
            <Card.Title title="Informações da Transação" />
            <Card.Content>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>ID da Companhia</Text>
                <TextInput
                  value={companyId}
                  onChangeText={setCompanyId}
                  placeholder="Digite o ID da companhia"
                  style={styles.input}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Valor da Transação</Text>
                <TextInput
                  value={valor}
                  onChangeText={(text) => formatValue(text)}
                  placeholder="R$ 0,00"
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
              
              <Text style={styles.pickerLabel}>Método de Pagamento</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={paymentMethod}
                  onValueChange={(itemValue: string) => setPaymentMethod(itemValue)}
                  style={styles.picker}
                >
                  {paymentMethods.map((method) => (
                    <Picker.Item
                      key={method.value}
                      label={method.label}
                      value={method.value}
                    />
                  ))}
                </Picker>
              </View>
              
              <Text style={styles.pickerLabel}>Número de Parcelas</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={parcelas}
                  onValueChange={(itemValue: string) => setParcelas(itemValue)}
                  style={styles.picker}
                  enabled={paymentMethod === 'credit_card'}
                >
                  {parcelasOptions.map((option) => (
                    <Picker.Item
                      key={option}
                      label={`${option}x`}
                      value={option.toString()}
                    />
                  ))}
                </Picker>
              </View>
              
              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={handleClear}
                  style={styles.buttonWrapper}
                >
                  Limpar
                </Button>
                <Button
                  mode="contained"
                  onPress={handleCalculate}
                  loading={loading}
                  style={styles.buttonWrapper}
                >
                  Calcular
                </Button>
              </View>
            </Card.Content>
          </Card>
          
          {error && (
            <Card style={[styles.card, styles.errorCard]}>
              <Card.Content>
                <Text style={styles.errorText}>{error}</Text>
              </Card.Content>
            </Card>
          )}
          
          {loading && (
            <Card style={styles.card}>
              <Card.Content>
                <ActivityIndicator size="large" color="#0066cc" />
                <Text style={styles.loadingText}>Calculando taxas...</Text>
              </Card.Content>
            </Card>
          )}
          
          {result && (
            <Card style={styles.card}>
              <Card.Title title="Resultado do Cálculo" />
              <Card.Content>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Valor Original:</Text>
                  <Text style={styles.resultValue}>
                    {formatCurrency(result.valor_original)}
                  </Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Método de Pagamento:</Text>
                  <Text style={styles.resultValue}>
                    {paymentMethods.find(m => m.value === result.payment_method)?.label || result.payment_method}
                  </Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Parcelas:</Text>
                  <Text style={styles.resultValue}>{result.parcelas}x</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Taxa Percentual:</Text>
                  <Text style={styles.resultValue}>{result.taxa_percentual}%</Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Taxa Fixa:</Text>
                  <Text style={styles.resultValue}>
                    {formatCurrency(result.taxa_fixa)}
                  </Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Valor Taxa Percentual:</Text>
                  <Text style={styles.resultValue}>
                    {formatCurrency(result.valor_taxa_percentual)}
                  </Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Valor Taxa Fixa:</Text>
                  <Text style={styles.resultValue}>
                    {formatCurrency(result.valor_taxa_fixa)}
                  </Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.resultRow}>
                  <Text style={[styles.resultLabel, styles.totalLabel]}>
                    Valor Total:
                  </Text>
                  <Text style={[styles.resultValue, styles.totalValue]}>
                    {formatCurrency(result.valor_total)}
                  </Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={[styles.resultLabel, styles.liquidoLabel]}>
                    Valor Líquido:
                  </Text>
                  <Text style={[styles.resultValue, styles.liquidoValue]}>
                    {formatCurrency(result.valor_liquido)}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  errorCard: {
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#86939e',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ee',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#86939e',
    marginTop: 10,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e1e8ee',
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  resultLabel: {
    fontSize: 16,
    color: '#333',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e1e8ee',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    color: '#c62828',
  },
  liquidoLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  liquidoValue: {
    fontSize: 18,
    color: '#2e7d32',
  },
});

export default TaxCalculator; 