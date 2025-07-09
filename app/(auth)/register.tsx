import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppTextInput } from '@/components/common/AppTextInput';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      // Usando o serviço de autenticação diretamente
      const response = await authService.signup({ 
        email, 
        password,
        name 
      });
      
      if (response.error) {
        Alert.alert('Erro no Cadastro', response.error.message || 'Falha ao criar conta');
      } else {
        Alert.alert(
          'Sucesso', 
          'Conta criada! Verifique seu email para confirmação.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text variant="headlineLarge" style={styles.title}>
          Crie sua conta
        </Text>
        <AppTextInput label="Nome Completo" value={name} onChangeText={setName} />
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

        <AppButton mode="contained" onPress={handleRegister} loading={loading} disabled={loading}>
          Cadastrar
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
    marginBottom: 32,
  },
}); 