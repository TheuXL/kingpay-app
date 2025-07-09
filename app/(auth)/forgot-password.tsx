import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppTextInput } from '@/components/common/AppTextInput';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { supabase } from '@/services/supabase';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, informe seu email');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'exp://localhost:8081/--/reset-password',
      });

      if (error) {
        Alert.alert('Erro', error.message);
      } else {
        Alert.alert(
          'Email Enviado',
          'Verifique sua caixa de entrada para instruções de recuperação de senha.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text variant="headlineLarge" style={styles.title}>
          Recuperar Senha
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Insira seu email para enviarmos as instruções de recuperação.
        </Text>
        <AppTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AppButton 
          mode="contained" 
          onPress={handleResetPassword}
          loading={loading}
          disabled={loading}
        >
          Enviar
        </AppButton>
        <AppButton onPress={() => router.back()} disabled={loading}>
          Voltar para o Login
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
}); 