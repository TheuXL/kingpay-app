import { useAuthentication } from '@/features/authentication/hooks/useAuthentication';
import { colors } from '@/theme/colors';
import logger from '@/utils/logger';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{email?: string; password?: string}>({});
  
  const { login, isLoading, error, clearError } = useAuthentication();
  const router = useRouter();

  // Log de entrada na tela
  useEffect(() => {
    logger.navigation('App', 'Login');
    logger.component('LoginScreen', 'mounted');
  }, []);

  // Log de mudanças no erro
  useEffect(() => {
    if (error) {
      logger.error('Erro de autenticação exibido', { error });
    }
  }, [error]);

  // Limpar erro quando usuário começar a digitar
  useEffect(() => {
    if (error && (email || password)) {
      clearError();
    }
  }, [email, password, error, clearError]);

  /**
   * ✅ Validar campos do formulário
   */
  const validateForm = (): boolean => {
    const errors: {email?: string; password?: string} = {};
    
    // Validar email
    if (!email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email inválido';
    }
    
    // Validar senha
    if (!password.trim()) {
      errors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setFieldErrors(errors);
    
    const isValid = Object.keys(errors).length === 0;
    
    logger.userAction('Validação de formulário', 'Login', {
      isValid,
      hasEmail: !!email,
      emailValid: !errors.email,
      hasPassword: !!password,
      passwordValid: !errors.password
    });
    
    return isValid;
  };

  /**
   * 🔐 Realizar login
   */
  const handleLogin = async () => {
    logger.userAction('Clique em Login', 'Login', { 
      email: email.substring(0, 3) + '***' // Log apenas parte do email
    });

    // Validar formulário
    if (!validateForm()) {
      logger.warn('Formulário inválido no login', { 
        fieldErrors,
        email: !!email,
        password: !!password
      });
      return;
    }

    logger.auth('Iniciando tentativa de login', { email });

    const result = await login({ email: email.trim(), password });

    if (result.success) {
      logger.success('Login realizado com sucesso', {
        userId: result.user?.id,
        email: result.user?.email,
        hasToken: !!result.access_token
      }, result.user?.id);

      // Navegar para a tela principal
      logger.navigation('Login', 'Home', result.user?.id);
      router.replace('/(app)');
    } else {
      logger.error('Falha no login', { 
        error: result.error,
        email 
      });

      Alert.alert(
        'Erro no Login',
        result.error || 'Não foi possível fazer login. Verifique suas credenciais.',
        [{ text: 'OK', onPress: () => logger.userAction('Clique em OK - Erro Login', 'Login') }]
      );
    }
  };

  /**
   * 👁️ Alternar visibilidade da senha
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    logger.userAction('Toggle visibilidade senha', 'Login', { 
      showPassword: !showPassword 
    });
  };

  /**
   * 📝 Navegar para registro
   */
  const handleGoToRegister = () => {
    logger.userAction('Clique em Criar conta', 'Login');
    logger.navigation('Login', 'Register');
    router.push('/register');
  };

  /**
   * 🔄 Navegar para recuperação de senha
   */
  const handleForgotPassword = () => {
    logger.userAction('Clique em Esqueci a senha', 'Login', { email });
    logger.navigation('Login', 'ForgotPassword');
    router.push('/forgot-password');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.subtitle}>
              Faça login para acessar sua conta
            </Text>
          </View>

          <View style={styles.form}>
            {/* Campo Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={[
                styles.inputWrapper,
                fieldErrors.email ? styles.inputError : {}
              ]}>
                <Feather name="mail" size={20} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu email"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    logger.userAction('Digitando email', 'Login', { 
                      hasContent: !!text 
                    });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {fieldErrors.email && (
                <Text style={styles.errorText}>{fieldErrors.email}</Text>
              )}
            </View>

            {/* Campo Senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <View style={[
                styles.inputWrapper,
                fieldErrors.password ? styles.inputError : {}
              ]}>
                <Feather name="lock" size={20} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Digite sua senha"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    logger.userAction('Digitando senha', 'Login', { 
                      hasContent: !!text 
                    });
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.eyeButton}
                  disabled={isLoading}
                >
                  <Feather 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
              {fieldErrors.password && (
                <Text style={styles.errorText}>{fieldErrors.password}</Text>
              )}
            </View>

            {/* Esqueci a senha */}
            <TouchableOpacity 
              onPress={handleForgotPassword}
              style={styles.forgotButton}
              disabled={isLoading}
            >
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            {/* Erro geral */}
            {error && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Botão de Login */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: colors.primary },
                isLoading && styles.loginButtonDisabled
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            {/* Divisor */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Botão de Registro */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleGoToRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                Não tem uma conta? <Text style={[styles.registerButtonTextBold, { color: colors.primary }]}>
                  Criar conta
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF1FB',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  eyeButton: {
    padding: 4,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 4,
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: colors.textSecondary,
  },
  registerButton: {
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  registerButtonTextBold: {
    fontWeight: 'bold',
  },
}); 