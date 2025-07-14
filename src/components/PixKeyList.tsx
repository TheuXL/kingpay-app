import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { PaginationOptions, PixKey, pixKeyService } from '../services/pixKeyService';
import { formatDate } from '../utils/formatters';

interface PixKeyListProps {
  onSelectPixKey?: (pixKey: PixKey) => void;
  onApprovePixKey?: (pixKey: PixKey, approve: boolean) => void;
}

const PixKeyList: React.FC<PixKeyListProps> = ({ onSelectPixKey, onApprovePixKey }) => {
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [financialPassword, setFinancialPassword] = useState('');
  const [showFinancialPasswordInput, setShowFinancialPasswordInput] = useState(false);
  const [pixKeyToApprove, setPixKeyToApprove] = useState<{ key: PixKey, approve: boolean } | null>(null);

  const loadPixKeys = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        setPage(1);
      } else {
        setLoading(true);
      }
      
      setError(null);
      
      const options: PaginationOptions = {
        page: refresh ? 1 : page,
        limit: 10,
        status: statusFilter,
        search: searchTerm
      };
      
      const response = await pixKeyService.listAllPixKeys(options);
      
      if (response.success && response.data) {
        setPixKeys(response.data.items || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        // Se a API falhar, usar simulação
        console.log('Usando simulação para listar chaves Pix');
        const simulatedData = pixKeyService.simulateListPixKeys(options);
        setPixKeys(simulatedData.items);
        setTotalPages(simulatedData.totalPages);
      }
    } catch (err) {
      setError('Erro ao carregar chaves Pix. Tente novamente.');
      console.error('Erro ao carregar chaves Pix:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPixKeys();
  }, [page, statusFilter]);

  const handleSearch = () => {
    setPage(1);
    loadPixKeys(true);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleRefresh = () => {
    loadPixKeys(true);
  };

  const handleApprovePixKey = (pixKey: PixKey, approve: boolean) => {
    if (onApprovePixKey) {
      // Se o componente pai forneceu uma função de aprovação, usá-la
      onApprovePixKey(pixKey, approve);
    } else {
      // Caso contrário, mostrar input de senha financeira
      setPixKeyToApprove({ key: pixKey, approve });
      setShowFinancialPasswordInput(true);
    }
  };

  const confirmApprovePixKey = async () => {
    if (!pixKeyToApprove) return;
    
    try {
      setLoading(true);
      const { key, approve } = pixKeyToApprove;
      
      const response = await pixKeyService.approvePixKey(
        key.id,
        approve,
        financialPassword
      );
      
      if (response.success) {
        Alert.alert(
          'Sucesso',
          `Chave Pix ${approve ? 'aprovada' : 'reprovada'} com sucesso!`,
          [{ text: 'OK' }]
        );
        
        // Recarregar a lista
        loadPixKeys(true);
      } else {
        Alert.alert(
          'Erro',
          `Falha ao ${approve ? 'aprovar' : 'reprovar'} chave Pix: ${response.error?.message || 'Erro desconhecido'}`,
          [{ text: 'OK' }]
        );
      }
    } catch (err: any) {
      Alert.alert(
        'Erro',
        `Falha ao processar chave Pix: ${err.message || 'Erro desconhecido'}`,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setShowFinancialPasswordInput(false);
      setFinancialPassword('');
      setPixKeyToApprove(null);
    }
  };

  const cancelApprovePixKey = () => {
    setShowFinancialPasswordInput(false);
    setFinancialPassword('');
    setPixKeyToApprove(null);
  };

  const renderItem = ({ item }: { item: PixKey }) => {
    const statusColor = 
      item.status === 'approved' ? '#4CAF50' : 
      item.status === 'pending' ? '#FF9800' : '#F44336';
    
    const statusText = 
      item.status === 'approved' ? 'Aprovada' : 
      item.status === 'pending' ? 'Pendente' : 'Reprovada';
    
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => onSelectPixKey && onSelectPixKey(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.keyType}>{item.key_type.toUpperCase()}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>
        
        <Text style={styles.keyValue}>{item.key_value}</Text>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item.user?.full_name || 'Usuário sem nome'} ({item.user?.email || 'Sem email'})
          </Text>
          {item.company && (
            <Text style={styles.companyName}>Empresa: {item.company.name}</Text>
          )}
        </View>
        
        <Text style={styles.dateText}>
          Criado em: {formatDate(item.created_at)}
        </Text>
        
        {item.status === 'pending' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleApprovePixKey(item, true)}
            >
              <Text style={styles.actionButtonText}>Aprovar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleApprovePixKey(item, false)}
            >
              <Text style={styles.actionButtonText}>Reprovar</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderFinancialPasswordModal = () => {
    if (!showFinancialPasswordInput) return null;
    
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {pixKeyToApprove?.approve ? 'Aprovar' : 'Reprovar'} Chave Pix
          </Text>
          
          <Text style={styles.modalText}>
            Digite sua senha financeira para confirmar esta operação:
          </Text>
          
          <TextInput
            style={styles.passwordInput}
            placeholder="Senha Financeira"
            secureTextEntry
            value={financialPassword}
            onChangeText={setFinancialPassword}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={cancelApprovePixKey}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.confirmButton]}
              onPress={confirmApprovePixKey}
            >
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar chaves Pix..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
        />
        
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={statusFilter}
            style={styles.picker}
            onValueChange={(itemValue) => setStatusFilter(itemValue as any)}
          >
            <Picker.Item label="Todos os status" value="all" />
            <Picker.Item label="Pendentes" value="pending" />
            <Picker.Item label="Aprovadas" value="approved" />
            <Picker.Item label="Reprovadas" value="rejected" />
          </Picker>
        </View>
        
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Carregando chaves Pix...</Text>
        </View>
      ) : (
        <>
          {pixKeys.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma chave Pix encontrada</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={pixKeys}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
              />
              
              <View style={styles.paginationContainer}>
                <TouchableOpacity 
                  style={[styles.paginationButton, page === 1 && styles.disabledButton]}
                  onPress={handlePrevPage}
                  disabled={page === 1}
                >
                  <Text style={styles.paginationButtonText}>Anterior</Text>
                </TouchableOpacity>
                
                <Text style={styles.pageText}>
                  Página {page} de {totalPages}
                </Text>
                
                <TouchableOpacity 
                  style={[styles.paginationButton, page === totalPages && styles.disabledButton]}
                  onPress={handleNextPage}
                  disabled={page === totalPages}
                >
                  <Text style={styles.paginationButtonText}>Próxima</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      )}
      
      {renderFinancialPasswordModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    flex: 2,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  pickerContainer: {
    flex: 1.5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
    marginRight: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  searchButton: {
    backgroundColor: '#0066cc',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#ffebee',
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 10,
  },
  retryText: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  listContent: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  keyType: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  keyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userInfo: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 14,
    color: '#333',
  },
  companyName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    padding: 8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  paginationButton: {
    backgroundColor: '#0066cc',
    padding: 10,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  paginationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageText: {
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 15,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#9e9e9e',
  },
  confirmButton: {
    backgroundColor: '#0066cc',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PixKeyList; 