import { ChevronDown, ChevronUp, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AnticipationItem {
    id: string;
    amount: string;
    date: string;
    status: 'approved' | 'pending' | 'cancelled';
    fee: string;
    grossValue: string;
    netValue: string;
}

const MOCK_DATA: AnticipationItem[] = [
    { id: '1', amount: 'R$ 3.000,00', date: '18/07/2024', status: 'approved', fee: 'R$ 150,00 (5%)', grossValue: 'R$ 3.150,00', netValue: 'R$ 3.000,00' },
    { id: '2', amount: 'R$ 1.200,00', date: '17/07/2024', status: 'pending', fee: 'R$ 60,00 (5%)', grossValue: 'R$ 1.260,00', netValue: 'R$ 1.200,00' },
    { id: '3', amount: 'R$ 5.500,00', date: '16/07/2024', status: 'cancelled', fee: 'R$ 275,00 (5%)', grossValue: 'R$ 5.775,00', netValue: 'R$ 5.500,00' },
];

const statusStyles = {
    approved: { backgroundColor: '#E6F9F1', textColor: '#19C37D' },
    pending: { backgroundColor: '#FFFBEB', textColor: '#FBBF24' },
    cancelled: { backgroundColor: '#FEF2F2', textColor: '#FF5A5F' },
};

const AnticipationCard = ({ item }: { item: AnticipationItem }) => {
    const [expanded, setExpanded] = useState(false);
    const statusConfig = statusStyles[item.status];
    const statusText = item.status.charAt(0).toUpperCase() + item.status.slice(1);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    }

    return (
        <TouchableOpacity style={styles.card} onPress={toggleExpand}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.cardAmount}>{item.amount}</Text>
                    <Text style={styles.cardDate}>{item.date}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: statusConfig.backgroundColor }]}>
                    <Text style={[styles.badgeText, { color: statusConfig.textColor }]}>{statusText}</Text>
                </View>
                {expanded ? <ChevronUp size={20} color="#6B6B6B" /> : <ChevronDown size={20} color="#6B6B6B" />}
            </View>
            {expanded && (
                <View style={styles.cardDetails}>
                    <Text style={styles.detailText}>Valor Bruto: {item.grossValue}</Text>
                    <Text style={styles.detailText}>Taxa de Antecipação: {item.fee}</Text>
                    <Text style={styles.detailText}>Valor Líquido: {item.netValue}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const AnticipationsList = () => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.newButton}>
                <Plus size={18} color="#FFFFFF" />
                <Text style={styles.newButtonText}>Nova Antecipação</Text>
            </TouchableOpacity>
            
            <FlatList
                data={MOCK_DATA}
                renderItem={({ item }) => <AnticipationCard item={item} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    newButton: {
        backgroundColor: '#1A1AFF',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    newButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
    list: { gap: 12 },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F0F2F5',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardAmount: { fontSize: 16, fontWeight: 'bold', color: '#333333' },
    cardDate: { fontSize: 14, color: '#6B6B6B', marginTop: 4 },
    badge: { borderRadius: 16, paddingVertical: 4, paddingHorizontal: 12, flexGrow: 0, flexShrink: 1, marginHorizontal: 8},
    badgeText: { fontSize: 12, fontWeight: '500' },
    cardDetails: {
        borderTopWidth: 1,
        borderTopColor: '#F0F2F5',
        marginTop: 16,
        paddingTop: 12,
    },
    detailText: {
        fontSize: 14,
        color: '#6B6B6B',
        marginBottom: 4,
    }
});

export default AnticipationsList;
