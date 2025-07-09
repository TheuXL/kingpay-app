import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppTextInput } from '@/components/common/AppTextInput';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { securityCodeService } from '@/services/securityCodeService';

export default function SecurityCodeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { action, redirectTo } = params;
  
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Gerar código automaticamente ao carregar a tela
  useEffect(() => {
    handleGenerateCode();
  }, []);

  const handleGenerateCode = async () => {
    setGenerating(true);
    try {
      const response = await securityCodeService.generateCode();
      
      if (response.success && response.code) {
        setGeneratedCode(response.code);
        setExpiresAt(response.expires_at || null);
      } else {
        Alert.alert('Erro', 'Não foi possível gerar o código de segurança');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao gerar o código de segurança');
      console.error('Generate code error:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert('Erro', 'Por favor, insira o código de segurança');
      return;
    }

    setVerifying(true);
    try {
      const response = await securityCodeService.validateCode(code);
      
      if (response.success) {
        Alert.alert(
          'Sucesso', 
          'Código validado com sucesso!',
          [{ 
            text: 'OK', 
            onPress: () => {
              if (redirectTo) {
                router.replace({
                  pathname: redirectTo.toString() as any
                });
              } else {
                router.back();
              }
            } 
          }]
        );
      } else {
        Alert.alert('Erro', response.message || 'Código inválido ou expirado');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao validar o código');
      console.error('Verify code error:', error);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text variant="headlineLarge" style={styles.title}>
          Código de Segurança
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          {action === 'generate' 
            ? 'Seu código de segurança foi gerado.' 
            : 'Digite o código de segurança enviado para você.'}
        </Text>

        {generatedCode && (
          <View style={styles.codeDisplay}>
            <Text style={styles.codeText}>{generatedCode}</Text>
            {expiresAt && (
              <Text style={styles.expiryText}>
                Expira em: {new Date(expiresAt).toLocaleString()}
              </Text>
            )}
          </View>
        )}

        <AppTextInput
          label="Código de Segurança"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          placeholder="Digite o código"
        />

        <AppButton 
          mode="contained" 
          onPress={handleVerifyCode}
          loading={verifying}
          disabled={verifying || !code}
        >
          Verificar Código
        </AppButton>

        <AppButton 
          onPress={handleGenerateCode}
          loading={generating}
          disabled={generating}
        >
          Gerar Novo Código
        </AppButton>

        <AppButton 
          onPress={() => router.back()} 
          disabled={loading || generating || verifying}
        >
          Voltar
        </AppButton>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  codeDisplay: {
    padding: 16,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  expiryText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
}); 