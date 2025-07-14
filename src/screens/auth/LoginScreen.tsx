import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';

import { ThemedText } from '../../components/ThemedText';
import { AppButton } from '../../components/common/AppButton';
import { AppTextInput } from '../../components/common/AppTextInput';
import { ScreenLayout } from '../../components/layout/ScreenLayout';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../theme/theme';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signIn } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleLogin = async () => {
    // Clear any previous errors
    setEmailError(null);
    setPasswordError(null);

    // Validate inputs
    let hasError = false;
    
    if (!email) {
      setEmailError('Email é obrigatório');
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email inválido');
      hasError = true;
    }
    
    if (!password) {
      setPasswordError('Senha é obrigatória');
      hasError = true;
    }
    
    if (hasError) {
      return;
    }

    // Attempt login
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        Alert.alert(
          'Erro de Login',
          'Email ou senha incorretos. Por favor, tente novamente.',
        );
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde.'
      );
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenLayout scrollable padding>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.formContainer}>
          <ThemedText type="title" style={styles.title}>
            Bem-vindo(a)!
          </ThemedText>
          
          <ThemedText type="body" style={styles.subtitle}>
            Faça login para continuar
          </ThemedText>
          
          <AppTextInput
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError || undefined}
            leftIcon={
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={isDark ? '#666' : '#999'} 
              />
            }
          />
          
          <AppTextInput
            label="Senha"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(null);
            }}
            secureTextEntry
            error={passwordError || undefined}
            leftIcon={
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color={isDark ? '#666' : '#999'} 
              />
            }
          />
          
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
          >
            <ThemedText>Esqueceu sua senha?</ThemedText>
          </TouchableOpacity>
          
          <AppButton
            title="Entrar"
            onPress={handleLogin}
            disabled={isLoading}
            loading={isLoading}
            fullWidth
          />
          
          <View style={styles.registerContainer}>
            <ThemedText type="body">Não tem uma conta?</ThemedText>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <ThemedText style={{ color: theme.colors.primary, marginLeft: 4 }}>
                Criar conta
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 120,
    height: 120,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});

export default LoginScreen; 