// src/features/home/components/BalanceCard.tsx
import { ArrowRight, MoreVertical } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BalanceCardProps {
    balance: number;
}

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

const BalanceCard = ({ balance }: BalanceCardProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Saldo disponível</Text>
                <TouchableOpacity>
                    <MoreVertical size={24} color="rgba(255, 255, 255, 0.9)" />
                </TouchableOpacity>
            </View>

            <Text style={styles.balance}>{formatCurrency(balance)}</Text>
            
            <TouchableOpacity style={styles.anticipateButton}>
                <Text style={styles.anticipateButtonText}>Antecipar Saque</Text>
                <ArrowRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1313F2',
        borderRadius: 24,
        padding: 24,
        marginTop: 20,
        shadowColor: '#1313F2',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },
    balance: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 24,
    },
    anticipateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    anticipateButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default BalanceCard;
