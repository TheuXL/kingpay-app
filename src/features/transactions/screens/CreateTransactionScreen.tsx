import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../../../contexts/AppContext';

export default function CreateTransactionScreen() {
  const router = useRouter();
      const { user } = useAppContext();
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    paymentMethod: 'pix',
    customerEmail: '',
    customerName: '',
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.amount || !formData.description) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      
      // Aqui implementaríamos a criação da transação
      Alert.alert(
        'Funcionalidade em Desenvolvimento',
        'A criação de transações será implementada em breve.\n\nDados preenchidos:\n' +
        `Valor: R$ ${formData.amount}\n` +
        `Descrição: ${formData.description}\n` +
        `Método: ${formData.paymentMethod}\n` +
        `Empresa: ${user?.company?.name || 'Não definida'}`
      );
      
      // router.back(); // Voltar após criar
      
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar transação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Criar Transação</Text>
      </View>

      <ScrollView style={styles.content}>
        {user?.company && (
          <View style={styles.companyInfo}>
            <Text style={styles.companyLabel}>Empresa:</Text>
            <Text style={styles.companyName}>{user.company.name}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Valor (R$) *</Text>
            <TextInput
              style={styles.input}
              value={formData.amount}
              onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
              placeholder="0,00"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição *</Text>
            <TextInput
              style={styles.input}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Descrição da transação"
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Método de Pagamento</Text>
            <View style={styles.methodButtons}>
              {['pix', 'card', 'boleto'].map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.methodButton,
                    formData.paymentMethod === method && styles.methodButtonActive
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                >
                  <Text style={[
                    styles.methodButtonText,
                    formData.paymentMethod === method && styles.methodButtonTextActive
                  ]}>
                    {method.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Cliente</Text>
            <TextInput
              style={styles.input}
              value={formData.customerName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, customerName: text }))}
              placeholder="Nome do cliente (opcional)"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email do Cliente</Text>
            <TextInput
              style={styles.input}
              value={formData.customerEmail}
              onChangeText={(text) => setFormData(prev => ({ ...prev, customerEmail: text }))}
              placeholder="email@exemplo.com (opcional)"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Criando...' : 'Criar Transação'}
            </Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#0052cc',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  companyInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0052cc',
  },
  companyLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  methodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  methodButtonActive: {
    backgroundColor: '#0052cc',
    borderColor: '#0052cc',
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  methodButtonTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#0052cc',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
