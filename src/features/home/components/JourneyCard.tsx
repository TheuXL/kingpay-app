// src/features/home/components/JourneyCard.tsx
import { ChevronRight, Trophy } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const JourneyCard = () => {
    // Valores mocados para o design
    const currentAmount = 8974;
    const targetAmount = 10000;
    const progress = (currentAmount / targetAmount) * 100;

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        });
    };

    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.iconTrophyContainer}>
                <Trophy size={24} color="#FFFFFF" />
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>Jornada KingPay</Text>
                <Text style={styles.amountText}>
                    {formatCurrency(currentAmount)} / {formatCurrency(targetAmount)}
                </Text>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>
            </View>
            <ChevronRight size={24} color="#1A1AFF" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginTop: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    iconTrophyContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1313F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    detailsContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    amountText: {
        fontSize: 14,
        color: '#666666',
        marginTop: 2,
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginTop: 8,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#1313F2',
        borderRadius: 4,
    },
});

export default JourneyCard;
