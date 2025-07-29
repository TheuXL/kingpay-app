import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../../components/common/Button';
import { FormInput } from '../../../components/common/FormInput';
import { KingPayLogo } from '../../../components/common/KingPayLogo';
import { useAuthentication } from '../hooks/useAuthentication';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthentication();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = async () => {
    // A lógica de negócio permanece a mesma
    const success = await login(email, password);
    if (success) {
      router.replace('/(app)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={['#FFFFFF', '#E6E9FF']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <KingPayLogo width={150} height={40} />
          </View>

          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>
              <Text style={styles.welcomeTextGray}>Tudo que seu negócio precisa, </Text>
              <Text style={styles.welcomeTextBlue}>em um só lugar.</Text>
            </Text>
          </View>

          <View style={styles.cardIllustration}>
            {/* Placeholder para a imagem dos cartões */}
            <View style={styles.cardPlaceholder} />
            <View style={[styles.cardPlaceholder, styles.cardPlaceholderOverlay]} />
          </View>

          {/* Mantendo os campos de login para funcionalidade */}
          <View style={styles.formContainer}>
            <FormInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="seuemail@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <FormInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                placeholder="Sua senha"
                secureTextEntry
            />
             {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <View style={styles.actions}>
            <Button
              title={isLoading ? 'Entrando...' : 'Fazer login'}
              onPress={handleLoginSubmit}
              style={styles.loginButton}
              textStyle={styles.loginButtonText}
              disabled={isLoading}
            />
            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
              <View style={styles.forgotPasswordButton}>
                <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
              </View>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignSelf: 'flex-start',
    marginTop: 60,
    marginBottom: 40,
  },
  welcomeSection: {
    alignSelf: 'flex-start',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: 'sans-serif', // Assumindo uma fonte sem serifa padrão
    fontWeight: '400',
  },
  welcomeTextGray: {
    color: '#6B6B6B',
  },
  welcomeTextBlue: {
    color: '#1A1AFF',
  },
  cardIllustration: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  cardPlaceholder: {
    width: 280,
    height: 160,
    backgroundColor: '#2D3748', // Azul escuro
    borderRadius: 16,
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '-10deg' }],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardPlaceholderOverlay: {
    backgroundColor: '#1A202C', // Preto
    transform: [{ rotate: '10deg' }, { translateX: 40 }, { translateY: -20 }],
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
  },
  loginButton: {
    backgroundColor: '#1A1AFF',
    borderRadius: 24,
    width: '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'sans-serif-medium',
  },
  forgotPasswordButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 255, 0.3)',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  forgotPasswordText: {
    color: '#1A1AFF',
    fontSize: 16,
    fontFamily: 'sans-serif',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
}); 