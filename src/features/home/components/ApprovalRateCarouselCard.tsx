// src/features/home/components/ApprovalRateCarouselCard.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ApprovalBar = ({ label, color, percentage }: { label: string; color: string; percentage: number }) => (
    <View style={styles.approvalBarContainer}>
        <View style={styles.approvalLabelContainer}>
            <Text style={styles.approvalLabel}>{label}</Text>
            <Text style={styles.approvalValue}>{percentage.toFixed(1).replace('.', ',')}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
        </View>
    </View>
);

const ApprovalRateCarouselCard = () => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Taxa de aprovação</Text>
            <Text style={styles.totalValue}>92,9%</Text>

            <View style={styles.barsContainer}>
                <ApprovalBar label="Pix" color="#1313F2" percentage={98.6} />
                <ApprovalBar label="Cartão" color="#A020F0" percentage={76.9} />
                <ApprovalBar label="Boleto" color="#2E7D32" percentage={85.2} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 300,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 4,
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 20,
    },
    barsContainer: {
        gap: 16,
    },
    approvalBarContainer: {
        width: '100%',
    },
    approvalLabelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    approvalLabel: {
        fontSize: 14,
        color: '#333333',
    },
    approvalValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
});

export default ApprovalRateCarouselCard;
