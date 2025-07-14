import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useUtmFyStore } from '../stores/utmfyStore';
import { UtmFyTracker } from '../types/utmfy';

interface UtmFyTrackerFormProps {
  tracker?: UtmFyTracker | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UtmFyTrackerForm: React.FC<UtmFyTrackerFormProps> = ({
  tracker,
  onSuccess,
  onCancel
}) => {
  const { 
    creating, 
    updating, 
    error, 
    createTracker, 
    updateTracker, 
    resetError 
  } = useUtmFyStore();

  const [form, setForm] = useState({
    id: '',
    name: '',
    platform: 'Utmify',
    pixel_id: '',
    api_key: ''
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    pixel_id: '',
    api_key: ''
  });

  useEffect(() => {
    if (tracker) {
      setForm({
        id: tracker.id || '',
        name: tracker.name,
        platform: tracker.platform,
        pixel_id: tracker.pixel_id,
        api_key: tracker.api_key
      });
    }
    
    return () => {
      resetError();
    };
  }, [tracker]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      pixel_id: '',
      api_key: ''
    };
    
    if (!form.name.trim()) {
      newErrors.name = 'Nome do rastreador é obrigatório';
      isValid = false;
    }
    
    if (!form.pixel_id.trim()) {
      newErrors.pixel_id = 'ID do pixel é obrigatório';
      isValid = false;
    }
    
    if (!form.api_key.trim()) {
      newErrors.api_key = 'Chave de API é obrigatória';
      isValid = false;
    }
    
    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      let success;
      
      if (tracker && form.id) {
        // Atualização
        success = await updateTracker({
          id: form.id,
          name: form.name,
          platform: form.platform,
          pixel_id: form.pixel_id,
          api_key: form.api_key
        });
      } else {
        // Criação
        success = await createTracker({
          name: form.name,
          platform: form.platform,
          pixel_id: form.pixel_id,
          api_key: form.api_key
        });
      }
      
      if (success) {
        Alert.alert(
          'Sucesso', 
          tracker ? 'Rastreador atualizado com sucesso!' : 'Rastreador criado com sucesso!'
        );
        if (onSuccess) onSuccess();
      } else if (error) {
        Alert.alert('Erro', error);
      }
    } catch (err) {
      Alert.alert('Erro', 'Ocorreu um erro ao processar sua solicitação.');
    }
  };

  const isLoading = creating || updating;
  const isEditing = !!tracker;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          {isEditing ? 'Editar Rastreador UTM' : 'Novo Rastreador UTM'}
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={[styles.input, formErrors.name ? styles.inputError : null]}
            value={form.name}
            onChangeText={(value) => handleChange('name', value)}
            placeholder="Nome do rastreador"
            editable={!isLoading}
          />
          {formErrors.name ? (
            <Text style={styles.errorText}>{formErrors.name}</Text>
          ) : null}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Plataforma</Text>
          <TextInput
            style={styles.input}
            value={form.platform}
            onChangeText={(value) => handleChange('platform', value)}
            placeholder="Plataforma"
            editable={false} // Fixo como "Utmify"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>ID do Pixel *</Text>
          <TextInput
            style={[styles.input, formErrors.pixel_id ? styles.inputError : null]}
            value={form.pixel_id}
            onChangeText={(value) => handleChange('pixel_id', value)}
            placeholder="ID do pixel"
            editable={!isLoading}
          />
          {formErrors.pixel_id ? (
            <Text style={styles.errorText}>{formErrors.pixel_id}</Text>
          ) : null}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Chave de API *</Text>
          <TextInput
            style={[styles.input, formErrors.api_key ? styles.inputError : null]}
            value={form.api_key}
            onChangeText={(value) => handleChange('api_key', value)}
            placeholder="Chave de API"
            editable={!isLoading}
            secureTextEntry={true}
          />
          {formErrors.api_key ? (
            <Text style={styles.errorText}>{formErrors.api_key}</Text>
          ) : null}
        </View>

        <View style={styles.buttonContainer}>
          {onCancel && (
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onCancel}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Atualizar' : 'Salvar'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 