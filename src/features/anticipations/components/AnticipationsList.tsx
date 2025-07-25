import { useAnticipations } from '../hooks/useAnticipations';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

const AnticipationCard = ({ item }) => {
    const getStatusColor = (status) => {
        if (status === 'approved') return '#10B981';
        if (status === 'denied') return '#EF4444';
        return '#F59E0B'; // pending
    };

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.amount}>
                    {formatCurrency(item.amount_requested || 0)}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.detailText}>
                    Data: {format(new Date(item.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </Text>
                <Text style={styles.detailText}>
                    Taxa: {formatCurrency(item.fee || 0)}
                </Text>
                 <Text style={styles.detailText}>
                    Líquido: {formatCurrency(item.net_amount || 0)}
                </Text>
            </View>
        </View>
    );
};

export const AnticipationsList = () => {
    const { anticipations, isLoading, error, refetch } = useAnticipations();

    if (isLoading) {
        return <ActivityIndicator style={{ marginTop: 20 }} />;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    if (anticipations.length === 0) {
        return <Text style={styles.emptyText}>Nenhuma antecipação encontrada.</Text>;
    }

    return (
        <FlatList
            data={anticipations}
            renderItem={({ item }) => <AnticipationCard item={item} />}
            keyExtractor={item => item.id}
            style={styles.list}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        marginTop: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    cardBody: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    errorText: {
        textAlign: 'center',
        marginTop: 20,
        color: 'red',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
}); 