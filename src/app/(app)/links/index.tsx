import PaymentLinkItem from '@/features/payment-links/components/PaymentLinkItem';
import { usePaymentLinks } from '@/features/payment-links/hooks/usePaymentLinks';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function PaymentLinksScreen() {
  const router = useRouter();
  const { paymentLinks, isLoading, error, refreshPaymentLinks } = usePaymentLinks();

  const renderContent = () => {
    if (isLoading && paymentLinks.length === 0) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={refreshPaymentLinks}>
            <Text style={styles.retryText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (paymentLinks.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Nenhum link de pagamento encontrado.</Text>
          <Text style={styles.emptySubText}>Crie um novo link no botão abaixo.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={paymentLinks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PaymentLinkItem link={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshPaymentLinks} />
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderContent()}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/links/create')}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  retryText: {
    fontSize: 16,
    color: '#007AFF',
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  list: {
    padding: 10,
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
