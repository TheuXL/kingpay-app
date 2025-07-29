import { ArrowDownLeft, ArrowUpRight, CreditCard, Landmark } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

interface TransactionItem {
    id: string;
    type: 'in' | 'out';
    description: string;
    date: string;
    amount: string;
    method: 'pix' | 'card';
}

const ICONS = {
    in: ArrowDownLeft,
    out: ArrowUpRight,
};

const METHOD_ICONS = {
    pix: Landmark,
    card: CreditCard,
}

const MOCK_DATA: TransactionItem[] = [
    { id: '1', type: 'in', description: 'Venda - E-commerce', date: '20/07/2024', amount: '+ R$ 1.250,50', method: 'card' },
    { id: '2', type: 'out', description: 'Saque para conta', date: '19/07/2024', amount: '- R$ 800,00', method: 'pix' },
    { id: '3', type: 'in', description: 'Venda - Link de Pagamento', date: '19/07/2024', amount: '+ R$ 340,00', method: 'pix' },
    { id: '4', type: 'in', description: 'Venda - Maquininha', date: '18/07/2024', amount: '+ R$ 89,90', method: 'card' },
    { id: '5', type: 'out', description: 'Estorno de venda', date: '17/07/2024', amount: '- R$ 55,00', method: 'card' },
    { id: '6', type: 'in', description: 'Venda - E-commerce', date: '17/07/2024', amount: '+ R$ 1.800,00', method: 'card' },
];

const TransactionItemCard = ({ item, index }: { item: TransactionItem; index: number }) => {
    const TypeIcon = ICONS[item.type];
    const MethodIcon = METHOD_ICONS[item.method];
    const amountColor = item.type === 'in' ? '#19C37D' : '#FF5A5F';
    const backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#F9FAFB';

    return (
        <View style={[styles.card, { backgroundColor }]}>
            <View style={styles.iconContainer}>
                <MethodIcon size={20} color="#1A1AFF" />
            </View>
            <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>{item.description}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <View style={styles.amountContainer}>
                <Text style={[styles.amountText, { color: amountColor }]}>{item.amount}</Text>
                <TypeIcon size={16} color={amountColor} />
            </View>
        </View>
    );
};

const StatementList = () => {
    return (
        <View style={styles.container}>
             <FlatList
                data={MOCK_DATA}
                renderItem={({ item, index }) => <TransactionItemCard item={item} index={index} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
    },
    list: {
        gap: 8,
        paddingHorizontal: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EAF1FB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    descriptionContainer: {
        flex: 1,
    },
    descriptionText: {
        fontSize: 16,
        color: '#333333',
        fontWeight: '500',
    },
    dateText: {
        fontSize: 14,
        color: '#6B6B6B',
        marginTop: 2,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amountText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 4,
    },
});

export default StatementList;
