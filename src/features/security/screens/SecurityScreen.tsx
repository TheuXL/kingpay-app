import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { securityCodeService } from '../services/securityCodeService';

export default function SecurityScreen() {
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);

  const handleGenerateCode = async () => {
    try {
      setLoading(true);
      console.log('🔄 Gerando código de segurança...');

      const response = await securityCodeService.generateSecurityCode();

      if (response && response.code) {
        setGeneratedCode(response.code);
        Alert.alert(
          '✅ Código Gerado',
          `Seu código de segurança é: ${response.code}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('❌ Erro', 'Erro ao gerar código');
      }
    } catch (error) {
      console.error('❌ Erro ao gerar código:', error);
      Alert.alert('❌ Erro', 'Erro inesperado ao gerar código');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateCode = async () => {
    if (!code || code.length < 3) { // Validação simples
      Alert.alert('❌ Formato Inválido', 'Por favor, insira um código.');
      return;
    }

    try {
      setValidating(true);
      console.log('🔄 Validando código...');

      const isValid = await securityCodeService.validateSecurityCode(code);

      if (isValid) {
        Alert.alert(
          '✅ Código Válido',
          'Código validado com sucesso!',
          [{ text: 'OK' }]
        );
        setCode('');
      } else {
        Alert.alert('❌ Código Inválido', 'Código inválido ou expirado');
      }
    } catch (error) {
      console.error('❌ Erro ao validar código:', error);
      Alert.alert('❌ Erro', 'Erro inesperado ao validar código');
    } finally {
      setValidating(false);
    }
  };

  const formatInputCode = (text: string) => {
    // Remove formatação para simplificar
    const formatted = text.replace(/[^0-9]/g, '');
    setCode(formatted);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Códigos de Segurança</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={32} color="#0052cc" />
          <Text style={styles.infoTitle}>Autenticação de Dois Fatores</Text>
          <Text style={styles.infoDescription}>
            Use códigos de segurança para proteger sua conta com uma camada adicional de segurança.
          </Text>
        </View>

        {/* Generate Code Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gerar Código</Text>
          <Text style={styles.sectionDescription}>
            Gere um novo código de segurança para usar em processos de verificação.
          </Text>
          
          <TouchableOpacity 
            style={[styles.generateButton, loading && styles.disabledButton]}
            onPress={handleGenerateCode}
            disabled={loading}
          >
            <Ionicons 
              name={loading ? "hourglass" : "refresh"} 
              size={20} 
              color="#fff" 
            />
            <Text style={styles.generateButtonText}>
              {loading ? 'Gerando...' : 'Gerar Código'}
            </Text>
          </TouchableOpacity>

          {generatedCode && (
            <View style={styles.generatedCodeContainer}>
              <Text style={styles.generatedCodeLabel}>Último código gerado:</Text>
              <Text style={styles.generatedCode}>
                {generatedCode}
              </Text>
            </View>
          )}
        </View>

        {/* Validate Code Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Validar Código</Text>
          <Text style={styles.sectionDescription}>
            Digite o código de segurança que você recebeu para validá-lo.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={setCode} // Simplificado
              placeholder="Digite o código"
              keyboardType="numeric"
              maxLength={8} 
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.validateButton, 
              (!code || validating) && styles.disabledButton
            ]}
            onPress={handleValidateCode}
            disabled={!code || validating}
          >
            <Ionicons 
              name={validating ? "hourglass" : "checkmark-circle"} 
              size={20} 
              color="#fff" 
            />
            <Text style={styles.validateButtonText}>
              {validating ? 'Validando...' : 'Validar Código'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Security Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Dicas de Segurança</Text>
          
          <View style={styles.tip}>
            <Ionicons name="time" size={16} color="#F59E0B" />
            <Text style={styles.tipText}>
              Códigos expiram após um período determinado
            </Text>
          </View>
          
          <View style={styles.tip}>
            <Ionicons name="eye-off" size={16} color="#F59E0B" />
            <Text style={styles.tipText}>
              Nunca compartilhe seus códigos de segurança
            </Text>
          </View>
          
          <View style={styles.tip}>
            <Ionicons name="refresh" size={16} color="#F59E0B" />
            <Text style={styles.tipText}>
              Gere um novo código se o anterior expirar
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  generateButton: {
    backgroundColor: '#0052cc',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  generatedCodeContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  generatedCodeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  generatedCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0052cc',
    letterSpacing: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: '600',
  },
  validateButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  validateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  tipsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
});
