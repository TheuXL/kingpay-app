// src/features/home/components/TransactionList.tsx
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Transaction {
    id: string;
    description: string;
    amount: number;
    time: string;
    type: 'in' | 'out';
}

interface TransactionListProps {
    transactions: Transaction[];
}

const formatCurrency = (value: number) => {
    return Math.abs(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

const TransactionItem = ({ item }: { item: Transaction }) => {
    const isIncome = item.type === 'in';
    return (
        <View style={styles.itemContainer}>
            <View style={[styles.iconContainer, isIncome ? styles.iconBgIn : styles.iconBgOut]}>
                {isIncome 
                    ? <ArrowDownLeft size={20} color="#00C853" /> 
                    : <ArrowUpRight size={20} color="#D81B60" />
                }
            </View>
            <View style={styles.itemDetails}>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemTime}>{item.time}</Text>
            </View>
            <Text style={[styles.itemAmount, isIncome ? styles.amountIn : styles.amountOut]}>
                {isIncome ? '+' : '-'} {formatCurrency(item.amount)}
            </Text>
        </View>
    );
};

const TransactionList = ({ transactions }: TransactionListProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Últimas transações</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>Ver todas</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={transactions}
                renderItem={({ item }) => <TransactionItem item={item} />}
                keyExtractor={item => item.id}
                scrollEnabled={false} // Para não ter scroll dentro do scroll principal
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1AFF',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconBgIn: {
        backgroundColor: '#E0F8E9',
    },
    iconBgOut: {
        backgroundColor: '#FFE4EE',
    },
    itemDetails: {
        flex: 1,
    },
    itemDescription: {
        fontSize: 16,
        color: '#333333',
        fontWeight: '500',
    },
    itemTime: {
        fontSize: 12,
        color: '#999999',
    },
    itemAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    amountIn: {
        color: '#00C853',
    },
    amountOut: {
        color: '#D81B60',
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginLeft: 52, // para alinhar com os detalhes, não o ícone
    }
});

export default TransactionList;
