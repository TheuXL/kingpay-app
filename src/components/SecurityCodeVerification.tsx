import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { securityCodeService } from '@/services/securityCodeService';

interface SecurityCodeVerificationProps {
  onVerificationComplete?: () => void;
}

export const SecurityCodeVerification: React.FC<SecurityCodeVerificationProps> = ({
  onVerificationComplete,
}) => {
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleGenerateCode = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await securityCodeService.generateCode();
      
      if (response.success && response.code) {
        setGeneratedCode(response.code);
        setExpiresAt(response.expires_at || null);
        setMessage('Código de segurança gerado com sucesso.');
      } else {
        setMessage('Erro ao gerar código de segurança.');
      }
    } catch (error) {
      setMessage('Erro ao gerar código de segurança.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      setMessage('Por favor, insira o código de segurança.');
      return;
    }

    setVerifying(true);
    setMessage(null);

    try {
      const response = await securityCodeService.validateCode(code);
      
      if (response.success) {
        setMessage('Código validado com sucesso!');
        if (onVerificationComplete) {
          onVerificationComplete();
        }
      } else {
        setMessage(response.message || 'Código inválido ou expirado.');
      }
    } catch (error) {
      setMessage('Erro ao validar código de segurança.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificação de Código de Segurança</Text>
      
      <View style={styles.generateSection}>
        <TouchableOpacity 
          style={styles.generateButton} 
          onPress={handleGenerateCode}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Gerar Código</Text>
          )}
        </TouchableOpacity>
        
        {generatedCode && (
          <View style={styles.codeDisplay}>
            <Text style={styles.codeText}>{generatedCode}</Text>
            {expiresAt && (
              <Text style={styles.expiryText}>
                Expira em: {new Date(expiresAt).toLocaleString()}
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.verifySection}>
        <Text style={styles.label}>Digite o código de segurança:</Text>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="Digite o código"
          autoCapitalize="characters"
        />
        
        <TouchableOpacity 
          style={styles.verifyButton} 
          onPress={handleVerifyCode}
          disabled={verifying || !code}
        >
          {verifying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verificar Código</Text>
          )}
        </TouchableOpacity>
      </View>

      {message && (
        <Text style={[
          styles.message, 
          message.includes('sucesso') ? styles.successMessage : styles.errorMessage
        ]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  generateSection: {
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  codeDisplay: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#e8f5e9',
    borderRadius: 6,
    alignItems: 'center',
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  expiryText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  verifySection: {
    marginTop: 10,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  verifyButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  message: {
    marginTop: 15,
    padding: 10,
    borderRadius: 6,
    textAlign: 'center',
  },
  successMessage: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
}); 