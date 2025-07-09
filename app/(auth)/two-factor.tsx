import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Alert, TextInput as RNTextInput } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { supabase } from '@/services/supabase';

export default function TwoFactorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { email, redirectTo } = params;
  
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const inputRefs = useRef<Array<RNTextInput | null>>([]);

  // Gerenciar o contador regressivo para reenvio de código
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Se o usuário colar um código completo
      const pastedValue = value.slice(0, 6).split('');
      const newOtpValues = [...otpValues];
      
      pastedValue.forEach((char, i) => {
        if (i < 6) newOtpValues[i] = char;
      });
      
      setOtpValues(newOtpValues);
      
      // Foca no último campo preenchido ou no próximo vazio
      const lastFilledIndex = newOtpValues.findIndex(v => !v);
      const targetIndex = lastFilledIndex === -1 ? 5 : lastFilledIndex;
      inputRefs.current[targetIndex]?.focus();
    } else {
      // Atualiza apenas o campo atual
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      
      // Move para o próximo campo se o atual foi preenchido
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    // Se pressionar backspace em um campo vazio, volta para o anterior
    if (key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const code = otpValues.join('');
    if (code.length !== 6) {
      Alert.alert('Erro', 'Por favor, insira o código completo de 6 dígitos');
      return;
    }

    setIsSubmitting(true);
    try {
      // Aqui você implementaria a verificação do código 2FA
      // Usando o serviço de autenticação ou diretamente o Supabase
      
      // Exemplo de verificação (simulada):
      // Na implementação real, você usaria uma API específica para verificar o código
      setTimeout(() => {
        // Simulação de verificação bem-sucedida
        Alert.alert(
          'Sucesso', 
          'Código verificado com sucesso!',
          [{ 
            text: 'OK', 
            onPress: () => {
              if (redirectTo) {
                router.replace({
                  pathname: redirectTo.toString() as any
                });
              } else {
                router.replace('/(tabs)' as any);
              }
            } 
          }]
        );
      }, 1500);
    } catch (error) {
      Alert.alert('Erro', 'Código inválido ou expirado. Por favor, tente novamente.');
      console.error('2FA verification error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setResending(true);
    try {
      // Aqui você implementaria o reenvio do código 2FA
      // Usando o serviço de autenticação ou diretamente o Supabase
      
      // Exemplo (simulado):
      setTimeout(() => {
        Alert.alert('Sucesso', 'Um novo código foi enviado para seu email.');
        setCountdown(60); // Inicia contador de 60 segundos
      }, 1500);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível reenviar o código. Tente novamente.');
      console.error('Resend code error:', error);
    } finally {
      setResending(false);
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text variant="headlineLarge" style={styles.title}>
          Verificação em Duas Etapas
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          Digite o código de 6 dígitos enviado para {email || 'seu email'}
        </Text>

        <View style={styles.inputsContainer}>
          {otpValues.map((value, index) => (
            <RNTextInput
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              style={styles.input}
              value={value}
              onChangeText={text => handleInputChange(index, text)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!isSubmitting}
            />
          ))}
        </View>

        <AppButton 
          mode="contained" 
          onPress={handleVerifyCode}
          loading={isSubmitting}
          disabled={isSubmitting || otpValues.some(v => !v)}
          style={styles.verifyButton}
        >
          Verificar
        </AppButton>

        <View style={styles.resendContainer}>
          <Text variant="bodyMedium">Não recebeu o código?</Text>
          <AppButton 
            mode="text" 
            onPress={handleResendCode}
            loading={resending}
            disabled={resending || countdown > 0}
          >
            {countdown > 0 ? `Reenviar (${countdown}s)` : 'Reenviar código'}
          </AppButton>
        </View>

        <AppButton 
          onPress={() => router.back()} 
          disabled={isSubmitting || resending}
          style={styles.backButton}
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
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  input: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  verifyButton: {
    marginBottom: 16,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginTop: 16,
  },
}); 