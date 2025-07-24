import { usePaymentLinks } from '@/features/paymentLinks/hooks/usePaymentLinks';
import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils/formatters';
import { useRouter } from 'expo-router';
import { Plus, Search } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PaymentLinkItem = ({ item }: { item: any }) => (
    <View style={styles.linkItem}>
        <View>
            <Text style={styles.linkName}>{item.nome}</Text>
            <Text style={styles.linkValue}>{formatCurrency(item.valor)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.ativo ? colors.success : colors.danger }]}>
            <Text style={styles.statusText}>{item.ativo ? 'Ativo' : 'Inativo'}</Text>
        </View>
    </View>
);

export default function PaymentLinksScreen() {
    const router = useRouter();
    const { paymentLinks, isLoading, error } = usePaymentLinks();

    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
    }

    if (error) {
        return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTitle}>Links de Pagamento</Text>
            
            <View style={styles.controlsContainer}>
                <View style={styles.searchContainer}>
                    <Search color={colors.textSecondary} size={20} />
                    <TextInput placeholder="Buscar link..." style={styles.searchInput} />
                </View>
                <TouchableOpacity style={styles.createButton} onPress={() => router.push('/payment-links/create')}>
                    <Plus color={colors.white} size={20} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={paymentLinks}
                renderItem={PaymentLinkItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: colors.danger, fontSize: 16 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, paddingHorizontal: 16, paddingTop: 16, marginBottom: 16 },
    controlsContainer: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, alignItems: 'center' },
    searchContainer: { flexDirection: 'row', flex: 1, alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 12, marginRight: 12 },
    searchInput: { flex: 1, height: 48, paddingLeft: 12, fontSize: 16, color: colors.textPrimary },
    createButton: { backgroundColor: colors.primary, padding: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    list: { paddingHorizontal: 16 },
    linkItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.card, padding: 20, marginBottom: 12, borderRadius: 16 },
    linkName: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
    linkValue: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
    statusText: { color: colors.white, fontSize: 12, fontWeight: 'bold' },
}); 