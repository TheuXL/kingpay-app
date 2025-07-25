/**
 * 💳 TELA DE TRANSAÇÕES - KINGPAY
 * ===============================
 * 
 * Tela de transações seguindo o fluxograma com:
 * - Tabela de transações
 * - Filtros (vendas aprovadas, abandonadas, comissão, estornos)
 * - Integração com dados reais
 */

import React, { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../../contexts/AppContext';
import { formatCurrency } from '../../../utils/currency';
import { getTransactionHistory } from '../services';
// ✅ IMPORTAR UTILITÁRIOS DE VALIDAÇÃO DE TEXTO

interface TransactionData {
  id: string;
  description: string;
  amount: number;
  status: 'waiting_payment' | 'paid' | 'chargedback' | 'refunded' | 'refused' | 'canceled' | 'expired';
  created_at: string;
  payment_method: 'PIX' | 'CARD' | 'BOLETO';
  customer_name?: string;
  transaction_id?: string;
}

type FilterType = 'all' | 'paid' | 'refused' | 'chargedback';

const FilterTabs = ({ activeFilter, onFilterChange, stats }: { activeFilter: FilterType, onFilterChange: (filter: FilterType) => void, stats: any }) => (
    <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
            <TouchableOpacity onPress={() => onFilterChange('all')} style={[styles.filterTab, activeFilter === 'all' && styles.filterTabActive]}>
                <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>Todas ({stats.total})</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onFilterChange('paid')} style={[styles.filterTab, activeFilter === 'paid' && styles.filterTabActive]}>
                <Text style={[styles.filterText, activeFilter === 'paid' && styles.filterTextActive]}>Aprovadas ({stats.approved})</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onFilterChange('refused')} style={[styles.filterTab, activeFilter === 'refused' && styles.filterTabActive]}>
                <Text style={[styles.filterText, activeFilter === 'refused' && styles.filterTextActive]}>Recusadas ({stats.refused})</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onFilterChange('chargedback')} style={[styles.filterTab, activeFilter === 'chargedback' && styles.filterTabActive]}>
                <Text style={[styles.filterText, activeFilter === 'chargedback' && styles.filterTextActive]}>Estornos ({stats.chargeback})</Text>
            </TouchableOpacity>
        </ScrollView>
    </View>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return '#4CAF50';
    case 'waiting_payment': return '#FF9800';
    case 'refused': return '#f44336';
    case 'chargedback': return '#9C27B0';
    case 'canceled': 
    case 'expired': return '#757575';
    default: return '#666';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'paid': return 'Pago';
    case 'waiting_payment': return 'Aguardando';
    case 'refused': return 'Recusado';
    case 'chargedback': return 'Estorno';
    case 'canceled': return 'Cancelado';
    case 'expired': return 'Expirado';
    default: return status;
  }
};

const TransactionItem = ({ item }: { item: TransactionData }) => {
    return (
        <View style={styles.transactionItem}>
            <View style={styles.transactionHeader}>
                <Text style={styles.transactionDescription}>{item.description}</Text>
                <Text style={styles.amountText}>{formatCurrency(item.amount)}</Text>
            </View>
            <View style={styles.transactionFooter}>
                <Text style={styles.transactionDate}>{new Date(item.created_at).toLocaleString('pt-BR')}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                </View>
            </View>
        </View>
    )
};

export const TransactionsScreen: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Estatísticas resumidas
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    abandoned: 0,
    commission: 0,
    chargeback: 0,
    refused: 0,
    totalAmount: 0,
  });

  const loadTransactions = async (filter: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`[REQUEST] Buscando transações com filtro: ${filter}`);
      const response = await getTransactionHistory({ status: filter === 'all' ? undefined : filter });
      console.log(`[RESPONSE] Resposta crua da API:`, JSON.stringify(response, null, 2));

      if (response && response.data) {
        const convertedTransactions: TransactionData[] = response.data
          .filter((transaction: any) => transaction.id && transaction.chargedamount)
          .map((transaction: any) => ({
        id: transaction.id,
            description: transaction.items?.[0]?.title || 'Transação',
            amount: transaction.chargedamount,
        status: transaction.status as TransactionData['status'],
            created_at: transaction.createdat || new Date().toISOString(), // CORRIGIDO: de createdAt para createdat
            payment_method: (transaction.paymentMethod || 'N/A').toUpperCase() as TransactionData['payment_method'],
            customer_name: transaction.client_name || 'Não identificado', 
        transaction_id: transaction.id
      }));

        console.log(`[RENDER_DATA] Dados convertidos para renderização:`, JSON.stringify(convertedTransactions, null, 2));

        if (convertedTransactions.length > 0) {
          console.log(`[SOURCE] Decisão: Renderizando ${convertedTransactions.length} transações da API.`);
      setTransactions(convertedTransactions);
          calculateStats(convertedTransactions); // ADICIONADO: para atualizar os contadores
        } else {
          console.log(`[SOURCE] Decisão: Renderizando estado vazio (API não retornou transações válidas).`);
          setTransactions([]);
          calculateStats([]); // ADICIONADO: para limpar os contadores
        }
      } else {
        console.warn('[SOURCE] Decisão: Resposta da API inválida ou sem array de transações. Renderizando estado vazio.');
        setTransactions([]);
        calculateStats([]); // ADICIONADO: para limpar os contadores
      }
    } catch (err) {
      console.error("[ERROR] Falha ao buscar transações:", err);
      setError('Não foi possível carregar as transações.');
      console.log('[SOURCE] Decisão: Renderizando estado de erro.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: TransactionData[]) => {
    const newStats = {
      total: data.length,
      approved: data.filter(t => t.status === 'paid').length,
      abandoned: data.filter(t => ['canceled', 'expired'].includes(t.status)).length,
      commission: data.filter(t => t.status === 'paid').length,
      chargeback: data.filter(t => t.status === 'chargedback').length,
      refused: data.filter(t => t.status === 'refused').length,
      totalAmount: data.reduce((sum, t) => sum + t.amount, 0),
    };
    setStats(newStats);
  };

  const applyFilter = (filter: FilterType, data?: TransactionData[]) => {
    const targetData = data || transactions;
    let filtered = targetData;

    switch (filter) {
      case 'paid':
        filtered = targetData.filter(t => t.status === 'paid');
        break;
      case 'refused':
        filtered = targetData.filter(t => t.status === 'refused');
        break;
      case 'chargedback':
        filtered = targetData.filter(t => t.status === 'chargedback');
        break;
      default:
        filtered = targetData;
    }

    if (searchText) {
      filtered = filtered.filter(t => 
        t.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        t.customer_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        t.transaction_id?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
    setActiveFilter(filter);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions(activeFilter);
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    applyFilter(activeFilter, transactions);
  };

  useEffect(() => {
    loadTransactions('all'); // Carrega todas as transações ao iniciar
  }, []);

  const renderTransactionItem = ({ item }: { item: TransactionData }) => <TransactionItem item={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transações</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar transações..."
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
      <FilterTabs activeFilter={activeFilter} onFilterChange={applyFilter} stats={stats} />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Carregando transações...' : 'Nenhuma transação encontrada'}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#101828',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  searchInput: {
    height: 48,
    backgroundColor: '#f2f4f7',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingBottom: 10,
  },
  filtersContent: {
    paddingHorizontal: 15,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f2f4f7',
  },
  filterTabActive: {
    backgroundColor: '#1a73e8',
  },
  filterText: {
    color: '#495057',
    fontWeight: '600',
  },
  filterTextActive: {
    color: 'white',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  transactionItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#344054',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#101828',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 14,
    color: '#667085',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
  },
}); 