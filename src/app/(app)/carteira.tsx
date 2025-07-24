import BalanceCarousel from '@/features/financial/components/BalanceCarousel';
import NavigationTabs from '@/features/financial/components/NavigationTabs';
import TransactionList from '@/features/financial/components/TransactionList';
import TransfersList from '@/features/financial/components/TransfersList';
import { colors } from '@/theme/colors';
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

// Placeholder para as listas de Antecipações
const AnticipationsList = () => <View style={styles.placeholder}><Text>Lista de Antecipações</Text></View>;

export default function WalletScreen() {
  const [activeTab, setActiveTab] = useState('extrato');

  // Lógica de dados desativada por enquanto
  const isLoading = false;
  const error = null;

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'extrato':
        return <TransactionList />;
      case 'antecipacoes':
        return <AnticipationsList />;
      case 'transferencias':
        return <TransfersList />;
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
      >
        <BalanceCarousel />
        <View style={styles.movementsSection}>
          <View style={styles.movementsHeader}>
            <Text style={styles.movementsTitle}>Movimentações</Text>
            <Text style={styles.viewAllButton}>Ver tudo</Text>
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
    backgroundColor: '#F5F5F5', // Fundo cinza claro
  },
  centered: {
    flex: 1,
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