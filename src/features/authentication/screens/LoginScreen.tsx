import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthForm } from '../components/AuthForm';
import { useAuthentication } from '../hooks/useAuthentication';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthentication();

  const handleLoginSubmit = async (data: any) => {
    const success = await login(data.email, data.password);
    if (success) {
      router.replace('/(app)');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <AuthForm
        onSubmit={handleLoginSubmit}
        buttonText={isLoading ? 'Entrando...' : 'Entrar'}
        isSignUp={false}
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