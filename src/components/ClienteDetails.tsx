import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Cliente } from '../types/clientes';

interface ClienteDetailsProps {
  cliente: Cliente;
  onEdit?: () => void;
  onBack?: () => void;
}

export const ClienteDetails: React.FC<ClienteDetailsProps> = ({
  cliente,
  onEdit,
  onBack
}) => {
  // Formatar CPF/CNPJ
  const formatTaxId = (taxId: string, tipo?: string): string => {
    if (!taxId) return '';
    
    const numerico = taxId.replace(/\D/g, '');
    
    if (tipo === 'PF' || numerico.length === 11) {
      return numerico.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return numerico.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };
  
  // Formatar telefone
  const formatTelefone = (telefone: string): string => {
    if (!telefone) return '';
    
    const numerico = telefone.replace(/\D/g, '');
    
    if (numerico.length === 11) {
      return numerico.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numerico.length === 10) {
      return numerico.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return telefone;
  };
  
  // Formatar CEP
  const formatCep = (cep: string): string => {
    if (!cep) return '';
    
    const numerico = cep.replace(/\D/g, '');
    
    return numerico.replace(/(\d{5})(\d{3})/, '$1-$2');
  };
  
  // Formatar valor monetário
  const formatMoney = (valor?: number): string => {
    if (valor === undefined || valor === null) return 'R$ 0,00';
    
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  // Formatar data
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
        >
          <Ionicons name="arrow-back" size={24} color="#0066CC" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={onEdit}
        >
          <Ionicons name="create-outline" size={20} color="white" />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.clienteHeader}>
        <Text style={styles.clienteName}>{cliente.nome}</Text>
        <View 
          style={[
            styles.statusBadge, 
            cliente.status === 'ativo' 
              ? styles.statusAtivo 
              : cliente.status === 'inativo' 
                ? styles.statusInativo 
                : styles.statusBloqueado
          ]}
        >
          <Text style={styles.statusText}>
            {cliente.status === 'ativo' 
              ? 'Ativo' 
              : cliente.status === 'inativo' 
                ? 'Inativo' 
                : 'Bloqueado'}
          </Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Básicas</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {cliente.tipo === 'PF' ? 'CPF' : 'CNPJ'}:
          </Text>
          <Text style={styles.infoValue}>
            {formatTaxId(cliente.taxId, cliente.tipo)}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo:</Text>
          <Text style={styles.infoValue}>
            {cliente.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
          </Text>
        </View>
        
        {cliente.limite_credito !== undefined && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Limite de Crédito:</Text>
            <Text style={styles.infoValue}>
              {formatMoney(cliente.limite_credito)}
            </Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Cadastrado em:</Text>
          <Text style={styles.infoValue}>
            {formatDate(cliente.created_at)}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Última atualização:</Text>
          <Text style={styles.infoValue}>
            {formatDate(cliente.updated_at)}
          </Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contato</Text>
        
        {cliente.email && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{cliente.email}</Text>
          </View>
        )}
        
        {cliente.telefone && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Telefone:</Text>
            <Text style={styles.infoValue}>
              {formatTelefone(cliente.telefone)}
            </Text>
          </View>
        )}
      </View>
      
      {cliente.endereco && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          
          {cliente.endereco.logradouro && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Logradouro:</Text>
              <Text style={styles.infoValue}>
                {cliente.endereco.logradouro}
                {cliente.endereco.numero ? `, ${cliente.endereco.numero}` : ''}
                {cliente.endereco.complemento ? ` - ${cliente.endereco.complemento}` : ''}
              </Text>
            </View>
          )}
          
          {cliente.endereco.bairro && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Bairro:</Text>
              <Text style={styles.infoValue}>{cliente.endereco.bairro}</Text>
            </View>
          )}
          
          {(cliente.endereco.cidade || cliente.endereco.estado) && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cidade/UF:</Text>
              <Text style={styles.infoValue}>
                {cliente.endereco.cidade || ''}
                {cliente.endereco.cidade && cliente.endereco.estado ? ' - ' : ''}
                {cliente.endereco.estado || ''}
              </Text>
            </View>
          )}
          
          {cliente.endereco.cep && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CEP:</Text>
              <Text style={styles.infoValue}>
                {formatCep(cliente.endereco.cep)}
              </Text>
            </View>
          )}
          
          {cliente.endereco.pais && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>País:</Text>
              <Text style={styles.infoValue}>{cliente.endereco.pais}</Text>
            </View>
          )}
        </View>
      )}
      
      {cliente.observacoes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <Text style={styles.observacoes}>{cliente.observacoes}</Text>
        </View>
      )}
    </ScrollView>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 4,
    fontSize: 16,
    color: '#0066CC',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066CC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  editButtonText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  clienteHeader: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clienteName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusAtivo: {
    backgroundColor: '#28a745',
  },
  statusInativo: {
    backgroundColor: '#ffc107',
  },
  statusBloqueado: {
    backgroundColor: '#dc3545',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
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
  observacoes: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
}); 