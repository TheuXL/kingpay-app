import { Plus } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WithdrawalItem {
    id: string;
    amount: string;
    date: string;
    status: 'approved' | 'pending' | 'cancelled';
}

const MOCK_DATA: WithdrawalItem[] = [
    { id: '1', amount: 'R$ 1.500,00', date: '15/07/2024', status: 'approved' },
    { id: '2', amount: 'R$ 800,00', date: '14/07/2024', status: 'approved' },
    { id: '3', amount: 'R$ 2.200,00', date: '13/07/2024', status: 'pending' },
    { id: '4', amount: 'R$ 500,00', date: '12/07/2024', status: 'cancelled' },
];

const statusStyles = {
    approved: {
        backgroundColor: '#E6F9F1',
        textColor: '#19C37D'
    },
    pending: {
        backgroundColor: '#FFFBEB',
        textColor: '#FBBF24'
    },
    cancelled: {
        backgroundColor: '#FEF2F2',
        textColor: '#FF5A5F'
    },
};

const WithdrawalCard = ({ item }: { item: WithdrawalItem }) => {
    const statusConfig = statusStyles[item.status];
    const statusText = item.status.charAt(0).toUpperCase() + item.status.slice(1);

    return (
        <View style={styles.card}>
            <View>
                <Text style={styles.cardAmount}>{item.amount}</Text>
                <Text style={styles.cardDate}>{item.date}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: statusConfig.backgroundColor }]}>
                <Text style={[styles.badgeText, { color: statusConfig.textColor }]}>{statusText}</Text>
            </View>
        </View>
    );
};


const WithdrawalsList = () => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.newButton}>
                <Plus size={18} color="#FFFFFF" />
                <Text style={styles.newButtonText}>Novo Saque</Text>
            </TouchableOpacity>
            
            <FlatList
                data={MOCK_DATA}
                renderItem={({ item }) => <WithdrawalCard item={item} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    newButton: {
        backgroundColor: '#1A1AFF',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    newButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    list: {
        gap: 12,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F2F5',
    },
    cardAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    cardDate: {
        fontSize: 14,
        color: '#6B6B6B',
        marginTop: 4,
    },
    badge: {
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '500',
    }
});

export default WithdrawalsList;
