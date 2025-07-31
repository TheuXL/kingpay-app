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
          <View style={styles.centeredContent}>
            <View style={{ marginBottom: 32 }}>
              <KingPayLogo width={120} height={24} />
            </View>
            <Text style={styles.taglineText}>
              Tudo que seu negócio precisa, em um só lugar.
            </Text>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="seuemail@exemplo.com"
                    placeholderTextColor="#B0B0B0"
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
                    placeholderTextColor="#B0B0B0"
                    secureTextEntry={!isPasswordVisible}
                  />
                  <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
                    <Eye color="#8C8C8C" size={22} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.rememberAccessContainer}>
                <TouchableOpacity
                  style={[styles.checkboxBase, rememberMe && styles.checkboxChecked]}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.8}
                >
                  {rememberMe && <View style={styles.checkboxInner} />}
                </TouchableOpacity>
                <Text style={styles.rememberLabel}>Lembrar acesso</Text>
              </View>

              <TouchableOpacity style={styles.loginButton} onPress={handleLoginSubmit} disabled={isLoading}>
                <Text style={styles.loginButtonText}>{isLoading ? 'Entrando...' : 'Fazer login'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => router.push('/(auth)/forgot-password')}>
                <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
              </TouchableOpacity>

              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
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
    backgroundColor: '#F4F5F7',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
    minHeight: '100%',
  },
  centeredContent: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  logo: {
    marginBottom: 32,
  },
  taglineText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 16,
    color: '#8C8C8C',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    color: '#8C8C8C',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: '#F4F5F7',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 15,
    color: '#00051B',
  },
  rememberAccessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  rememberLabel: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    color: '#8C8C8C',
    marginLeft: 10,
  },
  checkboxBase: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#B0B0B0',
    borderRadius: 6,
    backgroundColor: '#FFF',
  },
  checkboxChecked: {
    backgroundColor: '#1313F2',
    borderColor: '#1313F2',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 48,
    backgroundColor: '#1313F2',
    borderRadius: 24,
    marginBottom: 16,
  },
  loginButtonText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  forgotPasswordButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#D3DFFF',
    backgroundColor: '#F4F5F7',
    borderRadius: 24,
    marginBottom: 0,
  },
  forgotPasswordText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 16,
    color: '#1313F2',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});