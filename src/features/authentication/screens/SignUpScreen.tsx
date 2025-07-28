import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { AuthForm } from '../components/AuthForm';
import { useAuthentication } from '../hooks/useAuthentication';

export default function SignUpScreen() {
  const router = useRouter();
  const { signup, isLoading, error } = useAuthentication();

  const handleSignUpSubmit = async (data: any) => {
    const success = await signup(data.email, data.password, data.name);
    if (success) {
      Alert.alert('Sucesso!', 'Sua conta foi criada. Por favor, faça o login.');
      router.push('/login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <AuthForm
        onSubmit={handleSignUpSubmit}
        buttonText={isLoading ? 'Criando...' : 'Criar Conta'}
        isSignUp={true}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
}); 