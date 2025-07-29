import BalanceCarousel from '@/features/financial/components/BalanceCarousel';
import NavigationTabs from '@/features/financial/components/NavigationTabs';
import { useWalletData } from '@/features/financial/hooks/useWalletData';
import { colors } from '@/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Importe os componentes de lista reais que criamos
import { AnticipationsList } from '@/features/anticipations/components/AnticipationsList';
import TransactionItem from '@/features/financial/components/TransactionItem';
import { PixKeysList } from '@/features/pix-keys/components/PixKeysList';
import { formatCurrency, formatShortDate } from '@/utils/formatters';

// Placeholder para a lista de saques (transferências)
const WithdrawalsList = () => <View style={styles.placeholder}><Text>Lista de Saques</Text></View>;

export default function WalletScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('extrato');
  const { financialSummary, walletStatement, isLoading, error, refetch } = useWalletData();

  // Pega apenas as 3 últimas transações para o preview
  const statementPreview = walletStatement.slice(0, 3);

  const renderContent = () => {
    if (isLoading && activeTab === 'extrato' && walletStatement.length === 0) {
        return <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }}/>;
    }

    switch (activeTab) {
      case 'extrato':
        return (
          <View>
            {statementPreview.map(t => (
              <TransactionItem 
                key={t.id}
                type={t.entrada ? 'Entrada' : 'Saída'}
                title={t.tipo}
                subtitle={t.descricao || 'Detalhes da transação'}
                date={formatShortDate(new Date(t.created_at))}
                value={`${t.entrada ? '+' : ''} ${formatCurrency(t.valor)}`}
              />
            ))}
          </View>
        )
      case 'antecipacoes':
        return <AnticipationsList />;
      case 'transferencias':
        return <WithdrawalsList />;
      case 'chaves_pix':
        return <PixKeysList />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Carteira</Text>
      </View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {isLoading && !financialSummary ? (
            <View style={styles.carouselLoading}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        ) : error && !financialSummary ? (
            <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>
        ) : (
            <BalanceCarousel summary={financialSummary} />
        )}
        
        <View style={styles.movementsSection}>
          <View style={styles.movementsHeader}>
            <Text style={styles.movementsTitle}>Movimentações</Text>
            <TouchableOpacity onPress={() => router.push('/transactions')}>
                <Text style={styles.viewAllButton}>Ver tudo</Text>
            </TouchableOpacity>
          </View>
          <NavigationTabs activeTab={activeTab} onTabPress={setActiveTab} />
          {renderContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    height: 150, // Altura similar ao carrossel
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselLoading: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
    padding: 20,
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  movementsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  movementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  movementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  viewAllButton: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  placeholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    marginTop: 16,
  },
}); 