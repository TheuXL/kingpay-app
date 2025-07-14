import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { authService, securityCodeService, ticketService } from '../../services';

/**
 * Tela para testar conexões com a API
 */
const ApiTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Testa a autenticação
  const testAuth = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const session = await authService.getSession();
      if (session.error) {
        setError(`Erro na sessão: ${session.error.message}`);
        return;
      }

      setResult(`Sessão válida: ${!!session.session}\nUsuário: ${session.user?.email || 'Não logado'}`);
    } catch (err: any) {
      setError(`Erro: ${err.message || 'Desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  // Testa a geração de código de segurança
  const testSecurityCode = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await securityCodeService.generateCode();
      if (!response.success) {
        setError(`Erro: ${response.error?.message || 'Desconhecido'}`);
        return;
      }

      setResult(`Código gerado: ${response.code}\nExpira em: ${response.expires_at}`);
    } catch (err: any) {
      setError(`Erro: ${err.message || 'Desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  // Testa a listagem de tickets
  const testTickets = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await ticketService.getTickets();
      if (!response.success) {
        setError(`Erro: ${response.error?.message || 'Desconhecido'}`);
        return;
      }

      setResult(`Tickets encontrados: ${JSON.stringify(response.data, null, 2)}`);
    } catch (err: any) {
      setError(`Erro: ${err.message || 'Desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Teste de API" />
        <Card.Content>
          <Text style={styles.description}>
            Esta tela permite testar a conexão com diferentes endpoints da API.
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={testAuth}
              disabled={loading}
              style={styles.button}
            >
              Testar Auth
            </Button>
            
            <Button
              mode="contained"
              onPress={testSecurityCode}
              disabled={loading}
              style={styles.button}
            >
              Testar Código de Segurança
            </Button>
            
            <Button
              mode="contained"
              onPress={testTickets}
              disabled={loading}
              style={styles.button}
            >
              Testar Tickets
            </Button>
          </View>

          {loading && <ActivityIndicator style={styles.loading} />}

          {result && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Resultado:</Text>
              <Text style={styles.resultText}>{result}</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Erro:</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginVertical: 16,
  },
  button: {
    marginBottom: 8,
  },
  loading: {
    marginVertical: 16,
  },
  resultContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
  },
  resultTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultText: {
    fontFamily: 'monospace',
  },
  errorContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
  },
  errorTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#c62828',
  },
  errorText: {
    color: '#c62828',
  },
});

export default ApiTest; 