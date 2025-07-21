import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../components/common/Button';
import { FormInput } from '../../../components/common/FormInput';
import { authService } from '../services/authService';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    setLoading(true);
    const { success, error } = await authService.resetPassword(email);
    setLoading(false);

    if (success) {
      Alert.alert(
        'E-mail Enviado',
        'Se o e-mail estiver correto, você receberá um link para redefinir sua senha.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert('Erro', error?.message || 'Não foi possível enviar o e-mail de recuperação.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      <Text style={styles.subtitle}>
        Digite seu e-mail para enviarmos um link de recuperação.
      </Text>
      <FormInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="seuemail@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button
        title={loading ? 'Enviando...' : 'Enviar E-mail'}
        onPress={handleResetPassword}
        disabled={loading}
      />
      <Text style={styles.link} onPress={() => router.back()}>
        Voltar para o Login
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  link: {
    color: '#007BFF',
    marginTop: 15,
  },
});

export default ForgotPasswordScreen; 