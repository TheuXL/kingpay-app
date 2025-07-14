import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { ClienteForm } from '../components/ClienteForm';
import { ClientesList } from '../components/ClientesList';
import { Cliente } from '../types/clientes';

export const ClientesScreen: React.FC = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | undefined>(undefined);
  
  // Função para abrir o modal de criação de cliente
  const handleCreateCliente = () => {
    setSelectedCliente(undefined);
    setModalVisible(true);
  };
  
  // Função para abrir a tela de detalhes do cliente
  const handleSelectCliente = (cliente: Cliente) => {
    if (cliente.id) {
      router.push({
        pathname: '/(tabs)/cliente-details' as any,
        params: { clienteId: cliente.id }
      });
    }
  };
  
  // Função para fechar o modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  
  // Função para salvar o cliente e fechar o modal
  const handleSaveCliente = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Lista de clientes */}
      <ClientesList
        onSelectCliente={handleSelectCliente}
        onCreateCliente={handleCreateCliente}
      />
      
      {/* Modal para criação/edição de cliente */}
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
}); 