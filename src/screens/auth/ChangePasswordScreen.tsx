import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { AppButton } from '../../components/common/AppButton';
import { AppTextInput } from '../../components/common/AppTextInput';
import { ScreenLayout } from '../../components/layout/ScreenLayout';
import { useAuth } from '../../contexts/AuthContext';
import { customTheme } from '../../theme/theme';

interface ChangePasswordScreenProps {
  navigation: any;
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { /* updatePassword */ } = useAuth();

  const handleChangePassword = async () => {
    setError(null);
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Todos os campos são obrigatórios');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('As novas senhas não coincidem');
      return;
    }
    
    setLoading(true);
    
    try {
      // Implement actual change password logic here
      // await updatePassword(currentPassword, newPassword);
      alert('Senha alterada com sucesso!');
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Erro ao alterar a senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout style={styles.container}>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Crie uma nova senha segura para sua conta
      </ThemedText>
      
      {error && (
        <ThemedText style={styles.errorText}>
          {error}
        </ThemedText>
      )}
      
      <AppTextInput
        label="Senha atual"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        style={styles.input}
      />
      
      <AppTextInput
        label="Nova senha"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
      />
      
      <AppTextInput
        label="Confirmar nova senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      
      <AppButton
        title="Alterar Senha"
        mode="contained"
        onPress={handleChangePassword}
        loading={loading}
        disabled={loading}
        style={styles.button}
      />
      
      <AppButton
        title="Cancelar"
        onPress={() => navigation.goBack()}
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
  button: {
    marginTop: customTheme.spacing.md,
    marginBottom: customTheme.spacing.sm,
  },
  errorText: {
    color: customTheme.colors.danger,
    marginBottom: customTheme.spacing.md,
  },
});

export default ChangePasswordScreen; 