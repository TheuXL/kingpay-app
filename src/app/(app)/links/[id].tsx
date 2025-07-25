import { getPaymentLinkById, PaymentLink } from '@/features/paymentLinks/services/paymentLinkService';
import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils/formatters';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PaymentLinkDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [link, setLink] = useState<PaymentLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLink = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    const response = await getPaymentLinkById(id);
    if (response.success && response.data) {
      setLink(response.data);
    } else {
      console.error(response.error);
      setLink(null);
    }
    setLoading(false);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchLink();
    setRefreshing(false);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchLink();
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Link</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : !link ? (
          <Text style={styles.errorText}>Não foi possível carregar os detalhes do link.</Text>
        ) : (
          <View style={styles.card}>
            <Text style={styles.linkName}>{link.nome}</Text>
            {link.descricao && <Text style={styles.linkDescription}>{link.descricao}</Text>}
            <Text style={styles.linkValue}>{formatCurrency(link.valor / 100)}</Text>
            <Text style={styles.linkDate}>Criado em: {new Date(link.created_at).toLocaleDateString('pt-BR')}</Text>
            <View style={[styles.badge, link.ativo ? styles.activeBadge : styles.inactiveBadge]}>
                <Text style={link.ativo ? styles.activeText : styles.inactiveText}>{link.ativo ? 'Ativo' : 'Inativo'}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: colors.card },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
  scrollContent: { padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { textAlign: 'center', color: colors.danger },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 12 },
  linkName: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary },
  linkDescription: { fontSize: 16, color: colors.textSecondary, marginVertical: 8 },
  linkValue: { fontSize: 20, fontWeight: 'bold', color: colors.primary, marginVertical: 8 },
  linkDate: { fontSize: 12, color: colors.textSecondary, marginBottom: 12 },
  badge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 16, alignSelf: 'flex-start' },
  activeBadge: { backgroundColor: colors.success },
  inactiveBadge: { backgroundColor: colors.border },
  activeText: { color: colors.white, fontWeight: 'bold' },
  inactiveText: { color: colors.textSecondary, fontWeight: 'bold' },
});
