import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppTextInput } from '@/components/common/AppTextInput';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/services/supabase';

export default function SetFinancialPasswordScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasExistingPassword, setHasExistingPassword] = useState(false);

  // Check if the user already has a financial password
  React.useEffect(() => {
    if (user) {
      checkExistingFinancialPassword();
    }
  }, [user]);

  const checkExistingFinancialPassword = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('financial_password_enabled')
        .eq('user_id', user?.id)
        .single();
      
      if (error) {
        console.error('Error checking financial password:', error);
        return;
      }
      
      setHasExistingPassword(data?.financial_password_enabled || false);
    } catch (error) {
      console.error('Error checking financial password:', error);
    }
  };

  const validatePassword = (password: string): boolean => {
    // Password must be at least 6 characters
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha financeira deve ter pelo menos 6 caracteres.');
      return false;
    }
    
    // Password must contain at least one number
    if (!/\d/.test(password)) {
      Alert.alert('Erro', 'A senha financeira deve conter pelo menos um número.');
      return false;
    }
    
    return true;
  };

  const handleSetPassword = async () => {
    // Validate inputs
    if (hasExistingPassword && !currentPassword) {
      Alert.alert('Erro', 'Por favor, digite sua senha financeira atual.');
      return;
    }
    
    if (!newPassword) {
      Alert.alert('Erro', 'Por favor, digite a nova senha financeira.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    
    if (!validatePassword(newPassword)) {
      return;
    }
    
    setLoading(true);
    try {
      if (hasExistingPassword) {
        // Verify the current password
        // In a real app, you would call an API to verify the current password
        const isCurrentPasswordValid = await verifyCurrentFinancialPassword(currentPassword);
        
        if (!isCurrentPasswordValid) {
          Alert.alert('Erro', 'Senha financeira atual incorreta.');
          setLoading(false);
          return;
        }
      }
      
      // Set the new financial password
      // In a real app, you would call an API to set the new password
      const success = await setNewFinancialPassword(newPassword);
      
      if (success) {
        Alert.alert(
          'Sucesso', 
          `Senha financeira ${hasExistingPassword ? 'alterada' : 'definida'} com sucesso.`,
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível definir a senha financeira. Tente novamente.');
      }
    } catch (error) {
      console.error('Error setting financial password:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao definir a senha financeira.');
    } finally {
      setLoading(false);
    }
  };

  // Mock function to verify current financial password
  const verifyCurrentFinancialPassword = async (password: string): Promise<boolean> => {
    // In a real app, you would call an API to verify the password
    // For this example, we'll just simulate a successful verification
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true); // Always return true for demo purposes
      }, 1000);
    });
  };

  // Mock function to set new financial password
  const setNewFinancialPassword = async (password: string): Promise<boolean> => {
    try {
      // In a real app, you would call an API to set the new password
      // For this example, we'll just update the user_settings table
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user?.id,
          financial_password_enabled: true,
          financial_password_hash: `hashed_${password}`, // In a real app, this would be properly hashed
          updated_at: new Date().toISOString(),
        });
      
      return !error;
    } catch (error) {
      console.error('Error setting financial password:', error);
      return false;
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          {hasExistingPassword ? 'Alterar Senha Financeira' : 'Definir Senha Financeira'}
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          {hasExistingPassword 
            ? 'Digite sua senha financeira atual e a nova senha.' 
            : 'Crie uma senha financeira para proteger suas operações sensíveis.'}
        </Text>

        {hasExistingPassword && (
          <AppTextInput
            label="Senha Financeira Atual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
        )}
        
        <AppTextInput
          label="Nova Senha Financeira"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        
        <AppTextInput
          label="Confirmar Nova Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        
        <Text variant="bodySmall" style={styles.hint}>
          A senha financeira deve ter pelo menos 6 caracteres e incluir pelo menos um número.
        </Text>

        <AppButton 
          mode="contained" 
          onPress={handleSetPassword}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          {hasExistingPassword ? 'Alterar Senha' : 'Definir Senha'}
        </AppButton>
        
        <AppButton 
          onPress={() => router.back()} 
          disabled={loading}
        >
          Cancelar
        </AppButton>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  hint: {
    marginTop: 8,
    marginBottom: 24,
    color: '#666',
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
  },
}); 