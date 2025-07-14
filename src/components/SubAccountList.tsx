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
import { PaginationOptions, SubAccount, subAccountService } from '../services/subAccountService';
import { formatDate } from '../utils/formatters';

interface SubAccountListProps {
  onSelectSubAccount?: (subAccount: SubAccount) => void;
  onCheckStatus?: (subAccount: SubAccount) => void;
  onCheckKyc?: (subAccount: SubAccount) => void;
  onResendDocuments?: (subAccount: SubAccount) => void;
}

const SubAccountList: React.FC<SubAccountListProps> = ({
  onSelectSubAccount,
  onCheckStatus,
  onCheckKyc,
  onResendDocuments
}) => {
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const loadSubAccounts = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        setOffset(0);
      } else {
        setLoading(true);
      }
      
      setError(null);
      
      const options: PaginationOptions = {
        offset: refresh ? 0 : offset,
        limit,
        status: statusFilter,
        search: searchTerm
      };
      
      const response = await subAccountService.listSubAccounts(options);
      
      if (response.success && response.data) {
        setSubAccounts(response.data.items || []);
        setTotal(response.data.total || 0);
        setHasMore(response.data.hasMore || false);
      } else {
        // Se a API falhar, usar simulação
        console.log('Usando simulação para listar subcontas');
        const simulatedData = subAccountService.simulateListSubAccounts(options);
        setSubAccounts(simulatedData.items);
        setTotal(simulatedData.total);
        setHasMore(simulatedData.hasMore);
      }
    } catch (err) {
      setError('Erro ao carregar subcontas. Tente novamente.');
      console.error('Erro ao carregar subcontas:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSubAccounts();
  }, [offset, statusFilter]);

  const handleSearch = () => {
    setOffset(0);
    loadSubAccounts(true);
  };

  const handleNextPage = () => {
    if (hasMore) {
      setOffset(offset + limit);
    }
  };

  const handlePrevPage = () => {
    if (offset > 0) {
      setOffset(Math.max(0, offset - limit));
    }
  };

  const handleRefresh = () => {
    loadSubAccounts(true);
  };

  const handleCheckStatus = (subAccount: SubAccount) => {
    if (onCheckStatus) {
      onCheckStatus(subAccount);
    } else {
      // Se não houver handler externo, implementar a lógica aqui
      if (!subAccount.token) {
        Alert.alert('Erro', 'Esta subconta não possui token para verificação de status');
        return;
      }
      
      Alert.alert(
        'Verificar Status',
        `Deseja verificar o status da subconta ${subAccount.name}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Verificar',
            onPress: async () => {
              try {
                setLoading(true);
                const response = await subAccountService.checkStatus(subAccount.id, subAccount.token!);
                
                if (response.success && response.data) {
                  Alert.alert(
                    'Status',
                    `Status da subconta: ${response.data.status}\nStatus no provedor: ${response.data.provider_status}`,
                    [{ text: 'OK' }]
                  );
                } else {
                  Alert.alert(
                    'Erro',
                    `Falha ao verificar status: ${response.error?.message || 'Erro desconhecido'}`,
                    [{ text: 'OK' }]
                  );
                }
              } catch (err: any) {
                Alert.alert(
                  'Erro',
                  `Falha ao verificar status: ${err.message || 'Erro desconhecido'}`,
                  [{ text: 'OK' }]
                );
              } finally {
                setLoading(false);
              }
            }
          }
        ]
      );
    }
  };

  const handleCheckKyc = (subAccount: SubAccount) => {
    if (onCheckKyc) {
      onCheckKyc(subAccount);
    } else {
      // Se não houver handler externo, implementar a lógica aqui
      if (!subAccount.token) {
        Alert.alert('Erro', 'Esta subconta não possui token para verificação de KYC');
        return;
      }
      
      Alert.alert(
        'Verificar KYC',
        `Deseja verificar o status KYC da subconta ${subAccount.name}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Verificar',
            onPress: async () => {
              try {
                setLoading(true);
                const response = await subAccountService.checkKyc(subAccount.token!);
                
                if (response.success && response.data) {
                  Alert.alert(
                    'Status KYC',
                    `Status KYC da subconta: ${response.data.kyc_status}\nStatus KYC no provedor: ${response.data.provider_kyc_status}`,
                    [{ text: 'OK' }]
                  );
                } else {
                  Alert.alert(
                    'Erro',
                    `Falha ao verificar status KYC: ${response.error?.message || 'Erro desconhecido'}`,
                    [{ text: 'OK' }]
                  );
                }
              } catch (err: any) {
                Alert.alert(
                  'Erro',
                  `Falha ao verificar status KYC: ${err.message || 'Erro desconhecido'}`,
                  [{ text: 'OK' }]
                );
              } finally {
                setLoading(false);
              }
            }
          }
        ]
      );
    }
  };

  const handleResendDocuments = (subAccount: SubAccount) => {
    if (onResendDocuments) {
      onResendDocuments(subAccount);
    } else {
      // Se não houver handler externo, implementar a lógica aqui
      Alert.alert(
        'Reenviar Documentos',
        `Esta operação requer um formulário para upload de documentos. Deseja continuar?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Continuar',
            onPress: () => {
              // Aqui seria implementado um formulário para upload de documentos
              // Como é complexo para este exemplo, apenas mostramos uma mensagem
              Alert.alert(
                'Informação',
                'Para reenviar documentos, use a tela específica de reenvio de documentos.',
                [{ text: 'OK' }]
              );
            }
          }
        ]
      );
    }
  };

  const renderItem = ({ item }: { item: SubAccount }) => {
    const statusColor = 
      item.status === 'active' ? '#4CAF50' : 
      item.status === 'pending' ? '#FF9800' : 
      item.status === 'rejected' ? '#F44336' : '#9E9E9E';
    
    const statusText = 
      item.status === 'active' ? 'Ativa' : 
      item.status === 'pending' ? 'Pendente' : 
      item.status === 'rejected' ? 'Rejeitada' : 'Suspensa';
    
    const kycStatusColor = 
      item.kyc_status === 'approved' ? '#4CAF50' : 
      item.kyc_status === 'pending' ? '#FF9800' : '#F44336';
    
    const kycStatusText = 
      item.kyc_status === 'approved' ? 'Aprovado' : 
      item.kyc_status === 'pending' ? 'Pendente' : 'Rejeitado';
    
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => onSelectSubAccount && onSelectSubAccount(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.subAccountName}>{item.name}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{statusText}</Text>
            </View>
            {item.kyc_status && (
              <View style={[styles.statusBadge, { backgroundColor: kycStatusColor, marginLeft: 5 }]}>
                <Text style={styles.statusText}>KYC: {kycStatusText}</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>
            {item.company?.name || 'Empresa não especificada'}
          </Text>
          <Text style={styles.acquirerName}>
            Adquirente: {item.acquirer_name || 'Não especificado'}
          </Text>
        </View>
        
        <View style={styles.bankInfo}>
          <Text style={styles.bankText}>
            Banco: {item.bank_code || '-'} | Agência: {item.bank_agency || '-'} | Conta: {item.bank_account || '-'} | Tipo: {item.account_type === 'checking' ? 'Corrente' : 'Poupança'}
          </Text>
        </View>
        
        <Text style={styles.dateText}>
          Criado em: {formatDate(item.created_at)}
        </Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.statusButton]}
            onPress={() => handleCheckStatus(item)}
          >
            <Text style={styles.actionButtonText}>Status</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.kycButton]}
            onPress={() => handleCheckKyc(item)}
          >
            <Text style={styles.actionButtonText}>KYC</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.documentsButton]}
            onPress={() => handleResendDocuments(item)}
          >
            <Text style={styles.actionButtonText}>Documentos</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar subcontas..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
        />
        
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={statusFilter}
            style={styles.picker}
            onValueChange={(itemValue) => setStatusFilter(itemValue as string)}
          >
            <Picker.Item label="Todos os status" value="" />
            <Picker.Item label="Ativas" value="active" />
            <Picker.Item label="Pendentes" value="pending" />
            <Picker.Item label="Rejeitadas" value="rejected" />
            <Picker.Item label="Suspensas" value="suspended" />
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
          <Text style={styles.loadingText}>Carregando subcontas...</Text>
        </View>
      ) : (
        <>
          {subAccounts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma subconta encontrada</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={subAccounts}
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
                  style={[styles.paginationButton, offset === 0 && styles.disabledButton]}
                  onPress={handlePrevPage}
                  disabled={offset === 0}
                >
                  <Text style={styles.paginationButtonText}>Anterior</Text>
                </TouchableOpacity>
                
                <Text style={styles.pageText}>
                  {offset + 1} - {Math.min(offset + limit, total)} de {total}
                </Text>
                
                <TouchableOpacity 
                  style={[styles.paginationButton, !hasMore && styles.disabledButton]}
                  onPress={handleNextPage}
                  disabled={!hasMore}
                >
                  <Text style={styles.paginationButtonText}>Próxima</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      )}
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
    alignItems: 'center',
    marginBottom: 10,
  },
  subAccountName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
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
  companyInfo: {
    marginBottom: 10,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  acquirerName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  bankInfo: {
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 5,
  },
  bankText: {
    fontSize: 12,
    color: '#555',
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
  statusButton: {
    backgroundColor: '#2196F3',
  },
  kycButton: {
    backgroundColor: '#9C27B0',
  },
  documentsButton: {
    backgroundColor: '#FF9800',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
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
});

export default SubAccountList; 