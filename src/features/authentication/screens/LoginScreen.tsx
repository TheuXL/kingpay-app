import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { AuthForm } from '../components/AuthForm';
import { useAuthentication } from '../hooks/useAuthentication';

const LoginScreen = () => {
  const { login, loading, error } = useAuthentication();
  const router = useRouter();

  const handleLogin = async ({ email, password }: { email: string, password: string }) => {
    const success = await login({ email, password });
    if (!success) {
      Alert.alert('Erro no Login', error || 'Não foi possível fazer login. Verifique suas credenciais.');
    }
    // Não é mais necessário redirecionar aqui. O App.tsx cuidará disso.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <AuthForm
        onSubmit={handleLogin}
        buttonText={loading ? 'Entrando...' : 'Entrar'}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.link} onPress={() => router.push('/(auth)/signup')}>
        Não tem uma conta? Cadastre-se
      </Text>
      <Text style={styles.link} onPress={() => router.push('/(auth)/forgot-password')}>
        Esqueceu sua senha?
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

export default LoginScreen; 