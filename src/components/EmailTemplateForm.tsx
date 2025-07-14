import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useEmailTemplatesStore } from '../store/emailTemplatesStore';
import { EmailTemplate } from '../types';

interface EmailTemplateFormProps {
  template: EmailTemplate;
  onCancel: () => void;
  onSave: () => void;
}

export const EmailTemplateForm: React.FC<EmailTemplateFormProps> = ({
  template,
  onCancel,
  onSave,
}) => {
  const { updating, error, updateEmailTemplate, resetError } = useEmailTemplatesStore();
  
  const [assunto, setAssunto] = useState(template.assunto);
  const [remetenteNome, setRemetenteNome] = useState(template.remetente_nome);
  const [emailBody, setEmailBody] = useState(template.email_body);
  const [formErrors, setFormErrors] = useState<{
    assunto?: string;
    remetenteNome?: string;
    emailBody?: string;
  }>({});

  useEffect(() => {
    return () => {
      resetError();
    };
  }, []);

  const validateForm = () => {
    const errors: {
      assunto?: string;
      remetenteNome?: string;
      emailBody?: string;
    } = {};
    
    if (!assunto.trim()) {
      errors.assunto = 'O assunto é obrigatório';
    }
    
    if (!remetenteNome.trim()) {
      errors.remetenteNome = 'O nome do remetente é obrigatório';
    }
    
    if (!emailBody.trim()) {
      errors.emailBody = 'O conteúdo do email é obrigatório';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    const success = await updateEmailTemplate({
      id: template.id,
      assunto,
      remetente_nome: remetenteNome,
      email_body: emailBody,
    });
    
    if (success) {
      Alert.alert('Sucesso', 'Template de email atualizado com sucesso');
      onSave();
    } else if (error) {
      Alert.alert('Erro', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Editar Template de Email</Text>
        <Text style={styles.templateType}>{template.tipo}</Text>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Assunto</Text>
        <TextInput
          style={formErrors.assunto ? [styles.input, styles.inputError] : styles.input}
          value={assunto}
          onChangeText={setAssunto}
          placeholder="Digite o assunto do email"
        />
        {formErrors.assunto && (
          <Text style={styles.errorText}>{formErrors.assunto}</Text>
        )}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nome do Remetente</Text>
        <TextInput
          style={formErrors.remetenteNome ? [styles.input, styles.inputError] : styles.input}
          value={remetenteNome}
          onChangeText={setRemetenteNome}
          placeholder="Digite o nome do remetente"
        />
        {formErrors.remetenteNome && (
          <Text style={styles.errorText}>{formErrors.remetenteNome}</Text>
        )}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Conteúdo do Email</Text>
        <Text style={styles.helpText}>
          Você pode usar variáveis como {'{company_name}'}, {'{user_name}'}, etc.
        </Text>
        <TextInput
          style={formErrors.emailBody ? [styles.textArea, styles.inputError] : styles.textArea}
          value={emailBody}
          onChangeText={setEmailBody}
          placeholder="Digite o conteúdo do email"
          multiline
          numberOfLines={10}
          textAlignVertical="top"
        />
        {formErrors.emailBody && (
          <Text style={styles.errorText}>{formErrors.emailBody}</Text>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={updating}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  templateType: {
    fontSize: 14,
    color: '#007BFF',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    minHeight: 150,
  },
  inputError: {
    borderColor: '#d9534f',
  },
  errorText: {
    color: '#d9534f',
    fontSize: 12,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 12,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 