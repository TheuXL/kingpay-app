import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { AppButton } from '../../components/common/AppButton';
import { AppTextInput } from '../../components/common/AppTextInput';
import { ScreenLayout } from '../../components/layout/ScreenLayout';
import { useAuth } from '../../contexts/AuthContext';
import { customTheme } from '../../theme/theme';

interface SecurityCodeScreenProps {
  navigation: any;
  route: any;
}

const SecurityCodeScreen: React.FC<SecurityCodeScreenProps> = ({ navigation, route }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const { /* verifySecurityCode, resendSecurityCode */ } = useAuth();
  
  // Extract email from navigation params
  const email = route.params?.email || '';

  const handleVerifyCode = async () => {
    setError(null);
    
    if (!code) {
      setError('Por favor, informe o código de segurança');
      return;
    }
    
    setLoading(true);
    
    try {
      // Implement actual code verification logic here
      // await verifySecurityCode(email, code);
      navigation.navigate('SetFinancialPassword', { email });
    } catch (err: any) {
      setError(err.message || 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setResendLoading(true);
    
    try {
      // Implement actual resend code logic here
      // await resendSecurityCode(email);
      alert('Um novo código foi enviado para o seu email');
    } catch (err: any) {
      setError(err.message || 'Erro ao reenviar o código');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <ScreenLayout style={styles.container}>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Insira o código de segurança enviado para {email}
      </ThemedText>
      
      {error && (
        <ThemedText style={styles.errorText}>
          {error}
        </ThemedText>
      )}
      
      <AppTextInput
        label="Código de Segurança"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        style={styles.input}
        autoFocus
      />
      
      <AppButton
        title="Verificar Código"
        mode="contained"
        onPress={handleVerifyCode}
        loading={loading}
        disabled={loading}
      />
      
      <AppButton
        title="Reenviar Código"
        onPress={handleResendCode}
        loading={resendLoading}
        disabled={loading || resendLoading}
      />
      
      <AppButton
        title="Voltar para o Login"
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
    marginBottom: customTheme.spacing.lg,
  },
  errorText: {
    color: customTheme.colors.danger,
    marginBottom: customTheme.spacing.md,
  },
});

export default SecurityCodeScreen; 