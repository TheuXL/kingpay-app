import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { AppButton } from '../../components/common/AppButton';
import { AppTextInput } from '../../components/common/AppTextInput';
import { ScreenLayout } from '../../components/layout/ScreenLayout';
import { useAuth } from '../../contexts/AuthContext';
import { customTheme } from '../../theme/theme';

interface ForgotPasswordScreenProps {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    setError(null);
    
    if (!email) {
      setError('Por favor, informe seu email');
      return;
    }
    
    setLoading(true);
    
    try {
      // Implement actual password reset logic here
      // await resetPassword(email);
      setEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao solicitar redefinição de senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout style={styles.container}>
      {!emailSent ? (
        <>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Informe seu email para receber um link de redefinição de senha
          </ThemedText>
          
          {error && (
            <ThemedText style={styles.errorText}>
              {error}
            </ThemedText>
          )}
          
          <AppTextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          
          <AppButton
            title="Enviar link de redefinição"
            mode="contained"
            onPress={handleResetPassword}
            loading={loading}
            disabled={loading}
          />
          
          <AppButton
            title="Voltar para o login"
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          />
        </>
      ) : (
        <>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Email enviado com sucesso!
          </ThemedText>
          
          <ThemedText style={styles.text}>
            Enviamos um email com instruções para redefinir sua senha.
            Por favor, verifique sua caixa de entrada.
          </ThemedText>
          
          <AppButton
            title="Voltar para o login"
            mode="contained"
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
          />
        </>
      )}
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
  button: {
    marginTop: customTheme.spacing.md,
  },
  text: {
    marginBottom: customTheme.spacing.xl,
  },
  errorText: {
    color: customTheme.colors.danger,
    marginBottom: customTheme.spacing.md,
  },
});

export default ForgotPasswordScreen; 