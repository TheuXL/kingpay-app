import { createPaymentLink } from '@/features/paymentLinks/services/paymentLinkService';
import { colors } from '@/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PaymentMethod = 'pix' | 'cartao' | 'boleto';
const AVAILABLE_METHODS: PaymentMethod[] = ['pix', 'cartao', 'boleto'];

export default function CreatePaymentLinkScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [selectedMethods, setSelectedMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleMethod = (method: PaymentMethod) => {
    setSelectedMethods(prev =>
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  const handleCreateLink = async () => {
    const valorEmCentavos = Math.round(parseFloat(valor.replace(',', '.')) * 100);
    if (!nome || isNaN(valorEmCentavos) || valorEmCentavos <= 0 || selectedMethods.length === 0) {
      Alert.alert('Campos inválidos', 'Por favor, preencha o nome, valor e selecione ao menos um método de pagamento.');
      return;
    }

    setLoading(true);
    try {
      const response = await createPaymentLink({
        nome,
        valor: valorEmCentavos,
        formas_de_pagamento: selectedMethods,
        descricao,
      });

      if (response.success) {
        Alert.alert('Sucesso!', 'Seu link de pagamento foi criado.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Erro', response.error || 'Não foi possível criar o link.');
      }
    } catch (e: any) {
      Alert.alert('Erro inesperado', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Criar Link de Pagamento</Text>
      
      <TextInput style={styles.input} placeholder="Nome do Produto/Serviço" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Valor (ex: 29,90)" value={valor} onChangeText={setValor} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Descrição (opcional)" value={descricao} onChangeText={setDescricao} />

      <Text style={styles.subtitle}>Métodos de Pagamento</Text>
      <View style={styles.methodsContainer}>
        {AVAILABLE_METHODS.map(method => (
          <TouchableOpacity
            key={method}
            style={[styles.methodButton, selectedMethods.includes(method) && styles.methodButtonSelected]}
            onPress={() => toggleMethod(method)}
          >
            <Text style={[styles.methodText, selectedMethods.includes(method) && styles.methodTextSelected]}>{method.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreateLink} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Criar Link</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: colors.textPrimary },
  subtitle: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8, color: colors.textSecondary },
  input: { backgroundColor: colors.card, padding: 16, borderRadius: 8, marginBottom: 12, fontSize: 16 },
  methodsContainer: { flexDirection: 'row', gap: 12 },
  methodButton: { padding: 12, borderRadius: 8, backgroundColor: colors.border },
  methodButtonSelected: { backgroundColor: colors.primary },
  methodText: { color: colors.textSecondary, fontWeight: 'bold' },
  methodTextSelected: { color: colors.white, fontWeight: 'bold' },
  createButton: { backgroundColor: colors.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 'auto' },
  createButtonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
});
