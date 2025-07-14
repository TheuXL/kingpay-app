import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useConfiguracoesStore } from '../stores/configuracoesStore';

interface TermosDeUsoScreenProps {
  onAccept?: () => void;
  onDecline?: () => void;
  showButtons?: boolean;
}

export const TermosDeUsoScreen: React.FC<TermosDeUsoScreenProps> = ({
  onAccept,
  onDecline,
  showButtons = true,
}) => {
  const { termosDeUso, loadingTermos, error, fetchTermosDeUso, resetError } = useConfiguracoesStore();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadTermos = async () => {
      await fetchTermosDeUso();
    };
    
    loadTermos();
    
    return () => {
      resetError();
    };
  }, []);

  useEffect(() => {
    if (error) {
      setHasError(true);
    }
  }, [error]);

  const handleRetry = () => {
    setHasError(false);
    resetError();
    fetchTermosDeUso();
  };

  const renderContent = () => {
    if (loadingTermos) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Carregando termos de uso...</Text>
        </View>
      );
    }

    if (hasError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Erro ao carregar os termos de uso</Text>
          <Text style={styles.errorDescription}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!termosDeUso) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.noContentText}>Nenhum termo de uso disponível</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Termos de Uso</Text>
        <Text style={styles.versao}>Versão: {termosDeUso.versao || '1.0'}</Text>
        <Text style={styles.data}>
          Atualizado em: {termosDeUso.data_atualizacao
            ? new Date(termosDeUso.data_atualizacao).toLocaleDateString('pt-BR')
            : new Date().toLocaleDateString('pt-BR')}
        </Text>
        <Text style={styles.content}>{termosDeUso.conteudo}</Text>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      
      {showButtons && termosDeUso && !loadingTermos && !hasError && (
        <View style={styles.buttonContainer}>
          {onDecline && (
            <TouchableOpacity style={styles.declineButton} onPress={onDecline}>
              <Text style={styles.declineButtonText}>Recusar</Text>
            </TouchableOpacity>
          )}
          
          {onAccept && (
            <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
              <Text style={styles.acceptButtonText}>Aceitar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
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
  errorText: {
    fontSize: 18,
    color: '#ff3b30',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noContentText: {
    fontSize: 16,
    color: '#555',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  versao: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  data: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    backgroundColor: '#fff',
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  declineButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 