import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ProgressBar = ({ title, percentage, color }: { title: string, percentage: number, color: string }) => (
    <View style={styles.progressGroup}>
        <View style={styles.progressLabel}>
            <Text style={styles.progressTitle}>{title}</Text>
            <Text style={styles.progressPercentage}>{percentage.toFixed(2)}%</Text>
        </View>
        <View style={styles.progressBar}>
            <View style={[styles.barSegment, { width: `${percentage}%`, backgroundColor: color }]} />
        </View>
    </View>
);

const ApprovalRateCarouselCard = () => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Taxa de Aprovação</Text>
                <Text style={styles.amount}>89.34%</Text>
            </View>

            <View style={styles.detailsContainer}>
                <ProgressBar title="Pix" percentage={89.34} color="#1313F2" />
                <ProgressBar title="Cartão" percentage={72.11} color="#8A38F5" />
                <ProgressBar title="Boleto" percentage={84.50} color="#34C759" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 346,
        height: 301,
        backgroundColor: '#F9FAFC',
        borderRadius: 16,
        padding: 20,
        justifyContent: 'center',
        marginRight: 12,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#5B5B5B',
    },
    amount: {
        fontSize: 24,
        fontWeight: '700',
        color: '#00051B',
        marginTop: 4,
    },
    detailsContainer: {
        // Container para as barras de progresso
    },
    progressGroup: {
        marginBottom: 25,
    },
    progressLabel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    progressTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#5B5B5B',
    },
    progressPercentage: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00051B',
    },
    progressBar: {
        height: 10,
        borderRadius: 219,
        backgroundColor: '#ECECEC',
        overflow: 'hidden',
    },
    barSegment: {
        height: '100%',
    }
});

export default ApprovalRateCarouselCard;
