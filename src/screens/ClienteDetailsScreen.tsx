import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ClienteForm } from '../components/ClienteForm';
import { useClientesStore } from '../store/clientesStore';

export const ClienteDetailsScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const clienteId = params.clienteId as string;
  
  const { selectedCliente, fetchClienteById, loadingDetails, error } = useClientesStore();
  const [modalVisible, setModalVisible] = useState(false);
  
  // Carregar os detalhes do cliente ao montar a tela
  useEffect(() => {
    if (clienteId) {
      fetchClienteById(clienteId);
    }
  }, [clienteId]);
  
  // Função para abrir o modal de edição
  const handleEditCliente = () => {
    setModalVisible(true);
  };
  
  // Função para fechar o modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  
  // Função para salvar o cliente e fechar o modal
  const handleSaveCliente = () => {
    setModalVisible(false);
    // Recarregar os detalhes do cliente após a edição
    if (clienteId) {
      fetchClienteById(clienteId);
    }
  };
  
  // Renderizar tela de carregamento
  if (loadingDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Carregando detalhes do cliente...</Text>
      </View>
    );
  }
  
  // Renderizar tela de erro
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Erro ao carregar cliente</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => clienteId && fetchClienteById(clienteId)}
        >
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Renderizar tela de cliente não encontrado
  if (!selectedCliente) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Cliente não encontrado</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho com título e botão de editar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes do Cliente</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditCliente}
        >
          <Ionicons name="create-outline" size={24} color="#0066CC" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Informações básicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nome:</Text>
            <Text style={styles.infoValue}>{selectedCliente.nome}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {selectedCliente.tipo === 'PF' ? 'CPF:' : 'CNPJ:'}
            </Text>
            <Text style={styles.infoValue}>{selectedCliente.taxId}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tipo:</Text>
            <Text style={styles.infoValue}>
              {selectedCliente.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <View style={[
              styles.statusBadge,
              selectedCliente.status === 'ativo' ? styles.statusAtivo :
              selectedCliente.status === 'inativo' ? styles.statusInativo :
              styles.statusBloqueado
            ]}>
              <Text style={styles.statusText}>
                {selectedCliente.status === 'ativo' ? 'Ativo' :
                 selectedCliente.status === 'inativo' ? 'Inativo' :
                 'Bloqueado'}
              </Text>
            </View>
          </View>
          
          {selectedCliente.email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{selectedCliente.email}</Text>
            </View>
          )}
          
          {selectedCliente.telefone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Telefone:</Text>
              <Text style={styles.infoValue}>{selectedCliente.telefone}</Text>
            </View>
          )}
          
          {selectedCliente.limite_credito !== undefined && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Limite de Crédito:</Text>
              <Text style={styles.infoValue}>
                R$ {selectedCliente.limite_credito.toFixed(2)}
              </Text>
            </View>
          )}
        </View>
        
        {/* Endereço */}
        {selectedCliente.endereco && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Endereço</Text>
            
            {selectedCliente.endereco.logradouro && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Logradouro:</Text>
                <Text style={styles.infoValue}>
                  {selectedCliente.endereco.logradouro}
                  {selectedCliente.endereco.numero ? `, ${selectedCliente.endereco.numero}` : ''}
                </Text>
              </View>
            )}
            
            {selectedCliente.endereco.complemento && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Complemento:</Text>
                <Text style={styles.infoValue}>{selectedCliente.endereco.complemento}</Text>
              </View>
            )}
            
            {selectedCliente.endereco.bairro && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Bairro:</Text>
                <Text style={styles.infoValue}>{selectedCliente.endereco.bairro}</Text>
              </View>
            )}
            
            {(selectedCliente.endereco.cidade || selectedCliente.endereco.estado) && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cidade/UF:</Text>
                <Text style={styles.infoValue}>
                  {selectedCliente.endereco.cidade}
                  {selectedCliente.endereco.estado ? ` - ${selectedCliente.endereco.estado}` : ''}
                </Text>
              </View>
            )}
            
            {selectedCliente.endereco.cep && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CEP:</Text>
                <Text style={styles.infoValue}>{selectedCliente.endereco.cep}</Text>
              </View>
            )}
            
            {selectedCliente.endereco.pais && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>País:</Text>
                <Text style={styles.infoValue}>{selectedCliente.endereco.pais}</Text>
              </View>
            )}
          </View>
        )}
        
        {/* Observações */}
        {selectedCliente.observacoes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <Text style={styles.observacoesText}>{selectedCliente.observacoes}</Text>
          </View>
        )}
        
        {/* Datas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações de Sistema</Text>
          
          {selectedCliente.created_at && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Criado em:</Text>
              <Text style={styles.infoValue}>
                {new Date(selectedCliente.created_at).toLocaleString()}
              </Text>
            </View>
          )}
          
          {selectedCliente.updated_at && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Atualizado em:</Text>
              <Text style={styles.infoValue}>
                {new Date(selectedCliente.updated_at).toLocaleString()}
              </Text>
            </View>
          )}
          
          {selectedCliente.id && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID:</Text>
              <Text style={styles.infoValue}>{selectedCliente.id}</Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Modal para edição do cliente */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <ClienteForm
          cliente={selectedCliente}
          onSave={handleSaveCliente}
          onCancel={handleCloseModal}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButtonHeader: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    width: 120,
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusAtivo: {
    backgroundColor: '#e6f7e6',
  },
  statusInativo: {
    backgroundColor: '#f8f9fa',
  },
  statusBloqueado: {
    backgroundColor: '#fff5f5',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  observacoesText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f8f9fa',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f8f9fa',
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 