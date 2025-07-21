import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { AuthForm } from '../components/AuthForm';
import { useAuthentication } from '../hooks/useAuthentication';

const SignUpScreen = () => {
  const { signup, loading, error } = useAuthentication();
  const router = useRouter();

  const handleSignUp = async (data: { email: string, password: string, name?: string }) => {
    const success = await signup(data);
    if (success) {
      Alert.alert(
        'Cadastro realizado!',
        'Sua conta foi criada com sucesso. Por favor, verifique seu e-mail para ativá-la.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    } else {
      Alert.alert('Erro no Cadastro', error || 'Não foi possível criar a conta.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua Conta</Text>
      <AuthForm
        onSubmit={handleSignUp}
        buttonText={loading ? 'Criando...' : 'Criar Conta'}
        isSignUp
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.link} onPress={() => router.push('/(auth)/login')}>
        Já tem uma conta? Faça login
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  link: {
    color: '#007BFF',
    marginTop: 15,
  },
});

export default SignUpScreen; 