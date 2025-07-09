import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ticketService } from '@/services/ticketService';

interface TicketCreationProps {
  onTicketCreated?: (data: any) => void;
}

export const TicketCreation: React.FC<TicketCreationProps> = ({
  onTicketCreated,
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateTicket = async () => {
    if (!subject || !message) {
      setStatusMessage('Por favor, preencha o assunto e a mensagem.');
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const payload = {
        subject,
        message,
        attachment_url: attachmentUrl || undefined,
      };

      const response = await ticketService.createTicket(payload);
      
      if (response.success) {
        setStatusMessage('Ticket criado com sucesso!');
        setSubject('');
        setMessage('');
        setAttachmentUrl('');
        
        if (onTicketCreated) {
          onTicketCreated(response.data);
        }
      } else {
        setStatusMessage('Erro ao criar ticket. Tente novamente.');
      }
    } catch (error) {
      setStatusMessage('Erro ao criar ticket. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Novo Ticket</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Assunto:</Text>
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="Digite o assunto do ticket"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Mensagem:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={message}
          onChangeText={setMessage}
          placeholder="Descreva seu problema ou solicitação"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>URL do Anexo (opcional):</Text>
        <TextInput
          style={styles.input}
          value={attachmentUrl}
          onChangeText={setAttachmentUrl}
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </View>
      
      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleCreateTicket}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Enviar Ticket</Text>
        )}
      </TouchableOpacity>

      {statusMessage && (
        <Text style={[
          styles.statusMessage, 
          statusMessage.includes('sucesso') ? styles.successMessage : styles.errorMessage
        ]}>
          {statusMessage}
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
  formGroup: {
    marginBottom: 15,
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
  },
  textArea: {
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statusMessage: {
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