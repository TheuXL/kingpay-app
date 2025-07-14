import { useAuth } from '@/contexts/AuthContext';
import { useWebhookStore } from '@/store/webhookStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

const WebhookFormScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { webhooks, addWebhook, updateWebhook, loading, error } = useWebhookStore();

  const webhookId = params.id as string | undefined;
  const isEditing = !!webhookId;

  const [url, setUrl] = useState('');
  const [ativa, setAtiva] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Default events
  const defaultEvents = ['payment.created', 'payment.updated'];
  const [events, setEvents] = useState<string[]>(defaultEvents);

  useEffect(() => {
    if (isEditing) {
      const webhook = webhooks.find((w) => w.id === webhookId);
      if (webhook) {
        setUrl(webhook.url);
        setAtiva(webhook.active);
        setAdmin(webhook.admin || false);
        if (webhook.events && webhook.events.length > 0) {
          setEvents(webhook.events);
        }
      }
    }
  }, [webhookId, webhooks]);

  const validateUrl = (text: string) => {
    // Basic URL validation
    return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(text);
  };

  const handleSubmit = async () => {
    setFormError(null);
    if (!url || !validateUrl(url)) {
      setFormError('Por favor, insira uma URL válida.');
      return;
    }

    if (!user?.id) {
        setFormError('Usuário não autenticado.');
        return;
    }

    const payload = { 
      url, 
      active: ativa, 
      admin, 
      events 
    };
    
    let success = false;
    if (isEditing && webhookId) {
      success = await updateWebhook(webhookId, payload);
    } else {
      success = await addWebhook(payload);
    }

    if (success) {
      router.back();
    } else {
      setFormError(error || 'Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>URL do Webhook</Text>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="https://seu-dominio.com/webhook"
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Webhook Ativo</Text>
          <Switch value={ativa} onValueChange={setAtiva} trackColor={{ false: '#767577', true: '#81b0ff' }} thumbColor={ativa ? '#f5dd4b' : '#f4f3f4'} />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Permissões de Admin</Text>
          <Switch value={admin} onValueChange={setAdmin} trackColor={{ false: '#767577', true: '#81b0ff' }} thumbColor={admin ? '#f5dd4b' : '#f4f3f4'}/>
        </View>
        
        {formError && <Text style={styles.errorText}>{formError}</Text>}

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <Button
              title={isEditing ? 'Salvar Alterações' : 'Criar Webhook'}
              onPress={handleSubmit}
              disabled={loading}
            />
          )}
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
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 20,
  }
});

export default WebhookFormScreen; 