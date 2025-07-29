import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../../../contexts/AppContext';

export default function CreatePaymentLinkScreen() {
  const router = useRouter();
  const { user } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    isRecurring: false,
    expiresAt: '',
    limitUsage: '',
    paymentMethods: {
      pix: true,
      card: true,
      boleto: false,
    },
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.amount) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios (Nome e Valor)');
      return;
    }

    try {
      setLoading(true);
      
      // Aqui implementaríamos a criação do link de pagamento
      const enabledMethods = Object.entries(formData.paymentMethods)
        .filter(([_, enabled]) => enabled)
        .map(([method, _]) => method.toUpperCase())
        .join(', ');

      Alert.alert(
        'Funcionalidade em Desenvolvimento',
        'A criação de links de pagamento será implementada em breve.\n\nDados preenchidos:\n' +
        `Nome: ${formData.name}\n` +
        `Valor: R$ ${formData.amount}\n` +
        `Métodos: ${enabledMethods}\n` +
        `Recorrente: ${formData.isRecurring ? 'Sim' : 'Não'}\n` +
        `Empresa: ${user?.company?.name || 'Não definida'}`
      );
      
      // router.back(); // Voltar após criar
      
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar link de pagamento');
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentMethod = (method: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: !prev.paymentMethods[method as keyof typeof prev.paymentMethods]
      }
    }));
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
        <Text style={styles.title}>Criar Link de Pagamento</Text>
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
            <Text style={styles.label}>Nome do Link *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Ex: Pagamento de Produto X"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Descrição opcional do pagamento"
              multiline
              numberOfLines={3}
            />
          </View>

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
            <Text style={styles.label}>Métodos de Pagamento</Text>
            <View style={styles.paymentMethods}>
              {Object.entries(formData.paymentMethods).map(([method, enabled]) => (
                <View key={method} style={styles.methodRow}>
                  <Text style={styles.methodLabel}>{method.toUpperCase()}</Text>
                  <Switch
                    value={enabled}
                    onValueChange={() => togglePaymentMethod(method)}
                    trackColor={{ false: '#ddd', true: '#0052cc' }}
                    thumbColor={enabled ? '#fff' : '#f4f3f4'}
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Pagamento Recorrente</Text>
              <Switch
                value={formData.isRecurring}
                onValueChange={(value) => setFormData(prev => ({ ...prev, isRecurring: value }))}
                trackColor={{ false: '#ddd', true: '#0052cc' }}
                thumbColor={formData.isRecurring ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Expiração (opcional)</Text>
            <TextInput
              style={styles.input}
              value={formData.expiresAt}
              onChangeText={(text) => setFormData(prev => ({ ...prev, expiresAt: text }))}
              placeholder="DD/MM/AAAA"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Limite de Uso (opcional)</Text>
            <TextInput
              style={styles.input}
              value={formData.limitUsage}
              onChangeText={(text) => setFormData(prev => ({ ...prev, limitUsage: text }))}
              placeholder="Número máximo de usos"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Criando...' : 'Criar Link de Pagamento'}
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  paymentMethods: {
    gap: 8,
  },
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  methodLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
