import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { AppButton } from '../../components/common/AppButton';
import { AppTextInput } from '../../components/common/AppTextInput';
import { ScreenLayout } from '../../components/layout/ScreenLayout';
import { useAuth } from '../../contexts/AuthContext';
import { customTheme } from '../../theme/theme';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { /* register */ } = useAuth();

  const handleRegister = async () => {
    setError(null);
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    setLoading(true);
    
    try {
      // Implement actual registration logic here
      // await register({ name, email, phone, password });
      alert('Registro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout style={styles.container}>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Crie sua conta para começar
      </ThemedText>
      
      {error && (
        <ThemedText style={styles.errorText}>
          {error}
        </ThemedText>
      )}
      
      <AppTextInput
        label="Nome"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      
      <AppTextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      
      <AppTextInput
        label="Telefone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      
      <AppTextInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      
      <AppTextInput
        label="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      
      <AppButton
        title="Cadastrar"
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        disabled={loading}
      />
      
      <AppButton
        title="Já tenho uma conta"
        onPress={() => navigation.navigate('Login')}
        disabled={loading}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: customTheme.spacing.md,
  },
  subtitle: {
    marginBottom: customTheme.spacing.lg,
  },
  input: {
    marginBottom: customTheme.spacing.md,
  },
  errorText: {
    color: customTheme.colors.danger,
    marginBottom: customTheme.spacing.md,
  },
});

export default RegisterScreen; 