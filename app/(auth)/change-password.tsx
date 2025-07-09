import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppTextInput } from '@/components/common/AppTextInput';
import { ScreenLayout } from '@/components/layout/ScreenLayout';
import { supabase } from '@/services/supabase';

export default function ChangePasswordScreen() {
  const router = useRouter();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters
    if (password.length < 8) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 8 caracteres.');
      return false;
    }
    
    // Password must contain at least one number
    if (!/\d/.test(password)) {
      Alert.alert('Erro', 'A senha deve conter pelo menos um número.');
      return false;
    }
    
    // Password must contain at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      Alert.alert('Erro', 'A senha deve conter pelo menos uma letra maiúscula.');
      return false;
    }
    
    // Password must contain at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      Alert.alert('Erro', 'A senha deve conter pelo menos uma letra minúscula.');
      return false;
    }
    
    // Password must contain at least one special character
    if (!/[^A-Za-z0-9]/.test(password)) {
      Alert.alert('Erro', 'A senha deve conter pelo menos um caractere especial.');
      return false;
    }
    
    return true;
  };

  const handleChangePassword = async () => {
    // Validate inputs
    if (!currentPassword) {
      Alert.alert('Erro', 'Por favor, digite sua senha atual.');
      return;
    }
    
    if (!newPassword) {
      Alert.alert('Erro', 'Por favor, digite a nova senha.');
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
      // Update the password using Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        Alert.alert('Erro', error.message || 'Não foi possível alterar a senha.');
      } else {
        Alert.alert(
          'Sucesso', 
          'Sua senha foi alterada com sucesso.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao alterar a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Alterar Senha
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          Digite sua senha atual e a nova senha.
        </Text>

        <AppTextInput
          label="Senha Atual"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />
        
        <AppTextInput
          label="Nova Senha"
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
          A senha deve ter pelo menos 8 caracteres e incluir letras maiúsculas, minúsculas, números e caracteres especiais.
        </Text>

        <AppButton 
          mode="contained" 
          onPress={handleChangePassword}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Alterar Senha
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