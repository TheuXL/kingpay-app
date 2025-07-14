import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { useWalletStore } from '../../src/store/walletStore';
import { Wallet } from '../../src/types/wallet';

// Define missing interfaces
interface Receivable {
  amount: number;
  due_date: string;
}

interface StatementEntry {
  id: string;
  amount: number;
  description: string;
  type: 'credit' | 'debit';
}

// Extend Wallet interface
interface ExtendedWallet extends Wallet {
  balance: number;
  receivables: Receivable[];
}

const WalletScreen = () => {
  const { user } = useAuth();
  const { wallet, statement, loading, error, fetchWallet, fetchStatement } = useWalletStore();
  
  // Tab management
  const [activeTab, setActiveTab] = useState<'wallet' | 'statement' | 'receivables'>('wallet');

  useEffect(() => {
    if (user?.id) {
      fetchWallet(user.id);
      fetchStatement(user.id);
    }
  }, [user, fetchWallet, fetchStatement]);

  const renderWallet = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>Minha Carteira</Text>
      {loading && !wallet ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Text style={styles.balance}>Saldo: R$ {(wallet as ExtendedWallet)?.balance?.toFixed(2) ?? '0.00'}</Text>
          <View style={styles.buttonContainer}>
              <Button title="Simular Antecipação" onPress={() => {/* TODO: Open modal */}} />
              <Button title="Gerenciar Saldo" onPress={() => {/* TODO: Open modal */}} />
          </View>
        </>
      )}
    </View>
  );

  const renderStatement = () => (
    <View style={styles.contentContainer}>
        <Text style={styles.title}>Extrato</Text>
        <FlatList
            data={statement?.entries ?? []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }: { item: StatementEntry }) => (
                <View style={styles.statementItem}>
                    <Text>{item.description}</Text>
                    <Text style={{ color: item.type === 'credit' ? 'green' : 'red' }}>
                        {item.type === 'credit' ? '+' : '-'} R$ {item.amount.toFixed(2)}
                    </Text>
                </View>
            )}
            ListEmptyComponent={<Text>Nenhuma transação no extrato.</Text>}
        />
    </View>
  );

  const renderReceivables = () => (
    <View style={styles.contentContainer}>
        <Text style={styles.title}>A Receber</Text>
        <FlatList
            data={(wallet as ExtendedWallet)?.receivables ?? []}
            keyExtractor={(item, index) => `${item.due_date}-${index}`}
            renderItem={({ item }: { item: Receivable }) => (
                <View style={styles.receivableItem}>
                    <Text>Valor: R$ {item.amount.toFixed(2)}</Text>
                    <Text>Vencimento: {new Date(item.due_date).toLocaleDateString()}</Text>
                </View>
            )}
            ListEmptyComponent={<Text>Nenhum valor a receber.</Text>}
        />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tabContainer}>
        <Button title="Carteira" onPress={() => setActiveTab('wallet')} disabled={activeTab === 'wallet'}/>
        <Button title="Extrato" onPress={() => setActiveTab('statement')} disabled={activeTab === 'statement'}/>
        <Button title="A Receber" onPress={() => setActiveTab('receivables')} disabled={activeTab === 'receivables'}/>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {activeTab === 'wallet' && renderWallet()}
      {activeTab === 'statement' && renderStatement()}
      {activeTab === 'receivables' && renderReceivables()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  balance: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 10,
  },
  statementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  receivableItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default WalletScreen; 