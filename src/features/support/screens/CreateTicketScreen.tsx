/**
 * 🎫 CRIAR TICKET DE SUPORTE
 * ==========================
 * 
 * Tela para criar um novo ticket de suporte com:
 * - Formulário de assunto e mensagem
 * - Upload de anexos (opcional)
 * - Validação de campos
 * - Integração com supportTicketService
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../contexts/AppContext';
import { supportTicketService } from '../services/supportTicketService';

export default function CreateTicketScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    attachment_url: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Assunto é obrigatório';
    } else if (formData.subject.trim().length < 10) {
      newErrors.subject = 'Assunto deve ter pelo menos 10 caracteres';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Mensagem deve ter pelo menos 20 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Criando ticket de suporte...');

      const result = await supportTicketService.createTicket({
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        attachmentUrl: formData.attachment_url.trim() || undefined,
      });

      if (result) {
        console.log('✅ Ticket criado com sucesso');
        Alert.alert(
          'Sucesso',
          'Ticket de suporte criado com sucesso! Nossa equipe entrará em contato em breve.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        console.error('❌ Erro ao criar ticket');
        Alert.alert(
          'Erro',
          'Erro ao criar ticket de suporte. Tente novamente.'
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('❌ Erro ao criar ticket:', errorMessage);
      Alert.alert('Erro', 'Erro inesperado ao criar ticket. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo que está sendo editado
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Ticket</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          {/* Info Card */}
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="information" size={24} color="#0052cc" />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Como podemos ajudar?</Text>
              <Text style={styles.infoDescription}>
                Descreva seu problema ou dúvida detalhadamente. Nossa equipe de suporte responderá o mais breve possível.
              </Text>
            </View>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            {/* Assunto */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Assunto *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.subject ? styles.inputError : null
                ]}
                value={formData.subject}
                onChangeText={(text) => updateField('subject', text)}
                placeholder="Descreva brevemente o problema"
                maxLength={100}
                returnKeyType="next"
              />
              {errors.subject && (
                <Text style={styles.errorText}>{errors.subject}</Text>
              )}
              <Text style={styles.helperText}>
                {formData.subject.length}/100 caracteres
              </Text>
            </View>

            {/* Mensagem */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Descrição detalhada *
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  errors.message ? styles.inputError : null
                ]}
                value={formData.message}
                onChangeText={(text) => updateField('message', text)}
                placeholder="Descreva seu problema em detalhes:&#10;&#10;• O que aconteceu?&#10;• Quando aconteceu?&#10;• Qual era o resultado esperado?&#10;• Passos para reproduzir o problema (se aplicável)"
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                maxLength={1000}
              />
              {errors.message && (
                <Text style={styles.errorText}>{errors.message}</Text>
              )}
              <Text style={styles.helperText}>
                {formData.message.length}/1000 caracteres
              </Text>
            </View>

            {/* URL do Anexo (opcional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Link do anexo (opcional)
              </Text>
              <TextInput
                style={styles.input}
                value={formData.attachment_url}
                onChangeText={(text) => updateField('attachment_url', text)}
                placeholder="https://..."
                keyboardType="url"
                autoCapitalize="none"
              />
              <Text style={styles.helperText}>
                Cole aqui o link de uma imagem ou documento que ajude a explicar o problema
              </Text>
            </View>

            {/* Categorias Sugeridas */}
            <View style={styles.categoriesContainer}>
              <Text style={styles.categoriesTitle}>Categorias comuns:</Text>
              <View style={styles.categoriesGrid}>
                {[
                  { icon: 'credit-card', text: 'Problemas com pagamentos' },
                  { icon: 'bank', text: 'Questões financeiras' },
                  { icon: 'account', text: 'Perfil e conta' },
                  { icon: 'cog', text: 'Configurações' },
                  { icon: 'bug', text: 'Erro no sistema' },
                  { icon: 'help-circle', text: 'Dúvidas gerais' },
                ].map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.categoryButton}
                    onPress={() => {
                      if (!formData.subject) {
                        updateField('subject', category.text);
                      }
                    }}
                  >
                    <MaterialCommunityIcons 
                      name={category.icon as any} 
                      size={20} 
                      color="#666" 
                    />
                    <Text style={styles.categoryText}>{category.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Botão de Enviar */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (loading || !formData.subject.trim() || !formData.message.trim()) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={loading || !formData.subject.trim() || !formData.message.trim()}
          >
            {loading ? (
              <MaterialCommunityIcons name="loading" size={20} color="#fff" />
            ) : (
              <MaterialCommunityIcons name="send" size={20} color="#fff" />
            )}
            <Text style={styles.submitButtonText}>
              {loading ? 'Enviando...' : 'Criar Ticket'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0052cc',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  form: {
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#e6f3ff',
    borderWidth: 1,
    borderColor: '#b3d9ff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0052cc',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: '#0052cc',
    lineHeight: 20,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 48,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 120,
    maxHeight: 200,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0052cc',
    paddingVertical: 16,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
