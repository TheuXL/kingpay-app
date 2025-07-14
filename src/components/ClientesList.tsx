import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useClientesStore } from '../store/clientesStore';
import { Cliente } from '../types/clientes';

interface ClientesListProps {
  onSelectCliente?: (cliente: Cliente) => void;
  onCreateCliente?: () => void;
}

export const ClientesList: React.FC<ClientesListProps> = ({
  onSelectCliente,
  onCreateCliente
}) => {
  // Acesso à store de clientes
  const {
    clientes,
    loading,
    error,
    totalCount,
    limit,
    offset,
    hasMore,
    fetchClientes,
    setFilters,
    filters
  } = useClientesStore();
  
  // Estado local para os filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'taxId'>('nome');
  
  // Carregar clientes ao montar o componente
  useEffect(() => {
    fetchClientes();
  }, []);
  
  // Função para aplicar filtros
  const handleSearch = () => {
    const newFilters = { ...filters };
    
    // Limpar filtros anteriores de busca
    delete newFilters.nome;
    delete newFilters.taxId;
    
    // Aplicar novo filtro
    if (searchTerm) {
      newFilters[searchType] = searchTerm;
    }
    
    setFilters(newFilters);
  };
  
  // Função para limpar filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({});
  };
  
  // Função para carregar mais clientes
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchClientes({
        ...filters,
        offset: offset + limit
      });
    }
  };
  
  // Renderizar item da lista
  const renderItem = ({ item }: { item: Cliente }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onSelectCliente && onSelectCliente(item)}
      >
        <View style={styles.itemContent}>
          <Text style={styles.itemName}>{item.nome}</Text>
          <Text style={styles.itemTaxId}>
            {item.tipo === 'PF' ? 'CPF: ' : 'CNPJ: '}{item.taxId}
          </Text>
          {item.email && <Text style={styles.itemEmail}>{item.email}</Text>}
          
          <View style={styles.itemFooter}>
            <Text style={[
              styles.itemStatus,
              item.status === 'ativo' ? styles.statusAtivo :
              item.status === 'inativo' ? styles.statusInativo :
              styles.statusBloqueado
            ]}>
              {item.status === 'ativo' ? 'Ativo' :
               item.status === 'inativo' ? 'Inativo' :
               'Bloqueado'}
            </Text>
            
            {item.tipo && (
              <Text style={styles.itemTipo}>
                {item.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </Text>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>
    );
  };
  
  // Renderizar separador entre itens
  const renderSeparator = () => (
    <View style={styles.separator} />
  );
  
  // Renderizar rodapé da lista
  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color="#0066CC" />
      </View>
    );
  };
  
  // Renderizar mensagem quando a lista está vazia
  const renderEmpty = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Nenhum cliente encontrado
        </Text>
        <Text style={styles.emptySubText}>
          {Object.keys(filters).length > 0
            ? 'Tente ajustar os filtros de busca'
            : 'Cadastre um novo cliente para começar'}
        </Text>
      </View>
    );
  };
  
  // Renderizar mensagem de erro
  const renderError = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Erro ao carregar clientes</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchClientes(filters)}
        >
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho com título e botão de adicionar */}
      <View style={styles.header}>
        <Text style={styles.title}>Clientes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={onCreateCliente}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Filtros de busca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder={searchType === 'nome' ? 'Buscar por nome...' : 'Buscar por CPF/CNPJ...'}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
          >
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={[
              styles.filterOption,
              searchType === 'nome' && styles.filterOptionActive
            ]}
            onPress={() => setSearchType('nome')}
          >
            <Text style={[
              styles.filterOptionText,
              searchType === 'nome' && styles.filterOptionTextActive
            ]}>
              Nome
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterOption,
              searchType === 'taxId' && styles.filterOptionActive
            ]}
            onPress={() => setSearchType('taxId')}
          >
            <Text style={[
              styles.filterOptionText,
              searchType === 'taxId' && styles.filterOptionTextActive
            ]}>
              CPF/CNPJ
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={handleClearFilters}
          >
            <Text style={styles.clearFiltersText}>Limpar</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Exibir erro se houver */}
      {renderError()}
      
      {/* Contagem de resultados */}
      <View style={styles.resultsCountContainer}>
        <Text style={styles.resultsCountText}>
          {loading ? 'Carregando...' : `${totalCount} cliente(s) encontrado(s)`}
        </Text>
      </View>
      
      {/* Lista de clientes */}
      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id || item.taxId}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        refreshing={loading && offset === 0}
        onRefresh={() => fetchClientes(filters)}
      />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#0066CC',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#0066CC',
    width: 40,
    height: 40,
    borderRadius: 4,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterOptions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  filterOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  filterOptionActive: {
    backgroundColor: '#0066CC',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
  },
  filterOptionTextActive: {
    color: 'white',
  },
  clearFiltersButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#0066CC',
  },
  resultsCountContainer: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  resultsCountText: {
    fontSize: 14,
    color: '#666',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemTaxId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  itemStatus: {
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 8,
  },
  statusAtivo: {
    backgroundColor: '#e6f7e6',
    color: '#28a745',
  },
  statusInativo: {
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
  },
  statusBloqueado: {
    backgroundColor: '#fff5f5',
    color: '#dc3545',
  },
  itemTipo: {
    fontSize: 12,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  footerContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffeeee',
    borderRadius: 4,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 