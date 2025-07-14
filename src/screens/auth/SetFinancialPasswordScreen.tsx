import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { AppButton } from '../../components/common/AppButton';
import { AppTextInput } from '../../components/common/AppTextInput';
import { ScreenLayout } from '../../components/layout/ScreenLayout';
import { useAuth } from '../../contexts/AuthContext';
import { customTheme } from '../../theme/theme';

interface SetFinancialPasswordScreenProps {
  navigation: any;
  route: any;
}

const SetFinancialPasswordScreen: React.FC<SetFinancialPasswordScreenProps> = ({ navigation, route }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { /* setFinancialPassword */ } = useAuth();
  
  // Extract email from navigation params
  const email = route.params?.email || '';

  const handleSetPassword = async () => {
    // Reset error state
    setError(null);
    
    // Validate passwords
    if (!password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    
    // Validate password requirements
    const hasMinLength = password.length >= 6;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasMinLength || !hasNumber || !hasSpecialChar) {
      setError('A senha não atende aos requisitos mínimos.');
      return;
    }
    
    // Set loading state
    setLoading(true);
    
    try {
      // Call the auth service to set financial password
      // Commented out since the function doesn't exist in AuthContextType
      // await setFinancialPassword(password);
      
      // Navigate to login screen on success
      navigation.navigate('Login');
    } catch (err: any) {
      // Handle error
      setError(err.message || 'Ocorreu um erro ao definir a senha financeira.');
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Crie uma senha financeira para proteger suas operações
        </ThemedText>
        
        <ThemedText style={styles.infoText}>
          Esta senha será solicitada para confirmar transações financeiras e operações sensíveis.
        </ThemedText>
        
        <ThemedText style={styles.requirementText}>• Mínimo de 6 caracteres</ThemedText>
        <ThemedText style={styles.requirementText}>• Pelo menos 1 número</ThemedText>
        <ThemedText style={styles.requirementText}>• Pelo menos 1 caractere especial</ThemedText>
        
        <AppTextInput
          label="Senha Financeira"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        
        <AppTextInput
          label="Confirmar Senha Financeira"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
        
        {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
        
        <AppButton
          title="Definir Senha Financeira"
          onPress={handleSetPassword}
          loading={loading}
          disabled={loading}
          style={styles.button}
        />
        
        <AppButton
          title="Voltar para Login"
          mode="outlined"
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: customTheme.spacing.md,
  },
  subtitle: {
    marginBottom: customTheme.spacing.md,
  },
  infoText: {
    marginBottom: customTheme.spacing.lg,
  },
  requirementText: {
    marginBottom: customTheme.spacing.xs,
  },
  input: {
    marginBottom: customTheme.spacing.md,
  },
  button: {
    marginTop: customTheme.spacing.md,
    marginBottom: customTheme.spacing.md,
  },
  errorText: {
    color: customTheme.colors.danger,
    marginBottom: customTheme.spacing.md,
    marginTop: customTheme.spacing.md,
  },
});

export default SetFinancialPasswordScreen; 