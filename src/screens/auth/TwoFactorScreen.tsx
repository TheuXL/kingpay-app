import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { AppButton } from '../../components/common/AppButton';
import { AppTextInput } from '../../components/common/AppTextInput';
import { ScreenLayout } from '../../components/layout/ScreenLayout';
import { useAuth } from '../../contexts/AuthContext';
import { customTheme } from '../../theme/theme';

interface TwoFactorScreenProps {
  navigation: any;
  route: any;
}

const TwoFactorScreen: React.FC<TwoFactorScreenProps> = ({ navigation, route }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const { /* verifyTwoFactor, resendTwoFactorCode */ } = useAuth();

  // Extract email from navigation params
  const email = route.params?.email || '';

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const handleVerifyCode = async () => {
    setError(null);
    
    if (!code) {
      setError('Por favor, informe o código de verificação');
      return;
    }
    
    setLoading(true);
    
    try {
      // Implement actual 2FA verification logic here
      // await verifyTwoFactor(email, code);
      navigation.replace('Main');
    } catch (err: any) {
      setError(err.message || 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setError(null);
    setResendLoading(true);
    
    try {
      // Implement actual resend code logic here
      // await resendTwoFactorCode(email);
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || 'Erro ao reenviar o código');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Verificação em Duas Etapas
        </ThemedText>
        
        <ThemedText style={styles.subtitle}>
          Enviamos um código de verificação para {email}
        </ThemedText>
        
        <ThemedText style={styles.description}>
          Por favor, digite o código de 6 dígitos enviado para o seu email para concluir o login.
        </ThemedText>
        
        {error && (
          <ThemedText style={styles.errorText}>
            {error}
          </ThemedText>
        )}
        
        <AppTextInput
          label="Código de Verificação"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          style={styles.input}
          maxLength={6}
          autoFocus
        />
        
        <AppButton
          title="Verificar"
          mode="contained"
          onPress={handleVerifyCode}
          loading={loading}
          disabled={loading}
          style={styles.button}
        />
        
        {countdown > 0 ? (
          <AppButton
            title={`Reenviar código (${countdown}s)`}
            mode="text"
            onPress={() => {}}
            loading={resendLoading}
            disabled={true}
          />
        ) : (
          <AppButton
            title="Reenviar código"
            mode="text"
            onPress={handleResendCode}
            loading={resendLoading}
            disabled={loading || resendLoading}
          />
        )}
        
        <AppButton
          title="Voltar para o Login"
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
          style={styles.backButton}
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
  description: {
    marginBottom: customTheme.spacing.lg,
  },
  input: {
    marginBottom: customTheme.spacing.lg,
  },
  button: {
    marginBottom: customTheme.spacing.sm,
  },
  backButton: {
    marginTop: customTheme.spacing.md,
  },
  errorText: {
    color: customTheme.colors.danger,
    marginBottom: customTheme.spacing.md,
  },
});

export default TwoFactorScreen; 