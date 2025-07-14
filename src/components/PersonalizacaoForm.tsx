import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useConfiguracoesStore } from '../stores/configuracoesStore';
import { Personalizacao } from '../types/configuracoes';

interface PersonalizacaoFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isAdmin?: boolean;
}

export const PersonalizacaoForm: React.FC<PersonalizacaoFormProps> = ({
  onSuccess,
  onCancel,
  isAdmin = false
}) => {
  const {
    personalizacao,
    loadingPersonalizacao,
    error,
    fetchPersonalizacao,
    updatePersonalizacao,
    resetError
  } = useConfiguracoesStore();

  const [form, setForm] = useState<Partial<Personalizacao>>({
    primary_color: '',
    secondary_color: '',
    logo_url: '',
    app_name: '',
    favicon_url: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPersonalizacao();
    
    return () => {
      resetError();
    };
  }, []);

  useEffect(() => {
    if (personalizacao) {
      setForm({
        primary_color: personalizacao.primary_color,
        secondary_color: personalizacao.secondary_color || '',
        logo_url: personalizacao.logo_url || '',
        app_name: personalizacao.app_name || '',
        favicon_url: personalizacao.favicon_url || ''
      });
    }
  }, [personalizacao]);

  const handleChange = (key: keyof Personalizacao, value: string) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const isValidHexColor = (color: string) => {
    return /^#[0-9A-F]{6}$/i.test(color);
  };

  const isValidUrl = (url: string) => {
    if (!url) return true; // URL vazia é permitida
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const validateForm = () => {
    if (!form.primary_color) {
      Alert.alert('Erro', 'A cor primária é obrigatória');
      return false;
    }

    if (!isValidHexColor(form.primary_color)) {
      Alert.alert('Erro', 'Formato de cor primária inválido. Use formato hexadecimal (#RRGGBB)');
      return false;
    }

    if (form.secondary_color && !isValidHexColor(form.secondary_color)) {
      Alert.alert('Erro', 'Formato de cor secundária inválido. Use formato hexadecimal (#RRGGBB)');
      return false;
    }

    if (form.logo_url && !isValidUrl(form.logo_url)) {
      Alert.alert('Erro', 'URL do logo inválida');
      return false;
    }

    if (form.favicon_url && !isValidUrl(form.favicon_url)) {
      Alert.alert('Erro', 'URL do favicon inválida');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const success = await updatePersonalizacao(form);
      if (success) {
        Alert.alert('Sucesso', 'Configurações de personalização atualizadas com sucesso!');
        if (onSuccess) onSuccess();
      } else {
        Alert.alert('Erro', error || 'Erro ao salvar as configurações de personalização');
      }
    } catch (e) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar as configurações de personalização');
    } finally {
      setSaving(false);
    }
  };

  if (loadingPersonalizacao && !personalizacao) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Carregando configurações de personalização...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Configurações de Personalização</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Cor Primária *</Text>
        <TextInput
          style={styles.input}
          value={form.primary_color}
          onChangeText={(value) => handleChange('primary_color', value)}
          placeholder="#RRGGBB"
          editable={isAdmin}
        />
        <View style={[styles.colorPreview, { backgroundColor: form.primary_color }]} />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Cor Secundária</Text>
        <TextInput
          style={styles.input}
          value={form.secondary_color}
          onChangeText={(value) => handleChange('secondary_color', value)}
          placeholder="#RRGGBB"
          editable={isAdmin}
        />
        {form.secondary_color ? (
          <View style={[styles.colorPreview, { backgroundColor: form.secondary_color }]} />
        ) : null}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nome do Aplicativo</Text>
        <TextInput
          style={styles.input}
          value={form.app_name}
          onChangeText={(value) => handleChange('app_name', value)}
          placeholder="Nome do Aplicativo"
          editable={isAdmin}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>URL do Logo</Text>
        <TextInput
          style={styles.input}
          value={form.logo_url}
          onChangeText={(value) => handleChange('logo_url', value)}
          placeholder="https://exemplo.com/logo.png"
          editable={isAdmin}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>URL do Favicon</Text>
        <TextInput
          style={styles.input}
          value={form.favicon_url}
          onChangeText={(value) => handleChange('favicon_url', value)}
          placeholder="https://exemplo.com/favicon.ico"
          editable={isAdmin}
        />
      </View>

      {isAdmin && (
        <View style={styles.buttonContainer}>
          {onCancel && (
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel} disabled={saving}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit}
            disabled={saving || loadingPersonalizacao}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  formGroup: {
    marginBottom: 20,
    position: 'relative',
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
    color: '#333',
  },
  colorPreview: {
    position: 'absolute',
    right: 10,
    top: 40,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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