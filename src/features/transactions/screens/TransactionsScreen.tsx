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
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTransactions } from '../hooks/useTransactions';
import TransactionItem from '../components/TransactionItem';
import { colors } from '@/theme/colors';

const statusFilters = [
    { label: 'Todos', value: undefined },
    { label: 'Aprovado', value: 'paid' },
    { label: 'Pendente', value: 'pending' },
    { label: 'Falhou', value: 'failed' },
];

const TransactionsScreen = () => {
    const {
        transactions,
        loading,
        loadingMore,
        hasMore,
        fetchTransactions,
        fetchMoreTransactions,
        applyFilters,
    } = useTransactions();

    const [activeStatus, setActiveStatus] = useState<string | undefined>(undefined);

    useEffect(() => {
        // Carregamento inicial
        fetchTransactions();
    }, [fetchTransactions]);

    const handleApplyStatusFilter = (status: string | undefined) => {
        setActiveStatus(status);
        applyFilters({ status });
    };
    
    const renderFooter = () => {
        if (!loadingMore) return null;
        return <ActivityIndicator style={{ marginVertical: 20 }} size="small" color={colors.primary} />;
    };

    const renderEmptyComponent = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
                <Text style={styles.emptySubText}>Tente ajustar os filtros ou recarregar a lista.</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Histórico de Transações</Text>
            </View>
            
            <View style={styles.filterContainer}>
                {statusFilters.map(filter => (
                    <TouchableOpacity
                        key={filter.label}
                        style={[
                            styles.filterButton,
                            activeStatus === filter.value && styles.activeFilterButton
                        ]}
                        onPress={() => handleApplyStatusFilter(filter.value)}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            activeStatus === filter.value && styles.activeFilterButtonText
                        ]}>
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TransactionItem item={item} />}
                onEndReached={fetchMoreTransactions}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmptyComponent}
                refreshing={loading}
                onRefresh={fetchTransactions}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.textPrimary,
        textAlign: 'center',
    },
    filterContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: colors.gray[100],
        marginRight: 10,
    },
    activeFilterButton: {
        backgroundColor: colors.primary,
    },
    filterButtonText: {
        fontSize: 14,
        color: colors.primary,
    },
    activeFilterButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.gray[600],
        textAlign: 'center',
    },
    emptySubText: {
        fontSize: 14,
        color: colors.gray[500],
        textAlign: 'center',
        marginTop: 8,
    },
});

export default TransactionsScreen; 