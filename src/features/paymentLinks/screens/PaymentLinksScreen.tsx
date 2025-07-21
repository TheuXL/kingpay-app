import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../components/common/Button';
import { useAuth } from '../../../contexts/AppContext';
import { paymentLinkService } from '../services/paymentLinkService';
import { PaymentLink } from '../types';

export default function PaymentLinksScreen() {
  const { user } = useAuth();
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadLinks = useCallback(async () => {
    if (!user?.company_id) return;
    setLoading(true);
    try {
      const response = await paymentLinkService.getPaymentLinks();
      if (response && Array.isArray(response)) {
        setLinks(response);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os links de pagamento.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao buscar os links.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadLinks().finally(() => setRefreshing(false));
  }, [loadLinks]);

  const renderItem = ({ item }: { item: PaymentLink }) => (
    <View style={styles.linkItem}>
      <Text style={styles.linkTitle}>{item.title}</Text>
      <Text>Valor: R$ {item.amount.toFixed(2)}</Text>
      <Text>Status: {item.is_active ? 'Ativo' : 'Inativo'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Criar Novo Link" onPress={() => router.push('/(app)/payment-links/create')} />
      <FlatList
        data={links}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text>Nenhum link de pagamento encontrado.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    linkItem: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginVertical: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    linkTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
