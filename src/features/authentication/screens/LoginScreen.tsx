import { useRouter } from 'expo-router';
import { Eye } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
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
import { KingPayLogo } from '../../../components/common/KingPayLogo';
import { useAuthentication } from '../hooks/useAuthentication';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthentication();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLoginSubmit = async () => {
    const success = await login(email, password);
    if (success) {
      router.replace('/(app)');
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <KingPayLogo width={90} height={18} />
          </View>

          <View style={styles.taglineContainer}>
            <Text style={styles.taglineText}>
              Tudo que seu negócio precisa, em um só lugar.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="seuemail@exemplo.com"
                  placeholderTextColor="#9E9E9E"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Sua senha"
                  placeholderTextColor="#9E9E9E"
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
                  <Eye color="#5B5B5B" size={22} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.rememberAccessContainer}>
              <Text style={styles.rememberLabel}>Lembrar acesso</Text>
              <TouchableOpacity
                style={[styles.checkboxBase, rememberMe && styles.checkboxChecked]}
                onPress={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && <View style={styles.checkboxInner} />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLoginSubmit} disabled={isLoading}>
              <Text style={styles.loginButtonText}>{isLoading ? 'Entrando...' : 'Fazer login'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => router.push('/(auth)/forgot-password')}>
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </TouchableOpacity>
            
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F8F9FE', // Fundo lavanda claro
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 40,
    alignItems: 'flex-start',
  },
  taglineContainer: {
    marginTop: 48,
    marginBottom: 60,
  },
  taglineText: {
    fontSize: 40,
    lineHeight: 52,
    color: '#7575B3',
    fontWeight: '400',
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontWeight: '500',
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  rememberAccessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  rememberLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  checkboxBase: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#B0B0B0',
    borderRadius: 6,
  },
  checkboxChecked: {
    backgroundColor: '#1A1AFF',
    borderColor: '#1A1AFF',
  },
  checkboxInner: {
    // Para um checkmark, você pode usar um ícone ou uma View estilizada
  },
  buttonsContainer: {
    width: '100%',
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 54,
    backgroundColor: '#1A1AFF',
    borderRadius: 27,
    marginBottom: 16,
  },
  loginButtonText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  forgotPasswordButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 54,
    borderWidth: 1,
    borderColor: '#D3DFFF', // Borda azul clara
    backgroundColor: '#F8F9FE',
    borderRadius: 27,
  },
  forgotPasswordText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1A1AFF',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});