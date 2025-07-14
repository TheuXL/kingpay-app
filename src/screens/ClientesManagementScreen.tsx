import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClienteDetails } from '../components/ClienteDetails';
import { ClienteForm } from '../components/ClienteForm';
import { ClientesList } from '../components/ClientesList';
import { useClientesStore } from '../stores/clientesStore';
import { Cliente } from '../types/clientes';

export const ClientesManagementScreen: React.FC = () => {
  // Estados para controlar as modais
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Acesso à store de clientes
  const { clienteAtual, clearClienteAtual } = useClientesStore();
  
  // Funções para manipular modais
  const handleAddCliente = () => {
    clearClienteAtual();
    setShowAddModal(true);
  };
  
  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };
  
  const handleSaveCliente = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDetailsModal(false);
  };
  
  const handleSelectCliente = (cliente: Cliente) => {
    setShowDetailsModal(true);
  };
  
  const handleEditCliente = () => {
    setShowDetailsModal(false);
    setShowEditModal(true);
  };
  
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
  };
  
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setShowDetailsModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciamento de Clientes</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddCliente}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Novo Cliente</Text>
        </TouchableOpacity>
      </View>
      
      <ClientesList onSelectCliente={handleSelectCliente} />
      
      {/* Modal para adicionar cliente */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        onRequestClose={handleCloseAddModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ClienteForm
            onSave={handleSaveCliente}
            onCancel={handleCloseAddModal}
          />
        </SafeAreaView>
      </Modal>
      
      {/* Modal para editar cliente */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        onRequestClose={handleCloseEditModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ClienteForm
            cliente={clienteAtual || undefined}
            onSave={handleSaveCliente}
            onCancel={handleCloseEditModal}
          />
        </SafeAreaView>
      </Modal>
      
      {/* Modal para visualizar detalhes do cliente */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        onRequestClose={handleCloseDetailsModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          {clienteAtual && (
            <ClienteDetails
              cliente={clienteAtual}
              onEdit={handleEditCliente}
              onBack={handleCloseDetailsModal}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066CC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
}); 