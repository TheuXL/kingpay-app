import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../../contexts/AppContext';
import { walletService } from '../../../features/financial/services';
import { pixKeyService } from '../../../features/pixKeys/services';
// ✅ IMPORTAR UTILITÁRIOS DE VALIDAÇÃO DE TEXTO
import { useRouter } from 'expo-router';
import { SafeView, safeText } from '../../../utils/textValidation';

const { width } = Dimensions.get('window');

interface Movement {
  id: string;
  type: 'income' | 'outcome' | 'pending';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  category: 'pix' | 'card' | 'transfer' | 'anticipation';
}

interface PixKey {
  id: string;
  type: 'email' | 'phone' | 'cpf' | 'random';
  key: string;
  status: 'active' | 'pending' | 'inactive';
  createdAt: string;
}

type TabType = 'extracts' | 'anticipations' | 'transfers' | 'pix-keys';

export default function MovementsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('extracts');
  const [selectedPeriod, setSelectedPeriod] = useState('30 dias');
  
  // Estados para dados reais
  const [movements, setMovements] = useState<Movement[]>([]);
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, [activeTab]);

  /**
   * 🔄 CARREGAR DADOS BASEADO NA TAB ATIVA
   */
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        setError('Usuário não autenticado');
        return;
      }

      const userId = user.id;

      if (activeTab === 'extracts') {
        await loadMovements(userId);
      } else if (activeTab === 'pix-keys') {
        await loadPixKeys(userId);
      }
      // TODO: Implementar antecipações e transferências quando necessário

    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      setError('Falha ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🏦 CARREGAR MOVIMENTAÇÕES DO EXTRATO
   */
  const loadMovements = async (userId: string) => {
    try {
      console.log('🏦 Carregando movimentações do extrato...');
      
      // Corrigido: page = 1, limit = 50
      const extractData = await walletService.getStatement(userId, 1, 50);
      
      console.log('📊 Resultado do extrato:', extractData);

      if (extractData && Array.isArray(extractData.extrato)) {
        // Converter dados do extrato para formato de Movement
        const convertedMovements: Movement[] = extractData.extrato.map((entry: any) => ({
          id: entry.id || Math.random().toString(),
          type: entry.is_credit || entry.entrada ? 'income' : 'outcome',
          description: entry.description || entry.tipo || 'Movimentação',
          amount: Math.abs(entry.amount || entry.value || 0),
          date: entry.date || entry.created_at || new Date().toISOString(),
          status: 'completed',
          category: getCategoryFromDescription(entry.description || entry.tipo)
        }));

        setMovements(convertedMovements);
        console.log(`✅ ${convertedMovements.length} movimentações carregadas`);
      } else {
        console.warn('⚠️ Formato de dados inesperado ou vazio');
        setMovements([]);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar movimentações:', error);
      setError(`Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      throw error;
    }
  };

  /**
   * 🔑 CARREGAR CHAVES PIX
   */
  const loadPixKeys = async (userId: string) => {
    try {
      console.log('🔑 Carregando chaves PIX para usuário:', userId);
      
      const keys = await pixKeyService.getPixKeys();

      console.log('📊 Resultado das chaves PIX:', keys);

      if (keys && Array.isArray(keys)) {
        const convertedKeys: PixKey[] = keys.map((key: any) => ({
          id: key.id || Math.random().toString(),
          type: key.type || 'random',
          key: key.key || key.pix_key || '',
          status: key.v ? 'active' : 'pending', // 'v' indica se está verificada/aprovada
          createdAt: key.createdat || key.created_at || new Date().toISOString()
        }));

        setPixKeys(convertedKeys);
        console.log('✅ Chaves PIX carregadas com sucesso:', convertedKeys.length);
      } else {
        console.log('⚠️ Nenhuma chave PIX encontrada ou erro');
        setPixKeys([]);
      }

    } catch (error) {
      console.error('❌ Erro ao carregar chaves PIX:', error);
      setPixKeys([]);
    }
  };



  /**
   * 🎯 DETERMINAR CATEGORIA BASEADA NA DESCRIÇÃO
   */
  const getCategoryFromDescription = (description: string): 'pix' | 'card' | 'transfer' | 'anticipation' => {
    if (!description) return 'transfer';
    
    const desc = description.toLowerCase();
    if (desc.includes('pix')) return 'pix';
    if (desc.includes('cart') || desc.includes('card')) return 'card';
    if (desc.includes('antecip')) return 'anticipation';
    return 'transfer';
  };



  /**
   * 🔄 REFRESH DOS DADOS
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getMovementIcon = (category: string) => {
    switch (category) {
      case 'pix':
        return 'flash';
      case 'card':
        return 'card';
      case 'transfer':
        return 'swap-horizontal';
      case 'anticipation':
        return 'trending-up';
      default:
        return 'ellipse';
    }
  };

  const getPixKeyIcon = (type: string) => {
    switch (type) {
      case 'email':
        return 'mail';
      case 'phone':
        return 'call';
      case 'cpf':
        return 'person';
      case 'random':
        return 'key';
      default:
        return 'ellipse';
    }
  };

  const renderMovementItem = ({ item }: { item: Movement }) => (
    <TouchableOpacity style={styles.movementItem}>
      <SafeView style={styles.movementLeft}>
        <View style={[
          styles.movementIcon,
          { backgroundColor: item.type === 'income' ? '#4CAF5020' : item.type === 'outcome' ? '#F4433620' : '#FF980020' }
        ]}>
          <Ionicons 
            name={getMovementIcon(item.category) as any} 
            size={20} 
            color={item.type === 'income' ? '#4CAF50' : item.type === 'outcome' ? '#F44336' : '#FF9800'} 
          />
        </View>
        <View style={styles.movementInfo}>
          {safeText(item.description, 'Movimentação', styles.movementDescription)}
          {safeText(formatDate(item.date), '--', styles.movementDate)}
        </View>
      </SafeView>
      <SafeView style={styles.movementRight}>
        <Text style={[
          styles.movementAmount,
          { color: item.type === 'income' ? '#4CAF50' : item.type === 'outcome' ? '#F44336' : '#FF9800' }
        ]}>
          {item.type === 'outcome' ? '-' : '+'}
          {formatCurrency(item.amount)}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'completed' ? '#4CAF5020' : item.status === 'pending' ? '#FF980020' : '#F4433620' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.status === 'completed' ? '#4CAF50' : item.status === 'pending' ? '#FF9800' : '#F44336' }
          ]}>
            {item.status === 'completed' ? 'Concluído' : item.status === 'pending' ? 'Pendente' : 'Falhou'}
          </Text>
        </View>
      </SafeView>
    </TouchableOpacity>
  );

  const renderPixKeyItem = ({ item }: { item: PixKey }) => (
    <TouchableOpacity style={styles.pixKeyItem}>
      <SafeView style={styles.pixKeyLeft}>
        <View style={styles.pixKeyIcon}>
          <Ionicons name={getPixKeyIcon(item.type) as any} size={20} color="#4CAF50" />
        </View>
        <View style={styles.pixKeyInfo}>
          <Text style={styles.pixKeyType}>
            {item.type === 'email' ? 'E-mail' : item.type === 'phone' ? 'Telefone' : item.type === 'cpf' ? 'CPF' : 'Chave aleatória'}
          </Text>
          {safeText(item.key, 'Chave não informada', styles.pixKeyValue)}
          {safeText(`Criada em ${formatDate(item.createdAt)}`, '--', styles.pixKeyDate)}
        </View>
      </SafeView>
      <SafeView style={styles.pixKeyRight}>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'active' ? '#4CAF5020' : item.status === 'pending' ? '#FF980020' : '#F4433620' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.status === 'active' ? '#4CAF50' : item.status === 'pending' ? '#FF9800' : '#F44336' }
          ]}>
            {item.status === 'active' ? 'Ativa' : item.status === 'pending' ? 'Pendente' : 'Inativa'}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </SafeView>
    </TouchableOpacity>
  );

  const navigateToAllTransactions = () => {
    router.push('/(app)/(tabs)/transactions');
  }

  const navigateToAddPixKey = () => {
    // A rota para adicionar chave pix na área de admin
    router.push('/(app)/admin/pix-keys');
  }

  const renderTabContent = () => {
    if (loading && refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF9800" />
          <Text style={styles.errorTitle}>{error}</Text>
          <TouchableOpacity style={styles.errorButton} onPress={onRefresh}>
            <Text style={styles.errorButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    switch (activeTab) {
      case 'extracts':
        return (
          <FlatList
            data={movements}
            renderItem={renderMovementItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4CAF50']} />
            }
          />
        );
      
      case 'anticipations':
        const anticipations = movements.filter(m => m.category === 'anticipation');
        return (
          <View style={styles.tabContent}>
            {anticipations.length > 0 ? (
              <FlatList
                data={anticipations}
                renderItem={renderMovementItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="trending-up-outline" size={48} color="#ccc" />
                <Text style={styles.emptyTitle}>Nenhuma antecipação</Text>
                <Text style={styles.emptyDescription}>
                  Você ainda não solicitou nenhuma antecipação
                </Text>
                <TouchableOpacity style={styles.emptyButton}>
                  <Text style={styles.emptyButtonText}>Solicitar antecipação</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      
      case 'transfers':
        const transfers = movements.filter(m => m.category === 'transfer');
        return (
          <View style={styles.tabContent}>
            {transfers.length > 0 ? (
              <FlatList
                data={transfers}
                renderItem={renderMovementItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="swap-horizontal-outline" size={48} color="#ccc" />
                <Text style={styles.emptyTitle}>Nenhuma transferência</Text>
                <Text style={styles.emptyDescription}>
                  Você ainda não realizou nenhuma transferência
                </Text>
                <TouchableOpacity style={styles.emptyButton}>
                  <Text style={styles.emptyButtonText}>Nova transferência</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      
      case 'pix-keys':
        return (
          <View style={styles.tabContent}>
            <View style={styles.pixKeysHeader}>
              <Text style={styles.pixKeysTitle}>Suas chaves PIX</Text>
              <TouchableOpacity style={styles.addKeyButton} onPress={navigateToAddPixKey}>
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.addKeyText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={pixKeys}
              renderItem={renderPixKeyItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4CAF50']} />
              }
            />
            <View style={styles.pixKeysStats}>
              <View style={styles.statItem}>
                {safeText(pixKeys.length.toString(), '0', styles.statNumber)}
                <Text style={styles.statLabel}>Total de chaves</Text>
              </View>
              <View style={styles.statItem}>
                {safeText(pixKeys.filter(k => k.status === 'active').length.toString(), '0', styles.statNumber)}
                <Text style={styles.statLabel}>Chaves ativas</Text>
              </View>
              <View style={styles.statItem}>
                {safeText(Math.max(0, 5 - pixKeys.length).toString(), '5', styles.statNumber)}
                <Text style={styles.statLabel}>Chaves disponíveis</Text>
              </View>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📊 Movimentações</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={navigateToAllTransactions}>
            <Ionicons name="grid-outline" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="funnel-outline" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        <View style={styles.tabs}>
          {[
            { id: 'extracts', label: 'Extratos', icon: 'document-text-outline' },
            { id: 'anticipations', label: 'Antecipações', icon: 'trending-up-outline' },
            { id: 'transfers', label: 'Transferências', icon: 'swap-horizontal-outline' },
            { id: 'pix-keys', label: 'Chaves PIX', icon: 'key-outline' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id as TabType)}
            >
              <Ionicons 
                name={tab.icon as any} 
                size={16} 
                color={activeTab === tab.id ? '#4CAF50' : '#666'} 
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Period Filter */}
      {activeTab !== 'pix-keys' && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['7 dias', '30 dias', '90 dias', 'Este ano'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive,
                  ]}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Tab Content */}
      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tabs: {
    flexDirection: 'row',
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#4CAF5020',
    borderColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'white',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  periodButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  periodButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContent: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  movementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  movementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  movementIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  movementInfo: {
    flex: 1,
  },
  movementDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  movementDate: {
    fontSize: 14,
    color: '#666',
  },
  movementRight: {
    alignItems: 'flex-end',
  },
  movementAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  pixKeysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pixKeysTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addKeyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addKeyText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  pixKeyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  pixKeyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pixKeyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#4CAF5020',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pixKeyInfo: {
    flex: 1,
  },
  pixKeyType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  pixKeyValue: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  pixKeyDate: {
    fontSize: 12,
    color: '#999',
  },
  pixKeyRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  moreButton: {
    padding: 4,
  },
  pixKeysStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
    marginTop: 16,
    marginBottom: 8,
  },
  errorButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
}); 