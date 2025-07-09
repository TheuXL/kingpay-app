// app/(auth)/login.tsx
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppTextInput } from '@/components/common/AppTextInput';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const response = await signIn(email, password);
      
      if (response.error) {
        Alert.alert('Erro no Login', response.error.message || 'Falha na autenticação');
        return;
      }
      
      // O AuthContext já vai lidar com a atualização do estado
      // e redirecionamento através do listener do Supabase
      
    } catch (error: any) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text variant="headlineLarge" style={styles.title}>
          Bem-vindo!
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Faça login para continuar.
        </Text>

        <AppTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <AppTextInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <AppButton mode="contained" onPress={handleLogin} loading={loading} disabled={loading}>
          Entrar
        </AppButton>
        <AppButton onPress={() => router.push('/(auth)/register')} disabled={loading}>
          Criar Conta
        </AppButton>
        <AppButton onPress={() => router.push('/(auth)/forgot-password')} disabled={loading}>
          Esqueci minha senha
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
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
});