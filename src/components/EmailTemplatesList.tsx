import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEmailTemplatesStore } from '../store/emailTemplatesStore';
import { EmailTemplate } from '../types';

interface EmailTemplatesListProps {
  onSelectTemplate: (template: EmailTemplate) => void;
}

export const EmailTemplatesList: React.FC<EmailTemplatesListProps> = ({ onSelectTemplate }) => {
  const { templates, loading, error, fetchEmailTemplates, resetError } = useEmailTemplatesStore();

  useEffect(() => {
    fetchEmailTemplates();
    
    return () => {
      resetError();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Carregando templates...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Erro ao carregar templates</Text>
        <Text style={styles.errorDescription}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchEmailTemplates}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noContentText}>Nenhum template de email disponível</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: EmailTemplate }) => (
    <TouchableOpacity
      style={styles.templateItem}
      onPress={() => onSelectTemplate(item)}
    >
      <View style={styles.templateHeader}>
        <Text style={styles.templateType}>{item.tipo}</Text>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
      <Text style={styles.templateSubject} numberOfLines={1}>
        {item.assunto}
      </Text>
      <Text style={styles.templateSender} numberOfLines={1}>
        De: {item.remetente_nome}
      </Text>
      <Text style={styles.templateBody} numberOfLines={2}>
        {item.email_body}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={templates}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d9534f',
    marginBottom: 10,
  },
  errorDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noContentText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  templateItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007BFF',
    textTransform: 'uppercase',
  },
  templateSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  templateSender: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  templateBody: {
    fontSize: 14,
    color: '#333',
  },
}); 